import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import StarRating from '../../components/common/StarRating';
import api from '../../api/axios';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.address) params.append('address', filters.address);
      
      const res = await api.get(`/admin/stores?${params.toString()}`);
      setStores(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { 
      key: 'averageRating', 
      label: 'Rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StarRating value={Math.round(row.averageRating || 0)} readonly={true} />
          <span style={{ fontSize: '0.875rem' }}>({row.averageRating?.toFixed(1) || '0.0'})</span>
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Manage Stores</h2>
        <Link to="/admin/stores/add" className="btn btn-primary">Add Store</Link>
      </div>
      
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <input className="form-input" placeholder="Filter by Name" name="name" value={filters.name} onChange={handleFilterChange} />
          <input className="form-input" placeholder="Filter by Email" name="email" value={filters.email} onChange={handleFilterChange} />
          <input className="form-input" placeholder="Filter by Address" name="address" value={filters.address} onChange={handleFilterChange} />
        </div>
      </div>

      {loading ? (
        <div>Loading stores...</div>
      ) : (
        <DataTable columns={columns} data={stores} />
      )}
    </div>
  );
};

export default StoreList;
