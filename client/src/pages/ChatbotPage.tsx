import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { ChatMessage, ChatResponse, Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { generateAdvisoryPDF } from '../utils/pdfExport';
import { toast } from 'sonner';
import {
  MessageCircle, Send, Plus, Trash2, Globe, AlertTriangle,
  Bot, User, Sparkles, Download, Clock
} from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function ChatbotPage() {
  const { language: initialLang } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(initialLang || 'en');
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user sessions
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await api.get<ChatSession[]>('/chat/sessions');
      setSessions(data || []);
      if (data && data.length > 0 && !currentSessionId) {
        selectSession(data[0].id);
      } else if (!data || data.length === 0) {
        createNewSession();
      }
    } catch {
      // Fallback: create initial session
      createNewSession();
    } finally {
      setSessionsLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      const newSession = await api.post<ChatSession>('/chat/sessions', {
        title: 'New Agriculture Consultation',
      });
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      setFollowUpQuestions([]);
    } catch (err: any) {
      toast.error('Could not initialize session.');
    }
  };

  const selectSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    try {
      const data = await api.get<{ session: ChatSession; messages: ChatMessage[] }>(
        `/chat/sessions/${sessionId}`
      );
      setMessages(data.messages || []);
      setFollowUpQuestions([]);
    } catch {
      setMessages([]);
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/sessions/${sessionId}`);
      const updated = sessions.filter(s => s.id !== sessionId);
      setSessions(updated);
      toast.success('Chat session deleted');
      if (currentSessionId === sessionId) {
        if (updated.length > 0) {
          selectSession(updated[0].id);
        } else {
          createNewSession();
        }
      }
    } catch {
      toast.error('Failed to delete session');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !currentSessionId || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);
    setFollowUpQuestions([]);

    try {
      const response = await api.post<ChatResponse>(
        `/chat/sessions/${currentSessionId}/messages`,
        {
          message: text,
          language: selectedLanguage,
        }
      );

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMsg]);
      if (response.suggestedFollowUpQuestions?.length > 0) {
        setFollowUpQuestions(response.suggestedFollowUpQuestions);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message. Please check Gemini API configuration.');
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: '⚠️ I encountered an error answering your question. Please ensure the backend is connected and Gemini API key is configured.',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (messages.length === 0) {
      toast.error('No messages to export');
      return;
    }
    generateAdvisoryPDF({
      type: 'chat',
      title: 'Kisan AI Advisory Consultation',
      data: {
        language: selectedLanguage,
        messages: messages.map(m => `${m.role.toUpperCase()}: ${m.content}`),
      },
    });
    toast.success('Conversation exported to PDF!');
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Sessions Sidebar */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Chat Sessions</span>
          <button
            onClick={createNewSession}
            className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => selectSession(s.id)}
              className={`p-2.5 rounded-xl cursor-pointer text-xs flex items-center justify-between gap-2 transition-colors ${
                currentSessionId === s.id
                  ? 'bg-green-100 text-green-900 font-semibold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{s.title}</span>
              </div>
              <button
                onClick={e => deleteSession(s.id, e)}
                className="opacity-40 hover:opacity-100 hover:text-red-600 p-0.5 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {sessions.length === 0 && !sessionsLoading && (
            <p className="text-xs text-slate-400 text-center py-4">No active conversations</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-700 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-tight">Kisan AI Agricultural Assistant</h2>
              <p className="text-xs text-slate-500">Ask any question on crops, pests, irrigation, or soil</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-2 py-0.5 rounded font-medium ${selectedLanguage === 'en' ? 'bg-white shadow-xs text-green-700 font-bold' : 'text-slate-600'}`}
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLanguage('kn')}
                className={`px-2 py-0.5 rounded font-medium ${selectedLanguage === 'kn' ? 'bg-white shadow-xs text-green-700 font-bold' : 'text-slate-600'}`}
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => setSelectedLanguage('hi')}
                className={`px-2 py-0.5 rounded font-medium ${selectedLanguage === 'hi' ? 'bg-white shadow-xs text-green-700 font-bold' : 'text-slate-600'}`}
              >
                हिन्दी
              </button>
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleExportPDF}
                className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                title="Download conversation PDF"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            )}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto py-8">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
                <Bot className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Namaste! How can I help your farm today?</h3>
              <p className="text-xs text-slate-500 mb-6">
                Ask about crop cultivation, pest remedies, fertilizer application, irrigation schedules, or harvesting advice.
              </p>
              <div className="w-full space-y-2 text-left">
                {[
                  'Which crops grow best in red soil during Kharif in Karnataka?',
                  'How do I control whiteflies in tomato plants organically?',
                  'What is the ideal drip irrigation schedule for maize?',
                  'How to treat yellow mosaic virus in pulses?',
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sample)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-green-50 text-xs text-slate-700 text-left transition-colors flex items-center justify-between gap-2"
                  >
                    <span>{sample}</span>
                    <Sparkles className="w-3 h-3 text-green-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-green-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'chat-bubble-user text-sm' : 'chat-bubble-ai text-sm shadow-xs'}`}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                {msg.created_at && (
                  <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-green-200' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="chat-bubble-ai text-sm flex items-center gap-2 py-3 px-4">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-green-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-green-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 ml-1">Kisan AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Follow-Ups */}
        {followUpQuestions.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-400 font-semibold uppercase mr-1">Suggested:</span>
            {followUpQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="text-xs bg-white border border-green-200 text-green-800 hover:bg-green-50 px-2.5 py-1 rounded-full transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={
                selectedLanguage === 'kn'
                  ? 'ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
                  : selectedLanguage === 'hi'
                  ? 'अपनी खेती से संबंधित प्रश्न यहाँ लिखें...'
                  : 'Ask an agricultural question...'
              }
              disabled={loading}
              className="input-field py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="btn-primary py-2.5 px-4 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-1 text-center">
            Kisan AI provides decision support. Verify with local agricultural officers before chemical treatments.
          </p>
        </div>
      </div>
    </div>
  );
}
