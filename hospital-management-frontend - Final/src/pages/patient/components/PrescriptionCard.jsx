import React from 'react';
import { 
  FaHospital, 
  FaUserMd, 
  FaStethoscope,
  FaCalendarDay,
  FaClock,
  FaCapsules
} from 'react-icons/fa';

/**
 * Prescription Card Component
 * 
 * Displays detailed prescription information in a structured card format.
 * Shows hospital and doctor details, diagnosis, medications, and follow-up information.
 * Used in patient history and previous treatments sections.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.prescription - Prescription data object
 * @param {string} props.prescription._id - Prescription identifier
 * @param {string} props.prescription.appointmentId - Associated appointment ID
 * @param {string} props.prescription.hospitalName - Prescribing hospital
 * @param {string} props.prescription.doctorName - Prescribing physician
 * @param {string} props.prescription.department - Medical department
 * @param {Date|string} props.prescription.appointmentDate - Appointment date
 * @param {string} props.prescription.appointmentTime - Appointment time
 * @param {string} props.prescription.diagnosis - Medical diagnosis
 * @param {string} props.prescription.instructions - General instructions
 * @param {Array<Object>} props.prescription.medications - Prescribed medications array
 * @param {string} props.prescription.medications[].name - Medication brand name
 * @param {string} props.prescription.medications[].genericName - Generic name
 * @param {string} props.prescription.medications[].dosage - Prescribed dosage
 * @param {string} props.prescription.medications[].frequency - Administration frequency
 * @param {string} props.prescription.medications[].duration - Treatment duration
 * @param {string} props.prescription.medications[].instructions - Special instructions
 * @param {Date|string} props.prescription.followUpDate - Recommended follow-up date
 * @param {Date|string} props.prescription.prescribedAt - Prescription creation timestamp
 * @param {Function} props.formatDate - Date formatting utility function
 * 
 * @returns {JSX.Element} Prescription details card
 * 
 * @example
 * // Usage in prescriptions list:
 * const prescriptionsList = prescriptions.map(prescription => (
 *   <PrescriptionCard
 *     key={prescription._id}
 *     prescription={prescription}
 *     formatDate={formatDate}
 *   />
 * ));
 * 
 * @note Organized into logical sections: header, diagnosis, instructions, medications
 * @note Visual separation with icons for different information types
 * @note Responsive grid layout for diagnosis and instructions
 * @note Medication list with detailed dosage information
 * @note Follow-up date display when available
 */
const PrescriptionCard = ({ 
  prescription, 
  formatDate 
}) => {
  return (
    <article 
      key={prescription._id || prescription.appointmentId}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
      aria-label={`Prescription from ${prescription.doctorName} at ${prescription.hospitalName}`}
    >
      {/* Header with hospital/doctor info and status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
            {prescription.hospitalName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <FaUserMd aria-hidden="true" />  {prescription.doctorName} • <FaStethoscope aria-hidden="true" /> {prescription.department}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
            <FaCalendarDay aria-hidden="true" /> {formatDate(prescription.appointmentDate)} • <FaClock aria-hidden="true" /> {prescription.appointmentTime}
          </p>
        </div>
        <span 
          className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
          aria-label="Prescription status: Prescribed"
        >
          Prescribed
        </span>
      </div>

      {/* Diagnosis and instructions side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Diagnosis</h4>
          <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            {prescription.diagnosis || 'No diagnosis recorded'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Instructions</h4>
          <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            {prescription.instructions || 'No specific instructions'}
          </p>
        </div>
      </div>

      {/* Medications list */}
      {prescription.medications && prescription.medications.length > 0 && (
        <div className="mt-4">
          <h4 
            className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
            id={`medications-heading-${prescription._id}`}
          >
            <FaCapsules aria-hidden="true" /> Medications ({prescription.medications.length})
          </h4>
          <div 
            className="space-y-2"
            aria-labelledby={`medications-heading-${prescription._id}`}
          >
            {prescription.medications.map((med, medIndex) => (
              <div 
                key={medIndex} 
                className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                role="listitem"
              >
                <div>
                  <span className="font-medium text-gray-800 dark:text-white">{med.name}</span>
                  {med.genericName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generic: {med.genericName}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Dosage:</strong> {med.dosage}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Frequency:</strong> {med.frequency}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Duration:</strong> {med.duration}
                  </p>
                  {med.instructions && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Instructions:</strong> {med.instructions}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up information */}
      {prescription.followUpDate && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Follow-up</h4>
          <p className="text-gray-600 dark:text-gray-400">
            Recommended follow-up: {formatDate(prescription.followUpDate)}
          </p>
        </div>
      )}

      {/* Prescription metadata */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Prescribed on: {prescription.prescribedAt ? new Date(prescription.prescribedAt).toLocaleDateString() : 'Not specified'}
        </p>
      </div>
    </article>
  );
};

export default PrescriptionCard;