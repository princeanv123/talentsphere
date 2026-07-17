const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
    uploadResumeController,
} = require("../controllers/resumeController");

const router = express.Router();

router.post(
    "/upload",
    upload.single("resume"),
    uploadResumeController
);

module.exports = router;