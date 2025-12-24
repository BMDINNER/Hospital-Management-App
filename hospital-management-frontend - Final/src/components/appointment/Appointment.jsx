import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import TimeSlotButton from './TimeSlotButton';
import Button from '../common/Button';
import FormField from '../common/FormField';
import LoadingOverlay from '../common/LoadingOverlay';
import { 
  FaCalendarAlt, 
  FaArrowLeft, 
  FaClock,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaHospital,
  FaStethoscope,
  FaMapMarkerAlt,
  FaUserMd,
  FaCalendarDay
} from 'react-icons/fa';

/**
 * Appointment Booking Component
 * 
 * Primary component for patients to schedule medical appointments.
 * Provides a multi-step form for selecting location, hospital, department,
 * doctor, date, and time slot. Integrates with backend API to fetch
 * available options and submit appointment requests.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.user - Current authenticated user object
 * @param {string} props.user._id - User identifier
 * @param {string} props.user.name - User's first name
 * @param {string} props.user.surname - User's last name
 * @param {string} props.user.email - User's email address
 * @param {number} [props.user.age] - User's age
 * @param {string} [props.user.bloodGroup] - User's blood group
 * 
 * @returns {JSX.Element} Appointment booking interface
 * 
 * @example
 * // Usage in a parent component:
 * <Appointment user={currentUser} />
 * 
 * @requires ThemeContext for dark/light mode support
 * @requires react-router-dom for navigation
 * @requires Backend API endpoints for data fetching
 */
const Appointment = ({ user }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  /**
   * Appointment form data state
   * 
   * @typedef {Object} FormData
   * @property {string} location - Selected geographical location
   * @property {string} hospitalId - Selected hospital identifier
   * @property {string} departmentId - Selected department identifier
   * @property {string} doctorId - Selected doctor identifier
   * @property {string} appointmentDate - Selected appointment date (YYYY-MM-DD)
   * @property {string} appointmentTime - Selected appointment time (HH:MM)
   */
  const [formData, setFormData] = useState({
    location: '',
    hospitalId: '',
    departmentId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  // State for dynamic data options
  const [locations, setLocations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  // Loading and status states
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  /**
   * Extract user ID from user object with fallback strategies
   * 
   * @private
   * @function getUserId
   * @returns {string|null} User identifier or null if not found
   * 
   * @note Tries multiple property names to accommodate different user object structures
   */
  const getUserId = () => {
    if (!user) {
      console.error('User object is undefined');
      return null;
    }
    
    const userId = user._id || user.id || user.userId || user.userID;
    
    if (!userId) {
      console.error('Could not find user ID in user object:', Object.keys(user));
    }
    
    return userId;
  };

  /**
   * Extract user ID from JWT token stored in localStorage
   * 
   * @private
   * @function getUserIdFromToken
   * @returns {string|null} User identifier or null if token invalid/missing
   * 
   * @note Fallback method when user object doesn't contain ID
   * @warning Relies on localStorage access token format
   */
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        return null;
      }
      
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      const userId = decoded._id || decoded.id || decoded.userId || decoded.sub;
      
      console.log('User ID from token:', userId);
      return userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  /**
   * Validate if all required form fields are populated
   * 
   * @private
   * @function isFormValid
   * @returns {boolean} True if form is ready for submission
   */
  const isFormValid = () => {
    return formData.location && 
          formData.hospitalId && 
          formData.departmentId && 
          formData.doctorId && 
          formData.appointmentDate && 
          formData.appointmentTime;
  };

  /**
   * Initialize component with static data (locations and departments)
   * 
   * @effect
   * @listens component mount
   */
  useEffect(() => {
    console.log('Appointment component mounted with user:', user);
    
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch locations and departments in parallel
        const [locationsRes, departmentsRes] = await Promise.all([
          fetch('http://localhost:3500/api/hospital/locations'),
          fetch('http://localhost:3500/api/hospital/departments')
        ]);
        
        const locationsData = await locationsRes.json();
        const departmentsData = await departmentsRes.json();
        
        if (locationsData.success) {
          setLocations(locationsData.locations.map(loc => ({ value: loc, label: loc })));
        } else {
          console.error('Failed to fetch locations:', locationsData.message);
        }
        
        if (departmentsData.success) {
          setDepartments(departmentsData.departments.map(dept => ({ 
            value: dept._id, 
            label: dept.name 
          })));
        } else {
          console.error('Failed to fetch departments:', departmentsData.message);
        }
        
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  /**
   * Handle form input changes with cascading data fetching
   * 
   * @private
   * @function handleInputChange
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - Input change event
   * 
   * @note Implements cascading dropdown behavior:
   * - Location → fetches hospitals
   * - Hospital → resets dependent fields
   * - Department → fetches doctors for selected hospital
   * - Doctor → resets time slot
   */
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    try {
      if (name === 'location') {
        // Reset dependent fields when location changes
        setFormData(prev => ({ 
          ...prev, 
          hospitalId: '', 
          departmentId: '', 
          doctorId: '', 
          appointmentTime: '' 
        }));
        setHospitals([]);
        setAvailableDoctors([]);
        setAvailableSlots([]);
        
        // Fetch hospitals for selected location
        const response = await fetch(`http://localhost:3500/api/hospital/hospitals/${value}`);
        const data = await response.json();
        if (data.success) {
          setHospitals(data.hospitals.map(hosp => ({ 
            value: hosp._id, 
            label: hosp.name 
          })));
        } else {
          console.error('Failed to fetch hospitals:', data.message);
        }
        
      } else if (name === 'hospitalId') {
        // Reset department, doctor, and time when hospital changes
        setFormData(prev => ({ 
          ...prev, 
          departmentId: '', 
          doctorId: '', 
          appointmentTime: '' 
        }));
        setAvailableDoctors([]);
        setAvailableSlots([]);
        
      } else if (name === 'departmentId') {
        // Reset doctor and time when department changes
        setFormData(prev => ({ 
          ...prev, 
          doctorId: '', 
          appointmentTime: '' 
        }));
        setAvailableDoctors([]);
        setAvailableSlots([]);
        
        // Fetch doctors for selected department and hospital
        if (formData.hospitalId && value) {
          setDoctorsLoading(true);
          try {
            const response = await fetch(
              `http://localhost:3500/api/hospital/doctors/${value}/${formData.hospitalId}`
            );
            const data = await response.json();
            if (data.success) {
              setAvailableDoctors(data.doctors.map(doc => ({ 
                value: doc._id, 
                label: `${doc.name} - ${doc.specialty}` 
              })));
            } else {
              console.error('Failed to fetch doctors:', data.message);
            }
          } finally {
            setDoctorsLoading(false);
          }
        }
        
      } else if (name === 'doctorId') {
        // Reset time slot when doctor changes
        setFormData(prev => ({ 
          ...prev, 
          appointmentTime: '' 
        }));
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  /**
   * Handle appointment date selection
   * 
   * @private
   * @function handleDateChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - Date input change event
   * 
   * @note Fetches available time slots when date, doctor, and hospital are selected
   */
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      appointmentDate: date, 
      appointmentTime: '' 
    }));
    setAvailableSlots([]);
    
    // Fetch available slots when all prerequisites are selected
    if (formData.doctorId && formData.hospitalId && date) {
      await fetchAvailableSlots(formData.doctorId, formData.hospitalId, date);
    }
  };

  /**
   * Fetch available time slots for specific criteria
   * 
   * @private
   * @async
   * @function fetchAvailableSlots
   * @param {string} doctorId - Doctor identifier
   * @param {string} hospitalId - Hospital identifier
   * @param {string} date - Appointment date (YYYY-MM-DD)
   */
  const fetchAvailableSlots = async (doctorId, hospitalId, date) => {
    try {
      setSlotsLoading(true);
      const response = await fetch(
        `http://localhost:3500/api/hospital/slots/${doctorId}/${hospitalId}/${date}`
      );
      const data = await response.json();
      if (data.success) {
        setAvailableSlots(data.availableSlots || []);
      } else {
        console.error('Failed to fetch slots:', data.message);
      }
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    } finally {
      setSlotsLoading(false);
    }
  };

  /**
   * Handle time slot selection
   * 
   * @private
   * @function handleTimeSlotSelect
   * @param {Object} slot - Selected time slot object
   * @param {string} slot.startTime - Slot start time (HH:MM)
   */
  const handleTimeSlotSelect = (slot) => {
    setFormData(prev => ({
      ...prev,
      appointmentTime: slot.startTime
    }));
  };

  /**
   * Navigate back to patient profile
   * 
   * @private
   * @function handleBackToProfile
   */
  const handleBackToProfile = () => {
    navigate('/patient');
  };

  /**
   * Test backend connection and authentication
   * 
   * @private
   * @async
   * @function testBackendConnection
   * @returns {Promise<boolean>} True if backend test successful
   * 
   * @note Debug utility for development troubleshooting
   */
  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const token = localStorage.getItem('accessToken');
      
      const userId = getUserId() || getUserIdFromToken();
      
      if (!userId) {
        console.error('No user ID found for testing');
        return false;
      }
      
      const testResponse = await fetch('http://localhost:3500/api/test-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          test: 'data',
          userId: userId 
        })
      });
      
      const testData = await testResponse.json();
      console.log('Backend test result:', testData);
      
      return testData.success;
    } catch (err) {
      console.error('Backend test failed:', err);
      return false;
    }
  };

  /**
   * Test appointment expiration service
   * 
   * @private
   * @async
   * @function testExpireAppointments
   * @returns {Promise<boolean>} True if test successful
   * 
   * @note Debug utility for testing background appointment processing
   */
  const testExpireAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3500/api/test/expire-appointments', {
        method: 'POST'
      });
      const data = await response.json();
      console.log('Expire appointments test:', data);
      alert(`Test result: ${data.message}`);
      return data.success;
    } catch (err) {
      console.error('Test expire appointments failed:', err);
      return false;
    }
  };

  /**
   * Handle appointment form submission
   * 
   * @private
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - Form submission event
   * 
   * @note Validates form, prepares data, submits to backend API
   * @note Handles success/error states and navigation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Please fill all required fields');
      return;
    }

    let userId = getUserId();
    
    if (!userId) {
      userId = getUserIdFromToken();
    }
    
    if (!userId) {
      console.error('No user ID found. User object:', user);
      setBookingStatus({
        type: 'error',
        message: 'User information not found. Please log in again.'
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setBookingLoading(true);
    setBookingStatus({ type: 'loading', message: 'Booking appointment...' });

    try {
      const appointmentData = {
        userId: userId,
        hospitalId: formData.hospitalId,
        departmentId: formData.departmentId,
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime
      };

      console.log('Sending appointment data:', appointmentData);

      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await fetch('http://localhost:3500/api/user/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        setBookingStatus({ 
          type: 'success', 
          message: 'Appointment booked successfully! It will be completed in 1 minute and moved to Previous Treatments.' 
        });
        
        setTimeout(() => {
          navigate('/patient');
        }, 2000);
        
      } else {
        console.error('Backend returned error:', data);
        throw new Error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setBookingStatus({ 
        type: 'error', 
        message: `Error: ${err.message}` 
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // Show loading overlay during initial data fetch
  if (loading) {
    return <LoadingOverlay message="Loading appointment data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with navigation and debug tools */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToProfile}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Back to patient profile"
              >
                <FaArrowLeft />
                <span>Back to Profile</span>
              </button>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Book Appointment</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Debug and user information section */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                User ID: {getUserId() ? getUserId().substring(0, 8) + '...' : 'Not found'}
              </div>
              <button
                onClick={testBackendConnection}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Test backend connection"
              >
                Test Backend
              </button>
              <button
                onClick={testExpireAppointments}
                className="px-3 py-1 text-sm bg-yellow-200 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-600"
                aria-label="Test appointment expiration service"
              >
                Test Expire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main appointment booking interface */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointment booking form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              {/* Booking status messages */}
              {bookingStatus && (
                <div className={`mb-6 p-4 rounded-lg ${
                  bookingStatus.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : bookingStatus.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                }`}>
                  <div className="flex items-center space-x-3">
                    {bookingStatus.type === 'success' && <FaCheck className="text-green-600 dark:text-green-400" />}
                    {bookingStatus.type === 'error' && <FaExclamationTriangle className="text-red-600 dark:text-red-400" />}
                    {bookingStatus.type === 'loading' && <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400" />}
                    <p className={`font-medium ${
                      bookingStatus.type === 'success' 
                        ? 'text-green-800 dark:text-green-300'
                        : bookingStatus.type === 'error'
                        ? 'text-red-800 dark:text-red-300'
                        : 'text-blue-800 dark:text-blue-300'
                    }`}>
                      {bookingStatus.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Appointment booking form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location selection */}
                <FormField
                  label="Location"
                  name="location"
                  type="select"
                  value={formData.location}
                  onChange={handleInputChange}
                  options={locations}
                  required
                  icon={FaMapMarkerAlt}
                  disabled={loading}
                />

                {/* Hospital selection */}
                <FormField
                  label="Hospital"
                  name="hospitalId"
                  type="select"
                  value={formData.hospitalId}
                  onChange={handleInputChange}
                  options={hospitals}
                  required
                  icon={FaHospital}
                  disabled={!formData.location || loading}
                />

                {/* Department selection */}
                <FormField
                  label="Department"
                  name="departmentId"
                  type="select"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  options={departments}
                  required
                  icon={FaStethoscope}
                  disabled={!formData.hospitalId || loading}
                />

                {/* Doctor selection */}
                <FormField
                  label="Doctor"
                  name="doctorId"
                  type="select"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  options={availableDoctors}
                  required
                  icon={FaUserMd}
                  disabled={!formData.departmentId || doctorsLoading}
                  loading={doctorsLoading}
                />

                {/* Date selection */}
                <FormField
                  label="Appointment Date"
                  name="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={handleDateChange}
                  required
                  icon={FaCalendarDay}
                  disabled={!formData.doctorId || loading}
                  min={new Date().toISOString().split('T')[0]}
                />

                {/* Time slot selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaClock className="inline-block mr-2" />
                    Select Time Slot
                    {slotsLoading && <FaSpinner className="animate-spin inline-block ml-2" />}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableSlots.length === 0 && !slotsLoading ? (
                      <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                        {formData.appointmentDate ? 'No available slots for selected date' : 'Select a date to view available slots'}
                      </p>
                    ) : (
                      availableSlots.map((slot) => (
                        <TimeSlotButton
                          key={slot.startTime}
                          time={slot.startTime}
                          isAvailable={slot.isAvailable}
                          isSelected={formData.appointmentTime === slot.startTime}
                          onClick={() => handleTimeSlotSelect(slot)}
                          disabled={!slot.isAvailable}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    className="w-full"
                    loading={bookingLoading}
                    disabled={!isFormValid() || bookingLoading}
                    aria-label="Book appointment"
                  >
                    Book Appointment
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Appointment summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                Appointment Summary
              </h2>
              
              <div className="space-y-4">
                {/* Location summary */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {formData.location || 'Not selected'}
                    </p>
                  </div>
                </div>

                {/* Hospital summary */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <FaHospital className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hospital</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {hospitals.find(h => h.value === formData.hospitalId)?.label || 'Not selected'}
                    </p>
                  </div>
                </div>

                {/* Department summary */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <FaStethoscope className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {departments.find(d => d.value === formData.departmentId)?.label || 'Not selected'}
                    </p>
                  </div>
                </div>

                {/* Doctor summary */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <FaUserMd className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {availableDoctors.find(d => d.value === formData.doctorId)?.label || 'Not selected'}
                    </p>
                  </div>
                </div>

                {/* Date & time summary */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <FaCalendarDay className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {formData.appointmentDate && formData.appointmentTime
                        ? `${new Date(formData.appointmentDate).toLocaleDateString()} at ${formData.appointmentTime}`
                        : 'Not selected'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient information section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Patient Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-white font-medium">
                    {user?.name} {user?.surname}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                  {user?.age && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Age: {user.age} • Blood Group: {user.bloodGroup || 'Not specified'}
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      User ID: {getUserId() ? getUserId().substring(0, 12) + '...' : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;