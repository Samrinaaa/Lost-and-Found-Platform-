const express = require("express");
const router = express.Router();
const User = require("../models/User");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem"); // ✅ ADDED
const auth = require("../middleware/auth");

// middleware to allow only admin
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

// ================= USERS MANAGEMENT =================

// GET all users
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
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

    console.log(`Admin ${req.user.id} deleted user: ${userToDelete.email}`);

    return res.status(200).json({ message: "User deleted successfully." });

  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// ================= LOST ITEMS MANAGEMENT =================

// GET all lost items
router.get("/lost-items", auth, adminOnly, async (req, res) => {
  try {

    const items = await LostItem.find()
      .populate("userId", "fullName email");

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

    console.log(`Admin ${req.user.id} deleted lost item: ${item.itemName}`);

    return res.status(200).json({
      message: "Lost item deleted successfully."
    });

  } catch (error) {
    console.error("Delete lost item error:", error); 
    return res.status(500).json({ message: error.message });
  }
});


// ================= FOUND ITEMS MANAGEMENT =================
// ✅ THIS IS WHAT WAS MISSING

router.delete("/found-items/:id", auth, adminOnly, async (req, res) => {
  try {

    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Found item not found." });
    }

    await FoundItem.findByIdAndDelete(req.params.id);

    console.log(`Admin ${req.user.id} deleted found item: ${item.itemName}`);

    return res.status(200).json({
      message: "Found item deleted successfully."
    });

  } catch (error) {
    console.error("Delete found item error:", error);
    return res.status(500).json({ message: error.message });
  }
});


module.exports = router;