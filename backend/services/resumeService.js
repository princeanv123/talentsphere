const supabase = require("../config/supabase");
const path = require("path");

const uploadResume = async (candidateId, file) => {
  // Generate unique filename
  const fileName = `${Date.now()}-${file.originalname}`;

  // Determine correct MIME type
  const ext = path.extname(file.originalname).toLowerCase();

  let fileType = file.mimetype;

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

  // Upload file to Supabase Storage
  const { data: uploadData, error: uploadError } =
    await supabase.storage
      .from("resume-files")
      .upload(fileName, file.buffer, {
        contentType: fileType,
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
        file_type: fileType,
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