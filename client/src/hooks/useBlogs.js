import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs';

// Query keys
export const blogKeys = {
  all: ['blogs'],
  lists: () => [...blogKeys.all, 'list'],
  list: (filters) => [...blogKeys.lists(), filters],
  details: () => [...blogKeys.all, 'detail'],
  detail: (id) => [...blogKeys.details(), id],
};

// Custom hooks
export const useBlogs = () => {
  return useQuery({
    queryKey: blogKeys.lists(),
    queryFn: blogService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBlog = (id) => {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => blogService.getOne(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogService.create,
    onMutate: async (newBlog) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() });

      // Snapshot previous value for rollback
      const previousBlogs = queryClient.getQueryData(blogKeys.lists());

      // Generate temporary blog with optimistic data
      const optimisticBlog = {
        ...newBlog,
        id: `temp-${Date.now()}`, // Temporary ID
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        user: queryClient.getQueryData(['user'])?.loggedUser || {
          id: 'temp-user',
          name: 'You',
          username: 'temp-user',
        },
      };

      // Optimistically update cache
      queryClient.setQueryData(blogKeys.lists(), (old) => [
        optimisticBlog,
        ...(old || []),
      ]);

      return { previousBlogs, optimisticBlog };
    },
    onError: (err, newBlog, context) => {
      // Rollback on error
      if (context?.previousBlogs) {
        queryClient.setQueryData(blogKeys.lists(), context.previousBlogs);
      }
    },
    onSettled: () => {
      // Always refetch after mutation to get real data
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
    onMutate: async ({ id, blog }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() });
      await queryClient.cancelQueries({ queryKey: blogKeys.detail(id) });

      // Snapshot previous values for rollback
      const previousBlogs = queryClient.getQueryData(blogKeys.lists());
      const previousBlogDetail = queryClient.getQueryData(blogKeys.detail(id));

      // Optimistically update blogs list
      queryClient.setQueryData(
        blogKeys.lists(),
        (old) => old?.map((b) => (b.id === id ? { ...b, ...blog } : b)) || []
      );

      // Optimistically update blog detail
      queryClient.setQueryData(blogKeys.detail(id), (old) =>
        old ? { ...old, ...blog } : blog
      );

      return { previousBlogs, previousBlogDetail };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousBlogs) {
        queryClient.setQueryData(blogKeys.lists(), context.previousBlogs);
      }
      if (context?.previousBlogDetail) {
        queryClient.setQueryData(
          blogKeys.detail(id),
          context.previousBlogDetail
        );
      }
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogService.remove,
    onMutate: async (blogId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() });

      // Snapshot previous value for rollback
      const previousBlogs = queryClient.getQueryData(blogKeys.lists());

      // Find the blog being deleted for potential undo
      const deletedBlog = previousBlogs?.find((blog) => blog.id === blogId);

      // Optimistically remove from cache
      queryClient.setQueryData(
        blogKeys.lists(),
        (old) => old?.filter((blog) => blog.id !== blogId) || []
      );

      return { previousBlogs, deletedBlog };
    },
    onError: (err, blogId, context) => {
      // Rollback on error - restore the deleted blog
      if (context?.previousBlogs) {
        queryClient.setQueryData(blogKeys.lists(), context.previousBlogs);
      }
    },
    onSettled: () => {
      // Always refetch after mutation to ensure consistency
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

export const useLikeBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogId }) => blogService.like(blogId),
    onMutate: async ({ blogId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() });
      await queryClient.cancelQueries({ queryKey: blogKeys.detail(blogId) });

      // Snapshot previous values for rollback
      const previousBlogs = queryClient.getQueryData(blogKeys.lists());
      const previousBlogDetail = queryClient.getQueryData(
        blogKeys.detail(blogId)
      );

      // Get current user
      const currentUser = queryClient.getQueryData(['user'])?.loggedUser;
      const userId = currentUser?.id;

      // Optimistically toggle like status
      queryClient.setQueryData(
        blogKeys.lists(),
        (old) =>
          old?.map((blog) => {
            if (blog.id === blogId) {
              const currentlyLiked = blog.likedBy?.some(
                (user) => user.id === userId
              );
              if (currentlyLiked) {
                // Unlike: remove user and decrement count
                return {
                  ...blog,
                  likedBy: blog.likedBy.filter((user) => user.id !== userId),
                  likes: Math.max(0, (blog.likes || 0) - 1),
                };
              } else {
                // Like: add user and increment count
                return {
                  ...blog,
                  likedBy: [...(blog.likedBy || []), currentUser],
                  likes: (blog.likes || 0) + 1,
                };
              }
            }
            return blog;
          }) || []
      );

      // Update blog detail if it exists
      queryClient.setQueryData(blogKeys.detail(blogId), (old) => {
        if (!old) return old;

        const currentlyLiked = old.likedBy?.some((user) => user.id === userId);
        if (currentlyLiked) {
          // Unlike: remove user and decrement count
          return {
            ...old,
            likedBy: old.likedBy.filter((user) => user.id !== userId),
            likes: Math.max(0, (old.likes || 0) - 1),
          };
        } else {
          // Like: add user and increment count
          return {
            ...old,
            likedBy: [...(old.likedBy || []), currentUser],
            likes: (old.likes || 0) + 1,
          };
        }
      });

      return { previousBlogs, previousBlogDetail };
    },
    onError: (err, { blogId }, context) => {
      // Rollback on error
      if (context?.previousBlogs) {
        queryClient.setQueryData(blogKeys.lists(), context.previousBlogs);
      }
      if (context?.previousBlogDetail) {
        queryClient.setQueryData(
          blogKeys.detail(blogId),
          context.previousBlogDetail
        );
      }
    },
    onSettled: (data, error, { blogId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(blogId) });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogId, comment }) =>
      blogService.addComment(blogId, comment),
    onMutate: async ({ blogId, comment }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() });
      await queryClient.cancelQueries({ queryKey: blogKeys.detail(blogId) });

      // Snapshot previous values for rollback
      const previousBlogs = queryClient.getQueryData(blogKeys.lists());
      const previousBlogDetail = queryClient.getQueryData(
        blogKeys.detail(blogId)
      );

      // Get current user for optimistic comment
      const currentUser = queryClient.getQueryData(['user'])?.loggedUser;

      // Create optimistic comment
      const optimisticComment = {
        text: comment.trim(),
        author: currentUser?.username || 'Anonymous',
        date: new Date().toISOString(),
      };

      // Optimistically add comment
      queryClient.setQueryData(
        blogKeys.lists(),
        (old) =>
          old?.map((blog) =>
            blog.id === blogId
              ? {
                  ...blog,
                  comments: [...(blog.comments || []), optimisticComment],
                }
              : blog
          ) || []
      );

      // Update blog detail if it exists
      queryClient.setQueryData(blogKeys.detail(blogId), (old) =>
        old
          ? {
              ...old,
              comments: [...(old.comments || []), optimisticComment],
            }
          : old
      );

      return { previousBlogs, previousBlogDetail, optimisticComment };
    },
    onError: (err, { blogId }, context) => {
      // Rollback on error
      if (context?.previousBlogs) {
        queryClient.setQueryData(blogKeys.lists(), context.previousBlogs);
      }
      if (context?.previousBlogDetail) {
        queryClient.setQueryData(
          blogKeys.detail(blogId),
          context.previousBlogDetail
        );
      }
    },
    onSettled: (data, error, { blogId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(blogId) });
    },
  });
};
