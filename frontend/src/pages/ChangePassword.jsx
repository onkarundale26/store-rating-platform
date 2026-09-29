import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from '../components/common/FormInput';
import api from '../api/axios';

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ChangePassword = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.put('/auth/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      setSuccessMsg('Password changed successfully');
      reset();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Change Password</h2>
      <div className="glass-card">
        {errorMsg && <div className="form-error" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.875rem' }}>{successMsg}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Current Password" type="password" name="currentPassword" register={register} error={errors.currentPassword} />
          <FormInput label="New Password" type="password" name="newPassword" register={register} error={errors.newPassword} />
          <FormInput label="Confirm New Password" type="password" name="confirmPassword" register={register} error={errors.confirmPassword} />
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
