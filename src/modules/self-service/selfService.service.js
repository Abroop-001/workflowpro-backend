const Employee = require("../employee/employee.model");
const User = require("../auth/auth.model");
const Attendance = require("../attendance/attendance.model");
const Leave = require("../leave/leave.model");
const LeaveBalance = require("../leave-balance/leaveBalance.model");
const Payslip = require("../payslip/payslip.model");
const Document = require("../document/document.model");
const AppError = require("../../utils/AppError");

const getEmployeeForUser = async (userId, companyId) => {
    const employee = await Employee.findOne({
        user: userId,
        company: companyId,
        isDeleted: false
    });

    if (!employee) {
        throw new AppError("Employee profile not found for this user", 404);
    }

    return employee;
};

const getMyProfile = async (userId, companyId) => {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (!companyId || user.role === "SUPER_ADMIN") {
        return {
            user,
            employee: null
        };
    }

    const employee = await Employee.findOne({
        user: userId,
        company: companyId,
        isDeleted: false
    })
    .populate("department", "name departmentCode")
    .populate("jobInfo.shift");

    return {
        user,
        employee
    };
};

const getMyAttendance = async (userId, companyId, filters = {}) => {
    const employee = await getEmployeeForUser(userId, companyId);

    const query = {
        employee: employee._id,
        company: companyId
    };

    if (filters.startDate && filters.endDate) {
        query.date = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate)
        };
    }

    return Attendance.find(query).sort({
        date: -1
    });
};

const getMyLeaveBalance = async (userId, companyId, year) => {
    const employee = await getEmployeeForUser(userId, companyId);

    const queryYear = year
        ? Number(year)
        : new Date().getFullYear();

    const balance = await LeaveBalance.findOne({
        employee: employee._id,
        company: companyId,
        year: queryYear
    });

    if (!balance) {
        throw new AppError(
            "Leave balance not allocated for this year",
            404
        );
    }

    return balance;
};

const getMyLeaves = async (userId, companyId) => {
    const employee = await getEmployeeForUser(userId, companyId);

    return Leave.find({
        employee: employee._id,
        company: companyId
    }).sort({
        createdAt: -1
    });
};

const getMyPayslips = async (userId, companyId) => {
    const employee = await getEmployeeForUser(userId, companyId);

    return Payslip.find({
        employee: employee._id,
        company: companyId
    }).sort({
        year: -1,
        month: -1
    });
};

const getMyDocuments = async (userId, companyId) => {
    const employee = await getEmployeeForUser(userId, companyId);

    return Document.find({
        employee: employee._id,
        company: companyId,
        isDeleted: false
    }).sort({
        createdAt: -1
    });
};

module.exports = {
    getMyProfile,
    getMyAttendance,
    getMyLeaveBalance,
    getMyLeaves,
    getMyPayslips,
    getMyDocuments
};