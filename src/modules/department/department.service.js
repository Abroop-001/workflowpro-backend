const Department = require("./department.model");
const Employee = require("../employee/employee.model");
const AppError = require("../../utils/AppError");


const createDepartment = async(
    departmentData,
    currentUser
)=>{

    const companyId=currentUser.company;

    const existingDepartment = await Department.findOne({
        company:companyId,
        isDeleted:false,
        $or:[
            {
                name:departmentData.name
            },
            {
                departmentCode:departmentData.departmentCode
            }
        ]
    });

    if(existingDepartment){
        throw new AppError(
            "Department name or code already exists",
            409
        );
    }

    return await Department.create({
        ...departmentData,
        company:companyId,
        createdBy:currentUser.id
    });
};

const getDepartments = async(currentUser)=>{
    return await Department.find({
        company:currentUser.company,
        isDeleted:false,
        status:"ACTIVE"
    })
    .populate(
        "manager",
        "employeeId personalInfo jobInfo"
    )
    .sort({
        createdAt:-1
    });
};

const getDepartmentById = async(
    departmentId,
    currentUser
)=>{
    const department = await Department.findOne({
        _id:departmentId,
        company:currentUser.company,
        isDeleted:false
    })
    .populate(
        "manager",
        "employeeId personalInfo jobInfo"
    );

    if(!department){
        throw new AppError(
            "Department not found",
            404
        );
    }

    return department;
};

const updateDepartment = async(
    departmentId,
    updateData,
    currentUser
)=>{
    const companyId = currentUser.company;

    delete updateData.company;
    delete updateData.createdBy;


    if(updateData.manager){

        const manager = await Employee.findOne({
            _id:updateData.manager,
            company:companyId,
            isDeleted:false,
            status:"ACTIVE"
        });

        if(!manager){
            throw new AppError(
                "Invalid department manager",
                400
            );
        }
    }


    const department =
        await Department.findOneAndUpdate(
            {
                _id:departmentId,
                company:companyId,
                isDeleted:false
            },
            updateData,
            {
                new:true,
                runValidators:true
            }
        );


    if(!department){
        throw new AppError(
            "Department not found",
            404
        );
    }


    return department;
};


const deactivateDepartment = async(
    departmentId,
    currentUser
)=>{

    const department =
        await Department.findOne({
            _id:departmentId,
            company:currentUser.company,
            isDeleted:false
        });


    if(!department){
        throw new AppError(
            "Department not found",
            404
        );
    }


    department.status="INACTIVE";

    await department.save();


    return department;
};


const getDepartmentDetails = async(
    departmentId,
    currentUser
)=>{


    const department =
        await Department.findOne({
            _id:departmentId,
            company:currentUser.company,
            isDeleted:false
        })
        .populate(
            "manager",
            "employeeId personalInfo jobInfo"
        );


    if(!department){
        throw new AppError(
            "Department not found",
            404
        );
    }


    const employees =
        await Employee.find({
            department:departmentId,
            company:currentUser.company,
            isDeleted:false
        })
        .select(
            "employeeId personalInfo jobInfo status"
        );


    return {
        department,
        statistics:{
            totalEmployees:employees.length,
            activeEmployees:
                employees.filter(
                    e=>e.status==="ACTIVE"
                ).length
        },
        employees
    };
};


module.exports={
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deactivateDepartment,
    getDepartmentDetails
};