import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
// import { initializeUsers } from './userReducer';
import { sanitizeBlogForUpdate } from '../utils/sanitizeBlogForUpdate';
import socket from '../socket';

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
        state.push(action.payload); // Immer handles this safely
      }
    },

    updateBlog(state, action) {
      // console.log('dispatch updateBlog', action.payload);
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
      state.sort((a, b) => b.likes - a.likes); // mutate state in-place
    },
    resetBlogs() {
      return initialState;
    },
  },
});

export const {
  setBlogs,
  setSelectedBlog,
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
  // console.log(userId);
  if (userId) {
    dispatch(setBlogs(blogs));
    dispatch(markUserBlogs(userId));
    dispatch(sortByLikes());
    // console.log(getState());
  }
};

// export const refreshBlogList = () => async (dispatch, getState) => {
//   const userId = getState().user?.id;
//   // console.log(userId);
//   const blogs = await blogService.getAll();
//   dispatch(setBlogs(blogs));
//   dispatch(markUserBlogs(userId));
//   dispatch(sortByLikes());
// };

export const createBlog = (blog) => async (dispatch) => {
  const newBlog = await blogService.create(blog);
  dispatch(addBlog(newBlog));
  socket.emit('blogCreated', newBlog);
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
    socket.emit('blogUpdated', result);
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
    socket.emit('blogUpdated', result);
  }
};

export const updateBlogThunk = (blog) => async (dispatch) => {
  // Sanitize before sending to API
  const sanitized = sanitizeBlogForUpdate(blog);

  try {
    const result = await blogService.update(blog.id, sanitized);

    if (result) {
      dispatch(updateBlog(result)); // update local state
      socket.emit('blogUpdated', result); // notify collaborators in real-time
    }
  } catch (error) {
    console.error('Failed to update blog:', error);
    // optional: trigger a notification here
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  await blogService.remove(id);
  dispatch(removeBlog(id));
  socket.emit('blogDeleted', id);
};

export default blogSlice.reducer;
