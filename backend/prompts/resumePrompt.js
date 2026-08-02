const buildResumePrompt = (resumeText) => {

  return `
You are an AI Resume Parser.

Extract information from the resume.

Return ONLY valid JSON.

{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "experience": 0,
  "summary": "",
  "skills": [],
  "education": [
    {
      "degree": "",
      "institution": "",
      "field_of_study": "",
      "start_year": "",
      "end_year": "",
      "grade": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "issue_date": "",
      "expiry_date": "",
      "credential_id": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "role": "",
      "duration": ""
    }
  ]
}

Rules:

1. experience must be ONLY the total years of professional experience.

2. Do NOT include employment history inside experience.

3. Location format:
City, State, Country

4. summary must contain 2–3 sentences.

5. skills must always be an array of strings.

6. education must always be an array.

7. certifications must always be an array.

8. projects must always be an array.

Return ONLY valid JSON.

Resume:

${resumeText}
`;
};

module.exports = {
  buildResumePrompt,
};