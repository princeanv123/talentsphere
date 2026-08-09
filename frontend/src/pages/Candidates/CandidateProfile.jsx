import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCandidateById } from "../../services/candidateService";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export default function CandidateProfile() {
  const { id } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        const data = await getCandidateById(id);
        setCandidate(data);
      } catch (error) {
        console.error("Candidate profile error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading candidate profile...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load candidate: {error}
      </div>
    );
  }

  if (!candidate) {
    return <div className="p-8">Candidate not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Candidate Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Complete candidate information
          </p>
        </div>

        {/* Personal Details */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Personal Details
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{candidate.candidate.full_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{candidate.candidate.email || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{candidate.candidate.phone || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">
                {candidate.candidate.location || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Professional Details
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Current Company</p>
              <p className="font-medium">
                {candidate.candidate.current_company || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Current Title</p>
              <p className="font-medium">
                {candidate.candidate.current_title || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium">
                {candidate.candidate.experience ?? "N/A"} years
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Summary</p>
            <p className="mt-1 leading-relaxed text-gray-700">
              {candidate.candidate.summary || "N/A"}
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Skills
          </h2>

          {candidate.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-600"
                >
                  {skill.skill_name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills available.</p>
          )}
        </div>

        {/* Education */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Education
          </h2>

          {candidate.education?.length > 0 ? (
            <div className="space-y-3">
              {candidate.education.map((education) => (
                <div
                  key={education.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <p className="font-medium">
                    {education.degree || "Degree not available"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {education.institution || "Institution not available"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No education records available.</p>
          )}
        </div>

        {/* Certifications */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Certifications
          </h2>

          {candidate.certifications?.length > 0 ? (
            <div className="space-y-3">
              {candidate.certifications.map((certification) => (
                <div
                  key={certification.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <p className="font-medium">
                    {certification.name || "Certification"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No certifications available.
            </p>
          )}
        </div>

        {/* Resume History */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Resume History
          </h2>

          {candidate.resumeHistory?.length > 0 ? (
            <div className="space-y-3">
              {candidate.resumeHistory.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <p className="font-medium">
                      {resume.file_name || "Resume"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {resume.uploaded_at
                        ? new Date(resume.uploaded_at).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

{resume.file_url && (
  <a
    href={
      resume.file_url.startsWith("http")
        ? resume.file_url
        : `${SUPABASE_URL}/storage/v1/object/public/resume-files/${encodeURI(
            resume.file_url
          )}`
    }
    target="_blank"
    rel="noreferrer"
    className="text-red-600 hover:underline"
  >
    View Resume
  </a>
)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No resume history available.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}