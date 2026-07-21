const supabase = require("../config/supabase");

const getDashboardStats = async () => {
  // Total Candidates
  const { count: totalCandidates, error: candidateError } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true });

  if (candidateError) {
    throw new Error(candidateError.message);
  }

  // Total Resumes
  const { count: totalResumes, error: resumeError } = await supabase
    .from("resumes")
    .select("*", { count: "exact", head: true });

  if (resumeError) {
    throw new Error(resumeError.message);
  }

  // Candidate Experience
  const { data: experienceData, error: experienceError } = await supabase
    .from("candidates")
    .select("experience");

  if (experienceError) {
    throw new Error(experienceError.message);
  }

  const totalExperience = experienceData.reduce(
    (sum, candidate) => sum + (candidate.experience || 0),
    0
  );

  const averageExperience =
    experienceData.length > 0
      ? Number((totalExperience / experienceData.length).toFixed(1))
      : 0;

  // New Candidates This Month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: newCandidatesThisMonth, error: monthError } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString());

  if (monthError) {
    throw new Error(monthError.message);
  }

  // Top Skills
 const { data: skillsData, error: skillsError } = await supabase
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
  const skillName = item.skills?.skill_name;

  if (!skillName) return;

  skillMap[skillName] = (skillMap[skillName] || 0) + 1;
});

  const topSkills = Object.entries(skillMap)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalCandidates,
    totalResumes,
    averageExperience,
    newCandidatesThisMonth,
    topSkills,
  };
};

module.exports = {
  getDashboardStats,
};