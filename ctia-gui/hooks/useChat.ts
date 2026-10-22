import { useState, useEffect } from 'react';

export interface ChatTurn {
  user: string;
  topic: string;
}

export interface Message {
  role: 'user' | 'system';
  content: string;
  metadata?: {
    docs_retrieved?: number;
    mitigation_override?: boolean;
    time?: string;
  };
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  history: ChatTurn[];
}

export function useChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // User History & Session Management
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  const [config, setConfig] = useState({
    kRetrieval: 15,
    nAttack: 4,
    nMitigation: 2
  });

  useEffect(() => {
    const saved = localStorage.getItem('ctia_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      if (parsed.length > 0) {
        loadSession(parsed[0].id, parsed);
      } else {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  useEffect(() => {
    if (!currentSessionId || messages.length === 0) return;
    
    setSessions(prev => {
      const updated = prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages, history, title: s.title === 'New Investigation' && messages.length > 1 ? messages[1].content.substring(0, 30) + '...' : s.title } 
          : s
      );
      localStorage.setItem('ctia_sessions', JSON.stringify(updated));
      return updated;
    });
  }, [messages, history, currentSessionId]);

  const createNewSession = () => {
    const newId = Date.now().toString();
    const initMsg: Message = {
      role: 'system',
      content: "Strict Modular RAG CTIA Engine terinisialisasi. Menunggu input anomali sistem...",
      metadata: { time: new Date().toLocaleTimeString('id-ID') }
    };
    
    const newSession: Session = { id: newId, title: 'New Investigation', messages: [initMsg], history: [] };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([initMsg]);
    setHistory([]);
  };

  const loadSession = (id: string, sessionList = sessions) => {
    const target = sessionList.find(s => s.id === id);
    if (target) {
      setCurrentSessionId(id);
      setMessages(target.messages);
      setHistory(target.history);
    }
  };

  const handleTransmit = async () => {
    if (!input.trim() || isProcessing) return;
    
    const queryPayload = input;
    setInput('');
    setIsProcessing(true);
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: queryPayload,
      metadata: { time: new Date().toLocaleTimeString('id-ID') }
    }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryPayload,
          history: history.slice(-4),
          k_retrieval: config.kRetrieval,
          n_attack: config.nAttack,
          n_mitigation: config.nMitigation
        }),
      });

      const data = await res.json();

      if (res.ok && data.status !== 'blocked') {
        setHistory(prev => [...prev, { user: queryPayload, topic: data.topic_summary }]);
        setMessages(prev => [...prev, {
          role: 'system',
          content: data.answer,
          metadata: {
            docs_retrieved: data.metadata?.docs_retrieved,
            mitigation_override: data.metadata?.mitigation_override_active,
            time: new Date().toLocaleTimeString('id-ID')
          }
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'system',
          content: data.answer || "TRANSMISSION BLOCKED: Semantic Firewall diaktifkan.",
          metadata: { time: new Date().toLocaleTimeString('id-ID') }
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: "> [NETWORK ERROR]: Gagal menjangkau API Proxy lokal.",
        metadata: { time: new Date().toLocaleTimeString('id-ID') }
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    input, setInput, messages, isProcessing, handleTransmit, 
    config, setConfig, 
    sessions, currentSessionId, createNewSession, loadSession 
  };
}