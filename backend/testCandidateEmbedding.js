const { saveCandidateEmbedding } = require("./services/candidateEmbeddingService");

const test = async () => {
  try {
    // Existing candidate ID from Supabase
    const candidateId = "b192bccd-1013-4c0e-9edf-244d416529f1";

    const content = `
      Cloud Infrastructure Engineer with experience in AWS, GCP,
      Terraform, Ansible, Docker and Kubernetes.
      Experienced in cloud migration, AWS VPC migration,
      infrastructure automation and CI/CD.
    `;

    const result = await saveCandidateEmbedding(
      candidateId,
      content
    );

    console.log("Candidate embedding saved successfully.");
    console.log("Embedding record:", result);

  } catch (error) {
    console.error("Candidate embedding test failed:", error);
  }
};

test();