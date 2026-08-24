const shiftService = require("./shift.service");
const { logAction } = require("../../utils/auditLogger");

const createShift = async(req,res,next)=>{
    try{
        const shift = await shiftService.createShift(
            req.body,
            req.user
        );

        await logAction(req, {
            action: "CREATE",
            module: "SHIFT",
            description: `Created shift schedule: ${shift.name} (${shift.startTime} - ${shift.endTime})`,
            targetId: shift._id,
            newData: req.body
        });

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

        await logAction(req, {
            action: "UPDATE",
            module: "SHIFT",
            description: `Updated shift schedule: ${shift.name}`,
            targetId: shift._id,
            newData: req.body
        });

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

        await logAction(req, {
            action: "DELETE",
            module: "SHIFT",
            description: `Deactivated shift schedule: ${shift.name}`,
            targetId: shift._id
        });

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
        await logAction(req, {
            action: "DELETE",
            module: "SHIFT",
            description: `Deleted shift ID: ${req.params.id}`
        });

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