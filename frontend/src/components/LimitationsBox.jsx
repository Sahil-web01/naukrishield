import React from 'react';
import { Info } from 'lucide-react';

export default function LimitationsBox({ limitations = [] }) {
  if (!limitations || limitations.length === 0) return null;

  return (
    <div className="glass-panel-subtle rounded-2xl p-4 space-y-1.5 border border-slate-800 text-xs">
      <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
        <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span>Important Note</span>
      </div>

      <ul className="space-y-1 text-slate-400 text-[11px] leading-relaxed pl-1">
        {limitations.map((item, idx) => (
          <li key={idx} className="flex items-start space-x-1.5">
            <span className="text-slate-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
