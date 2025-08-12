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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
          ></IconButton>
          {loggedUser ? (
            <>
              <Button color='inherit' component={Link} to='/'>
                Blogs
              </Button>
              <Button color='inherit' component={Link} to='/users'>
                Users
              </Button>
              <Button color='inherit'></Button>
              <Box sx={{ flexGrow: 1 }} />
              <p>{loggedUser.name} Logged In</p>
              <Button color='inherit' onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Menu;
