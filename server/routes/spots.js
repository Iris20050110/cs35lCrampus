import express from "express";
import mongoose from "mongoose";
import { gfs, upload } from "../gridfs.js";
import Spot from "../models/Spot.js";
import fs from "fs";
import path from "path";

const router = express.Router()

// get spots
router.get("/", async (req, res) => {
  const { search = "", tag = "" } = req.query
  const filter = {}

  if (search) filter.name = new RegExp(search, "i")
  if (tag) filter.tags = tag

  try {
    const spots = await Spot.find(filter)
    res.json(spots)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch spots" })
  }
});

// get spot suggestions
router.get("/suggestions", async (req, res) => {
  const { q = "" } = req.query

  try {
    const results = await Spot.find({ name: new RegExp(q, "i") })
      .limit(5)
      .select("name -_id")
    res.json(results.map((r) => r.name))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch suggestions" })
  }
})

// post (requires login)
router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    const { name, location, description, tags, hours } = req.body

    let photoFileId = null

    if (req.file) {
      const readStream = fs.createReadStream(req.file.path)

      const uploadStream = gfs.openUploadStream(req.file.filename, {
        contentType: req.file.mimetype,
        metadata: {
          originalname: req.file.originalname,
        },
      });

      photoFileId = uploadStream.id;

      readStream.pipe(uploadStream);

      readStream.on("end", () => {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting temp file:", err)
        })
      })
    }

    const spot = await Spot.create({
      name,
      location,
      description,
      tags: JSON.parse(tags),
      hours: JSON.parse(hours),
      photoFileId,
      userId: req.user._id,
    });

    res.status(201).json(spot);
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr)
      })
    }
    console.error("Error creating spot:", err)
    next(err)
  }
});

// get spot by id
router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id)
    if (!spot) return res.status(404).json({ error: "Spot not found" })
    res.json(spot)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch spot" })
  }
});

// get /api/spots/image/:id
router.get("/image/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id)

    // Create download stream
    const downloadStream = gfs.openDownloadStream(fileId)

    // Set the proper content type
    downloadStream.on("file", (file) => {
      res.set("Content-Type", file.metadata.contentType)
    })

    // Pipe the file to the response
    downloadStream.pipe(res)

    // Handle errors
    downloadStream.on("error", (error) => {
      console.error("Error streaming file:", error)
      res.status(404).json({ error: "File not found" })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Could not retrieve image" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    const spot = await Spot.findById(req.params.id)
    if (!spot) return res.status(404).json({ error: "Spot not found" })

    if (spot.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this spot." })
    }

    if (spot.photoFileId) {
      try {
        await gfs.delete(new mongoose.Types.ObjectId(spot.photoFileId))
      } catch (err) {
        console.error("Error deleting file:", err)
      }
    }

    await Spot.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to delete spot" })
  }
})

// get reviews for a spot
router.get("/:id/reviews", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id).populate("reviews.userId", "username")
    if (!spot) return res.status(404).json({ error: "Spot not found" })

    res.json(spot.reviews)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch reviews" })
  }
})

// post a new review for a spot (requires login)
router.post("/:id/reviews", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "You must be signed in with a UCLA email to submit a review." })
    }

    const { rating, text } = req.body
    const spot = await Spot.findById(req.params.id)
    if (!spot) return res.status(404).json({ error: "Spot not found" })

    const newReview = {
      userId: req.user._id,
      rating,
      text,
      date: new Date(),
    }

    spot.reviews.push(newReview)
    await spot.save()

    res.status(201).json({ message: "Review added", review: newReview })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to add review" })
  }
});


export default router;
