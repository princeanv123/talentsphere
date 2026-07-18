const supabase = require("../config/supabase");

const saveCandidateEducation = async (candidateId, education = []) => {
  if (!education || education.length === 0) {
    return;
  }

  const educationRows = education.map((edu) => ({
    candidate_id: candidateId,
    degree: edu.degree || null,
    institution: edu.institution || null,
    field_of_study: edu.field_of_study || null,
    start_year: edu.start_year || null,
    end_year: edu.end_year || null,
    grade: edu.grade || null,
  }));

  const { error } = await supabase
    .from("education")
    .insert(educationRows);

  if (error) {
    console.error("Education insert error:", error);
    throw error;
  }

  console.log("Candidate education saved.");
};

module.exports = {
  saveCandidateEducation,
};