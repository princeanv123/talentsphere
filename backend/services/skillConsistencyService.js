const supabase = require("../config/supabase");
const {
  getCandidateProfile,
} = require("./candidateProfileService");

const calculateSkillConsistency = async (
  candidateId,
  jobId
) => {

  // Load Candidate Profile
  const {
    skills,
  } = await getCandidateProfile(candidateId);

  // Fetch Job Skills
  const { data: jobSkillRows, error } = await supabase
    .from("job_skills")
    .select(`
      skill_id,
      skills (
        skill_name
      )
    `)
    .eq("job_id", jobId);

  if (error) {
    throw new Error("Unable to fetch job skills.");
  }

  const candidateSkills = skills.map(
    item => item.skills.skill_name
  );

  const jobSkills = jobSkillRows.map(
    item => item.skills.skill_name
  );

  // Normalize
  const normalizedCandidateSkills =
    candidateSkills.map(skill =>
      skill.trim().toLowerCase()
    );

  const normalizedJobSkills =
    jobSkills.map(skill =>
      skill.trim().toLowerCase()
    );

  // Matching Skills
  const matchingSkills =
    candidateSkills.filter(skill =>
      normalizedJobSkills.includes(
        skill.trim().toLowerCase()
      )
    );

  // Missing Skills
  const missingSkills =
    jobSkills.filter(skill =>
      !normalizedCandidateSkills.includes(
        skill.trim().toLowerCase()
      )
    );

  // Extra Skills
  const extraSkills =
    candidateSkills.filter(skill =>
      !normalizedJobSkills.includes(
        skill.trim().toLowerCase()
      )
    );

  // Score
  if (jobSkills.length === 0) {

  return {

    skillConsistencyScore: null,

    status: "Not Evaluated",

    message:
      "No skills have been configured for this job.",

    matchingSkills: [],

    missingSkills: [],

    extraSkills: candidateSkills,

  };

}

  // Status
  let status = "Poor";

  if (skillConsistencyScore >= 90) {
    status = "Excellent";
  } else if (skillConsistencyScore >= 70) {
    status = "Good";
  } else if (skillConsistencyScore >= 50) {
    status = "Average";
  }

  return {

    skillConsistencyScore,

    status,

    matchingSkills,

    missingSkills,

    extraSkills,

  };

};

module.exports = {
  calculateSkillConsistency,
};