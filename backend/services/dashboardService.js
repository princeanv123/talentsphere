const supabase = require("../config/supabase");

// ======================================================
// Dashboard Statistics
// ======================================================

const getDashboardStats = async () => {

  // ====================================================
  // Date: Start of current month
  // ====================================================

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfMonthISO = startOfMonth.toISOString();


  // ====================================================
  // 1. TOTAL CANDIDATES
  // ====================================================

  const {
    count: totalCandidates,
    error: candidateError,
  } = await supabase
    .from("candidates")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (candidateError) {
    throw new Error(candidateError.message);
  }


  // ====================================================
  // 2. NEW CANDIDATES THIS MONTH
  // ====================================================

  const {
    count: newCandidatesThisMonth,
    error: newCandidateError,
  } = await supabase
    .from("candidates")
    .select("*", {
      count: "exact",
      head: true,
    })
    .gte("created_at", startOfMonthISO);

  if (newCandidateError) {
    throw new Error(newCandidateError.message);
  }


  // ====================================================
  // 3. ACTIVE JOBS
  // Actual status value in database = "Open"
  // ====================================================

  const {
    count: activeJobs,
    error: jobError,
  } = await supabase
    .from("jobs")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("status", "Open");

  if (jobError) {
    throw new Error(jobError.message);
  }


  // ====================================================
  // 4. NEW JOBS THIS MONTH
  // ====================================================

  const {
    count: newJobsThisMonth,
    error: newJobError,
  } = await supabase
    .from("jobs")
    .select("*", {
      count: "exact",
      head: true,
    })
    .gte("created_at", startOfMonthISO);

  if (newJobError) {
    throw new Error(newJobError.message);
  }


  // ====================================================
  // 5. TOTAL AI MATCHES
  // candidate_matches contains every saved match analysis
  // ====================================================

  const {
    count: aiMatches,
    error: matchError,
  } = await supabase
    .from("candidate_matches")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (matchError) {
    throw new Error(matchError.message);
  }


  // ====================================================
  // 6. AI MATCHES THIS MONTH
  // ====================================================

  const {
    count: aiMatchesThisMonth,
    error: monthlyMatchError,
  } = await supabase
    .from("candidate_matches")
    .select("*", {
      count: "exact",
      head: true,
    })
    .gte("created_at", startOfMonthISO);

  if (monthlyMatchError) {
    throw new Error(monthlyMatchError.message);
  }


  // ====================================================
  // 7. CANDIDATE EXPERIENCE
  // ====================================================

  const {
    data: experienceData,
    error: experienceError,
  } = await supabase
    .from("candidates")
    .select("experience");

  if (experienceError) {
    throw new Error(experienceError.message);
  }

  const totalExperience = experienceData.reduce(
    (sum, candidate) => {
      const experience = Number(candidate.experience) || 0;
      return sum + experience;
    },
    0
  );

  const averageExperience =
    experienceData.length > 0
      ? Number(
          (
            totalExperience /
            experienceData.length
          ).toFixed(1)
        )
      : 0;


  // ====================================================
  // 8. TOP SKILLS
  // ====================================================

  const {
    data: skillsData,
    error: skillsError,
  } = await supabase
    .from("candidate_skills")
    .select(`
      skills (
        skill_name
      )
    `);

  if (skillsError) {
    throw new Error(skillsError.message);
  }

  const skillMap = {};

  skillsData.forEach((item) => {

    const skillName =
      item.skills?.skill_name;

    if (!skillName) {
      return;
    }

    skillMap[skillName] =
      (skillMap[skillName] || 0) + 1;
  });

  const topSkills = Object.entries(skillMap)
    .map(([skill, count]) => ({
      skill,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);


  // ====================================================
  // RETURN
  // ====================================================

  return {

    // Candidates
    totalCandidates:
      totalCandidates || 0,

    newCandidatesThisMonth:
      newCandidatesThisMonth || 0,

    // Jobs
    activeJobs:
      activeJobs || 0,

    newJobsThisMonth:
      newJobsThisMonth || 0,

    // AI Matching
    aiMatches:
      aiMatches || 0,

    aiMatchesThisMonth:
      aiMatchesThisMonth || 0,

    // Existing dashboard information
    averageExperience,

    topSkills,
  };
};


// ======================================================
// Export
// ======================================================

module.exports = {
  getDashboardStats,
};