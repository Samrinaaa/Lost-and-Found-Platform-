const express = require("express");
const router = express.Router();
const FoundItem = require("../models/FoundItem");
const auth = require("../middleware/auth");


// ADD FOUND ITEM
router.post("/", auth, async (req, res) => {
  try {
    const item = new FoundItem({
      ...req.body,
      userId: req.user.id,
    });

    await item.save();

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET ALL FOUND ITEMS
router.get("/", async (req, res) => {
  try {

    const search = req.query.search || ""; 

    const items = await FoundItem.find({
      $or: [
        { itemName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { locationFound: { $regex: search, $options: "i" } }
      ]
    })
      .populate("userId", "fullName email");

    res.json(items);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET FOUND ITEM BY ID
router.get("/:id", async (req, res) => {
  try {

    const item = await FoundItem.findById(req.params.id)
      .populate("userId", "fullName email");

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

    console.log(`User ${req.user.id} deleted found item: ${item.itemName}`); 

    res.json({ message: "Found item deleted successfully" });

  } catch (error) {
    console.error("Delete found item error:", error); 
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;