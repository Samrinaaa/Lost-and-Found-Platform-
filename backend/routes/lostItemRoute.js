const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const auth = require("../middleware/auth");

// ADD LOST ITEM
router.post("/", auth, async (req, res) => {
  try {
    const item = new LostItem({
      ...req.body,
      userId: req.user.id,
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL LOST ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await LostItem.find().populate("userId", "fullName email");
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET LOST ITEM BY ID
router.get("/:id", async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id).populate("userId", "fullName email");
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;