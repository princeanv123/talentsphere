const supabase = require("../config/supabase");

/*
 * Gemini health is intentionally NOT tested by making a new
 * Gemini API request on every dashboard health refresh.
 *
 * Gemini API requests consume quota. System Health may refresh
 * frequently, so calling Gemini here would unnecessarily consume
 * the project's quota.
 *
 * Instead, we maintain a lightweight cached status.
 */

let geminiHealthCache = {
  status: "unknown",
  message: "Gemini AI has not been tested recently.",
  responseTimeMs: null,
  checkedAt: null,
};

/*
 * This function can be called by actual Gemini operations later.
 * For example:
 *
 *   recordGeminiSuccess(responseTimeMs)
 *   recordGeminiFailure(error, responseTimeMs)
 *
 * This allows System Health to report the result of real Gemini
 * activity rather than generating artificial health-check traffic.
 */

const recordGeminiSuccess = (responseTimeMs = null) => {
  geminiHealthCache = {
    status: "healthy",
    message: "Gemini AI is responding normally.",
    responseTimeMs,
    checkedAt: new Date().toISOString(),
  };
};

const recordGeminiFailure = (error, responseTimeMs = null) => {
  const errorMessage =
    error?.message ||
    error?.response?.data?.error?.message ||
    "Gemini AI request failed.";

  const normalizedMessage = String(errorMessage);

  const isQuotaError =
    normalizedMessage.includes("429") ||
    normalizedMessage.includes("RESOURCE_EXHAUSTED") ||
    normalizedMessage.includes("quota") ||
    normalizedMessage.includes("Quota");

  geminiHealthCache = {
    status: isQuotaError ? "quota_exhausted" : "failed",
    message: isQuotaError
      ? "Gemini AI quota has been exhausted."
      : "Gemini AI request failed.",
    responseTimeMs,
    checkedAt: new Date().toISOString(),
  };
};

/*
 * Supabase health check.
 *
 * This is safe to run during dashboard refresh because it does
 * not consume Gemini quota.
 */
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
      message: "Supabase connection failed.",
      responseTimeMs: Date.now() - start,
    };
  }
};

/*
 * Gemini health is read from the cache.
 *
 * IMPORTANT:
 * No Gemini API request is made here.
 */
const checkGemini = () => {
  return {
    name: "Gemini AI",
    status: geminiHealthCache.status,
    message: geminiHealthCache.message,
    responseTimeMs: geminiHealthCache.responseTimeMs,
    checkedAt: geminiHealthCache.checkedAt,
  };
};

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

    gemini: checkGemini(),
  };

  /*
   * "unknown" is intentionally NOT treated as a failure.
   *
   * When the application has not made a Gemini request yet,
   * we shouldn't falsely tell the user that Gemini is broken.
   */
  const failedComponents = Object.values(components)
    .filter(
      (component) =>
        component.status !== "healthy" &&
        component.status !== "unknown"
    )
    .map((component) => component.name);

  const hasUnknownComponents = Object.values(components).some(
    (component) => component.status === "unknown"
  );

  let overallStatus = "healthy";

  if (failedComponents.length > 0) {
    overallStatus = "degraded";
  } else if (hasUnknownComponents) {
    overallStatus = "healthy";
  }

  return {
    success: failedComponents.length === 0,

    status: overallStatus,

    message:
      overallStatus === "healthy"
        ? "System is operating normally."
        : "System health check detected an issue.",

    checkedAt: new Date().toISOString(),

    totalResponseTimeMs: Date.now() - start,

    components,

    failedComponents,
  };
};

module.exports = {
  getSystemHealth,
  recordGeminiSuccess,
  recordGeminiFailure,
};