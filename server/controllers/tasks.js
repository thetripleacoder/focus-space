const Task = require('../models/task');
const express = require('express');
const middleware = require('../utils/middleware');
require('express-async-errors');

const tasksRouter = express.Router();

// Protected routes (authentication required)
tasksRouter.get('/', middleware.userExtractor, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(tasks);
});

tasksRouter.post('/', middleware.userExtractor, async (req, res) => {
  const { text, priority } = req.body;

  const task = new Task({
    text,
    priority: priority || 'medium',
    user: req.user.id,
  });

  const savedTask = await task.save();
  await savedTask.populate('user', { username: 1, name: 1 });

  // Note: Socket emission removed - using optimistic updates instead
  res.status(201).json(savedTask);
});

tasksRouter.put('/:id', middleware.userExtractor, async (req, res) => {
  const { text, priority, completed } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }

  if (task.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'access denied' });
  }

  task.text = text || task.text;
  task.priority = priority || task.priority;
  task.completed = completed !== undefined ? completed : task.completed;
  task.updatedAt = new Date();

  const updatedTask = await task.save();
  await updatedTask.populate('user', { username: 1, name: 1 });

  // Note: Socket emission removed - using optimistic updates instead
  res.json(updatedTask);
});

tasksRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }

  if (task.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'access denied' });
  }

  await Task.findByIdAndDelete(req.params.id);
  // Note: Socket emission removed - using optimistic updates instead
  res.status(204).end();
});

module.exports = tasksRouter;
