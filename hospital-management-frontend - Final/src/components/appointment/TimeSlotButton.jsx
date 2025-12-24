import React from 'react';

/**
 * Time Slot Button Component
 * 
 * Interactive button for displaying and selecting appointment time slots.
 * Visually indicates availability status and selection state with color-coded UI.
 * Supports both light and dark mode themes via Tailwind CSS classes.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.time - Display time for the slot (e.g., "14:30")
 * @param {boolean} [props.isAvailable=true] - Slot availability status
 * @param {boolean} [props.isSelected=false] - Whether slot is currently selected
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * 
 * @returns {JSX.Element} Interactive time slot button
 * 
 * @example
 * // Basic usage:
 * <TimeSlotButton 
 *   time="09:00"
 *   isAvailable={true}
 *   isSelected={false}
 *   onClick={() => selectSlot(slot)}
 * />
 * 
 * @example
 * // Selected slot:
 * <TimeSlotButton 
 *   time="10:00"
 *   isAvailable={true}
 *   isSelected={true}
 *   onClick={() => {}}
 * />
 * 
 * @example
 * // Booked/unavailable slot:
 * <TimeSlotButton 
 *   time="11:00"
 *   isAvailable={false}
 *   isSelected={false}
 *   onClick={() => {}}
 *   disabled={true}
 * />
 * 
 * @note Styled with Tailwind CSS for consistent theming
 * @note Uses color-coded status indicators (green=available, red=booked)
 * @note Supports dark mode via CSS class variants
 */
const TimeSlotButton = ({
  time,
  isAvailable = true,
  isSelected = false,
  onClick,
  disabled = false
}) => {
  /**
   * Get accessibility label based on slot state
   * 
   * @private
   * @function getAriaLabel
   * @returns {string} ARIA label for screen readers
   */
  const getAriaLabel = () => {
    if (!isAvailable) {
      return `${time} - Booked, not available for selection`;
    }
    if (isSelected) {
      return `${time} - Currently selected appointment time`;
    }
    return `${time} - Available for appointment booking`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isAvailable || disabled}
      className={`
        p-4 rounded-lg border-2 transition-all duration-200
        flex flex-col items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isSelected
          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 focus:ring-green-500'
          : isAvailable
          ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:ring-blue-500'
          : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }
      `}
      aria-label={getAriaLabel()}
      aria-pressed={isSelected}
      aria-disabled={!isAvailable || disabled}
    >
      <div className="flex items-center space-x-2">
        {/* Status indicator dot */}
        <div 
          className={`
            w-3 h-3 rounded-full
            ${isSelected
              ? 'bg-green-500'
              : isAvailable
              ? 'bg-green-400'
              : 'bg-red-400'
            }
          `}
          aria-hidden="true"
        />
        {/* Time display */}
        <span className="font-medium">{time}</span>
      </div>
      {/* Status label */}
      <span className={`
        text-xs mt-1
        ${isSelected
          ? 'text-green-600 dark:text-green-400'
          : isAvailable
          ? 'text-gray-500 dark:text-gray-400'
          : 'text-red-500 dark:text-red-400'
        }
      `}>
        {isAvailable ? 'Available' : 'Booked'}
      </span>
    </button>
  );
};

export default TimeSlotButton;