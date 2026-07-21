const express = require("express");
const router = express.Router();

console.log("✅ jobRoutes loaded");

const {
  createJobController,
  getAllJobsController,
} = require("../controllers/jobController");

router.post("/", createJobController);
router.get("/", (req, res, next) => {
  console.log("✅ GET /api/jobs route hit");
  next();
}, getAllJobsController);

module.exports = router;