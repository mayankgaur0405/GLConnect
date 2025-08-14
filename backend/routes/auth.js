import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, name, collegeId, course, branch, year, password } =
      req.body;

    if (
      !username ||
      !name ||
      !collegeId ||
      !course ||
      !branch ||
      !year ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already taken" });

    const existingCollegeId = await User.findOne({ collegeId });
    if (existingCollegeId)
      return res.status(400).json({ message: "College ID already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username.trim(),
      name: name.trim(),
      collegeId: collegeId.trim(),
      course: course.trim(),
      branch: branch.trim(),
      year: parseInt(year, 10),
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error); // ✅ full error terminal me
    return res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { collegeId, password } = req.body;

    if (!collegeId || !password) {
      return res
        .status(400)
        .json({ message: "College ID and password are required" });
    }

    const user = await User.findOne({ collegeId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _pw, ...safeUser } = user.toObject(); // 👈 remove hash
    return res.json({ token, user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: error.message }); // 👈 unified
  }
});

export default router;
