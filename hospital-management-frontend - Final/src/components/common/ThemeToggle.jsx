import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

/**
 * Theme Toggle Component
 * 
 * Interactive button for switching between light and dark themes.
 * Uses smooth animations and visual feedback for theme transitions.
 * Fixed positioning ensures accessibility from any screen location.
 * 
 * @component
 * @returns {JSX.Element} Theme toggle button with animated icons
 * 
 * @example
 * // Basic usage:
 * <ThemeToggle />
 * 
 * @note Positioned fixed at top-right corner of viewport
 * @note Includes hover, active, and transition effects
 * @note Provides accessible labels for screen readers
 * @note Smooth icon transitions with rotation effects
 * @note High z-index ensures visibility above other content
 * 
 * @requires ThemeContext for theme state management
 * @requires react-icons for theme icons
 */
const ThemeToggle = () => {
  /**
   * Theme context providing current theme state and toggle function
   * 
   * @constant {Object} themeContext
   * @property {boolean} isDarkMode - Current theme state (true for dark mode)
   * @property {Function} toggleTheme - Function to switch between themes
   */
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDarkMode}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun icon (light mode) */}
        <MdLightMode 
          className={`w-5 h-5 text-yellow-500 transition-all duration-300 ${isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} 
          aria-hidden="true"
        />
        {/* Moon icon (dark mode) */}
        <MdDarkMode 
          className={`w-5 h-5 text-gray-700 dark:text-gray-300 absolute transition-all duration-300 ${!isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} 
          aria-hidden="true"
        />
      </div>
    </button>
  );
};

export default ThemeToggle;