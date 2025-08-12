import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import { initializeBlogs } from './reducers/blogsReducer';
import { initializeUsers, setUser } from './reducers/userReducer';
import blogService from './services/blogs';
import { loadFromLocalStorage } from './services/localStorage';
import Menu from './components/Menu';
import { Route, Routes } from 'react-router-dom';
import Blogs from './pages/blogs';
import Users from './pages/users';
import UserBlogs from './pages/userBlogs';
import { Container } from '@mui/material';
import BlogDetails from './pages/blogDetails';

const App = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user?.loggedUser ?? null);

  useEffect(() => {
    const storedUser = loadFromLocalStorage('loggedUser');
    if (storedUser && storedUser.token) {
      dispatch(setUser(storedUser));
      blogService.setToken(storedUser.token);
    }
  }, [dispatch]);

  useEffect(() => {
    if (loggedUser?.token) {
      blogService.setToken(loggedUser.token); // Optional redundancy
      dispatch(initializeBlogs());
      dispatch(initializeUsers());
    }
  }, [loggedUser, dispatch]);

  return (
    <Container>
      <Menu />

      <Notification />

      <Routes>
        {!loggedUser ? (
          <Route path='/*' element={<LoginForm />} />
        ) : (
          <>
            <Route path='/' element={<Blogs />} />
            <Route path='/blogs/:id' element={<BlogDetails />} />
            <Route path='/users/:id' element={<UserBlogs />} />
            <Route path='/users' element={<Users />} />
            {/* <Route path='/create' element={<CreateBlog />} /> */}
          </>
        )}
      </Routes>
    </Container>
  );
};

export default App;
