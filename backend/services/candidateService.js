const supabase = require("../config/supabase");

const findOrCreateCandidate = async (parsedData, resumePath) => {
  let candidate;
  let isNewCandidate = false;

  // Check if candidate already exists
  const { data: existingCandidate, error: fetchError } = await supabase
    .from("candidates")
    .select("*")
    .eq("email", parsedData.email)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (existingCandidate) {
    console.log("Existing candidate found.");
    candidate = existingCandidate;
  } else {
    console.log("Creating new candidate...");

    const { data: newCandidate, error: candidateError } = await supabase
      .from("candidates")
      .insert([
        {
          full_name: parsedData.name,
          email: parsedData.email,
          phone: parsedData.phone,
          location: parsedData.location,
          experience: parsedData.experience,
          summary: parsedData.summary,
          resume_url: resumePath,
        },
      ])
      .select()
      .single();

    if (candidateError) {
      throw new Error(candidateError.message);
    }

    candidate = newCandidate;
    isNewCandidate = true;

    console.log("New candidate created.");
  }

  return {
    candidate,
    isNewCandidate,
  };
};

module.exports = {
  findOrCreateCandidate,
};