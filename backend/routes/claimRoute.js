const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const auth = require("../middleware/auth");


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

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "approved";

    await claim.save();

    res.json({ message: "Claim approved successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// REJECT CLAIM
router.put("/:id/reject", auth, async (req, res) => {
  try {

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "rejected";

    await claim.save();

    res.json({ message: "Claim rejected successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;