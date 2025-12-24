import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HospitalLogin from './pages/login';
import PatientProfile from './pages/patient';
import Appointment from './components/appointment/Appointment';
import LoadingOverlay from './components/common/LoadingOverlay';
import './App.css';

/**
 * Main application component that serves as the root of the React application.
 * 
 * This component handles:
 * - User authentication state management
 * - Routing and navigation between different application sections
 * - Theme context provisioning for consistent styling
 * - Initial authentication checks on application load
 * 
 * The application features three main routes:
 * 1. Login page for hospital/patient authentication
 * 2. Patient dashboard for managing profile and appointments
 * 3. Appointment booking interface
 * 
 * Authentication state is persisted using localStorage to maintain user sessions
 * across browser refreshes.
 * 
 * @component
 * @returns {React.ReactElement} The root application component with routing and authentication
 * 
 * @example
 * // This component is typically rendered in the main index.jsx file:
 * // ReactDOM.createRoot(document.getElementById('root')).render(<App />);
 */
function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  
  // Loading state for initial authentication check
  const [loading, setLoading] = useState(true);
  
  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  /**
   * Authentication check effect that runs on component mount.
   * 
   * This effect checks for existing authentication tokens in localStorage
   * to determine if a user session is active. If valid credentials are found,
   * the user state is updated accordingly.
   * 
   * @effect
   */
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser({ ...parsedUser, accessToken: token });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear corrupted or invalid authentication data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Handles user login and authentication.
   * 
   * Stores authentication data in localStorage and updates application state
   * before navigating to the patient dashboard.
   * 
   * @param {Object} userData - User authentication data from login
   * @param {string} userData.accessToken - JWT or session token for API authentication
   * @param {string} userData.email - User's email address
   * @param {string} userData.role - User's role in the system
   */
  const handleLogin = (userData) => {
    try {
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      navigate('/patient');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  /**
   * Handles user logout and session cleanup.
   * 
   * Clears all authentication and user data from localStorage and application state,
   * then redirects to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('darkMode');
    setUser(null);
    navigate('/login');
  };

  // Display loading overlay during initial authentication check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingOverlay message="Loading..." show={true} />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="App">
        <Routes>
          {/* Login route - redirects to patient dashboard if already authenticated */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/patient" /> : <HospitalLogin onLogin={handleLogin} />
            } 
          />
          
          {/* Patient dashboard route - main interface for authenticated patients */}
          <Route 
            path="/patient" 
            element={
              user ? <PatientProfile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          
          {/* Appointment booking route - accessible only to authenticated users */}
          <Route 
            path="/appointment" 
            element={
              user ? <Appointment user={user} /> : <Navigate to="/login" />
            } 
          />
          
          {/* Root route - redirects based on authentication status */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/patient" : "/login"} />} 
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;