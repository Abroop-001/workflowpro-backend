const Interview = require("./interview.model");
const AppError = require("../../utils/AppError");

const createInterview = async (data, companyId, userId) => {
    return await Interview.create({
        ...data,
        company: companyId,
        createdBy: userId
    });
};

const getInterviewById = async (id, companyId) => {
    const interview = await Interview.findOne({
        _id: id,
        company: companyId
    }).populate("interviewer", "name email");

    if (!interview) {
        throw new AppError("Interview not found", 404);
    }

    return interview;
};

const updateInterviewStatus = async (interviewId, status, companyId, userId) => {
    const interview = await Interview.findOne({
        _id: interviewId,
        company: companyId
    });

    if (!interview) {
        throw new AppError("Interview not found", 404);
    }

    interview.status = status;
    interview.updatedBy = userId;
    await interview.save();

    return interview;
};

const getInterviews = async (companyId) => {
    return await Interview.find({ company: companyId })
        .populate("interviewer", "name email")
        .sort({ interviewDate: -1 });
};

module.exports = {
    createInterview,
    getInterviewById,
    updateInterviewStatus,
    getInterviews
};