const express = require("express");

const {
  getCandidates,
  searchCandidate,
} = require("../controllers/candidateController");

const router = express.Router();

console.log({
  getCandidates,
  searchCandidate,
});

router.get("/search", searchCandidate);
router.get("/", getCandidates);

module.exports = router;