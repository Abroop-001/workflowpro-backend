const dashboardService = require("./dashboard.service");

const getStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.getDashboardStats(req.user.company);
        res.status(200).json({
            success: true,
            data: { stats }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStats
};
