import React, { useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import './RegisterHealthProgram.css';
import { Link } from 'react-router-dom';

const RegisterHealthProgram = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateInput = (input) => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    return regex.test(input);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (validateInput(value)) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(ENDPOINTS.HEALTH_PROGRAMS, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMessage(`Health Program "${response.data.name}" registered successfully!`);
      setError('');
      setFormData({ name: '', description: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to register program.');
      setMessage('');
    }
  };

  return (
   
        
    <div className="program-registration-container">
              <div className="profile-link">
          <p><Link to="/profile">Go to Profile</Link></p>
        </div>
      <div className="registration-card">
        <h2 className="form-title">Register a Health Program</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label className="form-label">Program Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter program name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              required
              placeholder="Enter program description"
              rows={4}
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Register Program
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterHealthProgram;


