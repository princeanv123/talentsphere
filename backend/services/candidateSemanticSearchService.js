const supabase = require("../config/supabase");

const searchCandidatesByEmbedding = async (
  queryEmbedding,
  limit = 10
) => {
  if (!Array.isArray(queryEmbedding)) {
    throw new Error("Query embedding must be an array");
  }

  if (queryEmbedding.length !== 768) {
    throw new Error(
      `Query embedding must contain 768 dimensions. Received: ${queryEmbedding.length}`
    );
  }

  const { data, error } = await supabase.rpc(
  "search_candidates_by_embedding",
  {
    query_embedding: queryEmbedding,
    match_limit: limit,
  }
);
console.log(
  "SEMANTIC CANDIDATE SCORE LIST"
);

console.table(
  (data || []).map((candidate) => ({
    name: candidate.full_name,
    similarity:
      Number(candidate.similarity?.toFixed(4))
  }))
);
console.log("========== SEMANTIC SEARCH RPC ==========");
console.log("RPC error:", error);
console.log("RPC data:", data);
console.log(
  "RPC data length:",
  data ? data.length : "undefined"
);
console.log("=========================================");

  if (error) {
    console.error(
      "Semantic candidate search error:",
      error
    );

    throw error;
  }

  return data;
};

module.exports = {
  searchCandidatesByEmbedding,
};