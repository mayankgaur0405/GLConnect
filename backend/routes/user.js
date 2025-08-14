import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// Follow a user
router.post("/follow/:id", verifyToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!targetUser || !currentUser)
      return res.status(404).json({ message: "User not found" });

    if (targetUser.followers.includes(req.userId)) {
      return res.status(400).json({ message: "Already following" });
    }

    targetUser.followers.push(req.userId);
    currentUser.following.push(req.params.id);

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow a user
router.post("/unfollow/:id", verifyToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!targetUser || !currentUser)
      return res.status(404).json({ message: "User not found" });

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== req.userId
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.id
    );

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users by name, collegeId, branch, or year
router.get("/search", async (req, res) => {
  try {
    const { name, collegeId, branch, year } = req.query;

    let query = {};
    if (username) query.username = { $regex: username, $options: "i" };
    if (name) query.name = { $regex: name, $options: "i" };
    if (collegeId) query.collegeId = { $regex: collegeId, $options: "i" };
    if (branch) query.branch = branch;
    if (year) query.year = Number(year);

    const users = await User.find(query).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get random users
router.get("/random", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const users = await User.aggregate([
      { $sample: { size: limit } },
      { $project: { password: 0 } }, // password hide
    ]);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
