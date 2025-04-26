import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import HomePage from './components/HomePage';
import RegisterHealthProgram from './components/RegisterHealthProgram';
import RegisterClient from './components/RegisterClient';
import RegisterEnrollment from './components/RegisterEnrollment';
import SearchClients from './components/SearchClients';
import ClientFullProfile from './components/ClientFullProfile';
import UpdateHealthProgram from './components/UpdateHealthProgram';
import HealthProgramsList from './components/HealthProgramsList';
import ProtectedRoute from './components/ProtectedRoute';
import ClientsDashboard from './components/ClientsDashboard';
import EditClient from './components/EditClient';
import './App.css';

function App() {
  const storedToken = localStorage.getItem('access_token');
  const storedUsername = localStorage.getItem('username');

  const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);
  const [username, setUsername] = useState(storedUsername || '');

  const handleLogin = (username) => {
    setUsername(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setUsername('');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/clients/search" element={<SearchClients />} />
          <Route path="/clients/:id/profile" element={<ClientFullProfile />} />
          <Route path="/programs" element={<HealthProgramsList />} />
          <Route path="/programs/:id/edit" element={<UpdateHealthProgram />} />
          <Route path="/clients/:id/edit" element={<EditClient />} />  
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
                  <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsDashboard/>
            </ProtectedRoute>
          }
        />


          <Route
            path="/programs/register"
            element={
              <ProtectedRoute>
                <RegisterHealthProgram />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients/register"
            element={
              <ProtectedRoute>
                <RegisterClient />
              </ProtectedRoute>
            }
          />

          <Route
            path="/enrollments/register"
            element={
              <ProtectedRoute>
                <RegisterEnrollment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
