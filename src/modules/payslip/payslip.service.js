const Payslip = require("./payslip.model");

const Payroll = require("../payroll/payroll.model");

const Employee = require("../employee/employee.model");

const AppError = require("../../utils/AppError");

const {
    generatePayslipPDF
} = require("./payslip.utils");


const generatePayslipNumber = ()=>{

    return (
        "PS-" +
        Date.now()
    );

};



const createPayslip = async (

    payrollId,

    companyId,

    userId

)=>{


    const payroll = await Payroll.findOne({

        _id:payrollId,

        company:companyId

    });


    if(!payroll){

        throw new AppError(
            "Payroll record not found",
            404
        );

    }


    if(
        ![
            "PROCESSED",
            "APPROVED",
            "PAID"
        ].includes(payroll.status)
    ){

        throw new AppError(
            "Payroll is not ready for payslip generation",
            400
        );

    }



    const existing = await Payslip.findOne({

        payroll:payrollId

    });


    if(existing){

        throw new AppError(
            "Payslip already generated",
            409
        );

    }



    const employee = await Employee.findById(

        payroll.employee

    );


    if(!employee){

        throw new AppError(
            "Employee not found",
            404
        );

    }



    const payslip = await Payslip.create({

        company:companyId,

        employee:employee._id,

        payroll:payroll._id,

        payslipNumber:
            generatePayslipNumber(),


        month:
            payroll.month,


        year:
            payroll.year,


        salaryDetails:{

            basicSalary:
                payroll.basicSalary,


            allowances:
                payroll.allowances,


            deductions:
                payroll.deductions,


            overtimeAmount:
                payroll.overtime.amount

        },


        grossSalary:
            payroll.grossSalary,


        totalDeduction:
            payroll.totalDeduction,


        netSalary:
            payroll.netSalary,


        createdBy:userId

    });



    const pdfPath = await generatePayslipPDF(

        payslip,

        employee

    );


    payslip.pdfUrl = pdfPath;


    await payslip.save();


    return payslip;

};





const getEmployeePayslips = async (

    employeeId,

    companyId

)=>{


    return await Payslip.find({

        employee:employeeId,

        company:companyId

    })

    .sort({

        year:-1,

        month:-1

    });

};






const getPayslipById = async (

    payslipId,

    companyId,

    currentUser

)=>{


    const payslip = await Payslip.findOne({

        _id:payslipId,

        company:companyId

    })

    .populate(
        "employee"
    )

    .populate(
        "payroll"
    );



    if(!payslip){

        throw new AppError(
            "Payslip not found",
            404
        );

    }



    if(

        currentUser.role==="EMPLOYEE" &&

        String(payslip.employee.user) !==

        String(currentUser._id)

    ){

        throw new AppError(
            "You can only access your own payslip",
            403
        );

    }



    return payslip;

};




module.exports = {

    createPayslip,

    getEmployeePayslips,

    getPayslipById

};