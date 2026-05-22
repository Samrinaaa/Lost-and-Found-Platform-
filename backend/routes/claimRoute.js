const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const auth = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const { uploadProof } = require("../config/cloudinary");
const createNotification = require("../utils/createNotification");

// helper middleware: admin only
const adminOnly = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// CREATE CLAIM
router.post("/", auth, uploadProof.array("proofImages", 5), async (req, res) => {
  try {
    const { lostId, foundId, description } = req.body;

    if (!lostId && !foundId) {
      return res.status(400).json({ message: "Either lostId or foundId is required." });
    }

    const uploadedProofs = req.files ? req.files.map((file) => file.path) : [];

    const claim = new Claim({
      claimantUser: req.user.id,
      lostId: lostId || null,
      foundId: foundId || null,
      description: description || "",
      proofImages: uploadedProofs,
      logs: [{
        message: uploadedProofs.length > 0
          ? "Claim submitted with proof files"
          : "Claim submitted"
      }]
    });

    await claim.save();

    // Notify item owner + send email
    try {
      let item = null;
      if (lostId) item = await LostItem.findById(lostId).populate("userId");
      else if (foundId) item = await FoundItem.findById(foundId).populate("userId");

      if (item?.userId) {
        await createNotification(
          item.userId._id,
          `Someone submitted a claim for your item: "${item.itemName}"`,
          "claim_submitted",
          "/claim-status"
        );

        if (item.userId.email) {
          await sendEmail(
            item.userId.email,
            "New Claim Submitted",
            `<p>Someone has submitted a claim for your item: <b>${item.itemName}</b></p>`
          );
        }
      }
    } catch (err) {
      console.log("Notification/email error:", err.message);
    }

    res.status(201).json({ message: "Claim submitted successfully.", claim });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET CLAIMS (with pagination)
router.get("/", auth, async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip  = (page - 1) * limit;

    const query = req.user.role === "admin"
      ? {}
      : { claimantUser: req.user.id };

    const [claims, totalItems] = await Promise.all([
      Claim.find(query)
        .populate("claimantUser", "fullName email")
        .populate("lostId")
        .populate("foundId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Claim.countDocuments(query),
    ]);

    res.json({
      claims,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN: SET UNDER REVIEW
router.put("/:id/review", auth, adminOnly, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.status = "under_review";
    claim.logs.push({ message: "Admin started reviewing the claim" });
    await claim.save();

    // Notify claimant
    await createNotification(
      claim.claimantUser,
      "Your claim is now under review by the admin.",
      "claim_review",
      "/claim-status"
    );

    res.json({ message: "Claim moved to under review" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN: REQUEST MORE INFO
router.put("/:id/request-info", auth, adminOnly, async (req, res) => {
  try {
    const { message } = req.body;

    const claim = await Claim.findById(req.params.id)
      .populate("claimantUser", "fullName email");
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.status = "need_more_info";
    claim.adminMessage = message || "";
    claim.logs.push({ message: `Admin requested more info: ${message || ""}` });
    await claim.save();

    // Notify claimant
    await createNotification(
      claim.claimantUser._id,
      `Admin needs more information about your claim. Message: "${message || ""}"`,
      "need_more_info",
      "/claim-status"
    );

    try {
      if (claim.claimantUser?.email) {
        await sendEmail(
          claim.claimantUser.email,
          "More Information Required",
          `<p>Admin has requested more details: <b>${message || ""}</b></p>`
        );
      }
    } catch (err) {
      console.log("Email error:", err.message);
    }

    res.json({ message: "Requested more information from user" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// USER: RESPOND TO ADMIN
router.put("/:id/respond", auth, uploadProof.array("proofImages", 5), async (req, res) => {
  try {
    const { response } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (claim.claimantUser.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. This is not your claim." });
    }

    const uploadedProofs = req.files ? req.files.map((file) => file.path) : [];

    claim.userResponse = response || "";
    claim.status = "under_review";
    if (uploadedProofs.length > 0) {
      claim.proofImages = [...claim.proofImages, ...uploadedProofs];
    }
    claim.logs.push({
      message: uploadedProofs.length > 0
        ? `User responded with additional proof: ${response || ""}`
        : `User responded: ${response || ""}`
    });

    await claim.save();

    res.json({ message: "Response submitted successfully", claim });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// APPROVE CLAIM
router.put("/:id/approve", auth, adminOnly, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate("claimantUser", "fullName email");
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.status = "approved";
    claim.logs.push({ message: "Claim approved by admin" });
    await claim.save();

    if (claim.lostId) await LostItem.findByIdAndUpdate(claim.lostId, { status: "found" });
    if (claim.foundId) await FoundItem.findByIdAndUpdate(claim.foundId, { status: "claimed" });

    // Notify claimant
    await createNotification(
      claim.claimantUser._id,
      "🎉 Your claim has been approved by the admin!",
      "claim_approved",
      "/claim-status"
    );

    try {
      if (claim.claimantUser?.email) {
        await sendEmail(
          claim.claimantUser.email,
          "Claim Approved",
          `<p>Your claim has been <b>approved</b> by admin.</p>`
        );
      }
    } catch (err) {
      console.log("Email error:", err.message);
    }

    res.json({ message: "Claim approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REJECT CLAIM
router.put("/:id/reject", auth, adminOnly, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate("claimantUser", "fullName email");
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    claim.status = "rejected";
    claim.logs.push({ message: "Claim rejected by admin" });
    await claim.save();

    // Notify claimant
    await createNotification(
      claim.claimantUser._id,
      "Your claim has been rejected by the admin.",
      "claim_rejected",
      "/claim-status"
    );

    try {
      if (claim.claimantUser?.email) {
        await sendEmail(
          claim.claimantUser.email,
          "Claim Rejected",
          `<p>Your claim has been <b>rejected</b> by admin.</p>`
        );
      }
    } catch (err) {
      console.log("Email error:", err.message);
    }

    res.json({ message: "Claim rejected successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;