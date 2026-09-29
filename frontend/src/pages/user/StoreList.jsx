import React, { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import StarRating from '../../components/common/StarRating';
import api from '../../api/axios';

const UserStoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.address) params.append('address', filters.address);
      
      const res = await api.get(`/stores?${params.toString()}`);
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

  const handleRatingSubmit = async (storeId, ratingValue, hasExistingRating) => {
    try {
      if (hasExistingRating) {
        await api.put(`/stores/${storeId}/ratings`, { ratingValue });
      } else {
        await api.post(`/stores/${storeId}/ratings`, { ratingValue });
      }
      fetchStores();
    } catch (err) {
      console.error('Failed to submit rating', err);
      alert(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  const columns = [
    { key: 'name', label: 'Store Name' },
    { key: 'address', label: 'Address' },
    { 
      key: 'averageRating', 
      label: 'Overall Rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StarRating value={Math.round(row.averageRating || 0)} readonly={true} />
          <span style={{ fontSize: '0.875rem' }}>({(row.averageRating || 0).toFixed(1)})</span>
        </div>
      )
    },
    {
      key: 'myRating',
      label: 'Your Rating',
      sortable: false,
      render: (row) => (
        <StarRating 
          value={row.myRating || 0} 
          onChange={(val) => handleRatingSubmit(row.id, val, row.myRating !== null)} 
        />
      )
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Stores</h2>
      
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <input className="form-input" placeholder="Search by Name" name="name" value={filters.name} onChange={handleFilterChange} />
          <input className="form-input" placeholder="Search by Address" name="address" value={filters.address} onChange={handleFilterChange} />
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

export default UserStoreList;
