const bcrypt = require("bcrypt");
const User = require("../modules/auth/auth.model");

const bootstrapAdmin = async () => {

    try {

        const userCount = await User.countDocuments();

        if (userCount > 0) {
            console.log(
                "[Bootstrap] Users already exist – skipping admin creation."
            );
            return;
        }

        const ADMIN_EMAIL    = process.env.BOOTSTRAP_ADMIN_EMAIL    || "admin@hrms.com";
        const ADMIN_PASSWORD = process.env.BOOTSTRAP_ADMIN_PASSWORD || "Admin@123";
        const ADMIN_NAME     = process.env.BOOTSTRAP_ADMIN_NAME     || "Super Admin";

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

        await User.create({
            name:            ADMIN_NAME,
            email:           ADMIN_EMAIL.toLowerCase(),
            password:        hashedPassword,
            role:            "SUPER_ADMIN",
            status:          "ACTIVE",
            isEmailVerified: true,
            company:         null
        });

        console.log("====================================================");
        console.log("[Bootstrap] SUPER_ADMIN created successfully.");
        console.log(`[Bootstrap]   Email:    ${ADMIN_EMAIL}`);
        console.log(`[Bootstrap]   Password: ${ADMIN_PASSWORD}`);
        console.log("[Bootstrap] IMPORTANT: Change this password immediately after first login.");
        console.log("====================================================");

    } catch (error) {

        console.error("[Bootstrap] Failed to create admin:", error.message);

    }

};

module.exports = bootstrapAdmin;
