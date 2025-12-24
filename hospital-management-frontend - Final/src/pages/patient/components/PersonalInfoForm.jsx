import React from 'react';
import FormField from '../../../components/common/FormField';
import { FaUser, FaEnvelope, FaVenusMars } from 'react-icons/fa';

/**
 * Personal Information Form Component
 * 
 * Form section for displaying and editing basic personal information.
 * Includes name fields, email (read-only), and gender selection.
 * Supports both view and edit modes with appropriate field states.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.formData - Personal information form values
 * @param {string} props.formData.name - First/given name
 * @param {string} props.formData.surname - Last/family name
 * @param {string} props.formData.gender - Gender identity
 * @param {Function} props.onChange - Input change handler function
 * @param {boolean} props.isEditing - Whether form is in edit mode
 * @param {string} props.userEmail - User's email address (read-only)
 * @param {boolean} [props.loading=false] - Loading state for form submission
 * 
 * @returns {JSX.Element} Personal information form section
 * 
 * @example
 * // Usage in user profile:
 * const UserProfile = () => {
 *   const [personalInfo, setPersonalInfo] = useState(user.personalData);
 *   const [isEditing, setIsEditing] = useState(false);
 *   
 *   return (
 *     <PersonalInfoForm
 *       formData={personalInfo}
 *       onChange={(e) => setPersonalInfo({...personalInfo, [e.target.name]: e.target.value})}
 *       isEditing={isEditing}
 *       userEmail={user.email}
 *       loading={isUpdating}
 *     />
 *   );
 * };
 * 
 * @note Email field is always read-only for security reasons
 * @note All other fields become editable when isEditing is true
 * @note Gender selection uses inclusive options
 * @note Required fields indicated for name inputs
 * @note Consistent styling with other form sections
 */
const PersonalInfoForm = ({ 
  formData, 
  onChange, 
  isEditing, 
  userEmail,
  loading = false 
}) => {
  /**
   * Gender selection options with inclusive choices
   * 
   * @constant {Array<Object>}
   */
  const genderOptions = [
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <section 
      className="space-y-4"
      aria-labelledby="personal-info-heading"
    >
      {/* Section header */}
      <h2 
        id="personal-info-heading"
        className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2"
      >
        Personal Information
      </h2>
      
      {/* First name field */}
      <FormField
        label="First Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        disabled={!isEditing}
        required
        icon={FaUser}
        loading={loading}
        aria-describedby={!isEditing ? "name-view-only" : "name-description"}
      />
      <p id="name-view-only" className="sr-only">
        First name field is view only. Enable edit mode to change.
      </p>
      <p id="name-description" className="sr-only">
        Enter your first or given name
      </p>

      {/* Last name field */}
      <FormField
        label="Last Name"
        name="surname"
        value={formData.surname}
        onChange={onChange}
        disabled={!isEditing}
        required
        loading={loading}
        aria-describedby={!isEditing ? "surname-view-only" : "surname-description"}
      />
      <p id="surname-view-only" className="sr-only">
        Last name field is view only. Enable edit mode to change.
      </p>
      <p id="surname-description" className="sr-only">
        Enter your last or family name
      </p>

      {/* Email field (always read-only) */}
      <FormField
        label="Email"
        type="email"
        value={userEmail || ''}
        disabled
        icon={FaEnvelope}
        helpText="Email cannot be changed"
        aria-describedby="email-description"
      />
      <p id="email-description" className="sr-only">
        Your email address used for account login. This cannot be changed.
      </p>

      {/* Gender selection */}
      <FormField
        label="Gender"
        name="gender"
        type="select"
        value={formData.gender}
        onChange={onChange}
        options={genderOptions}
        disabled={!isEditing}
        icon={FaVenusMars}
        loading={loading}
        aria-describedby="gender-description"
      />
      <p id="gender-description" className="sr-only">
        Select your gender identity from available options
      </p>
    </section>
  );
};

export default PersonalInfoForm;