import React from 'react';

const FormInput = ({ label, type = 'text', name, register, error, placeholder }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-input ${error ? 'error' : ''}`}
        placeholder={placeholder}
        {...(register ? register(name) : {})}
      />
      {error && <span className="form-error">{error.message}</span>}
    </div>
  );
};

export default FormInput;
