import { useRef } from 'react';
import BlogForm from '../components/BlogForm';

export default function CreateBlog() {
  const blogFormRef = useRef();
  return <BlogForm toggleRef={blogFormRef} />;
}
