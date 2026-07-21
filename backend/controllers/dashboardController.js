const { getDashboardStats } = require("../services/dashboardService");

const getDashboard = async (req, res) => {
  try {
    const dashboard = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};