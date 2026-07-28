const express = require("express");
const router = express.Router();

console.log("✅ jobRoutes loaded");

const {
  createJobController,
  getAllJobsController,
  getJobByIdController,
  updateJobController,
} = require("../controllers/jobController");

router.post("/", createJobController);

router.get("/", getAllJobsController);

router.get("/:id", getJobByIdController);

router.put("/:id", updateJobController);

module.exports = router;