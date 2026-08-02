
const express = require("express");
const router = express.Router();

const {
  getSkillConsistencyController,
} = require("../controllers/skillConsistencyController");

router.post(
  "/",
  getSkillConsistencyController
);

module.exports = router;