const supabase = require("../config/supabase");

const uploadResume = async (candidateId, file) => {
  // Generate unique filename
  const fileName = `${Date.now()}-${file.originalname}`;

  // Upload file to Supabase Storage
  const { data: uploadData, error: uploadError } =
    await supabase.storage
      .from("resume-files")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Save metadata in database
  const { data, error } = await supabase
    .from("resumes")
    .insert([
      {
        candidate_id: candidateId,
        file_name: file.originalname,
        file_url: uploadData.path,
        file_size: file.size,
        file_type: file.mimetype,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  uploadResume,
};