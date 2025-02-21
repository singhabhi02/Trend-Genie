import React, { useState, useEffect, useContext, useRef } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { ScrollArea } from "../components/ui/scroll-area";
import { Paperclip, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Chat = () => {
  const [chatSessions, setChatSessions] = useState([{ id: "New Chat", messages: [] }]);
  const [activeChat, setActiveChat] = useState(0);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/");
    } else {
      setUserInfo(loggedInUser);
    }
  }, [navigate, setUserInfo]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSessions]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSend = () => {
    if (input.trim() || selectedFile) {
      let fileUrl = null;
      if (selectedFile) {
        fileUrl = URL.createObjectURL(selectedFile); // Create a temporary URL for preview
      }

      const newMessage = {
        text: input,
        file: selectedFile ? { name: selectedFile.name, url: fileUrl, type: selectedFile.type } : null,
        sender: "user",
        timestamp: moment().format("hh:mm A"),
      };

      setChatSessions((prevSessions) =>
        prevSessions.map((session, index) =>
          index === activeChat
            ? {
                ...session,
                id: session.messages.length === 0 ? (input.slice(0, 20) || "New Chat") : session.id,
                messages: [...session.messages, newMessage],
              }
            : session
        )
      );

      setInput("");
      setSelectedFile(null);

      setTimeout(() => {
        setChatSessions((prevSessions) =>
          prevSessions.map((session, index) =>
            index === activeChat
              ? {
                  ...session,
                  messages: [
                    ...session.messages,
                    {
                      text: selectedFile
                        ? `Received your file: ${selectedFile.name}`
                        : "This is a sample AI response.",
                      sender: "ai",
                      timestamp: moment().format("hh:mm A"),
                    },
                  ],
                }
              : session
          )
        );
      }, 1000);
    }
  };

  const startNewChat = () => {
    setChatSessions([...chatSessions, { id: "New Chat", messages: [] }]);
    setActiveChat(chatSessions.length);
  };

  const deleteChat = (index) => {
    setChatSessions(chatSessions.filter((_, i) => i !== index));
    if (activeChat === index) setActiveChat(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(); // Trigger send on Enter key
    }
  };

  const renderMessageContent = (msg) => {
    return (
      <>
        {msg.text && <div className="text-sm">{msg.text}</div>}
        {msg.file && (
          <div className="mt-2">
            {msg.file.type.startsWith("image/") ? (
              <img
                src={msg.file.url}
                alt={msg.file.name}
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: "200px" }}
              />
            ) : (
              <a
                href={msg.file.url}
                download={msg.file.name}
                className="text-blue-400 underline"
              >
                {msg.file.name}
              </a>
            )}
          </div>
        )}
        <div className="text-xs mt-1 text-right opacity-75">{msg.timestamp}</div>
      </>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        userInfo={userInfo}
        onLogout={() => navigate("/")}
        className="fixed top-0 left-0 right-0 z-50 h-16"
      />

      <div className="flex h-[calc(100vh-64px)]">
        <div className="fixed top-16 left-0 h-[calc(100vh-64px)] w-70 bg-gray-800 overflow-y-auto">
          <Sidebar
            chatSessions={chatSessions}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            startNewChat={startNewChat}
            deleteChat={deleteChat}
          />
        </div>

        <Card className="flex flex-col h-[calc(100vh)] w-[calc(100vw-10rem)] ml-80 max-w-7xl rounded-none bg-gray-800 shadow-lg">
          <CardContent className="flex flex-col h-full p-0 w-full">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-semibold text-center text-white p-4 mt-16"
            >
              Welcome {userInfo?.name || "User"}, How may I assist you?
            </motion.h1>

            <ScrollArea className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatSessions[activeChat]?.messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative p-3 rounded-lg max-w-xs md:max-w-md ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {renderMessageContent(msg)}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </ScrollArea>

            <div className="p-3 bg-gray-800 border-t border-gray-700 flex items-center gap-3 w-full">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message Trend-Genie..."
                className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-lg"
              />
              <Button
                onClick={handleSend}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send size={18} />
              </Button>
              <label
                htmlFor="file-upload"
                className="cursor-pointer p-3 text-gray-400 hover:text-blue-500"
              >
                <Paperclip size={18} />
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*, .pdf, .docx"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <span className="text-sm text-gray-400">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;