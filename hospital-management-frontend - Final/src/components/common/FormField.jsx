import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Form Field Component
 * 
 * Reusable form input component supporting various input types,
 * validation states, icons, and accessibility features.
 * Includes password visibility toggle and loading states.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} [props.label] - Field label text
 * @param {string} props.name - Input name attribute
 * @param {string} [props.type='text'] - Input type (text, password, select, etc.)
 * @param {string|number} props.value - Current field value
 * @param {Function} props.onChange - Change event handler
 * @param {Array} [props.options=[]] - Options array for select inputs
 * @param {string} [props.placeholder=''] - Input placeholder text
 * @param {boolean} [props.required=false] - Required field indicator
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.loading=false] - Loading state for async options
 * @param {string} [props.error=''] - Validation error message
 * @param {string} [props.helpText=''] - Help text below input
 * @param {React.Component} [props.icon] - Icon component to display
 * @param {boolean} [props.showPasswordToggle=false] - Show password visibility toggle
 * @param {string} [props.className=''] - Additional CSS classes
 * 
 * @returns {JSX.Element} Form field with label, input, and optional states
 * 
 * @example
 * // Text input with icon
 * <FormField
 *   label="Email"
 *   name="email"
 *   type="email"
 *   value={email}
 *   onChange={handleChange}
 *   icon={FaEnvelope}
 *   required={true}
 *   placeholder="Enter your email"
 * />
 * 
 * @example
 * // Select input with loading state
 * <FormField
 *   label="Department"
 *   name="department"
 *   type="select"
 *   value={departmentId}
 *   onChange={handleChange}
 *   options={departments}
 *   loading={departmentsLoading}
 *   icon={FaStethoscope}
 * />
 * 
 * @example
 * // Password input with visibility toggle
 * <FormField
 *   label="Password"
 *   name="password"
 *   type="password"
 *   value={password}
 *   onChange={handleChange}
 *   showPasswordToggle={true}
 *   required={true}
 *   helpText="Minimum 8 characters"
 * />
 * 
 * @note Supports dark mode via Tailwind CSS classes
 * @note Accessible with proper ARIA labels and keyboard navigation
 * @note Loading state shows spinner and disables input
 */
const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder = '',
  required = false,
  disabled = false,
  loading = false,
  error = '',
  helpText = '',
  icon: Icon,
  showPasswordToggle = false,
  className = ''
}) => {
  /**
   * Password visibility state for password fields
   * 
   * @state {boolean} showPassword
   * @private
   */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Toggle password visibility
   * 
   * @private
   * @function togglePasswordVisibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Determine actual input type based on password visibility state
   * 
   * @constant {string} inputType
   * @private
   */
  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  return (
    <div className={`mb-6 ${className}`}>
      {/* Field label */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          {required && <span className="sr-only"> (required)</span>}
        </label>
      )}
      
      {/* Input container with icon and states */}
      <div className="relative">
        {/* Optional icon */}
        {Icon && (
          <div 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        {/* Select input type */}
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled || loading}
            required={required}
            className={`
              w-full border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:text-white transition-colors
              ${disabled || loading ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70' : ''}
              ${Icon ? 'pl-10 pr-4' : 'px-4'}
              py-3
              appearance-none
            `}
            aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
            aria-invalid={!!error}
            aria-busy={loading}
          >
            <option value="">Select {label?.toLowerCase() || 'option'}</option>
            {loading ? (
              <option disabled>Loading options...</option>
            ) : (
              options.map((option) => (
                <option 
                  key={option.value || option._id || option} 
                  value={option.value || option._id || option}
                >
                  {option.label || option.name || option}
                </option>
              ))
            )}
          </select>
        ) : (
          // Text input types (text, password, email, date, etc.)
          <input
            type={inputType}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            required={required}
            className={`
              w-full border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              dark:bg-gray-700 dark:text-white transition-colors
              ${disabled || loading ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70' : ''}
              ${Icon ? 'pl-10 pr-4' : 'px-4'}
              ${showPasswordToggle ? 'pr-10' : ''}
              py-3
            `}
            aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
            aria-invalid={!!error}
            aria-busy={loading}
          />
        )}
        
        {/* Password visibility toggle button */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls={name}
            disabled={disabled || loading}
          >
            {showPassword ? (
              <FaEyeSlash className="w-4 h-4" />
            ) : (
              <FaEye className="w-4 h-4" />
            )}
          </button>
        )}
        
        {/* Loading spinner for async operations */}
        {loading && !showPasswordToggle && (
          <div 
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            aria-hidden="true"
          >
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Help text (visible when no error) */}
      {helpText && !error && (
        <p 
          id={`${name}-help`}
          className="mt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          {helpText}
        </p>
      )}
      
      {/* Error message */}
      {error && (
        <p 
          id={`${name}-error`}
          className="mt-2 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;