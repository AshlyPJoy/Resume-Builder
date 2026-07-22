const puppeteer = require("puppeteer");
const Resume = require("../models/Resume");

const generateResumeHTML = (resume) => {
  const experienceHTML = (resume.experience || [])
    .map(
      (exp) => `
      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px;">
          <strong>${exp.title || ""} ${exp.company ? "— " + exp.company : ""}</strong>
          <span style="color: #666;">${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
        </div>
        <p style="font-size: 12px; color: #333; margin: 4px 0 0;">${exp.description || ""}</p>
      </div>`
    )
    .join("");

  const educationHTML = (resume.education || [])
    .map(
      (edu) => `
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
        <span>${edu.degree || ""} ${edu.university ? "— " + edu.university : ""}</span>
        <span style="color: #666;">${edu.yearofpassing || ""}</span>
      </div>`
    )
    .join("");

  const skillsHTML = (resume.skills || [])
    .map((skill) => `<span style="background:#f1f1f1; padding:3px 8px; border-radius:10px; font-size:11px; margin-right:6px;">${skill}</span>`)
    .join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', Arial, sans-serif; padding: 40px; color: #1a1a1a; }
          h1 { font-size: 24px; margin-bottom: 4px; }
          h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 24px; }
          .contact { font-size: 12px; color: #555; margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <h1>${resume.name || "Untitled"}</h1>
        <div class="contact">${[resume.email, resume.phone, resume.location, resume.linkedin].filter(Boolean).join(" · ")}</div>
        ${resume.summary ? `<p style="font-size: 13px;">${resume.summary}</p>` : ""}
        ${resume.experience?.length ? `<h2>Experience</h2>${experienceHTML}` : ""}
        ${resume.education?.length ? `<h2>Education</h2>${educationHTML}` : ""}
        ${resume.skills?.length ? `<h2>Skills</h2><div>${skillsHTML}</div>` : ""}
      </body>
    </html>
  `;
};

const exportResumePDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const html = generateResumeHTML(resume);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resume.name || "resume"}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF export failed:", error.message);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};

module.exports = { exportResumePDF };