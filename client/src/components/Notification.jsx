import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    if (notification) {
      const { type, content } = notification;
      if (type === 'success') {
        toast.success(content);
      } else {
        toast.error(content);
      }
    }
  }, [notification]);

  return (
    <ToastContainer position='bottom-right' autoClose={3000} hideProgressBar />
  );
};

export default Notification;
