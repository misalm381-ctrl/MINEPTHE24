const express = require("express");
const { analyzeBookImage } = require("../services/aiBookAnalyzer");
const { analyzeSyllabus } = require("../services/aiSyllabusAnalyzer");

const router = express.Router();

// POST /api/ai/analyze-book
router.post("/analyze-book", async (req, res) => {
    try {
        const { image, imageData } = req.body;
        const img = image || imageData;

        if (!img) {
            return res.status(400).json({
                success: false,
                message: "Book image data is required for AI analysis."
            });
        }

        const result = await analyzeBookImage(img);
        res.json(result);
    } catch (error) {
        console.error("AI book analysis error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to analyze book image."
        });
    }
});

// POST /api/ai/analyze-syllabus
router.post("/analyze-syllabus", async (req, res) => {
    try {
        const { syllabus, syllabusText } = req.body;
        const text = syllabus || syllabusText;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Syllabus text is required."
            });
        }

        const analysis = analyzeSyllabus(text);
        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error("AI syllabus analysis error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to analyze syllabus text."
        });
    }
});

module.exports = router;
