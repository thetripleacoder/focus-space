import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

const UserList = ({ users }) => {
  return (
    <div className='mt-4 px-4'>
      <h1 className='text-2xl font-bold text-gray-900 mb-4'>Users</h1>
      <TableContainer component={Paper} className='rounded-xl shadow-sm'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className='font-semibold text-gray-700'>
                User
              </TableCell>
              <TableCell className='font-semibold text-gray-700'>
                Blogs Created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link
                    to={`/users/${user.id}`}
                    className='text-blue-600 hover:underline'
                  >
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>{user.blogCount || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default UserList;

UserList.propTypes = {
  users: PropTypes.array.isRequired,
};
