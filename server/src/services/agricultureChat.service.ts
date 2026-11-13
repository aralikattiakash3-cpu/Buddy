import { SupabaseClient } from '@supabase/supabase-js';
import { executeStructuredGeminiRequest } from '../utils/geminiHelper.js';
import { getAgricultureChatPrompt } from '../prompts/agriculture.prompts.js';
import { chatResponseSchema } from '../schemas/index.js';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export class AgricultureChatService {
  static async createSession(userId: string, title?: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return {
        id: 'mock-session-' + Date.now(),
        user_id: userId,
        title: title || 'Agriculture Consultation',
        created_at: new Date().toISOString(),
      };
    }

    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('chat_sessions')
      .insert({
        user_id: userId,
        title: title || 'Agriculture Consultation',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async listSessions(userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const db = client || getSupabaseAdmin();
    const { data, error } = await db
      .from('chat_sessions')
      .select('id, title, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getSessionWithMessages(sessionId: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return {
        session: { id: sessionId, title: 'Agriculture Consultation' },
        messages: [],
      };
    }

    const db = client || getSupabaseAdmin();
    const { data: session, error: sessionError } = await db
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (sessionError || !session) {
      throw new Error('Chat session not found or unauthorized');
    }

    const { data: messages, error: messagesError } = await db
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (messagesError) throw messagesError;

    return {
      session,
      messages: messages || [],
    };
  }

  static async sendMessage(
    sessionId: string,
    userId: string,
    message: string,
    language: 'en' | 'kn' | 'hi' = 'en',
    client?: SupabaseClient
  ) {
    let history: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    const db = isSupabaseConfigured() ? (client || getSupabaseAdmin()) : null;

    if (db) {
      // Verify session ownership
      const { data: session, error: sessionErr } = await db
        .from('chat_sessions')
        .select('id, title')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sessionErr || !session) {
        throw new Error('Chat session not found');
      }

      // Fetch last 10 messages for context
      const { data: pastMessages } = await db
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(10);

      if (pastMessages && pastMessages.length > 0) {
        history = pastMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
      }

      // Store user message
      await db.from('chat_messages').insert({
        session_id: sessionId,
        user_id: userId,
        role: 'user',
        content: message,
      });

      // Update title if default
      if (session.title === 'Agriculture Consultation' || session.title === 'Agriculture Conversation') {
        const snippet = message.slice(0, 35) + (message.length > 35 ? '...' : '');
        await db
          .from('chat_sessions')
          .update({ title: snippet })
          .eq('id', sessionId);
      }
    }

    // Call Gemini
    const prompt = getAgricultureChatPrompt(message, language, history);
    const aiResult = await executeStructuredGeminiRequest({
      prompt,
      schema: chatResponseSchema,
      temperature: 0.3,
    });

    if (db) {
      // Store assistant message
      await db.from('chat_messages').insert({
        session_id: sessionId,
        user_id: userId,
        role: 'assistant',
        content: aiResult.answer,
      });

      // Touch session updated_at
      await db
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    return aiResult;
  }

  static async deleteSession(sessionId: string, userId: string, client?: SupabaseClient) {
    if (!isSupabaseConfigured()) {
      return true;
    }
    const db = client || getSupabaseAdmin();
    const { error } = await db
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}
