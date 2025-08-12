import { NavLink } from 'react-router-dom';

const Tabs = () => (
  <nav className='flex gap-6 px-6 py-4 bg-white shadow-sm'>
    <NavLink
      to='/'
      className={({ isActive }) =>
        `text-gray-700 hover:text-blue-600 font-medium transition ${
          isActive ? 'font-bold text-blue-600' : ''
        }`
      }
    >
      🏠 Home
    </NavLink>
    <NavLink
      to='/profile'
      className={({ isActive }) =>
        `text-gray-700 hover:text-blue-600 font-medium transition ${
          isActive ? 'font-bold text-blue-600' : ''
        }`
      }
    >
      👤 Profile
    </NavLink>
  </nav>
);

export default Tabs;
