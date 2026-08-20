const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/candidates";

// ========================================
// Get Candidate By ID
// ========================================

export const getCandidateById = async (candidateId) => {
  const response = await fetch(`${API_URL}/${candidateId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch candidate");
  }

  const result = await response.json();

  return result.data;
};

// ========================================
// Search Candidates
// ========================================

export const searchCandidates = async ({
  keyword = "",
  location = "",
  experience = "",
} = {}) => {
  const params = new URLSearchParams();

  if (keyword.trim()) {
    params.append("keyword", keyword.trim());
  }

  if (location.trim()) {
    params.append("location", location.trim());
  }

  if (experience !== "") {
    params.append("experience", experience);
  }

  const response = await fetch(
    `${API_URL}/search?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to search candidates");
  }

  const result = await response.json();

  console.log("Search API Response:", result);

  return result.data;
};