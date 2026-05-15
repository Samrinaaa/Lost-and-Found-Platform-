const express = require("express");
const router = express.Router();
const FoundItem = require("../models/FoundItem");
const auth = require("../middleware/auth");
const { uploadItem } = require("../config/cloudinary");
const { getCache, setCache, deleteCache } = require("../config/redis");

// ADD FOUND ITEM
router.post("/", auth, uploadItem.single("image"), async (req, res) => {
  try {
    const item = new FoundItem({
      ...req.body,
      userId: req.user.id,
      imageUrl: req.file ? req.file.path : "",
    });

    await item.save();

    // Clear cache so next GET fetches fresh data from MongoDB
    await deleteCache("found_items");

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL FOUND ITEMS
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    // Only use cache when there is no search query
    if (!search) {
      const cached = await getCache("found_items");
      if (cached) {
        return res.json(cached);
      }
    }

    const items = await FoundItem.find(
      search
        ? {
            $or: [
              { itemName: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
              { locationFound: { $regex: search, $options: "i" } },
            ],
          }
        : {}
    ).populate("userId", "fullName email");

    // Cache only the full unfiltered list
    if (!search) {
      await setCache("found_items", items, 300); // 5 minutes TTL
    }

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET FOUND ITEM BY ID
router.get("/:id", async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id).populate(
      "userId",
      "fullName email"
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE FOUND ITEM
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Found item not found" });
    }

    await FoundItem.findByIdAndDelete(req.params.id);

    // Clear cache
    await deleteCache("found_items");

    res.json({ message: "Found item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;