const supabase = require("../config/supabase");

const findOrCreateCandidate = async (parsedData, resumePath) => {
  let candidate;
  let isNewCandidate = false;

    console.log("========== Candidate Lookup ==========");
  console.log("Parsed Name :", parsedData.name);
  console.log("Parsed Email:", parsedData.email);
  console.log("======================================");

// Check if candidate already exists
let existingCandidate = null;

if (parsedData.email && parsedData.email.trim() !== "") {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("email", parsedData.email.trim())
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  existingCandidate = data;
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