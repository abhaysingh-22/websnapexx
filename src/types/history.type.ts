export interface Conversation {
  id: string;
  user_id: string;
  feature_title: string;
  preview_image_url: string | null;
  message_count: number;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  images: string[];
  created_at: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
  timestamp?: string;
}
