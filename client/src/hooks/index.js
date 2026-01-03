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
