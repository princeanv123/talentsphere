const {
  getMatchingScore,
  getCandidatesForJob,
} = require("../services/matchingService");

// ---------------------------------------------------
// AI Match Score
// ---------------------------------------------------

const getMatchingScoreController = async (req, res) => {
  try {
    const result = await getMatchingScore(req.body);

    res.status(200).json({
      success: true,
      message: "AI Matching endpoint is ready.",
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

// ---------------------------------------------------
// Candidate Discovery
// ---------------------------------------------------

const getCandidatesForJobController = async (req, res) => {
  try {
    const { jobId } = req.params;

    const result = await getCandidatesForJob(jobId);

    res.status(200).json({
      success: true,
      message: "Candidates discovered successfully.",
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
  getMatchingScoreController,
  getCandidatesForJobController,
};