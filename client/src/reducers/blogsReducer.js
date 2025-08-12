import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { initializeUsers } from './userReducer';
const initialState = [];
const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },

    addBlog(state, action) {
      state = [...state, action.payload]; // ✅ triggers re-render
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
  dispatch(initializeBlogs()); // refresh blogs
  dispatch(initializeUsers());
};

export const likeBlog = (blog) => async (dispatch) => {
  const updatedBlog = { ...blog, likes: blog.likes + 1 };
  const result = await blogService.update(blog.id, updatedBlog);
  // console.log('likeBlog', result);
  if (result) {
    dispatch(updateBlog(updatedBlog));
    dispatch(initializeBlogs());
  }
};

export const addCommentBlog = (blog) => async (dispatch) => {
  const result = await blogService.update(blog.id, blog);
  // console.log('likeBlog', result);
  if (result) {
    dispatch(updateBlog(blog));
    dispatch(initializeBlogs());
  }
};

export const deleteBlog = (id) => async (dispatch) => {
  await blogService.remove(id);
  dispatch(removeBlog(id));
};

export default blogSlice.reducer;
