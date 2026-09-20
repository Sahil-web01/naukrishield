import React from 'react';
import { Eye } from 'lucide-react';

export default function TextHighlighter({
  text,
  evidenceSpans = [],
  selectedSpanIndex,
  onSelectSpan
}) {
  if (!text) return null;

  const renderContent = () => {
    if (!evidenceSpans || evidenceSpans.length === 0) {
      return <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">{text}</p>;
    }

    const sorted = [...evidenceSpans].sort((a, b) => a.start - b.start);
    const elements = [];
    let current = 0;

    sorted.forEach((span, idx) => {
      if (span.start > current) {
        elements.push(
          <span key={`text-${current}`} className="text-slate-300">
            {text.slice(current, span.start)}
          </span>
        );
      }

      const isSelected = selectedSpanIndex === idx;

      let pillColor = 'bg-amber-500/20 text-amber-200 border-amber-500/40 hover:bg-amber-500/30';
      if (span.severity === 'CRITICAL') {
        pillColor = 'bg-rose-500/25 text-rose-200 border-rose-500/50 hover:bg-rose-500/35';
      } else if (span.severity === 'HIGH') {
        pillColor = 'bg-orange-500/20 text-orange-200 border-orange-500/40 hover:bg-orange-500/30';
      }

      if (isSelected) {
        pillColor += ' ring-2 ring-white font-semibold';
      }

      elements.push(
        <mark
          key={`span-${idx}`}
          onClick={() => onSelectSpan && onSelectSpan(idx)}
          className={`cursor-pointer px-1.5 py-0.5 mx-0.5 rounded border text-xs font-mono transition-all inline-block ${pillColor}`}
          title={`${span.category}: ${span.reason}`}
        >
          {text.slice(span.start, span.end)}
        </mark>
      );

      current = Math.max(current, span.end);
    });

    if (current < text.length) {
      elements.push(
        <span key="text-end" className="text-slate-300">
          {text.slice(current)}
        </span>
      );
    }

    return <div className="leading-relaxed whitespace-pre-wrap text-sm">{elements}</div>;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-2xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">
            Highlighted Phrases
          </h3>
        </div>

        <span className="text-xs font-mono text-slate-400">
          {evidenceSpans.length > 0 ? `${evidenceSpans.length} phrase(s) flagged` : 'No suspicious phrases'}
        </span>
      </div>

      <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 max-h-60 overflow-y-auto leading-relaxed">
        {renderContent()}
      </div>

      <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80" />
          <span>Critical</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/80" />
          <span>High Risk</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80" />
          <span>Medium</span>
        </div>
        <span className="text-slate-500 text-[10px] hidden sm:inline">
          (Click highlighted text to focus details)
        </span>
      </div>
    </div>
  );
}
