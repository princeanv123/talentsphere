const {
  getAllCandidates,
  searchCandidates,
} = require("../services/candidateSearchService");
console.log({
  getAllCandidates,
  searchCandidates,
});
const searchCandidate = async (req, res) => {
  try {
    const {
      keyword,
      location,
      experience,
    } = req.query;

    const candidates = await searchCandidates({
      keyword,
      location,
      experience,
    });

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
  searchCandidate,
};