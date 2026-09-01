const supabase = require("../config/supabase");
const { callGemini } = require("../utils/geminiHelper");

// ======================================================
// Check Supabase
// ======================================================

const checkSupabase = async () => {
  const start = Date.now();

  try {
    const { error } = await supabase
      .from("candidates")
      .select("id")
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return {
      name: "Supabase",
      status: "healthy",
      message: "Database connection is healthy.",
      responseTimeMs: Date.now() - start,
    };

  } catch (error) {

    return {
      name: "Supabase",
      status: "failed",
      message: error.message || "Supabase connection failed.",
      responseTimeMs: Date.now() - start,
    };

  }
};


// ======================================================
// Check Gemini AI
// ======================================================

const checkGemini = async () => {
  const start = Date.now();

  try {

    const response = await callGemini(
      "Reply with exactly: HEALTHY"
    );

    if (!response) {
      throw new Error("Empty response from Gemini.");
    }

    return {
      name: "Gemini AI",
      status: "healthy",
      message: "Gemini AI is responding normally.",
      responseTimeMs: Date.now() - start,
    };

  } catch (error) {

    return {
      name: "Gemini AI",
      status: "failed",
      message: error.message || "Gemini AI request failed.",
      responseTimeMs: Date.now() - start,
    };

  }
};


// ======================================================
// Complete System Health Check
// ======================================================

const getSystemHealth = async () => {

  const start = Date.now();

  const components = {
    backend: {
      name: "Backend API",
      status: "healthy",
      message: "Backend API is responding normally.",
      responseTimeMs: 0,
    },

    supabase: await checkSupabase(),

    gemini: await checkGemini(),
  };

  const failedComponents = Object.values(components)
    .filter((component) => component.status !== "healthy")
    .map((component) => component.name);

  const overallStatus =
    failedComponents.length === 0
      ? "healthy"
      : "degraded";

  return {
    success: overallStatus === "healthy",
    status: overallStatus,

    message:
      overallStatus === "healthy"
        ? "System has been monitored and found healthy."
        : "System health check detected an issue.",

    checkedAt: new Date().toISOString(),

    totalResponseTimeMs:
      Date.now() - start,

    components,

    failedComponents,
  };
};


// ======================================================
// Export
// ======================================================

module.exports = {
  getSystemHealth,
};