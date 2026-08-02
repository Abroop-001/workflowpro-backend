const express = require("express");
const router = express.Router();

const selfServiceController = require("./selfService.controller");
const protect = require("../../middleware/auth.middleware");

router.use(protect);

router.get("/profile", selfServiceController.getMyProfile);
router.get("/attendance", selfServiceController.getMyAttendance);
router.get("/leave-balance", selfServiceController.getMyLeaveBalance);
router.get("/leaves", selfServiceController.getMyLeaves);
router.get("/payslips", selfServiceController.getMyPayslips);
router.get("/documents", selfServiceController.getMyDocuments);

module.exports = router;
