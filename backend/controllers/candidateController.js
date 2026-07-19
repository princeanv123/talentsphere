const {
  getAllCandidates,
} = require("../services/candidateSearchService");

const getCandidates = async (req, res) => {
  try {
    const candidates = await getAllCandidates();

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
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
  getCandidates,
};