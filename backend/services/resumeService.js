
const { saveCandidateEducation } = require("./educationService");
const { saveCandidateSkills } = require("./skillService");
const { saveCandidateCertifications } = require("./certificationService");
const supabase = require("../config/supabase");
const path = require("path");
const resumeParser = require("./resumeParser");

const uploadResume = async (file) => {
  // Generate unique filename
  const fileName = `${Date.now()}-${file.originalname}`;

  let fileType = file.mimetype;

  const ext = path.extname(file.originalname).toLowerCase();

  if (fileType === "application/octet-stream") {
    switch (ext) {
      case ".pdf":
        fileType = "application/pdf";
        break;

      case ".doc":
        fileType = "application/msword";
        break;

      case ".docx":
        fileType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
    }
  }

  // Upload Resume to Supabase Storage
  const { data: uploadData, error: uploadError } =
    await supabase.storage
      .from("resume-files")
      .upload(fileName, file.buffer, {
        contentType: fileType,
      });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Parse Resume using AI
  console.log("============== FILE DEBUG ==============");
  console.log(file);
  console.log("originalname:", file.originalname);
  console.log("typeof originalname:", typeof file.originalname);
  console.log("========================================");

  const parsedData = await resumeParser(file);
console.log("=========== SKILLS FROM GEMINI ===========");
console.log(parsedData.skills);
console.log("==========================================");
  console.log("===== parsedData =====");
  console.log(JSON.stringify(parsedData, null, 2));
  console.log("======================");

  // Insert New Candidate
  const { data: candidate, error: candidateError } = await supabase
    .from("candidates")
    .insert([
      {
        full_name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        location: parsedData.location,
        experience: parsedData.experience,
        summary: parsedData.summary,
        resume_url: uploadData.path,
      },
    ])
    .select()
    .single();

  if (candidateError) {
    throw new Error(candidateError.message);
  }

  console.log("Candidate created successfully:");
  console.log(candidate);
// Save Candidate Skills
console.log("Saving candidate skills...");
console.log("saveCandidateEducation =", saveCandidateEducation);
console.log("saveCandidateSkills =", saveCandidateSkills);
console.log("saveCandidateCertifications =", saveCandidateCertifications);
await saveCandidateSkills(
  candidate.id,
  parsedData.skills
);

await saveCandidateEducation(
  candidate.id,
  parsedData.education
);

await saveCandidateCertifications(
  candidate.id,
  parsedData.certifications
);

console.log("Candidate skills saved.");
console.log("Candidate education saved.");
console.log("Candidate certifications saved.");

console.log("Candidate skills saved.");
  // Save Resume Metadata
  const { data, error } = await supabase
    .from("resumes")
    .insert([
      {
        candidate_id: candidate.id,
        file_name: file.originalname,
        file_url: uploadData.path,
        file_size: file.size,
        file_type: fileType,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    candidate,
    resume: data,
  };
};

module.exports = {
  uploadResume,
};