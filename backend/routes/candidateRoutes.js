const express = require("express");

const {
  getCandidates,
} = require("../controllers/candidateController");
console.log("getCandidates =", getCandidates);
const router = express.Router();

router.get("/", getCandidates);

module.exports = router;