import React from 'react';
import Button from '../../../components/common/Button';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Cancel Appointment Confirmation Modal
 * 
 * Modal dialog for confirming appointment cancellation.
 * Provides clear warning and requires explicit user confirmation.
 * Prevents accidental cancellations with a two-step process.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Modal visibility state
 * @param {Function} props.onClose - Close/cancel handler
 * @param {Object} props.appointment - Appointment to cancel
 * @param {string} props.appointment.doctorName - Doctor's name for confirmation
 * @param {string} props.appointment.hospitalName - Hospital name for confirmation
 * @param {Function} props.onConfirm - Confirmation handler
 * 
 * @returns {JSX.Element|null} Confirmation modal or null if not open
 * 
 * @example
 * // Usage in appointment management:
 * const [modalOpen, setModalOpen] = useState(false);
 * const [selectedAppointment, setSelectedAppointment] = useState(null);
 * 
 * return (
 *   <>
 *     <button onClick={() => {
 *       setSelectedAppointment(appointment);
 *       setModalOpen(true);
 *     }}>
 *       Cancel
 *     </button>
 *     <CancelAppointmentModal
 *       isOpen={modalOpen}
 *       onClose={() => setModalOpen(false)}
 *       appointment={selectedAppointment}
 *       onConfirm={() => {
 *         handleCancelAppointment(selectedAppointment._id);
 *         setModalOpen(false);
 *       }}
 *     />
 *   </>
 * );
 * 
 * @note Prevents accidental cancellations with explicit confirmation
 * @note Accessible with proper focus management (not shown but implied)
 * @note Dark mode compatible styling
 * @note Fixed positioning with overlay background
 * @note Clear visual hierarchy with warning icon
 */
const CancelAppointmentModal = ({ 
  isOpen, 
  onClose, 
  appointment, 
  onConfirm 
}) => {
  // Don't render anything if modal is not open
  if (!isOpen) return null;

  /**
   * Handle backdrop click to close modal
   * 
   * @private
   * @function handleBackdropClick
   * @param {React.MouseEvent<HTMLDivElement>} e - Click event
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Handle confirmation with appointment data
   * 
   * @private
   * @function handleConfirm
   */
  const handleConfirm = () => {
    if (appointment) {
      onConfirm(appointment);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      aria-describedby="cancel-modal-description"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
        {/* Modal header with warning icon */}
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 
            id="cancel-modal-title"
            className="text-xl font-bold text-gray-800 dark:text-white"
          >
            Cancel Appointment
          </h3>
        </div>
        
        {/* Confirmation message with appointment details */}
        <p 
          id="cancel-modal-description"
          className="text-gray-600 dark:text-gray-400 mb-6"
        >
          Are you sure you want to cancel your appointment with{' '}
          <span className="font-semibold"> {appointment?.doctorName}</span> at{' '}
          <span className="font-semibold">{appointment?.hospitalName}</span>?
        </p>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            variant="secondary"
            aria-label="Keep appointment"
            autoFocus
          >
            Keep Appointment
          </Button>
          <Button
            onClick={handleConfirm}
            variant="danger"
            className="flex items-center gap-2"
            aria-label={`Confirm cancellation with ${appointment?.doctorName}`}
          >
            <FaExclamationTriangle aria-hidden="true" />
            Yes, Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;