const express = require("express");
const router = express.Router();

const {
  getMatchingScoreController,
  getCandidatesForJobController,
} = require("../controllers/matchingController");

const {
  analyzeCandidateController,
} = require("../controllers/candidateAnalysisController");

router.post("/score", getMatchingScoreController);

router.get(
  "/job/:jobId",
  getCandidatesForJobController
);
router.post(
  "/analyze",
  analyzeCandidateController
);
module.exports = router;