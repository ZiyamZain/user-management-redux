import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Create new user (Admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error while creating user" });
  }
});

// Get all users (Admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 }); // Sort by creation date in descending order
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});

// Get user by ID (Protected - user can access their own profile, admin can access any)
router.get("/:id", protect, async (req, res) => {
  try {
    // Check if user is admin or accessing their own profile
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to access this profile" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error while fetching user" });
  }
});

router.put("/:id", protect, upload.single("profileImage"), async (req, res) => {
  try {

    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const { name, email } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;


    if (req.file) {
      user.profileImage = req.file.path;
    }

    const updatedUser = await user.save();
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error while updating user" });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
});

// Upload profile picture to Cloudinary (Protected Route)
router.post(
  "/upload-profile",
  protect,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Save Cloudinary URL to user profile
      user.profileImage = req.file.path;
      await user.save({ validateBeforeSave: false });

      res.json({
        message: "Profile image uploaded successfully",
        imageUrl: user.profileImage,
        user,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ message: "Server error during file upload" });
    }
  }
);


router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});

// Update user profile (Protected Route)
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user without the password
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

export default router;
