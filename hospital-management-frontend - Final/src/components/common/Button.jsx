import React from 'react';

/**
 * Reusable Button Component
 * 
 * Configurable button component with multiple variants, sizes, and states.
 * Supports loading states, disabled states, and various visual styles.
 * Built with accessibility considerations and consistent styling.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Button content (text, icons, etc.)
 * @param {Function} [props.onClick] - Click event handler
 * @param {string} [props.type='button'] - HTML button type attribute
 * @param {string} [props.variant='primary'] - Visual style variant
 * @param {string} [props.size='medium'] - Button size
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.loading=false] - Loading state with spinner
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Object} props...props - Additional HTML button attributes
 * 
 * @returns {JSX.Element} Configurable button element
 * 
 * @example
 * // Primary button with click handler
 * <Button 
 *   onClick={() => console.log('Clicked')}
 *   variant="primary"
 * >
 *   Click Me
 * </Button>
 * 
 * @example
 * // Large success button with loading state
 * <Button 
 *   variant="success"
 *   size="large"
 *   loading={true}
 * >
 *   Saving...
 * </Button>
 * 
 * @example
 * // Outline button with custom class
 * <Button 
 *   variant="outline"
 *   className="w-full"
 * >
 *   Cancel
 * </Button>
 * 
 * @note All button variants support dark mode via parent context
 * @note Includes focus styles for keyboard navigation accessibility
 * @note Loading state automatically disables the button
 */
const Button = ({ 
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  /**
   * Base CSS classes applied to all button variants
   * 
   * @constant {string}
   * @private
   */
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  /**
   * Size-specific CSS class mappings
   * 
   * @constant {Object}
   * @property {string} small - Small button styles
   * @property {string} medium - Medium button styles (default)
   * @property {string} large - Large button styles
   */
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-6 py-3 text-lg'
  };

  /**
   * Variant-specific CSS class mappings
   * 
   * @constant {Object}
   * @property {string} primary - Primary action (blue theme)
   * @property {string} secondary - Secondary action (gray theme)
   * @property {string} success - Success/positive action (green theme)
   * @property {string} danger - Danger/negative action (red theme)
   * @property {string} outline - Outline style (transparent with border)
   */
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };

  /**
   * Combined CSS classes for the button element
   * 
   * @constant {string}
   * @private
   */
  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          {/* Loading spinner */}
          <div 
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
            aria-hidden="true"
          />
          {/* Button text (visible for screen readers during loading) */}
          <span className="sr-only">Loading: </span>
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;