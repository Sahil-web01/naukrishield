import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function EvidenceList({
  evidenceSpans = [],
  selectedSpanIndex,
  onSelectSpan
}) {
  if (!evidenceSpans || evidenceSpans.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex items-center space-x-3 text-slate-300">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div className="text-xs">
          <p className="font-semibold text-white">No Suspicious Phrases Detected</p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            The message did not contain typical fraud patterns like advance fees or unofficial communication channels.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-2xl space-y-3.5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-semibold text-white">
            Why this was flagged ({evidenceSpans.length})
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {evidenceSpans.map((span, index) => {
          const isSelected = selectedSpanIndex === index;

          let badgeStyle = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
          let borderStyle = 'border-slate-800 hover:border-slate-700';

          if (span.severity === 'CRITICAL') {
            badgeStyle = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
            borderStyle = isSelected ? 'border-rose-500 ring-1 ring-rose-500/60' : 'border-slate-800 hover:border-rose-500/40';
          } else if (span.severity === 'HIGH') {
            badgeStyle = 'bg-orange-500/15 text-orange-300 border-orange-500/30';
            borderStyle = isSelected ? 'border-orange-500 ring-1 ring-orange-500/60' : 'border-slate-800 hover:border-orange-500/40';
          }

          return (
            <div
              key={index}
              onClick={() => onSelectSpan && onSelectSpan(index)}
              className={`p-3.5 rounded-xl border bg-slate-950/60 cursor-pointer transition-all ${borderStyle}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white text-xs">
                    {span.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${badgeStyle}`}>
                    {span.severity}
                  </span>
                </div>
              </div>

              <div className="mb-1.5">
                <span className="text-xs text-slate-200 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-750 font-mono inline-block">
                  "{span.phrase}"
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {span.reason}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
