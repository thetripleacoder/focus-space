import { useRef } from 'react';
import BlogForm from '../components/BlogForm';
import Toggleable from '../components/Toggleable';

export default function CreateBlog() {
  const blogFormRef = useRef();
  return (
    <Toggleable buttonLabel='Create new blog' ref={blogFormRef}>
      <BlogForm toggleRef={blogFormRef} />
    </Toggleable>
  );
}
