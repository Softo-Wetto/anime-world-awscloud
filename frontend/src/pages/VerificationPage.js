import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID, // Cognito User Pool ID
  ClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,   // Cognito Client ID
};

const userPool = new CognitoUserPool(poolData);

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Extract username from location.state (from RegisterPage) and set it
  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
    } else {
      setError("Username not provided. Please go back and register again.");
    }
  }, [location.state]);

  const handleVerification = (e) => {
    e.preventDefault();

    if (!username) {
      setError("Username is missing. Cannot verify.");
      return;
    }

    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        setError(err.message || 'Verification failed');
        return;
      }
      setSuccess(true);
      // Redirect to login after successful verification
      setTimeout(() => navigate('/login'), 2000);
    });
  };

  return (
    <div className="verification-page">
      <div className="verification-card">
        <h2>Verify Your Account</h2>
        {error && <p className="error-message">{error}</p>}
        {success ? (
          <p className="success-message">Verification successful! Redirecting to login page...</p>
        ) : (
          <form onSubmit={handleVerification}>
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                name="verificationCode"
                placeholder="Enter the verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="verify-button">Verify</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
