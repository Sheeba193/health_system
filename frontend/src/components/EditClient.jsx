import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import './EditClient.css' 

function EditClient() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [client, setClient] = useState(null); 
  const [error, setError] = useState('');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (token) {
      axios.get(`${ENDPOINTS.CLIENTS}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => setClient(res.data))
        .catch((err) => {
          setError('Failed to load client data.');
          console.error('Error fetching client:', err);
        });
    } else {
      navigate('/login'); 
    }
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${ENDPOINTS.CLIENTS}${id}/`, client, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Client updated successfully.');
      navigate('/clients'); 
    } catch (err) {
      setError('Failed to update client.');
      console.error('Update error:', err);
    }
  };

  if (!client) return <p>Loading...</p>; 


    return (
        <div className="edit-client-container">
          <div className="edit-client-box">
            <h2>Edit Client</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="edit-client-form">
              <label>
                First Name:
                <input
                  type="text"
                  value={client.first_name}
                  onChange={(e) => setClient({ ...client, first_name: e.target.value })}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={client.last_name}
                  onChange={(e) => setClient({ ...client, last_name: e.target.value })}
                  required
                />
              </label>
              <label>
                National ID:
                <input
                  type="text"
                  value={client.national_id}
                  onChange={(e) => setClient({ ...client, national_id: e.target.value })}
                  required
                />
              </label>
              <label>
                Date of Birth:
                <input
                  type="date"
                  value={client.date_of_birth}
                  onChange={(e) => setClient({ ...client, date_of_birth: e.target.value })}
                  required
                />
              </label>
              <label>
                Gender:
                <select
                  value={client.gender}
                  onChange={(e) => setClient({ ...client, gender: e.target.value })}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Contact Number:
                <input
                  type="text"
                  value={client.contact_number}
                  onChange={(e) => setClient({ ...client, contact_number: e.target.value })}
                  required
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={client.address}
                  onChange={(e) => setClient({ ...client, address: e.target.value })}
                  required
                />
              </label>
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      );
    };

export default EditClient;
