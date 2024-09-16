import React, { useState } from 'react';
import './RegisterPage.css'; // Import the CSS for styling
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID, // From Cognito user pool
  ClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,   // From Cognito app client
};

const userPool = new CognitoUserPool(poolData);

const RegisterPage = () => {
  const navigate = useNavigate(); // Set up navigation
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { username, email, password } = formData;

    userPool.signUp(username, password, [{ Name: 'email', Value: email }], null, (err, result) => {
      if (err) {
        setError(err.message || 'Something went wrong');
        return;
      }
      setSuccess(true);
      // Pass username to the verification page via useNavigate
      navigate('/verify', { state: { username: username } });
    });
    

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        {success ? (
          <p className="success-message">Registration successful! Redirecting to verification page...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <button type="submit" className="register-button">Register</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
