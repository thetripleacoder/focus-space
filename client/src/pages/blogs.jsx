import { useState } from 'react';
import { useBlogs } from '../hooks';
import BlogList from '../components/BlogList';
import CreateBlog from './createBlog';

export default function Blogs() {
  const { data: blogs = [], isLoading, error } = useBlogs();

  const [searchTitle, setSearchTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  // Filter by title and genre (genre is an array)
  const filteredBlogs = blogs.filter((blog) => {
    const matchesTitle = blog.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesGenre = selectedGenre
      ? blog.genre?.includes(selectedGenre)
      : true;
    return matchesTitle && matchesGenre;
  });

  // Sort by createdAt
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-64'>
        <div className='text-lg'>Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-64'>
        <div className='text-red-500'>Error loading blogs: {error.message}</div>
      </div>
    );
  }

  return (
    <>
      <CreateBlog />

      {/* 🔍 Filter Controls */}
      <div className='flex justify-center gap-4 items-center my-4'>
        <input
          type='text'
          placeholder='Search by title...'
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className='px-2 py-1 border rounded-md'
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className='px-2 py-1 border rounded-md'
        >
          <option value=''>All Genres</option>
          <option value='productivity'>Productivity</option>
          <option value='focus'>Focus</option>
          <option value='journal'>Journal</option>
          {/* Add more genres as needed */}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className='px-2 py-1 border rounded-md'
        >
          <option value='desc'>Newest First</option>
          <option value='asc'>Oldest First</option>
        </select>
      </div>

      <BlogList blogs={sortedBlogs} />
    </>
  );
}
