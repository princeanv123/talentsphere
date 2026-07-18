const { uploadResume } = require("../services/resumeService");

const uploadResumeController = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded.",
      });
    }

    console.log("File:", req.file);

    // Upload resume and create candidate automatically
    const uploadedResume = await uploadResume(req.file);

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: uploadedResume,
    });

  } catch (error) {
    console.error("Resume Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadResumeController,
};