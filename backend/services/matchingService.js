const { discoverCandidates } = require("./candidateDiscoveryService");
const { saveMatchHistory } = require("./matchHistoryService");
const supabase = require("../config/supabase");
const {
  generateMatchAnalysis,
  generateCandidateRanking,
} = require("./geminiService");

// ======================================================
// AI Candidate vs Job Matching
// ======================================================

const getMatchingScore = async ({ candidateId, jobId }) => {

  // Fetch Candidate
  const { data: candidate, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (error) {
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

  // Generate AI Analysis
  const analysis = await generateMatchAnalysis(candidate, job);

  // Save Match History
  const matchHistory = await saveMatchHistory(
    candidateId,
    jobId,
    analysis
  );

  return {
    candidate,
    job,
    analysis,
    matchHistory,
  };
};

// ======================================================
// Fetch Job Skills
// ======================================================

const getJobSkills = async (jobId) => {

  const { data, error } = await supabase
    .from("job_skills")
    .select(`
      skill_id,
      skills (
        skill_name
      )
    `)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(item => item.skills.skill_name);
};

// ======================================================
// Fetch Candidate Skills
// ======================================================

const getCandidateSkills = async (candidateId) => {

  const { data, error } = await supabase
    .from("candidate_skills")
    .select(`
      skill_id,
      skills (
        skill_name
      )
    `)
    .eq("candidate_id", candidateId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(item => item.skills.skill_name);
};

// ======================================================
// Discover Candidates for Job
// ======================================================

const getCandidatesForJob = async (jobId) => {

  // Fetch Job
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) {
    throw new Error("Job not found.");
  }

  // Fetch Job Skills
  const jobSkills = await getJobSkills(jobId);

  // Experience-based candidate discovery
  const candidates = await discoverCandidates(job);

  // Attach candidate skills
  const candidatesWithSkills = [];

for (const candidate of candidates) {

  const candidateSkills = await getCandidateSkills(candidate.id);

  // Normalize skills for comparison
  const normalizedJobSkills = jobSkills.map(skill =>
    skill.trim().toLowerCase()
  );

  const normalizedCandidateSkills = candidateSkills.map(skill =>
    skill.trim().toLowerCase()
  );

  // Matching Skills
  const matchingSkills = candidateSkills.filter(skill =>
    normalizedJobSkills.includes(skill.trim().toLowerCase())
  );

  // Missing Skills
  const missingSkills = jobSkills.filter(skill =>
    !normalizedCandidateSkills.includes(skill.trim().toLowerCase())
  );

  // Skill Match Percentage
  const skillMatchPercentage =
    jobSkills.length === 0
      ? 0
      : Math.round(
          (matchingSkills.length / jobSkills.length) * 100
        );
const aiRanking = {
  overallMatch: null,
  strengths: [],
  gaps: [],
  recommendation: "AI Disabled for Testing",
};
  candidatesWithSkills.push({
    ...candidate,

    skills: candidateSkills,

    matchingSkills,

    missingSkills,

    skillMatchPercentage,

    aiRanking,
  });
}
candidatesWithSkills.sort(
  (a, b) => b.skillMatchPercentage - a.skillMatchPercentage
);
  return {
    job,
    jobSkills,
    totalCandidates: candidatesWithSkills.length,
    candidates: candidatesWithSkills,
  };
};
module.exports = {
  getMatchingScore,
  getCandidatesForJob,
};