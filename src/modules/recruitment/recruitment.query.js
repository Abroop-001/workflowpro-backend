const Recruitment = require("./recruitment.model");



// ======================================
// Find Candidate By ID
// ======================================

const findCandidateById = (

    candidateId,

    companyId

)=>{

    return Recruitment.findOne({

        _id:candidateId,

        company:companyId

    })

    .populate("department")

    .populate("createdBy","name email")

    .populate("updatedBy","name email");

};









// ======================================
// Find Duplicate Candidate
// ======================================

const findDuplicateCandidate = (

    email,

    jobTitle,

    companyId

)=>{

    return Recruitment.findOne({

        email,

        jobTitle,

        company:companyId,

        status:"ACTIVE"

    });

};









// ======================================
// Create Candidate
// ======================================

const createCandidate = (

    payload,

    session=null

)=>{

    return Recruitment.create(

        [payload],

        {

            session

        }

    );

};









// ======================================
// List Candidates
// ======================================

const listCandidates = (

    companyId,

    filters,

    options

)=>{


    const query={

        company:companyId

    };





    if(filters.stage){

        query.stage=filters.stage;

    }





    if(filters.department){

        query.department=filters.department;

    }





    if(filters.status){

        query.status=filters.status;

    }





    if(filters.search){

        query.$or=[

            {

                firstName:{

                    $regex:filters.search,

                    $options:"i"

                }

            },

            {

                lastName:{

                    $regex:filters.search,

                    $options:"i"

                }

            },

            {

                email:{

                    $regex:filters.search,

                    $options:"i"

                }

            },

            {

                phone:{

                    $regex:filters.search,

                    $options:"i"

                }

            }

        ];

    }





    return Recruitment.find(query)

        .populate("department")

        .sort({

            createdAt:-1

        })

        .skip(options.skip)

        .limit(options.limit);

};









// ======================================
// Candidate Count
// ======================================

const countCandidates = (

    companyId,

    filters

)=>{


    const query={

        company:companyId

    };





    if(filters.stage){

        query.stage=filters.stage;

    }





    if(filters.department){

        query.department=filters.department;

    }





    if(filters.status){

        query.status=filters.status;

    }





    if(filters.search){

        query.$or=[

            {

                firstName:{

                    $regex:filters.search,

                    $options:"i"

                }

            },

            {

                lastName:{

                    $regex:filters.search,

                    $options:"i"

                }

            },

            {

                email:{

                    $regex:filters.search,

                    $options:"i"

                }

            }

        ];

    }





    return Recruitment.countDocuments(

        query

    );

};









module.exports={

    findCandidateById,

    findDuplicateCandidate,

    createCandidate,

    listCandidates,

    countCandidates

};