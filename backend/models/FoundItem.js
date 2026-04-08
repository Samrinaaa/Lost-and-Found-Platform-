const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  itemName: { type: String, required: true },
  description: { type: String },
  locationFound: { type: String },
  dateFound: { type: Date },

  category: {
    type: String,
    enum: ["Electronics", "Bags", "Documents", "Clothing", "Others"],
    required: true
  },

  imageUrl: { type: String },
  status: { type: String, enum: ["open", "claimed", "closed"], default: "open" }
}, { timestamps: true });

module.exports = mongoose.model("FoundItem", foundItemSchema);