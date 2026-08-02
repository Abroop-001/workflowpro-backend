const Company = require("../modules/company/company.model");
const AppError = require("../utils/AppError");

const companyCheck = async (req, res, next) => {
    try {
        if (!req.user?.company)
            return next(new AppError("Company access denied", 403));

        const company = await Company.findOne({
            _id: req.user.company,
            status: "ACTIVE",
            isDeleted: false
        }).select("_id");

        if (!company)
            return next(new AppError("Company is inactive or unavailable", 403));

        next();
    } catch {
        next(new AppError("Company validation failed", 500));
    }
};

module.exports = companyCheck;