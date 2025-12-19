import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessageType } from '../../types/chat';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex gap-3 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {isAssistant && (
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-blue-100">
            <Bot className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        )}
        {isUser && (
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg ring-2 ring-gray-200">
            <User className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        )}

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div
            className={`rounded-xl shadow-md ${isUser
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                : 'bg-white text-gray-900 border border-gray-200'
              }`}
          >
            {isAssistant ? (
              // Enhanced markdown rendering for AI responses
              <div className="px-5 py-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Headings with improved hierarchy
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-4 mt-0"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-lg font-bold text-gray-800 mt-5 mb-3 flex items-center gap-2"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-base font-semibold text-gray-700 mt-4 mb-2"
                        {...props}
                      />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4
                        className="text-sm font-semibold text-gray-600 mt-3 mb-2"
                        {...props}
                      />
                    ),
                    // Paragraphs with better spacing
                    p: ({ node, ...props }) => (
                      <p
                        className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0"
                        {...props}
                      />
                    ),
                    // Enhanced lists with better spacing
                    ul: ({ node, ...props }) => (
                      <ul
                        className="text-sm text-gray-700 space-y-2 pl-5 mb-4 list-disc marker:text-blue-500"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="text-sm text-gray-700 space-y-2 pl-5 mb-4 list-decimal marker:text-blue-500 marker:font-semibold"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        className="text-sm leading-relaxed pl-1"
                        {...props}
                      />
                    ),
                    // Strong text with accent color
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-semibold text-gray-900 bg-yellow-50 px-1 rounded"
                        {...props}
                      />
                    ),
                    // Emphasis with subtle styling
                    em: ({ node, ...props }) => (
                      <em
                        className="italic text-gray-800 not-italic font-medium"
                        {...props}
                      />
                    ),
                    // Enhanced code blocks
                    code: ({ node, inline, ...props }: any) =>
                      inline ? (
                        <code
                          className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-mono border border-blue-200"
                          {...props}
                        />
                      ) : (
                        <code
                          className="block bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto my-3 shadow-inner"
                          {...props}
                        />
                      ),
                    // Styled blockquotes
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-blue-500 bg-blue-50 pl-4 pr-4 py-3 italic text-gray-700 my-3 rounded-r-lg"
                        {...props}
                      />
                    ),
                    // Links with hover effect
                    a: ({ node, ...props }) => (
                      <a
                        className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-500 transition-colors font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    // Enhanced tables
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200 text-sm" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody className="bg-white divide-y divide-gray-100" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="px-4 py-3 text-sm text-gray-600"
                        {...props}
                      />
                    ),
                    // Horizontal rule as section divider
                    hr: ({ node, ...props }) => (
                      <hr
                        className="my-6 border-t-2 border-gray-200"
                        {...props}
                      />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              // User messages with padding
              <div className="px-4 py-3">
                <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </div>
              </div>
            )}
          </div>

          {/* Timestamp with better positioning */}
          <div
            className={`text-xs text-gray-500 mt-1.5 px-2 flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'
              }`}
          >
            {isAssistant && (
              <span className="text-gray-400">•</span>
            )}
            <span>
              {message.formattedTimestamp ||
                new Date(message.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
