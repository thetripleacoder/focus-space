import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  };
  return (
    notification && (
      <Alert
        severity={notification.type === 'success' ? 'success' : 'error'}
        className='rounded-md shadow-sm'
      >
        {notification.content}
      </Alert>
    )
  );
};

export default Notification;
