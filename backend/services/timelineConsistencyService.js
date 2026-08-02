const supabase = require("../config/supabase");

const checkTimelineConsistency = async (candidateId) => {

  const issues = [];
  let score = 100;

  const { data: candidate, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (error || !candidate) {
    throw new Error("Candidate not found.");
  }

  // Experience
  if (!candidate.experience || candidate.experience <= 0) {
    issues.push("Experience not available.");
    score -= 20;
  }

  if (candidate.experience > 50) {
    issues.push("Experience appears unrealistic.");
    score -= 20;
  }

  // Summary
  if (!candidate.summary) {
    issues.push("Summary missing.");
    score -= 10;
  }

  // Resume
  if (!candidate.resume_url) {
    issues.push("Resume not uploaded.");
    score -= 20;
  }

  // Location
  if (!candidate.location) {
    issues.push("Location missing.");
    score -= 10;
  }

  // Education
  const { data: education } = await supabase
    .from("education")
    .select("*")
    .eq("candidate_id", candidateId);

  if (!education || education.length === 0) {
    issues.push("Education details missing.");
    score -= 10;
  }

  const status =
    score >= 90
      ? "Excellent"
      : score >= 75
      ? "Good"
      : score >= 50
      ? "Needs Review"
      : "Poor";

  return {
    timelineScore: Math.max(score, 0),
    status,
    issues,
  };
};

module.exports = {
  checkTimelineConsistency,
};