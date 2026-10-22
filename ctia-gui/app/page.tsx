'use client';

import { useRef, useEffect } from 'react';
import { FiTerminal, FiShield, FiSend, FiLock } from 'react-icons/fi';
import HardwareStats from '@/components/HardwareStats';
import ConfigSliders from '@/components/ConfigSliders';
import SessionSidebar from '@/components/SessionSidebar'; // NEW
import { useChat } from '@/hooks/useChat';

export default function SOCDashboard() {
  const { 
    input, setInput, messages, isProcessing, handleTransmit, 
    config, setConfig,
    sessions, currentSessionId, createNewSession, loadSession // NEW
  } = useChat();
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 font-mono selection:bg-emerald-900 selection:text-emerald-100 flex flex-col">
      
      <header className="border-b border-neutral-800 bg-[#0f0f0f] p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-950 border border-emerald-800 rounded">
            <FiShield className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-neutral-100">CTIA // EDGE ANALYTICS</h1>
            <p className="text-[10px] text-neutral-500 flex items-center gap-1 uppercase">
              <FiLock className="w-3 h-3" /> Air-Gapped Network
            </p>
          </div>
        </div>
        <HardwareStats />
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* User Session */}
        <SessionSidebar 
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={loadSession}
          onNewSession={createNewSession}
        />

        {/* Chat Display */}
        <div className="flex-1 flex flex-col relative bg-[#0a0a0a]">
          <main ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl border rounded p-4 ${
                  msg.role === 'user' 
                    ? 'bg-neutral-900/50 border-neutral-800 text-neutral-200' 
                    : 'bg-emerald-950/10 border-emerald-900/30 text-emerald-50 shadow-[0_0_15px_rgba(4,120,87,0.03)]'
                }`}>
                  <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-800/50 pb-2">
                    {msg.role === 'user' ? (
                      <><FiTerminal className="w-3 h-3" /> ANALYST INPUT [{msg.metadata?.time}]</>
                    ) : (
                      <><FiShield className="w-3 h-3 text-emerald-600" /> CTIA RESPONSE [{msg.metadata?.time}]</>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                  
                  {msg.role === 'system' && msg.metadata?.docs_retrieved !== undefined && (
                    <div className="mt-4 pt-3 border-t border-emerald-900/30 flex gap-4 text-[10px] font-semibold text-emerald-600/70">
                      <span>[DOCS_RETRIEVED: {msg.metadata.docs_retrieved}]</span>
                      <span>[MITIGATION_OVERRIDE: {msg.metadata.mitigation_override ? 'ACTIVE' : 'INACTIVE'}]</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="border border-emerald-900/30 bg-emerald-950/10 rounded p-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 animate-ping rounded-full"></div>
                  <span className="text-xs text-emerald-600 tracking-widest uppercase">Querying ChromaDB Vectors...</span>
                </div>
              </div>
            )}
          </main>

          <footer className="p-4 bg-[#0f0f0f] border-t border-neutral-800">
            <div className="max-w-4xl mx-auto relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTransmit()}
                placeholder="Initialize query sequence (CVE / TTPs)..."
                disabled={isProcessing}
                className="w-full bg-black border border-neutral-800 rounded px-4 py-4 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-900 transition-all disabled:opacity-50"
              />
              <button
                onClick={handleTransmit}
                disabled={isProcessing || !input.trim()}
                className="absolute right-2 top-2 p-2 bg-emerald-900 text-emerald-100 rounded hover:bg-emerald-800 disabled:opacity-50 disabled:hover:bg-emerald-900 transition-colors"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </div>
          </footer>
        </div>
        
        {/* Document Slider */}
        <ConfigSliders config={config} setConfig={setConfig} disabled={isProcessing} />

      </div>
    </div>
  );
}