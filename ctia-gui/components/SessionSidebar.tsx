import { useState } from 'react';
import { FiMessageSquare, FiPlus, FiChevronLeft, FiMenu } from 'react-icons/fi';
import { Session } from '@/hooks/useChat';

interface SessionSidebarProps {
  sessions: Session[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

export default function SessionSidebar({ sessions, currentSessionId, onSelectSession, onNewSession }: SessionSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className={`bg-[#0f0f0f] border-r border-neutral-800 transition-all duration-300 ease-in-out flex flex-col ${
        isOpen ? 'w-64 p-4' : 'w-12 p-3 items-center'
      }`}
    >
      <div className={`flex items-center text-neutral-500 ${isOpen ? 'justify-between mb-6' : 'justify-center mb-6'}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200 transition-colors shrink-0"
        >
          {isOpen ? <FiChevronLeft className="w-4 h-4" /> : <FiMenu className="w-5 h-5" />}
        </button>

        {isOpen && (
          <button 
            onClick={onNewSession}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-500 border border-emerald-900/30 rounded text-xs transition-colors"
          >
            <FiPlus className="w-3 h-3" /> New
          </button>
        )}
      </div>

      {isOpen && (
        <div className="flex flex-col gap-2 overflow-y-auto animate-in fade-in duration-300 pr-1 custom-scrollbar">
          <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-2">Investigation History</div>
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`flex items-center gap-3 p-3 rounded text-left truncate transition-colors ${
                session.id === currentSessionId 
                  ? 'bg-neutral-800 text-emerald-400 border border-neutral-700' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 border border-transparent'
              }`}
            >
              <FiMessageSquare className="w-4 h-4 shrink-0" />
              <span className="text-xs truncate">{session.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}