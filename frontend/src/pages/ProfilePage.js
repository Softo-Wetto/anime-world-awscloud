import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import './ProfilePage.css';
import { userPool } from '../cognitoConfig';  // Make sure this is your configured Cognito Pool

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const cognitoUser = userPool.getCurrentUser();

      if (!cognitoUser) {
        navigate('/login');
        return;
      }

      cognitoUser.getSession((err, session) => {
        if (err) {
          console.error('Failed to get session:', err);
          setError('Failed to load profile. Please try again later.');
          setLoading(false);
          return;
        }

        // Get the token to use in requests (if necessary)
        const token = session.getIdToken().getJwtToken();
        localStorage.setItem('token', token);  // Optionally store the token

        // Get the user attributes (username, email, etc.)
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            console.error('Failed to fetch user attributes:', err);
            setError('Failed to load profile. Please try again later.');
            setLoading(false);
            return;
          }

          // Map the attributes to an object
          const userAttributes = {};
          attributes.forEach(attr => {
            userAttributes[attr.getName()] = attr.getValue();
          });

          setUserInfo(userAttributes);
          setLoading(false);
        });
      });
    };

    fetchUserInfo();
  }, [navigate]);

  if (loading) return <div className="status-message"><p>Loading...</p></div>;
  if (error) return <div className="status-message"><p>{error}</p></div>;

  const userAvatar = `https://ui-avatars.com/api/?name=${userInfo.name || userInfo.email}&background=333&color=f1c40f&size=128`;

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-card">
        <div className="avatar-container">
          <img src={userAvatar} alt="User Avatar" className="avatar" />
        </div>
        <div className="profile-info">
          <p><strong>Username:</strong> {userInfo.name || userInfo['custom:username'] || 'N/A'}</p>
          <p><strong>Email:</strong> {userInfo.email || 'N/A'}</p>
          <p><strong>Member Since:</strong> {userInfo['custom:createdAt'] || 'N/A'}</p>
        </div>
      </div>
      <div className="profile-actions">
        <Link to="/bookmarks" className="bookmark-link btn">Go to Bookmarks</Link>
        <Link to="/favorites" className="favorites-link btn btn-secondary ml-2">Favorite Characters</Link>
      </div>
    </div>
  );
};

export default ProfilePage;