import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-200 text-sm space-y-3 animate-fade-in my-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <h4 className="font-semibold text-red-300">Architecture Generation Error</h4>
          <p className="text-xs text-red-200/90 leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="pt-2 border-t border-red-500/20 flex justify-end">
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/70 border border-red-500/40 text-xs font-medium text-red-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Erneut versuchen (Retry)</span>
          </button>
        </div>
      )}
    </div>
  );
};
