import React from 'react';
import Button from '../../../components/common/Button';
import { 
  FaHospital, 
  FaStethoscope, 
  FaUserMd, 
  FaCalendarDay,
  FaClock,
  FaMapMarkerAlt,
  FaTimesCircle
} from 'react-icons/fa';

/**
 * Appointment Card Component
 * 
 * Displays individual appointment details in a structured card format.
 * Shows hospital information, department, doctor, date/time, and status.
 * Provides cancellation functionality for confirmed appointments.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.appointment - Appointment data object
 * @param {string} props.appointment._id - Appointment identifier
 * @param {string} props.appointment.hospitalName - Hospital name
 * @param {string} props.appointment.location - Hospital location
 * @param {string} props.appointment.status - Appointment status
 * @param {string} props.appointment.department - Medical department
 * @param {string} props.appointment.doctorName - Doctor name
 * @param {Date|string} props.appointment.appointmentDate - Scheduled date
 * @param {string} props.appointment.appointmentTime - Scheduled time
 * @param {Date|string} props.appointment.createdAt - Creation timestamp
 * @param {Function} props.onCancel - Cancel appointment handler
 * @param {Function} props.formatDate - Date formatting utility
 * @param {Function} props.formatTimeRemaining - Time remaining formatter
 * 
 * @returns {JSX.Element} Appointment card with detailed information
 * 
 * @example
 * // Usage in appointment list:
 * const appointmentList = appointments.map(apt => (
 *   <AppointmentCard
 *     key={apt._id}
 *     appointment={apt}
 *     onCancel={handleCancel}
 *     formatDate={formatDate}
 *     formatTimeRemaining={formatRemaining}
 *   />
 * ));
 * 
 * @note Color-coded status badges for visual recognition
 * @note Responsive grid layout for appointment details
 * @note Conditional cancel button for confirmed appointments only
 * @note Icon-based visual indicators for each information category
 * @note Dark mode support for all UI elements
 */
const AppointmentCard = ({ 
  appointment, 
  onCancel,
  formatDate,
  formatTimeRemaining
}) => {
  /**
   * Get CSS classes for status badge based on appointment status
   * 
   * @private
   * @function getStatusColor
   * @param {string} status - Appointment status
   * @returns {string} Tailwind CSS classes for styling
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      case 'completed':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    }
  };

  return (
    <article 
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
      aria-label={`Appointment at ${appointment.hospitalName} with ${appointment.doctorName}`}
    >
      {/* Header with hospital info and status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div 
              className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
              aria-hidden="true"
            >
              <FaHospital className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {appointment.hospitalName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <FaMapMarkerAlt className="w-3 h-3" aria-hidden="true" />
                {appointment.location}
              </p>
            </div>
          </div>
        </div>
        <span 
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}
          aria-label={`Status: ${appointment.status}`}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>

      {/* Appointment details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Department information */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            <FaStethoscope className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
            <p className="font-medium text-gray-800 dark:text-white">{appointment.department}</p>
          </div>
        </div>

        {/* Doctor information */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            <FaUserMd className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
            <p className="font-medium text-gray-800 dark:text-white">{appointment.doctorName}</p>
          </div>
        </div>

        {/* Date and time information */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            <FaCalendarDay className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
            </p>
          </div>
        </div>
      </div>

      {/* Footer with creation date and cancel button */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <FaClock className="w-4 h-4" aria-hidden="true" />
          <span>
            Created: {appointment.createdAt ? new Date(appointment.createdAt).toLocaleDateString() : 'Unknown'}
          </span>
        </div>
        
        {/* Conditional cancel button for confirmed appointments */}
        {appointment.status === 'confirmed' && (
          <Button
            onClick={() => onCancel(appointment)}
            variant="danger"
            size="small"
            className="flex items-center gap-2"
            aria-label={`Cancel appointment with ${appointment.doctorName}`}
          >
            <FaTimesCircle aria-hidden="true" />
            Cancel Appointment
          </Button>
        )}
      </div>
    </article>
  );
};

export default AppointmentCard;