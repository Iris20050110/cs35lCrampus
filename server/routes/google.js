import express from "express";
import passport from "passport";
import User from "../models/User.js";

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

export default router;
