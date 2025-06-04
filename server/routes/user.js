// import express from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import fs from "fs";
// import { gfs, upload } from "../gridfs.js";
// import mongoose from "mongoose";

// const router = express.Router();

// // LOGIN route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user || !(await user.comparePassword(password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });

//   res.status(200).json({ token });
// });

// router.post("/signup", (req, res) => {
//   console.log(" SIGNUP HIT");
//   res.status(200).json({ msg: "Received!" });
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.status(200).json(user);
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // grid fs implementation
// router.get("/profile-image/:id", async (req, res) => {
//   try {
//     const fileId = new mongoose.Types.ObjectId(req.params.id);
//     const files = await gfs.find({ _id: fileId }).toArray();
//     if (!files || files.length === 0) {
//       return res.status(404).json({ error: "File not found" });
//     }
//     res.set(
//       "Content-Type",
//       files[0].metadata.contentType || "application/octet-stream"
//     );

//     const downloadStream = gfs.openDownloadStream(fileId);
//     downloadStream
//       .on("error", (error) => {
//         console.error("Error streaming file:", error);
//         res.status(404).json({ error: "File not found" });
//       })
//       .pipe(res);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Could not retrieve image" });
//   }
// });

// router.put("/update", upload.single("picture"), async (req, res) => {
//   try {
//     const userId = req.user?.id || req.user?._id || req.body.userId;
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const { name, email, password } = req.body;
//     const updateFields = {};

//     if (name) updateFields.name = name;
//     if (email) updateFields.email = email;
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       updateFields.password = await bcrypt.hash(password, salt);
//     }

//     if (req.file) {
//       // store profile picture in gridfs/ delete old one
//       const user = await User.findById(userId);
//       if (user.pictureId) {
//         try {
//           await gfs.delete(new mongoose.Types.ObjectId(user.pictureId));
//         } catch (err) {
//           console.error("Error deleting old profile picture:", err);
//         }
//       }

//       // upload to gridfs
//       const localPath = req.file.path;
//       const readStream = fs.createReadStream(localPath);
//       const uploadStream = gfs.openUploadStream(req.file.filename, {
//         contentType: req.file.mimetype,
//         metadata: { originalname: req.file.originalname },
//       });
//       const pictureId = uploadStream.id;

//       await new Promise((resolve, reject) => {
//         readStream.pipe(uploadStream).on("finish", resolve).on("error", reject);
//       });

//       fs.unlink(localPath, () => {});

//       updateFields.pictureId = pictureId;
//       updateFields.picture = null;
//       console.log("Update fields:", updateFields);
//     }

//     const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
//       new: true,
//     });
//     res.status(200).json({ message: "User updated", user: updatedUser });
//   } catch (err) {
//     if (req.file) {
//       fs.unlink(req.file.path, (unlinkErr) => {
//         if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
//       });
//     }
//     console.error("Error updating user:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
