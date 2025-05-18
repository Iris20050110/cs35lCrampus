import express from "express";
import Spot from "../models/Spot.js";

const router = express.Router();

// GET /api/spots?search=library
router.get("/", async (req, res) => {
  const q = req.query.search || "";
  const spots = await Spot.find({
    name: new RegExp(q, "i"),
  });
  res.json(spots);
});

// POST /api/spots
router.post('/', async (req, res, next) => {
  try {
    const spot = await Spot.create(req.body);
    res.status(201).json(spot);
  } catch (err) {
    next(err);
  }
});

export default router;
