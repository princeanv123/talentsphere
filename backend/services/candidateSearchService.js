const supabase = require("../config/supabase");

// ========================================
// Candidate Listing
// ========================================

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

// ========================================
// Candidate Search
// ========================================

const searchCandidates = async ({
  keyword,
  location,
  experience,
}) => {
  let query = supabase
    .from("candidates")
    .select("*");

  // ========================================
  // Keyword Search
  // Searches:
  // 1. Candidate Name
  // 2. Candidate Email
  // 3. Candidate Skills
  // 4. Current Role Title
  // 5. Historical Role Titles
  // ========================================

  if (keyword) {
    // --------------------------------------
    // Clean search term
    // --------------------------------------

    let searchTerm = keyword.trim();

    // Remove surrounding double quotes
    // Example:
    // "Infrastructure Engineer"
    // becomes:
    // Infrastructure Engineer
    if (
      searchTerm.startsWith('"') &&
      searchTerm.endsWith('"')
    ) {
      searchTerm = searchTerm.slice(1, -1).trim();
    }

    // Remove surrounding single quotes
    // Example:
    // 'Project Manager'
    // becomes:
    // Project Manager
    if (
      searchTerm.startsWith("'") &&
      searchTerm.endsWith("'")
    ) {
      searchTerm = searchTerm.slice(1, -1).trim();
    }

    // --------------------------------------
    // Search Candidate Name
    // --------------------------------------

    const {
      data: nameMatches,
      error: nameError,
    } = await supabase
      .from("candidates")
      .select("id")
      .ilike("full_name", `%${searchTerm}%`);

    if (nameError) {
      throw new Error(nameError.message);
    }

    // --------------------------------------
    // Search Candidate Email
    // --------------------------------------

    const {
      data: emailMatches,
      error: emailError,
    } = await supabase
      .from("candidates")
      .select("id")
      .ilike("email", `%${searchTerm}%`);

    if (emailError) {
      throw new Error(emailError.message);
    }

    // --------------------------------------
    // Search Skills
    // skills.skill_name
    // --------------------------------------

    const {
      data: skillMatches,
      error: skillError,
    } = await supabase
      .from("skills")
      .select("id")
      .ilike("skill_name", `%${searchTerm}%`);

    if (skillError) {
      throw new Error(skillError.message);
    }

    // --------------------------------------
    // Find Candidates Having Matching Skills
    // --------------------------------------

    let skillCandidateMatches = [];

    if (skillMatches && skillMatches.length > 0) {
      const skillIds = skillMatches.map(
        (skill) => skill.id
      );

      const {
        data: candidateSkillMatches,
        error: candidateSkillError,
      } = await supabase
        .from("candidate_skills")
        .select("candidate_id")
        .in("skill_id", skillIds);

      if (candidateSkillError) {
        throw new Error(candidateSkillError.message);
      }

      skillCandidateMatches =
        candidateSkillMatches || [];
    }

    // --------------------------------------
    // Search CURRENT Role Title
    // candidates.current_title
    // --------------------------------------

    const {
      data: currentTitleData,
      error: currentTitleError,
    } = await supabase
      .from("candidates")
      .select("id")
      .ilike(
        "current_title",
        `%${searchTerm}%`
      );

    if (currentTitleError) {
      throw new Error(currentTitleError.message);
    }

    const currentTitleMatches =
      currentTitleData || [];

    // --------------------------------------
    // Search HISTORICAL Role Titles
    // candidate_experience.job_title
    //
    // Example:
    //
    // Search:
    // Infrastructure Engineer
    //
    // Matches:
    // Infrastructure Engineer
    // Cloud Infrastructure Engineer
    // Senior Infrastructure Engineer
    // --------------------------------------

    const {
      data: experienceTitleData,
      error: experienceTitleError,
    } = await supabase
      .from("candidate_experience")
      .select("candidate_id")
      .ilike(
        "job_title",
        `%${searchTerm}%`
      );

    if (experienceTitleError) {
      throw new Error(
        experienceTitleError.message
      );
    }

    const experienceTitleMatches =
      experienceTitleData || [];

    // --------------------------------------
    // Combine Candidate IDs
    // --------------------------------------

    const candidateIds = [
      // Name matches
      ...(nameMatches || []).map(
        (candidate) => candidate.id
      ),

      // Email matches
      ...(emailMatches || []).map(
        (candidate) => candidate.id
      ),

      // Skill matches
      ...skillCandidateMatches.map(
        (candidate) => candidate.candidate_id
      ),

      // Current title matches
      ...(currentTitleMatches || []).map(
        (candidate) => candidate.id
      ),

      // Historical title matches
      ...(experienceTitleMatches || []).map(
        (candidate) => candidate.candidate_id
      ),
    ];

    // --------------------------------------
    // Remove Duplicate Candidate IDs
    // --------------------------------------

    const uniqueCandidateIds = [
      ...new Set(candidateIds),
    ];

    // --------------------------------------
    // If Keyword Didn't Match Anything
    // --------------------------------------

    if (uniqueCandidateIds.length === 0) {
      return [];
    }

    // --------------------------------------
    // Restrict Main Candidate Query
    // to Matching Candidates
    // --------------------------------------

    query = query.in(
      "id",
      uniqueCandidateIds
    );
  }

  // ========================================
  // Location Filter
  // ========================================

  if (location) {
    query = query.ilike(
      "location",
      `%${location}%`
    );
  }

  // ========================================
  // Experience Filter
  // Minimum Years of Experience
  // ========================================

  if (experience !== undefined && experience !== null) {
    query = query.gte(
      "experience",
      experience
    );
  }

  // ========================================
  // Execute Final Candidate Query
  // ========================================

  const {
    data,
    error,
  } = await query.order("experience", {
    ascending: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// ========================================
// Candidate Details
// ========================================

const getCandidateById = async (
  candidateId
) => {
  // --------------------------------------
  // Candidate Details
  // --------------------------------------

  const {
    data: candidate,
    error: candidateError,
  } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", candidateId)
    .single();

  if (candidateError) {
    throw new Error(
      candidateError.message
    );
  }

  // --------------------------------------
  // Candidate Skills
  // --------------------------------------

  const {
    data: candidateSkills,
    error: skillsError,
  } = await supabase
    .from("candidate_skills")
    .select("*")
    .eq("candidate_id", candidateId);

  if (skillsError) {
    throw new Error(
      skillsError.message
    );
  }

  // --------------------------------------
  // Get Actual Skill Names
  // --------------------------------------

  let skills = [];

  if (
    candidateSkills &&
    candidateSkills.length > 0
  ) {
    const skillIds = candidateSkills.map(
      (skill) => skill.skill_id
    );

    const {
      data: skillDetails,
      error: skillDetailsError,
    } = await supabase
      .from("skills")
      .select(
        "id, skill_name, category"
      )
      .in("id", skillIds);

    if (skillDetailsError) {
      throw new Error(
        skillDetailsError.message
      );
    }

    skills = skillDetails || [];
  }

  // --------------------------------------
  // Candidate Education
  // --------------------------------------

  const {
    data: education,
    error: educationError,
  } = await supabase
    .from("education")
    .select("*")
    .eq("candidate_id", candidateId);

  if (educationError) {
    throw new Error(
      educationError.message
    );
  }

  // --------------------------------------
  // Candidate Certifications
  // --------------------------------------

  const {
    data: certifications,
    error: certificationsError,
  } = await supabase
    .from("certifications")
    .select("*")
    .eq("candidate_id", candidateId);

  if (certificationsError) {
    throw new Error(
      certificationsError.message
    );
  }

  // --------------------------------------
  // Resume History
  // --------------------------------------

  const {
    data: resumeHistory,
    error: resumeHistoryError,
  } = await supabase
    .from("resumes")
    .select("*")
    .eq("candidate_id", candidateId)
    .order("uploaded_at", {
      ascending: false,
    });

  if (resumeHistoryError) {
    throw new Error(
      resumeHistoryError.message
    );
  }

  // --------------------------------------
  // Return Candidate Details
  // --------------------------------------

  return {
    candidate,
    skills,
    education,
    certifications,
    resumeHistory,
  };
};

// ========================================
// Update Candidate
// ========================================

const updateCandidate = async (
  candidateId,
  data
) => {
  const updateData = {};

  // --------------------------------------
  // Full Name
  // --------------------------------------

  if (data.full_name !== undefined) {
    updateData.full_name =
      data.full_name.trim();
  }

  // --------------------------------------
  // Phone
  // --------------------------------------

  if (data.phone !== undefined) {
    updateData.phone =
      data.phone.trim();
  }

  // --------------------------------------
  // Location
  // --------------------------------------

  if (data.location !== undefined) {
    updateData.location =
      data.location.trim();
  }

  // --------------------------------------
  // Summary
  // --------------------------------------

  if (data.summary !== undefined) {
    updateData.summary =
      data.summary.trim();
  }

  // --------------------------------------
  // Experience
  // --------------------------------------

  if (data.experience !== undefined) {
    const experience = Number(
      data.experience
    );

    if (isNaN(experience)) {
      throw new Error(
        "Experience must be numeric"
      );
    }

    updateData.experience =
      experience;
  }

  // --------------------------------------
  // Update Candidate
  // --------------------------------------

  const {
    data: candidate,
    error,
  } = await supabase
    .from("candidates")
    .update(updateData)
    .eq("id", candidateId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return candidate;
};

// ========================================
// Exports
// ========================================

module.exports = {
  getAllCandidates,
  searchCandidates,
  getCandidateById,
  updateCandidate,
};