const bcrypt = require("bcrypt");

const User = require("../auth.model");
const Company = require("../../company/company.model");
const AppError = require("../../../utils/AppError");

const registerCompany = async ({ companyName, name, email, password }) => {
    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicates
    const [existingUser, existingCompany] = await Promise.all([
        User.findOne({ email: normalizedEmail }),
        Company.findOne({ name: companyName.trim() })
    ]);

    if (existingUser) throw new AppError("Email already registered", 409);
    if (existingCompany) throw new AppError("Company name already exists", 409);

    // Step 1: Create the admin user first (no company yet)
    const user = await User.create({
        name,
        email: normalizedEmail,
        password: await bcrypt.hash(password, 12),
        role: "COMPANY_ADMIN",
        status: "ACTIVE",
        isEmailVerified: true
    });

    // Step 2: Create the company — now we have the user._id for createdBy
    const company = await Company.create({
        name: companyName.trim(),
        email: normalizedEmail,
        createdBy: user._id
    });

    // Step 3: Link the company back to the user
    user.company = company._id;
    await user.save();

    user.password = undefined;

    return { company, user };
};

module.exports = registerCompany;