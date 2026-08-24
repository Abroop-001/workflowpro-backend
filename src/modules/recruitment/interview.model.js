const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
{
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true
    },
    candidateName: {
        type: String,
        required: true,
        trim: true
    },
    candidateEmail: {
        type: String,
        required: true,
        trim: true
    },
    candidatePhone: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    interviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    interviewDate: {
        type: Date,
        required: true
    },
    interviewTime: {
        type: String,
        required: true
    },
    interviewType: {
        type: String,
        enum: ["ONLINE", "OFFLINE", "PHONE"],
        default: "ONLINE"
    },
    status: {
        type: String,
        enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
        default: "SCHEDULED",
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
});

interviewSchema.index({
    company: 1,
    status: 1
});

module.exports = mongoose.model("Interview", interviewSchema);