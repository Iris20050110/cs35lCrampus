import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import multer from 'multer';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// LOGIN route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({ token });
});

router.post("/signup", (req, res) => {
  console.log(" SIGNUP HIT");
  res.status(200).json({ msg: "Received!" });
});

// ✅ GET /api/auth/:id → Fetch user info (exclude password)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT /api/auth/update → Update user info
router.put('/update', upload.single('picture'), async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.body.userId; // fallback options
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, email, password } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }
    if (req.file) {
      updateFields.picture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;