const express = require("express");

const router = express.Router();

const {
  getResumeCompletenessController,
} = require("../controllers/resumeCompletenessController");

// GET Resume Completeness Report
router.get(
  "/:candidateId",
  getResumeCompletenessController
);

module.exports = router;