import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "❌ Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "❌ Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "✅ Login successful", token, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "⚠️ Server error" });
  }
});

// AUTH MIDDLEWARE
export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient privileges" });
    }
    next();
  };
}

// TEST DASHBOARDS
router.get("/admin-dashboard", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}!`, role: req.user.role });
});

router.get("/staff-dashboard", authenticateToken, authorizeRoles("staff"), (req, res) => {
  res.json({ message: `Welcome Staff ${req.user.username}!`, role: req.user.role });
});

router.get("/user-dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}!`, role: req.user.role });
});

export default router;
