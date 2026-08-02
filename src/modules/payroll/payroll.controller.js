const payrollService = require("./payroll.service");

const createPayroll = async (req,res,next)=>{
    try{
        const payroll = await payrollService.createPayroll(
            req.body,
            req.user.company,
            req.user.id
        );

        res.status(201).json({
            success:true,
            message:"Payroll generated successfully",
            data:{payroll}
        });
    }catch(error){
        next(error);
    }
};

const getEmployeePayrollHistory = async(req,res,next)=>{
    try{
        const payrolls = await payrollService.getEmployeePayrollHistory(
            req.params.employeeId,
            req.user.company,
            req.user
        );

        res.json({
            success:true,
            results:payrolls.length,
            data:{payrolls}
        });
    }catch(error){
        next(error);
    }
};

const getPayrollById = async(req,res,next)=>{
    try{
        const payroll = await payrollService.getPayrollById(
            req.params.id,
            req.user.company,
            req.user
        );

        res.json({
            success:true,
            data:{payroll}
        });
    }catch(error){
        next(error);
    }
};

const getCompanyPayroll = async(req,res,next)=>{
    try{
        const payrolls = await payrollService.getCompanyPayroll(
            req.user,
            req.query.month,
            req.query.year
        );

        res.json({
            success:true,
            results:payrolls.length,
            data:{payrolls}
        });
    }catch(error){
        next(error);
    }
};

const approvePayroll = async(req,res,next)=>{
    try{
        const payroll = await payrollService.approvePayroll(
            req.params.id,
            req.user.company,
            req.user.id
        );

        res.json({
            success:true,
            message:"Payroll approved successfully",
            data:{payroll}
        });
    }catch(error){
        next(error);
    }
};

const markPayrollPaid = async(req,res,next)=>{
    try{
        const payroll = await payrollService.markPayrollPaid(
            req.params.id,
            req.body,
            req.user.company,
            req.user.id
        );

        res.json({
            success:true,
            message:"Payroll marked as paid",
            data:{payroll}
        });
    }catch(error){
        next(error);
    }
};

const cancelPayroll = async(req,res,next)=>{
    try{
        const payroll = await payrollService.cancelPayroll(
            req.params.id,
            req.user.company,
            req.user.id
        );

        res.json({
            success:true,
            message:"Payroll cancelled successfully",
            data:{payroll}
        });
    }catch(error){
        next(error);
    }
};

module.exports={
    createPayroll,
    getEmployeePayrollHistory,
    getPayrollById,
    getCompanyPayroll,
    approvePayroll,
    markPayrollPaid,
    cancelPayroll
};