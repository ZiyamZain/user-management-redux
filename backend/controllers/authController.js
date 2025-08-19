import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Controller
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Password validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (always set isAdmin to false for regular registration)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false, // Force isAdmin to false for regular registration
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Send response with user data
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// Admin Login Controller
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Admin login attempt for email:", email);

    // Find user by email
    const user = await User.findOne({ email });
    console.log("Found user:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("Admin login failed: User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is an admin
    console.log("User isAdmin status:", user.isAdmin);
    if (!user.isAdmin) {
      console.log("Admin login failed: User is not an admin");
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Check password
    console.log("Attempting password comparison...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);
    
    if (!isMatch) {
      console.log("Admin login failed: Password mismatch");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate admin token with admin flag
    const token = jwt.sign(
      { id: user._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log("Admin login successful!");
    // Send response with user data including _id
    res.json({
      message: "Admin login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        isAdmin: true,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Error during admin login" });
  }
};
