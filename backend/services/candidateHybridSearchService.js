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

console.log("candidateHybridSearchService.js loaded");

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
  // STEP 0: Validate input
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
  // STEP 1: Conventional Keyword Search
  // ====================================================

  console.log("STEP 1: Running keyword search...");

  const keywordCandidates =
    await searchCandidates({
      keyword: searchQuery,
      location,
      experience,
      includeKeywordMetadata: true,
    });

  console.log(
    "Keyword candidates:",
    keywordCandidates?.length || 0
  );
  console.log(
  "KEYWORD METADATA SAMPLE:"
);

console.log(
  JSON.stringify(
    (keywordCandidates || []).slice(0, 20).map(
      (candidate) => ({
        id: candidate.id,
        full_name: candidate.full_name,
        keyword_metadata:
          candidate.keyword_metadata,
      })
    ),
    null,
    2
  )
);
console.log(
  "Keyword metadata sample:",
  JSON.stringify(
    keywordCandidates?.slice(0, 5),
    null,
    2
  )
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

  /*
   * We retrieve more semantic candidates than the final
   * requested limit so that hybrid ranking has enough
   * candidates to work with.
   */

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
  // STEP 4: Combine Both Search Results
  // ====================================================

  console.log(
    "STEP 4: Combining keyword + semantic results..."
  );

  

  const candidateMap = new Map();

  // ----------------------------------------------------
  // Add semantic candidates
  // ----------------------------------------------------

  for (
    const candidate of semanticCandidates || []
  ) {

    candidateMap.set(
      candidate.candidate_id,
      {
        candidate_id:
          candidate.candidate_id,

        full_name:
          candidate.full_name,

        email:
          candidate.email,

        content:
          candidate.content,

        semantic_score:
          Number(candidate.similarity) || 0,

        keyword_score: 0,

        keyword_candidate: null,
      }
    );
  }

  // ----------------------------------------------------
  // Add keyword candidates
  // ----------------------------------------------------

for (
  const candidate of keywordCandidates || []
) {

  const candidateId =
    candidate.id;

  if (!candidateId) {
    continue;
  }

  // ==================================================
  // Calculate normalized keyword score
  // ==================================================

  const keywordMetadata =
    candidate.keyword_metadata;

  const keywordScore =
    keywordMetadata &&
    keywordMetadata.total_terms > 0
      ? keywordMetadata.matched_term_count /
        keywordMetadata.total_terms
      : 0;

  console.log(
    "Keyword score:",
    candidate.full_name,
    keywordScore
  );

  // ==================================================
  // Candidate already found by semantic search
  // ==================================================

  if (candidateMap.has(candidateId)) {

    const existing =
      candidateMap.get(candidateId);

    existing.keyword_score =
      keywordScore;

    existing.keyword_candidate =
      candidate;

    candidateMap.set(
      candidateId,
      existing
    );
  }

  // ==================================================
  // Candidate found ONLY by keyword search
  // ==================================================

  else {

    candidateMap.set(
      candidateId,
      {
        candidate_id:
          candidateId,

        full_name:
          candidate.full_name,

        email:
          candidate.email,

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
  // TEMPORARY HYBRID DEBUG
  // ====================================================

  console.log(
    "========== HYBRID DEBUG =========="
  );

  console.log(
    "Semantic candidates:",
    (semanticCandidates || []).map(
      (candidate) => ({
        id: candidate.candidate_id,
        name: candidate.full_name,
        similarity: candidate.similarity
      })
    )
  );

  console.log(
    "Keyword candidates:",
    (keywordCandidates || []).map(
      (candidate) => ({
        id: candidate.id,
        name: candidate.full_name,
        matched_terms:
          candidate.keyword_metadata?.matched_terms,
        matched_count:
          candidate.keyword_metadata?.matched_term_count,
        total_terms:
          candidate.keyword_metadata?.total_terms
      })
    )
  );

  console.log(
    "Candidate Map:",
    Array.from(candidateMap.values()).map(
      (candidate) => ({
        id: candidate.candidate_id,
        name: candidate.full_name,
        semantic_score:
          candidate.semantic_score,
        keyword_score:
          candidate.keyword_score
      })
    )
  );

  console.log(
    "Candidate Map Size:",
    candidateMap.size
  );

  console.log(
    "=================================="
  );
  // ====================================================
  // STEP 4.5: Enrich Candidates
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
/*
 * Hybrid scoring
 *
 * Semantic = 70%
 * Keyword  = 30%
 *
 * Keyword matches receive stronger weight so that
 * explicit recruiter requirements such as AWS, Java,
 * Python, etc. are not outranked by loosely related
 * semantic matches.
 */

const hybridScore =
  (semanticScore * 0.70) +
  (keywordScore * 0.30);

        return {

          candidate_id:
            candidate.candidate_id,

          full_name:
            candidateDetails?.full_name ||
            candidate.full_name,

          email:
            candidateDetails?.email ||
            candidate.email,

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

          candidate:
            candidateDetails || null,

          embedding_content:
            candidate.content,
        };
      });
  // ====================================================
  // STEP 6: Sort by Hybrid Score
  // ====================================================

  console.log(
    "STEP 6: Sorting by hybrid score..."
  );

  results.sort(
    (a, b) =>
      b.hybrid_score -
      a.hybrid_score
  );
console.log(
  "HYBRID SCORE COMPARISON"
);

console.table(
  results.map((candidate) => ({
    name: candidate.full_name,
    semantic: candidate.semantic_score,
    keyword: candidate.keyword_score,
    hybrid: candidate.hybrid_score,
  }))
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