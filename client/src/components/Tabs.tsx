import { NavLink } from 'react-router-dom';

const Tabs = () => (
  <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
    <NavLink to="/" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
      🏠 Home
    </NavLink>
    <NavLink to="/profile" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
      👤 Profile
    </NavLink>
  </nav>
);

export default Tabs;
