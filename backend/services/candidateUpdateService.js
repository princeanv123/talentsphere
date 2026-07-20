const supabase = require("../config/supabase");

const updateCandidate = async (candidateId, data = {}) => {
  const updateData = {};

  if (data.full_name !== undefined) {
    updateData.full_name = data.full_name.trim();
  }

  if (data.phone !== undefined) {
    updateData.phone = data.phone.trim();
  }

  if (data.location !== undefined) {
    updateData.location = data.location.trim();
  }

  if (data.summary !== undefined) {
    updateData.summary = data.summary.trim();
  }

  if (data.experience !== undefined) {
    const experience = Number(data.experience);

    if (isNaN(experience)) {
      throw new Error("Experience must be numeric");
    }

    updateData.experience = experience;
  }

  const { data: candidate, error } = await supabase
  .from("candidates")
  .update(updateData)
  .eq("id", candidateId)
  .select();

console.log("Candidate ID:", candidateId);
console.log("Update Data:", updateData);
console.log("Returned Candidate:", candidate);
console.log("Supabase Error:", error);

if (error) {
  throw error;
}

if (!candidate || candidate.length === 0) {
  throw new Error("Candidate not found");
}

return candidate[0];
};

module.exports = {
  updateCandidate,
};