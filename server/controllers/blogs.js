const mongoose = require('mongoose');
const Blog = require('../models/blog');
const express = require('express');
const middleware = require('../utils/middleware');
const { getIO } = require('../utils/socketRegistry');
require('express-async-errors');

const blogsRouter = express.Router();

// Public routes (no authentication required)
blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate('user', { username: 1, name: 1, avatar: 1 })
      .populate('likedBy', { username: 1, name: 1 });

    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate('user', { username: 1, name: 1, avatar: 1 })
    .populate('likedBy', { username: 1, name: 1, avatar: 1 });

  if (blog) {
    res.json(blog);
  } else {
    res.status(404).json({ error: 'No blog found to retrieve' });
  }
});

// Protected routes (authentication required)
blogsRouter.post(
  '/',
  middleware.userExtractor,
  middleware.sanitizeAndValidateBlog,
  async (req, res) => {
    const { sanitizedBody } = req;

    if (!sanitizedBody.title || typeof sanitizedBody.title !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid title' });
    }

    const blog = new Blog({
      ...sanitizedBody,
      genres: Array.isArray(sanitizedBody.genres) ? sanitizedBody.genres : [],
      user: req.user.id,
    });

    const savedBlog = await blog.save();
    const populatedBlog = await savedBlog.populate('user', {
      username: 1,
      name: 1,
      avatar: 1,
    });

    getIO().emit('blogCreated', populatedBlog); // ✅ Emit to all clients
    res.status(201).json(populatedBlog);
  }
);

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ error: 'No blog found to delete' });
  }

  if (blog.user.toString() !== req.user.id.toString()) {
    return res.status(401).json({ error: 'Unauthorized to delete this blog' });
  }

  await Blog.findByIdAndDelete(req.params.id);
  getIO().emit('blogDeleted', req.params.id); // ✅ Emit deletion
  res.status(204).end();
});

blogsRouter.post('/:id/like', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const userId = req.user.id;
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const isLiked = blog.likedBy.some((id) => id.toString() === userId);

  if (isLiked) {
    // Unlike: remove user from likedBy array
    blog.likedBy = blog.likedBy.filter((id) => id.toString() !== userId);
  } else {
    // Like: add user to likedBy array
    blog.likedBy.push(userObjectId);
  }

  // Update likes count based on array length
  blog.likes = blog.likedBy.length;

  await blog.save();
  await blog.populate('user', { username: 1, name: 1, avatar: 1 });
  await blog.populate('likedBy', { username: 1, name: 1 });

  getIO().emit('blogUpdated', blog);
  res.json(blog);
});

blogsRouter.patch(
  '/:id',
  middleware.userExtractor,
  middleware.sanitizeAndValidateBlog,
  async (req, res) => {
    const result = await Blog.findByIdAndUpdate(
      req.params.id,
      req.sanitizedBody,
      {
        new: true,
        runValidators: true,
      }
    ).populate('user', { id: 1, name: 1, username: 1, avatar: 1 });

    if (!result) {
      return res.status(404).json({ error: 'No blog found to update' });
    }

    getIO().emit('blogUpdated', result); // ✅ Emit update
    res.status(200).json(result);
  }
);

module.exports = blogsRouter;
