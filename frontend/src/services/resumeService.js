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

  const response = await fetch(
    `${API_URL}/resumes/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      "Resume upload failed."
    );
  }

  return data;
};