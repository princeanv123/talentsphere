const express = require("express");

const router = express.Router();

const {
  getResumeAuthenticityController,
} = require("../controllers/resumeAuthenticityController");

router.post(
  "/",
  getResumeAuthenticityController
);

module.exports = router;