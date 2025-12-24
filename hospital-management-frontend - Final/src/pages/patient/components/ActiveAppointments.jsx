import React from 'react';
import AppointmentCard from './AppointmentCard';
import LoadingOverlay from '../../../components/common/LoadingOverlay';
import { FaCalendarAlt } from 'react-icons/fa';

/**
 * Active Appointments Component
 * 
 * Displays a list of confirmed or upcoming appointments for the patient.
 * Shows appointment count and handles empty state with appropriate messaging.
 * Integrates individual appointment cards with cancellation functionality.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Array<Object>} props.appointments - Array of active appointment objects
 * @param {Function} props.onCancelAppointment - Cancel appointment handler function
 * @param {Function} props.formatAppointmentDate - Date formatting utility function
 * @param {Function} props.formatTimeRemaining - Time remaining formatting function
 * @param {boolean} [props.loading=false] - Loading state for appointments data
 * 
 * @returns {JSX.Element} Active appointments section with list or empty state
 * 
 * @example
 * // Usage in patient dashboard:
 * const PatientDashboard = () => {
 *   const [activeAppointments, setActiveAppointments] = useState([]);
 *   
 *   return (
 *     <ActiveAppointments
 *       appointments={activeAppointments}
 *       onCancelAppointment={handleCancel}
 *       formatAppointmentDate={formatDate}
 *       formatTimeRemaining={formatRemainingTime}
 *       loading={isLoadingAppointments}
 *     />
 *   );
 * };
 * 
 * @note Shows appointment count in section header
 * @note Provides visual empty state with icon and message
 * @note Passes formatting functions to child appointment cards
 * @note Responsive design with proper spacing
 * @note Dark mode support throughout
 */
const ActiveAppointments = ({ 
  appointments, 
  onCancelAppointment,
  formatAppointmentDate,
  formatTimeRemaining,
  loading = false 
}) => {
  // Show loading overlay while fetching data
  if (loading) {
    return <LoadingOverlay message="Loading appointments..." />;
  }

  return (
    <section 
      className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
      aria-label="Active appointments"
    >
      {/* Section header with appointment count */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Active Appointments ({appointments.length})
      </h2>
      
      {/* Empty state */}
      {appointments.length === 0 ? (
        <div 
          className="text-center py-12 text-gray-500 dark:text-gray-400"
          aria-live="polite"
        >
          <div 
            className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <FaCalendarAlt className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-lg mb-2">No active appointments</p>
          <p className="text-sm">Book your first appointment to get started</p>
        </div>
      ) : (
        /* Appointment list */
        <div 
          className="space-y-4"
          role="list"
          aria-label="List of active appointments"
        >
          {appointments.map((appointment, index) => (
            <AppointmentCard
              key={appointment._id || index}
              appointment={appointment}
              onCancel={onCancelAppointment}
              formatDate={formatAppointmentDate}
              formatTimeRemaining={formatTimeRemaining}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ActiveAppointments;