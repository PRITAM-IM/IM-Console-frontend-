import React from 'react';
import { X, Bot, Trash2 } from 'lucide-react';
import ExportChatButton from './ExportChatButton';

interface ChatHeaderProps {
  onClose: () => void;
  onClearChat?: () => void;
  conversationId?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onClearChat, conversationId }) => {
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
      <div className="flex items-center gap-2">
        {conversationId && (
          <div className="mr-1">
            <ExportChatButton conversationId={conversationId} />
          </div>
        )}
        {onClearChat && (
          <button
            onClick={onClearChat}
            className="rounded-lg p-1.5 text-white hover:bg-white/20 transition-colors"
            aria-label="Clear chat history"
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-white hover:bg-white/20 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
