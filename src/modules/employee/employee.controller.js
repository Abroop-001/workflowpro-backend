const employeeService = require("./employee.service");
const { logAction } = require("../../utils/auditLogger");

const createEmployee = async(req,res,next)=>{
    try{
        const { employee, temporaryPassword } = await employeeService.createEmployee(
            req.body,
            req.user
        );

        await logAction(req, {
            action: "CREATE",
            module: "EMPLOYEE",
            description: `Created employee: ${employee.personalInfo.firstName} ${employee.personalInfo.lastName || ""}`,
            targetId: employee._id,
            newData: req.body
        });

        res.status(201).json({
            success:true,
            message:"Employee created successfully",
            data:{employee, temporaryPassword}
        });

    }catch(error){
        next(error);
    }
};


const getEmployees = async(req,res,next)=>{
    try{
        const employees = await employeeService.getCompanyEmployees(
            req.user,
            req.query
        );

        res.status(200).json({
            success:true,
            data:{employees}
        });

    }catch(error){
        next(error);
    }
};


const getEmployee = async(req,res,next)=>{
    try{
        const employee = await employeeService.getEmployeeById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            data:{employee}
        });

    }catch(error){
        next(error);
    }
};


const updateEmployee = async(req,res,next)=>{
    try{
        const employee = await employeeService.updateEmployee(
            req.params.id,
            req.body,
            req.user
        );

        await logAction(req, {
            action: "UPDATE",
            module: "EMPLOYEE",
            description: `Updated employee: ${employee.personalInfo.firstName} ${employee.personalInfo.lastName || ""}`,
            targetId: employee._id,
            newData: req.body
        });

        res.status(200).json({
            success:true,
            message:"Employee updated successfully",
            data:{employee}
        });

    }catch(error){
        next(error);
    }
};


const deactivateEmployee = async(req,res,next)=>{
    try{
        const employee = await employeeService.deactivateEmployee(
            req.params.id,
            req.user
        );

        await logAction(req, {
            action: "DELETE",
            module: "EMPLOYEE",
            description: `Deactivated employee: ${employee.personalInfo.firstName} ${employee.personalInfo.lastName || ""}`,
            targetId: employee._id
        });

        res.status(200).json({
            success:true,
            message:"Employee deactivated successfully",
            data:{employee}
        });

    }catch(error){
        next(error);
    }
};


module.exports={
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deactivateEmployee
};