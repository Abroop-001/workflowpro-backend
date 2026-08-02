const Document = require("./document.model");
const Employee = require("../employee/employee.model");
const User = require("../auth/auth.model");
const Department = require("../department/department.model");
const notificationService = require("../notification/notification.service");
const AppError = require("../../utils/AppError");
const fs = require("fs");

const getManagedDepartmentIds = async (userId, companyId) => {
    const managerEmployee = await Employee.findOne({
        user: userId,
        company: companyId,
        isDeleted: false
    });
    if (!managerEmployee) return [];

    const departments = await Department.find({
        manager: managerEmployee._id,
        company: companyId,
        isDeleted: false
    }).select("_id");
    return departments.map(d => d._id.toString());
};
const {
    findDocumentById,  createDocument,  findEmployeeDocuments,  countEmployeeDocuments,   findExpiringDocuments, findPendingDocuments
} = require("./document.query");

const notifyEmployee = async (
    employee,  companyId, title,   message,   documentId,  createdBy
)=>{
    try{
        if(!employee.user){
            return;

        }
        await notificationService.sendNotification(
            {
                user:employee.user,
                type:"DOCUMENT",
                priority:"MEDIUM",
                title,
                message,
                reference:{
                    module:"DOCUMENT",
                    id:documentId
                }

            },
            companyId,
            createdBy

        );
    }

    catch(error){
        console.error(
            "Document notification failed:",
            error.message

        );
    }
};
const notifyDocumentAdmins = async (
    companyId,  title,   message, documentId, createdBy
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
        for(const user of users){
            await notificationService.sendNotification(
                {
                    user:user._id,
                    type:"DOCUMENT",
                    priority:"MEDIUM",
                    title,
                    message,
                    reference:{
                        module:"DOCUMENT",
                        id:documentId
                    }
                },
                companyId,
                createdBy
            );
        }
    }
    catch(error){
        console.error(
            "Document admin notification failed:",
          error.message
        );
    }
};
const uploadDocument = async (
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
    const document = await createDocument({
        ...data,
        company:companyId,
    uploadedBy:userId
    });
    const createdDocument = document[0];
    await notifyDocumentAdmins(
        companyId,
        "New Document Uploaded",
        `A new document has been uploaded for employee ${employee.personalInfo.firstName}.`,
        createdDocument._id,
        userId
    );
return createdDocument;
};
const getDocumentById = async (
    documentId,
    companyId,
    user
)=>{
    const document = await findDocumentById(
        documentId,
        companyId
    );

    if(!document){
        throw new AppError(
            "Document not found",
            404
        );
    }
    if (user) {
        const isSelf = await Employee.findOne({
            user: user.id,
            company: companyId,
            _id: document.employee,
            isDeleted: false
        });
        if (!isSelf) {
            if (user.role === "EMPLOYEE") {
                throw new AppError("Unauthorized to access this document", 403);
            }
            if (user.role === "MANAGER") {
                const managerEmployee = await Employee.findOne({
                    user: user.id,
                    company: companyId,
                    isDeleted: false
                });
                if (!managerEmployee) {
                    throw new AppError("Manager employee profile not found", 404);
                }
                const deptIds = await getManagedDepartmentIds(user.id, companyId);
                const targetEmployee = await Employee.findOne({
                    _id: document.employee,
                    company: companyId,
                    isDeleted: false
                });

                if (!targetEmployee || !targetEmployee.department || !deptIds.includes(targetEmployee.department.toString())) {
                    throw new AppError("Unauthorized to access this document", 403);
                }
            }
        }
    }
return document;
};
const getEmployeeDocuments = async (
    employeeId,
    user,
    filters = {}
)=>{
    const companyId = user.company;
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (Number(page) - 1) * Number(limit);
    const isSelf = await Employee.findOne({
        user: user.id,
        company: companyId,
        _id: employeeId,
        isDeleted: false
    });
    if (!isSelf) {
        if (user.role === "EMPLOYEE") {
            throw new AppError("Unauthorized to access these documents", 403);
        }
        if (user.role === "MANAGER") {
            const managerEmployee = await Employee.findOne({
                user: user.id,
                company: companyId,
                isDeleted: false
            });
            if (!managerEmployee) {
                throw new AppError("Manager employee profile not found", 404);
            }

            const deptIds = await getManagedDepartmentIds(user.id, companyId);
            const targetEmployee = await Employee.findOne({
                _id: employeeId,
                company: companyId,
                isDeleted: false
            });

            if (!targetEmployee || !targetEmployee.department || !deptIds.includes(targetEmployee.department.toString())) {
                throw new AppError("Unauthorized to access these documents", 403);
            }
        }
    }
    const [
        documents,
        total
    ] = await Promise.all([
        findEmployeeDocuments(
            employeeId,
            companyId,
            filters,
            {
                skip,
                limit: Number(limit)
            }
        ),
        countEmployeeDocuments(
            employeeId,    companyId,     filters
        )
    ]);
    return {
        documents,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
        }
    };
};
const updateDocument = async (
    documentId,  data,  companyId, userId
)=>{
    const document = await Document.findOne({
        _id:documentId,
        company:companyId,
        isDeleted:false
    });
    if(!document){
        throw new AppError(
            "Document not found",
            404
        );
    }
    Object.assign(
        document,
        data
    );
    document.updatedBy=userId;
    await document.save();
    return document;
};
const verifyDocument = async (
    documentId,
    data,
    companyId,
    userId
)=>{
    const document = await Document.findOne({
        _id:documentId,
        company:companyId,
        isDeleted:false
    });
    if(!document){
        throw new AppError(
            "Document not found",
            404
        );
    }
    document.verificationStatus=data.status;
    document.verifiedBy=userId;
    document.verifiedAt=new Date();
    document.rejectionReason =
        data.rejectionReason || null;
    await document.save();
    const employee = await Employee.findOne({
        _id:document.employee,
        company:companyId,
        isDeleted:false
    });
    if(employee){
        const statusMessage =
            data.status==="VERIFIED"
            ?
            "Your document has been verified successfully."
            :
            `Your document verification was rejected. Reason: ${data.rejectionReason || "Not specified"}`;
        await notifyEmployee(
            employee,
            companyId,
            data.status==="VERIFIED"
                ?
                "Document Verified"
                :
                "Document Rejected",
            statusMessage,
            document._id,
            userId
        );
    }
    return document;
};
const deleteDocument = async (
    documentId,  companyId, userId
)=>{
    const document = await Document.findOne({
        _id:documentId,
        company:companyId,
        isDeleted:false
    });
    if(!document){
        throw new AppError(
            "Document not found",
            404
        );
    }
    document.isDeleted=true;
    document.updatedBy=userId;
    await document.save();
 return document;
};
const getExpiringDocuments = async (
    companyId,  beforeDate
)=>{
    return findExpiringDocuments(
        companyId,
        beforeDate
    );
};
const getPendingDocuments = async (
    companyId
)=>{
    return findPendingDocuments(
        companyId
    );
};
const downloadDocument = async (
    documentId,
    user
)=>{
    const document = await getDocumentById(documentId, user.company, user);
    if (
        !fs.existsSync(
            document.file.filePath
        )
    ) {
        throw new AppError(
            "File not found on server",
            404
        );
    }
    return document;
};
module.exports={
 uploadDocument, getDocumentById,  getEmployeeDocuments,  updateDocument,  verifyDocument, deleteDocument, getExpiringDocuments,  getPendingDocuments, downloadDocument
};