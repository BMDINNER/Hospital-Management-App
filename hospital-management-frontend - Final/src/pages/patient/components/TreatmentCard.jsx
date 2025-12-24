import React from 'react';
import Button from '../../../components/common/Button';
import { 
  FaHospital, 
  FaStethoscope, 
  FaUserMd, 
  FaCalendarDay,
  FaClock,
  FaCheckCircle,
  FaFilePrescription,
  FaExclamationTriangle
} from 'react-icons/fa';

/**
 * TreatmentCard component displays details of a completed medical appointment.
 * 
 * This card presents a comprehensive overview of a past medical treatment,
 * including hospital information, doctor details, appointment scheduling,
 * and prescription status. It provides visual indicators for completion status
 * and offers functionality to generate prescriptions when needed.
 * 
 * The component features a responsive design that adapts to different screen sizes
 * and supports both light and dark mode themes.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Treatment} props.treatment - Treatment data object containing appointment details
 * @param {Prescription|null} props.prescription - Associated prescription object or null if not available
 * @param {Function} props.onGeneratePrescription - Callback function to generate a new prescription
 * @param {Function} props.formatDate - Utility function to format date display
 * @returns {React.ReactElement} A card component displaying treatment information
 * 
 * @typedef {Object} Treatment
 * @property {string} _id - Unique identifier for the treatment
 * @property {string} hospitalName - Name of the healthcare facility
 * @property {string} department - Medical department or specialty
 * @property {string} doctorName - Name of the treating physician
 * @property {string|Date} appointmentDate - Date of the appointment
 * @property {string} appointmentTime - Time of the appointment
 * 
 * @typedef {Object} Prescription
 * @property {Array} medications - List of prescribed medications
 * 
 * @example
 * // Example usage in a parent component
 * <TreatmentCard
 *   treatment={{
 *     _id: '12345',
 *     hospitalName: 'City General Hospital',
 *     department: 'Cardiology',
 *     doctorName: 'Dr. Sarah Johnson',
 *     appointmentDate: '2024-01-15',
 *     appointmentTime: '10:30 AM'
 *   }}
 *   prescription={prescriptionData}
 *   onGeneratePrescription={handleGeneratePrescription}
 *   formatDate={formatDateFunction}
 * />
 */
const TreatmentCard = ({ 
  treatment, 
  prescription,
  onGeneratePrescription,
  formatDate 
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Main content container */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          
          {/* Hospital information section with completion indicator */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {treatment.hospitalName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Appointment</p>
            </div>
          </div>

          {/* Treatment details grid - responsive layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            
            {/* Department information */}
            <div className="flex items-center space-x-2">
              <FaStethoscope className="w-4 h-4 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Department</span>
                <p className="text-gray-600 dark:text-gray-400">{treatment.department}</p>
              </div>
            </div>

            {/* Doctor information */}
            <div className="flex items-center space-x-2">
              <FaUserMd className="w-4 h-4 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Doctor</span>
                <p className="text-gray-600 dark:text-gray-400">{treatment.doctorName}</p>
              </div>
            </div>

            {/* Appointment date */}
            <div className="flex items-center space-x-2">
              <FaCalendarDay className="w-4 h-4 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Date</span>
                <p className="text-gray-600 dark:text-gray-400">{formatDate(treatment.appointmentDate)}</p>
              </div>
            </div>

            {/* Appointment time */}
            <div className="flex items-center space-x-2">
              <FaClock className="w-4 h-4 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Time</span>
                <p className="text-gray-600 dark:text-gray-400">{treatment.appointmentTime}</p>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center space-x-2">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
              Completed
            </span>
          </div>

          {/* Prescription status section */}
          {prescription ? (
            // Prescription available state
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <FaFilePrescription className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Prescription Available
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {prescription.medications?.length || 0} medications prescribed
              </p>
            </div>
          ) : (
            // No prescription state with generation option
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaExclamationTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                    No Prescription
                  </span>
                </div>
                <Button
                  onClick={() => onGeneratePrescription(treatment._id)}
                  variant="success"
                  size="small"
                  className="flex items-center gap-2"
                >
                  <FaFilePrescription />
                  Generate Prescription
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatmentCard;