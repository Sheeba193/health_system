import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import { Link } from 'react-router-dom';
import './HealthProgramsPage.css'

const HealthProgramsList = () => {
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(ENDPOINTS.HEALTH_PROGRAMS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPrograms(response.data);
      } catch (err) {
        setError('Error fetching health programs.');
      }
    };

    fetchPrograms();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${ENDPOINTS.HEALTH_PROGRAMS}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrograms(programs.filter((program) => program.id !== id));
    } catch (err) {
      setError('Error deleting program.');
    }
  };

  return (
    <div className="programs-container">
      <div className="profile-link">
          <p><Link to="/profile">Go to Profile</Link></p>
                  </div>
      <div className="programs-box">
        <h2>Health Programs</h2>
        {error && <p className="error-message">{error}</p>}
        {programs.length === 0 ? (
          <p>No programs found.</p>
        ) : (
          <ul className="programs-list">
            {programs.map((program) => (
              <li key={program.id} className="program-item">
                <div className="program-info">
                  <strong>{program.name}</strong><br />
                  <span>{program.description}</span><br />
                </div>
                <div className="program-actions">
                  <Link to={`/programs/${program.id}/edit`} className="edit-btn">Edit</Link>
                  <button onClick={() => handleDelete(program.id)} className="delete-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HealthProgramsList;
