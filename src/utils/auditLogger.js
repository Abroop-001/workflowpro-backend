const auditLogService = require("../modules/audit-log/auditLog.service");

/**
 * Helper to log actions into the Audit Log.
 */
const logAction = async (req, { action, module, description, targetId, oldData, newData, companyId }) => {
    try {
        if (!req || !req.user) return; // Must be authenticated

        await auditLogService.createAuditLog({
            company: companyId || req.user.company || null,
            user: req.user._id,
            action,
            module,
            description,
            targetId,
            oldData,
            newData,
            ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null,
            userAgent: req.headers ? req.headers["user-agent"] : null
        });
    } catch (error) {
        console.error("Failed to log action:", error);
    }
};

module.exports = { logAction };
