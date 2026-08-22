const express = require("express");
const cors = require("cors");

require("dotenv").config();

const supabase = require("./config/supabase");
const resumeRoutes = require("./routes/resumeRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const candidateHybridSearchRoutes = require(
  "./routes/candidateHybridSearchRoutes"
);
const dashboardRoutes = require("./routes/dashboardRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const matchingRoutes = require("./routes/matchingRoutes");

const skillConsistencyRoutes = require(
  "./routes/skillConsistencyRoutes"
);
const experienceConsistencyRoutes = require(
  "./routes/experienceConsistencyRoutes"
);

const resumeAuthenticityRoutes = require(
  "./routes/resumeAuthenticityRoutes"
);
const app = express();
app.use((req, res, next) => {
console.log("REQUEST:", req.method, req.url);
next();
});
const resumeCompletenessRoutes = require("./routes/resumeCompletenessRoutes");
const timelineConsistencyRoutes = require(
  "./routes/timelineConsistencyRoutes"
);
const resumeFraudDetectionRoutes = require(
  "./routes/resumeFraudDetectionRoutes"
);
const careerTimelineRoutes = require(
  "./routes/careerTimelineRoutes"
);
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/candidates/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/candidates", candidateRoutes);

app.use(
  "/api/candidates",
  candidateHybridSearchRoutes
);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/matching", matchingRoutes);
app.use(
  "/api/resume-completeness",
  resumeCompletenessRoutes
);
app.use(
  "/api/timeline-consistency",
  timelineConsistencyRoutes
);
app.use(
  "/api/resume-fraud-detection",
  resumeFraudDetectionRoutes
);
app.use(
  "/api/career-timeline",
  careerTimelineRoutes
);
console.log(
  "experienceConsistencyRoutes:",
  typeof experienceConsistencyRoutes
);
console.log(
  "experienceConsistencyRoutes value:",
  experienceConsistencyRoutes
);

app.use(
  "/api/experience-consistency",
  experienceConsistencyRoutes
);
app.use(
  "/api/skill-consistency",
  skillConsistencyRoutes
);
app.use(
  "/api/resume-authenticity",
  resumeAuthenticityRoutes
);
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
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("SERVER LISTENING:", server.listening);
  console.log("SERVER ADDRESS:", server.address());
});

server.on("close", () => {
  console.log("🚨 HTTP SERVER CLOSED");
});

server.on("error", (err) => {
  console.error("🚨 HTTP SERVER ERROR:", err);
});