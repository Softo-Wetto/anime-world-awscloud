import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import './LoginPage.css';
import { userPool } from '../cognitoConfig';  // Ensure this file is configured correctly for Cognito

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newPassword: '',  // To handle new password scenario
  });
  const [error, setError] = useState('');
  const [cognitoUser, setCognitoUser] = useState(null);  // Track the Cognito user for the new password challenge
  const [requireNewPassword, setRequireNewPassword] = useState(false);  // Track if new password is required
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authenticationDetails = new AuthenticationDetails({
      Username: formData.email,
      Password: formData.password,
    });

    const userData = {
      Username: formData.email,
      Pool: userPool,
    };

    const cognitoUserInstance = new CognitoUser(userData);

    cognitoUserInstance.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const token = result.getIdToken().getJwtToken();
        localStorage.setItem('token', token);  // Store the Cognito JWT
        localStorage.setItem('username', formData.email);  // Store email (used as username)
        setError('');  // Clear any previous errors
        navigate('/');  // Redirect to homepage after successful login
        window.location.reload(); // Reload to ensure the Header updates
      },
      onFailure: (err) => {
        setError(err.message || 'Login failed. Please check your credentials.');
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // Cognito requires a new password
        setCognitoUser(cognitoUserInstance);  // Save the Cognito user to complete the challenge later
        setRequireNewPassword(true);  // Switch UI to prompt for new password
      },
    });
  };

  // Function to handle setting a new password
  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();

    // Complete the new password challenge
    cognitoUser.completeNewPasswordChallenge(formData.newPassword, {}, {
      onSuccess: (result) => {
        const token = result.getIdToken().getJwtToken();
        localStorage.setItem('token', token);  // Store the Cognito JWT
        localStorage.setItem('username', formData.email);  // Store email (used as username)
        setError('');
        navigate('/');
        window.location.reload();
      },
      onFailure: (err) => {
        setError(err.message || 'Failed to set new password. Please try again.');
      },
    });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{requireNewPassword ? 'Set New Password' : 'Login'}</h2>
        {error && <p className="error-message">{error}</p>}
        {!requireNewPassword ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        ) : (
          // Form for setting a new password
          <form onSubmit={handleNewPasswordSubmit}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter your new password"
              />
            </div>
            <button type="submit" className="login-button">Set New Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
