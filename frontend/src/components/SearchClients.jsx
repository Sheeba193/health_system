import React, { useState } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import { Link } from 'react-router-dom'; 
import './SearchClients.css'

const SearchClients = () => {
  const [query, setQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false); 

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      const response = await axios.get(`${ENDPOINTS.CLIENTS}search/`, {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClients(response.data);
      setError('');
      setSearched(true);
    } catch (err) {
      setError('Error fetching clients.');
      setClients([]);
      setSearched(true);
    }
  };

  return (
    <div className="client-search-container">
      <div className="profile-link">
                <p><Link to="/profile">Go to Profile</Link></p>
      </div>
      <div className="search-card">
        <h2 className="search-title">Search Clients</h2>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or ID..."
              className="search-input"
              required
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>
  
        {error && <div className="error-message">{error}</div>}
  
        {searched && !error && clients.length === 0 && (
          <div className="no-results">
            No results found for "<strong>{query}</strong>"
          </div>
        )}
  
        {clients.length > 0 && (
          <div className="results-container">
            <p className="results-count">
              Found {clients.length} result(s) for "<strong>{query}</strong>":
            </p>
            <ul className="client-list">
              {clients.map((client) => (
                <li key={client.id} className="client-item">
                  <div className="client-info">
                    <span className="client-name">
                      {client.first_name} {client.last_name}
                    </span>
                    <span className="client-id">{client.national_id}</span>
                  </div>
                  <Link to={`/clients/${client.id}/profile`} className="profile-link">
                    View Profile & Enrollments →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchClients;


