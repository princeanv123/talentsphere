const supabase = require("../config/supabase");

const saveCandidateSkills = async (candidateId, skills = []) => {

  if (!skills || skills.length === 0) {
    return;
  }

  // Remove duplicate and empty skills
  const uniqueSkills = [
    ...new Set(
      skills
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)
    ),
  ];

  for (const skill of uniqueSkills) {

    const skillName = skill;

    // Check if skill already exists
    let { data: existingSkill } = await supabase
      .from("skills")
      .select("*")
      .eq("skill_name", skillName)
      .maybeSingle();

    // Insert if not found
    if (!existingSkill) {

      const { data: newSkill, error } = await supabase
        .from("skills")
        .insert([
          {
            skill_name: skillName,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      existingSkill = newSkill;
    }

    // Check if candidate already has this skill
    const { data: existingLink } = await supabase
      .from("candidate_skills")
      .select("*")
      .eq("candidate_id", candidateId)
      .eq("skill_id", existingSkill.id)
      .maybeSingle();

    // Create link only if it doesn't already exist
    if (!existingLink) {

      const { error: linkError } = await supabase
        .from("candidate_skills")
        .insert([
          {
            candidate_id: candidateId,
            skill_id: existingSkill.id,
          },
        ]);

      if (linkError) {
        throw new Error(linkError.message);
      }
    }
  }
};

module.exports = {
  saveCandidateSkills,
};