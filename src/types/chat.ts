// Chat types for frontend

export interface ChatMessageType {
  _id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  formattedTimestamp?: string;
}

export interface ChatConversation {
  _id: string;
  userId: string;
  projectId: string;
  title: string;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  projectId: string;
  message: string;
  conversationId?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  pageContext?: 'overview' | 'analytics' | 'youtube' | 'facebook' | 'instagram' | 'meta-ads' | 'google-ads' | 'search-console' | 'linkedin';
}

export interface SendMessageResponse {
  conversationId: string;
  messageId: string;
  response: string;
  metrics?: any;
}
