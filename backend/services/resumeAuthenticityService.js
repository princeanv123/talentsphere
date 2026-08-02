const {
  calculateResumeCompleteness,
} = require("./resumeCompletenessService");

const {
  checkTimelineConsistency,
} = require("./timelineConsistencyService");

const {
  calculateSkillConsistency,
} = require("./skillConsistencyService");

const {
  evaluateExperienceConsistency,
} = require("./experienceConsistencyService");

const evaluateResumeAuthenticity = async (
  candidateId,
  jobId
) => {



  // Resume Completeness
  const resumeCompleteness =
    await calculateResumeCompleteness(candidateId);

  // Timeline Consistency
  const timelineConsistency =
    await checkTimelineConsistency(candidateId);

  // Skill Consistency
  const skillConsistency =
    await calculateSkillConsistency(
      candidateId,
      jobId
    );

  // Experience Consistency
  const experienceConsistency =
    await evaluateExperienceConsistency(candidateId);

  // Extract Scores
  const completenessScore =
  resumeCompleteness.completenessScore ?? 0;

const timelineScore =
  timelineConsistency.timelineScore ?? 0;

const skillScore =
  skillConsistency.skillConsistencyScore ?? 0;

const experienceScore =
  experienceConsistency.experienceConsistencyScore ?? 0;

  // Final Score
  const authenticityScore =
    Math.round(
      (
        completenessScore +
        timelineScore +
        skillScore +
        experienceScore
      ) / 4
    );
console.log(resumeCompleteness);
console.log(timelineConsistency);
console.log(skillConsistency);
console.log(experienceConsistency);
  // Risk Level
  let riskLevel = "High";

  if (authenticityScore >= 90) {
    riskLevel = "Low";
  } else if (authenticityScore >= 75) {
    riskLevel = "Moderate";
  }

  return {

    authenticityScore,

    riskLevel,

    components: {

      resumeCompleteness: completenessScore,

      timelineConsistency: timelineScore,

      skillConsistency: skillScore,

      experienceConsistency: experienceScore,

    },

  };

};

module.exports = {
  evaluateResumeAuthenticity,
};