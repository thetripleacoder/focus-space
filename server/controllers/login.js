const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');
const { getIO } = require('../utils/socketRegistry'); // 👈 Import registry

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  // Input validation
  if (
    !username ||
    typeof username !== 'string' ||
    username.trim().length === 0
  ) {
    return response.status(400).json({
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Username is required to sign in',
        field: 'username',
      },
    });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return response.status(400).json({
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Password is required to sign in',
        field: 'password',
      },
    });
  }

  const user = await User.findOne({ username: username.trim() });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: {
        type: 'AUTHENTICATION_ERROR',
        message:
          'Invalid username or password. Please check your credentials and try again.',
      },
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  const userPayload = {
    token,
    username: user.username,
    name: user.name,
    id: user._id,
    avatar: user.avatar,
    likedPosts: user.likedPosts,
  };

  // 🔔 Emit login event to all connected clients (or customize per room/user)
  getIO().emit('userLoggedIn', {
    id: user._id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    timestamp: Date.now(),
  });

  response.status(200).send(userPayload);
});

module.exports = loginRouter;
