const companyService = require("./company.service");

const createCompany = async(req,res,next)=>{
    try{
        const company = await companyService.createCompany(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success:true,
            message:"Company created successfully",
            data:{company}
        });
    }catch(error){
        next(error);
    }
};

const getCompany = async(req,res,next)=>{
    try{
        const company = await companyService.getCompanyById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            data:{company}
        });
    }catch(error){
        next(error);
    }
};

const updateCompany = async(req,res,next)=>{
    try{
        const company = await companyService.updateCompany(
            req.params.id,
            req.body,
            req.user
        );

        res.status(200).json({
            success:true,
            message:"Company updated successfully",
            data:{company}
        });
    }catch(error){
        next(error);
    }
};

const deactivateCompany = async(req,res,next)=>{
    try{
        const company = await companyService.deactivateCompany(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            message:"Company deactivated successfully",
            data:{company}
        });
    }catch(error){
        next(error);
    }
};

const getCompanies = async(req,res,next)=>{
    try{
        const companies = await companyService.getAllCompanies(req.query);

        res.status(200).json({
            success:true,
            data:{companies}
        });
    }catch(error){
        next(error);
    }
};

const activateCompany = async(req,res,next)=>{
    try{
        const company = await companyService.activateCompany(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success:true,
            message:"Company activated successfully",
            data:{company}
        });
    }catch(error){
        next(error);
    }
};

module.exports={
    createCompany,
    getCompany,
    updateCompany,
    deactivateCompany,
    getCompanies,
    activateCompany
};