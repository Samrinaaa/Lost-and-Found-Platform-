const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  lostId: { type: mongoose.Schema.Types.ObjectId, ref: "LostItem" },
  foundId: { type: mongoose.Schema.Types.ObjectId, ref: "FoundItem" },
  claimantUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // User's claim description 
  description: {
    type: String,
    default: ""
  },

  // status with verification stages
  status: {
    type: String,
    enum: ["pending", "under_review", "need_more_info", "approved", "rejected"],
    default: "pending"
  },

  // Admin message (for asking proof or giving feedback)
  adminMessage: {
    type: String,
    default: ""
  },

  // User response to admin (follow-up)
  userResponse: {
    type: String,
    default: ""
  },

  // Proof images/documents uploaded by user
  proofImages: [
    {
      type: String
    }
  ],

  // Activity logs for tracking claim progress
  logs: [
    {
      message: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);