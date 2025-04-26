import React, { useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import './RegisterClient.css';
import { Link } from 'react-router-dom';


const RegisterClient = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    national_id: '',
    date_of_birth: '',
    gender: '',
    contact_number: '',
    address: '',
  });

  const [message, setMessage] = useState('');
  const token = localStorage.getItem('access_token');


  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };
  const validateName = (name) => /^[A-Za-z]+$/.test(name);
  const validateNationalID = (id) => /^[0-9]+$/.test(id);
  const validateDateOfBirth = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    return birthDate <= today;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!validateName(formData.first_name)) {
      setMessage('First Name must contain only characters.');
      return;
    }

    if (!validateName(formData.last_name)) {
      setMessage('Last Name must contain only characters.');
      return;
    }

    if (!validateNationalID(formData.national_id)) {
      setMessage('National ID must contain only numbers.');
      return;
    }

    if (!validatePhoneNumber(formData.contact_number)) {
      setMessage('Contact Number must contain 10 digits (0-9) starting with 0');
      return;
    }

    if (!validateDateOfBirth(formData.date_of_birth)) {
      setMessage('Date of Birth must not be in the future.');
      return;
    }

    try {
      await axios.post(`${ENDPOINTS.CLIENTS}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Client registered successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        national_id: '',
        date_of_birth: '',
        gender: '',
        contact_number: '',
        address: '',
      });
    } catch (error) {
      setMessage('Error registering client.');
      console.error(error);
    }
  };

  return (
    <div className="client-registration-container">
            <div className="profile-link">
                      <p><Link to="/profile">Go to Profile</Link></p>
            </div>
      <div className="registration-card">
        <h2 className="form-title">Register New Client</h2>
        {message && (
          <div className={`message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                name="first_name"
                placeholder="Enter Firstname"
                value={formData.first_name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
  
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                name="last_name"
                placeholder="Enter Lastname"
                value={formData.last_name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
  
            <div className="form-group">
              <label className="form-label">National ID</label>
              <input
                name="national_id"
                placeholder="Enter ID Number"
                value={formData.national_id}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
  
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
  
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
  
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                name="contact_number"
                placeholder="Enter Phonenumber"
                value={formData.contact_number}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
  
            <div className="form-group full-width">
              <label className="form-label">Address</label>
              <input
                name="address"
                placeholder="123 Main St, City, Country"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
  
          <button type="submit" className="submit-btn">
            Register Client
          </button>
        </form>
  

      </div>
    </div>
  );
};

export default RegisterClient;

 
