const {
  getAllCandidates,
  searchCandidates,
  getCandidateById,
} = require("../services/candidateSearchService");
const { updateCandidate } = require("../services/candidateUpdateService");
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
const getCandidateDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await getCandidateById(id);

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCandidateController = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const candidate = await updateCandidate(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: candidate,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getCandidates,
  searchCandidate,
  getCandidateDetails,
  updateCandidateController,
};