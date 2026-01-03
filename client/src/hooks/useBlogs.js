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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blog }) => blogService.update(id, blog),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: blogKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};
