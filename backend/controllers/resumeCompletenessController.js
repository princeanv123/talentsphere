const {
  calculateResumeCompleteness,
} = require("../services/resumeCompletenessService");

const getResumeCompletenessController = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const result = await calculateResumeCompleteness(candidateId);

    return res.status(200).json({
      success: true,
      message: "Resume completeness calculated successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getResumeCompletenessController,
};