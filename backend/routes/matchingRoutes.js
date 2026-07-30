const express = require("express");
const router = express.Router();

const {
  getMatchingScoreController,
  getCandidatesForJobController,
} = require("../controllers/matchingController");


console.log({ getMatchingScoreController });

router.post("/score", getMatchingScoreController);

router.get(
  "/job/:jobId",
  getCandidatesForJobController
);

module.exports = router;