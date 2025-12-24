import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerticalNavigation from './patient/components/VerticalNavigation';
import ProfileHeader from './patient/components/ProfileHeader';
import PersonalInfoForm from './patient/components/PersonalInfoForm';
import MedicalInfoForm from './patient/components/MedicalInfoForm';
import ActiveAppointments from './patient/components/ActiveAppointments';
import CancelAppointmentModal from './patient/components/CancelAppointmentModal';
import TreatmentCard from './patient/components/TreatmentCard';
import PrescriptionCard from './patient/components/PrescriptionCard';
import Button from '../components/common/Button';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { 
  FaSave, 
  FaUser, 
  FaHistory, 
  FaFilePrescription,
  FaSync
} from 'react-icons/fa';

/**
 * PatientProfile component - Main dashboard page for patient users.
 * 
 * This component serves as the central hub for patients to manage their healthcare
 * information, appointments, treatments, and prescriptions. It provides a comprehensive
 * dashboard with multiple views (profile, treatments, prescriptions) that patients can
 * navigate between using the vertical navigation sidebar.
 * 
 * The component handles:
 * - Patient profile management (viewing and editing personal/medical information)
 * - Appointment scheduling and management
 * - Treatment history tracking
 * - Prescription viewing and generation
 * - Real-time data synchronization via auto-refresh intervals
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {User} props.user - Current authenticated user object with access token
 * @param {Function} props.onLogout - Callback function triggered when user logs out
 * @returns {React.ReactElement} The main patient dashboard interface
 * 
 * @typedef {Object} User
 * @property {string} accessToken - Authentication token for API requests
 * @property {string} email - User's email address
 * @property {string} role - User's role in the system
 * 
 * @example
 * // Example usage in App.jsx or routing configuration
 * <Route 
 *   path="/patient" 
 *   element={<PatientProfile user={currentUser} onLogout={handleLogout} />} 
 * />
 */
const PatientProfile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  // State management for view navigation and UI
  const [currentView, setCurrentView] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Patient data state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    bloodGroup: '',
    allergies: ''
  });
  
  // Appointment and prescription data
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  
  // Modal state for appointment cancellation
  const [cancelModal, setCancelModal] = useState({ 
    isOpen: false, 
    appointment: null 
  });

  /**
   * Auto-refresh mechanism for real-time data updates.
   * Periodically fetches appointments and prescriptions every 15 seconds
   * to ensure the patient sees the most current information.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && user.accessToken) {
        fetchAppointments();
        fetchPrescriptions();
      }
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [user]);

  /**
   * Initial data loading effect.
   * Fetches patient profile, appointments, and prescriptions when the component mounts
   * or when the user object changes.
   */
  useEffect(() => {
    if (user && user.accessToken) {
      fetchPatientData();
      fetchAppointments();
      fetchPrescriptions();
    }
  }, [user]);

  /**
   * Fetches the patient's profile information from the server.
   * Updates the form data state with the retrieved information.
   */
  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3500/api/user/profile', {
        headers: { 
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setFormData({
          name: data.user.name || '',
          surname: data.user.surname || '',
          gender: data.user.gender || '',
          age: data.user.age || '',
          height: data.user.height || '',
          weight: data.user.weight || '',
          bloodGroup: data.user.bloodGroup || '',
          allergies: data.user.allergies || ''
        });
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches the patient's appointments from the server.
   * Updates the appointments state with current and past appointments.
   */
  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3500/api/user/appointments', {
        headers: { 
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments || []);
        console.log('Fetched appointments:', data.appointments?.length);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  /**
   * Fetches the patient's prescriptions from the server.
   * Updates the prescriptions state with available prescription data.
   */
  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:3500/api/user/prescriptions', {
        headers: { 
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setPrescriptions(data.prescriptions || []);
        console.log('Fetched prescriptions:', data.prescriptions?.length);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  /**
   * Manual data refresh handler.
   * Triggers simultaneous fetching of profile, appointments, and prescriptions.
   */
  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchPatientData(),
        fetchAppointments(),
        fetchPrescriptions()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Handles form input changes for profile editing.
   * Updates the formData state with new input values.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event from form input
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Saves updated profile information to the server.
   * Submits the current formData state and disables editing mode on success.
   */
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3500/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
        fetchPatientData();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates the appointment cancellation process.
   * Opens the cancellation modal with the selected appointment.
   * 
   * @param {Object} appointment - The appointment object to be cancelled
   */
  const handleCancelAppointment = async (appointment) => {
    setCancelModal({ isOpen: true, appointment });
  };

  /**
   * Confirms and executes appointment cancellation.
   * Sends delete request to server and refreshes appointments on success.
   */
  const confirmCancelAppointment = async () => {
    if (!cancelModal.appointment) return;
    
    try {
      const response = await fetch(`http://localhost:3500/api/user/appointments/${cancelModal.appointment._id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchAppointments();
        setCancelModal({ isOpen: false, appointment: null });
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  /**
   * Navigates to the appointment booking page.
   */
  const handleBookAppointment = () => {
    navigate('/appointment');
  };

  /**
   * Handles user logout process.
   * Sends logout request to server, clears authentication, and redirects to login.
   */
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3500/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      onLogout();
      navigate('/login');
    }
  };

  /**
   * Formats appointment dates for consistent display.
   * Converts date strings to human-readable format.
   * 
   * @param {string} dateString - ISO date string to format
   * @returns {string} Formatted date string
   */
  const formatAppointmentDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Generates a prescription for a completed appointment.
   * Typically triggered when an appointment expires and moves to treatments.
   * 
   * @param {string} appointmentId - ID of the appointment to generate prescription for
   */
  const handleGeneratePrescription = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:3500/api/user/prescriptions/generate/${appointmentId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchPrescriptions();
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error generating prescription:', error);
    }
  };

  /**
   * Filters and returns active (confirmed) appointments.
   * 
   * @returns {Array} Array of active appointment objects
   */
  const getActiveAppointments = () => {
    return appointments.filter(apt => apt.status === 'confirmed');
  };

  /**
   * Filters and returns completed treatments.
   * 
   * @returns {Array} Array of completed treatment objects
   */
  const getCompletedTreatments = () => {
    return appointments.filter(apt => apt.status === 'completed');
  };

  /**
   * Renders the appropriate content based on the current view selection.
   * 
   * @returns {React.ReactElement} The view-specific content component
   */
  const renderView = () => {
    const activeAppointments = getActiveAppointments();
    const completedTreatments = getCompletedTreatments();
    
    switch (currentView) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Information</h2>
              <Button
                onClick={handleRefreshData}
                variant="secondary"
                size="small"
                loading={refreshing}
                className="flex items-center gap-2"
              >
                <FaSync />
                Refresh
              </Button>
            </div>
            
            <PersonalInfoForm 
              formData={formData}
              onChange={handleFormChange}
              isEditing={isEditing}
              userEmail={user?.email}
              loading={loading}
            />
            <MedicalInfoForm 
              formData={formData}
              onChange={handleFormChange}
              isEditing={isEditing}
              loading={loading}
            />
            {isEditing && (
              <Button
                onClick={handleSaveProfile}
                className="mt-6"
                loading={loading}
              >
                <FaSave className="mr-2" />
                Save Changes
              </Button>
            )}
            
            <ActiveAppointments 
              appointments={activeAppointments}
              onCancelAppointment={handleCancelAppointment}
              formatAppointmentDate={formatAppointmentDate}
              loading={loading}
            />
            
            {activeAppointments.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-600 dark:text-blue-400 text-sm">
                  Note: Appointments will automatically expire and move to Previous Treatments within 1 minute of booking for testing purposes.
                </p>
              </div>
            )}
          </div>
        );
      
      case 'treatments':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Previous Treatments ({completedTreatments.length})
              </h2>
              <Button
                onClick={handleRefreshData}
                variant="secondary"
                size="small"
                loading={refreshing}
                className="flex items-center gap-2"
              >
                <FaSync />
                Refresh
              </Button>
            </div>
            
            {completedTreatments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FaHistory className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">No previous treatments found</p>
                <p className="text-sm mt-2">Active appointments will appear here after they expire (1 minute after booking)</p>
              </div>
            ) : (
              completedTreatments.map(treatment => {
                const prescription = prescriptions.find(p => p.appointmentId === treatment._id);
                return (
                  <TreatmentCard 
                    key={treatment._id}
                    treatment={treatment}
                    prescription={prescription}
                    onGeneratePrescription={handleGeneratePrescription}
                    formatDate={formatAppointmentDate}
                  />
                );
              })
            )}
          </div>
        );
      
      case 'prescriptions':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Prescriptions ({prescriptions.length})
              </h2>
              <Button
                onClick={handleRefreshData}
                variant="secondary"
                size="small"
                loading={refreshing}
                className="flex items-center gap-2"
              >
                <FaSync />
                Refresh
              </Button>
            </div>
            
            {prescriptions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FaFilePrescription className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">No prescriptions found</p>
                <p className="text-sm mt-2">Prescriptions are automatically generated when appointments expire</p>
              </div>
            ) : (
              prescriptions.map(prescription => (
                <PrescriptionCard 
                  key={prescription._id}
                  prescription={prescription}
                  formatDate={formatAppointmentDate}
                />
              ))
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile header with edit and logout controls */}
        <ProfileHeader 
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onLogout={handleLogout}
          loading={loading}
        />
        
        {/* Main content layout with navigation sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Vertical navigation sidebar */}
          <VerticalNavigation 
            currentView={currentView}
            setCurrentView={setCurrentView}
            previousTreatmentsCount={getCompletedTreatments().length}
            prescriptionsCount={prescriptions.length}
            onBookAppointment={handleBookAppointment}
            onLogout={handleLogout}
          />
          
          {/* Main content area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              {loading && currentView === 'profile' ? (
                <LoadingOverlay message="Loading profile..." />
              ) : (
                renderView()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment cancellation confirmation modal */}
      <CancelAppointmentModal 
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, appointment: null })}
        appointment={cancelModal.appointment}
        onConfirm={confirmCancelAppointment}
      />
    </div>
  );
};

export default PatientProfile;