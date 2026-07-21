const express = require("express");
const router = express.Router();

const {
  getCandidates,
  searchCandidate,
  getCandidateDetails,
  updateCandidateController,
  deleteCandidateController,
} = require("../controllers/candidateController");

console.log({
  getCandidates,
  searchCandidate,
  getCandidateDetails,
});

router.get("/search", searchCandidate);

router.get("/:id", getCandidateDetails);

router.get("/", getCandidates);
router.put("/:id", updateCandidateController);
router.delete("/:id", deleteCandidateController);
module.exports = router;