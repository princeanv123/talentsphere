const { saveCandidateEducation } = require("./educationService");
const { saveCandidateSkills } = require("./skillService");
const { saveCandidateCertifications } = require("./certificationService");
const { uploadResumeFile } = require("./resumeUploadService");
const { findOrCreateCandidate } = require("./candidateService");
const { saveResumeHistory } = require("./resumeHistoryService");
const resumeParser = require("./resumeParser");
const uploadResume = async (file) => {

// ===============================
// Upload Resume to Supabase Storage
// ===============================
const uploadResult = await uploadResumeFile(file);

const fileType = uploadResult.fileType;

const uploadData = {
  path: uploadResult.storagePath,
};

  // ===============================
  // Parse Resume
  // ===============================
  const parsedData = await resumeParser(file);

  console.log("========== Parsed Resume ==========");
  console.log(JSON.stringify(parsedData, null, 2));
  console.log("===================================");

  // ===============================
  // Check if Candidate already exists
  // ===============================
const {
  candidate,
  isNewCandidate,
} = await findOrCreateCandidate(
  parsedData,
  uploadData.path
);

  // ===============================
  // Save Profile Information
  // Only for new candidates
  // ===============================
  if (isNewCandidate) {
    console.log("Saving skills...");

    await saveCandidateSkills(
      candidate.id,
      parsedData.skills || []
    );

    console.log("Saving education...");

    await saveCandidateEducation(
      candidate.id,
      parsedData.education || []
    );

    console.log("Saving certifications...");

    await saveCandidateCertifications(
      candidate.id,
      parsedData.certifications || []
    );

    console.log("Candidate profile saved.");
  } else {
    console.log("Candidate already exists.");
    console.log("Skipping Skills / Education / Certifications.");
  }

  // ===============================
  // Save Resume Metadata
  // ===============================
const resume = await saveResumeHistory(
  candidate.id,
  file,
  uploadData.path,
  fileType
);

  return {
    success: true,
    message: isNewCandidate
      ? "Candidate created successfully."
      : "Candidate already exists. Resume uploaded successfully.",
    candidate,
    resume,
  };
};

module.exports = {
  uploadResume,
};