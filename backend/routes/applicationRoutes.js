const express = require("express");
const router = express.Router();

console.log("✅ applicationRoutes loaded");

const {
  createApplicationController,
  getApplicationsByJobController,
  getApplicationsByCandidateController,
  updateApplicationStatusController,
  deleteApplicationController,
} = require("../controllers/applicationController");

router.post("/", createApplicationController);

router.get("/jobs/:jobId", getApplicationsByJobController);

router.get("/candidates/:candidateId", getApplicationsByCandidateController);

router.put("/:id/status", updateApplicationStatusController);

router.delete("/:id", deleteApplicationController);

module.exports = router;