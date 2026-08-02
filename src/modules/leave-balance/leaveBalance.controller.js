const leaveBalanceService = require("./leaveBalance.service");


const createLeaveBalance = async(req,res,next)=>{

    try{

        const balance =
            await leaveBalanceService.createLeaveBalance(
                req.body,
                req.user
            );

        res.status(201).json({
            success:true,
            message:"Leave balance created successfully",
            data:{balance}
        });

    }catch(error){
        next(error);
    }
};


const getEmployeeLeaveBalance = async(req,res,next)=>{

    try{

        const balance =
            await leaveBalanceService.getEmployeeLeaveBalance(
                req.params.employeeId,
                req.user,
                req.query.year
            );

        res.status(200).json({
            success:true,
            data:{balance}
        });

    }catch(error){
        next(error);
    }
};


const getMyLeaveBalance = async(req,res,next)=>{

    try{

        const balance =
            await leaveBalanceService.getMyLeaveBalance(
                req.user,
                req.query.year
            );

        res.status(200).json({
            success:true,
            data:{balance}
        });

    }catch(error){
        next(error);
    }
};


const updateAllocation = async(req,res,next)=>{

    try{

        const balance =
            await leaveBalanceService.updateAllocation(
                req.params.employeeId,
                req.body,
                req.user
            );

        res.status(200).json({
            success:true,
            message:"Leave allocation updated successfully",
            data:{balance}
        });

    }catch(error){
        next(error);
    }
};


module.exports={
    createLeaveBalance,
    getEmployeeLeaveBalance,
    getMyLeaveBalance,
    updateAllocation
};