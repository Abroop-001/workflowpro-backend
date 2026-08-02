const mongoose = require("mongoose");


const Recruitment = require("./recruitment.model");


const Employee = require("../employee/employee.model");


const User = require("../auth/auth.model");


const notificationService = require("../notification/notification.service");


const AppError = require("../../utils/AppError");



const {

    findCandidateById,

    findDuplicateCandidate,

    createCandidate,

    listCandidates,

    countCandidates

} = require("./recruitment.query");


const notifyRecruitmentUsers = async (

    companyId,

    title,

    message,

    referenceId,

    createdBy

)=>{


    try{


        const users = await User.find({

            company:companyId,

            role:{

                $in:[

                    "HR",

                    "COMPANY_ADMIN"

                ]

            },

            status:"ACTIVE",

            isDeleted:false

        })

        .select("_id");








        const notifications = users.map(user=>({


            user:user._id,


            type:"RECRUITMENT",


            priority:"MEDIUM",


            title,


            message,


            reference:{


                module:"RECRUITMENT",


                id:referenceId


            }


        }));








        for(const notification of notifications){



            await notificationService.sendNotification(

                notification,

                companyId,

                createdBy

            );


        }



    }

    catch(error){


        console.error(

            "Recruitment notification failed:",

            error.message

        );


    }


};









// ======================================
// Create Candidate
// ======================================

const createRecruitment = async (

    data,

    companyId,

    userId

)=>{


    const duplicate = await findDuplicateCandidate(

        data.email,

        data.jobTitle,

        companyId

    );







    if(duplicate){

        throw new AppError(

            "Candidate already exists for this position",

            409

        );

    }







    const candidatePayload = {


        ...data,


        company:companyId,


        createdBy:userId,


        status:"ACTIVE"


    };








    const result = await createCandidate(

        candidatePayload

    );








    const candidate = result[0];








    await notifyRecruitmentUsers(

        companyId,

        "New Candidate Added",

        `New candidate ${candidate.firstName} ${candidate.lastName} has been added.`,

        candidate._id,

        userId

    );








    return candidate;

};









// ======================================
// Get Candidate Details
// ======================================

const getRecruitmentById = async (

    candidateId,

    companyId

)=>{


    const candidate = await findCandidateById(

        candidateId,

        companyId

    );







    if(!candidate){

        throw new AppError(

            "Candidate not found",

            404

        );

    }







    return candidate;

};









// ======================================
// Update Candidate
// ======================================

const updateRecruitment = async (

    candidateId,

    data,

    companyId,

    userId

)=>{


    const candidate = await Recruitment.findOne({

        _id:candidateId,

        company:companyId

    });








    if(!candidate){

        throw new AppError(

            "Candidate not found",

            404

        );

    }








    Object.assign(

        candidate,

        data

    );







    candidate.updatedBy = userId;








    await candidate.save();








    return candidate;

};









// ======================================
// List Candidates
// ======================================

const getRecruitments = async (

    companyId,

    filters,

    page=1,

    limit=10

)=>{


    const skip =

        (

            Number(page)-1

        )

        *

        Number(limit);







    const options={

        skip,

        limit:Number(limit)

    };







    const [

        candidates,

        total

    ] = await Promise.all([



        listCandidates(

            companyId,

            filters,

            options

        ),



        countCandidates(

            companyId,

            filters

        )



    ]);








    return {


        candidates,


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


// ======================================
// Update Candidate Recruitment Stage
// ======================================

const updateCandidateStage = async (

    candidateId,

    stage,

    companyId,

    userId

)=>{


    const candidate = await Recruitment.findOne({

        _id:candidateId,

        company:companyId

    });







    if(!candidate){

        throw new AppError(

            "Candidate not found",

            404

        );

    }







    candidate.stage = stage;


    candidate.updatedBy = userId;







    await candidate.save();







    await notifyRecruitmentUsers(

        companyId,

        "Candidate Stage Updated",

        `${candidate.firstName} ${candidate.lastName} moved to ${stage} stage.`,

        candidate._id,

        userId

    );







    return candidate;

};









// ======================================
// Add Internal Note
// ======================================

const addCandidateNote = async (

    candidateId,

    comment,

    companyId,

    userId

)=>{


    const candidate = await Recruitment.findOne({

        _id:candidateId,

        company:companyId

    });







    if(!candidate){

        throw new AppError(

            "Candidate not found",

            404

        );

    }







    candidate.notes.push({

        comment,

        createdBy:userId

    });







    candidate.updatedBy=userId;







    await candidate.save();







    return candidate;

};









// ======================================
// Update Resume Information
// ======================================

const updateResume = async (

    candidateId,

    resumeData,

    companyId,

    userId

)=>{


    const candidate = await Recruitment.findOne({

        _id:candidateId,

        company:companyId

    });







    if(!candidate){

        throw new AppError(

            "Candidate not found",

            404

        );

    }







    candidate.resume={


        fileName:resumeData.fileName,


        originalName:resumeData.originalName,


        filePath:resumeData.filePath,


        mimeType:resumeData.mimeType,


        fileSize:resumeData.fileSize


    };







    candidate.updatedBy=userId;







    await candidate.save();







    return candidate;

};









// ======================================
// Archive Candidate
// ======================================

const archiveCandidate = async (

    candidateId,

    companyId,

    userId

)=>{


    const candidate = await Recruitment.findOne({

        _id:candidateId,

        company:companyId

    });







    if(!candidate){

        throw new AppError(

            "Candidate not found",

            404

        );

    }







    candidate.status="CLOSED";


    candidate.updatedBy=userId;







    await candidate.save();







    return candidate;

};









// ======================================
// Hire Candidate & Convert To Employee
// ======================================

const hireCandidate = async (

    candidateId,

    employeeData,

    companyId,

    userId

)=>{


    const session = await mongoose.startSession();





    try{


        session.startTransaction();







        const candidate = await Recruitment.findOne({

            _id:candidateId,

            company:companyId

        })

        .session(session);







        if(!candidate){

            throw new AppError(

                "Candidate not found",

                404

            );

        }







        if(candidate.stage==="HIRED"){


            throw new AppError(

                "Candidate already hired",

                409

            );

        }







        const employee = await Employee.create(

            [


                {


                    company:companyId,


                    employeeId:employeeData.employeeId,



                    personalInfo:{


                        firstName:candidate.firstName,


                        lastName:candidate.lastName,


                        email:candidate.email,


                        phone:candidate.phone


                    },



                    department:candidate.department,



                    jobInfo:{


                        designation:employeeData.designation,


                        joiningDate:employeeData.joiningDate


                    },



                    salary:employeeData.salary,



                    createdBy:userId


                }


            ],


            {

                session

            }

        );








        candidate.stage="HIRED";


        candidate.hiredEmployee=employee[0]._id;


        candidate.updatedBy=userId;







        await candidate.save({

            session

        });







        await session.commitTransaction();


        session.endSession();







        await notifyRecruitmentUsers(

            companyId,

            "Candidate Hired",

            `${candidate.firstName} ${candidate.lastName} has been hired successfully.`,

            candidate._id,

            userId

        );







        return employee[0];



    }

    catch(error){


        await session.abortTransaction();


        session.endSession();


        throw error;


    }


};









module.exports={


    createRecruitment,


    getRecruitmentById,


    updateRecruitment,


    getRecruitments,


    updateCandidateStage,


    addCandidateNote,


    updateResume,


    archiveCandidate,


    hireCandidate


};