const mongoose = require("mongoose");
const LeaveBalance = require("./leaveBalance.model");
const Employee = require("../employee/employee.model");
const Department = require("../department/department.model");
const AppError = require("../../utils/AppError");

const getManagedDepartmentIds = async (userId, companyId) => {
    const managerEmployee = await Employee.findOne({
        user: userId,
        company: companyId,
        isDeleted: false
    });
    if (!managerEmployee) return [];

    const departments = await Department.find({
        manager: managerEmployee._id,
        company: companyId,
        isDeleted: false
    }).select("_id");

    return departments.map(d => d._id.toString());
};

const createLeaveBalance = async (data, user) => {
    const employee = await Employee.findOne({
        _id: data.employee,
        company: user.company,
        isDeleted: false
    });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    const existing = await LeaveBalance.findOne({
        company: user.company,
        employee: data.employee,
        year: data.year
    });

    if (existing) {
        throw new AppError("Leave balance already exists for this year", 409);
    }

    const casualAllocated = (data.casualLeave && data.casualLeave.allocated) || 0;
    const sickAllocated = (data.sickLeave && data.sickLeave.allocated) || 0;
    const paidAllocated = (data.paidLeave && data.paidLeave.allocated) || 0;

    return LeaveBalance.create({
        company: user.company,
        employee: data.employee,
        year: data.year,
        casualLeave: {
            allocated: casualAllocated,
            used: 0,
            remaining: casualAllocated,
            carriedForward: 0,
            expired: 0
        },
        sickLeave: {
            allocated: sickAllocated,
            used: 0,
            remaining: sickAllocated,
            carriedForward: 0,
            expired: 0
        },
        paidLeave: {
            allocated: paidAllocated,
            used: 0,
            remaining: paidAllocated,
            carriedForward: 0,
            expired: 0
        },
        unpaidLeave: {
            used: 0
        },
        createdBy: user.id,
        lastUpdatedBy: user.id
    });
};

const getEmployeeLeaveBalance = async (employeeId, user, year) => {
    const queryYear = year ? Number(year) : new Date().getFullYear();

    if (user.role === "MANAGER") {
        const managerEmployee = await Employee.findOne({
            user: user.id,
            company: user.company,
            isDeleted: false
        });
        if (!managerEmployee) {
            throw new AppError("Manager employee profile not found", 404);
        }

        const deptIds = await getManagedDepartmentIds(user.id, user.company);
        const targetEmployee = await Employee.findOne({
            _id: employeeId,
            company: user.company,
            isDeleted: false
        });

        if (!targetEmployee || !targetEmployee.department || !deptIds.includes(targetEmployee.department.toString())) {
            throw new AppError("Employee not assigned under this manager", 403);
        }
    }

    const balance = await LeaveBalance.findOne({
        employee: employeeId,
        company: user.company,
        year: queryYear
    });

    if (!balance) {
        throw new AppError("Leave balance not found for this employee and year", 404);
    }

    return balance;
};

const getMyLeaveBalance = async (user, year) => {
    const queryYear = year ? Number(year) : new Date().getFullYear();

    const employee = await Employee.findOne({
        user: user.id,
        company: user.company,
        isDeleted: false
    });

    if (!employee) {
        throw new AppError("Employee profile not found", 404);
    }

    const balance = await LeaveBalance.findOne({
        employee: employee._id,
        company: user.company,
        year: queryYear
    });

    if (!balance) {
        throw new AppError("Leave balance not allocated for this year", 404);
    }

    return balance;
};

const updateAllocation = async (employeeId, data, user) => {
    const employee = await Employee.findOne({
        _id: employeeId,
        company: user.company,
        isDeleted: false
    });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    const balance = await LeaveBalance.findOne({
        employee: employeeId,
        company: user.company,
        year: data.year
    });

    if (!balance) {
        throw new AppError("Leave balance record not found for this year", 404);
    }

    const update = {
        lastUpdatedBy: user.id
    };

    const keys = ["casualLeave", "sickLeave", "paidLeave"];
    keys.forEach(k => {
        if (data[k] !== undefined) {
            const currentVal = balance[k] || { used: 0, carriedForward: 0, expired: 0 };
            const newAllocated = data[k];
            const used = currentVal.used || 0;
            const carriedForward = currentVal.carriedForward || 0;
            const expired = currentVal.expired || 0;

            update[`${k}.allocated`] = newAllocated;
            update[`${k}.remaining`] = newAllocated + carriedForward - used - expired;
        }
    });

    const updatedBalance = await LeaveBalance.findOneAndUpdate(
        { _id: balance._id },
        update,
        { new: true, runValidators: true }
    );

    return updatedBalance;
};

const checkAvailableLeave = async (employeeId, companyId, leaveType, days, session = null) => {
    const currentYear = new Date().getFullYear();

    const balance = await LeaveBalance.findOne({
        employee: employeeId,
        company: companyId,
        year: currentYear
    }).session(session);

    if (!balance) {
        throw new AppError("Leave balance not found/allocated for this year", 404);
    }

    let key;
    if (leaveType === "CASUAL") key = "casualLeave";
    else if (leaveType === "SICK") key = "sickLeave";
    else if (leaveType === "PAID") key = "paidLeave";
    else if (leaveType === "UNPAID") {
        return true;
    } else {
        throw new AppError("Invalid leave type", 400);
    }

    const leaveTypeData = balance[key];
    if (!leaveTypeData || leaveTypeData.remaining < days) {
        throw new AppError(`Insufficient ${leaveType.toLowerCase()} leave balance. Available: ${leaveTypeData ? leaveTypeData.remaining : 0}, Requested: ${days}`, 400);
    }

    return true;
};

const deductLeave = async (employeeId, companyId, leaveType, days, session = null) => {
    const currentYear = new Date().getFullYear();

    let key;
    if (leaveType === "CASUAL") key = "casualLeave";
    else if (leaveType === "SICK") key = "sickLeave";
    else if (leaveType === "PAID") key = "paidLeave";
    else if (leaveType === "UNPAID") {
        await LeaveBalance.findOneAndUpdate(
            { employee: employeeId, company: companyId, year: currentYear },
            { $inc: { "unpaidLeave.used": days } },
            { session, new: true }
        );
        return;
    } else {
        return;
    }

    const update = {
        $inc: {
            [`${key}.used`]: days,
            [`${key}.remaining`]: -days
        }
    };

    const balance = await LeaveBalance.findOneAndUpdate(
        { employee: employeeId, company: companyId, year: currentYear },
        update,
        { session, new: true }
    );

    if (!balance) {
        throw new AppError("Leave balance record not found to deduct", 404);
    }
};

const restoreLeave = async (employeeId, companyId, leaveType, days, session = null) => {
    const currentYear = new Date().getFullYear();

    let key;
    if (leaveType === "CASUAL") key = "casualLeave";
    else if (leaveType === "SICK") key = "sickLeave";
    else if (leaveType === "PAID") key = "paidLeave";
    else if (leaveType === "UNPAID") {
        await LeaveBalance.findOneAndUpdate(
            { employee: employeeId, company: companyId, year: currentYear },
            { $inc: { "unpaidLeave.used": -days } },
            { session, new: true }
        );
        return;
    } else {
        return;
    }

    const update = {
        $inc: {
            [`${key}.used`]: -days,
            [`${key}.remaining`]: days
        }
    };

    const balance = await LeaveBalance.findOneAndUpdate(
        { employee: employeeId, company: companyId, year: currentYear },
        update,
        { session, new: true }
    );

    if (!balance) {
        throw new AppError("Leave balance record not found to restore", 404);
    }
};

module.exports = {
    createLeaveBalance,
    getEmployeeLeaveBalance,
    getMyLeaveBalance,
    updateAllocation,
    checkAvailableLeave,
    deductLeave,
    restoreLeave
};