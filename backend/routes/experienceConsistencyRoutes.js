const express = require("express");

const router = express.Router();

const {
  getExperienceConsistencyController,
} = require("../controllers/experienceConsistencyController");

router.get(
  "/:candidateId",
  getExperienceConsistencyController
);
console.log(
  "experienceConsistencyController:",
  require("../controllers/experienceConsistencyController")
);
module.exports = router;