import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
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
  pageContext?: 'overview' | 'analytics' | 'youtube' | 'facebook' | 'instagram' | 'meta-ads' | 'google-ads' | 'search-console' | 'linkedin';
}

const ChatBot: React.FC<ChatBotProps> = ({ projectId, onClose, dateRange, pageContext }) => {
  // Storage key for used preset questions (UI state only)
  const STORAGE_KEY_USED_PRESETS = `chat_used_presets_${projectId}`;


  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'thinking' | 'analyzing' | 'ready'>('thinking');
  const [error, setError] = useState<string | null>(null);
  const [presetQuestions, setPresetQuestions] = useState<PresetQuestion[]>([]);
  const [usedPresetIds, setUsedPresetIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load conversation history from backend on mount
  useEffect(() => {
    const loadConversationHistory = async () => {
      try {
        // Try to get the last conversation for this project from backend
        const response = await api.get(`/chat/conversations/${projectId}`);

        if (response.data.success && response.data.data.length > 0) {
          // Get the most recent conversation
          const lastConversation = response.data.data[0];
          setConversationId(lastConversation._id);

          // Fetch messages for this conversation
          const messagesResponse = await api.get(`/chat/conversations/${lastConversation._id}/messages`);

          if (messagesResponse.data.success && messagesResponse.data.data.length > 0) {
            setMessages(messagesResponse.data.data);
          }
        }

        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error loading conversation history:', error);
        setIsDataLoaded(true);
      }
    };

    loadConversationHistory();
  }, [projectId]);

  // Persist used preset IDs to localStorage
  useEffect(() => {
    if (isDataLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY_USED_PRESETS, JSON.stringify(Array.from(usedPresetIds)));
      } catch (error) {
        console.error('Error saving used presets to localStorage:', error);
      }
    }
  }, [usedPresetIds, STORAGE_KEY_USED_PRESETS, isDataLoaded]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send initial greeting message only if no conversation history AND data is loaded
  useEffect(() => {
    if (isDataLoaded && messages.length === 0) {
      const greetingMessage: ChatMessageType = {
        _id: 'greeting',
        conversationId: '',
        userId: '',
        role: 'assistant',
        content: `Hi! 👋 I'm **Avi**, your AI marketing analyst.

I have access to all your marketing data and can help you with:

📊 **Analytics & Performance**
• Traffic analysis and user behavior
• Conversion rates and revenue insights
• Channel performance comparisons

📈 **Marketing Insights**
• Google Ads & Meta Ads performance
• Social media engagement (Facebook, Instagram, LinkedIn)
• SEO performance and search rankings

💡 **Strategic Recommendations**
• Optimization opportunities
• Budget allocation suggestions
• Trend identification and forecasting

**What would you like to explore today?**`,
        timestamp: new Date().toISOString(),
      };
      setMessages([greetingMessage]);
    }
  }, [isDataLoaded, messages.length]); // Run when data is loaded or messages change

  // Fetch preset questions based on page context
  useEffect(() => {
    const fetchPresetQuestions = async () => {
      try {
        const url = pageContext
          ? `/chat/preset-questions/${projectId}?context=${pageContext}`
          : `/chat/preset-questions/${projectId}`;
        const response = await api.get(url);
        if (response.data.success) {
          setPresetQuestions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching preset questions:', error);
        // Silently fail - preset questions are optional
      }
    };

    fetchPresetQuestions();
  }, [projectId, pageContext]);

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
    // No longer hide presets after first message - keep them visible

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
        pageContext, // Add current page context
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

  const handlePresetClick = (presetId: string, question: string) => {
    // Mark this preset as used
    setUsedPresetIds(prev => new Set([...prev, presetId]));
    handleSendMessage(question);
  };

  const handleRetry = () => {
    setError(null);
  };

  const handleClearChat = async () => {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      try {
        // Delete conversation from backend if it exists
        if (conversationId) {
          await api.delete(`/chat/conversations/${conversationId}`);
        }

        // Clear all state
        setMessages([]);
        setConversationId(undefined);
        setUsedPresetIds(new Set());
        setError(null);

        // Clear localStorage for used presets
        try {
          localStorage.removeItem(STORAGE_KEY_USED_PRESETS);
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }

        // Re-add greeting message
        const greetingMessage: ChatMessageType = {
          _id: 'greeting',
          conversationId: '',
          userId: '',
          role: 'assistant',
          content: `Hi! 👋 I'm **Avi**, your AI marketing analyst.

I have access to all your marketing data and can help you with:

📊 **Analytics & Performance**
• Traffic analysis and user behavior
• Conversion rates and revenue insights
• Channel performance comparisons

📈 **Marketing Insights**
• Google Ads & Meta Ads performance
• Social media engagement (Facebook, Instagram, LinkedIn)
• SEO performance and search rankings

💡 **Strategic Recommendations**
• Optimization opportunities
• Budget allocation suggestions
• Trend identification and forecasting

**What would you like to explore today?**`,
          timestamp: new Date().toISOString(),
        };
        setMessages([greetingMessage]);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl overflow-hidden">
      <ChatHeader onClose={onClose} onClearChat={handleClearChat} />

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {messages.map((message, index) => (
          <ChatMessage key={message._id || index} message={message} />
        ))}

        {/* Preset Questions - Decrease with every message: 5→4→3→2→1→0 */}
        {presetQuestions.length > 0 && (() => {
          // Calculate how many presets to show based on message count
          // Start with 5, decrease by 1 for every 2 messages (user + assistant pair)
          // Greeting message doesn't count, so subtract 1 from total
          const messageCount = Math.max(0, messages.length - 1); // Exclude greeting
          const messagePairs = Math.floor(messageCount / 2); // Count conversation turns
          const presetsToShow = Math.max(0, 5 - messagePairs);

          if (presetsToShow === 0) return null;

          // Filter out used presets and limit to calculated amount
          const availablePresets = presetQuestions
            .filter(preset => !usedPresetIds.has(preset.id))
            .slice(0, presetsToShow);

          if (availablePresets.length === 0) return null;

          return (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                <p className="text-xs font-medium text-gray-600">
                  {pageContext ? `Quick questions (${availablePresets.length}):` : `Suggested questions (${availablePresets.length}):`}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                {availablePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset.id, preset.question)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow text-left"
                  >
                    <span className="text-sm flex-shrink-0">{preset.icon}</span>
                    <span className="text-xs text-gray-700 group-hover:text-blue-700 font-medium line-clamp-2">
                      {preset.question}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Animated Robot Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Animated Robot Emoji */}
                <div className="relative">
                  <span
                    className="text-2xl inline-block animate-bounce"
                    style={{
                      animation: 'bounce 1s ease-in-out infinite, pulse 2s ease-in-out infinite'
                    }}
                  >
                    🤖
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {loadingStage === 'thinking' && 'Avi is thinking...'}
                    {loadingStage === 'analyzing' && 'Avi is analyzing your data...'}
                    {loadingStage === 'ready' && 'Avi is preparing insights...'}
                  </span>
                  <div className="flex gap-1 mt-1">
                    <div className={`h-1 w-8 rounded-full transition-all duration-300 ${loadingStage === 'thinking' ? 'bg-blue-600' : 'bg-blue-200'
                      }`} />
                    <div className={`h-1 w-8 rounded-full transition-all duration-300 ${loadingStage === 'analyzing' ? 'bg-blue-600' : 'bg-blue-200'
                      }`} />
                    <div className={`h-1 w-8 rounded-full transition-all duration-300 ${loadingStage === 'ready' ? 'bg-blue-600' : 'bg-blue-200'
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
