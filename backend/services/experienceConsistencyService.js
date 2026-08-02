const {
  getCandidateProfile,
} = require("./candidateProfileService");

const evaluateExperienceConsistency = async (
  candidateId
) => {

  const {
    candidate,
  } = await getCandidateProfile(candidateId);

  let score = 100;

  const issues = [];

  const claimedExperience =
    Number(candidate.experience) || 0;

  // Missing Experience
  if (!candidate.experience) {
    issues.push("Total experience missing.");
    score -= 20;
  }

  // Unrealistic Experience
  if (claimedExperience > 45) {
    issues.push("Unrealistic total experience.");
    score -= 30;
  }

  // Negative Experience
  if (claimedExperience < 0) {
    issues.push("Negative experience detected.");
    score -= 50;
  }

  // Resume Missing
  if (!candidate.resume_url) {
    issues.push("Resume not uploaded.");
    score -= 10;
  }

  // Clamp score
  if (score < 0) {
    score = 0;
  }

  let status = "Poor";

  if (score >= 95) {
    status = "Excellent";
  } else if (score >= 80) {
    status = "Good";
  } else if (score >= 60) {
    status = "Average";
  }

  return {

    experienceConsistencyScore: score,

    status,

    claimedExperience,

    issues,

  };

};

module.exports = {
  evaluateExperienceConsistency,
};