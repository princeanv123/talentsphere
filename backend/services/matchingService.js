const { discoverCandidates } = require("./candidateDiscoveryService");
const { saveMatchHistory } = require("./matchHistoryService");
const supabase = require("../config/supabase");

const {
  generateMatchAnalysis,
} = require("./geminiService");

console.log(
  "✅ matchingService.js LOADED - Local bulk matching enabled"
);

// ======================================================
// MATCHING CONFIGURATION
// ======================================================

const SKILL_WEIGHT = 70;
const EXPERIENCE_WEIGHT = 30;

// ======================================================
// HELPER: Normalize Text
// ======================================================

const normalizeSkill = (skill) => {
  if (!skill) return "";

  return String(skill)
    .trim()
    .toLowerCase();
};

// ======================================================
// HELPER: Convert Experience to Number
// ======================================================

const normalizeExperience = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);

  if (!Number.isNaN(number)) {
    return number;
  }

  const match = String(value).match(/\d+(\.\d+)?/);

  return match ? Number(match[0]) : 0;
};

// ======================================================
// GET MATCHING SCORE FOR ONE CANDIDATE
//
// This endpoint DOES use Gemini.
// It is intended for detailed individual analysis.
// ======================================================

const getMatchingScore = async ({ candidateId, jobId }) => {

  // ----------------------------------------------------
  // Fetch Candidate
  // ----------------------------------------------------

  const {
    data: candidate,
    error: candidateError,
  } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (candidateError || !candidate) {
    throw new Error("Candidate not found.");
  }

  // ----------------------------------------------------
  // Fetch Job
  // ----------------------------------------------------

  const {
    data: job,
    error: jobError,
  } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    throw new Error("Job not found.");
  }

  // ----------------------------------------------------
  // Generate AI Analysis
  // ----------------------------------------------------

  const analysis = await generateMatchAnalysis(
    candidate,
    job
  );

  // ----------------------------------------------------
  // Save Match History
  // ----------------------------------------------------

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
// GET JOB SKILLS
// ======================================================

const getJobSkills = async (jobId) => {

  const {
    data,
    error,
  } = await supabase
    .from("job_skills")
    .select(`
      skill_id,
      skills (
        skill_name
      )
    `)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(
      `Failed to fetch job skills: ${error.message}`
    );
  }

  return (data || [])
    .filter((item) => item.skills)
    .map((item) => item.skills.skill_name)
    .filter(Boolean);
};

// ======================================================
// GET CANDIDATE SKILLS
// ======================================================

const getCandidateSkills = async (candidateId) => {

  const {
    data,
    error,
  } = await supabase
    .from("candidate_skills")
    .select(`
      skill_id,
      skills (
        skill_name
      )
    `)
    .eq("candidate_id", candidateId);

  if (error) {
    throw new Error(
      `Failed to fetch candidate skills: ${error.message}`
    );
  }

  return (data || [])
    .filter((item) => item.skills)
    .map((item) => item.skills.skill_name)
    .filter(Boolean);
};

// ======================================================
// GET ALL CANDIDATE SKILLS
//
// IMPORTANT:
// Instead of making one DB query per candidate,
// we fetch all candidate skills in ONE query.
// ======================================================

const getAllCandidateSkills = async (candidateIds = []) => {

  if (!candidateIds.length) {
    return {};
  }

  const {
    data,
    error,
  } = await supabase
    .from("candidate_skills")
    .select(`
      candidate_id,
      skill_id,
      skills (
        skill_name
      )
    `)
    .in("candidate_id", candidateIds);

  if (error) {
    throw new Error(
      `Failed to fetch candidate skills: ${error.message}`
    );
  }

  const skillsByCandidate = {};

  // Initialize every candidate
  for (const candidateId of candidateIds) {
    skillsByCandidate[candidateId] = [];
  }

  // Group skills by candidate
  for (const row of data || []) {

    if (
      !row.candidate_id ||
      !row.skills ||
      !row.skills.skill_name
    ) {
      continue;
    }

    if (!skillsByCandidate[row.candidate_id]) {
      skillsByCandidate[row.candidate_id] = [];
    }

    skillsByCandidate[row.candidate_id].push(
      row.skills.skill_name
    );
  }

  return skillsByCandidate;
};

// ======================================================
// CALCULATE EXPERIENCE MATCH
//
// Returns a percentage between 0 and 100.
// ======================================================

const calculateExperienceMatch = (
  candidateExperience,
  job
) => {

  const candidateYears =
    normalizeExperience(candidateExperience);

  // Support multiple possible job column names.
  const requiredYears =
    normalizeExperience(
      job?.required_experience ??
      job?.experience_required ??
      job?.min_experience ??
      job?.minimum_experience ??
      0
    );

  // If job does not specify experience,
  // don't penalize candidate.
  if (requiredYears <= 0) {
    return {
      candidateExperience: candidateYears,
      requiredExperience: 0,
      experienceMatchPercentage: 100,
    };
  }

  // Candidate meets or exceeds requirement.
  if (candidateYears >= requiredYears) {
    return {
      candidateExperience: candidateYears,
      requiredExperience: requiredYears,
      experienceMatchPercentage: 100,
    };
  }

  // Partial experience match.
  const percentage = Math.round(
    (candidateYears / requiredYears) * 100
  );

  return {
    candidateExperience: candidateYears,
    requiredExperience: requiredYears,
    experienceMatchPercentage: Math.min(
      percentage,
      100
    ),
  };
};

// ======================================================
// CALCULATE FINAL SCORE
// ======================================================

const calculateFinalScore = ({
  skillMatchPercentage,
  experienceMatchPercentage,
}) => {

  const skillScore =
    skillMatchPercentage * (SKILL_WEIGHT / 100);

  const experienceScore =
    experienceMatchPercentage *
    (EXPERIENCE_WEIGHT / 100);

  return Math.round(
    skillScore + experienceScore
  );
};

// ======================================================
// DISCOVER CANDIDATES FOR JOB
//
// IMPORTANT:
// NO GEMINI CALL HERE.
//
// This is the bulk matching engine.
// ======================================================

const getCandidatesForJob = async (jobId) => {

  // ----------------------------------------------------
  // Fetch Job
  // ----------------------------------------------------

  const {
    data: job,
    error: jobError,
  } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    throw new Error("Job not found.");
  }

  // ----------------------------------------------------
  // Fetch Job Skills
  // ----------------------------------------------------

  const jobSkills =
    await getJobSkills(jobId);

  // ----------------------------------------------------
  // Normalize Job Skills
  // ----------------------------------------------------

  const normalizedJobSkills = [
    ...new Set(
      jobSkills
        .map(normalizeSkill)
        .filter(Boolean)
    ),
  ];

  // ----------------------------------------------------
  // Discover Candidates
  // ----------------------------------------------------

  const candidates =
    await discoverCandidates(job);

  console.log(
    `Candidates Discovered: ${candidates.length}`
  );

  // ----------------------------------------------------
  // Get Candidate IDs
  // ----------------------------------------------------

  const candidateIds =
    candidates.map(
      (candidate) => candidate.id
    );

  // ----------------------------------------------------
  // Fetch ALL Candidate Skills
  //
  // ONE DATABASE QUERY
  // ----------------------------------------------------

  const skillsByCandidate =
    await getAllCandidateSkills(
      candidateIds
    );

  // ----------------------------------------------------
  // Process Candidates
  // ----------------------------------------------------

  const candidatesWithSkills = [];

  for (const candidate of candidates) {

    const candidateSkills =
      skillsByCandidate[candidate.id] || [];

    // --------------------------------------------------
    // Normalize Candidate Skills
    // --------------------------------------------------

    const normalizedCandidateSkills = [
      ...new Set(
        candidateSkills
          .map(normalizeSkill)
          .filter(Boolean)
      ),
    ];

    // --------------------------------------------------
    // Find Matching Skills
    // --------------------------------------------------

    const matchingSkills =
      candidateSkills.filter(
        (skill) =>
          normalizedJobSkills.includes(
            normalizeSkill(skill)
          )
      );

    // --------------------------------------------------
    // Remove Duplicate Matching Skills
    // --------------------------------------------------

    const uniqueMatchingSkills = [
      ...new Set(
        matchingSkills.map(
          (skill) => skill.trim()
        )
      ),
    ];

    // --------------------------------------------------
    // Find Missing Skills
    // --------------------------------------------------

    const missingSkills =
      jobSkills.filter(
        (skill) =>
          !normalizedCandidateSkills.includes(
            normalizeSkill(skill)
          )
      );

    // --------------------------------------------------
    // Skill Match Percentage
    // --------------------------------------------------

    const skillMatchPercentage =
      normalizedJobSkills.length === 0
        ? 0
        : Math.round(
            (uniqueMatchingSkills.length /
              normalizedJobSkills.length) *
              100
          );

    // --------------------------------------------------
    // Experience Match
    // --------------------------------------------------

    const experienceMatch =
      calculateExperienceMatch(
        candidate.experience,
        job
      );

    // --------------------------------------------------
    // Final Score
    // --------------------------------------------------

    const finalScore =
      calculateFinalScore({
        skillMatchPercentage,
        experienceMatchPercentage:
          experienceMatch.experienceMatchPercentage,
      });

    // --------------------------------------------------
    // Candidate Result
    // --------------------------------------------------

    candidatesWithSkills.push({

      ...candidate,

      // Skills
      skills: candidateSkills,

      matchingSkills:
        uniqueMatchingSkills,

      missingSkills,

      // Skill matching
      skillMatchPercentage,

      // Experience matching
      candidateExperience:
        experienceMatch.candidateExperience,

      requiredExperience:
        experienceMatch.requiredExperience,

      experienceMatchPercentage:
        experienceMatch.experienceMatchPercentage,

      // Final score
      finalScore,

      // AI
      aiRanking: null,

      aiRankingStatus:
        "AI ranking disabled for bulk matching",

    });
  }

  // ----------------------------------------------------
  // Sort Candidates
  //
  // Highest final score first.
  // ----------------------------------------------------

  candidatesWithSkills.sort(
    (a, b) => {

      // First priority:
      // Final score
      if (
        b.finalScore !==
        a.finalScore
      ) {
        return (
          b.finalScore -
          a.finalScore
        );
      }

      // Second priority:
      // Skill match
      if (
        b.skillMatchPercentage !==
        a.skillMatchPercentage
      ) {
        return (
          b.skillMatchPercentage -
          a.skillMatchPercentage
        );
      }

      // Third priority:
      // Experience
      return (
        b.experienceMatchPercentage -
        a.experienceMatchPercentage
      );
    }
  );

  // ----------------------------------------------------
  // Log Matching Statistics
  // ----------------------------------------------------

  console.log(
    "=========================================="
  );

  console.log(
    "LOCAL MATCHING COMPLETED"
  );

  console.log(
    `Job: ${job.job_title || job.title || "Unknown"}`
  );

  console.log(
    `Candidates: ${candidatesWithSkills.length}`
  );

  console.log(
    "Gemini Requests: 0"
  );

  console.log(
    "Candidate Skill Queries: 1"
  );

  console.log(
    "=========================================="
  );

  // ----------------------------------------------------
  // Return Result
  // ----------------------------------------------------

  return {

    job,

    jobSkills,

    totalCandidates:
      candidatesWithSkills.length,

    candidates:
      candidatesWithSkills,

  };
};

// ======================================================
// MODULE EXPORTS
// ======================================================

module.exports = {

  getMatchingScore,

  getJobSkills,

  getCandidateSkills,

  getAllCandidateSkills,

  getCandidatesForJob,

  calculateExperienceMatch,

  calculateFinalScore,

};