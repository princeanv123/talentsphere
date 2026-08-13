const {
  getAllCandidates,
  getCandidateById,
} = require("../services/candidateSearchService");

const {
  searchCandidatesHybrid,
} = require("../services/candidateHybridSearchService");

const {
  updateCandidate,
} = require("../services/candidateUpdateService");

const {
  deleteCandidate,
} = require("../services/candidateDeleteService");


console.log({
  getAllCandidates,
  searchCandidatesHybrid,
});


// ======================================================
// Candidate Search
// ======================================================

const searchCandidate = async (req, res) => {
  try {
    console.log("🔎 searchCandidate controller HIT");
    console.log("Query:", req.query);

    const {
      keyword,
      location,
      experience,
    } = req.query;

    const candidates = await searchCandidatesHybrid({
      query: keyword,
      location,
      experience,
    });

    console.log(
      "✅ searchCandidatesHybrid returned:",
      candidates
    );

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });

  } catch (error) {
    console.error("❌ Candidate search error:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// Candidate Listing
// ======================================================

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


// ======================================================
// Candidate Details
// ======================================================

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


// ======================================================
// Update Candidate
// ======================================================

const updateCandidateController = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const candidate = await updateCandidate(
      req.params.id,
      req.body
    );

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


// ======================================================
// Delete Candidate
// ======================================================

const deleteCandidateController = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await deleteCandidate(id);

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
      data: candidate,
    });

  } catch (error) {
    console.error(error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// Exports
// ======================================================

module.exports = {
  getCandidates,
  searchCandidate,
  getCandidateDetails,
  updateCandidateController,
  deleteCandidateController,
};