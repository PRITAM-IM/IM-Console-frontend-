import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import api from '../../lib/api';
import type { ChatMessageType, SendMessageRequest } from '../../types/chat';

interface PresetQuestion {
  id: string;
  question: string;
  category: string;
  icon: string;
}

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
  const [loadingStage, setLoadingStage] = useState<'thinking' | 'analyzing' | 'ready'>('thinking');
  const [error, setError] = useState<string | null>(null);
  const [presetQuestions, setPresetQuestions] = useState<PresetQuestion[]>([]);
  const [showPresets, setShowPresets] = useState(true);
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

  // Fetch preset questions
  useEffect(() => {
    const fetchPresetQuestions = async () => {
      try {
        const response = await api.get(`/chat/preset-questions/${projectId}`);
        if (response.data.success) {
          setPresetQuestions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching preset questions:', error);
        // Silently fail - preset questions are optional
      }
    };

    fetchPresetQuestions();
  }, [projectId]);

  // Multi-stage loading effect
  useEffect(() => {
    if (!isLoading) return;

    setLoadingStage('thinking');
    const timer1 = setTimeout(() => setLoadingStage('analyzing'), 1500);
    const timer2 = setTimeout(() => setLoadingStage('ready'), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoading]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setError(null);
    setShowPresets(false); // Hide presets after first message

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

  const handlePresetClick = (question: string) => {
    handleSendMessage(question);
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

        {/* Preset Questions - Show only before first user message */}
        {showPresets && presetQuestions.length > 0 && messages.length === 1 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <p className="text-sm font-medium text-gray-700">Quick questions to get started:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetQuestions.slice(0, 6).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.question)}
                  disabled={isLoading}
                  className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">{preset.icon}</span>
                    <span className="text-sm text-gray-700 group-hover:text-blue-700">
                      {preset.question}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Loading Indicator with Progressive Stages */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {loadingStage === 'thinking' && 'Avi is thinking...'}
                    {loadingStage === 'analyzing' && 'Avi is analyzing your data...'}
                    {loadingStage === 'ready' && 'Avi is preparing insights...'}
                  </span>
                  <div className="flex gap-1 mt-1">
                    <div className={`h-1 w-8 rounded-full transition-all duration-300 ${
                      loadingStage === 'thinking' ? 'bg-blue-600' : 'bg-blue-200'
                    }`} />
                    <div className={`h-1 w-8 rounded-full transition-all duration-300 ${
                      loadingStage === 'analyzing' ? 'bg-blue-600' : 'bg-blue-200'
                    }`} />
                    <div className={`h-1 w-8 rounded-full transition-all duration-300 ${
                      loadingStage === 'ready' ? 'bg-blue-600' : 'bg-blue-200'
                    }`} />
                  </div>
                </div>
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
