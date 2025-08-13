import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../reducers/userReducer';
import { removeFromLocalStorage } from '../services/localStorage';
import { resetBlogs } from '../reducers/blogsReducer';

const Menu = () => {
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
    <AppBar position='static' className=' shadow-md'>
      <Toolbar className='flex justify-between items-center px-4'>
        {/* Left: Logo */}
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm'>
            F
          </div>
          <span className='text-lg font-semibold text-gray-800'>FaceBlog</span>
        </div>

        {/* Right: Navigation Tabs */}
        <div className='flex items-center gap-6'>
          <Button
            color='inherit'
            component={Link}
            to='/'
            className='text-gray-700 font-medium hover:text-blue-600 transition'
          >
            Home
          </Button>

          {loggedUser ? (
            <>
              <Button
                color='inherit'
                component={Link}
                to='/profile'
                className='text-gray-700 font-medium hover:text-blue-600 transition'
              >
                Profile
              </Button>
              <Button
                color='inherit'
                onClick={handleLogout}
                className='text-red-500 font-medium hover:text-red-600 transition'
              >
                Logout
              </Button>
            </>
          ) : (
            <Link
              to='/login'
              className='text-blue-600 font-medium hover:underline'
            >
              Login
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
