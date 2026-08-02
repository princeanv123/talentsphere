const {
  evaluateResumeAuthenticity,
} = require("../services/resumeAuthenticityService");

const getResumeAuthenticityController = async (
  req,
  res
) => {

  try {

    const { candidateId, jobId } = req.body;

    const result =
      await evaluateResumeAuthenticity(
        candidateId,
        jobId
      );

    res.status(200).json({
      success: true,
      message: "Resume authenticity evaluated successfully.",
      data: result,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getResumeAuthenticityController,
};