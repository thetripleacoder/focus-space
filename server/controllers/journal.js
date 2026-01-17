const JournalEntry = require('../models/journalEntry');
const express = require('express');
const middleware = require('../utils/middleware');
require('express-async-errors');

const journalRouter = express.Router();

// Protected routes (authentication required)
journalRouter.get('/', middleware.userExtractor, async (req, res) => {
  const entries = await JournalEntry.find({ user: req.user.id }).sort({
    timestamp: -1,
  });
  res.json(entries);
});

journalRouter.post('/', middleware.userExtractor, async (req, res) => {
  const { note, tags, mood } = req.body;

  const entry = new JournalEntry({
    note,
    tags: tags || [],
    mood,
    user: req.user.id,
  });

  const savedEntry = await entry.save();
  await savedEntry.populate('user', { username: 1, name: 1 });

  // Note: Socket emission removed - using optimistic updates instead
  res.status(201).json(savedEntry);
});

journalRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const entry = await JournalEntry.findById(req.params.id);
  if (!entry) {
    return res.status(404).json({ error: 'journal entry not found' });
  }

  if (entry.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'access denied' });
  }

  await JournalEntry.findByIdAndDelete(req.params.id);
  // Note: Socket emission removed - using optimistic updates instead
  res.status(204).end();
});

module.exports = journalRouter;
