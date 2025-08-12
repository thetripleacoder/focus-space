// src/store.js
import { configureStore } from '@reduxjs/toolkit';
// import anecdoteReducer from './reducers/anecdoteReducer';
import notificationReducer from './reducers/notificationReducer';
import blogsReducer from './reducers/blogsReducer';
import userReducer from './reducers/userReducer';
// import filterReducer from './reducers/filterReducer';

const store = configureStore({
  reducer: {
    // anecdotes: anecdoteReducer,
    notification: notificationReducer,
    blogs: blogsReducer,
    user: userReducer,
    // filter: filterReducer,
  },
});

export default store;
