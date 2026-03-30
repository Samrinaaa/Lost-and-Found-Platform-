const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// EMAIL CONFIG
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// OTP GENERATOR
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log("=== REGISTER HIT ===");
    console.log("Request body:", req.body);

    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      console.log("Missing fields");
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already exists");
      return res.status(400).json({ message: "Email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ADD OTP
    const otp = generateOTP();

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000
    });

    await newUser.save();

    // SEND EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account",
      html: `<h3>Your OTP is: ${otp}</h3><p>Valid for 10 minutes</p>`,
    });

    console.log("User registered successfully");

    return res.status(201).json({
      message: "OTP sent to your email. Please verify your account.",
      userId: newUser._id
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// VERIFY OTP 
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({ message: "Account verified successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    // BLOCK IF NOT VERIFIED
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;