const Company=require("./company.model");
const AppError=require("../../utils/AppError");

const createCompany=async(companyData,userId)=>{
    const existingCompany=await Company.findOne({
        $or:[
            {name:companyData.name.trim()},
            {email:companyData.email.toLowerCase().trim()}
        ]
    });

    if(existingCompany)
        throw new AppError("Company already exists",409);

    return Company.create({
        ...companyData,
        name:companyData.name.trim(),
        email:companyData.email.toLowerCase().trim(),
        createdBy:userId
    });
};

const getCompanyById=async(companyId,user)=>{
    const company=await Company.findById(companyId);

    if(!company)
        throw new AppError("Company not found",404);

    if(
        user.role!=="SUPER_ADMIN" &&
        company._id.toString()!==user.company.toString()
    )
        throw new AppError("Access denied",403);

    return company;
};

const updateCompany=async(companyId,updateData,user)=>{
    const company=await Company.findById(companyId);

    if(!company)
        throw new AppError("Company not found",404);

    if(
        user.role!=="SUPER_ADMIN" &&
        company._id.toString()!==user.company.toString()
    )
        throw new AppError("Access denied",403);

    delete updateData.createdBy;
    delete updateData.status;

    if(updateData.name)
        updateData.name=updateData.name.trim();

    if(updateData.email)
        updateData.email=updateData.email.toLowerCase().trim();

    Object.assign(company,updateData);

    await company.save();

    return company;
};

const deactivateCompany=async(companyId)=>{
    const company=await Company.findById(companyId);

    if(!company)
        throw new AppError("Company not found",404);

    company.status="SUSPENDED";

    await company.save();

    return company;
};

const getAllCompanies = async (query = {}) => {
    const filters = {};
    if (query.search) {
        filters.$or = [
            { name: { $regex: query.search, $options: "i" } },
            { email: { $regex: query.search, $options: "i" } }
        ];
    }
    if (query.status) {
        filters.status = query.status;
    }
    return Company.find(filters).sort({ createdAt: -1 });
};

const activateCompany=async(companyId)=>{
    const company=await Company.findById(companyId);

    if(!company)
        throw new AppError("Company not found",404);

    company.status="ACTIVE";

    await company.save();

    return company;
};

module.exports={
    createCompany,
    getCompanyById,
    updateCompany,
    deactivateCompany,
    getAllCompanies,
    activateCompany
};