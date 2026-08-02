const payslipService = require("./payslip.service");




// Generate Payslip

const createPayslip = async (
    req,
    res,
    next
)=>{

    try{

        const payslip = await payslipService.createPayslip(
            req.body.payrollId,
            req.user.company,
            req.user._id
        );


        res.status(201).json({

            success:true,

            message:"Payslip generated successfully",

            data:{
                payslip
            }

        });

    }
    catch(error){

        next(error);

    }

};




// Get Employee Payslips

const getEmployeePayslips = async (
    req,
    res,
    next
)=>{

    try{

        const payslips = await payslipService.getEmployeePayslips(
            req.params.employeeId,
            req.user.company
        );


        res.status(200).json({

            success:true,

            results:payslips.length,

            data:{
                payslips
            }

        });

    }
    catch(error){

        next(error);

    }

};




// Get Payslip Details

const getPayslipById = async (
    req,
    res,
    next
)=>{

    try{

        const payslip = await payslipService.getPayslipById(
            req.params.id,
            req.user.company,
            req.user
        );


        res.status(200).json({

            success:true,

            data:{
                payslip
            }

        });

    }
    catch(error){

        next(error);

    }

};



module.exports = {

    createPayslip,

    getEmployeePayslips,

    getPayslipById

};