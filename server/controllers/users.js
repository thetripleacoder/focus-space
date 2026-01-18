const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const middleware = require('../utils/middleware');
const User = require('../models/user');

// Validation helper functions
const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    throw new Error('Username is required and must be a valid string');
  }
  if (username.trim().length === 0) {
    throw new Error('Username cannot be empty or only whitespace');
  }
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
  if (username.length > 30) {
    throw new Error('Username must be less than 30 characters long');
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error(
      'Username can only contain letters (a-z, A-Z), numbers (0-9), and underscores (_)',
    );
  }
  return true;
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password is required and must be a valid string');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  if (password.length > 128) {
    throw new Error('Password must be less than 128 characters long');
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new Error(
      'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z), and one number (0-9)',
    );
  }
  return true;
};

const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Full name is required and must be a valid string');
  }
  if (name.trim().length === 0) {
    throw new Error('Full name cannot be empty or only whitespace');
  }
  if (name.trim().length < 2) {
    throw new Error('Full name must be at least 2 characters long');
  }
  if (name.length > 100) {
    throw new Error('Full name must be less than 100 characters long');
  }
  return true;
};

const validateAvatar = (avatar) => {
  if (avatar && typeof avatar !== 'string') {
    throw new Error('Avatar must be a valid URL string');
  }
  if (avatar && avatar.length > 500) {
    throw new Error('Avatar URL must be less than 500 characters');
  }
  // Basic URL validation if avatar is provided
  if (avatar && avatar.trim()) {
    try {
      new URL(avatar);
    } catch {
      throw new Error('Avatar must be a valid URL');
    }
  }
  return true;
};

// Create new user
usersRouter.post(
  '/',
  middleware.sanitizeAndValidateUser,
  async (request, response) => {
    try {
      const { username, name, avatar, password } = request.sanitizedBody;

      // Comprehensive validation
      validateUsername(username);
      validateName(name);
      validatePassword(password);
      validateAvatar(avatar);

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = new User({
        username: username.trim(),
        name: name.trim(),
        avatar: avatar?.trim() || undefined,
        passwordHash,
        likedPosts: [],
      });

      const savedUser = await user.save();
      response.status(201).json(savedUser);
    } catch (error) {
      // Handle validation errors
      if (
        error.message.includes('must') ||
        error.message.includes('required') ||
        error.message.includes('contain')
      ) {
        return response.status(400).json({
          error: {
            type: 'VALIDATION_ERROR',
            message: error.message,
            field: error.message.includes('Username')
              ? 'username'
              : error.message.includes('Password')
                ? 'password'
                : error.message.includes('name')
                  ? 'name'
                  : 'avatar',
          },
        });
      }

      // Handle duplicate username error
      if (error.name === 'MongoServerError' && error.code === 11000) {
        return response.status(409).json({
          error: {
            type: 'CONFLICT_ERROR',
            message:
              'Username already exists. Please choose a different username.',
            field: 'username',
          },
        });
      }

      // Handle other database errors
      response.status(500).json({
        error: {
          type: 'INTERNAL_SERVER_ERROR',
          message:
            'Account creation failed due to a server error. Please try again later.',
          details:
            process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
      });
    }
  },
);

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
    response.status(500).json({
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to retrieve user list. Please try again later.',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
    });
  }
});

// Follow a user
usersRouter.post('/:id/follow', middleware.userExtractor, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user not found' });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Prevent self-following
    if (currentUser._id.toString() === userToFollow._id.toString()) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Add to following list of current user
    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    // Add to followers list of target user
    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    res.json({
      message: `Successfully followed ${userToFollow.username}`,
      following: currentUser.following.length,
      followers: userToFollow.followers.length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to follow user',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Unfollow a user
usersRouter.delete(
  '/:id/follow',
  middleware.userExtractor,
  async (req, res) => {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      if (!userToUnfollow) {
        return res.status(404).json({ error: 'User not found' });
      }

      const currentUser = await User.findById(req.user.id);
      if (!currentUser) {
        return res.status(404).json({ error: 'Current user not found' });
      }

      // Check if actually following
      if (!currentUser.following.includes(userToUnfollow._id)) {
        return res.status(400).json({ error: 'Not following this user' });
      }

      // Remove from following list of current user
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToUnfollow._id.toString(),
      );
      await currentUser.save();

      // Remove from followers list of target user
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== currentUser._id.toString(),
      );
      await userToUnfollow.save();

      res.json({
        message: `Successfully unfollowed ${userToUnfollow.username}`,
        following: currentUser.following.length,
        followers: userToUnfollow.followers.length,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to unfollow user',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  },
);

// Get followers of a user
usersRouter.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', {
      username: 1,
      name: 1,
      avatar: 1,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user._id,
      username: user.username,
      followers: user.followers,
      count: user.followers.length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get followers',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Get users that a user is following
usersRouter.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', {
      username: 1,
      name: 1,
      avatar: 1,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user._id,
      username: user.username,
      following: user.following,
      count: user.following.length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get following list',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Get user's follow stats
usersRouter.get('/:id/follow-stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user._id,
      username: user.username,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get follow stats',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = usersRouter;
