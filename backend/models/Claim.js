const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  lostId: { type: mongoose.Schema.Types.ObjectId, ref: "LostItem" },
  foundId: { type: mongoose.Schema.Types.ObjectId, ref: "FoundItem" },
  claimantUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);
