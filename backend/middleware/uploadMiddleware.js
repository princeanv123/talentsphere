const multer = require("multer");
const path = require("path");

// Store uploaded file temporarily in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    console.log("Received MIME Type:", file.mimetype);
    console.log("Received File:", file.originalname);

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});

module.exports = upload;