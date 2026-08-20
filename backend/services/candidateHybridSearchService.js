const supabase = require("../config/supabase");

const {
  searchCandidates,
} = require("./candidateSearchService");

const {
  searchCandidatesByEmbedding,
} = require("./candidateSemanticSearchService");

const {
  generateEmbedding,
} = require("./embeddingService");

console.log("✅ candidateHybridSearchService.js loaded");

// ======================================================
// Hybrid Candidate Search
// ======================================================

const searchCandidatesHybrid = async ({
  query,
  location,
  experience,
  limit = 10,
}) => {

  // ====================================================
  // STEP 0: Validate Input
  // ====================================================

  if (!query || !query.trim()) {
    throw new Error("Search query is required");
  }

  const searchQuery = query.trim();

  console.log("======================================");
  console.log("HYBRID CANDIDATE SEARCH");
  console.log("======================================");
  console.log("Query:", searchQuery);
  console.log("Location:", location || "Any");
  console.log("Experience:", experience ?? "Any");
  console.log("Limit:", limit);
  console.log("======================================");

  // ====================================================
  // STEP 1: Keyword Search
  // ====================================================

  console.log("STEP 1: Running keyword search...");

  const keywordCandidates = await searchCandidates({
    keyword: searchQuery,
    location,
    experience,
    includeKeywordMetadata: true,
  });

  console.log(
    "Keyword candidates:",
    keywordCandidates?.length || 0
  );

  // ====================================================
  // STEP 2: Generate Query Embedding
  // ====================================================

  console.log(
    "STEP 2: Generating query embedding..."
  );

  const queryEmbedding =
    await generateEmbedding(searchQuery);

  console.log(
    "Query embedding dimensions:",
    queryEmbedding.length
  );

  // ====================================================
  // STEP 3: Semantic / Vector Search
  // ====================================================

  console.log(
    "STEP 3: Running semantic search..."
  );

  const semanticLimit =
    Math.max(limit * 3, 20);

  const semanticCandidates =
    await searchCandidatesByEmbedding(
      queryEmbedding,
      semanticLimit
    );

  console.log(
    "Semantic candidates:",
    semanticCandidates?.length || 0
  );

  // ====================================================
  // STEP 4: Combine Keyword + Semantic Results
  // ====================================================

  console.log(
    "STEP 4: Combining keyword + semantic results..."
  );

  const candidateMap = new Map();

  // ====================================================
  // 4A. Add Semantic Candidates
  // ====================================================

  for (const candidate of semanticCandidates || []) {

    if (!candidate?.candidate_id) {
      continue;
    }

    candidateMap.set(
      candidate.candidate_id,
      {
        candidate_id: candidate.candidate_id,

        full_name:
          candidate.full_name || null,

        email:
          candidate.email || null,

        content:
          candidate.content || null,

        semantic_score:
          Number(candidate.similarity) || 0,

        keyword_score: 0,

        keyword_candidate: null,
      }
    );
  }

  // ====================================================
  // 4B. Add Keyword Candidates
  // ====================================================

  for (const candidate of keywordCandidates || []) {

    const candidateId = candidate?.id;

    if (!candidateId) {
      continue;
    }

    // --------------------------------------------------
    // Calculate Keyword Score
    // --------------------------------------------------

    const keywordMetadata =
      candidate.keyword_metadata;

    const keywordScore =
      keywordMetadata &&
      Number(keywordMetadata.total_terms) > 0
        ? Number(
            keywordMetadata.matched_term_count
          ) /
          Number(
            keywordMetadata.total_terms
          )
        : 0;

    console.log(
      "Keyword score:",
      candidate.full_name,
      keywordScore
    );

    // --------------------------------------------------
    // Candidate Already Exists From Semantic Search
    // --------------------------------------------------

    if (candidateMap.has(candidateId)) {

      const existingCandidate =
        candidateMap.get(candidateId);

      existingCandidate.keyword_score =
        keywordScore;

      existingCandidate.keyword_candidate =
        candidate;

      candidateMap.set(
        candidateId,
        existingCandidate
      );

    }

    // --------------------------------------------------
    // Candidate Exists Only In Keyword Search
    // --------------------------------------------------

    else {

      candidateMap.set(
        candidateId,
        {
          candidate_id: candidateId,

          full_name:
            candidate.full_name || null,

          email:
            candidate.email || null,

          content: null,

          semantic_score: 0,

          keyword_score:
            keywordScore,

          keyword_candidate:
            candidate,
        }
      );
    }
  }

  // ====================================================
  // DEBUG - Combined Candidate Map
  // ====================================================

  console.log(
    "========== HYBRID DEBUG =========="
  );

  console.log(
    "Candidate Map Size:",
    candidateMap.size
  );

  console.table(
    Array.from(candidateMap.values()).map(
      (candidate) => ({
        id: candidate.candidate_id,
        name: candidate.full_name,
        semantic_score:
          candidate.semantic_score,
        keyword_score:
          candidate.keyword_score,
      })
    )
  );

  console.log(
    "=================================="
  );

  // ====================================================
  // STEP 4.5: Fetch Complete Candidate Records
  // ====================================================

  console.log(
    "STEP 4.5: Fetching complete candidate records..."
  );

  const candidateIds =
    Array.from(candidateMap.keys());

  let candidateDetailsMap = new Map();

  if (candidateIds.length > 0) {

    const {
      data: candidateDetails,
      error: candidateDetailsError,
    } = await supabase
      .from("candidates")
      .select("*")
      .in("id", candidateIds);

    if (candidateDetailsError) {
      throw new Error(
        candidateDetailsError.message
      );
    }

    candidateDetailsMap =
      new Map(
        (candidateDetails || []).map(
          (candidate) => [
            candidate.id,
            candidate,
          ]
        )
      );
  }

  console.log(
    "Candidate records fetched:",
    candidateDetailsMap.size
  );

  // ====================================================
  // STEP 5: Calculate Hybrid Score
  // ====================================================

  console.log(
    "STEP 5: Calculating hybrid scores..."
  );

  const results =
    Array.from(candidateMap.values())
      .map((candidate) => {

        const semanticScore =
          Number(
            candidate.semantic_score
          ) || 0;

        const keywordScore =
          Number(
            candidate.keyword_score
          ) || 0;

        const candidateDetails =
          candidateDetailsMap.get(
            candidate.candidate_id
          );

        // ------------------------------------------------
        // Hybrid Scoring
        //
        // Semantic = 70%
        // Keyword  = 30%
        // ------------------------------------------------

        const hybridScore =
          (semanticScore * 0.70) +
          (keywordScore * 0.30);

        // ------------------------------------------------
        // IMPORTANT
        //
        // Spread candidateDetails into the TOP LEVEL.
        //
        // This allows the frontend to use:
        //
        // candidate.experience
        // candidate.location
        // candidate.full_name
        // candidate.email
        //
        // instead of:
        //
        // candidate.candidate.experience
        // ------------------------------------------------

        return {

          ...(candidateDetails || {}),

          // ------------------------------------------------
          // Stable Candidate ID
          // ------------------------------------------------

          candidate_id:
            candidate.candidate_id,

          // ------------------------------------------------
          // Ensure basic fields exist
          // ------------------------------------------------

          full_name:
            candidateDetails?.full_name ||
            candidate.full_name ||
            null,

          email:
            candidateDetails?.email ||
            candidate.email ||
            null,

          // ------------------------------------------------
          // Search Scores
          // ------------------------------------------------

          semantic_score:
            Number(
              semanticScore.toFixed(4)
            ),

          keyword_score:
            Number(
              keywordScore.toFixed(4)
            ),

          hybrid_score:
            Number(
              hybridScore.toFixed(4)
            ),

          // ------------------------------------------------
          // Keyword Metadata
          // ------------------------------------------------

          keyword_metadata:
            candidate.keyword_candidate
              ?.keyword_metadata || null,

          // ------------------------------------------------
          // Embedding Content
          // ------------------------------------------------

          embedding_content:
            candidate.content || null,
        };
      });

  // ====================================================
  // STEP 6: Sort By Hybrid Score
  // ====================================================

  console.log(
    "STEP 6: Sorting by hybrid score..."
  );

  results.sort(
    (a, b) =>
      b.hybrid_score -
      a.hybrid_score
  );

  // ====================================================
  // Hybrid Score Debug
  // ====================================================

  console.log(
    "========== HYBRID SCORE COMPARISON =========="
  );

  console.table(
    results.map((candidate) => ({
      id:
        candidate.id ||
        candidate.candidate_id,

      name:
        candidate.full_name,

      experience:
        candidate.experience,

      semantic:
        candidate.semantic_score,

      keyword:
        candidate.keyword_score,

      hybrid:
        candidate.hybrid_score,
    }))
  );

  console.log(
    "=============================================="
  );

  // ====================================================
  // STEP 7: Return Top Candidates
  // ====================================================

  const finalResults =
    results.slice(0, limit);

  console.log(
    "======================================"
  );

  console.log(
    "FINAL HYBRID SEARCH RESULTS"
  );

  console.log(
    JSON.stringify(
      finalResults,
      null,
      2
    )
  );

  console.log(
    "======================================"
  );

  return finalResults;
};

// ======================================================
// Export
// ======================================================

module.exports = {
  searchCandidatesHybrid,
};