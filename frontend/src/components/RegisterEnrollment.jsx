import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import './RegisterEnrollment.css';
import { Link } from 'react-router-dom';

const RegisterEnrollment = () => {
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [clientId, setClientId] = useState('');
  const [programId, setProgramId] = useState('');
  const [status, setStatus] = useState('active');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    const fetchClients = async () => {
      const res = await axios.get(ENDPOINTS.CLIENTS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(res.data);
    };

    const fetchPrograms = async () => {
      const res = await axios.get(ENDPOINTS.HEALTH_PROGRAMS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrograms(res.data);
    };

    fetchClients();
    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      await axios.post(
        ENDPOINTS.ENROLLMENTS,
        {
          client: clientId,
          program: programId,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Enrollment registered successfully!');
    } catch (error) {
      setMessage('Error occurred: ' + (error.response?.data?.detail || 'Something went wrong'));
    }
  };

  return (
    <div className="enrollment-container">
    <div className="profile-link">
      <p><Link to="/profile">Go to Profile</Link></p>
      </div>
      <div className="enrollment-form-box">
        <h2>Register Enrollment</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="enrollment-form">
          <label htmlFor="clientId">Select Client:</label>
          <select
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.first_name} {client.last_name}
              </option>
            ))}
          </select>

          <label htmlFor="programId">Select Program:</label>
          <select
            id="programId"
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            required
          >
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>

          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit" className="submit-btn">
            Enroll
          </button>
        </form>

        
      </div>
    </div>
  );
};
export default RegisterEnrollment;

