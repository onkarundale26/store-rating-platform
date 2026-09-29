import React, { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import StarRating from '../../components/common/StarRating';
import api from '../../api/axios';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/owner/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  if (!data || !data.store) {
    return (
      <div className="glass-card">
        <h2>Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>You have not been assigned to a store yet. Please contact an administrator.</p>
      </div>
    );
  }

  const columns = [
    { key: 'userName', label: 'User Name' },
    { key: 'userEmail', label: 'User Email' },
    { 
      key: 'ratingValue', 
      label: 'Rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StarRating value={row.ratingValue} readonly={true} />
          <span>({row.ratingValue})</span>
        </div>
      )
    },
    { 
      key: 'submittedAt', 
      label: 'Date',
      render: (row) => new Date(row.submittedAt).toLocaleDateString()
    }
  ];

  return (
    <div>
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{data.store.name}</h2>
          <div style={{ color: 'var(--text-muted)' }}>{data.store.email} • {data.store.address}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Average Rating</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {(data.averageRating || 0).toFixed(1)}
            </span>
            <StarRating value={Math.round(data.averageRating || 0)} readonly={true} />
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Recent Ratings</h3>
      <DataTable columns={columns} data={data.ratings || []} />
    </div>
  );
};

export default OwnerDashboard;
