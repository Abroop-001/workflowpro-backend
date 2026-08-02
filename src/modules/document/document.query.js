const Document = require("./document.model");

const findDocumentById = (
    documentId,
   companyId
)=>{
    return Document.findOne({
        _id:documentId,
        company:companyId,
        isDeleted:false
    })
    .populate(
        "employee"
    )
    .populate(
        "uploadedBy",
        "name email"

    )

    .populate(

        "verifiedBy",

        "name email"

    );

};









// ======================================
// Create Document
// ======================================

const createDocument = (

    payload,

    session=null

)=>{


    return Document.create(

        [

            payload

        ],

        {

            session

        }

    );

};









// ======================================
// Employee Documents
// ======================================

const findEmployeeDocuments = (

    employeeId,

    companyId,

    filters={},

    options={}

)=>{


    const query={


        employee:employeeId,


        company:companyId,


        isDeleted:false


    };








    if(filters.category){

        query.category = filters.category;

    }







    if(filters.status){

        query.verificationStatus = filters.status;

    }







    return Document.find(query)

        .sort({

            createdAt:-1

        })

        .skip(

            options.skip || 0

        )

        .limit(

            options.limit || 10

        );

};









// ======================================
// Count Documents
// ======================================

const countEmployeeDocuments = (

    employeeId,

    companyId,

    filters={}

)=>{


    const query={


        employee:employeeId,


        company:companyId,


        isDeleted:false


    };







    if(filters.category){

        query.category = filters.category;

    }







    if(filters.status){

        query.verificationStatus = filters.status;

    }







    return Document.countDocuments(

        query

    );

};









// ======================================
// Expiring Documents
// ======================================

const findExpiringDocuments = (

    companyId,

    beforeDate

)=>{


    return Document.find({

        company:companyId,


        isDeleted:false,


        expiryDate:{


            $lte:beforeDate,


            $gte:new Date()


        }

    })

    .populate(

        "employee"

    );

};
const findPendingDocuments = (
    companyId
)=>{


    return Document.find({

        company:companyId,


        isDeleted:false,


        verificationStatus:"PENDING"


    })

    .populate(

        "employee"

    );

};
module.exports={
    findDocumentById,
    createDocument,
    findEmployeeDocuments,
    countEmployeeDocuments,
    findExpiringDocuments,
    findPendingDocuments
};