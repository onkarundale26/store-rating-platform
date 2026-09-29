import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/common/FormInput';
import api from '../../api/axios';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().max(400, 'Address must be at most 400 characters').optional(),
  ownerId: z.string().optional(),
});

const AddStore = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const [owners, setOwners] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await api.get('/admin/users?role=STORE_OWNER');
        // Filter out owners who already have a store (assume the API includes store info or we just list all)
        setOwners(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOwners();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const payload = { ...data };
      if (payload.ownerId) {
        payload.ownerId = parseInt(payload.ownerId);
      } else {
        delete payload.ownerId;
      }
      await api.post('/admin/stores', payload);
      navigate('/admin/stores');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add store');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Add New Store</h2>
      <div className="glass-card">
        {errorMsg && <div className="form-error" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Store Name" name="name" register={register} error={errors.name} />
          <FormInput label="Store Email" type="email" name="email" register={register} error={errors.email} />
          <FormInput label="Address" name="address" register={register} error={errors.address} />
          
          <div className="form-group">
            <label className="form-label">Assign Owner (Optional)</label>
            <select className={`form-input ${errors.ownerId ? 'error' : ''}`} {...register('ownerId')}>
              <option value="">No Owner / Assign Later</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
            {errors.ownerId && <span className="form-error">{errors.ownerId.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Add Store'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
