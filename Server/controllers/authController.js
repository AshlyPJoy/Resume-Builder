const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail=require('../utils/email.js')
const crypto = require("crypto");


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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    // Always respond the same way whether the user exists or not —
    // this stops attackers from using this endpoint to check which
    // emails are registered in your system.
    if (!user) {
      return res.status(200).json({
        message: "If an account exists for that email, a reset link has been sent.",
      });
    }

    // Generate a random token. The RAW token goes in the email link.
    // Only the HASHED version is stored in the DB — so even if your
    // database were ever leaked, the raw tokens couldn't be reused.
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    const message = `
      <h2>Reset your password</h2>
      <p>Click the link below to set a new password. This link expires in 30 minutes.</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `;

    try {
      await sendEmail({ email: user.email, subject: "Reset your password", message });
    } catch (emailErr) {
      console.error("Reset email failed:", emailErr.message);
      // Roll back the token so a broken email doesn't leave a dangling reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Failed to send reset email" });
    }

    res.status(200).json({
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
