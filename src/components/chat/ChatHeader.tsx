import React from 'react';
import { X, Bot } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Bot className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Avi</h3>
          <p className="text-xs text-blue-100">
            Your AI Marketing Analyst
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-white hover:bg-white/20 transition-colors"
        aria-label="Close chat"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatHeader;
