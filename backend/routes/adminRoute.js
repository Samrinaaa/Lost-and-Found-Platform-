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

// ── STATS ────────────────────────────────────────────────────
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const cached = await getCache("admin_stats");
    if (cached) {
      console.log("✅ admin/stats — served from Redis cache");
      return res.json(cached);
    }

    console.log("🔄 admin/stats — fetching from MongoDB");
    const [totalUsers, totalLost, totalFound, totalClaims] = await Promise.all([
      User.countDocuments(),
      LostItem.countDocuments(),
      FoundItem.countDocuments(),
      Claim.countDocuments(),
    ]);

    const stats = { totalUsers, totalLost, totalFound, totalClaims };
    await setCache("admin_stats", stats, 1800); // 30 minutes TTL

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── USERS MANAGEMENT ─────────────────────────────────────────

// GET all users (with pagination)
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip  = (page - 1) * limit;

    // Only cache page 1
    if (page === 1) {
      const cached = await getCache("admin_users");
      if (cached) {
        console.log("✅ admin/users — served from Redis cache");
        return res.status(200).json(cached);
      }
    }

    console.log("🔄 admin/users — fetching from MongoDB");
    const [users, totalItems] = await Promise.all([
      User.find().select("-password").skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    const result = {
      users,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };

    if (page === 1) {
      await setCache("admin_users", result, 1800); // 30 minutes TTL
    }

    return res.status(200).json(result);
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

    await deleteCache("admin_users");
    await deleteCache("admin_stats");
    console.log(`🗑️  Cache cleared — admin_users, admin_stats (role update)`);

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

    await deleteCache("admin_users");
    await deleteCache("admin_stats");
    console.log(`🗑️  Cache cleared — admin_users, admin_stats (user deleted: ${userToDelete.email})`);

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// ── LOST ITEMS MANAGEMENT ────────────────────────────────────

// GET all lost items (with pagination)
router.get("/lost-items", auth, adminOnly, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip  = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      LostItem.find()
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      LostItem.countDocuments(),
    ]);

    return res.status(200).json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
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

    await deleteCache("lost_items");
    await deleteCache("admin_stats");
    console.log(`🗑️  Cache cleared — lost_items, admin_stats (lost item deleted: ${item.itemName})`);

    return res.status(200).json({ message: "Lost item deleted successfully." });
  } catch (error) {
    console.error("Delete lost item error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// ── FOUND ITEMS MANAGEMENT ───────────────────────────────────

// GET all found items (with pagination)
router.get("/found-items", auth, adminOnly, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip  = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      FoundItem.find()
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FoundItem.countDocuments(),
    ]);

    return res.status(200).json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
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

    await deleteCache("found_items");
    await deleteCache("admin_stats");
    console.log(`🗑️  Cache cleared — found_items, admin_stats (found item deleted: ${item.itemName})`);

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

    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

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
