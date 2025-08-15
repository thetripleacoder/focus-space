import { useSelector } from 'react-redux';
import BlogList from '../components/BlogList';
import CreateBlog from './createBlog';

export default function Blogs() {
  const blogs = useSelector((state) => state.blogs);

  // Sort by createdAt descending (newest first)
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <CreateBlog />
      <BlogList blogs={sortedBlogs} />
    </>
  );
}
