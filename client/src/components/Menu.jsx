import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../reducers/userReducer';
import { removeFromLocalStorage } from '../services/localStorage';
import { useNavigate } from 'react-router-dom';
import { resetBlogs } from '../reducers/blogsReducer';

const Menu = () => {
  // const padding = {
  //   paddingRight: 5,
  // };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loggedUser = useSelector((state) => state.user?.loggedUser ?? null);

  const handleLogout = () => {
    removeFromLocalStorage('loggedUser');
    dispatch(logoutUser());
    dispatch(resetBlogs());
    navigate('/');
  };

  return (
    <AppBar position='static' className=' shadow-sm'>
      <Toolbar className='flex justify-between'>
        <div className='flex gap-4'>
          <Button
            color='inherit'
            component={Link}
            to='/'
            className='text-gray-800 font-medium'
          >
            Blogs
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/users'
            className='text-gray-800 font-medium'
          >
            Users
          </Button>
        </div>
        {loggedUser ? (
          <div className='flex items-center gap-4'>
            <p className='text-sm text-gray-600'>{loggedUser.name} Logged In</p>
            <Button
              color='inherit'
              onClick={handleLogout}
              className='text-red-500 font-medium'
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link to='/login' className='text-blue-600 font-medium'>
            Login
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
