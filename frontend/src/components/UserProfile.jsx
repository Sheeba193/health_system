import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      tryRefreshToken(); 
      return;
    }

    try {
      const response = await axios.get(ENDPOINTS.USER_PROFILE, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProfile(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        tryRefreshToken(); 
      } else {
        setError('Failed to load profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(ENDPOINTS.REFRESH, {
        refresh: refreshToken,
      });

      const newAccess = response.data.access;
      localStorage.setItem('access_token', newAccess);
      fetchProfile(); 
    } catch (err) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    
    navigate('/login');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Ensure 'profile' is not null before accessing properties like 'username'
  return (
    <div className="user-profile-container">
      <div className="dashboard-section">
        <h3>Dashboard</h3>
        <ul className="dashboard-links">
          <li><Link to="/programs/register">➕ Register Health Program</Link></li>
          <li><Link to="/clients/register">🧍 Register Client</Link></li>
          <li><Link to="/enrollments/register">📋 Enroll Client in Program</Link></li>
          <li><Link to="/clients/search">🔍 Search Clients</Link></li>
          <li><Link to="/clients">📄 View All Clients</Link></li>
          <li><Link to="/programs">🏥 Health Programs</Link></li>
        </ul>
      </div>

      {/* Conditionally render profile details only when profile is not null */}
      {profile ? (
        <div className="user-profile-box">
          <h2>Welcome, {profile.username}</h2>
          <p><strong>Email:</strong> {profile.email}</p>
          <button onClick={handleLogout} className="logout-button"s        style={{
          padding: '10px 20px',
          backgroundColor: '#ff4d4d',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          borderRadius: '5px',
          marginTop: '20px'
        }}>Logout</button>
        </div>
      ) : (
        <p>Profile information is unavailable.</p>
      )}
    </div>

  );
};

export default UserProfile;
