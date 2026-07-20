const express = require("express");
const router = express.Router();

const {
  getCandidates,
  searchCandidate,
  getCandidateDetails,
} = require("../controllers/candidateController");

console.log({
  getCandidates,
  searchCandidate,
  getCandidateDetails,
});

router.get("/search", searchCandidate);

router.get("/:id", getCandidateDetails);

router.get("/", getCandidates);

module.exports = router;