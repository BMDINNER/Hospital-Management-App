import React from 'react';
import { FaSpinner } from 'react-icons/fa';

/**
 * Loading Overlay Component
 * 
 * Full-screen overlay that displays a loading indicator with optional message.
 * Used to indicate background processing, data fetching, or any async operation.
 * Centered modal design with semi-transparent background.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} [props.message='Loading...'] - Loading message text
 * @param {boolean} [props.show=true] - Whether to show the overlay
 * 
 * @returns {JSX.Element|null} Loading overlay or null if not showing
 * 
 * @example
 * // Basic usage with default message:
 * <LoadingOverlay />
 * 
 * @example
 * // Custom message:
 * <LoadingOverlay message="Fetching user data..." />
 * 
 * @example
 * // Conditionally show overlay:
 * <LoadingOverlay show={isLoading} message="Processing appointment..." />
 * 
 * @note Uses fixed positioning to cover entire viewport
 * @note Includes dark mode support via Tailwind CSS classes
 * @note High z-index ensures visibility above other content
 * @note Smooth spinner animation for better user experience
 */
const LoadingOverlay = ({ message = 'Loading...', show = true }) => {
  // Return null if overlay should not be shown
  if (!show) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="alert"
      aria-busy="true"
      aria-live="polite"
      aria-label={message}
    >
      {/* Loading modal container */}
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl min-w-64"
        role="presentation"
      >
        <div className="flex items-center space-x-3">
          {/* Animated spinner icon */}
          <FaSpinner 
            className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" 
            aria-hidden="true"
          />
          {/* Loading message */}
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;