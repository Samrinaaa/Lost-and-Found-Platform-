const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const auth = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");


// CREATE CLAIM
router.post("/", auth, async (req, res) => {
  try {

    const { lostId, foundId } = req.body;

    const claim = new Claim({
      claimantUser: req.user.id,
      lostId: lostId || null,
      foundId: foundId || null
    });

    await claim.save();

    // SEND EMAIL TO ITEM OWNER 
    try {
      let item = null;

      if (lostId) {
        item = await LostItem.findById(lostId).populate("userId");
      } else if (foundId) {
        item = await FoundItem.findById(foundId).populate("userId");
      }

      if (item && item.userId && item.userId.email) {
        await sendEmail(
          item.userId.email,
          "New Claim Submitted",
          `<p>Someone has submitted a claim for your item: <b>${item.itemName}</b></p>`
        );
      }

    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
    }

    res.status(201).json({ message: "Claim submitted successfully." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET ALL CLAIMS (ADMIN)
router.get("/", auth, async (req, res) => {
  try {

    const claims = await Claim.find()
      .populate("claimantUser", "fullName email")
      .populate("lostId")
      .populate("foundId");

    res.json(claims);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// APPROVE CLAIM
router.put("/:id/approve", auth, async (req, res) => {
  try {

    const claim = await Claim.findById(req.params.id)
      .populate("claimantUser", "fullName email"); // ✅ ADDED

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "approved";

    await claim.save();

    // ✅ SEND EMAIL TO CLAIM USER
    try {
      if (claim.claimantUser && claim.claimantUser.email) {
        await sendEmail(
          claim.claimantUser.email,
          "Claim Approved",
          `<p>Your claim has been <b>approved</b> by admin.</p>`
        );
      }
    } catch (emailError) {
      console.log("Approval email failed:", emailError.message);
    }

    res.json({ message: "Claim approved successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// REJECT CLAIM
router.put("/:id/reject", auth, async (req, res) => {
  try {

    const claim = await Claim.findById(req.params.id)
      .populate("claimantUser", "fullName email"); // ✅ ADDED

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "rejected";

    await claim.save();

    // ✅ SEND EMAIL TO CLAIM USER
    try {
      if (claim.claimantUser && claim.claimantUser.email) {
        await sendEmail(
          claim.claimantUser.email,
          "Claim Rejected",
          `<p>Your claim has been <b>rejected</b> by admin.</p>`
        );
      }
    } catch (emailError) {
      console.log("Rejection email failed:", emailError.message);
    }

    res.json({ message: "Claim rejected successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;