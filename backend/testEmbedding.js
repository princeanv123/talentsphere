require("dotenv").config();

const { generateEmbedding } = require("./services/embeddingService");

const test = async () => {
  try {
    const text = `
      Cloud Infrastructure Engineer with experience in AWS, GCP,
      Terraform, Ansible, Docker and Kubernetes.
      Experienced in cloud migration, AWS VPC migration,
      infrastructure automation and CI/CD.
    `;

    const embedding = await generateEmbedding(text);

    console.log("Embedding generated successfully.");
    console.log("Vector length:", embedding.length);
    console.log("First 5 values:", embedding.slice(0, 5));
  } catch (error) {
    console.error("Embedding test failed:", error);
  }
};

test();