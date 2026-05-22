const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const auth = require("../middleware/auth");
const { uploadItem } = require("../config/cloudinary");
const { getCache, setCache, deleteCache } = require("../config/redis");

// ADD LOST ITEM
router.post("/", auth, uploadItem.single("image"), async (req, res) => {
  try {
    const item = new LostItem({
      ...req.body,
      userId: req.user.id,
      imageUrl: req.file ? req.file.path : "",
    });

    await item.save();
    await deleteCache("lost_items");

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL LOST ITEMS (with search + pagination)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 6;
    const skip   = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { itemName:    { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { locationLost:{ $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Only cache the first page with no search
    if (!search && page === 1) {
      const cached = await getCache("lost_items");
      if (cached) {
        console.log("✅ lost_items page 1 — served from Redis cache");
        return res.json(cached);
      }
    }

    const [items, totalItems] = await Promise.all([
      LostItem.find(query)
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      LostItem.countDocuments(query),
    ]);

    const result = {
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };

    if (!search && page === 1) {
      await setCache("lost_items", result, 300);
      console.log("🔄 lost_items page 1 — fetched from MongoDB");
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET LOST ITEM BY ID
router.get("/:id", async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id).populate(
      "userId", "fullName email"
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE LOST ITEM
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    if (item.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorised" });
    }

    await LostItem.findByIdAndDelete(req.params.id);
    await deleteCache("lost_items");

    res.json({ message: "Lost item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;