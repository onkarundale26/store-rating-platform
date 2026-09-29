import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/common/FormInput';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/login', data);
      const { token, user } = res.data;
      login(token, user);
      
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'NORMAL_USER') navigate('/stores');
      else if (user.role === 'STORE_OWNER') navigate('/owner/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {errorMsg && <div className="form-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Email" type="email" name="email" register={register} error={errors.email} />
          <FormInput label="Password" type="password" name="password" register={register} error={errors.password} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
