const buildRankingPrompt = (
  candidate,
  candidateSkills,
  job,
  jobSkills
) => {

  return `
You are an expert Technical Recruiter.

Compare the following candidate against the job.

Candidate Details:
${JSON.stringify(candidate, null, 2)}

Candidate Skills:
${candidateSkills.join(", ")}

Job Details:
${JSON.stringify(job, null, 2)}

Required Skills:
${jobSkills.join(", ")}

Return ONLY valid JSON.

{
  "overallMatch": 0,
  "strengths": [],
  "gaps": [],
  "recommendation": ""
}

Rules:

1. overallMatch must be between 0 and 100.

2. strengths should contain a maximum of 5 concise points.

3. gaps should contain a maximum of 5 concise points.

4. recommendation must be ONLY one of:

"Highly Recommended"

"Recommended"

"Needs Review"

"Not Recommended"

Return ONLY JSON.

Do not return markdown.

Do not return explanations.
`;
};

module.exports = {
  buildRankingPrompt,
};