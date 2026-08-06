const supabase = require("../config/supabase");

const discoverCandidates = async (job) => {

  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("*")
    .gte("experience", job.experience_required);

  if (error) {
    throw new Error("Unable to discover candidates.");
  }

  console.log("======================================");
console.log("Candidates Discovered:", candidates.length);
console.log("======================================");

return candidates;
};

module.exports = {
  discoverCandidates,
};