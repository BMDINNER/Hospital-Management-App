import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/common/Button';
import LoadingOverlay from '../components/common/LoadingOverlay';
import ThemeToggle from '../components/common/ThemeToggle';
import LoginHeader from '../pages/login/components/LoginHeader';
import LoginFormFields from '../pages/login/components/LoginFormFields';
import RegisterFormFields from '../pages/login/components/RegisterFormField';
import FormToggle from '../pages/login/components/FormToggle';
import FormFooter from '../pages/login/components/FormFooter';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Hospital Authentication Component
 * 
 * Main authentication component handling both login and registration flows.
 * Provides a unified interface with form validation, submission handling,
 * and theme-aware styling. Supports toggling between login and registration modes.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onLogin - Callback function invoked on successful login
 * 
 * @returns {JSX.Element} Complete authentication interface
 * 
 * @example
 * // Usage in App.js:
 * const App = () => {
 *   const [user, setUser] = useState(null);
 *   
 *   return user ? (
 *     <Dashboard user={user} />
 *   ) : (
 *     <HospitalLogin onLogin={setUser} />
 *   );
 * };
 * 
 * @note Handles both login and registration in a single component
 * @note Includes comprehensive form validation
 * @note Persists email when switching between login/register
 * @note Provides visual feedback for all operations
 * @note Theme-aware with dark mode support
 */
const HospitalLogin = ({ onLogin }) => {
  /**
   * Authentication mode state
   * 
   * @state {boolean} isLogin - True for login mode, false for registration
   */
  const [isLogin, setIsLogin] = useState(true);
  
  /**
   * Loading state for form submission
   * 
   * @state {boolean} loading - True during API requests
   */
  const [loading, setLoading] = useState(false);
  
  /**
   * Form validation errors
   * 
   * @state {Object} errors - Key-value pairs of field errors
   */
  const [errors, setErrors] = useState({});
  
  /**
   * Form data state containing all input values
   * 
   * @state {Object} formData - Form field values
   * @property {string} email - User email address
   * @property {string} password - User password
   * @property {string} confirmPassword - Password confirmation (registration only)
   * @property {string} name - First name (registration only)
   * @property {string} surname - Last name (registration only)
   * @property {string} height - Height in cm (optional)
   * @property {string} weight - Weight in kg (optional)
   * @property {string} age - Age in years (optional)
   * @property {string} gender - Gender identity
   * @property {string} bloodGroup - Blood type (optional)
   * @property {string} allergies - Allergies list (optional)
   */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    height: '',
    weight: '',
    age: '',
    gender: 'prefer-not-to-say',
    bloodGroup: '',
    allergies: ''
  });

  /**
   * Theme context for dark/light mode detection
   * 
   * @constant {Object} themeContext
   * @property {boolean} isDarkMode - Current theme state
   */
  const { isDarkMode } = useTheme();

  /**
   * Validate form data based on current mode (login/register)
   * 
   * @private
   * @function validateForm
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    // Email validation (common to both modes)
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation (common to both modes)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration-specific validations
    if (!isLogin) {
      if (!formData.name) newErrors.name = 'First name is required';
      if (!formData.surname) newErrors.surname = 'Last name is required';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Medical information validations (optional but with constraints)
      if (formData.height && (formData.height < 50 || formData.height > 250)) {
        newErrors.height = 'Height must be between 50 and 250 cm';
      }

      if (formData.weight && (formData.weight < 20 || formData.weight > 300)) {
        newErrors.weight = 'Weight must be between 20 and 300 kg';
      }

      if (formData.age && (formData.age < 0 || formData.age > 150)) {
        newErrors.age = 'Age must be between 0 and 150';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form input changes with error clearing
   * 
   * @private
   * @function handleInputChange
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - Change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle form submission with API integration
   * 
   * @private
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const endpoint = isLogin 
        ? 'http://localhost:3500/api/login' 
        : 'http://localhost:3500/api/register';
      
      // Prepare payload based on mode
      const payload = isLogin 
        ? { 
            email: formData.email, 
            password: formData.password 
          }
        : {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            surname: formData.surname,
            height: formData.height ? Number(formData.height) : undefined,
            weight: formData.weight ? Number(formData.weight) : undefined,
            age: formData.age ? Number(formData.age) : undefined,
            gender: formData.gender || 'prefer-not-to-say',
            bloodGroup: formData.bloodGroup || '',
            allergies: formData.allergies || ''
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include' // Important for cookie-based authentication
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (isLogin) {
          // Login success - combine user data with access token
          const userWithToken = {
            ...data.user,
            accessToken: data.accessToken
          };
          onLogin(userWithToken);
        } else {
          // Registration success - switch to login mode
          setIsLogin(true);
          setFormData(prev => ({ 
            ...prev, 
            password: '', 
            confirmPassword: '',
            email: formData.email // Keep email for convenience
          }));
          setErrors({ submit: 'Registration successful! Please login.' });
        }
      } else {
        // API returned error
        setErrors({ submit: data.message || 'Something went wrong!' });
      }
    } catch (err) {
      // Network or unexpected error
      setErrors({ submit: 'Network error! Please try again.' });
      console.error('Request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle between login and registration modes
   * 
   * @private
   * @function toggleMode
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    // Reset form but preserve email when switching from login to register
    setFormData({
      email: isLogin ? formData.email : '',
      password: '',
      confirmPassword: '',
      name: '',
      surname: '',
      height: '',
      weight: '',
      age: '',
      gender: 'prefer-not-to-say',
      bloodGroup: '',
      allergies: ''
    });
  };

  return (
    <div 
      className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
      role="main"
    >
      {/* Theme toggle button (top-right corner) */}
      <ThemeToggle />
      
      {/* Authentication card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-4xl">
        {/* Dynamic header based on mode */}
        <LoginHeader isLogin={isLogin} />

        {/* Submit error display */}
        {errors.submit && (
          <div 
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <FaExclamationTriangle 
                className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" 
                aria-hidden="true"
              />
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Authentication form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dynamic form fields based on mode */}
          {isLogin ? (
            <LoginFormFields 
              formData={formData} 
              handleInputChange={handleInputChange} 
              loading={loading} 
            />
          ) : (
            <RegisterFormFields 
              formData={formData} 
              handleInputChange={handleInputChange} 
              errors={errors}
              loading={loading} 
            />
          )}

          {/* Submit button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
              size="large"
              className="w-full flex items-center justify-center gap-2"
              aria-label={isLogin ? "Sign in to account" : "Create new account"}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </form>

        {/* Mode toggle link */}
        <FormToggle isLogin={isLogin} onToggle={toggleMode} />
        
        {/* Feature highlights */}
        <FormFooter isLogin={isLogin} />

        {/* Loading overlay during API requests */}
        {loading && (
          <LoadingOverlay 
            message={isLogin ? "Signing in..." : "Creating account..."} 
            show={loading} 
          />
        )}
      </div>
    </div>
  );
};

export default HospitalLogin;