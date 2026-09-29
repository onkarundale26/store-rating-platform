import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../../components/common/StarRating';
import api from '../../api/axios';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        &larr; Back
      </button>
      
      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem' }}>User Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><strong style={{ color: 'var(--text-muted)' }}>Name:</strong> <br/>{user.name}</div>
          <div><strong style={{ color: 'var(--text-muted)' }}>Email:</strong> <br/>{user.email}</div>
          <div><strong style={{ color: 'var(--text-muted)' }}>Address:</strong> <br/>{user.address || 'N/A'}</div>
          <div><strong style={{ color: 'var(--text-muted)' }}>Role:</strong> <br/>{user.role}</div>
          
          {user.role === 'STORE_OWNER' && user.store && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-color-light)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Store Info</h3>
              <div><strong>Name:</strong> {user.store.name}</div>
              <div><strong>Email:</strong> {user.store.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <strong>Rating:</strong> 
                <StarRating value={Math.round(user.store.averageRating || 0)} readonly={true} />
                <span style={{ color: 'var(--text-muted)' }}>({user.store.averageRating?.toFixed(1) || '0.0'})</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
