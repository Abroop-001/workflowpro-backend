const Payroll = require("./payroll.model");
const SalaryStructure = require("./salaryStructure.model");
const Attendance = require("../attendance/attendance.model");
const Employee = require("../employee/employee.model");
const Department = require("../department/department.model");
const notificationService = require("../notification/notification.service");
const AppError = require("../../utils/AppError");


const getDaysInMonth = (month, year) =>
    new Date(year, month, 0).getDate();


const getManagedDepartmentIds = async(userId, companyId)=>{

    const managerEmployee = await Employee.findOne({
        user:userId,
        company:companyId,
        isDeleted:false
    });

    if(!managerEmployee)
        return [];


    const departments = await Department.find({
        manager:managerEmployee._id,
        company:companyId,
        isDeleted:false
    }).select("_id");


    return departments.map(
        d=>d._id.toString()
    );
};



const checkManagerAccess = async(
    employeeId,
    user
)=>{

    if(user.role !== "MANAGER")
        return;


    const employee = await Employee.findOne({
        _id:employeeId,
        company:user.company,
        isDeleted:false
    });


    if(!employee)
        throw new AppError(
            "Employee not found",
            404
        );


    const departmentIds =
        await getManagedDepartmentIds(
            user.id,
            user.company
        );


    if(
        !employee.department ||
        !departmentIds.includes(
            employee.department.toString()
        )
    ){

        throw new AppError(
            "Unauthorized access to this employee payroll",
            403
        );

    }

};



const generatePayroll = async(
    data,
    companyId,
    userId
)=>{

    const {
        employee,
        month,
        year
    } = data;


    const existing =
        await Payroll.findOne({
            employee,
            company:companyId,
            month,
            year
        });


    if(existing)
        throw new AppError(
            "Payroll already generated for this month",
            409
        );


    const employeeData =
        await Employee.findOne({
            _id:employee,
            company:companyId,
            isDeleted:false
        });


    if(!employeeData)
        throw new AppError(
            "Employee not found",
            404
        );


    const salary =
        await SalaryStructure.findOne({
            employee,
            company:companyId,
            status:"ACTIVE"
        });


    if(!salary)
        throw new AppError(
            "Salary structure not found",
            404
        );



    const attendance =
        await Attendance.find({
            employee,
            company:companyId,
            date:{
                $gte:new Date(year,month-1,1),
                $lte:new Date(year,month,0,23,59,59)
            }
        });



    let presentDays=0;
    let absentDays=0;
    let leaveDays=0;
    let overtimeHours=0;


    attendance.forEach(a=>{

        if(a.status==="PRESENT")
            presentDays++;

        if(a.status==="ABSENT")
            absentDays++;

        if(a.status==="LEAVE")
            leaveDays++;

        overtimeHours += a.overtimeHours || 0;

    });



    const totalWorkingDays =
        getDaysInMonth(
            month,
            year
        );


    const allowanceTotal =
        Object.values(
            salary.allowances
        )
        .reduce(
            (a,b)=>a+b,
            0
        );


    const grossSalary =
        salary.basicSalary +
        allowanceTotal;



    const perDaySalary =
        grossSalary /
        totalWorkingDays;



    const absentDeduction =
        Number(
            (
                perDaySalary *
                absentDays
            ).toFixed(2)
        );



    const overtimeAmount =
        Number(
            (
                overtimeHours *
                salary.overtimeRatePerHour
            ).toFixed(2)
        );



    const totalDeduction =
        salary.deductions.tax +
        salary.deductions.providentFund +
        salary.deductions.insurance +
        salary.deductions.otherDeduction +
        absentDeduction;



    const netSalary =
        grossSalary +
        overtimeAmount -
        totalDeduction;



    const payroll =
        await Payroll.create({

            company:companyId,

            employee,

            month,

            year,

            basicSalary:salary.basicSalary,

            allowances:salary.allowances,

            attendance:{
                totalWorkingDays,
                presentDays,
                absentDays,
                leaveDays
            },

            overtime:{
                hours:overtimeHours,
                amount:overtimeAmount
            },

            deductions:{
                ...salary.deductions,
                absentDeduction
            },

            grossSalary,

            totalDeduction,

            netSalary,

            status:"PROCESSED",

            createdBy:userId

        });



    if(employeeData.user){

        try{

            await notificationService.sendNotification(
                {
                    user:employeeData.user,
                    type:"PAYROLL",
                    priority:"HIGH",
                    title:"Payroll Generated",
                    message:
                    `Your payroll for ${month}/${year} is processed.`,
                    reference:{
                        module:"PAYROLL",
                        id:payroll._id
                    }
                },
                companyId,
                userId
            );

        }catch{}

    }


    return payroll;

};



const getEmployeePayrollHistory =
async(
    employeeId,
    companyId,
    currentUser
)=>{

    await checkManagerAccess(
        employeeId,
        currentUser
    );


    return Payroll.find({
        employee:employeeId,
        company:companyId
    })
    .sort({
        year:-1,
        month:-1
    });

};



const getPayrollById =
async(
    id,
    companyId,
    currentUser
)=>{


    const payroll =
        await Payroll.findOne({
            _id:id,
            company:companyId
        })
        .populate("employee");


    if(!payroll)
        throw new AppError(
            "Payroll record not found",
            404
        );



    if(currentUser.role==="EMPLOYEE"){

        if(
            String(payroll.employee.user)
            !==
            String(currentUser.id || currentUser._id)
        ){

            throw new AppError(
                "You can only access your own payroll",
                403
            );

        }

    }



    if(currentUser.role==="MANAGER"){

        await checkManagerAccess(
            payroll.employee._id,
            currentUser
        );

    }


    return payroll;

};



const getCompanyPayroll =
async(
    user,
    month,
    year
)=>{


    const query={
        company:user.company
    };


    if(month)
        query.month=Number(month);


    if(year)
        query.year=Number(year);



    return Payroll.find(query)
        .populate("employee")
        .sort({
            year:-1,
            month:-1
        });

};



const approvePayroll =
async(
    id,
    companyId,
    userId
)=>{

    const payroll =
        await Payroll.findOne({
            _id:id,
            company:companyId
        });


    if(!payroll)
        throw new AppError(
            "Payroll record not found",
            404
        );


    if(
        payroll.status!=="PROCESSED" &&
        payroll.status!=="DRAFT"
    )
        throw new AppError(
            "Payroll cannot be approved",
            400
        );


    payroll.status="APPROVED";
    payroll.approvedBy=userId;


    return payroll.save();

};



const markPayrollPaid =
async(
    id,
    data,
    companyId,
    userId
)=>{

    const payroll =
        await Payroll.findOne({
            _id:id,
            company:companyId
        });


    if(!payroll)
        throw new AppError(
            "Payroll record not found",
            404
        );


    if(payroll.status!=="APPROVED")
        throw new AppError(
            "Payroll must be approved before payment",
            400
        );


    payroll.status="PAID";
    payroll.paymentDate =
        data.paymentDate || new Date();

    payroll.paymentReference =
        data.paymentReference || null;

    payroll.paidBy=userId;


    return payroll.save();

};



const cancelPayroll =
async(
    id,
    companyId
)=>{

    const payroll =
        await Payroll.findOne({
            _id:id,
            company:companyId
        });


    if(!payroll)
        throw new AppError(
            "Payroll record not found",
            404
        );


    if(payroll.status==="PAID")
        throw new AppError(
            "Paid payroll cannot be cancelled",
            400
        );
    payroll.status="CANCELLED";
    return payroll.save();

};

module.exports={
    generatePayroll,
    createPayroll:generatePayroll,
    getEmployeePayrollHistory,
    getPayrollById,
    getCompanyPayroll,
    approvePayroll,
    markPayrollPaid,
    cancelPayroll
};