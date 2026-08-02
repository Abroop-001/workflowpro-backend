const salaryService = require("./salaryStructure.service");




// =======================================
// Create Salary Structure
// =======================================

const createSalaryStructure = async (

    req,

    res,

    next

)=>{


    try{


        const salary = await salaryService.createSalaryStructure(

            req.body,

            req.user.company,

            req.user._id

        );





        res.status(201).json({

            success:true,

            message:"Salary structure created successfully",

            data:{

                salary

            }

        });



    }

    catch(error){

        next(error);

    }


};









// =======================================
// Get Employee Salary
// =======================================

const getEmployeeSalary = async (

    req,

    res,

    next

)=>{


    try{


        const salary = await salaryService.getEmployeeSalary(

            req.params.employeeId,

            req.user.company

        );





        res.status(200).json({

            success:true,

            data:{

                salary

            }

        });



    }

    catch(error){

        next(error);

    }


};









// =======================================
// Get Company Salaries
// =======================================

const getCompanySalaryStructures = async (

    req,

    res,

    next

)=>{


    try{


        const salaries = await salaryService.getCompanySalaryStructures(

            req.user.company

        );





        res.status(200).json({
            success:true,
            data:{
                salaries,
                salaryStructures: salaries
            }
        });



    }

    catch(error){

        next(error);

    }


};









// =======================================
// Update Salary
// =======================================

const updateSalaryStructure = async (

    req,

    res,

    next

)=>{


    try{


        const salary = await salaryService.updateSalaryStructure(

            req.params.id,

            req.user.company,

            req.body,

            req.user._id

        );





        res.status(200).json({

            success:true,

            message:"Salary updated successfully",

            data:{

                salary

            }

        });



    }

    catch(error){

        next(error);

    }


};









// =======================================
// Deactivate Salary
// =======================================

const deactivateSalaryStructure = async (

    req,

    res,

    next

)=>{


    try{


        await salaryService.deactivateSalaryStructure(

            req.params.id,

            req.user.company,

            req.user._id

        );





        res.status(200).json({

            success:true,

            message:"Salary structure deactivated"

        });



    }

    catch(error){

        next(error);

    }


};









module.exports = {


    createSalaryStructure,

    getEmployeeSalary,

    getCompanySalaryStructures,

    updateSalaryStructure,

    deactivateSalaryStructure


};