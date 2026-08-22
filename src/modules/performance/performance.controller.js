const performanceService = require("./performance.service");
const Employee = require("../employee/employee.model");

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
        if (req.user.role === 'EMPLOYEE') {
            const performance = await performanceService.getPerformanceById(req.params.id, req.user.company);
            if (!performance.employee || performance.employee.user?.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only update your own performance review goals"
                });
            }
        }
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
        if (req.user.role === 'EMPLOYEE') {
            const employee = await Employee.findOne({ user: req.user._id, company: req.user.company, isDeleted: false });
            if (!employee || employee._id.toString() !== req.params.employeeId) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only view your own performance reviews"
                });
            }
        }
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
        if (req.user.role === 'EMPLOYEE') {
            if (!performance.employee || performance.employee.user?.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only view your own performance review"
                });
            }
        }
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

const updatePerformance = async (
    req,
    res,
    next
)=>{
    try{
        const performance = await performanceService.updatePerformance(
            req.params.id,
            req.body,
            req.user.company
        );
        res.status(200).json({
            success:true,
            message:"Performance review updated successfully",
            data:{
                performance
            }
        });
    }
    catch(error){
        next(error);
    }
};

const deletePerformance = async (
    req,
    res,
    next
)=>{
    try{
        await performanceService.deletePerformance(
            req.params.id,
            req.user.company
        );
        res.status(200).json({
            success:true,
            message:"Performance review deleted successfully"
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
    getPerformanceById,
    updatePerformance,
    deletePerformance
};