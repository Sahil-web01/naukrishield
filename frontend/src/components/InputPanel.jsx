import React from 'react';
import { Send, Trash2, AlertCircle, FileText } from 'lucide-react';

export default function InputPanel({
  text,
  onChangeText,
  onAnalyze,
  onClear,
  isLoading
}) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isTooShort = charCount > 0 && charCount < 15;

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && text.trim().length > 0) {
        onAnalyze();
      }
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Message or Job Offer
            </h2>
            <p className="text-[11px] text-slate-400">
              Paste email, WhatsApp message, Telegram chat, or job posting
            </p>
          </div>
        </div>

        {text && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-rose-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste message here..."
          rows={7}
          className="w-full bg-slate-950/80 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 p-4 text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-all resize-none leading-relaxed"
        />

        {isTooShort && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 text-xs text-amber-400 bg-amber-950/90 px-3 py-1 rounded-lg border border-amber-500/40">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Text is too short (&lt; 15 characters)</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
        <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
          <span>{charCount} chars</span>
          <span className="text-slate-700">•</span>
          <span>{wordCount} words</span>
          <span className="hidden sm:inline text-slate-500 text-[11px] font-sans">
            (Ctrl+Enter to analyze)
          </span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !text.trim()}
          className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg ${
            isLoading || !text.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Analyze Message</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
