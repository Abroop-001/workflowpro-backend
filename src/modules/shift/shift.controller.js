const shiftService = require("./shift.service");

const createShift = async(req,res,next)=>{
    try{
        const shift = await shiftService.createShift(
            req.body,
            req.user
        );

        res.status(201).json({
            success:true,
            message:"Shift created successfully",
            data:{shift}
        });

    }catch(error){
        next(error);
    }
};


const getCompanyShifts = async(req,res,next)=>{
    try{
        const shifts = await shiftService.getCompanyShifts(
            req.user
        );

        res.status(200).json({
            success:true,
            data:{shifts}
        });

    }catch(error){
        next(error);
    }
};


const getShiftById = async(req,res,next)=>{
    try{
        const shift = await shiftService.getShiftById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            data:{shift}
        });

    }catch(error){
        next(error);
    }
};


const updateShift = async(req,res,next)=>{
    try{
        const shift = await shiftService.updateShift(
            req.params.id,
            req.body,
            req.user
        );

        res.status(200).json({
            success:true,
            message:"Shift updated successfully",
            data:{shift}
        });

    }catch(error){
        next(error);
    }
};


const deactivateShift = async(req,res,next)=>{
    try{
        const shift = await shiftService.deactivateShift(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            message:"Shift deactivated successfully",
            data:{shift}
        });

    }catch(error){
        next(error);
    }
};


const deleteShift = async(req,res,next)=>{
    try{
        await shiftService.deleteShift(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            message:"Shift deleted successfully"
        });

    }catch(error){
        next(error);
    }
};


module.exports={
    createShift,
    getCompanyShifts,
    getShiftById,
    updateShift,
    deactivateShift,
    deleteShift
};