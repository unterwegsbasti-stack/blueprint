import React from 'react';
import { Terminal, Check, Loader2 } from 'lucide-react';

interface BuildLogsModalProps {
  compileLogs: string[];
  isCompiling: boolean;
  compileProgress: number;
}

export const BuildLogsModal: React.FC<BuildLogsModalProps> = ({
  compileLogs,
  isCompiling,
  compileProgress
}) => {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/90 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-300 font-semibold">
          <Terminal className="w-4 h-4 text-teal-400" />
          <span>Gradle Mobile Assembly Build Output</span>
        </div>
        {isCompiling ? (
          <div className="flex items-center gap-2 text-teal-400 text-[11px] font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Compiling ({compileProgress}%)</span>
          </div>
        ) : compileLogs.some(l => l.includes('BUILD SUCCESSFUL')) ? (
          <div className="flex items-center gap-1.5 text-teal-400 text-[11px] font-semibold bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
            <Check className="w-3.5 h-3.5" />
            <span>Build Succeeded</span>
          </div>
        ) : null}
      </div>

      <div className="p-4 bg-neutral-950 font-mono text-neutral-300 min-h-[160px] max-h-[300px] overflow-y-auto space-y-1 text-[11px] leading-relaxed">
        {compileLogs.length === 0 ? (
          <div className="text-neutral-600 italic py-6 text-center">
            Configure Keystore parameters and click "Run Gradle APK Compiler" to initiate the secure mobile assembly pipeline.
          </div>
        ) : (
          compileLogs.map((log, index) => {
            const isSuccess = log && typeof log === 'string' && log.startsWith("BUILD SUCCESSFUL");
            const isSubTask = log && typeof log === 'string' && (log.includes("> Task") || log.includes("Executing Kotlin Gradle"));
            return (
              <div
                key={index}
                className={
                  isSuccess
                    ? "text-teal-400 font-bold mt-2 pt-2 border-t border-teal-500/20"
                    : isSubTask
                    ? "text-teal-500 font-semibold"
                    : "text-neutral-400"
                }
              >
                {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
