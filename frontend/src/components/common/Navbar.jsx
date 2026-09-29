import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar glass">
      <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Store Rating Platform</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>{user?.name} ({user?.role?.replace('_', ' ')})</span>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
