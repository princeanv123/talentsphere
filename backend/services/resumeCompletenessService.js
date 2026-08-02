const {
  getCandidateProfile,
} = require("./candidateProfileService");

const calculateResumeCompleteness = async (candidateId) => {

  const report = [];

  let score = 0;



const {
  candidate,
  skills,
  education,
  certifications,
  projects,
} = await getCandidateProfile(candidateId);

    const safeEducation = education || [];
    const safeCertifications = certifications || [];
    const safeProjects = projects || [];

  if (candidate.full_name) {
    score += 10;
    report.push("✔ Name");
  } else {
    report.push("❌ Name");
  }

  if (candidate.email) {
    score += 10;
    report.push("✔ Email");
  } else {
    report.push("❌ Email");
  }

  if (candidate.phone) {
    score += 10;
    report.push("✔ Phone");
  } else {
    report.push("❌ Phone");
  }

  if (candidate.location) {
    score += 5;
    report.push("✔ Location");
  } else {
    report.push("❌ Location");
  }

  if (candidate.summary) {
    score += 10;
    report.push("✔ Summary");
  } else {
    report.push("❌ Summary");
  }

  if (candidate.experience) {
    score += 10;
    report.push("✔ Experience");
  } else {
    report.push("❌ Experience");
  }

  if (skills.length > 0) {
    score += 20;
    report.push("✔ Skills");
  } else {
    report.push("❌ Skills");
  }

  if (safeEducation.length > 0) {
    score += 10;
    report.push("✔ Education");
  } else {
    report.push("❌ Education");
  }

  if (safeCertifications.length > 0) {
    score += 5;
    report.push("✔ Certifications");
  } else {
    report.push("❌ Certifications");
  }

  if (safeProjects.length > 0) {
    score += 10;
    report.push("✔ Projects");
  } else {
    report.push("❌ Projects");
  }

  if (candidate.resume_url) {
    score += 10;
    report.push("✔ Resume Uploaded");
  } else {
    report.push("❌ Resume Uploaded");
  }

  return {
    candidateId,
    completenessScore: score,
    report,
  };
};

module.exports = {
  calculateResumeCompleteness,
};