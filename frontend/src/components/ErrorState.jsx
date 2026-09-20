import React from 'react';
import { AlertOctagon, RotateCw, X } from 'lucide-react';

export default function ErrorState({ error, onRetry, onDismiss }) {
  if (!error) return null;

  return (
    <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 sm:p-5 text-rose-200 shadow-xl flex items-start space-x-3.5 animate-shake">
      <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1 text-xs">
        <h4 className="font-semibold text-white text-sm">Analysis Request Failed</h4>
        <p className="text-rose-200/90 leading-relaxed">{error}</p>
        <div className="pt-2 flex items-center space-x-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs transition-colors shadow"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry Analysis</span>
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white text-xs transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-rose-400 hover:text-white p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
