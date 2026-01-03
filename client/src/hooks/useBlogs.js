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
