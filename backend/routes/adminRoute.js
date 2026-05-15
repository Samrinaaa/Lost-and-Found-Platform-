const express = require("express");
const router = express.Router();
const User = require("../models/User");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const Claim = require("../models/Claim");
const auth = require("../middleware/auth");
const { getCache, setCache, deleteCache } = require("../config/redis");

// Middleware: admin only
const adminOnly = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ── STATS (for admin dashboard counts) ──────────────────────
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const cached = await getCache("admin_stats");
    if (cached) return res.json(cached);

    const [totalUsers, totalLost, totalFound, totalClaims] = await Promise.all([
      User.countDocuments(),
      LostItem.countDocuments(),
      FoundItem.countDocuments(),
      Claim.countDocuments(),
    ]);

    const stats = { totalUsers, totalLost, totalFound, totalClaims };

    await setCache("admin_stats", stats, 120); // 2 minutes TTL

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── USERS MANAGEMENT ─────────────────────────────────────────

// GET all users
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const cached = await getCache("admin_users");
    if (cached) return res.status(200).json(cached);

    const users = await User.find().select("-password");

    await setCache("admin_users", users, 300); // 5 minutes TTL

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// UPDATE user role
router.put("/users/:id/role", auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Clear users cache and stats cache
    await deleteCache("admin_users");
    await deleteCache("admin_stats");

    return res.status(200).json({
      message: "User role updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE user
router.delete("/users/:id", auth, adminOnly, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "Admin cannot delete themselves." });
    }

    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.findByIdAndDelete(req.params.id);

    // Clear users cache and stats cache
    await deleteCache("admin_users");
    await deleteCache("admin_stats");

    console.log(`Admin ${req.user.id} deleted user: ${userToDelete.email}`);

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// ── LOST ITEMS MANAGEMENT ────────────────────────────────────

// GET all lost items
router.get("/lost-items", auth, adminOnly, async (req, res) => {
  try {
    const items = await LostItem.find().populate("userId", "fullName email");
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE lost item
router.delete("/lost-items/:id", auth, adminOnly, async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Lost item not found." });
    }

    await LostItem.findByIdAndDelete(req.params.id);

    // Clear related caches
    await deleteCache("lost_items");
    await deleteCache("admin_stats");

    console.log(`Admin ${req.user.id} deleted lost item: ${item.itemName}`);

    return res.status(200).json({ message: "Lost item deleted successfully." });
  } catch (error) {
    console.error("Delete lost item error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// ── FOUND ITEMS MANAGEMENT ───────────────────────────────────

// GET all found items
router.get("/found-items", auth, adminOnly, async (req, res) => {
  try {
    const items = await FoundItem.find().populate("userId", "fullName email");
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE found item
router.delete("/found-items/:id", auth, adminOnly, async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Found item not found." });
    }

    await FoundItem.findByIdAndDelete(req.params.id);

    // Clear related caches
    await deleteCache("found_items");
    await deleteCache("admin_stats");

    console.log(`Admin ${req.user.id} deleted found item: ${item.itemName}`);

    return res.status(200).json({ message: "Found item deleted successfully." });
  } catch (error) {
    console.error("Delete found item error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// ── CHANGE PASSWORD ──────────────────────────────────────────

router.put("/change-password", auth, adminOnly, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check current password
    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log(`Admin ${user.email} changed their password.`);

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;