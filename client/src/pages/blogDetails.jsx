import Blog from '../components/BlogCard';
import { useMatch } from 'react-router-dom';
import { useBlog } from '../hooks';

export default function BlogDetails() {
  const selectedBlogId = useMatch('/blogs/:id')?.params.id;
  const { data: blog, isLoading, error } = useBlog(selectedBlogId);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-64'>
        <div className='text-lg'>Loading blog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-64'>
        <div className='text-red-500'>Error loading blog: {error.message}</div>
      </div>
    );
  }

  return blog && <Blog selectedBlog={blog} />;
}
