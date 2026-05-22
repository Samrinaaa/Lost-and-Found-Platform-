const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const auth = require("../middleware/auth");
const { getCache, setCache } = require("../config/redis");
const createNotification = require("../utils/createNotification");

// ── Helpers ──────────────────────────────────────────────────

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to",
  "for", "of", "with", "my", "i", "it", "is", "was", "has", "have",
  "been", "found", "lost", "near", "around", "inside", "outside",
]);

const tokenize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));

const countCommon = (setA, arrB) => {
  let count = 0;
  for (const word of arrB) {
    if (setA.has(word)) count++;
  }
  return count;
};

const scoreMatch = (itemA, itemB, locationFieldA, locationFieldB) => {
  let score = 0;
  const reasons = [];

  if (itemA.category && itemB.category &&
    itemA.category.toLowerCase() === itemB.category.toLowerCase()) {
    score += 40;
    reasons.push(`Same category: ${itemA.category}`);
  }

  const nameTokensA = new Set(tokenize(itemA.itemName));
  const nameTokensB = tokenize(itemB.itemName);
  const nameMatches = countCommon(nameTokensA, nameTokensB);
  if (nameMatches > 0) {
    score += Math.min(35, nameMatches * 15);
    reasons.push(`${nameMatches} matching word(s) in item name`);
  }

  const descTokensA = new Set(tokenize(itemA.description));
  const descTokensB = tokenize(itemB.description);
  const descMatches = countCommon(descTokensA, descTokensB);
  if (descMatches > 0) {
    score += Math.min(15, descMatches * 5);
    reasons.push(`${descMatches} matching word(s) in description`);
  }

  const locTokensA = new Set(tokenize(itemA[locationFieldA]));
  const locTokensB = tokenize(itemB[locationFieldB]);
  const locMatches = countCommon(locTokensA, locTokensB);
  if (locMatches > 0) {
    score += Math.min(10, locMatches * 5);
    reasons.push(`Similar location: ${itemB[locationFieldB]}`);
  }

  return { score: Math.min(score, 100), reasons };
};

// ── GET /api/match/lost/:lostId ───────────────────────────────
router.get("/lost/:lostId", auth, async (req, res) => {
  try {
    const { lostId } = req.params;
    const cacheKey = `match_lost_${lostId}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const lostItem = await LostItem.findById(lostId);
    if (!lostItem) return res.status(404).json({ message: "Lost item not found." });

    const foundItems = await FoundItem.find({ status: "open" }).populate("userId", "fullName email");

    const matches = foundItems
      .map((foundItem) => {
        const { score, reasons } = scoreMatch(lostItem, foundItem, "locationLost", "locationFound");
        return { foundItem, score, reasons };
      })
      .filter((m) => m.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Notify the lost item owner if matches were found
    if (matches.length > 0) {
      await createNotification(
        lostItem.userId,
        `${matches.length} potential match${matches.length > 1 ? "es" : ""} found for your lost item "${lostItem.itemName}"!`,
        "match_found",
        `/lost-items`
      );
    }

    const result = {
      lostItem,
      matches: matches.map((m) => ({
        ...m.foundItem.toObject(),
        matchScore: m.score,
        matchReasons: m.reasons,
      })),
    };

    await setCache(cacheKey, result, 120);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/match/found/:foundId ─────────────────────────────
router.get("/found/:foundId", auth, async (req, res) => {
  try {
    const { foundId } = req.params;
    const cacheKey = `match_found_${foundId}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const foundItem = await FoundItem.findById(foundId);
    if (!foundItem) return res.status(404).json({ message: "Found item not found." });

    const lostItems = await LostItem.find({ status: "open" }).populate("userId", "fullName email");

    const matches = lostItems
      .map((lostItem) => {
        const { score, reasons } = scoreMatch(foundItem, lostItem, "locationFound", "locationLost");
        return { lostItem, score, reasons };
      })
      .filter((m) => m.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Notify the found item owner if matches were found
    if (matches.length > 0) {
      await createNotification(
        foundItem.userId,
        `${matches.length} potential match${matches.length > 1 ? "es" : ""} found for your found item "${foundItem.itemName}"!`,
        "match_found",
        `/found-items`
      );
    }

    const result = {
      foundItem,
      matches: matches.map((m) => ({
        ...m.lostItem.toObject(),
        matchScore: m.score,
        matchReasons: m.reasons,
      })),
    };

    await setCache(cacheKey, result, 120);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;