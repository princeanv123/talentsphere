const supabase = require("../config/supabase");

const getAllCandidates = async () => {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
console.log("getAllCandidates =", getAllCandidates);
module.exports = {
  getAllCandidates,
};