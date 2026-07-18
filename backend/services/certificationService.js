const supabase = require("../config/supabase");

const saveCandidateCertifications = async (
  candidateId,
  certifications = []
) => {

  if (!certifications || certifications.length === 0) {
    return;
  }

  const certificationRows = certifications.map((cert) => ({
    candidate_id: candidateId,

    certification_name:
      typeof cert === "string"
        ? cert
        : cert.certification_name || cert.name || null,

    issuing_organization:
      typeof cert === "object"
        ? cert.issuing_organization || null
        : null,

    issue_date:
      typeof cert === "object"
        ? cert.issue_date || null
        : null,

    expiry_date:
      typeof cert === "object"
        ? cert.expiry_date || null
        : null,

    credential_id:
      typeof cert === "object"
        ? cert.credential_id || null
        : null,
  }));

  const { error } = await supabase
    .from("certifications")
    .insert(certificationRows);

  if (error) {
    console.error(error);
    throw error;
  }

  console.log("Candidate certifications saved.");
};

module.exports = {
  saveCandidateCertifications,
};