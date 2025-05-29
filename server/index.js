import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import User from './models/User.js';

import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import googleAuthRouter from "./routes/google.js";

import spotsRouter from "./routes/spots.js";
import todosRouter from "./routes/todos.js";
import authRouter from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Session setup
app.use(
  session({
    secret: "yourSecretKey", // use .env for production
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update user info if it changed
          user.name = profile.displayName;
          user.picture = profile.photos[0].value;
          user.email = profile.emails[0].value;
          await user.save();
        } else {
          // Create new user if not found
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            picture: profile.photos[0].value,
          });
        }

        return done(null, user); // ✅ store user in session
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize/deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));
app.use("/api/auth", googleAuthRouter);

app.use("/api/spots", spotsRouter);
app.use('/api/todos', todosRouter);

// Routes
app.get("/", (_req, res) => res.send("API is running!"));

const startServer = async () => {
  try {
    // MongoDB connection
    console.log("🚧 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // Start server only after DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.reason) {
      console.error("Error reason:", error.reason);
    }
    process.exit(1);
  }
};

startServer();