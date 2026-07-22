const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { generateSummary } = require("../controllers/aiController");

router.post("/generate-summary", protect, generateSummary);

module.exports = router;