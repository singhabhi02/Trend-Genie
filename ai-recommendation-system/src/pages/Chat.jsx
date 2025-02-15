import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode class to the body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: 'This is a sample AI response.', sender: 'ai' },
        ]);
      }, 1000);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-6`}>
      <div className="max-w-4xl mx-auto h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Trend-Genie
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
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
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-1 p-2 border rounded-lg ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
            }`}
            placeholder="Ask me anything..."
          />
          <button
            onClick={handleSend}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            } hover:bg-blue-600`}
          >
            Send
          </button>
          <input
            type="file"
            className={`p-2 border rounded-lg ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
            }`}
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;