import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import api from '../../api/axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.email) params.append('email', filters.email);
      if (filters.address) params.append('address', filters.address);
      if (filters.role) params.append('role', filters.role);
      
      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'role', label: 'Role' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Manage Users</h2>
        <Link to="/admin/users/add" className="btn btn-primary">Add User</Link>
      </div>
      
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <input className="form-input" placeholder="Filter by Name" name="name" value={filters.name} onChange={handleFilterChange} />
          <input className="form-input" placeholder="Filter by Email" name="email" value={filters.email} onChange={handleFilterChange} />
          <input className="form-input" placeholder="Filter by Address" name="address" value={filters.address} onChange={handleFilterChange} />
          <select className="form-input" name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={users} 
          onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
        />
      )}
    </div>
  );
};

export default UserList;
