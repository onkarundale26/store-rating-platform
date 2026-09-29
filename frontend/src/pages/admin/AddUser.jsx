import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/common/FormInput';
import api from '../../api/axios';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  address: z.string().max(400, 'Address must be at most 400 characters').optional(),
  role: z.enum(['ADMIN', 'NORMAL_USER', 'STORE_OWNER'], { required_error: 'Role is required' }),
});

const AddUser = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await api.post('/admin/users', data);
      navigate('/admin/users');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Add New User</h2>
      <div className="glass-card">
        {errorMsg && <div className="form-error" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Name" name="name" register={register} error={errors.name} />
          <FormInput label="Email" type="email" name="email" register={register} error={errors.email} />
          <FormInput label="Password" type="password" name="password" register={register} error={errors.password} />
          <FormInput label="Address" name="address" register={register} error={errors.address} />
          
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className={`form-input ${errors.role ? 'error' : ''}`} {...register('role')}>
              <option value="">Select a role</option>
              <option value="ADMIN">Admin</option>
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
            {errors.role && <span className="form-error">{errors.role.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
