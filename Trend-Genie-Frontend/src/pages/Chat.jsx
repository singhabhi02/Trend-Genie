import { useState, useEffect, useContext, useRef } from "react";
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
    if (loggedInUser) setUserInfo(loggedInUser);
  }, [setUserInfo]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSessions]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleSend = () => {
    if (input.trim() || selectedFile) {
      let fileUrl = null;
      if (selectedFile) fileUrl = URL.createObjectURL(selectedFile);

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
      handleSend();
    }
  };

  const renderMessageContent = (msg) => (
    <div className="flex flex-col">
      {msg.text && <div className="text-base leading-relaxed">{msg.text}</div>}
      {msg.file && (
        <div className="mt-2">
          {msg.file.type.startsWith("image/") ? (
            <img
              src={msg.file.url}
              alt={msg.file.name}
              className="max-w-full h-auto rounded-md shadow-sm"
              style={{ maxHeight: "250px" }}
            />
          ) : (
            <a
              href={msg.file.url}
              download={msg.file.name}
              className="text-blue-400 hover:underline"
            >
              {msg.file.name}
            </a>
          )}
        </div>
      )}
      <div className="text-xs opacity-60 mt-1 text-right">{msg.timestamp}</div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        userInfo={userInfo}
        onLogout={() => {
          localStorage.removeItem("loggedInUser");
          navigate("/");
        }}
        className="fixed top-0 left-0 right-0 z-50 h-16 bg-gray-800 shadow-md"
      />

      <div className="flex flex-1 overflow-hidden pt-16"> {/* Added pt-16 to shift content below navbar */}
        <div className="fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-gray-800 shadow-lg">
          <Sidebar
            chatSessions={chatSessions}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            startNewChat={startNewChat}
            deleteChat={deleteChat}
          />
        </div>

        <Card className="flex-1 ml-64 bg-gray-850 border-none shadow-xl">
          <CardContent className="flex flex-col h-full p-0">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-light text-gray-300 text-center py-6 bg-gray-800/50 border-b border-gray-700"
            >
              Welcome {userInfo?.name || "User"}, How may I assist you today?
            </motion.h1>

            <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-gray-850 to-gray-900">
              {chatSessions[activeChat]?.messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  Start a conversation by typing below...
                </div>
              ) : (
                chatSessions[activeChat]?.messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex mb-6 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-2xl p-4 rounded-xl shadow-sm ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      {renderMessageContent(msg)}
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={chatEndRef} />
            </ScrollArea>

            <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Trend Genie..."
                className="flex-1 bg-gray-700 text-white placeholder-gray-400 border-none rounded-full px-5 py-3 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="file-upload"
                className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer"
              >
                <Paperclip size={20} />
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*, .pdf, .docx"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <span className="text-sm text-gray-400 truncate max-w-xs">
                  {selectedFile.name}
                </span>
              )}
              <Button
                onClick={handleSend}
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full"
              >
                <Send size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;