import React, { useState } from 'react';
import { ListChecks, CheckCircle2, Circle } from 'lucide-react';

export default function NextSteps({ steps = [] }) {
  const [checked, setChecked] = useState({});

  if (!steps || steps.length === 0) return null;

  const toggle = (idx) => {
    setChecked(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-2xl space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <ListChecks className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            Recommended Next Steps
          </h3>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          {doneCount} of {steps.length} done
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isDone = !!checked[idx];
          return (
            <div
              key={idx}
              onClick={() => toggle(idx)}
              className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                isDone
                  ? 'bg-slate-950/40 border-slate-850 text-slate-500'
                  : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <span className={`text-xs leading-relaxed flex-1 ${isDone ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
