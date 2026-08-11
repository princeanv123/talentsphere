const express = require("express");

const {
  searchCandidatesHybridController,
} = require("../controllers/candidateHybridSearchController");

const router = express.Router();

console.log("======================================");
console.log("candidateHybridSearchRoutes.js loaded");
console.log(
  "searchCandidatesHybridController:",
  typeof searchCandidatesHybridController
);
console.log("======================================");

router.post(
  "/hybrid-search",
  searchCandidatesHybridController
);

console.log("POST /hybrid-search route registered");

module.exports = router;