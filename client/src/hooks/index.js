import { useState } from 'react';

// Blog hooks
export {
  useBlogs,
  useBlog,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
  blogKeys,
} from './useBlogs';

// Auth hooks
export { useLogin, useRegister, authKeys } from './useAuth';

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => setValue('');

  return {
    inputProps: { type, value, onChange },
    reset,
  };
};
