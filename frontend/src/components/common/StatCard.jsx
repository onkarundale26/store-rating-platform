import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '2.5rem' }}>{icon}</div>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</div>
        <div style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
