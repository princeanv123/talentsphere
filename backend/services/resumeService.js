const supabase = require("../config/supabase");
const path = require("path");
const resumeParser = require("./resumeParser");

const uploadResume = async (candidateId, file) => {

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

  // Upload to Supabase Storage
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

  console.log(
  JSON.stringify(parsedData, null, 2)
);

  console.log("===== parsedData =====");
console.log(JSON.stringify(parsedData, null, 2));
console.log("======================");

  const { error: updateError } = await supabase
  .from("candidates")
  .update({
    full_name: parsedData.name,
    email: parsedData.email,
    phone: parsedData.phone,
    location: parsedData.location,
    experience: parsedData.experience,
    summary: parsedData.summary,
    resume_url: uploadData.path,
  })
  .eq("id", candidateId);

if (updateError) {
  throw new Error(updateError.message);
}

  // Save Resume Metadata
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