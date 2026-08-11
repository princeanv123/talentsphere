const { generateEmbedding } = require("./services/embeddingService");

const candidateSemanticSearchService = require(
  "./services/candidateSemanticSearchService"
);

console.log(
  "Candidate Semantic Search Service:",
  candidateSemanticSearchService
);

const {
  searchCandidatesByEmbedding,
} = candidateSemanticSearchService;

const test = async () => {
  try {
    // ============================================
    // Step 1: Recruiter's semantic search query
    // ============================================

    const query = `
  Pediatric Cardiologist with extensive experience
  in cardiac surgery, echocardiography, pediatric heart
  transplantation, congenital heart disease and ICU care.
    `;

    console.log("======================================");
    console.log("Semantic Search Query:");
    console.log(query);
    console.log("======================================");

    // ============================================
    // Step 2: Generate embedding for query
    // ============================================

    const queryEmbedding = await generateEmbedding(query);

    console.log(
      "Semantic search query embedding generated."
    );

    console.log(
      "Vector length:",
      queryEmbedding.length
    );

    // ============================================
    // Step 3: Search candidates using pgvector
    // ============================================

    const results =
      await searchCandidatesByEmbedding(
        queryEmbedding,
        10
      );

    // ============================================
    // Step 4: Display results
    // ============================================

    console.log("======================================");
    console.log("SEMANTIC SEARCH RESULTS");
    console.log("======================================");

    console.log(
      JSON.stringify(results, null, 2)
    );

    console.log("======================================");

  } catch (error) {
    console.error(
      "Semantic search test failed:",
      error
    );
  }
};

test();