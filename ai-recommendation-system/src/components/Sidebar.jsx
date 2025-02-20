import React from "react";
import { motion } from "framer-motion";
import { Plus, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const Sidebar = ({
  chatSessions,
  activeChat,
  setActiveChat,
  startNewChat,
  deleteChat,
}) => {
  console.log("startNewChat prop:", startNewChat); // Debug

  return (
    <div className="relative w-72 min-h-screen bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Chat History
        </h2>
        <Button
          onClick={startNewChat}
          size="icon"
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          // Remove or adjust disabled condition if needed
        >
          <Plus size={18} />
        </Button>
      </div>

      {/* Chat List with Scroll */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {chatSessions.map((session, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all",
                activeChat === index
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              )}
              onClick={() => setActiveChat(index)}
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <span className="truncate w-40">
                  {session.id || `Chat ${index + 1}`}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(index);
                }}
              >
                <X size={18} />
              </Button>
            </motion.li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;