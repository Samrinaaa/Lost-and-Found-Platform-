const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const auth = require("../middleware/auth");
const multer = require("multer");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ADD LOST ITEM
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const item = new LostItem({
      ...req.body,
      userId: req.user.id,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
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
    const search = req.query.search || "";

    const items = await LostItem.find({
      $or: [
        { itemName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { locationLost: { $regex: search, $options: "i" } }
      ]
    }).populate("userId", "fullName email");

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