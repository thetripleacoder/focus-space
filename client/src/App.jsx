import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import { initializeBlogs } from './reducers/blogsReducer';
import { initializeUsers, setUser } from './reducers/userReducer';
import blogService from './services/blogs';
import { loadFromLocalStorage } from './services/localStorage';
import { Navigate, Route, Routes } from 'react-router-dom';
import Blogs from './pages/blogs';
import Users from './pages/users';
import BlogDetails from './pages/blogDetails';
import UserProfile from './pages/userProfile';
import AppLayout from './components/AppLayout';
import socket from './socket';
import { addBlog, updateBlog, removeBlog } from './reducers/blogsReducer';
import OtherUserProfile from './pages/otherUserProfile';
import RegisterForm from './components/RegisterForm';

const App = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user?.loggedUser ?? null);

  useEffect(() => {
    const storedUser = loadFromLocalStorage('focus-space-loggedUser');
    if (storedUser && storedUser.token) {
      dispatch(setUser(storedUser));
      blogService.setToken(storedUser.token);
    }
  }, [dispatch]);

  useEffect(() => {
    if (loggedUser?.token) {
      blogService.setToken(loggedUser.token);
      dispatch(initializeBlogs());
      dispatch(initializeUsers());
    }
  }, [loggedUser, dispatch]);

  useEffect(() => {
    socket.connect();

    socket.on('blogCreated', (newBlog) => {
      dispatch(addBlog(newBlog));
    });

    socket.on('blogUpdated', (updatedBlog) => {
      dispatch(updateBlog(updatedBlog));
    });

    socket.on('blogDeleted', (deletedId) => {
      dispatch(removeBlog(deletedId));
    });

    return () => {
      socket.off('blogCreated');
      socket.off('blogUpdated');
      socket.off('blogDeleted');
      socket.disconnect();
    };
  }, []);

  return (
    <div className='w-full bg-white'>
      {!loggedUser ? (
        <Routes>
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/login' element={<LoginForm />} />
          {/* Catch-all: redirect to login */}
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
            {/* Catch-all: redirect to home */}
            <Route path='*' element={<Navigate to='/home' replace />} />
          </Routes>
        </AppLayout>
      )}
    </div>
  );
};

export default App;
