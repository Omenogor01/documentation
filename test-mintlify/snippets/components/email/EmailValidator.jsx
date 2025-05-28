import React, { useState } from 'react';

const EmailValidator = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  return (
    <div className="email-validator">
      <style jsx>{`
        .email-validator {
          margin: 1rem 0;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          max-width: 500px;
        }
        .input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        input {
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.25rem;
          flex-grow: 1;
        }
        input:focus {
          outline: none;
          border-color: #4299e1;
        }
        .valid {
          border-color: #48bb78;
        }
        .invalid {
          border-color: #f56565;
        }
        .status {
          font-size: 0.875rem;
        }
        .valid-text {
          color: #48bb78;
        }
        .invalid-text {
          color: #f56565;
        }
      `}</style>
      <h3>Email Validator</h3>
      <div className="input-group">
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter email address"
          className={email ? (isValid ? 'valid' : 'invalid') : ''}
        />
      </div>
      {email && (
        <p className={`status ${isValid ? 'valid-text' : 'invalid-text'}`}>
          {isValid ? '✓ Valid email format' : '✗ Please enter a valid email address'}
        </p>
      )}
    </div>
  );
};

export default EmailValidator;
