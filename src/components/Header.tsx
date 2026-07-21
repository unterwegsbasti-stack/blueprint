import React from 'react';
import { Smartphone, Shield, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-teal-500/10">
            <Smartphone className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">Android Architect Assistant</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                PRO 2026
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">Production-Grade Technical Concept Generator</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-neutral-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/50 border border-neutral-700/50 text-neutral-300">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>Privacy-First Blueprint Engine</span>
          </div>
          <div className="flex items-center gap-1.5 text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Jetpack Compose & Clean Arch</span>
          </div>
        </div>
      </div>
    </header>
  );
};
