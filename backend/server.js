const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/resumes", resumeRoutes);

app.get("/", (req, res) => {
  res.send("TalentSphere Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.get("/api/test", async (req, res) => {
  res.json({
    success: true,
    message: "TalentSphere Backend Connected Successfully 🚀"
  });
});
app.use((err, req, res, next) => {
  console.error("Multer Error Code:", err.code);
  console.error("Multer Error Field:", err.field);
  console.error(err);

  res.status(500).json({
    success: false,
    error: err.message,
    code: err.code,
    field: err.field,
  });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});