console.log(__filename);
const supabase = require("../config/supabase");

const createJob = async (jobData) => {
  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
const getAllJobs = async () => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
console.log("✅ jobService loaded");

console.log({
  createJob,
  getAllJobs,
});
module.exports = {
  createJob,
  getAllJobs,
};