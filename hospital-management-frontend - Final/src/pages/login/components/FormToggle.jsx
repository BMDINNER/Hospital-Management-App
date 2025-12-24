import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

/**
 * Form Toggle Component
 * 
 * Provides a toggle button for switching between login and registration forms.
 * Offers clear visual indication of current state and available action.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.isLogin - Current form state (true for login, false for register)
 * @param {Function} props.onToggle - Toggle handler function
 * 
 * @returns {JSX.Element} Form toggle button with dynamic text
 * 
 * @example
 * // Usage in authentication form:
 * const [isLogin, setIsLogin] = useState(true);
 * 
 * return (
 *   <FormToggle 
 *     isLogin={isLogin}
 *     onToggle={() => setIsLogin(!isLogin)}
 *   />
 * );
 * 
 * @note Uses exchange icon to visually indicate switching action
 * @note Dynamic text based on current form state
 * @note Accessible with descriptive ARIA labels
 * @note Consistent with dark/light theme colors
 */
const FormToggle = ({ isLogin, onToggle }) => {
  /**
   * Determine ARIA label based on current state
   * 
   * @private
   * @function getAriaLabel
   * @returns {string} Accessible label for screen readers
   */
  const getAriaLabel = () => {
    return isLogin 
      ? "Switch to registration form" 
      : "Switch to login form";
  };

  /**
   * Get dynamic button text based on current state
   * 
   * @private
   * @function getButtonText
   * @returns {string} Button text content
   */
  const getButtonText = () => {
    return isLogin 
      ? "Don't have an account? Sign up" 
      : "Already have an account? Sign in";
  };

  return (
    <div className="mt-6 text-center">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
        aria-label={getAriaLabel()}
        aria-expanded={!isLogin}
      >
        {/* Exchange icon indicating toggle action */}
        <FaExchangeAlt 
          className="w-4 h-4" 
          aria-hidden="true"
        />
        {/* Dynamic text based on current state */}
        <span>{getButtonText()}</span>
      </button>
    </div>
  );
};

export default FormToggle;