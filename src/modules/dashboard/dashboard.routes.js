const express = require("express");
const router = express.Router();

const dashboardController = require("./dashboard.controller");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");

router.get(
    "/stats",
    protect,
    authorize("COMPANY_ADMIN", "HR", "MANAGER", "SUPER_ADMIN"),
    dashboardController.getStats
);

module.exports = router;
