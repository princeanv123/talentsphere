const supabase = require("../config/supabase");

const getCandidateProfile = async (candidateId) => {

  // Candidate
  const { data: candidate, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (error || !candidate) {
    throw new Error("Candidate not found.");
  }

  // Skills
  const { data: skills } = await supabase
    .from("candidate_skills")
    .select(`
      skill_id,
      skills (
        skill_name
      )
    `)
    .eq("candidate_id", candidateId);

  // Education
  const { data: education } = await supabase
    .from("education")
    .select("*")
    .eq("candidate_id", candidateId);

  // Certifications
  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .eq("candidate_id", candidateId);

  // Projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("candidate_id", candidateId);

  return {

    candidate,

    skills: skills || [],

    education: education || [],

    certifications: certifications || [],

    projects: projects || []

  };

};

module.exports = {
  getCandidateProfile,
};