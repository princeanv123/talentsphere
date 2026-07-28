const express = require("express");
const router = express.Router();

console.log("✅ jobRoutes loaded");

const {
  createJobController,
  getAllJobsController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
} = require("../controllers/jobController");

router.post("/", createJobController);

router.get("/", getAllJobsController);

router.get("/:id", getJobByIdController);

router.put("/:id", updateJobController);

router.delete("/:id", deleteJobController);

module.exports = router;