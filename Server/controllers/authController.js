const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail=require('../utils/email.js')


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const existingUser = await User.findOne({ email })
console.log('existingUser',existingUser)
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })
        const message = `
        <h2>Welcome to ResumeBuilder, ${name}!</h2>
        <p>Thank you for registering on our platform.</p>
      `;
        if (user) {
            try {
                await sendEmail({
                    email: user.email,
                    subject: "Welcome to ResumeBuilder",
                    message
                })
            } catch (err) {
                console.error(`Failed to send email to ${user.email}: ${err.message}`);
            }

        }
        res.status(201).json({
            message: "User registered successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        console.log("kkk",password )
                console.log("user",user )

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        res.status(200).json({
            message: "User logged in successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registerUser, loginUser }