const DOCUMENT_CATEGORY = {


    IDENTITY: "IDENTITY",


    EDUCATION: "EDUCATION",


    EXPERIENCE: "EXPERIENCE",


    CONTRACT: "CONTRACT",


    OFFER_LETTER: "OFFER_LETTER",


    SALARY: "SALARY",


    CERTIFICATE: "CERTIFICATE",


    OTHER: "OTHER"


};








const DOCUMENT_STATUS = {


    PENDING: "PENDING",


    VERIFIED: "VERIFIED",


    REJECTED: "REJECTED"


};








const ALLOWED_FILE_TYPES = [


    "application/pdf",


    "image/jpeg",


    "image/png",


    "application/msword",


    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"


];








const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB







module.exports = {


    DOCUMENT_CATEGORY,


    DOCUMENT_STATUS,


    ALLOWED_FILE_TYPES,


    MAX_FILE_SIZE


};