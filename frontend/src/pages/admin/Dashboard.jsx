import React, { useEffect, useState } from 'react';
import StatCard from '../../components/common/StatCard';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard title="Total Stores" value={stats.totalStores} icon="🏪" />
        <StatCard title="Total Ratings" value={stats.totalRatings} icon="⭐" />
      </div>
    </div>
  );
};

export default AdminDashboard;
