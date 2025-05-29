import express from "express";
import multer from "multer";
import Spot from "../models/Spot.js";

const router = express.Router();

// Configure multer to store uploads in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// GET /api/spots?search=library&tag=quiet
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

// GET /api/spots/suggestions?q=lib
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

// POST /api/spots (with photo)
router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    const { name, location, description, tags, hours } = req.body;

    const spot = await Spot.create({
      name,
      location,
      description,
      tags: JSON.parse(tags),
      hours: JSON.parse(hours),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(spot);
  } catch (err) {
    next(err);
  }
});

// GET /api/spots/:id - get spot by id
router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }
    res.json(spot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch spot" });
  }
});

export default router;