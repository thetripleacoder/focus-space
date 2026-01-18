import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import { initializeUsers, setUser, logout } from './reducers/userReducer';
import blogService from './services/blogs';
import { loadFromLocalStorage } from './services/localStorage';
import { Navigate, Route, Routes } from 'react-router-dom';
import Blogs from './pages/blogs';
import Users from './pages/users';
import BlogDetails from './pages/blogDetails';
import UserProfile from './pages/userProfile';
import AppLayout from './components/AppLayout';
import socket from './socket';
import OtherUserProfile from './pages/otherUserProfile';
import RegisterForm from './components/RegisterForm';
import { registerSocketListeners } from './socketListeners';

const App = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const loggedUser = useSelector((state) => state.user?.loggedUser ?? null);

  // 🔐 Initial login from localStorage
  useEffect(() => {
    const storedUser = loadFromLocalStorage('focus-space-loggedUser');
    if (storedUser && storedUser.token) {
      dispatch(setUser(storedUser));
      blogService.setToken(storedUser.token);
    }
  }, [dispatch]);

  // 🔄 Sync login/logout across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'focus-space-loggedUser') {
        const newUser = event.newValue ? JSON.parse(event.newValue) : null;

        if (newUser?.token) {
          dispatch(setUser(newUser));
          blogService.setToken(newUser.token);
          // Set tokens for tool services
          import('./services/tasks').then((tasks) =>
            tasks.default.setToken(newUser.token),
          );
          import('./services/journal').then((journal) =>
            journal.default.setToken(newUser.token),
          );
          import('./services/pomodoro').then((pomodoro) =>
            pomodoro.default.setToken(newUser.token),
          );
        } else {
          dispatch(logout());
          blogService.setToken(null);
          // Clear tokens for tool services
          import('./services/tasks').then((tasks) =>
            tasks.default.setToken(null),
          );
          import('./services/journal').then((journal) =>
            journal.default.setToken(null),
          );
          import('./services/pomodoro').then((pomodoro) =>
            pomodoro.default.setToken(null),
          );
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  // 📦 Load data after login
  useEffect(() => {
    if (loggedUser?.token) {
      blogService.setToken(loggedUser.token);
      // Set tokens for tool services
      import('./services/tasks').then((tasks) =>
        tasks.default.setToken(loggedUser.token),
      );
      import('./services/journal').then((journal) =>
        journal.default.setToken(loggedUser.token),
      );
      import('./services/pomodoro').then((pomodoro) =>
        pomodoro.default.setToken(loggedUser.token),
      );
      import('./services/users').then((users) =>
        users.default.setToken(loggedUser.token),
      );
      dispatch(initializeUsers());
    }
  }, [loggedUser, dispatch]);

  // 🔌 Socket setup
  useEffect(() => {
    if (!loggedUser?.token) return;
    if (!socket.connected) socket.connect();

    registerSocketListeners(dispatch, queryClient);

    return () => {
      socket.off('blogCreated');
      socket.off('blogUpdated');
      socket.off('blogDeleted');
      socket.off('userLoggedIn');
      socket.disconnect();
    };
  }, [loggedUser, dispatch, queryClient]);

  return (
    <div className='w-full bg-white'>
      {!loggedUser ? (
        <Routes>
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      ) : (
        <AppLayout>
          <Notification />
          <Routes>
            <Route path='/home' element={<Blogs />} />
            <Route path='/blogs/:id' element={<BlogDetails />} />
            <Route path='/users/:id' element={<OtherUserProfile />} />
            <Route path='/users' element={<Users />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path='*' element={<Navigate to='/home' replace />} />
          </Routes>
        </AppLayout>
      )}
    </div>
  );
};

export default App;
