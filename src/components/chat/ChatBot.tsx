import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import api from '../../lib/api';
import type { ChatMessageType, SendMessageRequest } from '../../types/chat';

interface ChatBotProps {
  projectId: string;
  onClose: () => void;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

const ChatBot: React.FC<ChatBotProps> = ({ projectId, onClose, dateRange }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      const greetingMessage: ChatMessageType = {
        _id: 'greeting',
        conversationId: '',
        userId: '',
        role: 'assistant',
        content: "Hi! I'm Avi, your AI marketing analyst. I can help you understand your marketing metrics, identify trends, and suggest optimization strategies. What would you like to know?",
        timestamp: new Date().toISOString(),
      };
      setMessages([greetingMessage]);
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setError(null);

    // Add user message to UI immediately
    const userMessage: ChatMessageType = {
      _id: `temp-user-${Date.now()}`,
      conversationId: conversationId || '',
      userId: '',
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const requestData: SendMessageRequest = {
        projectId,
        message,
        conversationId,
        dateRange,
      };

      const response = await api.post('/chat/message', requestData);

      if (response.data.success) {
        const { conversationId: newConversationId, response: aiResponse } =
          response.data.data;

        // Update conversation ID if this is the first message
        if (!conversationId) {
          setConversationId(newConversationId);
        }

        // Add AI response to messages
        const aiMessage: ChatMessageType = {
          _id: `ai-${Date.now()}`,
          conversationId: newConversationId,
          userId: '',
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Failed to send message. Please try again.';
      setError(errorMessage);

      // Remove the temporary user message on error
      setMessages((prev) => prev.filter((m) => m._id !== userMessage._id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl overflow-hidden">
      <ChatHeader onClose={onClose} />

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {messages.map((message, index) => (
          <ChatMessage key={message._id || index} message={message} />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Avi is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatBot;
