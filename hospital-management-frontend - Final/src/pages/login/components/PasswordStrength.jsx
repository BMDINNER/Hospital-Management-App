import React from 'react';
import { 
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle 
} from 'react-icons/fa';

/**
 * Password Strength Indicator Component
 * 
 * Visual feedback component that evaluates password strength based on common security criteria.
 * Displays progress bar, requirement checklist, and improvement tips.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.password - Password string to evaluate
 * 
 * @returns {JSX.Element} Password strength visualization with detailed feedback
 * 
 * @example
 * // Usage with password field:
 * const [password, setPassword] = useState('');
 * 
 * return (
 *   <div>
 *     <input 
 *       type="password" 
 *       value={password} 
 *       onChange={(e) => setPassword(e.target.value)}
 *     />
 *     <PasswordStrength password={password} />
 *   </div>
 * );
 * 
 * @note Evaluates five common password security criteria
 * @note Provides real-time visual feedback as user types
 * @note Includes specific improvement suggestions
 * @note Color-coded strength levels for quick assessment
 * @note Accessible with semantic HTML and ARIA attributes
 */
const PasswordStrength = ({ password }) => {
  /**
   * Password validation criteria and descriptions
   * 
   * @constant {Array<Object>} checks
   * @property {string} label - Requirement description
   * @property {Function} test - Validation function
   * @property {string} description - Detailed explanation
   */
  const checks = [
    {
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8,
      description: 'Longer passwords are more secure'
    },
    {
      label: 'Contains uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
      description: 'Mix of uppercase and lowercase'
    },
    {
      label: 'Contains lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
      description: 'Mix of uppercase and lowercase'
    },
    {
      label: 'Contains number',
      test: (pwd) => /[0-9]/.test(pwd),
      description: 'Add numbers for strength'
    },
    {
      label: 'Contains special character',
      test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
      description: '!@#$%^&* etc.'
    }
  ];

  /**
   * Calculate password strength metrics
   * 
   * @constant {number} passedChecks - Number of passed criteria
   * @constant {number} totalChecks - Total number of criteria
   * @constant {number} percentage - Completion percentage
   */
  const passedChecks = checks.filter(check => check.test(password)).length;
  const totalChecks = checks.length;
  const percentage = (passedChecks / totalChecks) * 100;

  /**
   * Determine password strength level based on completion percentage
   * 
   * @private
   * @function getStrengthLevel
   * @returns {Object} Strength level details
   * @returns {number} level - Numeric strength level (0-5)
   * @returns {string} text - Descriptive strength label
   * @returns {string} color - Text color class
   * @returns {string} bg - Background color class for progress bar
   */
  const getStrengthLevel = () => {
    if (password.length === 0) return { level: 0, text: 'No password', color: 'text-gray-500', bg: 'bg-gray-200' };
    if (percentage < 40) return { level: 1, text: 'Very Weak', color: 'text-red-600', bg: 'bg-red-500' };
    if (percentage < 60) return { level: 2, text: 'Weak', color: 'text-orange-600', bg: 'bg-orange-500' };
    if (percentage < 80) return { level: 3, text: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-500' };
    if (percentage < 95) return { level: 4, text: 'Good', color: 'text-blue-600', bg: 'bg-blue-500' };
    return { level: 5, text: 'Strong', color: 'text-green-600', bg: 'bg-green-500' };
  };

  const strength = getStrengthLevel();

  return (
    <div 
      className="mt-2 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
      role="region"
      aria-label="Password strength indicator"
    >
      {/* Strength header with summary */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {strength.level >= 4 ? (
            <FaCheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
          ) : (
            <FaExclamationTriangle className="w-4 h-4 text-yellow-500" aria-hidden="true" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Strength: <span className={strength.color}>{strength.text}</span>
          </span>
        </div>
        <span 
          className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded"
          aria-label={`${passedChecks} out of ${totalChecks} requirements met`}
        >
          {passedChecks}/{totalChecks}
        </span>
      </div>
      
      {/* Visual progress bar */}
      <div 
        className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mb-4 overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`Password strength: ${percentage}%`}
      >
        <div 
          className={`h-full rounded-full transition-all duration-300 ${strength.bg}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Detailed requirements checklist */}
      <div className="space-y-2">
        {checks.map((check, index) => {
          const passed = check.test(password);
          const checkId = `password-check-${index}`;
          
          return (
            <div 
              key={index} 
              className="flex items-start gap-2"
              role="listitem"
            >
              {passed ? (
                <FaCheckCircle 
                  className="w-3 h-3 text-green-500 mt-0.5 shrink-0" 
                  aria-hidden="true"
                />
              ) : (
                <FaTimesCircle 
                  className="w-3 h-3 text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" 
                  aria-hidden="true"
                />
              )}
              <div className="flex-1">
                <span 
                  className={`text-xs ${passed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                  id={checkId}
                >
                  {check.label}
                </span>
                <p 
                  className="text-xs text-gray-400 dark:text-gray-500 mt-0.5"
                  aria-describedby={checkId}
                >
                  {check.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Improvement suggestions for weak passwords */}
      {password.length > 0 && strength.level < 4 && (
        <div 
          className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
          role="region"
          aria-label="Password improvement suggestions"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Tip:</strong> Try adding {strength.level < 3 ? 'uppercase letters and numbers' : 'special characters (!@#$)'} to make your password stronger.
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;