const departmentService = require("./department.service");

const createDepartment = async(req,res,next)=>{
    try{
        const department = await departmentService.createDepartment(
            req.body,
            req.user
        );

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