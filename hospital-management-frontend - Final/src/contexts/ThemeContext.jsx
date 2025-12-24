import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme Context for managing dark/light mode across the application.
 * 
 * Provides theme state and toggle functionality with localStorage persistence.
 * Integrates with Tailwind CSS dark mode classes for consistent theming.
 * 
 * @module ThemeContext
 * @typedef {Object} ThemeContextValue
 * @property {boolean} isDarkMode - Current theme state (true for dark mode)
 * @property {Function} toggleTheme - Function to toggle between themes
 * 
 * @example
 * // Usage in a component:
 * const { isDarkMode, toggleTheme } = useTheme();
 * 
 * // Usage in App.js:
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */

/**
 * React context for theme management
 * @constant {React.Context}
 */
const ThemeContext = createContext();

/**
 * Custom hook to access theme context
 * 
 * @function useTheme
 * @returns {ThemeContextValue} Theme state and toggle function
 * @throws {Error} If used outside of ThemeProvider
 * 
 * @example
 * // In a functional component:
 * const Component = () => {
 *   const { isDarkMode, toggleTheme } = useTheme();
 *   return <button onClick={toggleTheme}>Toggle Theme</button>;
 * };
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme provider component for managing application-wide theme state
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Theme provider with context value
 * 
 * @note Persists theme preference in localStorage
 * @note Respects system preference as default
 * @note Updates Tailwind CSS dark mode classes on HTML element
 */
export const ThemeProvider = ({ children }) => {
  /**
   * Theme state with initializer function
   * 
   * @state {boolean} isDarkMode
   * @private
   * 
   * @description Initializes from localStorage if available,
   * otherwise uses system preference via matchMedia
   */
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved preference in localStorage
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  /**
   * Effect for persisting theme state and updating DOM
   * 
   * @effect
   * @listens isDarkMode
   * 
   * @description
   * 1. Saves theme preference to localStorage
   * 2. Updates HTML class for Tailwind dark mode
   */
  useEffect(() => {
    // Persist theme preference
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Update HTML class for Tailwind dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Toggle theme between light and dark modes
   * 
   * @function toggleTheme
   * @private
   * 
   * @description Reverses current theme state
   */
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  /**
   * Context value containing theme state and toggle function
   * 
   * @constant {ThemeContextValue}
   * @private
   */
  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};