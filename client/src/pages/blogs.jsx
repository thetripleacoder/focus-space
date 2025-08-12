import { useSelector } from 'react-redux';
import BlogList from '../components/BlogList';
import CreateBlog from './createBlog';

export default function Blogs() {
  const blogs = useSelector((state) => state.blogs);
  return (
    <>
      <CreateBlog />
      <BlogList blogs={blogs} />
    </>
  );
}
