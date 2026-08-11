const supabase = require("../config/supabase");
const { generateEmbedding } = require("./embeddingService");

const saveCandidateEmbedding = async (candidateId, content) => {
  if (!candidateId) {
    throw new Error("Candidate ID is required");
  }

  if (!content || !content.trim()) {
    throw new Error("Content is required");
  }

  // Step 1: Generate embedding
  const embedding = await generateEmbedding(content);

  // Step 2: Convert embedding to pgvector format
  const vector = `[${embedding.join(",")}]`;

  // Step 3: Save embedding in Supabase
  const { data, error } = await supabase
    .from("candidate_embeddings")
    .insert([
      {
        candidate_id: candidateId,
        content: content,
        embedding: vector,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save candidate embedding: ${error.message}`);
  }

  return data;
};

module.exports = {
  saveCandidateEmbedding,
};