const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

// GET all notifications for the logged in user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MARK a single notification as read
router.put("/:id/read", auth, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true }
    );
    res.json({ message: "Notification marked as read." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MARK ALL notifications as read
router.put("/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
