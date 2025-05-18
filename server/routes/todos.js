const express = require('express');
const router  = express.Router();
const Todo    = require('../models/Todo');

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
router.post('/', async (req, res) => {
  try {
    const { text, dueDate } = req.body;
    const localDue = parseLocalDate(dueDate);
    const todo = new Todo({ text, dueDate: localDue });
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch {
    res.status(400).json({ error: 'Invalid input' });
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

module.exports = router;