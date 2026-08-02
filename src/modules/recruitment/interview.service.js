const Interview = require("./interview.model");


const Recruitment = require("./recruitment.model");


const AppError = require("../../utils/AppError");









// ======================================
// Create Interview
// ======================================

const createInterview = async (

    data,

    companyId,

    userId

)=>{


    const candidate = await Recruitment.findOne({

        _id:data.candidate,

        company:companyId

    });







    if(!candidate){

        throw new AppError(

            "Candidate not found",

            404

        );

    }








    const existingInterview = await Interview.findOne({

        candidate:data.candidate,

        round:data.round,

        status:{

            $in:[

                "SCHEDULED",

                "RESCHEDULED"

            ]

        }

    });








    if(existingInterview){

        throw new AppError(

            "Interview already scheduled for this round",

            409

        );

    }









    const interview = await Interview.create({


        ...data,


        company:companyId,


        createdBy:userId


    });








    // Move candidate stage

    if(candidate.stage === "SCREENING"){

        candidate.stage="INTERVIEW";

        await candidate.save();

    }







    return interview;

};









// ======================================
// Get Interview
// ======================================

const getInterviewById = async (

    id,

    companyId

)=>{


    const interview = await Interview.findOne({

        _id:id,

        company:companyId

    })

    .populate(

        "candidate"

    )

    .populate(

        "interviewer",

        "name email"

    );








    if(!interview){

        throw new AppError(

            "Interview not found",

            404

        );

    }








    return interview;

};









// ======================================
// Get Candidate Interviews
// ======================================

const getCandidateInterviews = async (

    candidateId,

    companyId

)=>{


    return await Interview.find({

        candidate:candidateId,

        company:companyId

    })

    .sort({

        scheduledDate:1

    });

};









// ======================================
// Update Interview Status
// ======================================

const updateInterviewStatus = async (

    interviewId,

    status,

    companyId,

    userId

)=>{


    const interview = await Interview.findOne({

        _id:interviewId,

        company:companyId

    });








    if(!interview){

        throw new AppError(

            "Interview not found",

            404

        );

    }








    interview.status=status;


    interview.updatedBy=userId;







    await interview.save();







    return interview;

};









// ======================================
// Submit Feedback
// ======================================

const submitFeedback = async (

    interviewId,

    feedback,

    companyId,

    userId

)=>{


    const interview = await Interview.findOne({

        _id:interviewId,

        company:companyId

    });








    if(!interview){

        throw new AppError(

            "Interview not found",

            404

        );

    }








    interview.feedback={


        ...feedback,


        submittedBy:userId,


        submittedAt:new Date()


    };







    interview.status="COMPLETED";







    await interview.save();







    return interview;

};









// ======================================
// Reschedule Interview
// ======================================

const rescheduleInterview = async (

    interviewId,

    date,

    companyId,

    userId

)=>{


    const interview = await Interview.findOne({

        _id:interviewId,

        company:companyId

    });








    if(!interview){

        throw new AppError(

            "Interview not found",

            404

        );

    }








    interview.scheduledDate=date;


    interview.status="RESCHEDULED";


    interview.updatedBy=userId;







    await interview.save();







    return interview;

};

const getInterviews = async (companyId) => {
    return await Interview.find({ company: companyId })
        .populate("candidate")
        .populate("interviewer", "name email")
        .sort({ scheduledDate: -1 });
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