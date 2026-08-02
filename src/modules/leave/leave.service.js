const mongoose = require("mongoose");
const Leave = require("./leave.model");
const Employee = require("../employee/employee.model");
const Department = require("../department/department.model");
const leaveBalanceService = require("../leave-balance/leaveBalance.service");
const attendanceService = require("../attendance/attendance.service");
const notificationService = require("../notification/notification.service");
const AppError = require("../../utils/AppError");

const calculateDays = (start, end) =>
    Math.floor((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;

const getManagedDepartmentIds = async (userId, companyId, session = null) => {
    const managerEmployee = await Employee.findOne({
        user: userId,
        company: companyId,
        isDeleted: false
    }).session(session);
    if (!managerEmployee) return [];

    const departments = await Department.find({
        manager: managerEmployee._id,
        company: companyId,
        isDeleted: false
    }).session(session).select("_id");

    return departments.map(d => d._id.toString());
};

const createLeave = async (data, user) => {
    if (user.role === "EMPLOYEE") {
        const employeeProfile = await Employee.findOne({
            user: user.id,
            company: user.company,
            isDeleted: false
        });
        if (!employeeProfile) {
            throw new AppError("Employee profile not found", 404);
        }
        data.employee = employeeProfile._id.toString();
    }

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
            _id: data.employee,
            company: user.company,
            isDeleted: false
        });
        if (!targetEmployee || !targetEmployee.department || !deptIds.includes(targetEmployee.department.toString())) {
            throw new AppError("Employee not assigned under this manager", 403);
        }
    }

    const employee = await Employee.findOne({
        _id: data.employee,
        company: user.company,
        status: "ACTIVE",
        isDeleted: false
    });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    const exists = await Leave.findOne({
        employee: data.employee,
        status: {
            $in: ["PENDING", "APPROVED"]
        },
        startDate: {
            $lte: data.endDate
        },
        endDate: {
            $gte: data.startDate
        }
    });

    if (exists) {
        throw new AppError("Leave already exists for selected dates", 409);
    }

    return Leave.create({
        ...data,
        company: user.company,
        totalDays: calculateDays(data.startDate, data.endDate),
        createdBy: user.id
    });
};

const approveLeave = async (id, user) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const leave = await Leave.findOne({
            _id: id,
            company: user.company
        }).session(session);

        if (!leave) {
            throw new AppError("Leave request not found", 404);
        }

        if (leave.status !== "PENDING") {
            throw new AppError("Leave already processed", 400);
        }

        if (user.role === "MANAGER") {
            const managerEmployee = await Employee.findOne({
                user: user.id,
                company: user.company,
                isDeleted: false
            }).session(session);
            if (!managerEmployee) {
                throw new AppError("Manager employee profile not found", 404);
            }
            const deptIds = await getManagedDepartmentIds(user.id, user.company, session);

            const targetEmployee = await Employee.findOne({
                _id: leave.employee,
                company: user.company,
                isDeleted: false
            }).session(session);

            if (!targetEmployee || !targetEmployee.department || !deptIds.includes(targetEmployee.department.toString())) {
                throw new AppError("Unauthorized to approve leave for this employee", 403);
            }
        }

        const employee = await Employee.findOne({
            _id: leave.employee,
            company: user.company,
            isDeleted: false
        }).session(session);

        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        await leaveBalanceService.checkAvailableLeave(
            leave.employee,
            user.company,
            leave.leaveType,
            leave.totalDays,
            session
        );

        await leaveBalanceService.deductLeave(
            leave.employee,
            user.company,
            leave.leaveType,
            leave.totalDays,
            session
        );

        await attendanceService.createLeaveAttendance(
            leave.employee,
            user.company,
            leave.startDate,
            leave.endDate,
            session
        );

        Object.assign(leave, {
            status: "APPROVED",
            approvedBy: user.id,
            approvedAt: new Date()
        });

        await leave.save({ session });

        await session.commitTransaction();

        if (employee.user) {
            await notificationService.sendNotification({
                user: employee.user,
                type: "LEAVE",
                priority: "MEDIUM",
                title: "Leave Approved",
                message: "Your leave request has been approved.",
                reference: {
                    module: "LEAVE",
                    id: leave._id
                }
            }, user.company, user.id);
        }

        return leave;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const rejectLeave = async (id, reason, user) => {
    const leave = await Leave.findOne({
        _id: id,
        company: user.company
    });

    if (!leave) {
        throw new AppError("Leave request not found", 404);
    }

    if (leave.status !== "PENDING") {
        throw new AppError("Leave already processed", 400);
    }

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
            _id: leave.employee,
            company: user.company,
            isDeleted: false
        });

        if (!targetEmployee || !targetEmployee.department || !deptIds.includes(targetEmployee.department.toString())) {
            throw new AppError("Unauthorized to reject leave for this employee", 403);
        }
    }

    Object.assign(leave, {
        status: "REJECTED",
        rejectionReason: reason,
        approvedBy: user.id,
        approvedAt: new Date()
    });

    await leave.save();

    return leave;
};

const cancelLeave = async (id, user) => {
    const leave = await Leave.findOne({
        _id: id,
        company: user.company
    });

    if (!leave) {
        throw new AppError("Leave request not found", 404);
    }

    if (leave.status !== "APPROVED") {
        throw new AppError("Only approved leave can be cancelled", 400);
    }

    if (user.role === "EMPLOYEE") {
        const employeeProfile = await Employee.findOne({
            user: user.id,
            company: user.company,
            isDeleted: false
        });
        if (!employeeProfile || leave.employee.toString() !== employeeProfile._id.toString()) {
            throw new AppError("Unauthorized to cancel this leave request", 403);
        }
    }

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
            _id: leave.employee,
            company: user.company,
            isDeleted: false
        });

        if (!targetEmployee || !targetEmployee.department || !deptIds.includes(targetEmployee.department.toString())) {
            throw new AppError("Unauthorized to cancel leave for this employee", 403);
        }
    }

    await leaveBalanceService.restoreLeave(
        leave.employee,
        user.company,
        leave.leaveType,
        leave.totalDays
    );

    leave.status = "CANCELLED";

    await leave.save();

    return leave;
};

const getEmployeeLeaves = async (employeeId, user) => {
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

    const employee = await Employee.findOne({
        _id: employeeId,
        company: user.company,
        isDeleted: false
    });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    return Leave.find({
        employee: employeeId,
        company: user.company
    }).sort({
        createdAt: -1
    });
};

const getLeaves = async (query = {}, user) => {
    const companyId = user.company;
    const filters = { company: companyId };

    if (user.role === "MANAGER") {
        const deptIds = await getManagedDepartmentIds(user.id, companyId);
        const teamEmployees = await Employee.find({
            department: { $in: deptIds },
            company: companyId,
            isDeleted: false
        }).select("_id");
        const employeeIds = teamEmployees.map(e => e._id);
        filters.employee = { $in: employeeIds };
    }

    if (query.status) {
        filters.status = query.status;
    }

    if (query.employeeId) {
        filters.employee = query.employeeId;
    }

    if (query.search) {
        const matchingEmployees = await Employee.find({
            company: companyId,
            isDeleted: false,
            $or: [
                { "personalInfo.firstName": { $regex: query.search, $options: "i" } },
                { "personalInfo.lastName": { $regex: query.search, $options: "i" } }
            ]
        }).select("_id");
        
        const empIds = matchingEmployees.map(e => e._id);
        if (filters.employee) {
            if (filters.employee.$in) {
                filters.employee.$in = filters.employee.$in.filter(id => empIds.some(empId => empId.toString() === id.toString()));
            } else {
                const singleId = filters.employee;
                if (!empIds.some(empId => empId.toString() === singleId.toString())) {
                    filters.employee = { $in: [] };
                }
            }
        } else {
            filters.employee = { $in: empIds };
        }
    }

    return Leave.find(filters)
        .populate("employee")
        .sort({ createdAt: -1 });
};

module.exports = {
    createLeave,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getEmployeeLeaves,
    getLeaves
};