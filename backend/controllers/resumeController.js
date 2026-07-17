const { uploadResume } = require("../services/resumeService");

const uploadResumeController = async (req, res) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "candidateId is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded.",
      });
    }
console.log("Body:", req.body);
console.log("File:", req.file);
    const uploadedResume = await uploadResume(candidateId, req.file);

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