import React from 'react';
import FormField from '../../../components/common/FormField';
import { FaEnvelope, FaLock } from 'react-icons/fa';

/**
 * Login Form Fields Component
 * 
 * Renders the input fields specific to the login form: email and password.
 * Provides consistent styling, validation error display, and loading states.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.formData - Current form values
 * @param {string} props.formData.email - Email input value
 * @param {string} props.formData.password - Password input value
 * @param {Function} props.handleInputChange - Input change handler function
 * @param {Object} [props.errors={}] - Validation error messages
 * @param {string} [props.errors.email] - Email validation error
 * @param {string} [props.errors.password] - Password validation error
 * @param {boolean} [props.loading=false] - Loading state for form submission
 * 
 * @returns {JSX.Element} Email and password form fields
 * 
 * @example
 * // Usage in a login form component:
 * const LoginForm = () => {
 *   const [formData, setFormData] = useState({ email: '', password: '' });
 *   const [errors, setErrors] = useState({});
 *   
 *   return (
 *     <LoginFormFields
 *       formData={formData}
 *       handleInputChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
 *       errors={errors}
 *       loading={isSubmitting}
 *     />
 *   );
 * };
 * 
 * @note Uses the reusable FormField component for consistency
 * @note Password field includes visibility toggle
 * @note Includes appropriate icons for each field type
 * @note Supports validation error display
 * @note Respects loading state for form submission
 */
const LoginFormFields = ({ 
  formData, 
  handleInputChange, 
  errors = {}, 
  loading = false 
}) => {
  return (
    <div className="space-y-4" aria-label="Login form fields">
      {/* Email input field */}
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
        aria-describedby={errors?.email ? "email-error" : undefined}
      />

      {/* Password input field with visibility toggle */}
      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        required
        icon={FaLock}
        placeholder="Enter your password"
        showPasswordToggle={true}
        error={errors?.password || ''}
        loading={loading}
        aria-describedby={errors?.password ? "password-error" : undefined}
      />
    </div>
  );
};

export default LoginFormFields;