const supabase = require("../config/supabase");

const deleteCandidate = async (candidateId) => {
  // Check if the candidate exists
  const { data: candidate, error: fetchError } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (fetchError || !candidate) {
    throw new Error("Candidate not found");
  }

  // Delete the candidate
  const { error: deleteError } = await supabase
    .from("candidates")
    .delete()
    .eq("id", candidateId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  return candidate;
};

module.exports = {
  deleteCandidate,
};