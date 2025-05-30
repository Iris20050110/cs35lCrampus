import express from "express";
import multer from "multer";
import Todo from "../models/Todo.js";

function parseLocalDate(str) {
    return new Date(str + "T00:00:00");
  }

const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.googleId })
                            .sort('-createdAt');
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new todo, stamping it with googleId
router.post('/', async (req, res) => {
  if (!req.user || !req.user.googleId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const todo = await Todo.create({
      text:    req.body.text,
      dueDate: req.body.dueDate,
      user:    req.user.googleId    // ← use googleId here
    });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update one of your todos
router.put('/:id', async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.googleId },
      { completed: req.body.completed, dueDate: req.body.dueDate },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE one of your todos
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.googleId
    });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;