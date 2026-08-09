const supabase = require("../config/supabase");

console.log("✅ resumeHistoryService.js loaded");

async function saveResumeHistory(
  candidateId,
  file,
  filePath,
  fileType
) {

  // Generate public URL for the uploaded resume
  const { data: publicUrlData } = supabase.storage
    .from("resume-files")
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  console.log("Resume public URL:", publicUrl);

  const { data, error } = await supabase
    .from("resumes")
    .insert([
      {
        candidate_id: candidateId,
        file_name: file.originalname,
        file_url: publicUrl,
        file_size: file.size,
        file_type: fileType,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  saveResumeHistory,
};