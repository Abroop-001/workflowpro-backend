const selfService = require("./selfService.service");

const getMyProfile = async (req, res, next) => {
    try {
        const data = await selfService.getMyProfile(
            req.user.id || req.user._id,
            req.user.company
        );
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getMyAttendance = async (req, res, next) => {
    try {
        const attendance = await selfService.getMyAttendance(
            req.user.id || req.user._id,
            req.user.company,
            req.query
        );
        res.status(200).json({ success: true, data: { attendance } });
    } catch (error) {
        next(error);
    }
};

const getMyLeaveBalance = async (req, res, next) => {
    try {
        const balance = await selfService.getMyLeaveBalance(
            req.user.id || req.user._id,
            req.user.company,
            req.query.year
        );
        res.status(200).json({ success: true, data: { balance } });
    } catch (error) {
        next(error);
    }
};

const getMyLeaves = async (req, res, next) => {
    try {
        const leaves = await selfService.getMyLeaves(
            req.user.id || req.user._id,
            req.user.company
        );
        res.status(200).json({ success: true, data: { leaves } });
    } catch (error) {
        next(error);
    }
};

const getMyPayslips = async (req, res, next) => {
    try {
        const payslips = await selfService.getMyPayslips(
            req.user.id || req.user._id,
            req.user.company
        );
        res.status(200).json({ success: true, data: { payslips } });
    } catch (error) {
        next(error);
    }
};

const getMyDocuments = async (req, res, next) => {
    try {
        const documents = await selfService.getMyDocuments(
            req.user.id || req.user._id,
            req.user.company
        );
        res.status(200).json({ success: true, data: { documents } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyProfile,
    getMyAttendance,
    getMyLeaveBalance,
    getMyLeaves,
    getMyPayslips,
    getMyDocuments
};
