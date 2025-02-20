import React from 'react';

const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`fixed bottom-0 left-0 right-0 py-3 text-center text-sm font-medium shadow-md ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
    }`}>
      <p>⚠️ Trend-Genie can make mistakes. Check important info!</p>
    </footer>
  );
};

export default Footer;
