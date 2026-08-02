const supabase = require("../config/supabase");
const { generateCandidateRanking } = require("./geminiService");

const analyzeCandidate = async (candidateId, jobId) => {

  // Fetch Candidate
  const { data: candidate, error: candidateError } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (candidateError) {
    throw new Error("Candidate not found.");
  }

  // Fetch Job
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError) {
    throw new Error("Job not found.");
  }

  // Candidate Skills
  const { data: candidateSkillRows } = await supabase
    .from("candidate_skills")
    .select(`
      skills (
        skill_name
      )
    `)
    .eq("candidate_id", candidateId);

  const candidateSkills =
    candidateSkillRows?.map(row => row.skills.skill_name) || [];

  // Job Skills
  const { data: jobSkillRows } = await supabase
    .from("job_skills")
    .select(`
      skills (
        skill_name
      )
    `)
    .eq("job_id", jobId);

  const jobSkills =
    jobSkillRows?.map(row => row.skills.skill_name) || [];

  // ONE Gemini Call
  console.log("Candidate Found:", candidate.full_name);
console.log("Job Found:", job.title);
console.log("Calling Gemini...");
  const aiRanking = await generateCandidateRanking(
    candidate,
    candidateSkills,
    job,
    jobSkills
  );

  return {
    candidate,
    job,
    aiRanking,
  };
};

module.exports = {
  analyzeCandidate,
};