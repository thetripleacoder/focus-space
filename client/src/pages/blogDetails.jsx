import { useSelector } from 'react-redux';
import Blog from '../components/Blog';
import { useEffect, useState } from 'react';
import { useMatch } from 'react-router-dom';

export default function BlogDetails() {
  const blogs = useSelector((state) => state.blogs);
  const selectedBlogId = useMatch('/blogs/:id')?.params.id;
  const [selectedBlog, setSelectedBlog] = useState({});

  useEffect(() => {
    if (selectedBlogId && blogs.length) {
      let matchedSelectedBlog = blogs.find(
        (blog) => blog.id === selectedBlogId
      );
      setSelectedBlog(matchedSelectedBlog);
      // console.log(matchedSelectedBlog, blogs);
    }
  }, [blogs, selectedBlogId]);
  return <Blog selectedBlog={selectedBlog} />;
}
