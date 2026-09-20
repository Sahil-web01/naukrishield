import React from 'react';
import { Shield, History, Activity } from 'lucide-react';

export default function Header({ isConnected, onOpenHistory, stats }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="font-outfit font-extrabold text-xl tracking-tight text-white">
              Naukri<span className="text-cyan-400">Shield</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span className="text-[11px] font-mono">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>

          {stats && stats.total > 0 && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-mono">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{stats.total} scans</span>
            </div>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>History</span>
          </button>
        </div>
      </div>
    </header>
  );
}
