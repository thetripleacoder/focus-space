const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');

// Create new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  const isValidUsername = typeof username === 'string' && username.length >= 3;
  const isValidPassword = typeof password === 'string' && password.length >= 3;

  if (!isValidUsername && !isValidPassword) {
    return response
      .status(400)
      .json({ error: 'invalid username and password' });
  } else if (!isValidUsername) {
    return response.status(400).json({ error: 'invalid username' });
  } else if (!isValidPassword) {
    return response.status(400).json({ error: 'invalid password' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
    likedPosts: [],
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    response
      .status(500)
      .json({ error: 'user creation failed', details: error.message });
  }
});

// Get all users with liked posts populated
usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({}).populate('likedPosts', {
      title: 1,
      likes: 1,
      genres: 1,
    });

    response.json(users);
  } catch (error) {
    response
      .status(500)
      .json({ error: 'failed to fetch users', details: error.message });
  }
});

module.exports = usersRouter;
