const SalaryStructure = require("./salaryStructure.model");

const Employee = require("../employee/employee.model");

const AppError = require("../../utils/AppError");




// =======================================
// Create Salary Structure
// =======================================

const createSalaryStructure = async (

    data,

    companyId,

    userId

)=>{


    const employee = await Employee.findOne({

        _id:data.employee,

        company:companyId,

        isDeleted:false

    });





    if(!employee){

        throw new AppError(

            "Employee not found",

            404

        );

    }







    const existingSalary = await SalaryStructure.findOne({

        employee:data.employee,

        company:companyId,

        status:"ACTIVE"

    });







    if(existingSalary){

        throw new AppError(

            "Active salary structure already exists for employee",

            409

        );

    }







    const salaryStructure = await SalaryStructure.create({

        ...data,

        company:companyId,

        createdBy:userId

    });







    return salaryStructure;

};









// =======================================
// Get Employee Salary Structure
// =======================================

const getEmployeeSalary = async (

    employeeId,

    companyId

)=>{


    const salary = await SalaryStructure.findOne({

        employee:employeeId,

        company:companyId,

        status:"ACTIVE"

    })

    .populate(

        "employee",

        "employeeId personalInfo jobInfo"

    );







    if(!salary){

        throw new AppError(

            "Salary structure not found",

            404

        );

    }






    return salary;

};









// =======================================
// Get All Company Salaries
// =======================================

const getCompanySalaryStructures = async (

    companyId

)=>{


    return await SalaryStructure.find({

        company:companyId,

        status:"ACTIVE"

    })

    .populate(

        "employee",

        "employeeId personalInfo"

    )

    .sort({

        createdAt:-1

    });

};









// =======================================
// Update Salary Structure
// =======================================

const updateSalaryStructure = async (

    salaryId,

    companyId,

    updateData,

    userId

)=>{


    const salary = await SalaryStructure.findOne({

        _id:salaryId,

        company:companyId,

        status:"ACTIVE"

    });







    if(!salary){

        throw new AppError(

            "Salary structure not found",

            404

        );

    }







    Object.assign(

        salary,

        updateData

    );




    salary.updatedBy=userId;






    await salary.save();







    return salary;

};









// =======================================
// Deactivate Salary Structure
// =======================================

const deactivateSalaryStructure = async (

    salaryId,

    companyId,

    userId

)=>{


    const salary = await SalaryStructure.findOne({

        _id:salaryId,

        company:companyId

    });







    if(!salary){

        throw new AppError(

            "Salary structure not found",

            404

        );

    }







    salary.status="INACTIVE";


    salary.updatedBy=userId;





    await salary.save();







    return true;

};









module.exports = {


    createSalaryStructure,

    getEmployeeSalary,

    getCompanySalaryStructures,

    updateSalaryStructure,

    deactivateSalaryStructure


};