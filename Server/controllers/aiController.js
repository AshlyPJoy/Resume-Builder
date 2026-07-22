const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateSummary = async (req, res) => {
  try {
    const { jobTitle, experience, skills } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ message: "Job title is required" });
    }

    const prompt = `Write a professional resume summary (2-3 sentences, no fluff) for a ${jobTitle}.
Experience: ${experience || "not specified"}
Skills: ${skills?.join(", ") || "not specified"}
Return ONLY the summary text, no preamble, no quotes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const summary = response.text;

    res.status(200).json({ summary });
  } catch (error) {
    console.error("AI generation failed:", error.message);
    res.status(500).json({ message: "Failed to generate summary" });
  }
};

module.exports = { generateSummary };