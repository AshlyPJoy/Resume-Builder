const Resume = require("../models/Resume");

// Create a new resume
const createResume = async (req, res) => {
    const { name, email, phone, location, summary, education, experience, skills, portfolio, linkedin, template } = req.body;
    try {
        const resume = new Resume({
            name,
            email,
            phone,
            location,
            summary,
            education,
            experience,
            skills,
            portfolio,
            linkedin,
            template,
            userId: req.user._id
        });
        await resume.save();
        res.status(201).json(resume);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id });
        if (resumes.length === 0) {
            return res.status(404).json({ message: "No resumes found" });
        }
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getResumeById = async (req, res) => {
    const { id } = req.params;
    try {
        const resume = await Resume.findOne({ _id: id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        return res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateResume = async (req, res) => {
    const { id } = req.params;
    try {

        const resume = await Resume.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { $set: req.body },
            { returnDocument: 'after' }   // was { new: true }
        );
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        return res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteResume = async (req, res) => {
    const { id } = req.params;
    try {
        const resume = await Resume.findOneAndDelete(
            { _id: id, userId: req.user._id }
        );
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        return res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createResume, getResumes, getResumeById, updateResume, deleteResume };