import React from 'react';
import { 
  FaUser, 
  FaHistory, 
  FaFilePrescription, 
  FaCalendarPlus,
  FaSignOutAlt 
} from 'react-icons/fa';

/**
 * VerticalNavigation component for patient dashboard navigation.
 * 
 * This component provides a vertical navigation sidebar that allows patients to
 * switch between different views in their dashboard. It includes main navigation
 * items, a booking appointment button, and a logout option. Each navigation item
 * can display notification badges to indicate pending items or counts.
 * 
 * The component is designed to be visually distinct from the main content area
 * and includes interactive feedback for user actions. It supports both light
 * and dark mode themes through Tailwind CSS classes.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.currentView - Currently active view identifier
 * @param {Function} props.setCurrentView - Callback function to change the current view
 * @param {number} props.previousTreatmentsCount - Number of previous treatments for badge display
 * @param {number} props.prescriptionsCount - Number of prescriptions for badge display
 * @param {Function} props.onBookAppointment - Callback function for booking new appointments
 * @param {Function} props.onLogout - Callback function for user logout
 * @returns {React.ReactElement} A vertical navigation sidebar component
 * 
 * @example
 * // Example usage in a patient dashboard
 * <VerticalNavigation
 *   currentView="profile"
 *   setCurrentView={setCurrentView}
 *   previousTreatmentsCount={5}
 *   prescriptionsCount={3}
 *   onBookAppointment={handleBookAppointment}
 *   onLogout={handleLogout}
 * />
 */
const VerticalNavigation = ({ 
  currentView, 
  setCurrentView, 
  previousTreatmentsCount,
  prescriptionsCount,
  onBookAppointment,
  onLogout 
}) => {
  /**
   * Navigation items configuration array.
   * @type {Array<Object>}
   * @property {string} id - Unique identifier for the navigation item
   * @property {string} label - Display text for the navigation item
   * @property {React.ReactElement} icon - Icon component for the item
   * @property {string} view - View identifier used for state management
   * @property {number} [badge] - Optional badge count for notifications
   */
  const navItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <FaUser className="w-5 h-5" />,
      view: 'profile'
    },
    {
      id: 'treatments',
      label: 'Previous Treatments',
      icon: <FaHistory className="w-5 h-5" />,
      view: 'treatments',
      badge: previousTreatmentsCount
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions',
      icon: <FaFilePrescription className="w-5 h-5" />,
      view: 'prescriptions',
      badge: prescriptionsCount
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-64 shrink-0">
      <div className="space-y-2">
        {/* Main navigation items */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.view 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-current={currentView === item.view ? 'page' : undefined}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
            
            {/* Badge display for items with counts */}
            {item.badge > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full ml-auto">
                {item.badge}
              </span>
            )}
          </button>
        ))}

        {/* Appointment booking section - separated from main navigation */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBookAppointment}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Book a new appointment"
          >
            <FaCalendarPlus className="w-5 h-5" />
            <span className="font-medium">Book Appointment</span>
          </button>
        </div>

        {/* Logout section - visually separated from other actions */}
        <div className="pt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            aria-label="Logout from the application"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerticalNavigation;