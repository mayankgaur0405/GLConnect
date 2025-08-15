import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// ✅ Follow a user
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
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Unfollow a user
router.post("/unfollow/:id", verifyToken, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!targetUser || !currentUser)
      return res.status(404).json({ message: "User not found" });

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== req.userId.toString()
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.id.toString()
    );

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Search users by username, name, collegeId, branch, year
router.get("/search", async (req, res) => {
  try {
    const { username, name, collegeId, branch, year } = req.query;

    let query = {};
    if (username) query.username = { $regex: username, $options: "i" };
    if (name) query.name = { $regex: name, $options: "i" };
    if (collegeId) query.collegeId = { $regex: collegeId, $options: "i" };
    if (branch) query.branch = branch;
    if (year) query.year = Number(year);

    const users = await User.find(query).select("-password");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get random users
router.get("/random", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const users = await User.aggregate([
      { $sample: { size: limit } },
      { $project: { password: 0 } }, // password hide
    ]);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get user by ID or username (for profile page)
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    let user;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier).select("-password");
    } else {
      user = await User.findOne({ username: identifier }).select("-password");
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add new section
router.post("/:id/sections", verifyToken, async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { type, title, subjects, resources } = req.body;

    if (!["semester", "topic"].includes(type)) {
      return res.status(400).json({ message: "Invalid section type" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newSection = { type, title, subjects, resources };
    user.sections.push(newSection);
    await user.save();

    res.json({ message: "Section added", section: newSection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update section
router.put("/:id/sections/:sectionId", verifyToken, async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { type, title, subjects, resources } = req.body;

    if (type && !["semester", "topic"].includes(type)) {
      return res.status(400).json({ message: "Invalid section type" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const section = user.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: "Section not found" });

    if (type) section.type = type;
    if (title) section.title = title;
    if (Array.isArray(subjects)) section.subjects = subjects;
    if (Array.isArray(resources)) section.resources = resources;

    await user.save();
    res.json({ message: "Section updated", section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete section
router.delete("/:id/sections/:sectionId", verifyToken, async (req, res) => {
  try {
    if (req.userId.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.sections = user.sections.filter(
      (s) => s._id.toString() !== req.params.sectionId.toString()
    );

    await user.save();
    res.json({ message: "Section deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;