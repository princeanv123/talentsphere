const {
  getCareerTimeline,
} = require("../services/careerTimelineService");

const getCareerTimelineController = async (
  req,
  res
) => {

  try {

    const { candidateId } = req.params;

    const timeline =
      await getCareerTimeline(candidateId);

    res.status(200).json({

      success: true,

      message:
        "Career timeline fetched successfully.",

      data: timeline,

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
  getCareerTimelineController,
};