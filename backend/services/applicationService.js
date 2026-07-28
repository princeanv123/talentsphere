const supabase = require("../config/supabase");

const createApplication = async (applicationData) => {
  const { data, error } = await supabase
    .from("job_applications")
    .insert(applicationData)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const getApplicationsByJob = async (jobId) => {
  const { data, error } = await supabase
    .from("job_applications")
    .select(`
      id,
      status,
      recruiter_notes,
      applied_at,
      interview_date,
      candidates (
        id,
        full_name,
        email,
        phone,
        experience,
        location
      )
    `)
    .eq("job_id", jobId)
    .order("applied_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
const getApplicationsByCandidate = async (candidateId) => {
  const { data, error } = await supabase
    .from("job_applications")
    .select(`
      id,
      status,
      recruiter_notes,
      applied_at,
      interview_date,
      jobs (
        id,
        title,
        company_name,
        department,
        location,
        employment_type,
        experience_required,
        status
      )
    `)
    .eq("candidate_id", candidateId)
    .order("applied_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
const updateApplicationStatus = async (applicationId, updateData) => {
  const { data, error } = await supabase
    .from("job_applications")
    .update(updateData)
    .eq("id", applicationId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Application not found.");
  }

  return data;
};
const deleteApplication = async (applicationId) => {
  const { data, error } = await supabase
    .from("job_applications")
    .delete()
    .eq("id", applicationId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Application not found.");
  }

  return data;
};
module.exports = {
  createApplication,
  getApplicationsByJob,
  getApplicationsByCandidate,
  updateApplicationStatus,
  deleteApplication,
};