import React, { useContext, useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png'; 

const Navbar = ({ isDarkMode, toggleDarkMode, userInfo, profilePicture, handleProfilePictureUpload, onLogout }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo} // Use your logo here
            alt="Trend Genie Logo"
            className="h-16 w-100" // Adjust height and width as needed
          />
        </div>

        {/* Right Side: Dark Mode Toggle and Profile Icon */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          {/* Profile Icon */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600"
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300">👤</span>
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {userInfo.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userInfo.email}
                  </p>
                </div>
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Profile Picture
                  </label>
                  <input
                    type="file"
                    onChange={handleProfilePictureUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <div className="p-4">
                  <button
                    onClick={onLogout}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;