const supabase = require("../config/supabase");
const { generateEmbedding } = require("./embeddingService");

// ======================================================
// Save / Update Candidate Embedding
// ======================================================

const saveCandidateEmbedding = async (
  candidateId,
  content
) => {

  if (!candidateId) {
    throw new Error("Candidate ID is required");
  }

  if (!content || !content.trim()) {
    throw new Error(
      "Embedding content is required"
    );
  }

  // ====================================================
  // STEP 1: Generate embedding
  // ====================================================

  const embedding = await generateEmbedding(
    content
  );

  // ====================================================
  // STEP 2: Check whether candidate already has
  // an embedding
  // ====================================================

  const {
    data: existingEmbedding,
    error: findError,
  } = await supabase
    .from("candidate_embeddings")
    .select("id")
    .eq("candidate_id", candidateId)
    .maybeSingle();

  if (findError) {
    console.error(
      "Error checking existing candidate embedding:",
      findError
    );

    throw findError;
  }

  // ====================================================
  // STEP 3: Update existing embedding
  // ====================================================

  if (existingEmbedding) {

    const {
      data,
      error,
    } = await supabase
      .from("candidate_embeddings")
      .update({
        content,
        embedding,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingEmbedding.id)
      .select()
      .single();

    if (error) {

      console.error(
        "Error updating candidate embedding:",
        error
      );

      throw error;
    }

    console.log(
      "Existing candidate embedding updated."
    );

    return data;
  }

  // ====================================================
  // STEP 4: Create new embedding
  // ====================================================

  const {
    data,
    error,
  } = await supabase
    .from("candidate_embeddings")
    .insert({
      candidate_id: candidateId,
      content,
      embedding,
    })
    .select()
    .single();

  if (error) {

    console.error(
      "Error creating candidate embedding:",
      error
    );

    throw error;
  }

  console.log(
    "New candidate embedding created."
  );

  return data;
};


// ======================================================

module.exports = {
  saveCandidateEmbedding,
};