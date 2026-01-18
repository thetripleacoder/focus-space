import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import userService from '../services/users';

const FollowList = ({ userId, type }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [type, userId],
    queryFn: () =>
      type === 'followers'
        ? userService.getFollowers(userId)
        : userService.getFollowing(userId),
    enabled: !!userId && !!type,
  });

  if (isLoading) {
    return (
      <Box p={2}>
        <Typography variant='body2' color='text.secondary'>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography variant='body2' color='error'>
          Failed to load {type}
        </Typography>
      </Box>
    );
  }

  if (!data || data[type]?.length === 0) {
    return (
      <Box p={2}>
        <Typography variant='body2' color='text.secondary'>
          No {type} yet
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {data[type].map((user) => (
        <ListItem
          key={user.id}
          component={Link}
          to={`/users/${user.id}`}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemAvatar>
            <Avatar src={user.avatar} alt={user.username}>
              {user.username?.charAt(0).toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant='subtitle2' fontWeight='bold'>
                {user.username}
              </Typography>
            }
            secondary={user.name}
          />
        </ListItem>
      ))}
    </List>
  );
};

FollowList.propTypes = {
  userId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['followers', 'following']).isRequired,
};

export default FollowList;
