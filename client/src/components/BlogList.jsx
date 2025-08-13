import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Blog from './Blog';

const BlogList = ({ blogs }) => {
  return (
    <div>
      <Typography variant='h3' component='h3'>
        Blogs
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
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
