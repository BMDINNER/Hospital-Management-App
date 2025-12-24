import React from 'react';
import Button from '../../../components/common/Button';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';

/**
 * ProfileHeader component that renders the header section of the patient profile page.
 * 
 * This component provides the main title and action buttons (Edit Profile and Logout)
 * for the patient profile interface. It manages the visual state of the edit button
 * and triggers the corresponding actions when buttons are clicked.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.isEditing - Current editing state of the profile
 * @param {Function} props.setIsEditing - Function to toggle the editing state
 * @param {Function} props.onLogout - Function to handle user logout
 * @param {boolean} [props.loading] - Optional loading state indicator
 * @returns {React.ReactElement} The rendered profile header component
 * 
 * @example
 * // Basic usage in a parent component
 * <ProfileHeader
 *   isEditing={isEditing}
 *   setIsEditing={setIsEditing}
 *   onLogout={handleLogout}
 *   loading={isLoading}
 * />
 */
const ProfileHeader = ({ 
  isEditing, 
  setIsEditing, 
  onLogout, 
  loading 
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {/* Main profile title */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Patient Profile
      </h1>
      
      {/* Action buttons container */}
      <div className="flex gap-4">
        {/* Edit/Cancel button - toggles based on editing state */}
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "secondary" : "success"}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <FaUserEdit />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
        
        {/* Logout button - triggers the logout handler */}
        <Button
          onClick={onLogout}
          variant="danger"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <FaSignOutAlt />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;