const {
  analyzeCandidate,
} = require("../services/candidateAnalysisService");

const analyzeCandidateController = async (req, res) => {

  try {

    const { candidateId, jobId } = req.body;

    if (!candidateId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "candidateId and jobId are required.",
      });
    }

    const result = await analyzeCandidate(
      candidateId,
      jobId
    );

    return res.status(200).json({
      success: true,
      message: "AI analysis completed successfully.",
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
  analyzeCandidateController,
};