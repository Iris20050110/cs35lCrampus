import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:5173/');
  }
);

// Check if user is authenticated
router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});


router.get('/logout', async (req, res) => {
  console.log("Attempting logout...");
  console.log("req.user:", req.user); // 🔍 See if user is set

  try {
    if (req.user) {
      console.log("Deleting user from DB with id:", req.user._id);
      await User.findByIdAndDelete(req.user._id);
    } else {
      console.log("No user found in session. Nothing to delete.");
    }

    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: 'Error logging out' });
      }
      console.log("Logout successful.");
      res.json({ success: true });
    });
  } catch (err) {
    console.error("Logout DB error:", err);
    res.status(500).json({ error: 'Error removing user' });
  }
});


export default router;