const departmentService = require("./department.service");
const { logAction } = require("../../utils/auditLogger");

const createDepartment = async(req,res,next)=>{
    try{
        const department = await departmentService.createDepartment(
            req.body,
            req.user
        );

        await logAction(req, {
            action: "CREATE",
            module: "DEPARTMENT",
            description: `Created department: ${department.name}`,
            targetId: department._id,
            newData: req.body
        });

        res.status(201).json({
            success:true,
            message:"Department created successfully",
            data:{department}
        });

    }catch(error){
        next(error);
    }
};


const getDepartments = async(req,res,next)=>{
    try{
        const departments = await departmentService.getDepartments(
            req.user
        );

        res.status(200).json({
            success:true,
            data:{departments}
        });

    }catch(error){
        next(error);
    }
};


const getDepartment = async(req,res,next)=>{
    try{
        const department = await departmentService.getDepartmentById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            data:{department}
        });

    }catch(error){
        next(error);
    }
};


const updateDepartment = async(req,res,next)=>{
    try{
        const department = await departmentService.updateDepartment(
            req.params.id,
            req.body,
            req.user
        );

        await logAction(req, {
            action: "UPDATE",
            module: "DEPARTMENT",
            description: `Updated department: ${department.name}`,
            targetId: department._id,
            newData: req.body
        });

        res.status(200).json({
            success:true,
            message:"Department updated successfully",
            data:{department}
        });

    }catch(error){
        next(error);
    }
};


const deactivateDepartment = async(req,res,next)=>{
    try{
        const department = await departmentService.deactivateDepartment(
            req.params.id,
            req.user
        );

        await logAction(req, {
            action: "DELETE",
            module: "DEPARTMENT",
            description: `Deactivated department: ${department.name}`,
            targetId: department._id
        });

        res.status(200).json({
            success:true,
            message:"Department deactivated successfully",
            data:{department}
        });

    }catch(error){
        next(error);
    }
};


const getDepartmentDetails = async(req,res,next)=>{
    try{
        const data = await departmentService.getDepartmentDetails(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            data
        });

    }catch(error){
        next(error);
    }
};


module.exports={
    createDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deactivateDepartment,
    getDepartmentDetails
};