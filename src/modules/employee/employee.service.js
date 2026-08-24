const Employee = require("./employee.model");
const Department = require("../department/department.model");
const User = require("../auth/auth.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const AppError = require("../../utils/AppError");


const validateDepartment = async(
    departmentId,
    companyId
)=>{
    if(!departmentId) return;

    const department = await Department.findOne({
        _id:departmentId,
        company:companyId,
        isDeleted:false,
        status:"ACTIVE"
    });

    if(!department){
        throw new AppError(
            "Invalid department",
            400
        );
    }
};


const getManagedDepartmentIds = async(
    userId,
    companyId
)=>{

    const managerEmployee = await Employee.findOne({
        user:userId,
        company:companyId,
        isDeleted:false
    });


    if(!managerEmployee){
        return [];
    }


    const departments = await Department.find({
        manager:managerEmployee._id,
        company:companyId,
        isDeleted:false
    }).select("_id");


    return departments.map(
        d=>d._id.toString()
    );
};



const createEmployee = async(
    employeeData,
    currentUser
)=>{

    const companyId=currentUser.company;

    const existingEmployee = await Employee.findOne({
        company:companyId,
        employeeId:employeeData.employeeId,
        isDeleted:false
    });

    if(existingEmployee){
        throw new AppError(
            "Employee ID already exists in this company",
            409
        );
    }

    await validateDepartment(
        employeeData.department,
        companyId
    );

    let userId = null;
    let temporaryPassword = null;
    if (employeeData.personalInfo?.email) {
        const normalizedEmail = employeeData.personalInfo.email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            throw new AppError("A user with this email address already exists", 409);
        }

        temporaryPassword = `Temp@${crypto.randomBytes(4).toString("hex")}`;
        const hashedPassword = await bcrypt.hash(temporaryPassword, 12);
        const user = await User.create({
            name: `${employeeData.personalInfo.firstName} ${employeeData.personalInfo.lastName || ""}`.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "EMPLOYEE",
            company: companyId,
            status: "ACTIVE",
            isEmailVerified: true,
            mustChangePassword: true,
            createdBy: currentUser.id
        });
        userId = user._id;
    }

    const employee = await Employee.create({
        ...employeeData,
        user: userId,
        company: companyId,
        createdBy: currentUser.id,
        status: "ACTIVE",
        isDeleted: false
    });

    return { employee, temporaryPassword };
};

const getCompanyEmployees = async(
    currentUser,
    filters={}
)=>{


    const query={

        company:currentUser.company,

        isDeleted:false

    };



    if(currentUser.role==="MANAGER"){

        const deptIds =
            await getManagedDepartmentIds(
                currentUser.id,
                currentUser.company
            );


        query.department={
            $in:deptIds
        };

    }

    if(filters.status){

        query.status=filters.status;

    }


    if(filters.department){

        query.department=filters.department;

    }

    const employees =
        await Employee.find(query)

        .populate(
            "user",
            "name email role"
        )

        .populate(
            "department",
            "name departmentCode"
        )

        .sort({
            createdAt:-1
        });



    return employees;

};


const getEmployeeById = async(
    employeeId,
    currentUser
)=>{


    const employee =
        await Employee.findOne({

            _id:employeeId,

            company:currentUser.company,

            isDeleted:false

        })

        .populate(
            "user",
            "name email role"
        )

        .populate(
            "department",
            "name departmentCode"
        );



    if(!employee){

        throw new AppError(
            "Employee not found",
            404
        );

    }

    if(currentUser.role==="MANAGER"){


        const deptIds =
            await getManagedDepartmentIds(
                currentUser.id,
                currentUser.company
            );


        if(
            !employee.department ||
            !deptIds.includes(
                employee.department._id.toString()
            )
        ){

            throw new AppError(
                "Unauthorized access",
                403
            );

        }

    }
    return employee;

};


const updateEmployee = async(
    employeeId,
    updateData,
    currentUser
)=>{


    const protectedFields=[

        "company",

        "user",

        "createdBy",

        "employeeId",

        "isDeleted"

    ];
    protectedFields.forEach(
        field=>{
            delete updateData[field];
        }
    );



    if(updateData.department){

        await validateDepartment(
            updateData.department,
            currentUser.company
        );

    }



    const employee =
        await Employee.findOneAndUpdate(

            {
                _id:employeeId,

                company:currentUser.company,

                isDeleted:false

            },

            {

                ...updateData,

                updatedBy:currentUser.id

            },

            {
                new:true,
                runValidators:true
            }

        );

    if(!employee){

        throw new AppError(
            "Employee not found",
            404
        );

    }

    return employee;

};

const deactivateEmployee = async(
    employeeId,
    currentUser
)=>{


    const employee =
        await Employee.findOne({

            _id:employeeId,

            company:currentUser.company,

            isDeleted:false

        });

    if(!employee){

        throw new AppError(
            "Employee not found",
            404
        );

    }
    employee.status="INACTIVE";
    employee.isDeleted=true;
    employee.updatedBy=currentUser.id;
    await employee.save();
    return employee;
};

module.exports={
    createEmployee,
    getCompanyEmployees,
    getEmployeeById,
    updateEmployee,
    deactivateEmployee
};