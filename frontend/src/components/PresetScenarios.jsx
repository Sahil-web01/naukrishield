import React from 'react';
import { PRESET_SCENARIOS } from '../utils/presets';
import { Sparkles } from 'lucide-react';

export default function PresetScenarios({ onSelectPreset, selectedPresetId }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium flex items-center space-x-1.5 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Try an example:</span>
        </span>
        <span className="text-[11px] text-slate-500">Click to load</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESET_SCENARIOS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          let colorClass = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';

          if (isSelected) {
            if (preset.color === 'rose') colorClass = 'border-rose-500/80 bg-rose-950/30 text-rose-200 ring-1 ring-rose-500/50';
            else if (preset.color === 'amber') colorClass = 'border-amber-500/80 bg-amber-950/30 text-amber-200 ring-1 ring-amber-500/50';
            else if (preset.color === 'emerald') colorClass = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 ring-1 ring-emerald-500/50';
            else colorClass = 'border-blue-500/80 bg-blue-950/30 text-blue-200 ring-1 ring-blue-500/50';
          }

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${colorClass}`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-semibold text-xs truncate">{preset.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {preset.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
