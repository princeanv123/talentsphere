const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

const extractText = async (file) => {

  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".pdf") {
    const data = await pdf(file.buffer);
    return data.text;
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  throw new Error("Unsupported resume format.");
};

module.exports = extractText;