import express from "express";
import passport from "passport";
import User from "../models/User.js";
import fs from "fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { gfs, upload } from "../gridfs.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    // Successful authentication
    res.redirect("http://localhost:5173/");
  }
);

// Check if user is authenticated
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, name, email, picture, pictureId } = req.user;
    res.json({
      isAuthenticated: true,
      user: { _id, name, email, picture, pictureId },
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.get("/logout", async (req, res) => {
  console.log("Attempting logout...");

  try {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Error logging out" });
      }
      console.log("Logout successful.");
      res.json({ success: true });
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Error logging out" });
  }
});

// PUT /api/auth/update
router.put("/update", upload.single("picture"), async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.body.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, email, password } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      // Delete old image if exists
      const user = await User.findById(userId);
      if (user.pictureId) {
        try {
          await gfs.delete(new mongoose.Types.ObjectId(user.pictureId));
        } catch (err) {
          console.error("Error deleting old profile picture:", err);
        }
      }

      // Upload new one
      const localPath = req.file.path;
      const readStream = fs.createReadStream(localPath);
      const uploadStream = gfs.openUploadStream(req.file.filename, {
        contentType: req.file.mimetype,
        metadata: { originalname: req.file.originalname },
      });
      const pictureId = uploadStream.id;

      await new Promise((resolve, reject) => {
        readStream.pipe(uploadStream).on("finish", resolve).on("error", reject);
      });

      fs.unlink(localPath, () => {});
      updateFields.pictureId = pictureId;
      updateFields.picture = null; // optional
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
    
    res.json({ 
      success: true, 
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        picture: updatedUser.picture,
        pictureId: updatedUser.pictureId
      }
    });
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
      });
    }
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/profile-image/:id
router.get("/profile-image/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }
    
    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    gfs.openDownloadStream(fileId)
      .on("error", () => res.status(404).json({ error: "File not found" }))
      .pipe(res);
  } catch (err) {
    console.error("Error serving profile image:", err);
    res.status(500).json({ error: "Could not retrieve image" });
  }
});

export default router;
