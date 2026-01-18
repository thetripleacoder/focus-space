import { Button, CircularProgress } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import userService from '../services/users';

const FollowButton = ({ targetUserId, currentUserId, onFollowChange }) => {
  const queryClient = useQueryClient();

  // Get followers list to check if current user is following
  const { data: followersData, isLoading: followersLoading } = useQuery({
    queryKey: ['followers', targetUserId],
    queryFn: () => userService.getFollowers(targetUserId),
    enabled: !!targetUserId,
  });

  const followMutation = useMutation({
    mutationFn: userService.follow,
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['followStats', targetUserId],
      });
      await queryClient.cancelQueries({
        queryKey: ['followStats', currentUserId],
      });
      await queryClient.cancelQueries({
        queryKey: ['followers', targetUserId],
      });
      await queryClient.cancelQueries({
        queryKey: ['following', currentUserId],
      });

      // Snapshot previous values
      const previousFollowStatsTarget = queryClient.getQueryData([
        'followStats',
        targetUserId,
      ]);
      const previousFollowStatsCurrent = queryClient.getQueryData([
        'followStats',
        currentUserId,
      ]);
      const previousFollowers = queryClient.getQueryData([
        'followers',
        targetUserId,
      ]);
      const previousFollowing = queryClient.getQueryData([
        'following',
        currentUserId,
      ]);

      // Optimistically update followStats
      if (previousFollowStatsTarget) {
        queryClient.setQueryData(['followStats', targetUserId], {
          ...previousFollowStatsTarget,
          followersCount: previousFollowStatsTarget.followersCount + 1,
        });
      }
      if (previousFollowStatsCurrent) {
        queryClient.setQueryData(['followStats', currentUserId], {
          ...previousFollowStatsCurrent,
          followingCount: previousFollowStatsCurrent.followingCount + 1,
        });
      }

      // Optimistically update followers list
      if (previousFollowers) {
        queryClient.setQueryData(['followers', targetUserId], {
          ...previousFollowers,
          followers: [...previousFollowers.followers, { id: currentUserId }],
          count: previousFollowers.count + 1,
        });
      }

      // Optimistically update following list
      if (previousFollowing) {
        queryClient.setQueryData(['following', currentUserId], {
          ...previousFollowing,
          following: [...previousFollowing.following, { id: targetUserId }],
          count: previousFollowing.count + 1,
        });
      }

      return {
        previousFollowStatsTarget,
        previousFollowStatsCurrent,
        previousFollowers,
        previousFollowing,
      };
    },
    onError: (err, variables, context) => {
      // Revert on error
      if (context?.previousFollowStatsTarget) {
        queryClient.setQueryData(
          ['followStats', targetUserId],
          context.previousFollowStatsTarget,
        );
      }
      if (context?.previousFollowStatsCurrent) {
        queryClient.setQueryData(
          ['followStats', currentUserId],
          context.previousFollowStatsCurrent,
        );
      }
      if (context?.previousFollowers) {
        queryClient.setQueryData(
          ['followers', targetUserId],
          context.previousFollowers,
        );
      }
      if (context?.previousFollowing) {
        queryClient.setQueryData(
          ['following', currentUserId],
          context.previousFollowing,
        );
      }
    },
    onSuccess: (data) => {
      // Update with server data for precision
      queryClient.setQueryData(['followStats', targetUserId], (old) =>
        old ? { ...old, followersCount: data.followers } : old,
      );
      queryClient.setQueryData(['followStats', currentUserId], (old) =>
        old ? { ...old, followingCount: data.following } : old,
      );

      // Invalidate lists to ensure they match server
      queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['following', currentUserId] });

      onFollowChange?.();
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: userService.unfollow,
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['followStats', targetUserId],
      });
      await queryClient.cancelQueries({
        queryKey: ['followStats', currentUserId],
      });
      await queryClient.cancelQueries({
        queryKey: ['followers', targetUserId],
      });
      await queryClient.cancelQueries({
        queryKey: ['following', currentUserId],
      });

      // Snapshot previous values
      const previousFollowStatsTarget = queryClient.getQueryData([
        'followStats',
        targetUserId,
      ]);
      const previousFollowStatsCurrent = queryClient.getQueryData([
        'followStats',
        currentUserId,
      ]);
      const previousFollowers = queryClient.getQueryData([
        'followers',
        targetUserId,
      ]);
      const previousFollowing = queryClient.getQueryData([
        'following',
        currentUserId,
      ]);

      // Optimistically update followStats
      if (previousFollowStatsTarget) {
        queryClient.setQueryData(['followStats', targetUserId], {
          ...previousFollowStatsTarget,
          followersCount: Math.max(
            0,
            previousFollowStatsTarget.followersCount - 1,
          ),
        });
      }
      if (previousFollowStatsCurrent) {
        queryClient.setQueryData(['followStats', currentUserId], {
          ...previousFollowStatsCurrent,
          followingCount: Math.max(
            0,
            previousFollowStatsCurrent.followingCount - 1,
          ),
        });
      }

      // Optimistically update followers list
      if (previousFollowers) {
        queryClient.setQueryData(['followers', targetUserId], {
          ...previousFollowers,
          followers: previousFollowers.followers.filter(
            (follower) => follower.id !== currentUserId,
          ),
          count: Math.max(0, previousFollowers.count - 1),
        });
      }

      // Optimistically update following list
      if (previousFollowing) {
        queryClient.setQueryData(['following', currentUserId], {
          ...previousFollowing,
          following: previousFollowing.following.filter(
            (follower) => follower.id !== targetUserId,
          ),
          count: Math.max(0, previousFollowing.count - 1),
        });
      }

      return {
        previousFollowStatsTarget,
        previousFollowStatsCurrent,
        previousFollowers,
        previousFollowing,
      };
    },
    onError: (err, variables, context) => {
      // Revert on error
      if (context?.previousFollowStatsTarget) {
        queryClient.setQueryData(
          ['followStats', targetUserId],
          context.previousFollowStatsTarget,
        );
      }
      if (context?.previousFollowStatsCurrent) {
        queryClient.setQueryData(
          ['followStats', currentUserId],
          context.previousFollowStatsCurrent,
        );
      }
      if (context?.previousFollowers) {
        queryClient.setQueryData(
          ['followers', targetUserId],
          context.previousFollowers,
        );
      }
      if (context?.previousFollowing) {
        queryClient.setQueryData(
          ['following', currentUserId],
          context.previousFollowing,
        );
      }
    },
    onSuccess: (data) => {
      // Update with server data for precision
      queryClient.setQueryData(['followStats', targetUserId], (old) =>
        old ? { ...old, followersCount: data.followers } : old,
      );
      queryClient.setQueryData(['followStats', currentUserId], (old) =>
        old ? { ...old, followingCount: data.following } : old,
      );

      // Invalidate lists to ensure they match server
      queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['following', currentUserId] });

      onFollowChange?.();
    },
  });

  // Don't show button if viewing own profile or if data is loading
  if (targetUserId === currentUserId || followersLoading) {
    return null;
  }

  const isFollowing = followersData?.followers?.some(
    (follower) => follower.id === currentUserId,
  );
  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const handleClick = () => {
    if (isFollowing) {
      unfollowMutation.mutate(targetUserId);
    } else {
      followMutation.mutate(targetUserId);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outlined' : 'contained'}
      onClick={handleClick}
      disabled={isPending}
      startIcon={
        isPending ? <CircularProgress size={16} color='inherit' /> : null
      }
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        px: 3,
      }}
    >
      {isPending ? 'Processing...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};

FollowButton.propTypes = {
  targetUserId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onFollowChange: PropTypes.func,
};

export default FollowButton;
