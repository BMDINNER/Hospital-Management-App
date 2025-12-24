import React from 'react';
import FormField from '../../../components/common/FormField';
import PasswordStrength from './PasswordStrength';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaVenusMars, 
  FaRulerVertical, 
  FaWeight, 
  FaBirthdayCake, 
  FaTint,
  FaHeartbeat, 
  FaAllergies 
} from 'react-icons/fa';

/**
 * Registration Form Fields Component
 * 
 * Comprehensive form component for user registration with three sections:
 * 1. Personal Information (name, gender)
 * 2. Medical Information (height, weight, age, blood group, allergies)
 * 3. Account Information (email, password with strength indicator)
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.formData - Current form values
 * @param {Function} props.handleInputChange - Input change handler function
 * @param {Object} [props.errors={}] - Validation error messages
 * @param {boolean} [props.loading=false] - Loading state for form submission
 * 
 * @returns {JSX.Element} Complete registration form with all required fields
 * 
 * @example
 * // Usage in a registration form:
 * const RegistrationForm = () => {
 *   const [formData, setFormData] = useState(initialFormData);
 *   
 *   return (
 *     <RegisterFormFields
 *       formData={formData}
 *       handleInputChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
 *       errors={validationErrors}
 *       loading={isSubmitting}
 *     />
 *   );
 * };
 * 
 * @note Organized into color-coded sections for better UX
 * @note Includes password strength indicator with real-time feedback
 * @note Medical information section for hospital system requirements
 * @note Uses consistent FormField component for all inputs
 * @note Dark mode support for all sections
 */
const RegisterFormFields = ({ 
  formData, 
  handleInputChange, 
  errors = {}, 
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

  /**
   * Blood group options for medical records
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
    <div className="space-y-4" aria-label="Registration form sections">
      
      {/* Section 1: Personal Information */}
      <section 
        className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
        aria-labelledby="personal-info-heading"
      >
        <h3 
          id="personal-info-heading"
          className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"
        >
          <FaUser className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            icon={FaUser}
            placeholder="Enter first name"
            error={errors?.name || ''}
            loading={loading}
            aria-describedby={errors?.name ? "name-error" : undefined}
          />

          <FormField
            label="Last Name"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            required
            icon={FaUser}
            placeholder="Enter last name"
            error={errors?.surname || ''}
            loading={loading}
            aria-describedby={errors?.surname ? "surname-error" : undefined}
          />
        </div>

        <FormField
          label="Gender"
          name="gender"
          type="select"
          value={formData.gender}
          onChange={handleInputChange}
          options={genderOptions}
          icon={FaVenusMars}
          loading={loading}
          aria-describedby="gender-description"
        />
        <p id="gender-description" className="sr-only">
          Select your gender identity
        </p>
      </section>

      {/* Section 2: Medical Information */}
      <section 
        className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
        aria-labelledby="medical-info-heading"
      >
        <h3 
          id="medical-info-heading"
          className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"
        >
          <FaHeartbeat className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
          Medical Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleInputChange}
            icon={FaRulerVertical}
            placeholder="e.g., 170"
            error={errors?.height || ''}
            loading={loading}
            aria-describedby="height-description"
          />
          <p id="height-description" className="sr-only">
            Height in centimeters
          </p>

          <FormField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleInputChange}
            icon={FaWeight}
            placeholder="e.g., 65"
            error={errors?.weight || ''}
            loading={loading}
            aria-describedby="weight-description"
          />
          <p id="weight-description" className="sr-only">
            Weight in kilograms
          </p>
        </div>

        <FormField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleInputChange}
          icon={FaBirthdayCake}
          placeholder="e.g., 25"
          error={errors?.age || ''}
          loading={loading}
          aria-describedby="age-description"
        />
        <p id="age-description" className="sr-only">
          Age in years
        </p>

        <FormField
          label="Blood Group"
          name="bloodGroup"
          type="select"
          value={formData.bloodGroup}
          onChange={handleInputChange}
          options={bloodGroupOptions}
          icon={FaTint}
          loading={loading}
          aria-describedby="bloodgroup-description"
        />
        <p id="bloodgroup-description" className="sr-only">
          Your blood type for medical records
        </p>

        <FormField
          label="Allergies"
          name="allergies"
          value={formData.allergies}
          onChange={handleInputChange}
          icon={FaAllergies}
          placeholder="List any allergies..."
          loading={loading}
          aria-describedby="allergies-description"
        />
        <p id="allergies-description" className="sr-only">
          List any known allergies or medical conditions
        </p>
      </section>

      {/* Section 3: Account Information */}
      <section 
        className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg"
        aria-labelledby="account-info-heading"
      >
        <h3 
          id="account-info-heading"
          className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2"
        >
          <FaLock className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          Account Information
        </h3>
        
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          icon={FaEnvelope}
          placeholder="Enter your email"
          error={errors?.email || ''}
          loading={loading}
          aria-describedby={errors?.email ? "email-error" : "email-description"}
        />
        <p id="email-description" className="sr-only">
          Your email address for account login
        </p>

        {/* Password field with strength indicator */}
        <div className="mb-6">
          <div className="relative">
            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              icon={FaLock}
              placeholder="Create a strong password"
              showPasswordToggle={true}
              error={errors?.password || ''}
              loading={loading}
              aria-describedby="password-strength-indicator"
            />
            {/* Password strength visualizer */}
            {formData.password && (
              <div 
                id="password-strength-indicator"
                className="mt-2"
              >
                <PasswordStrength password={formData.password} />
              </div>
            )}
          </div>
        </div>

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          icon={FaLock}
          placeholder="Confirm your password"
          showPasswordToggle={true}
          error={errors?.confirmPassword || ''}
          loading={loading}
          aria-describedby={errors?.confirmPassword ? "confirm-password-error" : "confirm-password-description"}
        />
        <p id="confirm-password-description" className="sr-only">
          Re-enter your password to confirm
        </p>
      </section>
    </div>
  );
};

export default RegisterFormFields;