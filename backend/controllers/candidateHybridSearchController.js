const {
  searchCandidatesHybrid,
} = require("../services/candidateHybridSearchService");

// ======================================================
// Hybrid Candidate Search Controller
// ======================================================

const searchCandidatesHybridController = async (
  req,
  res
) => {
  try {

    const {
      query,
      location,
      experience,
      limit,
    } = req.body;

    console.log("======================================");
    console.log(
      "HYBRID SEARCH REQUEST RECEIVED"
    );
    console.log("Query:", query);
    console.log("Location:", location);
    console.log("Experience:", experience);
    console.log("Limit:", limit);
    console.log("======================================");

    const results =
      await searchCandidatesHybrid({
        query,
        location,
        experience,
        limit:
          limit !== undefined
            ? Number(limit)
            : 10,
      });

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });

  } catch (error) {

    console.error(
      "Hybrid candidate search error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Hybrid candidate search failed",
    });
  }
};

// ======================================================

module.exports = {
  searchCandidatesHybridController,
};