const PomodoroSession = require('../models/pomodoroSession');
const express = require('express');
const middleware = require('../utils/middleware');
const { getIO } = require('../utils/socketRegistry');
require('express-async-errors');

const pomodoroRouter = express.Router();

// Protected routes (authentication required)
pomodoroRouter.get('/stats', middleware.userExtractor, async (req, res) => {
  // Get sessions from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sessions = await PomodoroSession.find({
    user: req.user.id,
    completedAt: { $gte: thirtyDaysAgo },
  }).sort({ completedAt: -1 });

  // Calculate stats
  const totalSessions = sessions.length;
  const focusSessions = sessions.filter((s) => s.type === 'focus').length;
  const breakSessions = sessions.filter((s) => s.type === 'break').length;
  const totalFocusTime = sessions
    .filter((s) => s.type === 'focus')
    .reduce((sum, s) => sum + s.duration, 0);

  res.json({
    totalSessions,
    focusSessions,
    breakSessions,
    totalFocusTime,
    sessions: sessions.slice(0, 10), // Last 10 sessions
  });
});

pomodoroRouter.post('/sessions', middleware.userExtractor, async (req, res) => {
  const { type, duration, config } = req.body;

  const session = new PomodoroSession({
    type,
    duration,
    config: config || {},
    user: req.user.id,
  });

  const savedSession = await session.save();
  await savedSession.populate('user', { username: 1, name: 1 });

  getIO().emit('pomodoroSessionCompleted', savedSession);
  res.status(201).json(savedSession);
});

pomodoroRouter.get('/sessions', middleware.userExtractor, async (req, res) => {
  const sessions = await PomodoroSession.find({ user: req.user.id }).sort({
    completedAt: -1,
  });
  res.json(sessions);
});

module.exports = pomodoroRouter;
