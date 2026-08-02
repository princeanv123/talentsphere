const {
  calculateSkillConsistency,
} = require("../services/skillConsistencyService");

const getSkillConsistencyController = async (req, res) => {

  try {

    const { candidateId, jobId } = req.body;

    const result = await calculateSkillConsistency(
      candidateId,
      jobId
    );

    res.status(200).json({
      success: true,
      message: "Skill consistency evaluated successfully.",
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
  getSkillConsistencyController,
};