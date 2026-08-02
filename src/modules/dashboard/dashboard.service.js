const Employee = require("../employee/employee.model");
const Attendance = require("../attendance/attendance.model");
const Leave = require("../leave/leave.model");
const Payroll = require("../payroll/payroll.model");


const getDashboardStats = async (companyId) => {

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);


    const [
        totalActiveEmployees,
        totalEmployees,
        presentToday,
        absentToday,
        onLeaveToday,
        pendingLeavesCount,
        latestPayrolls
    ] = await Promise.all([

        Employee.countDocuments({
            company:companyId,
            status:"ACTIVE",
            isDeleted:false
        }),


        Employee.countDocuments({
            company:companyId,
            isDeleted:false
        }),


        Attendance.countDocuments({
            company:companyId,
            date:{
                $gte:todayStart,
                $lte:todayEnd
            },
            status:"PRESENT"
        }),


        Attendance.countDocuments({
            company:companyId,
            date:{
                $gte:todayStart,
                $lte:todayEnd
            },
            status:"ABSENT"
        }),


        Attendance.countDocuments({
            company:companyId,
            date:{
                $gte:todayStart,
                $lte:todayEnd
            },
            status:"LEAVE"
        }),


        Leave.countDocuments({
            company:companyId,
            status:"PENDING"
        }),


        Payroll.find({
            company:companyId
        })
        .sort({
            year:-1,
            month:-1
        })
        .limit(10)

    ]);


    const latestPayrollTotal =
        latestPayrolls.reduce(
            (sum,p)=>sum+(p.netSalary||0),
            0
        );


    return {

        employeeCounts:{
            active:totalActiveEmployees,
            total:totalEmployees
        },


        attendanceSummary:{
            presentToday,
            absentToday,
            onLeaveToday
        },


        pendingLeaves:
            pendingLeavesCount,


        payrollSummary:{
            latestProcessedCount:
                latestPayrolls.length,

            latestNetSalaryTotal:
                latestPayrollTotal
        }

    };

};


module.exports={
    getDashboardStats
};