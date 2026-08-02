const supabase = require("../config/supabase");
const normalizeDate = (date) => {

  if (!date) return null;

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().split("T")[0];

};
/**
 * Save Candidate Employment History
 */
const saveCandidateExperience = async (
  candidateId,
  employmentHistory = []
) => {

  if (!employmentHistory || employmentHistory.length === 0) {
    return;
  }

  // =====================================
  // Remove existing employment history
  // =====================================

  const { error: deleteError } = await supabase
    .from("candidate_experience")
    .delete()
    .eq("candidate_id", candidateId);

  if (deleteError) {
    throw deleteError;
  }

  // =====================================
  // Prepare records
  // =====================================

  const records = employmentHistory.map((job) => ({

    candidate_id: candidateId,

    company_name: job.company_name || "",

    job_title: job.job_title || "",

    employment_type: job.employment_type || "",

    industry: job.industry || "",

    company_size: job.company_size || "",

    location: job.location || "",

    start_date: normalizeDate(job.start_date),

    end_date: normalizeDate(job.end_date),

    currently_working:
      job.currently_working || false,

    duration_text:
      job.duration_text || "",

    responsibilities:
      job.responsibilities || "",

    technologies:
      Array.isArray(job.technologies)
        ? job.technologies.join(", ")
        : "",

    achievements:
      job.achievements || "",

    manager_name:
      job.manager_name || "",

  }));

  // =====================================
  // Save employment history
  // =====================================

  const { error } = await supabase
    .from("candidate_experience")
    .insert(records);

  if (error) {
    throw error;
  }

};

/**
 * Get Candidate Employment History
 */
const getCandidateExperience = async (
  candidateId
) => {

  const { data, error } = await supabase
    .from("candidate_experience")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("start_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data || [];

};

module.exports = {
  saveCandidateExperience,
  getCandidateExperience,
};