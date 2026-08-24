const interviewService = require("./interview.service");
const { logAction } = require("../../utils/auditLogger");

const createInterview = async (req, res, next) => {
    try {
        const interview = await interviewService.createInterview(
            req.body,
            req.user.company,
            req.user._id
        );

        await logAction(req, {
            action: "CREATE",
            module: "RECRUITMENT",
            description: `Scheduled interview for candidate: ${interview.candidateName}`,
            targetId: interview._id,
            newData: req.body
        });

        res.status(201).json({
            success: true,
            message: "Interview scheduled successfully",
            data: { interview }
        });
    } catch (error) {
        next(error);
    }
};

const getInterviewById = async (req, res, next) => {
    try {
        const interview = await interviewService.getInterviewById(
            req.params.id,
            req.user.company
        );

        res.status(200).json({
            success: true,
            data: { interview }
        });
    } catch (error) {
        next(error);
    }
};

const updateInterviewStatus = async (req, res, next) => {
    try {
        const interview = await interviewService.updateInterviewStatus(
            req.params.id,
            req.body.status,
            req.user.company,
            req.user._id
        );

        await logAction(req, {
            action: "UPDATE",
            module: "RECRUITMENT",
            description: `Updated interview status to ${req.body.status} for: ${interview.candidateName}`,
            targetId: interview._id,
            newData: req.body
        });

        res.status(200).json({
            success: true,
            message: "Interview status updated successfully",
            data: { interview }
        });
    } catch (error) {
        next(error);
    }
};

const getInterviews = async (req, res, next) => {
    try {
        const interviews = await interviewService.getInterviews(req.user.company);
        res.status(200).json({
            success: true,
            data: { interviews }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInterview,
    getInterviewById,
    updateInterviewStatus,
    getInterviews
};