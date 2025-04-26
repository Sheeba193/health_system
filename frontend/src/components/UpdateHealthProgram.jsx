import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateHealthProgram = () => {
  const [program, setProgram] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();  // Grab program ID from URL

  useEffect(() => {
    const fetchProgram = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`${ENDPOINTS.HEALTH_PROGRAMS}${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProgram(response.data);
      } catch (err) {
        setError('Error fetching program details.');
      }
    };
    fetchProgram();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(
        `${ENDPOINTS.HEALTH_PROGRAMS}${id}/`,
        { name: program.name, description: program.description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/programs');
    } catch (err) {
      setError('Error updating program.');
    }
  };

  return (
    <div>
      <h2>Update Health Program</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={program.name}
            onChange={(e) => setProgram({ ...program, name: e.target.value })}
          />
        </label>
        <label>
          Description:
          <textarea
            value={program.description}
            onChange={(e) => setProgram({ ...program, description: e.target.value })}
          />
        </label>
        <button type="submit">Update Program</button>
      </form>
    </div>
  );
};

export default UpdateHealthProgram;
