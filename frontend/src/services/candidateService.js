const API_URL = "http://localhost:5000/api/candidates";

export const getCandidateById = async (candidateId) => {
  const response = await fetch(`${API_URL}/${candidateId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch candidate");
  }

  const result = await response.json();

  return result.data;
};