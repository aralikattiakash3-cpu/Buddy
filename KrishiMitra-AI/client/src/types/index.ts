export type SupportedLanguage = 'en' | 'kn' | 'hi';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  state?: string;
  district?: string;
  preferred_language: SupportedLanguage;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryReport {
  id: string;
  user_id: string;
  report_type: 'plant_doctor' | 'crop_advisor' | 'soil_advisor' | 'irrigation';
  crop_name?: string;
  input_data: Record<string, unknown>;
  result: Record<string, unknown>;
  created_at: string;
}

export interface FarmingTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  language: SupportedLanguage;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
}
