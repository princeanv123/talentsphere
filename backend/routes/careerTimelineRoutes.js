const express = require("express");

const router = express.Router();

const {
  getCareerTimelineController,
} = require("../controllers/careerTimelineController");

router.get(
  "/:candidateId",
  getCareerTimelineController
);

module.exports = router;