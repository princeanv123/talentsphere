const express = require("express");

const {
  getSystemHealth,
} = require("../services/systemHealthService");

const router = express.Router();


// ======================================================
// GET /api/health
// ======================================================

router.get("/", async (req, res) => {

  try {

    const health = await getSystemHealth();

    const statusCode =
      health.status === "healthy"
        ? 200
        : 503;

    res.status(statusCode).json(health);

  } catch (error) {

    console.error("System health check failed:", error);

    res.status(500).json({
      success: false,
      status: "failed",
      message: "System health check could not be completed.",
      error: error.message,
    });

  }

});


module.exports = router;