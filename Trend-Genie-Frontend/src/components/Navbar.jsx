import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, LogOut, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { cn } from "../lib/utils";
import logo from "../assets/logo.png";

const Navbar = ({ isDarkMode, toggleDarkMode, userInfo, onLogout }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const profileDropdownRef = useRef(null);

  // Load saved profile picture from local storage
  useEffect(() => {
    const savedProfilePicture = localStorage.getItem("profilePicture");
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
        localStorage.setItem("profilePicture", reader.result);
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 shadow-md bg-opacity-70 backdrop-blur-md transition-all",
        isDarkMode ? "bg-gray-900/80 text-white" : "bg-white/80 text-gray-900"
      )}
    >
      <div className="max-w-9xl mx-auto px-6 py-3 flex items-center w-full">
        {/* Logo and Heading */}
        <div className="flex items-center space-x-3 mr-auto">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h3 className="text-2xl font-bold tracking-wide">Trend-Genie</h3>
        </div>

        {/* Right Side: Dark Mode Toggle & Profile */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* Dark Mode Toggle */}
          <Button
            onClick={toggleDarkMode}
            size="icon"
            className="transition-all hover:scale-110"
          >
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          {/* Profile Section */}
          <div className="relative" ref={profileDropdownRef}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border-2 border-gray-300 dark:border-gray-600 overflow-hidden hover:scale-110 transition-all"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <Avatar className="w-12 h-10">
                {profilePicture ? (
                  <AvatarImage src={profilePicture} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {userInfo?.name?.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 origin-top-right"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <h3 className="text-lg font-semibold">{userInfo.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{userInfo.email}</p>
                </div>

                <div className="py-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Profile Picture
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="cursor-pointer flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-all"
                    >
                      <Upload size={16} />
                      Upload
                    </label>
                  </div>
                </div>

                <Button
                  onClick={onLogout}
                  className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;