const buildMatchPrompt = (candidate, job) => {

  return `
You are an expert AI Recruitment Assistant.

Compare the following candidate with the job.

Candidate:

${JSON.stringify(candidate, null, 2)}

Job:

${JSON.stringify(job, null, 2)}

Return ONLY valid JSON.

{
  "matchScore": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "recommendation": "",
  "summary": ""
}

Rules:

1. matchScore must be between 0 and 100.

2. matchingSkills should contain only skills present in both candidate and job.

3. missingSkills should contain important job skills missing from the candidate.

4. recommendation must be ONLY one of:

"Highly Recommended"

"Recommended"

"Consider"

"Not Recommended"

5. summary should contain 2-3 sentences.

Return ONLY JSON.

Do not include markdown.

Do not include explanations.
`;
};

module.exports = {
  buildMatchPrompt,
};