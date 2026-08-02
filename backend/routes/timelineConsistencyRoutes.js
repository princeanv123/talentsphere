const express = require("express");

const router = express.Router();

const {
  getTimelineConsistencyController,
} = require("../controllers/timelineConsistencyController");

router.get(
  "/:candidateId",
  getTimelineConsistencyController
);

module.exports = router;