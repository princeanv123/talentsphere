const {
  evaluateTimelineConsistency,
} = require("../services/timelineConsistencyService");

const getTimelineConsistencyController = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const result = await evaluateTimelineConsistency(candidateId);

    res.status(200).json({
      success: true,
      message: "Timeline consistency evaluated successfully.",
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
  getTimelineConsistencyController,
};