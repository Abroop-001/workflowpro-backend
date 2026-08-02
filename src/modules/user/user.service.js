const bcrypt = require("bcrypt");

const User = require("../auth/auth.model");
const AppError = require("../../utils/AppError");

const createUser = async (
    userData,
    currentUser
) => {

    const {
        name,
        email,
        password,
        role
    } = userData;


    const normalizedEmail =
        email.toLowerCase().trim();



    const existingUser = await User.findOne({
        email: normalizedEmail
    });


    if(existingUser){

        throw new AppError(
            "User already exists with this email",
            409
        );

    }



    const allowedRoles = [
        "HR",
        "MANAGER",
        "EMPLOYEE"
    ];


    const requestedRole =
        role || "EMPLOYEE";



    if(
        !allowedRoles.includes(requestedRole)
    ){

        throw new AppError(
            "You cannot create this role",
            403
        );

    }
    const hashedPassword =
        await bcrypt.hash(
            password,
            12
        );

    const user = await User.create({

        name:name.trim(),

        email:normalizedEmail,

        password:hashedPassword,

        role:requestedRole,

        company:currentUser.company,

        status:"ACTIVE",

        isEmailVerified:true,

        createdBy:currentUser.id

    });


    user.password = undefined;


    return user;

};

const getCompanyUsers = async(
    currentUser,
    filters={}
)=>{


    const {
        role,
        status,
        page=1,
        limit=10
    } = filters;



    const query = {

        company:currentUser.company,

        isDeleted:false

    };



    if(role){

        query.role = role;

    }



    if(status){

        query.status = status;

    }




    const skip =
        (Number(page)-1)
        *
        Number(limit);



    const [
        users,
        total
    ] = await Promise.all([


        User.find(query)

        .select("-password")

        .sort({
            createdAt:-1
        })

        .skip(skip)

        .limit(Number(limit)),



        User.countDocuments(query)


    ]);



    return {

        users,


        pagination:{

            total,

            page:Number(page),

            limit:Number(limit),

            pages:Math.ceil(
                total /
                Number(limit)
            )

        }

    };

};


const getUserById = async(
    userId,
    currentUser
)=>{


    const user =
        await User.findOne({

            _id:userId,

            company:currentUser.company,

            isDeleted:false

        })

        .select("-password");



    if(!user){

        throw new AppError(
            "User not found",
            404
        );

    }



    return user;

};

const updateUser = async(
    userId,
    updateData,
    currentUser
)=>{


    const query = {

        _id:userId,

        company:currentUser.company,

        isDeleted:false

    };



    const restrictedFields=[

        "company",

        "createdBy",

        "password",

        "isDeleted",

        "emailVerificationToken",

        "emailVerificationExpire",

        "failedLoginAttempts",

        "lockUntil"

    ];



    restrictedFields.forEach(field=>{

        delete updateData[field];

    });




    if(updateData.role){


        const allowedRoles=[

            "HR",
            "MANAGER",
            "EMPLOYEE"

        ];



        if(
            !allowedRoles.includes(
                updateData.role
            )
        ){

            throw new AppError(
                "You cannot assign this role",
                403
            );

        }

    }

    const user =
        await User.findOneAndUpdate(

            query,

            updateData,

            {
                new:true,
                runValidators:true
            }

        )

        .select("-password");




    if(!user){

        throw new AppError(
            "User not found",
            404
        );

    }



    return user;

};

const toggleUserStatus = async(
    userId,
    status,
    currentUser
)=>{


    const user =
        await User.findOne({

            _id:userId,

            company:currentUser.company,

            isDeleted:false

        });



    if(!user){

        throw new AppError(
            "User not found",
            404
        );

    }

    user.status =
        status || "INACTIVE";
    await user.save();
    user.password = undefined;
    return user;

};

module.exports = {
    createUser,
    getCompanyUsers,
    getUserById,
    updateUser,
    toggleUserStatus

};