import express from "express";
import multer from "multer";
import Todo from "../models/Todo.js";

function parseLocalDate(str) {
    return new Date(str + "T00:00:00");
  }

const router  = express.Router();

//get
router.get('/', async (req, res) => {
  try {
    const list = await Todo.find().sort({ createdAt: -1 });
    res.json(list);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

//post
router.post("/", async (req, res) => {
  console.log("POST /api/todos body:", req.body);
  try {
    const { text, dueDate } = req.body;                     // ← pull fields out
    const newTodo = await Todo.create({
      text,
      dueDate: parseLocalDate(dueDate)                     // ← use our helper
    });
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("POST /api/todos error:", err);
    res.status(400).json({ error: err.message });
  }
});


//put
router.put('/:id', async (req, res) => {
  try {
    const { completed, dueDate } = req.body;
    const localDue = parseLocalDate(dueDate);
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed, dueDate: localDue },
      { new: true }
    );
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Invalid ID or data' });
  }
});

//delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.sendStatus(404);
    res.sendStatus(204);
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

export default router;