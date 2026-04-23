const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const auth = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const multer = require("multer");

// Multer setup for proof uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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
router.post("/", auth, upload.array("proofImages", 5), async (req, res) => {
  try {
    const { lostId, foundId, description } = req.body;

    if (!lostId && !foundId) {
      return res.status(400).json({
        message: "Either lostId or foundId is required."
      });
    }

    const uploadedProofs = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const claim = new Claim({
      claimantUser: req.user.id,
      lostId: lostId || null,
      foundId: foundId || null,
      description: description || "",
      proofImages: uploadedProofs,
      logs: [
        {
          message: uploadedProofs.length > 0
            ? "Claim submitted with proof files"
            : "Claim submitted"
        }
      ]
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

    res.status(201).json({
      message: "Claim submitted successfully.",
      claim
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET CLAIMS
// admin -> all claims
// user -> only their own claims
router.get("/", auth, async (req, res) => {
  try {
    let claims;

    if (req.user.role === "admin") {
      claims = await Claim.find()
        .populate("claimantUser", "fullName email")
        .populate("lostId")
        .populate("foundId");
    } else {
      claims = await Claim.find({ claimantUser: req.user.id })
        .populate("claimantUser", "fullName email")
        .populate("lostId")
        .populate("foundId");
    }

    res.json(claims);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN: SET UNDER REVIEW
router.put("/:id/review", auth, adminOnly, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "under_review";

    claim.logs.push({
      message: "Admin started reviewing the claim"
    });

    await claim.save();

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

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "need_more_info";
    claim.adminMessage = message || "";

    claim.logs.push({
      message: `Admin requested more info: ${message || ""}`
    });

    await claim.save();

    // SEND EMAIL TO USER
    try {
      if (claim.claimantUser && claim.claimantUser.email) {
        await sendEmail(
          claim.claimantUser.email,
          "More Information Required",
          `<p>Admin has requested more details: <b>${message || ""}</b></p>`
        );
      }
    } catch (emailError) {
      console.log("Request info email failed:", emailError.message);
    }

    res.json({ message: "Requested more information from user" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// USER: RESPOND TO ADMIN (FOLLOW-UP)
router.put("/:id/respond", auth, upload.array("proofImages", 5), async (req, res) => {
  try {
    const { response } = req.body;

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.claimantUser.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. This is not your claim." });
    }

    const uploadedProofs = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

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

    res.json({
      message: "Response submitted successfully",
      claim
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// APPROVE CLAIM
router.put("/:id/approve", auth, adminOnly, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate("claimantUser", "fullName email");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "approved";

    claim.logs.push({
      message: "Claim approved by admin"
    });

    await claim.save();

    // UPDATE RELATED ITEM STATUS
    if (claim.lostId) {
      await LostItem.findByIdAndUpdate(claim.lostId, {
        status: "found"
      });
    }

    if (claim.foundId) {
      await FoundItem.findByIdAndUpdate(claim.foundId, {
        status: "claimed"
      });
    }

    // SEND EMAIL TO CLAIM USER
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
router.put("/:id/reject", auth, adminOnly, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate("claimantUser", "fullName email");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "rejected";

    claim.logs.push({
      message: "Claim rejected by admin"
    });

    await claim.save();

    // SEND EMAIL TO CLAIM USER
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