import { useMutation } from '@tanstack/react-query';
import loginService from '../services/login';
import userService from '../services/users';

// Query keys
export const authKeys = {
  all: ['auth'],
  login: () => [...authKeys.all, 'login'],
  register: () => [...authKeys.all, 'register'],
};

// Custom hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: loginService.login,
    onSuccess: (data) => {
      // Token will be set in the component after successful login
      return data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: userService.create,
    onSuccess: (data) => {
      return data;
    },
  });
};
