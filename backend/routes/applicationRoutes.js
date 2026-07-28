const express = require("express");
const router = express.Router();

console.log("✅ applicationRoutes loaded");

const {
  createApplicationController,
} = require("../controllers/applicationController");

router.post("/", createApplicationController);

module.exports = router;