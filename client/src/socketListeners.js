// socketListeners.js
import socket from './socket';
import { initializeUsers } from './reducers/userReducer';
import { showNotification } from './reducers/notificationReducer';

export const registerSocketListeners = (dispatch, queryClient) => {
  socket.on('blogCreated', () => {
    // Invalidate blogs list query to refetch data
    queryClient.invalidateQueries({ queryKey: ['blogs', 'list'] });
  });

  socket.on('blogUpdated', (blog) => {
    // Invalidate blogs list and specific blog detail
    queryClient.invalidateQueries({ queryKey: ['blogs', 'list'] });
    queryClient.invalidateQueries({ queryKey: ['blogs', 'detail', blog.id] });
  });

  socket.on('blogDeleted', (id) => {
    // Invalidate blogs list query
    queryClient.invalidateQueries({ queryKey: ['blogs', 'list'] });
    // Remove from cache
    queryClient.removeQueries({ queryKey: ['blogs', 'detail', id] });
  });

  socket.on('userLoggedIn', (user) => {
    console.log(`${user.username} just logged in`);
    // Optionally update user list or show toast
    dispatch(initializeUsers()); // Refresh user list if needed
    dispatch(showNotification(`${user.username} just logged in`, 'info'));
  });

  // Note: Tool-related socket events removed - relying on optimistic updates
  // for personal productivity tools (tasks, journal) instead of real-time sync
};
