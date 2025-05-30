import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

import User from "./models/User.js";

import googleAuthRouter from "./routes/google.js";
import spotsRouter from "./routes/spots.js";
import todosRouter from "./routes/todos.js";
import authRouter from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          user.name = profile.displayName;
          user.picture = profile.photos[0].value;
          user.email = profile.emails[0].value;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            picture: profile.photos[0].value,
          });
        }
        console.log("Google profile info:", profile);


        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
  
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// MongoDB connection
console.log("Connecting to:", process.env.MONGO_URI);
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crampus', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if we can't connect to the database
  });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

// routes
app.use("/api/auth", googleAuthRouter);
app.use("/api/spots", spotsRouter);
app.use('/api/todos', todosRouter);
app.use('/api/tasks', ensureAuth, todosRouter);

app.get("/", (_req, res) => res.send("API is running!"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
