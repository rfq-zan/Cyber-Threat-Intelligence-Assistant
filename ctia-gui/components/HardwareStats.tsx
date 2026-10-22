import { FiCpu, FiActivity } from 'react-icons/fi';

export default function HardwareStatus() {
  return (
    <div className="flex gap-4 text-[10px] text-neutral-500 uppercase tracking-widest border border-neutral-800 p-2 rounded bg-black">
      <div className="flex items-center gap-2">
        <FiCpu className="w-3 h-3 text-amber-500" />
        <span>VRAM: 4.0 GB Limit</span>
      </div>
      <div className="w-[1px] bg-neutral-800"></div>
      <div className="flex items-center gap-2">
        <FiActivity className="w-3 h-3 text-emerald-500" />
        <span>Engine: Qwen2.5</span>
      </div>
    </div>
  );
}