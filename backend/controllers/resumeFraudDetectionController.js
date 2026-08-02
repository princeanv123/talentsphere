const {
  evaluateResumeFraud,
} = require("../services/resumeFraudDetectionService");

const getResumeFraudDetectionController = async (
  req,
  res
) => {

  try {

    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "candidateId is required.",
      });
    }

    const result = await evaluateResumeFraud(candidateId);

    return res.status(200).json({
      success: true,
      message: "Resume fraud analysis completed successfully.",
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
  getResumeFraudDetectionController,
};