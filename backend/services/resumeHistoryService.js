const supabase = require("../config/supabase");

console.log("✅ resumeHistoryService.js loaded");

async function saveResumeHistory(
  candidateId,
  file,
  filePath,
  fileType
) {
  const { data, error } = await supabase
    .from("resumes")
    .insert([
      {
        candidate_id: candidateId,
        file_name: file.originalname,
        file_url: filePath,
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