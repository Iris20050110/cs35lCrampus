import express from "express";
import multer from "multer";
import Spot from "../models/Spot.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET spots
router.get("/", async (req, res) => {
  const { search = "", tag = "" } = req.query;
  const filter = {};

  if (search) filter.name = new RegExp(search, "i");
  if (tag) filter.tags = tag;

  try {
    const spots = await Spot.find(filter);
    res.json(spots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch spots" });
  }
});

// GET spot suggestions
router.get("/suggestions", async (req, res) => {
  const { q = "" } = req.query;

  try {
    const results = await Spot.find({ name: new RegExp(q, "i") })
      .limit(5)
      .select("name -_id");
    res.json(results.map((r) => r.name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// POST (requires login)
router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { name, location, description, tags, hours } = req.body;

    const spot = await Spot.create({
      name,
      location,
      description,
      tags: JSON.parse(tags),
      hours: JSON.parse(hours),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      userId: req.user._id, // 👈 save owner
    });

    res.status(201).json(spot);
  } catch (err) {
    next(err);
  }
});

// GET get spot by ID
router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: "Spot not found" });
    res.json(spot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch spot" });
  }
});

// DELETE (only by owner)
router.delete("/:id", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: "Spot not found" });

    if (spot.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this spot." });
    }

    await Spot.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete spot" });
  }
});

export default router;
