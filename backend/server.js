const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");

const app = express();

app.use(cors());
app.use(express.json());

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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});