const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

const extractText = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  try {
    if (extension === ".pdf") {
      const buffer = fs.readFileSync(filePath);
      const data = await pdf(buffer);
      return data.text;
    }

    if (extension === ".docx") {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      return result.value;
    }

    throw new Error("Unsupported resume format.");
  } catch (error) {
    console.error("Resume extraction failed:", error.message);
    throw error;
  }
};

module.exports = extractText;