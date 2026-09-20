import React, { useEffect, useState } from 'react';
import { X, History, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { fetchScanHistory } from '../services/api';

export default function HistoryModal({ isOpen, onClose, onSelectHistoryItem }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    const data = await fetchScanHistory();
    setHistory(data?.history || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel border border-slate-750 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-white text-sm">Recent Scans</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadHistory}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {loading ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              Loading scans...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No recent scans saved yet.
            </div>
          ) : (
            history.map((item, idx) => {
              let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
              if (item.riskCategory === 'HIGH') badgeStyle = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
              else if (item.riskCategory === 'MODERATE') badgeStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
              else if (item.riskCategory === 'LOW') badgeStyle = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

              const timeStr = item.createdAt
                ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <div
                  key={item._id || idx}
                  onClick={() => {
                    onSelectHistoryItem(item.textSnippet);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${badgeStyle}`}>
                        {item.riskCategory} ({Math.round((item.riskScore || 0) * 100)}%)
                      </span>
                      {timeStr && (
                        <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{timeStr}</span>
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-cyan-400 flex items-center space-x-1 font-mono text-[11px]">
                      <span>Load</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    "{item.textSnippet}"
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-right">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-750"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
