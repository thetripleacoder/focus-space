const Blog = require('../models/blog');
const blogsRouter = require('express').Router();
require('express-async-errors');

blogsRouter.get('/', async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });

  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  if (request.body.title !== undefined) {
    const blog = new Blog({ ...request.body, user: request.user._id });

    // blog.save().then((result) => {
    //   response.status(201).json(result);
    // });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } else {
    response.status(400).json({
      message: 'Missing title, cannot add blog',
    });
  }
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json({
      message: 'successfully retrieved blog',
      data: blog,
    });
  } else {
    response.status(404).json({
      message: 'no blog found to retrieve',
    });
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  // console.log(request.user);
  if (blog) {
    if (blog.user.toString() === request.user.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({
        error: 'cannot delete blog, unauthorized user',
      });
    }
  } else {
    response.status(404).json({
      error: 'no blog found to delete',
    });
  }
});

blogsRouter.patch('/:id', async (request, response) => {
  let result = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
  });
  response.status(200).json(result).end();
});

blogsRouter.put('/:id', async (request, response) => {
  // console.log(request.params);
  let result = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
  });
  response.status(200).json(result).end();
});
module.exports = blogsRouter;
