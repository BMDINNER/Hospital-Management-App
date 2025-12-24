import React from 'react';
import { FaHospital, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

/**
 * Login Header Component
 * 
 * Displays the header section for authentication forms (login/register).
 * Shows appropriate title, subtitle, and icon based on current form type.
 * Provides visual branding and clear form identification.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.isLogin - Whether the form is for login (true) or registration (false)
 * 
 * @returns {JSX.Element} Form header with icon, title, and subtitle
 * 
 * @example
 * // Usage in login form:
 * <LoginHeader isLogin={true} />
 * 
 * @example
 * // Usage in registration form:
 * <LoginHeader isLogin={false} />
 * 
 * @note Uses hospital icon for consistent branding
 * @note Dynamic text and icons based on form type
 * @note Responsive centering and spacing
 * @note Supports dark mode via Tailwind CSS classes
 */
const LoginHeader = ({ isLogin }) => {
  return (
    <div className="text-center mb-8" role="banner">
      {/* Hospital branding icon */}
      <div className="flex justify-center mb-4">
        <div 
          className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <FaHospital className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      {/* Dynamic title based on form type */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>
      
      {/* Dynamic subtitle with icon */}
      <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center justify-center gap-2">
        {isLogin ? (
          <>
            <FaSignInAlt className="w-4 h-4" aria-hidden="true" />
            Sign in to your account
          </>
        ) : (
          <>
            <FaUserPlus className="w-4 h-4" aria-hidden="true" />
            Join us today
          </>
        )}
      </p>
    </div>
  );
};

export default LoginHeader;