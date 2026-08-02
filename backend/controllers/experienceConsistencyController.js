const {
  evaluateExperienceConsistency,
} = require("../services/experienceConsistencyService");

console.log(
  "experienceConsistencyService:",
  require("../services/experienceConsistencyService")
);

const getExperienceConsistencyController = async (req, res) => {

  try {

    const { candidateId } = req.params;

    const result =
      await evaluateExperienceConsistency(candidateId);

    res.status(200).json({
      success: true,
      message: "Experience consistency evaluated successfully.",
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
  getExperienceConsistencyController,
};