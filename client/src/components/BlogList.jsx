import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Blog from './Blog';

const BlogList = ({ blogs }) => {
  return (
    <div className='px-4 py-6'>
      <h1 className='text-2xl font-bold text-gray-900 mb-4'>Blogs</h1>
      <TableContainer component={Paper} className='rounded-xl shadow-sm'>
        <Table>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className='p-4'>
                  <Blog key={blog.id} selectedBlog={blog} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
};

export default BlogList;
