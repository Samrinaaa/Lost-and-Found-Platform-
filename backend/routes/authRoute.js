const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// OTP GENERATOR 
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// REGISTER 
router.post("/register", async (req, res) => {
  try {
    console.log("Register request received");

    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      console.log("Missing fields in registration");
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "Email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    console.log("User registered successfully:", email);

    await sendEmail(
      email,
      "Verify your account",
      `<h3>Your OTP is: ${otp}</h3><p>Valid for 10 minutes</p>`
    );

    return res.status(201).json({
      message: "OTP sent. Verify your account.",
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
    console.log("OTP verification request received");

    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for OTP");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      console.log("Invalid OTP");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      console.log("OTP expired");
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    console.log("User verified successfully:", user.email);

    return res.status(200).json({ message: "Account verified successfully" });

  } catch (error) {
    console.error("OTP error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// NORMAL LOGIN 
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received");

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing login fields");
      return res.status(400).json({ message: "Email and password required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.isVerified) {
      console.log("User not verified:", email);
      return res.status(403).json({ message: "Please verify your account first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Wrong password for:", email);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("User logged in successfully:", email);

    return res.status(200).json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GOOGLE LOGIN 
router.post("/google", async (req, res) => {
  try {
    console.log("Google login request received");

    const { credential } = req.body;

    if (!credential) {
      console.log("No credential received");
      return res.status(400).json({ message: "Google login failed" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const fullName = payload.name;

    console.log("Google user:", email);

    let user = await User.findOne({ email });

    if (!user) {
      console.log("Creating new Google user");

      user = new User({
        fullName,
        email,
        googleId: payload.sub,
        phone: "",
        isVerified: true
      });

      await user.save();
    } else {
      console.log("Existing Google user logging in");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Google login successful:", email);

    return res.status(200).json({
      message: "Google login successful",
      token,
      user
    });

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
});

module.exports = router;