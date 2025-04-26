import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import './ClientDashboard.css';
import { Link } from 'react-router-dom';


function ClientsDashboard() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token'); 


  useEffect(() => {
    if (token) {
      axios.get(ENDPOINTS.CLIENTS, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      })
      .then((res) => setClients(res.data))
      .catch((err) => {
        console.error('Error loading clients:', err);
        alert('Failed to load clients. Please try again.');
      });
    } else {
      alert('You are not logged in. Please log in first.');
      navigate('/login'); 
    }
  }, [token, navigate]);


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`${ENDPOINTS.CLIENTS}${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(prev => prev.filter(client => client.id !== id));
        alert('Client deleted successfully.');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete client. Please try again.');
      }
    }
  };

  return (
    <div className="clients-container">
    <div className="profile-link">
    <p><Link to="/profile">Go to Profile</Link></p>
            </div>
      <div className="clients-header">
        <h2 className="clients-title">All Clients</h2>
      </div>
  
      {clients.length === 0 ? (
        <div className="no-clients">
          <p>No clients found in the system.</p>
          <button 
            className="add-client-btn"
            onClick={() => navigate('/clients/register')}
          >
            + Register New Client
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>National ID</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Contact</th>
                <th className="address-col">Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td className="client-name">
                    {client.first_name} {client.last_name}
                  </td>
                  <td>{client.national_id}</td>
                  <td>{new Date(client.date_of_birth).toLocaleDateString()}</td>
                  <td>{client.gender === 'M' ? 'Male' : 'Female'}</td>
                  <td>{client.contact_number}</td>
                  <td className="address-col">{client.address}</td>
                  <td className="actions-col">
                    <button 
                      className="edit-btn"
                      onClick={() => navigate(`/clients/${client.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(client.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientsDashboard;



