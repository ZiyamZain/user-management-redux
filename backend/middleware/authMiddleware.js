import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; 
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

      const user = await User.findById(decoded.id).select("-password"); // Fetch user without password
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next(); 
    } catch (error) {
      console.error("JWT Verification Error:", error);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    res.status(403).json({ message: "Access denied, token missing" });
  }
});

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin privileges required" });
  }
});

export { protect, admin };
