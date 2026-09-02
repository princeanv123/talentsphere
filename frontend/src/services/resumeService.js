const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ========================================
// Upload Resume
// ========================================

export const uploadResume = async (file) => {
  if (!file) {
    throw new Error("Please select a resume file.");
  }

  const formData = new FormData();

  // IMPORTANT:
  // Backend uses upload.single("resume")
  // Therefore the field name must be "resume".
  formData.append("resume", file);

  let response;

  try {
    response = await fetch(
      `${API_URL}/resumes/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
  } catch (error) {
    throw new Error(
      "Unable to connect to TalentSphere backend."
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Server returned an invalid response."
    );
  }

  if (!response.ok) {
    const rawMessage =
      data?.message ||
      data?.error ||
      "";

    const normalizedMessage = String(rawMessage).toLowerCase();

    /*
     * Gemini quota exhaustion
     *
     * Gemini may return the quota error as a JSON string
     * inside the backend error response. Do not expose that
     * raw Google response to TalentSphere users.
     */
    if (
      response.status === 429 ||
      normalizedMessage.includes("resource_exhausted") ||
      normalizedMessage.includes("quota exceeded") ||
      normalizedMessage.includes("exceeded your current quota") ||
      normalizedMessage.includes("generativelanguage.googleapis.com")
    ) {
      throw new Error(
        "AI processing is temporarily unavailable because the Gemini AI quota has been exhausted. Please try again later."
      );
    }

    /*
     * Gemini temporary service availability
     */
    if (
      normalizedMessage.includes("service unavailable") ||
      normalizedMessage.includes("currently experiencing high demand") ||
      normalizedMessage.includes("unavailable")
    ) {
      throw new Error(
        "AI processing is temporarily unavailable. Please try again later."
      );
    }

    /*
     * Generic upload error
     */
    throw new Error(
      rawMessage ||
      "Resume upload failed."
    );
  }

  return data;
};