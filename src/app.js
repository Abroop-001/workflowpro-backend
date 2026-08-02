const express = require("express");
const path = require("path");
const helmet = require("helmet");

const errorHandler = require("./middleware/error.middleware");
const sanitizeMiddleware = require("./middleware/sanitize.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const companyRoutes = require("./modules/company/company.routes");
const employeeRoutes = require("./modules/employee/employee.routes");
const departmentRoutes = require("./modules/department/department.routes");
const attendanceRoutes = require("./modules/attendance/attendance.routes");
const leaveRoutes = require("./modules/leave/leave.routes");
const payrollRoutes = require("./modules/payroll/payroll.routes");
const salaryStructureRoutes = require("./modules/payroll/salaryStructure.routes");
const leaveBalanceRoutes = require("./modules/leave-balance/leaveBalance.routes");
const shiftRoutes = require("./modules/shift/shift.routes");
const payslipRoutes = require("./modules/payslip/payslip.routes");
const performanceRoutes = require("./modules/performance/performance.routes");
const recruitmentRoutes = require("./modules/recruitment/recruitment.routes");
const documentRoutes = require("./modules/document/document.routes");
const notificationRoutes = require("./modules/notification/notification.routes");
const auditLogRoutes = require("./modules/audit-log/auditLog.routes");
const interviewRoutes = require("./modules/recruitment/interview.routes");
const userRoutes = require("./modules/user/user.routes");
const selfServiceRoutes = require("./modules/self-service/selfService.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

const protect = require("./middleware/auth.middleware");

const blockSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === "SUPER_ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied"
        });
    }
    next();
};

const app = express();

app.use(helmet());


// CORS Middleware
app.use((req, res, next) => {
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176"
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


app.use(express.json());
app.use(sanitizeMiddleware);


app.use(
    "/uploads",
    protect,
    blockSuperAdmin,
    express.static(path.join(__dirname, "../uploads"))
);


app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/salary-structures", salaryStructureRoutes);
app.use("/api/leave-balance", leaveBalanceRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/recruitment/interviews", interviewRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/self-service", selfServiceRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.use(errorHandler);

module.exports = app;