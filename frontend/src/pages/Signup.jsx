import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/common/FormInput';
import api from '../api/axios';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  address: z.string().max(400, 'Address must be at most 400 characters').optional(),
});

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/auth/signup', data);
      setSuccessMsg('Account created successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card" style={{ maxWidth: '500px' }}>
        <h2 className="auth-title">Create an Account</h2>
        {errorMsg && <div className="form-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{successMsg}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Name" name="name" register={register} error={errors.name} />
          <FormInput label="Email" type="email" name="email" register={register} error={errors.email} />
          <FormInput label="Password" type="password" name="password" register={register} error={errors.password} />
          <FormInput label="Address" name="address" register={register} error={errors.address} />
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
