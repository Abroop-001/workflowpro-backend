const recruitmentService = require("./recruitment.service");


const createRecruitment = async (

    req,

    res,

    next

)=>{


    try{


        const candidate = await recruitmentService.createRecruitment(

            req.body,

            req.user.company,

            req.user._id

        );

        res.status(201).json({

            success:true,

            message:"Candidate created successfully",

            data:{

                candidate

            }

        });



    }

    catch(error){

        next(error);

    }


};

const getRecruitmentById = async (

    req,

    res,

    next

)=>{


    try{


        const candidate = await recruitmentService.getRecruitmentById(

            req.params.id,

            req.user.company

        );

        res.status(200).json({

            success:true,

            data:{

                candidate

            }

        });



    }

    catch(error){

        next(error);

    }


};

const getRecruitments = async (

    req,

    res,

    next

)=>{


    try{


        const result = await recruitmentService.getRecruitments(

            req.user.company,

            req.query,

            req.query.page,

            req.query.limit

        );


        res.status(200).json({

            success:true,

            data:result

        });



    }

    catch(error){

        next(error);

    }


};

const updateRecruitment = async (

    req,

    res,

    next

)=>{


    try{


        const candidate = await recruitmentService.updateRecruitment(

            req.params.id,

            req.body,

            req.user.company,

            req.user._id

        );

        res.status(200).json({

            success:true,

            message:"Candidate updated successfully",

            data:{

                candidate

            }

        });



    }

    catch(error){

        next(error);

    }


};

const updateCandidateStage = async (

    req,

    res,

    next

)=>{


    try{


        const candidate = await recruitmentService.updateCandidateStage(

            req.params.id,

            req.body.stage,

            req.user.company,

            req.user._id

        );

        res.status(200).json({

            success:true,

            message:"Candidate stage updated successfully",

            data:{

                candidate

            }

        });



    }

    catch(error){

        next(error);

    }


};

const addCandidateNote = async (

    req,

    res,

    next

)=>{


    try{


        const candidate = await recruitmentService.addCandidateNote(

            req.params.id,

            req.body.comment,

            req.user.company,

            req.user._id

        );
        res.status(200).json({

            success:true,

            message:"Note added successfully",

            data:{

                candidate

            }

        });



    }

    catch(error){

        next(error);

    }


};


const updateResume = async (

    req,

    res,

    next

)=>{


    try{


        const candidate = await recruitmentService.updateResume(

            req.params.id,

            req.body,

            req.user.company,

            req.user._id

        );

        res.status(200).json({

            success:true,

            message:"Resume updated successfully",

            data:{

                candidate

            }

        });



    }

    catch(error){
        next(error);
    }


};

const archiveCandidate = async (

    req,

    res,

    next

)=>{


    try{

        const candidate = await recruitmentService.archiveCandidate(

            req.params.id,

            req.user.company,

            req.user._id

        );
        res.status(200).json({

            success:true,

            message:"Candidate archived successfully",

            data:{

                candidate

            }

        });

    }
    catch(error){

        next(error);

    }

};

const hireCandidate = async (

    req,

    res,

    next

)=>{


    try{
        const employee = await recruitmentService.hireCandidate(

            req.params.id,

            req.body,

            req.user.company,

            req.user._id

        );

        res.status(201).json({

            success:true,

            message:"Candidate hired successfully",
            data:{
                employee
            }
        });

    }

    catch(error){

        next(error);

    }
};
module.exports = {
    createRecruitment, getRecruitmentById,
    getRecruitments,   updateRecruitment, updateCandidateStage,  addCandidateNote,  updateResume,  archiveCandidate,  hireCandidate
};