const supabase = require("../config/supabase");

const saveJobSkills = async (jobId, skills = []) => {

  console.log("===== saveJobSkills CALLED =====");
  console.log("Job ID:", jobId);
  console.log("Skills:", skills);

  if (!skills || skills.length === 0) {
    return;
  }

  // Remove duplicates and trim whitespace
  const uniqueSkills = [...new Set(skills.map(skill => skill.trim()))];

  for (const skill of uniqueSkills) {

    console.log("Processing skill:", skill);

    // Check whether the skill already exists
    let { data: existingSkill, error: skillError } = await supabase
      .from("skills")
      .select("*")
      .eq("skill_name", skill)
      .maybeSingle();

    if (skillError) {
      throw new Error(skillError.message);
    }

    // Create the skill if it doesn't exist
    if (!existingSkill) {

      const { data: newSkill, error: insertSkillError } = await supabase
        .from("skills")
        .insert({
          skill_name: skill,
        })
        .select()
        .single();

      if (insertSkillError) {
        throw new Error(insertSkillError.message);
      }

      existingSkill = newSkill;
      console.log("Created skill:", existingSkill);
    }

    // Check whether the mapping already exists
    const { data: mapping, error: mappingError } = await supabase
      .from("job_skills")
      .select("*")
      .eq("job_id", jobId)
      .eq("skill_id", existingSkill.id)
      .maybeSingle();

    if (mappingError) {
      throw new Error(mappingError.message);
    }

    // Create mapping only if it doesn't already exist
    if (!mapping) {

      const { error: insertMappingError } = await supabase
        .from("job_skills")
        .insert({
          job_id: jobId,
          skill_id: existingSkill.id,
        });

      if (insertMappingError) {
        throw new Error(insertMappingError.message);
      }
      console.log("Mapped skill:", existingSkill.skill_name);
    }
  }
};

module.exports = {
  saveJobSkills,
};