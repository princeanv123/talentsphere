const supabase = require("../config/supabase");

// ========================================
// Candidate Listing
// ========================================

const getAllCandidates = async () => {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// ========================================
// Candidate Search
// ========================================

const searchCandidates = async ({
  keyword,
  location,
  experience,
}) => {
  let query = supabase
    .from("candidates")
    .select("*");

  if (keyword) {
    query = query.or(
      `full_name.ilike.%${keyword}%,email.ilike.%${keyword}%`
    );
  }

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  if (experience) {
    query = query.gte("experience", experience);
  }

  const { data, error } = await query.order("experience", {
    ascending: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// ========================================
// Candidate Details
// ========================================

const getCandidateById = async (candidateId) => {
  // Candidate Details
  const { data: candidate, error: candidateError } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (candidateError) {
    throw new Error(candidateError.message);
  }

  // Candidate Skills
  const { data: skills, error: skillsError } = await supabase
    .from("candidate_skills")
    .select("*")
    .eq("candidate_id", candidateId);

  if (skillsError) {
    throw new Error(skillsError.message);
  }

  // Candidate Education
  const { data: education, error: educationError } = await supabase
    .from("education")
    .select("*")
    .eq("candidate_id", candidateId);

  if (educationError) {
    throw new Error(educationError.message);
  }

  // Candidate Certifications
  const { data: certifications, error: certificationsError } = await supabase
    .from("certifications")
    .select("*")
    .eq("candidate_id", candidateId);

  if (certificationsError) {
    throw new Error(certificationsError.message);
  }

  // Resume History
  const { data: resumeHistory, error: resumeHistoryError } = await supabase
    .from("resumes")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("uploaded_at", { ascending: false });

  if (resumeHistoryError) {
    throw new Error(resumeHistoryError.message);
  }

  return {
    candidate,
    skills,
    education,
    certifications,
    resumeHistory,
  };
};

// ========================================
// Exports
// ========================================

module.exports = {
  getAllCandidates,
  searchCandidates,
  getCandidateById,
};