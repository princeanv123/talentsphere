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
  // KEYWORD SEARCH
  // ========================================

  if (keyword) {
    let searchTerm = keyword.trim();

    // --------------------------------------
    // Remove surrounding double quotes
    // --------------------------------------

    if (
      searchTerm.startsWith('"') &&
      searchTerm.endsWith('"')
    ) {
      searchTerm = searchTerm.slice(1, -1).trim();
    }

    // --------------------------------------
    // Remove surrounding single quotes
    // --------------------------------------

    if (
      searchTerm.startsWith("'") &&
      searchTerm.endsWith("'")
    ) {
      searchTerm = searchTerm.slice(1, -1).trim();
    }

    // If nothing remains after cleaning
    if (!searchTerm) {
      return [];
    }

    console.log("======================================");
    console.log("Candidate Keyword Search:", searchTerm);
    console.log("======================================");

    // ======================================
    // 1. Candidate Name
    // ======================================

    const {
      data: nameMatches,
      error: nameError,
    } = await supabase
      .from("candidates")
      .select("id")
      .ilike(
        "full_name",
        `%${searchTerm}%`
      );

    if (nameError) {
      throw new Error(nameError.message);
    }

    // ======================================
    // 2. Candidate Email
    // ======================================

    const {
      data: emailMatches,
      error: emailError,
    } = await supabase
      .from("candidates")
      .select("id")
      .ilike(
        "email",
        `%${searchTerm}%`
      );

    if (emailError) {
      throw new Error(emailError.message);
    }

    // ======================================
    // 3. Candidate Location
    // ======================================

    const {
      data: locationMatches,
      error: locationError,
    } = await supabase
      .from("candidates")
      .select("id")
      .ilike(
        "location",
        `%${searchTerm}%`
      );

    if (locationError) {
      throw new Error(locationError.message);
    }

    // ======================================
    // 4. Candidate Summary
    // ======================================

    const {
      data: summaryMatches,
      error: summaryError,
    } = await supabase
      .from("candidates")
      .select("id")
      .ilike(
        "summary",
        `%${searchTerm}%`
      );

    if (summaryError) {
      throw new Error(summaryError.message);
    }

    // ======================================
    // 5. Current Company
    // ======================================

    const {
      data: currentCompanyMatches,
      error: currentCompanyError,
    } = await supabase
      .from("candidates")
      .select("id")
      .ilike(
        "current_company",
        `%${searchTerm}%`
      );

    if (currentCompanyError) {
      throw new Error(
        currentCompanyError.message
      );
    }

    // ======================================
    // 6. Current Role Title
    // ======================================

    const {
      data: currentTitleMatches,
      error: currentTitleError,
    } = await supabase
      .from("candidates")
      .select("id")
      .ilike(
        "current_title",
        `%${searchTerm}%`
      );

    if (currentTitleError) {
      throw new Error(
        currentTitleError.message
      );
    }

    // ======================================
    // 7. Skills
    // ======================================

    const {
      data: skillMatches,
      error: skillError,
    } = await supabase
      .from("skills")
      .select("id")
      .ilike(
        "skill_name",
        `%${searchTerm}%`
      );

    if (skillError) {
      throw new Error(skillError.message);
    }

    // ======================================
    // Candidates Having Matching Skills
    // ======================================

    let skillCandidateMatches = [];

    if (
      skillMatches &&
      skillMatches.length > 0
    ) {
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
        throw new Error(
          candidateSkillError.message
        );
      }

      skillCandidateMatches =
        candidateSkillMatches || [];
    }

    // ======================================
    // 8. Historical Company Name
    // ======================================

    const {
      data: experienceCompanyMatches,
      error: experienceCompanyError,
    } = await supabase
      .from("candidate_experience")
      .select("candidate_id")
      .ilike(
        "company_name",
        `%${searchTerm}%`
      );

    if (experienceCompanyError) {
      throw new Error(
        experienceCompanyError.message
      );
    }

    // ======================================
    // 9. Historical Job Title
    // ======================================

    const {
      data: experienceTitleMatches,
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

    // ======================================
    // 10. Historical Technologies
    // ======================================

    const {
      data: technologyMatches,
      error: technologyError,
    } = await supabase
      .from("candidate_experience")
      .select("candidate_id")
      .ilike(
        "technologies",
        `%${searchTerm}%`
      );

    if (technologyError) {
      throw new Error(
        technologyError.message
      );
    }

    // ======================================
    // 11. Historical Responsibilities
    // ======================================

    const {
      data: responsibilityMatches,
      error: responsibilityError,
    } = await supabase
      .from("candidate_experience")
      .select("candidate_id")
      .ilike(
        "responsibilities",
        `%${searchTerm}%`
      );

    if (responsibilityError) {
      throw new Error(
        responsibilityError.message
      );
    }

    // ======================================
    // 12. Historical Employment Location
    // ======================================

    const {
      data: experienceLocationMatches,
      error: experienceLocationError,
    } = await supabase
      .from("candidate_experience")
      .select("candidate_id")
      .ilike(
        "location",
        `%${searchTerm}%`
      );

    if (experienceLocationError) {
      throw new Error(
        experienceLocationError.message
      );
    }

    // ======================================
    // 13. Education - Degree
    // ======================================

    const {
      data: educationDegreeMatches,
      error: educationDegreeError,
    } = await supabase
      .from("education")
      .select("candidate_id")
      .ilike(
        "degree",
        `%${searchTerm}%`
      );

    if (educationDegreeError) {
      throw new Error(
        educationDegreeError.message
      );
    }

    // ======================================
    // 14. Education - Institution
    // ======================================

    const {
      data: educationInstitutionMatches,
      error: educationInstitutionError,
    } = await supabase
      .from("education")
      .select("candidate_id")
      .ilike(
        "institution",
        `%${searchTerm}%`
      );

    if (educationInstitutionError) {
      throw new Error(
        educationInstitutionError.message
      );
    }

    // ======================================
    // 15. Education - Field of Study
    // ======================================

    const {
      data: educationFieldMatches,
      error: educationFieldError,
    } = await supabase
      .from("education")
      .select("candidate_id")
      .ilike(
        "field_of_study",
        `%${searchTerm}%`
      );

    if (educationFieldError) {
      throw new Error(
        educationFieldError.message
      );
    }

    // ======================================
    // 16. Certifications - Name
    // ======================================

    const {
      data: certificationMatches,
      error: certificationError,
    } = await supabase
      .from("certifications")
      .select("candidate_id")
      .ilike(
        "certification_name",
        `%${searchTerm}%`
      );

    if (certificationError) {
      throw new Error(
        certificationError.message
      );
    }

    // ======================================
    // 17. Certifications - Organization
    // ======================================

    const {
      data: certificationOrgMatches,
      error: certificationOrgError,
    } = await supabase
      .from("certifications")
      .select("candidate_id")
      .ilike(
        "issuing_organization",
        `%${searchTerm}%`
      );

    if (certificationOrgError) {
      throw new Error(
        certificationOrgError.message
      );
    }

    // ======================================
    // COMBINE ALL CANDIDATE IDs
    // ======================================

    const candidateIds = [

      // Candidate
      ...(nameMatches || []).map(
        (candidate) => candidate.id
      ),

      ...(emailMatches || []).map(
        (candidate) => candidate.id
      ),

      ...(locationMatches || []).map(
        (candidate) => candidate.id
      ),

      ...(summaryMatches || []).map(
        (candidate) => candidate.id
      ),

      // Current employment
      ...(currentCompanyMatches || []).map(
        (candidate) => candidate.id
      ),

      ...(currentTitleMatches || []).map(
        (candidate) => candidate.id
      ),

      // Skills
      ...skillCandidateMatches.map(
        (candidate) =>
          candidate.candidate_id
      ),

      // Historical employment
      ...(experienceCompanyMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),

      ...(experienceTitleMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),

      ...(technologyMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),

      ...(responsibilityMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),

      ...(experienceLocationMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),

      // Education
      ...(educationDegreeMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),

      ...(educationInstitutionMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),

      ...(educationFieldMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),

      // Certifications
      ...(certificationMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),

      ...(certificationOrgMatches || []).map(
        (candidate) =>
          candidate.candidate_id
      ),
    ];

    // ======================================
    // REMOVE DUPLICATE CANDIDATE IDs
    // ======================================

    const uniqueCandidateIds = [
      ...new Set(candidateIds),
    ];

    console.log(
      "Matching Candidate IDs:",
      uniqueCandidateIds
    );

    // ======================================
    // No Keyword Matches
    // ======================================

    if (
      uniqueCandidateIds.length === 0
    ) {
      return [];
    }

    // ======================================
    // Restrict Main Query
    // ======================================

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
  // ========================================

  if (
    experience !== undefined &&
    experience !== null
  ) {
    query = query.gte(
      "experience",
      experience
    );
  }

  // ========================================
  // Execute Final Query
  // ========================================

  const {
    data,
    error,
  } = await query.order(
    "experience",
    {
      ascending: false,
    }
  );

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

    const skillIds =
      candidateSkills.map(
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
    .order(
      "uploaded_at",
      {
        ascending: false,
      }
    );

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