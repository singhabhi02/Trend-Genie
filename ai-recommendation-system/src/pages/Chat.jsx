import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      navigate('/'); // Redirect to login if no user is logged in
    } else {
      setUserInfo(loggedInUser);
    }
  }, [navigate, setUserInfo]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          name: file.name,
          type: file.type,
          url: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle sending a message (text or file)
  const handleSend = () => {
    if (input.trim() || selectedFile) {
      const newMessage = {
        text: input,
        file: selectedFile, // Include file if uploaded
        sender: 'user',
        timestamp: moment().format('hh:mm A'),
      };
      setMessages([...messages, newMessage]);
      setInput('');
      setSelectedFile(null); // Clear file preview after sending

      // Simulated AI Response
      setTimeout(() => {
        const aiResponse = {
          text: 'This is a sample AI response.',
          sender: 'ai',
          timestamp: moment().format('hh:mm A'),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUserInfo({ name: '', email: '' });
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} pt-16`}>
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        userInfo={userInfo}
        onLogout={handleLogout}
      />

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto h-[90vh] flex flex-col">
        <div className="p-4 mt-4  text-center">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Welcome {userInfo.name}, How may I help you?
          </h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'user'
                  ? 'ml-auto bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              {msg.text && <div className="text-sm">{msg.text}</div>}
              {msg.file && (
                <div className="mt-2">
                  {msg.file.type.startsWith('image') ? (
                    <img src={msg.file.url} alt={msg.file.name} className="w-32 h-32 rounded-lg" />
                  ) : (
                    <a href={msg.file.url} download className="text-blue-400 underline">
                      {msg.file.name}
                    </a>
                  )}
                </div>
              )}
              <div className="text-xs mt-1 text-right">{msg.timestamp}</div>
            </div>
          ))}
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="flex items-center gap-3 p-2 border rounded-lg mt-2 bg-gray-200 dark:bg-gray-700">
            {selectedFile.type.startsWith('image') ? (
              <img src={selectedFile.url} alt="preview" className="w-12 h-12 rounded-lg" />
            ) : (
              <span className="text-sm">{selectedFile.name}</span>
            )}
            <button onClick={() => setSelectedFile(null)} className="text-red-500 text-xs">
              ✖ Remove
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="mt-4 flex items-center gap-2 border rounded-lg p-2 bg-white dark:bg-gray-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} // Send message on Enter key
            className="flex-1 p-2 bg-transparent outline-none text-gray-800 dark:text-white"
            placeholder="Type a message..."
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ➤
          </button>

          {/* File Upload Button */}
          <label htmlFor="file-upload" className="cursor-pointer p-2 text-gray-500 hover:text-blue-500">
            📎
          </label>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*, .pdf, .docx"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
