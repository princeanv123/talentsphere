const supabase = require("../config/supabase");
const path = require("path");
const crypto = require("crypto");

const uploadResumeFile = async (file) => {

  // ======================================================
  // STEP 1: Generate SHA-256 hash from actual file content
  // ======================================================

  const fileHash = crypto
    .createHash("sha256")
    .update(file.buffer)
    .digest("hex");

  console.log("======================================");
  console.log("Resume file hash generated:");
  console.log(fileHash);
  console.log("======================================");


  // ======================================================
  // STEP 2: Create storage-safe filename
  // ======================================================

  const originalName = file.originalname;

  const extension =
    path.extname(originalName).toLowerCase();

  const baseName =
    path.basename(
      originalName,
      extension
    );


  // Replace unsafe characters with "_"
  const safeBaseName =
    baseName
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");


  const fileName =
    `${Date.now()}-${safeBaseName}${extension}`;


  // ======================================================
  // STEP 3: Determine file type
  // ======================================================

  let fileType = file.mimetype;

  if (fileType === "application/octet-stream") {

    switch (extension) {

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


  // ======================================================
  // STEP 4: Upload to Supabase Storage
  // ======================================================

  const { data, error } =
    await supabase.storage
      .from("resume-files")
      .upload(
        fileName,
        file.buffer,
        {
          contentType: fileType,
        }
      );


  if (error) {
    throw new Error(error.message);
  }


  // ======================================================
  // STEP 5: Return upload information
  // ======================================================

  return {

    fileName,

    originalName,

    fileType,

    storagePath: data.path,

    fileHash,

  };

};


module.exports = {
  uploadResumeFile,
};