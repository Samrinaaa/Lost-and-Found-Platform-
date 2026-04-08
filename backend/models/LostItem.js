const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  itemName: { type: String, required: true },
  description: { type: String },
  locationLost: { type: String },
  dateLost: { type: Date },
  
  category: {
    type: String,
    enum: ["Electronics", "Bags", "Documents", "Clothing", "Others"],
    required: true
  },

  imageUrl: { type: String },
  status: { type: String, enum: ["open", "found", "closed"], default: "open" }
}, { timestamps: true });

module.exports = mongoose.model("LostItem", lostItemSchema);