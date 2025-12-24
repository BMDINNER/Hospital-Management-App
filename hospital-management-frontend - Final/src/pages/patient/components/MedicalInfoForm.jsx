import React from 'react';
import FormField from '../../../components/common/FormField';
import { FaWeight, FaRulerVertical, FaTint, FaAllergies } from 'react-icons/fa';

/**
 * Medical Information Form Component
 * 
 * Form section for displaying and editing patient medical information.
 * Includes height, weight, age, blood group, and allergies fields.
 * Supports both view and edit modes with conditional disabling.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.formData - Medical information form values
 * @param {string|number} props.formData.height - Height in centimeters
 * @param {string|number} props.formData.weight - Weight in kilograms
 * @param {string|number} props.formData.age - Age in years
 * @param {string} props.formData.bloodGroup - Blood type classification
 * @param {string} props.formData.allergies - Known allergies list
 * @param {Function} props.onChange - Input change handler function
 * @param {boolean} props.isEditing - Whether form is in edit mode
 * @param {boolean} [props.loading=false] - Loading state for form submission
 * 
 * @returns {JSX.Element} Medical information form section
 * 
 * @example
 * // Usage in patient profile:
 * const PatientProfile = () => {
 *   const [medicalInfo, setMedicalInfo] = useState(patient.medicalData);
 *   const [isEditing, setIsEditing] = useState(false);
 *   
 *   return (
 *     <MedicalInfoForm
 *       formData={medicalInfo}
 *       onChange={(e) => setMedicalInfo({...medicalInfo, [e.target.name]: e.target.value})}
 *       isEditing={isEditing}
 *       loading={isUpdating}
 *     />
 *   );
 * };
 * 
 * @note Displays data in view mode, allows editing in edit mode
 * @note All fields become disabled when not in edit mode
 * @note Blood group field uses predefined options
 * @note Appropriate icons for each medical field
 * @note Responsive grid layout for height and weight fields
 */
const MedicalInfoForm = ({ 
  formData, 
  onChange, 
  isEditing, 
  loading = false 
}) => {
  /**
   * Blood group options for select field
   * 
   * @constant {Array<Object>}
   */
  const bloodGroupOptions = [
    { value: '', label: 'Select Blood Group' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  return (
    <section 
      className="space-y-4"
      aria-labelledby="medical-info-heading"
    >
      {/* Section header */}
      <h2 
        id="medical-info-heading"
        className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2"
      >
        Medical Information
      </h2>
      
      {/* Height and weight in responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Height (cm)"
          name="height"
          type="number"
          value={formData.height}
          onChange={onChange}
          disabled={!isEditing}
          icon={FaRulerVertical}
          loading={loading}
          aria-describedby={!isEditing ? "height-view-only" : undefined}
        />
        <p id="height-view-only" className="sr-only">
          Height field is view only. Enable edit mode to change.
        </p>

        <FormField
          label="Weight (kg)"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={onChange}
          disabled={!isEditing}
          icon={FaWeight}
          loading={loading}
          aria-describedby={!isEditing ? "weight-view-only" : undefined}
        />
        <p id="weight-view-only" className="sr-only">
          Weight field is view only. Enable edit mode to change.
        </p>
      </div>

      {/* Age field */}
      <FormField
        label="Age"
        name="age"
        type="number"
        value={formData.age}
        onChange={onChange}
        disabled={!isEditing}
        loading={loading}
        aria-describedby={!isEditing ? "age-view-only" : undefined}
      />
      <p id="age-view-only" className="sr-only">
        Age field is view only. Enable edit mode to change.
      </p>

      {/* Blood group selection */}
      <FormField
        label="Blood Group"
        name="bloodGroup"
        type="select"
        value={formData.bloodGroup}
        onChange={onChange}
        options={bloodGroupOptions}
        disabled={!isEditing}
        icon={FaTint}
        loading={loading}
        aria-describedby="bloodgroup-description"
      />
      <p id="bloodgroup-description" className="sr-only">
        Select your blood type from available options
      </p>

      {/* Allergies input */}
      <FormField
        label="Allergies"
        name="allergies"
        value={formData.allergies}
        onChange={onChange}
        placeholder="List any allergies..."
        disabled={!isEditing}
        icon={FaAllergies}
        loading={loading}
        aria-describedby="allergies-description"
      />
      <p id="allergies-description" className="sr-only">
        Enter any known allergies or medical conditions
      </p>
    </section>
  );
};

export default MedicalInfoForm;