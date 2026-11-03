import { FiMessageSquare, FiPlus, FiTrash2 } from 'react-icons/fi';

interface Session {
  id: string;
  title?: string;
}

interface SessionSidebarProps {
  sessions: Session[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
}

export default function SessionSidebar({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewSession, 
  onDeleteSession,
  isOpen 
}: SessionSidebarProps) {
  return (
    <div 
      className={`${isOpen ? 'w-64 border-r border-neutral-800' : 'w-0 border-r-0'} bg-[#0f0f0f] flex flex-col z-10 shadow-lg transition-all duration-300 overflow-hidden shrink-0`}
    >
      <div className="w-64 flex flex-col h-full">
        <div className="p-4 border-b border-neutral-800">
          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-900/50 bg-emerald-950/20 text-emerald-500 rounded hover:bg-emerald-900/40 hover:text-emerald-400 transition-colors text-xs font-bold tracking-widest uppercase"
          >
            <FiPlus className="w-4 h-4" />
            New Investigation
          </button>
          <div className="mt-6 mb-2 text-[10px] tracking-widest text-neutral-600 uppercase font-semibold">
            Query History
          </div>
        </div>
        
        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200 ${
                currentSessionId === session.id 
                  ? 'bg-neutral-900 border border-neutral-800' 
                  : 'hover:bg-neutral-900/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FiMessageSquare 
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    currentSessionId === session.id 
                      ? "text-emerald-500" 
                      : "text-neutral-600 group-hover:text-emerald-500/70"
                  }`} 
                />
                <span 
                  className={`text-sm truncate transition-colors ${
                    currentSessionId === session.id 
                      ? 'text-neutral-200 font-medium' 
                      : 'text-neutral-500 group-hover:text-neutral-300'
                  }`}
                >
                  {session.title || "New Investigation"}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-600 hover:text-red-500 hover:bg-neutral-800 rounded transition-all"
                title="Delete Investigation"
              >
                <FiTrash2 className="w-[14px] h-[14px]" />
              </button>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="text-center text-xs text-neutral-700 mt-6 italic">
              No active investigations
            </div>
          )}
        </div>
      </div>
    </div>
  );
}