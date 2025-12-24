import React from 'react';
import { FaShieldAlt, FaHeartbeat, FaClock } from 'react-icons/fa';

/**
 * Form Footer Component
 * 
 * Displays feature highlights and trust indicators below authentication forms.
 * Provides visual reassurance and communicates system benefits to users.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.isLogin - Whether the parent form is login (vs registration)
 * 
 * @returns {JSX.Element} Three-column feature highlights section
 * 
 * @example
 * // Usage in login form:
 * <FormFooter isLogin={true} />
 * 
 * @example
 * // Usage in registration form:
 * <FormFooter isLogin={false} />
 * 
 * @note Uses consistent icon and color scheme for visual harmony
 * @note Supports dark mode via Tailwind CSS classes
 * @note Responsive grid layout for different screen sizes
 */
const FormFooter = ({ isLogin }) => {
  return (
    <div 
      className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
      aria-label="System features and benefits"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {/* Security feature */}
        <div 
          className="flex flex-col items-center"
          role="region"
          aria-label="Security and privacy feature"
        >
          <div 
            className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2"
            aria-hidden="true"
          >
            <FaShieldAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Secure & Private
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your data is protected
          </p>
        </div>

        {/* Accessibility feature */}
        <div 
          className="flex flex-col items-center"
          role="region"
          aria-label="24/7 access feature"
        >
          <div 
            className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2"
            aria-hidden="true"
          >
            <FaHeartbeat className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            24/7 Access
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage health anytime
          </p>
        </div>

        {/* Convenience feature */}
        <div 
          className="flex flex-col items-center"
          role="region"
          aria-label="Quick appointments feature"
        >
          <div 
            className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2"
            aria-hidden="true"
          >
            <FaClock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Quick Appointments
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Book in minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormFooter;