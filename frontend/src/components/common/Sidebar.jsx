import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { path: '/admin/dashboard', label: '📊 Dashboard' },
          { path: '/admin/users', label: '👥 Users' },
          { path: '/admin/stores', label: '🏪 Stores' },
        ];
      case 'NORMAL_USER':
        return [
          { path: '/stores', label: '🏪 Stores' },
          { path: '/change-password', label: '🔒 Change Password' },
        ];
      case 'STORE_OWNER':
        return [
          { path: '/owner/dashboard', label: '📊 Dashboard' },
          { path: '/change-password', label: '🔒 Change Password' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="sidebar">
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: location.pathname === link.path || (link.path !== '/admin/dashboard' && location.pathname.startsWith(link.path)) ? 'var(--accent-color)' : 'transparent',
              color: location.pathname === link.path || (link.path !== '/admin/dashboard' && location.pathname.startsWith(link.path)) ? '#fff' : 'var(--text-main)',
              fontWeight: location.pathname === link.path || (link.path !== '/admin/dashboard' && location.pathname.startsWith(link.path)) ? '600' : '400',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
