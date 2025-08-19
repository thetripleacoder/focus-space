const Blog = require('../models/blog');
const express = require('express');
const middleware = require('../utils/middleware');
const { getIO } = require('../utils/socketRegistry');
require('express-async-errors');

const blogsRouter = express.Router();

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, avatar: 1 })
    .populate('likedBy', { username: 1, name: 1 });

  res.json(blogs);
});

blogsRouter.post('/', middleware.sanitizeAndValidateBlog, async (req, res) => {
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
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate('user', { username: 1, name: 1, avatar: 1 })
    .populate('likedBy', { username: 1, name: 1, avatar: 1 });

  if (blog) {
    res.json({ message: 'Successfully retrieved blog', data: blog });
  } else {
    res.status(404).json({ error: 'No blog found to retrieve' });
  }
});

blogsRouter.delete('/:id', async (req, res) => {
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

blogsRouter.patch(
  '/:id',
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

blogsRouter.put(
  '/:id',
  middleware.sanitizeAndValidateBlog,
  async (req, res) => {
    const result = await Blog.findByIdAndUpdate(
      req.params.id,
      req.sanitizedBody,
      {
        new: true,
        runValidators: true,
        overwrite: true,
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
