const Performance = require("./performance.model");

const Employee = require("../employee/employee.model");

const AppError = require("../../utils/AppError");


const createPerformance = async (

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

    const existing = await Performance.findOne({

        employee:data.employee,

        company:companyId,

        reviewPeriod:data.reviewPeriod

    });


    if(existing){

        throw new AppError(

            "Performance review already exists for this period",

            409

        );

    }

    const performance = await Performance.create({

        ...data,

        company:companyId,

        createdBy:userId

    });

    return performance;

};
const submitSelfReview = async (

    performanceId,

    data,

    employeeUserId

)=>{


    const performance = await Performance.findById(

        performanceId

    )

    .populate(

        "employee"

    );

    if(!performance){

        throw new AppError(

            "Performance record not found",

            404

        );

    }

    if(

        performance.employee.user?.toString()

        !==

        employeeUserId.toString()

    ){

        throw new AppError(

            "Access denied",

            403

        );

    }

performance.selfReview = data;

    performance.status = "MANAGER_REVIEW";

    await performance.save();

    return performance;

};

const submitManagerReview = async (

    performanceId,

    data,

    companyId,

    managerId

)=>{


    const performance = await Performance.findOne({

        _id:performanceId,

        company:companyId

    });

    if(!performance){

        throw new AppError(

            "Performance record not found",

            404

        );

    }
    performance.managerReview = {
        comments:data.comments,
        rating:data.rating,
        reviewedBy:managerId,
        reviewedAt:new Date()
    };
    const selfRating =

        performance.selfReview.rating || 0;

    performance.finalRating = Number(

        (

            (

                selfRating +

                data.rating

            )

            /

            2

        )

        .toFixed(2)

    );

    performance.status="COMPLETED";
    await performance.save();

    return performance;

};

const updateGoalStatus = async (

    performanceId,

    goalId,

    status,

    companyId

)=>{


    const performance = await Performance.findOne({

        _id:performanceId,

        company:companyId

    });
    if(!performance){

        throw new AppError(

            "Performance record not found",

            404

        );

    }
    const goal = performance.goals.id(

        goalId

    );

    if(!goal){

        throw new AppError(

            "Goal not found",

            404

        );

    }
    goal.status = status;

 await performance.save();
    return performance;

};

const getEmployeePerformance = async (

    employeeId,

    companyId

)=>{


    return await Performance.find({

        employee:employeeId,

        company:companyId

    })

    .sort({

        createdAt:-1

    });

};

const getPerformanceById = async (

    id,

    companyId

)=>{
    const performance = await Performance.findOne({

        _id:id,

        company:companyId

    })

    .populate(

        "employee"
    );
    if(!performance){

        throw new AppError(

            "Performance record not found",

            404

        );

    }
    return performance;
};
module.exports = {
    createPerformance, submitSelfReview,  submitManagerReview, updateGoalStatus, getEmployeePerformance, getPerformanceById
};