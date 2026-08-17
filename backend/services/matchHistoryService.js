const supabase = require("../config/supabase");

const saveMatchHistory = async (
  candidateId,
  jobId,
  analysis
) => {

  // ----------------------------------------------------
  // Validate required data
  // ----------------------------------------------------

  if (!candidateId) {
    throw new Error("candidateId is required.");
  }

  if (!jobId) {
    throw new Error("jobId is required.");
  }

  if (!analysis) {
    throw new Error("Match analysis is required.");
  }


  // ----------------------------------------------------
  // Map Gemini analysis to database structure
  // ----------------------------------------------------

  const matchData = {

    candidate_id: candidateId,

    job_id: jobId,

    // Gemini: overallMatch
    match_score:
      typeof analysis.overallMatch === "number"
        ? analysis.overallMatch
        : null,

    // These will be populated later by our
    // local skill-matching engine if available.
    matching_skills:
      Array.isArray(analysis.matchingSkills)
        ? analysis.matchingSkills
        : [],

    missing_skills:
      Array.isArray(analysis.missingSkills)
        ? analysis.missingSkills
        : [],

    // Gemini: strengths
    strengths:
      Array.isArray(analysis.strengths)
        ? analysis.strengths
        : [],

    // Gemini: gaps
    weaknesses:
      Array.isArray(analysis.gaps)
        ? analysis.gaps
        : [],

    // Gemini: recommendation
    recommendation:
      analysis.recommendation || null,

    // Generate a readable summary
    summary:
      analysis.summary ||
      `Overall match: ${
        typeof analysis.overallMatch === "number"
          ? analysis.overallMatch
          : "N/A"
      }%. Recommendation: ${
        analysis.recommendation || "N/A"
      }`,
  };


  // ----------------------------------------------------
  // Save to candidate_matches
  // ----------------------------------------------------

  const { data, error } = await supabase
    .from("candidate_matches")
    .insert([matchData])
    .select()
    .single();


  // ----------------------------------------------------
  // Handle database error
  // ----------------------------------------------------

  if (error) {

    console.error(
      "❌ Failed to save match history:",
      error
    );

    throw new Error(
      `Unable to save match history: ${error.message}`
    );
  }


  // ----------------------------------------------------
  // Success
  // ----------------------------------------------------

  console.log(
    "✅ Match history saved:",
    data.id
  );

  return data;
};


module.exports = {
  saveMatchHistory,
};