// socketListeners.js
import socket from './socket';
import { addBlog, updateBlog, removeBlog } from './reducers/blogsReducer';
import { initializeUsers } from './reducers/userReducer';
import { showNotification } from './reducers/notificationReducer';

export const registerSocketListeners = (dispatch) => {
  socket.on('blogCreated', (blog) => dispatch(addBlog(blog)));
  socket.on('blogUpdated', (blog) => dispatch(updateBlog(blog)));
  socket.on('blogDeleted', (id) => dispatch(removeBlog(id)));

  socket.on('userLoggedIn', (user) => {
    console.log(`${user.username} just logged in`);
    // Optionally update user list or show toast
    dispatch(initializeUsers()); // Refresh user list if needed
    dispatch(showNotification(`${user.username} just logged in`, 'info'));
  });
};
