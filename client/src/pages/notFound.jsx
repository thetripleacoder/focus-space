import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-100 text-center animate-fade-in'>
      <h1 className='text-7xl font-bold text-red-500'>404</h1>
      <div className='text-2xl font-mono mt-2 animate-glitch'>
        Page Not Found
      </div>
      <p className='mt-4 text-lg max-w-md'>
        The tool you&apos;re looking for might&apos;ve been unregistered,
        collapsed, or socket-disconnected.
      </p>
      <Link
        to='/'
        className='mt-6 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-red-500 transition-colors duration-300 font-semibold'
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
