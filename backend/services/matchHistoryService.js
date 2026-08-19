const supabase = require("../config/supabase");


// ======================================================
// Save Candidate Match Analysis
// ======================================================

const saveMatchHistory = async (
  candidateId,
  jobId,
  analysis
) => {

  // ====================================================
  // Validate
  // ====================================================

  if (!candidateId) {
    throw new Error("candidateId is required.");
  }

  if (!jobId) {
    throw new Error("jobId is required.");
  }

  if (!analysis) {
    throw new Error("Match analysis is required.");
  }


  // ====================================================
  // Prepare Database Record
  // ====================================================

  const matchData = {

    candidate_id: candidateId,

    job_id: jobId,

    match_score:
      typeof analysis.overallMatch === "number"
        ? analysis.overallMatch
        : null,

    matching_skills:
      Array.isArray(analysis.matchingSkills)
        ? analysis.matchingSkills
        : [],

    missing_skills:
      Array.isArray(analysis.missingSkills)
        ? analysis.missingSkills
        : [],

    strengths:
      Array.isArray(analysis.strengths)
        ? analysis.strengths
        : [],

    weaknesses:
      Array.isArray(analysis.gaps)
        ? analysis.gaps
        : [],

    recommendation:
      analysis.recommendation || null,

    summary:
      analysis.summary || null,
  };


  // ====================================================
  // Insert Match History
  // ====================================================

  const {
    data,
    error,
  } = await supabase
    .from("candidate_matches")
    .insert([matchData])
    .select()
    .single();


  // ====================================================
  // Handle Error
  // ====================================================

  if (error) {

    console.error(
      "❌ Failed to save match history:"
    );

    console.error(error);

    throw new Error(
      `Unable to save match history: ${error.message}`
    );
  }


  // ====================================================
  // Success
  // ====================================================

  console.log(
    "======================================"
  );

  console.log(
    "✅ MATCH HISTORY SAVED"
  );

  console.log(
    "Match ID:",
    data.id
  );

  console.log(
    "Candidate ID:",
    candidateId
  );

  console.log(
    "Job ID:",
    jobId
  );

  console.log(
    "AI Match Score:",
    data.match_score
  );

  console.log(
    "Recommendation:",
    data.recommendation
  );

  console.log(
    "======================================"
  );


  return data;
};


// ======================================================

module.exports = {
  saveMatchHistory,
};