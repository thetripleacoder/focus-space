const Blog = require('../models/blog');
const blogsRouter = require('express').Router();
require('express-async-errors');

// Get all blogs with user and likedBy populated
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('likedBy', { username: 1, name: 1 });

  response.json(blogs);
});

// Create new blog
blogsRouter.post('/', async (request, response) => {
  const { title, author, url, genres } = request.body;

  if (!title || typeof title !== 'string') {
    return response.status(400).json({ error: 'Missing or invalid title' });
  }
  console.log('blogsRouter post', request.user);

  const blog = new Blog({
    title,
    author,
    url,
    genres: genres || [],
    user: request.user.id,
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

// Get single blog by ID
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
    .populate('likedBy', { username: 1, name: 1 });

  if (blog) {
    response.json({ message: 'Successfully retrieved blog', data: blog });
  } else {
    response.status(404).json({ error: 'No blog found to retrieve' });
  }
});

// Delete blog (only if owner)
blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'No blog found to delete' });
  }

  if (blog.user.toString() !== request.user.id.toString()) {
    return response
      .status(401)
      .json({ error: 'Unauthorized to delete this blog' });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

// Update blog (partial)
blogsRouter.patch('/:id', async (request, response) => {
  const updatedFields = request.body;

  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedFields,
    {
      new: true,
      runValidators: true,
    }
  );

  console.log('blogsRouter patch', request.body, result);

  response.status(200).json(result);
});

// Update blog (full)
blogsRouter.put('/:id', async (request, response) => {
  const updatedFields = request.body;

  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedFields,
    {
      new: true,
      runValidators: true,
    }
  );

  response.status(200).json(result);
});

module.exports = blogsRouter;
