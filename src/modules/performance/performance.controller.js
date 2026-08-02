const performanceService = require("./performance.service");

const createPerformance = async (
    req,
    res,
    next
)=>{
    try{
        const performance = await performanceService.createPerformance(
            req.body,
            req.user.company,
            req.user._id
        );
        res.status(201).json({
            success:true,
            message:"Performance review created successfully",
            data:{
                performance
            }
        });

    }

    catch(error){

        next(error);

    }


};

const submitSelfReview = async (

    req,

    res,

    next

)=>{


    try{


        const performance = await performanceService.submitSelfReview(

            req.params.id,

            req.body,

            req.user._id

        );
        res.status(200).json({

            success:true,

            message:"Self review submitted successfully",

            data:{

                performance

            }

        });



    }

    catch(error){

        next(error);

    }


};

const submitManagerReview = async (

    req,

    res,

    next

)=>{


    try{


        const performance = await performanceService.submitManagerReview(

            req.params.id,

            req.body,

            req.user.company,

            req.user._id

        );





        res.status(200).json({

            success:true,

            message:"Manager review submitted successfully",

            data:{

                performance

            }

        });



    }

    catch(error){

        next(error);

    }


};

const updateGoalStatus = async (
    req,
    res,
    next
)=>{
    try{
        const performance = await performanceService.updateGoalStatus(

            req.params.id,

            req.body.goalId,

            req.body.status,

            req.user.company

        );
        res.status(200).json({
            success:true,
            message:"Goal status updated successfully",
            data:{
                performance
            }
        });



    }

    catch(error){

        next(error);

    }

};


const getEmployeePerformance = async (
    req,
    res,
    next
)=>{
    try{
        const performances = await performanceService.getEmployeePerformance(
            req.params.employeeId,
            req.user.company
        );
        res.status(200).json({
            success:true,
            results:performances.length,
            data:{
                performances
            }
        });
    }
    catch(error){
      next(error);
    }
};

const getPerformanceById = async (
    req,
    res,
    next

)=>{
    try{
        const performance = await performanceService.getPerformanceById(
            req.params.id,
            req.user.company
        );
        res.status(200).json({
            success:true,
            data:{
                performance
            }
        });
    }
    catch(error){
        next(error);
    }
};
module.exports = {
    createPerformance,
    submitSelfReview,
    submitManagerReview,
    updateGoalStatus,
    getEmployeePerformance,
    getPerformanceById
};