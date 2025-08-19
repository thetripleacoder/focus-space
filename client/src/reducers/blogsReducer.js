import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { sanitizeBlogForUpdate } from '../utils/sanitizeBlogForUpdate';

const initialState = [];

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      const exists = state.some((blog) => blog.id === action.payload.id);
      if (!exists) {
        state.push(action.payload);
      }
    },
    updateBlog(state, action) {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      );
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
    markUserBlogs(state, action) {
      const userId = action.payload;
      return state.map((blog) =>
        blog.user.id === userId
          ? { ...blog, isAddedByUser: true }
          : { ...blog, isAddedByUser: false }
      );
    },
    sortByLikes(state) {
      state.sort((a, b) => b.likes - a.likes);
    },
    resetBlogs() {
      return initialState;
    },
  },
});

export const {
  setBlogs,
  addBlog,
  updateBlog,
  removeBlog,
  sortByLikes,
  markUserBlogs,
  resetBlogs,
} = blogSlice.actions;

// 🔄 Async Thunks

export const initializeBlogs = () => async (dispatch, getState) => {
  const userId = getState().user?.loggedUser.id;
  const blogs = await blogService.getAll();
  if (userId) {
    dispatch(setBlogs(blogs));
    dispatch(markUserBlogs(userId));
    dispatch(sortByLikes());
  }
};

export const createBlog = (blog) => async (dispatch) => {
  const newBlog = await blogService.create(blog);
  dispatch(addBlog(newBlog));
};

export const likeBlog = (blog) => async (dispatch) => {
  const sanitized = sanitizeBlogForUpdate(blog);
  const updatedBlog = {
    ...sanitized,
    likes: (blog.likes || 0) + 1,
  };
  const result = await blogService.update(blog.id, updatedBlog);
  if (result) {
    dispatch(updateBlog(result));
  }
};

export const addCommentBlog = (blog, newComment, user) => async (dispatch) => {
  if (!newComment?.trim()) return;

  const cleanedComments =
    blog.comments?.filter((comment) => comment?.text?.trim()) || [];

  const sanitized = sanitizeBlogForUpdate(blog);
  const updatedBlog = {
    ...sanitized,
    comments: [
      ...cleanedComments,
      {
        text: newComment.trim(),
        author: user.username,
        date: new Date().toISOString(),
      },
    ],
  };

  const result = await blogService.update(blog.id, updatedBlog);
  if (result) {
    dispatch(updateBlog(result));
  }
};

export const updateBlogThunk = (blog) => async (dispatch) => {
  const sanitized = sanitizeBlogForUpdate(blog);
  try {
    const result = await blogService.update(blog.id, sanitized);
    if (result) {
      dispatch(updateBlog(result));
    }
  } catch (error) {
    console.error('Failed to update blog:', error);
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  await blogService.remove(id);
  dispatch(removeBlog(id));
};

export default blogSlice.reducer;
