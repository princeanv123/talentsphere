// ======================================================
// TalentSphere - Candidate Match Score Service
// ======================================================
//
// Deterministic scoring engine.
//
// Current weights:
//   Skills      = 40%
//   Experience  = 20%
//   Relevance   = 20%
//   AI          = 20%
//
// IMPORTANT:
// This service does NOT call Gemini.
//
// Bulk candidate matching therefore remains:
//     Gemini Requests = 0
//
// AI score is supplied externally when an individual
// candidate receives AI analysis.
//
// ======================================================


// ======================================================
// SCORE WEIGHTS
// ======================================================

const SCORE_WEIGHTS = {
  skills: 0.40,
  experience: 0.20,
  relevance: 0.20,
  ai: 0.20,
};


// ======================================================
// Utility: Clamp Score
// ======================================================

const clampScore = (score) => {

  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, numericScore)
  );
};


// ======================================================
// Utility: Normalize Text
// ======================================================

const normalizeText = (value) => {

  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase();
};


// ======================================================
// Utility: Normalize Skill
// ======================================================

const normalizeSkill = (skill) => {

  return normalizeText(skill)
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};


// ======================================================
// Utility: Tokenize Text
// ======================================================
//
// Converts text into meaningful words.
//
// Example:
//
// "Senior Java Developer with Spring Boot"
//
// becomes:
//
// ["senior", "java", "developer", "spring", "boot"]
//
// ======================================================

const tokenize = (text) => {

  if (!text) {
    return [];
  }

  return normalizeText(text)
    .replace(/[^a-z0-9+#.]/g, " ")
    .split(/\s+/)
    .filter(word => word.length >= 3);
};


// ======================================================
// Stop Words
// ======================================================
//
// Common words that should NOT contribute strongly
// to relevance.
//
// ======================================================

const STOP_WORDS = new Set([

  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "have",
  "has",
  "had",
  "are",
  "was",
  "were",
  "will",
  "would",
  "should",
  "into",
  "over",
  "under",
  "using",
  "used",
  "use",
  "experience",
  "experienced",
  "years",
  "year",
  "looking",
  "work",
  "working",
  "role",
  "team",
  "teams",
  "strong",
  "skills",
  "skill",
  "required",
  "requirements",

]);


// ======================================================
// Remove Stop Words
// ======================================================

const removeStopWords = (words = []) => {

  return words.filter(
    word => !STOP_WORDS.has(word)
  );
};


// ======================================================
// 1. Skill Score
// ======================================================

const calculateSkillScore = (
  candidateSkills = [],
  jobSkills = []
) => {

  if (
    !Array.isArray(jobSkills) ||
    jobSkills.length === 0
  ) {
    return 0;
  }

  if (
    !Array.isArray(candidateSkills)
  ) {
    return 0;
  }


  const normalizedCandidateSkills =
    new Set(

      candidateSkills
        .map(normalizeSkill)
        .filter(Boolean)

    );


  const normalizedJobSkills = [

    ...new Set(

      jobSkills
        .map(normalizeSkill)
        .filter(Boolean)

    ),

  ];


  if (
    normalizedJobSkills.length === 0
  ) {
    return 0;
  }


  const matchingSkills =
    normalizedJobSkills.filter(
      skill =>
        normalizedCandidateSkills.has(
          skill
        )
    );


  return clampScore(

    (
      matchingSkills.length /
      normalizedJobSkills.length
    ) * 100

  );
};


// ======================================================
// 2. Experience Score
// ======================================================

const calculateExperienceScore = (
  candidateExperience,
  requiredExperience
) => {

  const candidateExp =
    Number(candidateExperience);

  const requiredExp =
    Number(requiredExperience);


  // ----------------------------------------------------
  // No experience requirement
  // ----------------------------------------------------

  if (
    !Number.isFinite(requiredExp) ||
    requiredExp <= 0
  ) {

    return 100;

  }


  // ----------------------------------------------------
  // Invalid candidate experience
  // ----------------------------------------------------

  if (
    !Number.isFinite(candidateExp) ||
    candidateExp < 0
  ) {

    return 0;

  }


  // ----------------------------------------------------
  // Candidate meets requirement
  // ----------------------------------------------------

  if (
    candidateExp >= requiredExp
  ) {

    return 100;

  }


  // ----------------------------------------------------
  // Candidate has partial experience
  // ----------------------------------------------------

  return clampScore(

    (
      candidateExp /
      requiredExp
    ) * 100

  );
};


// ======================================================
// 3. Relevance Score V2
// ======================================================
//
// Relevance is calculated locally.
//
// Candidate information:
//
//   current_title
//   summary
//   skills
//
// Job information:
//
//   title
//   description
//   skills
//
// Relevance consists of:
//
//   A. Title relevance
//   B. Skill relevance
//   C. Description/context relevance
//
// No Gemini call is made.
//
// ======================================================

const calculateRelevanceScore = (
  candidate,
  job
) => {

  if (
    !candidate ||
    !job
  ) {

    return 0;

  }


  // ====================================================
  // A. TITLE RELEVANCE
  // ====================================================

  const candidateTitle =
    normalizeText(
      candidate.current_title
    );

  const jobTitle =
    normalizeText(
      job.title
    );


  let titleScore = 0;


  if (
    candidateTitle &&
    jobTitle
  ) {

    const candidateTitleWords =
      new Set(

        removeStopWords(
          tokenize(candidateTitle)
        )

      );


    const jobTitleWords =
      [

        ...new Set(

          removeStopWords(
            tokenize(jobTitle)
          )

        ),

      ];


    if (
      jobTitleWords.length > 0
    ) {

      const titleMatches =
        jobTitleWords.filter(
          word =>
            candidateTitleWords.has(
              word
            )
        );


      titleScore =
        (
          titleMatches.length /
          jobTitleWords.length
        ) * 100;

    }

  }


  // ====================================================
  // B. SKILL RELEVANCE
  // ====================================================

  const candidateSkills =
    Array.isArray(candidate.skills)
      ? candidate.skills
      : [];


  const jobSkills =
    Array.isArray(job.skills)
      ? job.skills
      : [];


  let skillRelevanceScore = 0;


  if (
    candidateSkills.length > 0 &&
    jobSkills.length > 0
  ) {

    const candidateSkillSet =
      new Set(

        candidateSkills
          .map(normalizeSkill)
          .filter(Boolean)

      );


    const normalizedJobSkills =
      [

        ...new Set(

          jobSkills
            .map(normalizeSkill)
            .filter(Boolean)

        ),

      ];


    const matchingSkills =
      normalizedJobSkills.filter(
        skill =>
          candidateSkillSet.has(
            skill
          )
      );


    if (
      normalizedJobSkills.length > 0
    ) {

      skillRelevanceScore =
        (
          matchingSkills.length /
          normalizedJobSkills.length
        ) * 100;

    }

  }


  // ====================================================
  // C. DESCRIPTION RELEVANCE
  // ====================================================

  const candidateContext =
    [

      candidate.current_title,

      candidate.summary,

    ]
      .filter(Boolean)
      .join(" ");


  const jobContext =
    [

      job.title,

      job.description,

    ]
      .filter(Boolean)
      .join(" ");


  let contextScore = 0;


  if (
    candidateContext &&
    jobContext
  ) {

    const candidateWords =
      new Set(

        removeStopWords(
          tokenize(candidateContext)
        )

      );


    const jobWords =
      [

        ...new Set(

          removeStopWords(
            tokenize(jobContext)
          )

        ),

      ];


    if (
      jobWords.length > 0
    ) {

      const matchingWords =
        jobWords.filter(
          word =>
            candidateWords.has(
              word
            )
        );


      contextScore =
        (
          matchingWords.length /
          jobWords.length
        ) * 100;

    }

  }


  // ====================================================
  // COMBINE RELEVANCE COMPONENTS
  // ====================================================
  //
  // Title       = 40%
  // Skills      = 40%
  // Context     = 20%
  //
  // This is INTERNAL relevance weighting.
  //
  // The overall relevance component still represents
  // 20% of the final TalentSphere score.
  //
  // ====================================================

  const relevanceScore =

      (titleScore * 0.40)

    + (skillRelevanceScore * 0.40)

    + (contextScore * 0.20);


  return clampScore(
    relevanceScore
  );
};


// ======================================================
// 4. AI Score
// ======================================================
//
// Gemini score is supplied to this function.
//
// IMPORTANT:
// This function itself does NOT call Gemini.
//
// ======================================================

const calculateAIScore = (
  aiRanking
) => {

  if (!aiRanking) {
    return 0;
  }


  return clampScore(
    aiRanking.overallMatch
  );
};


// ======================================================
// 5. Final Match Score
// ======================================================

const calculateFinalMatchScore = ({
  candidate,
  job,
  candidateSkills = [],
  jobSkills = [],
  aiRanking = null,
}) => {


  // ----------------------------------------------------
  // Skill Score
  // ----------------------------------------------------

  const skillScore =
    calculateSkillScore(
      candidateSkills,
      jobSkills
    );


  // ----------------------------------------------------
  // Experience Score
  // ----------------------------------------------------

  const experienceScore =
    calculateExperienceScore(
      candidate?.experience,
      job?.experience_required
    );


  // ----------------------------------------------------
  // Relevance Score
  // ----------------------------------------------------

  const relevanceScore =
    calculateRelevanceScore(
      {
        ...candidate,
        skills: candidateSkills,
      },
      {
        ...job,
        skills: jobSkills,
      }
    );


  // ----------------------------------------------------
  // AI Score
  // ----------------------------------------------------

  const aiScore =
    calculateAIScore(
      aiRanking
    );


  // ----------------------------------------------------
  // Weighted Final Score
  // ----------------------------------------------------

  const finalScore =

      (
        skillScore *
        SCORE_WEIGHTS.skills
      )

    + (
        experienceScore *
        SCORE_WEIGHTS.experience
      )

    + (
        relevanceScore *
        SCORE_WEIGHTS.relevance
      )

    + (
        aiScore *
        SCORE_WEIGHTS.ai
      );


  // ----------------------------------------------------
  // Return Score Breakdown
  // ----------------------------------------------------

  return {

    finalScore:
      Math.round(
        clampScore(
          finalScore
        )
      ),

    skillScore:
      Math.round(
        skillScore
      ),

    experienceScore:
      Math.round(
        experienceScore
      ),

    relevanceScore:
      Math.round(
        relevanceScore
      ),

    aiScore:
      Math.round(
        aiScore
      ),

    weights: {

      skills:
        SCORE_WEIGHTS.skills *
        100,

      experience:
        SCORE_WEIGHTS.experience *
        100,

      relevance:
        SCORE_WEIGHTS.relevance *
        100,

      ai:
        SCORE_WEIGHTS.ai *
        100,

    },

  };
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  SCORE_WEIGHTS,

  calculateSkillScore,

  calculateExperienceScore,

  calculateRelevanceScore,

  calculateAIScore,

  calculateFinalMatchScore,

};