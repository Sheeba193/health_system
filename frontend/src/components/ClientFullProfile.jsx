import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import './ClientFullProfile.css'

const ClientFullProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${ENDPOINTS.CLIENTS}${id}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (err) {
        setError('Failed to load client profile.');
      }
    };

    fetchProfile();
  }, [id, token]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profileData) return <p>Loading...</p>;

  const { client, enrollments } = profileData;

  return (
    <div className="client-profile-container">
      <div className="client-profile-box">
        <h2>Client Profile</h2>
        <div className="client-details">
          <p><strong>Name:</strong> {client.first_name} {client.last_name}</p>
          <p><strong>National ID:</strong> {client.national_id}</p>
          <p><strong>Date of Birth:</strong> {client.date_of_birth}</p>
          <p><strong>Gender:</strong> {client.gender}</p>
          <p><strong>Contact:</strong> {client.contact_number}</p>
          <p><strong>Address:</strong> {client.address}</p>
          <p><strong>Registered On:</strong> {client.date_registered.slice(0, 10)}</p>
        </div>

        <h3>Enrolled Programs</h3>
        {enrollments.length > 0 ? (
          <ul className="enrollment-list">
            {enrollments.map((enrollment, index) => (
              <li key={index}>
                <strong>{enrollment.program.name}</strong>: {enrollment.program.description}<br />
                Status: {enrollment.status}<br />
                Enrolled On: {enrollment.enrolled_on.slice(0, 10)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No enrolled programs.</p>
        )}
      </div>
    </div>
  );
};
export default ClientFullProfile;
