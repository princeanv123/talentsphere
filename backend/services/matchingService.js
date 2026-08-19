const { discoverCandidates } = require("./candidateDiscoveryService");

const { saveMatchHistory } = require("./matchHistoryService");

const supabase = require("../config/supabase");

const {
  generateMatchAnalysis,
} = require("./geminiService");

const {
  calculateFinalMatchScore,
} = require("./candidateMatchScoreService");

console.log(
  "✅ matchingService.js LOADED - Local bulk matching + deterministic scoring enabled"
);


// ======================================================
// AI Candidate vs Job Matching
// ======================================================
//
// This endpoint is for an explicit individual match.
//
// Gemini:
//     YES - exactly one AI analysis
//
// Bulk candidate discovery does NOT use this function.
//
// ======================================================

const getMatchingScore = async ({
  candidateId,
  jobId,
}) => {

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
  // Generate ONE AI Analysis
  // ----------------------------------------------------

  console.log(
    "======================================"
  );

  console.log(
    "INDIVIDUAL MATCH ANALYSIS"
  );

  console.log(
    "Candidate:",
    candidate.full_name
  );

  console.log(
    "Job:",
    job.title
  );

  console.log(
    "Gemini Requests: 1"
  );

  console.log(
    "======================================"
  );


  const analysis =
    await generateMatchAnalysis(
      candidate,
      job
    );


  // ----------------------------------------------------
  // Save Match History
  // ----------------------------------------------------

  const matchHistory =
    await saveMatchHistory(
      candidateId,
      jobId,
      analysis
    );


  // ----------------------------------------------------
  // Return
  // ----------------------------------------------------

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
      error.message
    );
  }


  return (data || [])
    .filter(item => item.skills)
    .map(
      item => item.skills.skill_name
    )
    .filter(Boolean);
};


// ======================================================
// Fetch Candidate Skills
// ======================================================

const getCandidateSkills = async (
  candidateId
) => {

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
    .eq(
      "candidate_id",
      candidateId
    );


  if (error) {
    throw new Error(
      error.message
    );
  }


  return (data || [])
    .filter(item => item.skills)
    .map(
      item => item.skills.skill_name
    )
    .filter(Boolean);
};


// ======================================================
// Discover Candidates for Job
// ======================================================
//
// IMPORTANT:
//
// This is the BULK matching endpoint.
//
// Gemini is NEVER called here.
//
// Example:
//
// 100 candidates
//      ↓
// local calculations
//      ↓
// 100 candidates
//      ↓
// Gemini = 0
//
// ======================================================

const getCandidatesForJob = async (
  jobId
) => {

  // ----------------------------------------------------
  // STEP 1
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
    throw new Error(
      "Job not found."
    );
  }


  // ----------------------------------------------------
  // STEP 2
  // Fetch Job Skills
  // ----------------------------------------------------

  const jobSkills =
    await getJobSkills(
      jobId
    );


  // ----------------------------------------------------
  // STEP 3
  // Discover Candidates
  // ----------------------------------------------------

  const candidates =
    await discoverCandidates(
      job
    );


  console.log(
    "======================================"
  );

  console.log(
    "LOCAL CANDIDATE DISCOVERY"
  );

  console.log(
    "Job:",
    job.title
  );

  console.log(
    "Candidates Discovered:",
    candidates.length
  );

  console.log(
    "Gemini Requests: 0"
  );

  console.log(
    "======================================"
  );


  // ----------------------------------------------------
  // Normalize Job Skills
  // ----------------------------------------------------

  const normalizedJobSkills =
    jobSkills.map(skill =>
      skill
        .trim()
        .toLowerCase()
    );


  // ----------------------------------------------------
  // Process Candidates
  // ----------------------------------------------------

  const candidatesWithSkills = [];


  for (
    const candidate
    of candidates
  ) {

    // --------------------------------------------------
    // Fetch Candidate Skills
    // --------------------------------------------------

    const candidateSkills =
      await getCandidateSkills(
        candidate.id
      );


    // --------------------------------------------------
    // Normalize Candidate Skills
    // --------------------------------------------------

    const normalizedCandidateSkills =
      candidateSkills.map(skill =>
        skill
          .trim()
          .toLowerCase()
      );


    // --------------------------------------------------
    // Matching Skills
    // --------------------------------------------------

    const matchingSkills =
      candidateSkills.filter(
        skill =>
          normalizedJobSkills.includes(
            skill
              .trim()
              .toLowerCase()
          )
      );


    // --------------------------------------------------
    // Missing Skills
    // --------------------------------------------------

    const missingSkills =
      jobSkills.filter(
        skill =>
          !normalizedCandidateSkills.includes(
            skill
              .trim()
              .toLowerCase()
          )
      );


    // --------------------------------------------------
    // Skill Match Percentage
    // --------------------------------------------------

    const skillMatchPercentage =
      jobSkills.length === 0
        ? 0
        : Math.round(
            (
              matchingSkills.length /
              jobSkills.length
            ) * 100
          );


    // ==================================================
    // DETERMINISTIC MATCH SCORE
    // ==================================================
    //
    // Gemini is intentionally NOT called.
    //
    // AI score = 0
    //
    // Current weights:
    //
    // Skills      40%
    // Experience  20%
    // Relevance   20%
    // AI          20%
    //
    // ==================================================

    const scoreBreakdown =
      calculateFinalMatchScore({

        candidate,

        job,

        candidateSkills,

        jobSkills,

        aiRanking: null,

      });


    // --------------------------------------------------
    // Candidate Result
    // --------------------------------------------------

    candidatesWithSkills.push({

      ...candidate,

      skills:
        candidateSkills,

      matchingSkills,

      missingSkills,

      skillMatchPercentage,


      // ----------------------------------------------
      // NEW DETERMINISTIC SCORE
      // ----------------------------------------------

      matchScore:
        scoreBreakdown.finalScore,


      scoreBreakdown: {

        skillScore:
          scoreBreakdown.skillScore,

        experienceScore:
          scoreBreakdown.experienceScore,

        relevanceScore:
          scoreBreakdown.relevanceScore,

        aiScore:
          scoreBreakdown.aiScore,

      },


      // ----------------------------------------------
      // AI Status
      // ----------------------------------------------

      aiRanking: null,

      aiRankingStatus:
        "AI ranking disabled for bulk matching",

    });
  }


  // ==================================================
  // SORT BY FINAL MATCH SCORE
  // ==================================================
  //
  // Highest overall deterministic score first.
  //
  // If two candidates have the same score,
  // skill match percentage becomes the tie-breaker.
  //
  // ==================================================

  candidatesWithSkills.sort(
    (a, b) => {

      if (
        b.matchScore !==
        a.matchScore
      ) {

        return (
          b.matchScore -
          a.matchScore
        );
      }


      return (
        b.skillMatchPercentage -
        a.skillMatchPercentage
      );
    }
  );


  // ==================================================
  // COMPLETION LOG
  // ==================================================

  console.log(
    "=========================================="
  );

  console.log(
    "LOCAL MATCHING COMPLETED"
  );

  console.log(
    "Job:",
    job.title
  );

  console.log(
    "Candidates:",
    candidatesWithSkills.length
  );

  console.log(
    "Gemini Requests: 0"
  );

  console.log(
    "Sorted By: Deterministic Match Score"
  );

  console.log(
    "=========================================="
  );


  // ==================================================
  // RETURN
  // ==================================================

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

  getCandidatesForJob,

};