const supabase = require("../config/supabase");
const { generateCandidateRanking } = require("./geminiService");
const { saveMatchHistory } = require("./matchHistoryService");


// ======================================================
// Analyze Candidate Against Job
// ======================================================

const analyzeCandidate = async (candidateId, jobId) => {

  // ====================================================
  // STEP 1: Fetch Candidate
  // ====================================================

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


  // ====================================================
  // STEP 2: Fetch Job
  // ====================================================

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


  // ====================================================
  // STEP 3: Fetch Candidate Skills
  // ====================================================

  const {
    data: candidateSkillRows,
    error: candidateSkillsError,
  } = await supabase
    .from("candidate_skills")
    .select(`
      skills (
        skill_name
      )
    `)
    .eq("candidate_id", candidateId);

  if (candidateSkillsError) {
    throw new Error(
      `Unable to fetch candidate skills: ${candidateSkillsError.message}`
    );
  }

  const candidateSkills =
    (candidateSkillRows || [])
      .filter(row => row.skills)
      .map(row => row.skills.skill_name)
      .filter(Boolean);


  // ====================================================
  // STEP 4: Fetch Job Skills
  // ====================================================

  const {
    data: jobSkillRows,
    error: jobSkillsError,
  } = await supabase
    .from("job_skills")
    .select(`
      skills (
        skill_name
      )
    `)
    .eq("job_id", jobId);

  if (jobSkillsError) {
    throw new Error(
      `Unable to fetch job skills: ${jobSkillsError.message}`
    );
  }

  const jobSkills =
    (jobSkillRows || [])
      .filter(row => row.skills)
      .map(row => row.skills.skill_name)
      .filter(Boolean);


  // ====================================================
  // STEP 5: Normalize Skills
  // ====================================================

  const normalizedCandidateSkills =
    candidateSkills.map(skill =>
      skill.trim().toLowerCase()
    );

  const normalizedJobSkills =
    jobSkills.map(skill =>
      skill.trim().toLowerCase()
    );


  // ====================================================
  // STEP 6: Local Skill Matching
  // ====================================================

  const matchingSkills =
    candidateSkills.filter(skill =>
      normalizedJobSkills.includes(
        skill.trim().toLowerCase()
      )
    );


  // ====================================================
  // STEP 7: Local Missing Skills
  // ====================================================

  const missingSkills =
    jobSkills.filter(skill =>
      !normalizedCandidateSkills.includes(
        skill.trim().toLowerCase()
      )
    );


  // ====================================================
  // STEP 8: Local Skill Match Percentage
  // ====================================================

  const skillMatchPercentage =
    jobSkills.length === 0
      ? 0
      : Math.round(
          (matchingSkills.length /
            jobSkills.length) *
            100
        );


  // ====================================================
  // STEP 9: ONE Gemini Call
  // ====================================================

  console.log("======================================");
  console.log("INDIVIDUAL AI CANDIDATE ANALYSIS");
  console.log("Candidate:", candidate.full_name);
  console.log("Job:", job.title);
  console.log("Local Skill Match:", `${skillMatchPercentage}%`);
  console.log("Gemini Requests: 1");
  console.log("Calling Gemini...");
  console.log("======================================");


  const aiRanking =
    await generateCandidateRanking(
      candidate,
      candidateSkills,
      job,
      jobSkills
    );


  // ====================================================
  // STEP 10: Combine Local + AI Analysis
  // ====================================================

  const combinedAnalysis = {

    // AI score
    overallMatch:
      typeof aiRanking.overallMatch === "number"
        ? aiRanking.overallMatch
        : 0,

    // Local skill analysis
    matchingSkills,

    missingSkills,

    skillMatchPercentage,

    // AI analysis
    strengths:
      Array.isArray(aiRanking.strengths)
        ? aiRanking.strengths
        : [],

    gaps:
      Array.isArray(aiRanking.gaps)
        ? aiRanking.gaps
        : [],

    recommendation:
      aiRanking.recommendation || null,

    summary:
      aiRanking.summary ||
      `AI Match Score: ${
        typeof aiRanking.overallMatch === "number"
          ? aiRanking.overallMatch
          : 0
     }%. Local Skill Match: ${skillMatchPercentage}%.`,
  };


  // ====================================================
  // STEP 11: Save Match History
  // ====================================================

  const matchHistory =
    await saveMatchHistory(
      candidateId,
      jobId,
      combinedAnalysis
    );


  // ====================================================
  // STEP 12: Return Result
  // ====================================================

  return {

    candidate,

    job,

    candidateSkills,

    jobSkills,

    analysis: combinedAnalysis,

    matchHistory,

  };
};


// ======================================================

module.exports = {
  analyzeCandidate,
};