const interviewService = require("./interview.service");









// ======================================
// Create Interview
// ======================================

const createInterview = async (

    req,

    res,

    next

)=>{


    try{


        const interview = await interviewService.createInterview(

            req.body,

            req.user.company,

            req.user._id

        );







        res.status(201).json({

            success:true,

            message:"Interview scheduled successfully",

            data:{

                interview

            }

        });



    }

    catch(error){

        next(error);

    }


};









// ======================================
// Get Interview Details
// ======================================

const getInterviewById = async (

    req,

    res,

    next

)=>{


    try{


        const interview = await interviewService.getInterviewById(

            req.params.id,

            req.user.company

        );







        res.status(200).json({

            success:true,

            data:{

                interview

            }

        });



    }

    catch(error){

        next(error);

    }


};









// ======================================
// Candidate Interview History
// ======================================

const getCandidateInterviews = async (

    req,

    res,

    next

)=>{


    try{


        const interviews = await interviewService.getCandidateInterviews(

            req.params.candidateId,

            req.user.company

        );







        res.status(200).json({

            success:true,

            results:interviews.length,

            data:{

                interviews

            }

        });



    }

    catch(error){

        next(error);

    }


};









// ======================================
// Update Interview Status
// ======================================

const updateInterviewStatus = async (

    req,

    res,

    next

)=>{


    try{


        const interview = await interviewService.updateInterviewStatus(

            req.params.id,

            req.body.status,

            req.user.company,

            req.user._id

        );







        res.status(200).json({

            success:true,

            message:"Interview status updated successfully",

            data:{

                interview

            }

        });



    }

    catch(error){

        next(error);

    }


};









// ======================================
// Submit Feedback
// ======================================

const submitFeedback = async (

    req,

    res,

    next

)=>{


    try{


        const interview = await interviewService.submitFeedback(

            req.params.id,

            req.body,

            req.user.company,

            req.user._id

        );







        res.status(200).json({

            success:true,

            message:"Interview feedback submitted successfully",

            data:{

                interview

            }

        });



    }

    catch(error){

        next(error);

    }


};









// ======================================
// Reschedule Interview
// ======================================

const rescheduleInterview = async (

    req,

    res,

    next

)=>{


    try{


        const interview = await interviewService.rescheduleInterview(

            req.params.id,

            req.body.scheduledDate,

            req.user.company,

            req.user._id

        );







        res.status(200).json({

            success:true,

            message:"Interview rescheduled successfully",

            data:{

                interview

            }

        });



    }

    catch(error){

        next(error);

    }


};

const getInterviews = async (req, res, next) => {
    try {
        const interviews = await interviewService.getInterviews(req.user.company);
        res.status(200).json({
            success: true,
            data: { interviews }
        });
    } catch (error) {
        next(error);
    }
};

module.exports={


    createInterview,


    getInterviewById,


    getCandidateInterviews,


    updateInterviewStatus,


    submitFeedback,


    rescheduleInterview,

    getInterviews


};