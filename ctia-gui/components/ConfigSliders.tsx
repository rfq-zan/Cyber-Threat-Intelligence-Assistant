import { useState } from 'react';
import { FiSliders, FiChevronRight, FiSettings } from 'react-icons/fi';

interface ConfigSlidersProps {
  config: { kRetrieval: number; nAttack: number; nMitigation: number };
  setConfig: React.Dispatch<React.SetStateAction<{ kRetrieval: number; nAttack: number; nMitigation: number }>>;
  disabled: boolean;
}

export default function ConfigSliders({ config, setConfig, disabled }: ConfigSlidersProps) {
  // State untuk mengontrol apakah sidebar terbuka atau tertutup
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className={`bg-[#0f0f0f] border-l border-neutral-800 transition-all duration-300 ease-in-out flex flex-col ${
        isOpen ? 'w-64 p-4' : 'w-12 p-3 items-center'
      }`}
    >
      <div className={`flex items-center text-neutral-500 ${isOpen ? 'justify-between mb-6' : 'justify-center'}`}>
        {isOpen && (
          <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] border-b border-neutral-800 pb-2 w-full mr-2 whitespace-nowrap overflow-hidden">
            <FiSliders className="w-3 h-3 shrink-0" />
            <span>RAG Parameters</span>
          </div>
        )}
        
        {/* Tombol Lipat / Buka */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200 transition-colors shrink-0"
          title={isOpen ? "Collapse Panel" : "Expand Config"}
        >
          {isOpen ? <FiChevronRight className="w-4 h-4" /> : <FiSettings className="w-5 h-5 text-emerald-600" />}
        </button>
      </div>

      {/* Sliders Content - Hanya di-render ketika terbuka */}
      {isOpen && (
        <div className="flex flex-col gap-6 overflow-hidden whitespace-nowrap animate-in fade-in duration-300">
          
          {/* Top-K Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Top-K Retrieval</span>
              <span className="text-emerald-500 font-bold">{config.kRetrieval}</span>
            </div>
            <input 
              type="range" min="5" max="50" step="1"
              value={config.kRetrieval}
              onChange={(e) => setConfig({ ...config, kRetrieval: parseInt(e.target.value) })}
              disabled={disabled}
              className="accent-emerald-700 cursor-pointer disabled:opacity-50"
            />
            <p className="text-[9px] text-neutral-600 whitespace-normal">Total chunk vectors fetched from ChromaDB.</p>
          </div>

          {/* Top-N Attack Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Top-N (Attack)</span>
              <span className="text-red-500 font-bold">{config.nAttack}</span>
            </div>
            <input 
              type="range" min="1" max="10" step="1"
              value={config.nAttack}
              onChange={(e) => setConfig({ ...config, nAttack: parseInt(e.target.value) })}
              disabled={disabled}
              className="accent-red-900 cursor-pointer disabled:opacity-50"
            />
            <p className="text-[9px] text-neutral-600 whitespace-normal">Post-reranked nodes specific to CVE/TTPs.</p>
          </div>

          {/* Top-N Mitigation Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Top-N (Mitigation)</span>
              <span className="text-blue-500 font-bold">{config.nMitigation}</span>
            </div>
            <input 
              type="range" min="1" max="5" step="1"
              value={config.nMitigation}
              onChange={(e) => setConfig({ ...config, nMitigation: parseInt(e.target.value) })}
              disabled={disabled}
              className="accent-blue-900 cursor-pointer disabled:opacity-50"
            />
            <p className="text-[9px] text-neutral-600 whitespace-normal">Post-reranked nodes specific to defense strategies.</p>
          </div>

          {/* Warning Box */}
          <div className="mt-auto p-3 bg-amber-950/20 border border-amber-900/30 rounded text-[9px] text-amber-500/80 leading-relaxed whitespace-normal">
            <strong>WARNING:</strong> Increasing node limits beyond 6 total (Attack + Mitigation) may exceed the 4GB VRAM sliding window constraint during Qwen 2.5 context compilation.
          </div>
        </div>
      )}
    </div>
  );
}