const supabase = require("../config/supabase");

const syncCurrentEmployment = async (
  candidateId,
  employmentHistory = []
) => {

  const currentJob = employmentHistory.find(
    job => job.currently_working === true
  );

  if (!currentJob) {
    return;
  }

  const { error } = await supabase
    .from("candidates")
    .update({

      current_company:
        currentJob.company_name || null,

      current_title:
        currentJob.job_title || null,

    })
    .eq("id", candidateId);

  if (error) {
    throw error;
  }

};

module.exports = {
  syncCurrentEmployment,
};