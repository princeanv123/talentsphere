const supabase = require("../config/supabase");

const discoverCandidates = async (job) => {

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("*")
    .gte("experience", job.experience_required);

  if (error) {
    throw new Error("Unable to discover candidates.");
  }

  return candidates;
};

module.exports = {
  discoverCandidates,
};