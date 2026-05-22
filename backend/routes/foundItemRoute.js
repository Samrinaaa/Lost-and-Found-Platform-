const express = require("express");
const router = express.Router();
const FoundItem = require("../models/FoundItem");
const User = require("../models/User");                         
const auth = require("../middleware/auth");
const { uploadItem } = require("../config/cloudinary");
const { getCache, setCache, deleteCache } = require("../config/redis");
const createNotification = require("../utils/createNotification"); 

// ADD FOUND ITEM
router.post("/", auth, uploadItem.single("image"), async (req, res) => {
  try {
    const item = new FoundItem({
      ...req.body,
      userId: req.user.id,
      imageUrl: req.file ? req.file.path : "",
    });

    await item.save();
    await deleteCache("found_items");

    // Notify the user who posted
    await createNotification(
      req.user.id,
      `Your found item "${item.itemName}" has been posted successfully.`,
      "item_posted",
      "/found-items"
    );

    // Notify all admins
    const poster = await User.findById(req.user.id, "fullName"); // ← fetch actual name
    const admins = await User.find({ role: "admin" }, "_id");
    await Promise.all(
      admins.map((admin) =>
        createNotification(
          admin._id,
          `A new found item "${item.itemName}" has been posted by ${poster?.fullName || "a user"}.`,
          "item_posted",
          "/admin/found-items"
        )
      )
    );

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL FOUND ITEMS (with search + pagination)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 6;
    const skip   = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { itemName:     { $regex: search, $options: "i" } },
            { description:  { $regex: search, $options: "i" } },
            { locationFound:{ $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Only cache the first page with no search
    if (!search && page === 1) {
      const cached = await getCache("found_items");
      if (cached) {
        console.log("✅ found_items page 1 — served from Redis cache");
        return res.json(cached);
      }
    }

    const [items, totalItems] = await Promise.all([
      FoundItem.find(query)
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FoundItem.countDocuments(query),
    ]);

    const result = {
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };

    if (!search && page === 1) {
      await setCache("found_items", result, 300);
      console.log("🔄 found_items page 1 — fetched from MongoDB");
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET FOUND ITEM BY ID
router.get("/:id", async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id).populate(
      "userId", "fullName email"
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
    await deleteCache("found_items");

    res.json({ message: "Found item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
