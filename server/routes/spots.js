import express from "express";
import mongoose from "mongoose";
import { gfs, upload } from "../gridfs.js";
import Spot from "../models/Spot.js";
import fs from "fs";

const router = express.Router();

// get spots
router.get("/", async (req, res) => {
  const { search = "", tag = "" } = req.query;
  const filter = {};
  if (search) filter.name = new RegExp(search, "i");
  if (tag) {
    const tags = Array.isArray(tag) ? tag : tag.split(",");
    if (tags.length > 0) {
      filter.tags = { $all: tags };
    }
  }

  try {
    const spots = await Spot.find(filter)
      .populate("userId", "name")
      .populate("reviews.userId", "name");
    res.json(spots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch spots" });
  }
});

// get spot suggestions
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

// post (requires login)
router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { name, location, description, tags, hours } = req.body;
    let photoFileId = null;

    if (req.file) {
      const localPath = req.file.path;
      const readStream = fs.createReadStream(localPath);
      const uploadStream = gfs.openUploadStream(req.file.filename, {
        contentType: req.file.mimetype,
        metadata: { originalname: req.file.originalname },
      });
      photoFileId = uploadStream.id;
      await new Promise((resolve, reject) => {
        readStream.pipe(uploadStream).on("finish", resolve).on("error", reject);
      });
      fs.unlink(localPath, () => {});
    }

    const spot = await Spot.create({
      name,
      location,
      description,
      tags: JSON.parse(tags || "[]"),
      hours: JSON.parse(hours || "{}"),
      photoFileId,
      userId: req.user._id,
    });

    // populate the user data before sending response
    await spot.populate("userId", "name");

    res.status(201).json(spot);
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
      });
    }
    console.error("Error creating spot:", err);
    next(err);
  }
});

// get spot by id
router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id)
      .populate("userId", "name")
      .populate("reviews.userId", "name");
    if (!spot) return res.status(404).json({ error: "Spot not found" });
    res.json(spot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch spot" });
  }
});

// get /api/spots/image/:id
router.get("/image/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }
    res.set(
      "Content-Type",
      files[0].metadata.contentType || "application/octet-stream"
    );
    gfs
      .openDownloadStream(fileId)
      .on("error", () => res.status(404).json({ error: "File not found" }))
      .pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not retrieve image" });
  }
});

// delete a spot
router.delete("/:id", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: "Spot not found" });
    // will never encounter a no permission because the button shouldn't even pop up
    if (spot.photoFileId) {
      try {
        await gfs.delete(new mongoose.Types.ObjectId(spot.photoFileId));
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }
    await Spot.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete spot" });
  }
});

// get reviews for a spot
router.get("/:id/reviews", async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id).populate(
      "reviews.userId",
      "_id name"
    );
    if (!spot) return res.status(404).json({ error: "Spot not found" });
    res.json(spot.reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// post a new review for a spot (requires login)
router.post("/:id/reviews", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "You must be signed in with a UCLA email to submit a review.",
      });
    }
    const { rating, text = "" } = req.body;
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be 1-5" });
    }
    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: "Spot not found" });
    const newReview = { userId: req.user._id, rating, text, date: new Date() };
    spot.reviews.push(newReview);
    await spot.save();

    // fetch the updated spot with populated user data
    const updatedSpot = await Spot.findById(req.params.id).populate(
      "reviews.userId",
      "_id name"
    );
    const addedReview = updatedSpot.reviews[updatedSpot.reviews.length - 1];

    res.status(201).json({ message: "Review added", review: addedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add review" });
  }
});

// delete a review
router.delete("/:id/reviews/:reviewId", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }

    const review = spot.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this review" });
    }

    spot.reviews.pull({ _id: req.params.reviewId });
    await spot.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// edit a review
router.patch("/:id/reviews/:reviewId", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { rating, text } = req.body;
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be 1-5" });
    }

    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }

    const review = spot.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this review" });
    }

    review.rating = rating;
    review.text = text;
    await spot.save();

    // fetch the updated spot with populated user data
    const updatedSpot = await Spot.findById(req.params.id).populate(
      "reviews.userId",
      "_id name"
    );
    const updatedReview = updatedSpot.reviews.id(req.params.reviewId);

    res.json({ success: true, review: updatedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// POST /api/spots/:id/report
router.post("/:id/report", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "You must be signed in to report a spot" });
    }

    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: "Spot not found" });

    // has the user already reported this spot?
    if (spot.reportedBy.includes(req.user._id)) {
      return res
        .status(400)
        .json({ error: "You have already reported this spot" });
    }

    // Add user to reportedBy array and increment report count
    spot.reportedBy.push(req.user._id);
    spot.reportCount = (spot.reportCount || 0) + 1;

    if (spot.reportCount >= 5) {
      if (spot.photoFileId) {
        try {
          await gfs.delete(new mongoose.Types.ObjectId(spot.photoFileId));
        } catch (err) {
          console.error("Error deleting photo:", err);
        }
      }

      await spot.deleteOne();
      return res.json({
        success: true,
        deleted: true,
        message: "Spot deleted after 5 reports",
      });
    }

    await spot.save();
    res.json({ success: true, reportCount: spot.reportCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to report spot" });
  }
});

router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const spot = await Spot.findById(req.params.id);
    if (!spot) return res.status(404).json({ error: "Spot not found" });

    if (spot.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not the owner of this spot" });
    }

    const { name, location, description, tags, hours } = req.body;

    spot.name = name;
    spot.location = location;
    spot.description = description;
    spot.tags = JSON.parse(tags || "[]");
    spot.hours = JSON.parse(hours || "{}");

    if (req.file) {
      // delete old photo
      if (spot.photoFileId) {
        try {
          await gfs.delete(new mongoose.Types.ObjectId(spot.photoFileId));
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      // upload new photo
      const localPath = req.file.path;
      const readStream = fs.createReadStream(localPath);
      const uploadStream = gfs.openUploadStream(req.file.filename, {
        contentType: req.file.mimetype,
        metadata: { originalname: req.file.originalname },
      });
      spot.photoFileId = uploadStream.id;

      await new Promise((resolve, reject) => {
        readStream.pipe(uploadStream).on("finish", resolve).on("error", reject);
      });

      fs.unlink(localPath, () => {});
    }

    await spot.save();
    res.json({ success: true, spot });

  } catch (err) {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
    console.error("Error updating spot:", err);
    res.status(500).json({ error: "Failed to update spot" });
  }
});

export default router;
