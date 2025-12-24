import React, { useState, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import ChatBot from './ChatBot';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

interface FloatingChatButtonProps {
  projectId: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  pageContext?: 'overview' | 'analytics' | 'youtube' | 'facebook' | 'instagram' | 'meta-ads' | 'google-ads' | 'search-console' | 'linkedin';
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  projectId,
  dateRange,
  pageContext,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();

  const handleClose = () => {
    setIsOpen(false);
    // Reset position to original (bottom-right) when closed
    setPosition({ x: 0, y: 0 });
  };

  const handleDragEnd = (_event: any, info: any) => {
    // Update position after drag
    setPosition({
      x: position.x + info.offset.x,
      y: position.y + info.offset.y
    });
  };

  // Set up drag handle listener when chat opens
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      // Check if the clicked element or its parent has the drag-handle class
      if (target.closest('.drag-handle')) {
        dragControls.start(e);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, dragControls]);

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

      {/* Drag Constraints Container */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />

      {/* Chat Window - Draggable from header only */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={constraintsRef}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.8, y: 20, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: position.y, x: position.x }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[80vh]"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              pointerEvents: 'auto'
            }}
          >
            <ChatBot
              projectId={projectId}
              onClose={handleClose}
              dateRange={dateRange}
              pageContext={pageContext}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatButton;

