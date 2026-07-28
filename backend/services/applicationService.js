const supabase = require("../config/supabase");

const createApplication = async (applicationData) => {
  const { data, error } = await supabase
    .from("job_applications")
    .insert(applicationData)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  createApplication,
};