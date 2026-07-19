const supabase = require("../config/supabase");
const path = require("path");

const uploadResumeFile = async (file) => {

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

  const { data, error } =
    await supabase.storage
      .from("resume-files")
      .upload(fileName, file.buffer, {
        contentType: fileType,
      });

  if (error) {
    throw new Error(error.message);
  }

  return {
    fileName,
    fileType,
    storagePath: data.path,
  };

};

module.exports = {
  uploadResumeFile,
};