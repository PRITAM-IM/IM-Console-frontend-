import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import ChatBot from './ChatBot';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingChatButtonProps {
  projectId: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  projectId,
  dateRange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-2xl shadow-blue-500/50 transition-all hover:shadow-blue-500/75 hover:shadow-2xl"
            aria-label="Open Avi AI Chat"
          >
            <div className="relative">
              <Bot className="h-8 w-8" strokeWidth={2.5} />
              {/* AI Pulse Effect */}
              <motion.div
                className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[80vh]"
            style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
          >
            <ChatBot
              projectId={projectId}
              onClose={() => setIsOpen(false)}
              dateRange={dateRange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatButton;
