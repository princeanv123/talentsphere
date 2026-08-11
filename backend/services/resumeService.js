const {
  syncCurrentEmployment,
} = require("./currentEmploymentService");

const {
  saveCandidateExperience,
} = require("./candidateExperienceService");

const {
  saveCandidateEducation,
} = require("./educationService");

const {
  saveCandidateSkills,
} = require("./skillService");

const {
  saveCandidateCertifications,
} = require("./certificationService");

const {
  uploadResumeFile,
} = require("./resumeUploadService");

const {
  findOrCreateCandidate,
} = require("./candidateService");

const {
  saveResumeHistory,
} = require("./resumeHistoryService");

const {
  saveCandidateEmbedding,
} = require("./candidateEmbeddingService");

const resumeParser = require("./resumeParser");

console.log("resumeService.js loaded");


// ======================================================
// Build Candidate Embedding Content
// ======================================================

const buildCandidateEmbeddingContent = (parsedData) => {

  const formatArray = (value) => {

    if (!Array.isArray(value)) {
      return "";
    }

    return value
      .map((item) => {

        if (typeof item === "string") {
          return item;
        }

        return JSON.stringify(item);

      })
      .join("\n");
  };


  const skills = formatArray(
    parsedData.skills
  );

  const education = formatArray(
    parsedData.education
  );

  const certifications = formatArray(
    parsedData.certifications
  );

  const projects = formatArray(
    parsedData.projects
  );


  return `
Candidate Name:
${parsedData.name || ""}

Location:
${parsedData.location || ""}

Professional Summary:
${parsedData.summary || ""}

Total Experience:
${parsedData.experience || ""} years

Skills:
${skills}

Education:
${education}

Certifications:
${certifications}

Projects:
${projects}
`.trim();
};


// ======================================================
// Upload + Parse + Save Resume
// ======================================================

const uploadResume = async (file) => {

  // ====================================================
  // STEP 1: Upload Resume to Supabase Storage
  // ====================================================

  console.log("======================================");
  console.log("STEP 1: Uploading resume...");
  console.log("File:", file.originalname);
  console.log("======================================");

  const uploadResult =
    await uploadResumeFile(file);

  const fileType =
    uploadResult.fileType;

  const uploadData = {
    path: uploadResult.storagePath,
  };

  console.log(
    "Resume uploaded to storage:"
  );

  console.log(
    uploadData.path
  );


  // ====================================================
  // STEP 2: Parse Resume
  // ====================================================

  console.log("======================================");
  console.log("STEP 2: Parsing resume...");
  console.log("======================================");

  const parsedData =
    await resumeParser(file);

  console.log(
    "========== PARSED RESUME JSON =========="
  );

  console.log(
    JSON.stringify(
      parsedData,
      null,
      2
    )
  );

  console.log(
    "========================================="
  );


  // ====================================================
  // STEP 3: Find Existing Candidate OR Create New
  // ====================================================

  console.log("======================================");
  console.log(
    "STEP 3: Finding / Creating candidate..."
  );
  console.log("======================================");

  const {
    candidate,
    isNewCandidate,
  } =
    await findOrCreateCandidate(
      parsedData,
      uploadData.path
    );

  console.log(
    isNewCandidate
      ? "New candidate created."
      : "Existing candidate found."
  );


  // ====================================================
  // STEP 4: Generate / Update Candidate Embedding
  // ====================================================

  console.log("======================================");
  console.log(
    "STEP 4: Generating candidate embedding..."
  );
  console.log("======================================");

  const embeddingContent =
    buildCandidateEmbeddingContent(
      parsedData
    );


  // ----------------------------------------------------
  // Display exact content being converted into vector
  // ----------------------------------------------------

  console.log(
    "========== EMBEDDING CONTENT =========="
  );

  console.log(
    embeddingContent
  );

  console.log(
    "========================================"
  );


  // ----------------------------------------------------
  // Generate and save/update embedding
  // ----------------------------------------------------

  await saveCandidateEmbedding(
    candidate.id,
    embeddingContent
  );

  console.log(
    "Candidate embedding saved/updated successfully."
  );


  // ====================================================
  // STEP 5: Save Candidate Profile Data
  // Only for NEW candidates
  // ====================================================

  if (isNewCandidate) {

    // --------------------------------------------------
    // Employment History
    // --------------------------------------------------

    console.log("======================================");
    console.log(
      "Saving employment history..."
    );
    console.log("======================================");

    await saveCandidateExperience(
      candidate.id,
      parsedData.employmentHistory || []
    );

    console.log(
      "Employment history saved."
    );


    // --------------------------------------------------
    // Current Employment
    // --------------------------------------------------

    console.log(
      "Synchronizing current employment..."
    );

    await syncCurrentEmployment(
      candidate.id,
      parsedData.employmentHistory || []
    );

    console.log(
      "Current employment synchronized."
    );


    // --------------------------------------------------
    // Skills
    // --------------------------------------------------

    console.log("======================================");
    console.log(
      "Saving skills..."
    );
    console.log("======================================");

    await saveCandidateSkills(
      candidate.id,
      parsedData.skills || []
    );

    console.log(
      "Skills saved."
    );


    // --------------------------------------------------
    // Education
    // --------------------------------------------------

    console.log("======================================");
    console.log(
      "Saving education..."
    );
    console.log("======================================");

    await saveCandidateEducation(
      candidate.id,
      parsedData.education || []
    );

    console.log(
      "Education saved."
    );


    // --------------------------------------------------
    // Certifications
    // --------------------------------------------------

    console.log("======================================");
    console.log(
      "Saving certifications..."
    );
    console.log("======================================");

    await saveCandidateCertifications(
      candidate.id,
      parsedData.certifications || []
    );

    console.log(
      "Certifications saved."
    );


    console.log(
      "======================================"
    );

    console.log(
      "Candidate profile saved successfully."
    );

    console.log(
      "======================================"
    );

  } else {

    console.log(
      "Candidate already exists."
    );

    console.log(
      "Skipping profile child-record creation."
    );
  }


  // ====================================================
  // STEP 6: Save Resume Metadata
  // ====================================================

  console.log("======================================");

  console.log(
    "STEP 6: Saving resume history..."
  );

  console.log(
    "======================================");

  const resume =
    await saveResumeHistory(
      candidate.id,
      file,
      uploadData.path,
      fileType
    );

  console.log(
    "Resume history saved."
  );


  // ====================================================
  // STEP 7: Return Result
  // ====================================================

  return {

    success: true,

    message: isNewCandidate
      ? "Candidate created successfully."
      : "Candidate already exists. Resume uploaded successfully.",

    candidate,

    resume,
  };
};


// ======================================================
// Export
// ======================================================

module.exports = {
  uploadResume,
};