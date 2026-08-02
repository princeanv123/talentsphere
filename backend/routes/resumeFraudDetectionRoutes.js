const express = require("express");

const router = express.Router();

const {
  getResumeFraudDetectionController,
} = require("../controllers/resumeFraudDetectionController");

router.post(
  "/",
  getResumeFraudDetectionController
);

module.exports = router;