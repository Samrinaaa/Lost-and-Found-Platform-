const Notification = require("../models/Notification");

/**
 * Create a notification for a user
 * @param {string} userId - The user to notify
 * @param {string} message - The notification message
 * @param {string} type - The notification type
 * @param {string} link - Optional frontend link to navigate to
 */
const createNotification = async (userId, message, type = "claim_submitted", link = "") => {
  try {
    await Notification.create({ userId, message, type, link });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

module.exports = createNotification;
