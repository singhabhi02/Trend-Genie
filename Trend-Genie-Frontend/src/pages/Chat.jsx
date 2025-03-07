import { useState, useEffect, useContext, useRef } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "../components/ui/scroll-area";
import { Paperclip, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getRecommendations } from "../services/api";

const Chat = () => {
  const [chatSessions, setChatSessions] = useState([
    { id: "New Chat", messages: [] },
  ]);
  const [activeChat, setActiveChat] = useState(0);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isJustLoggedIn, setIsJustLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Added state for sidebar collapse
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUserInfo(loggedInUser);
      setIsJustLoggedIn(true);
    }
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: moment().format("hh:mm A"),
    };

    setChatSessions((prevSessions) =>
      prevSessions.map((session, index) =>
        index === activeChat
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      )
    );

    setInput("");

    try {
      const response = await getRecommendations(input);
      const recommendations = response?.data?.recommendations || [];

      let botMessage = {
        text: "",
        sender: "ai",
        timestamp: moment().format("hh:mm A"),
      };

      if (recommendations.length > 0) {
        botMessage.text = (
          <table
            className={`w-full border-collapse border ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <thead>
              <tr
                className={`${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <th className="border p-2">Product</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Sub-Category</th>
                <th className="border p-2">Color</th>
                <th className="border p-2">Season</th>
                <th className="border p-2">Usage</th>
                <th className="border p-2">Gender</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec, index) => (
                <tr
                  key={index}
                  className={`${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-900"
                  } text-center`}
                >
                  <td className="border p-2">
                    {rec.productDisplayName || "N/A"}
                  </td>
                  <td className="border p-2">{rec.masterCategory || "N/A"}</td>
                  <td className="border p-2">{rec.subCategory || "N/A"}</td>
                  <td className="border p-2">{rec.baseColour || "N/A"}</td>
                  <td className="border p-2">{rec.season || "N/A"}</td>
                  <td className="border p-2">{rec.usage || "N/A"}</td>
                  <td className="border p-2">{rec.gender || "Unisex"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else {
        botMessage.text = "No recommendations available.";
      }

      setChatSessions((prevSessions) =>
        prevSessions.map((session, index) =>
          index === activeChat
            ? { ...session, messages: [...session.messages, botMessage] }
            : session
        )
      );
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      const errorMessage = {
        text: "Sorry, I couldn't fetch recommendations at the moment. Please try again later.",
        sender: "ai",
        timestamp: moment().format("hh:mm A"),
      };

      setChatSessions((prevSessions) =>
        prevSessions.map((session, index) =>
          index === activeChat
            ? { ...session, messages: [...session.messages, errorMessage] }
            : session
        )
      );
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
    <div
      className={`h-screen flex flex-col overflow-hidden ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Navbar
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        userInfo={userInfo}
        onLogout={() => {
          localStorage.removeItem("loggedInUser");
          navigate("/");
        }}
        className={`fixed top-0 left-0 right-0 z-50 h-16 shadow-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      />

      <div className="flex flex-1 overflow-hidden pt-16">
        <div
          className={`fixed top-16 left-0 h-[calc(100vh-64px)] shadow-lg transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-64"
          } ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <Sidebar
            chatSessions={chatSessions}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            startNewChat={startNewChat}
            deleteChat={deleteChat}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>

        <Card
          className={`flex-1 border-none shadow-xl transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64"
          } ${isDarkMode ? "bg-gray-850" : "bg-white"}`}
        >
          <CardContent className="flex flex-col h-full p-0">
            <ScrollArea
              className={`flex-1 p-6 ${
                isDarkMode
                  ? "bg-gradient-to-b from-gray-850 to-gray-900"
                  : "bg-gradient-to-b from-white to-gray-50"
              }`}
            >
              {chatSessions[activeChat]?.messages.length === 0 ? (
                <div className="text-center mt-20">
                  <AnimatePresence>
                    {isJustLoggedIn && userInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className={`text-2xl font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Welcome {userInfo?.name || "User"}, How may I assist you
                        today?
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div
                    className={`mt-4 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Start a conversation by typing below...
                  </div>
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
                          ? isDarkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-100"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {msg.sender === "ai" && msg.isFallback ? (
                        <div className="text-red-500 font-semibold">
                          Sorry, I couldn't understand that. Can you try again
                          with a different query?
                        </div>
                      ) : (
                        renderMessageContent(msg)
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={chatEndRef} />
            </ScrollArea>

            <div
              className={`p-4 border-t flex items-center gap-3 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Trend Genie..."
                className={`flex-1 border-none rounded-full px-5 py-3 focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-900 placeholder-gray-500"
                }`}
              />
              <label
                htmlFor="file-upload"
                className={`p-2 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-blue-400"
                    : "text-gray-600 hover:text-blue-500"
                } cursor-pointer`}
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
                <span
                  className={`text-sm truncate max-w-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedFile.name}
                </span>
              )}
              <Button
                onClick={handleSend}
                className={`p-3 rounded-full ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
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
