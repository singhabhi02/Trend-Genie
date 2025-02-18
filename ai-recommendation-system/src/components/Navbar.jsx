import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';

const Navbar = ({ isDarkMode, toggleDarkMode, userInfo, onLogout }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const profileDropdownRef = useRef(null);

  // Load saved profile picture from local storage on mount
  useEffect(() => {
    const savedProfilePicture = localStorage.getItem('profilePicture');
    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture);
    }
  }, []);

  // Handle profile picture upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('profilePicture', reader.result);
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-opacity-70 backdrop-blur-md shadow-lg transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900/80 text-white' : 'bg-white/80 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h3 className="text-2xl font-bold tracking-wide">Trend-Genie</h3>
        </div>

        {/* Right Side: Dark Mode Toggle & Profile */}
        <div className="flex items-center space-x-6">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          {/* Profile Section */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-11 h-11 rounded-full border-2 border-gray-300 dark:border-gray-600 overflow-hidden transition-all duration-300 transform hover:scale-110"
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300 text-lg">👤</span>
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 transform scale-95 origin-top-right transition-all duration-200">
                
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="text-lg font-semibold">{userInfo.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{userInfo.email}</p>
                </div>
                
                <div className="py-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="block w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
                  />
                </div>
                
                <button
                  onClick={onLogout}
                  className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
