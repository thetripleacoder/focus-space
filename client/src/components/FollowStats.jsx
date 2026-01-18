import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import userService from '../services/users';
import FollowList from './FollowList';

const FollowStats = ({ userId, username }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'followers' or 'following'

  const { data: stats, isLoading } = useQuery({
    queryKey: ['followStats', userId],
    queryFn: () => userService.getFollowStats(userId),
    enabled: !!userId,
  });

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };

  if (isLoading || !stats) {
    return (
      <Box display='flex' gap={3}>
        <Typography variant='body2' color='text.secondary'>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box display='flex' gap={3}>
        <Box
          onClick={() => handleOpenDialog('followers')}
          sx={{
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <Typography variant='body2' fontWeight='bold'>
            {stats.followersCount}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Followers
          </Typography>
        </Box>

        <Box
          onClick={() => handleOpenDialog('following')}
          sx={{
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <Typography variant='body2' fontWeight='bold'>
            {stats.followingCount}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Following
          </Typography>
        </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'followers' ? 'Followers' : 'Following'} - {username}
        </DialogTitle>
        <DialogContent>
          <FollowList userId={userId} type={dialogType} />
        </DialogContent>
      </Dialog>
    </>
  );
};

FollowStats.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default FollowStats;
