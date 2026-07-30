const supabase = require("../config/supabase");

const saveMatchHistory = async (candidateId, jobId, analysis) => {

  const { data, error } = await supabase
    .from("candidate_matches")
    .insert([
      {
        candidate_id: candidateId,
        job_id: jobId,
        match_score: analysis.matchScore,
        matching_skills: analysis.matchingSkills,
        missing_skills: analysis.missingSkills,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendation: analysis.recommendation,
        summary: analysis.summary,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Unable to save match history: ${error.message}`);
  }

  return data;
};

module.exports = {
  saveMatchHistory,
};