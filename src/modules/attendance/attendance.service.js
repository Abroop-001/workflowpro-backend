const Attendance = require("./attendance.model");
const Employee = require("../employee/employee.model");
const User = require("../auth/auth.model");
const notificationService = require("../notification/notification.service");
const AppError = require("../../utils/AppError");
const Department = require("../department/department.model");

const getDateKey = (date, employeeId) => {
    const d = new Date(date);

    const dateString =
        `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

    return `${dateString}_${employeeId}`;
};

const getEmployeeId = async(data,currentUser)=>{

    if(currentUser.role==="EMPLOYEE"){

        const employee=await Employee.findOne({
            user:currentUser.id,
            company:currentUser.company,
            isDeleted:false
        });

        return employee?._id;
    }

    return data.employee;
};

const calculateOvertime = (
    employee,
    workingHours
) => {

    if(
        !employee.jobInfo ||
        !employee.jobInfo.shift
    ){
        return 0;
    }

    const requiredHours =
        employee.jobInfo.shift.workingHours || 8;

    if(workingHours <= requiredHours){
        return 0;
    }

    return Number(
        (workingHours - requiredHours)
        .toFixed(2)
    );
};

const notifyAttendanceUsers = async(
    companyId,
    title,
    message,
    referenceId,
    createdBy,
    roles=[]
)=>{
    try{

        const users =
            await User.find({
                company:companyId,
                role:{
                    $in:roles
                },
                status:"ACTIVE",
                isDeleted:false
            })
            .select("_id");


        for(const user of users){

            await notificationService.sendNotification(
                {
                    user:user._id,
                    type:"ATTENDANCE",
                    priority:"MEDIUM",
                    title,
                    message,
                    reference:{
                        module:"ATTENDANCE",
                        id:referenceId
                    }
                },
                companyId,
                createdBy
            );
        }

    }catch(error){

        console.error(
            "Attendance notification failed:",
            error.message
        );

    }
};


const checkIn = async(
    data,
    currentUser
)=>{

    const companyId=currentUser.company;
    const userId=currentUser.id;

    const employeeId =
    await    getEmployeeId(
            data,
            currentUser
        );


    if(!employeeId){
        throw new AppError(
            "Employee is required",
            400
        );
    }


    const employee =
        await Employee.findOne({
            _id:employeeId,
            company:companyId,
            isDeleted:false,
            status:"ACTIVE"
        })
        .populate(
            "jobInfo.shift"
        );


    if(!employee){
        throw new AppError(
            "Employee not found",
            404
        );
    }


    const dateKey =
        getDateKey(
            new Date(),
            employee._id
        );


    const existing =
        await Attendance.findOne({
            employee:employee._id,
            dateKey
        });


    if(existing){
        throw new AppError(
            "Attendance already marked for today",
            409
        );
    }


    const attendance =
        await Attendance.create({
            company:companyId,
            employee:employee._id,
            date:new Date(),
            dateKey,
            checkIn:new Date(),
            remarks:data.remarks,
            status:"PRESENT",
            createdBy:userId
        });


    if(
        employee.jobInfo &&
        employee.jobInfo.shift &&
        employee.jobInfo.shift.startTime
    ){

        const current=new Date();


        const [
            hours,
            minutes
        ] =
        employee.jobInfo.shift.startTime.split(":");


        const shiftStart=new Date();


        shiftStart.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );


        if(current > shiftStart){

            await notifyAttendanceUsers(
                companyId,
                "Late Check In",
                `${employee.personalInfo.firstName} checked in late.`,
                attendance._id,
                userId,
                [
                    "HR",
                    "COMPANY_ADMIN",
                    "MANAGER"
                ]
            );
        }
    }


    return attendance;
};


const checkOut = async(
    attendanceId,
    currentUser
)=>{

   const attendance =
    await Attendance.findOne({
        _id:attendanceId,
        company:currentUser.company
    });


if(!attendance){

    throw new AppError(
        "Attendance not found",
        404
    );

}


if(currentUser.role==="EMPLOYEE"){

    const employee=await Employee.findOne({
        user:currentUser.id,
        company:currentUser.company,
        isDeleted:false
    });


    if(
        !employee ||
        attendance.employee.toString() !== employee._id.toString()
    ){

        throw new AppError(
            "You can only checkout your own attendance",
            403
        );

    }

}

    if(attendance.checkOut){

        throw new AppError(
            "Attendance already checked out",
            400
        );

    }


    const employee =
        await Employee.findById(
            attendance.employee
        )
        .populate(
            "jobInfo.shift"
        );


    const now=new Date();


    const workingHours =
        Number(
            (
                (now - attendance.checkIn)
                /(1000*60*60)
            )
            .toFixed(2)
        );


    attendance.checkOut=now;

    attendance.workingHours=
        workingHours;

    attendance.overtimeHours=
        calculateOvertime(
            employee,
            workingHours
        );


    await attendance.save();


    if(attendance.overtimeHours > 0){

        await notifyAttendanceUsers(
            currentUser.company,
            "Overtime Recorded",
            `${employee.personalInfo.firstName} completed ${attendance.overtimeHours} overtime hours.`,
            attendance._id,
            currentUser.id,
            [
                "HR",
                "COMPANY_ADMIN"
            ]
        );

    }


    return attendance;
};


const getMonthlySummary = async(
    employeeId,
    companyId,
    month,
    year
)=>{

    const startDate =
        new Date(
            year,
            month-1,
            1
        );


    const endDate =
        new Date(
            year,
            month,
            0,
            23,
            59,
            59
        );


    const records =
        await Attendance.find({
            employee:employeeId,
            company:companyId,
            date:{
                $gte:startDate,
                $lte:endDate
            }
        });


    const summary={
        totalDays:records.length,
        present:0,
        absent:0,
        leave:0,
        overtimeHours:0
    };


    records.forEach(record=>{

        if(record.status==="PRESENT"){
            summary.present++;
        }

        if(record.status==="ABSENT"){
            summary.absent++;
        }

        if(record.status==="LEAVE"){
            summary.leave++;
        }

        summary.overtimeHours +=
            record.overtimeHours || 0;

    });


    return summary;
};


const createLeaveAttendance = async(
    employeeId,
    companyId,
    startDate,
    endDate,
    session=null
)=>{

    const records=[];

    let current =
        new Date(startDate);


    const end =
        new Date(endDate);


    while(current <= end){

        const dateKey =
            getDateKey(
                current,
                employeeId
            );


        const existing =
            await Attendance.findOne({
                employee:employeeId,
                dateKey
            })
            .session(session);


        if(existing){

            existing.status="LEAVE";

            await existing.save(
                session
                ? {session}
                : {}
            );

            records.push(existing);

        }else{
            const created =
                await Attendance.create(
                    [
                        {
                            company:companyId,
                            employee:employeeId,
                            date:new Date(current),
                            dateKey,
                            status:"LEAVE"
                        }
                    ],
                    session
                    ? {session}
                    : {}
                );
            records.push(created[0]);
        }
        current.setDate(current.getDate() + 1);
    }
    return records;
};

const getTodayAttendance = async (currentUser) => {
    const employeeId = await getEmployeeId({}, currentUser);
    if (!employeeId) return null;

    const dateKey = getDateKey(new Date(), employeeId);
    return Attendance.findOne({
        employee: employeeId,
        dateKey
    }).populate("employee");
};

const getEmployeeAttendance = async (employeeId, currentUser) => {
    const companyId = currentUser.company;
    const employee = await Employee.findOne({
        _id: employeeId,
        company: companyId,
        isDeleted: false
    });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    if (currentUser.role === "MANAGER") {
        const deptIds = await getManagedDepartmentIds(currentUser.id, companyId);
        if (!employee.department || !deptIds.includes(employee.department.toString())) {
            throw new AppError("Unauthorized access to team member's attendance", 403);
        }
    }

    return Attendance.find({
        employee: employeeId,
        company: companyId
    }).sort({ date: -1 });
};

const getManagedDepartmentIds = async (userId, companyId) => {
    const managerEmployee = await Employee.findOne({
        user: userId,
        company: companyId,
        isDeleted: false
    });
    if (!managerEmployee) return [];

    const departments = await Department.find({
        manager: managerEmployee._id,
        company: companyId,
        isDeleted: false
    }).select("_id");

    return departments.map(d => d._id.toString());
};

const getAttendances = async (query = {}, currentUser) => {
    const companyId = currentUser.company;
    const filters = { company: companyId };

    if (currentUser.role === "MANAGER") {
        const deptIds = await getManagedDepartmentIds(currentUser.id, companyId);
        const teamEmployees = await Employee.find({
            department: { $in: deptIds },
            company: companyId,
            isDeleted: false
        }).select("_id");
        const employeeIds = teamEmployees.map(e => e._id);
        filters.employee = { $in: employeeIds };
    }

    if (query.status) {
        filters.status = query.status;
    }

    if (query.startDate && query.endDate) {
        filters.date = {
            $gte: new Date(query.startDate),
            $lte: new Date(query.endDate)
        };
    } else if (query.date) {
        const start = new Date(query.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(query.date);
        end.setHours(23, 59, 59, 999);
        filters.date = { $gte: start, $lte: end };
    }

    if (query.employeeId) {
        filters.employee = query.employeeId;
    }

    return Attendance.find(filters)
        .populate("employee")
        .sort({ date: -1 });
};

module.exports = {
    checkIn,
    checkOut,
    getTodayAttendance,
    getEmployeeAttendance,
    getAttendances,
    getMonthlySummary,
    createLeaveAttendance
};