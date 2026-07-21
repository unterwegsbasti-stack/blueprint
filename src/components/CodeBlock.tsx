import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'kotlin',
  title,
  showLineNumbers = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl font-mono text-xs my-3">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800 text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 inline-block" />
          </div>
          {title && <span className="ml-2 font-medium text-neutral-300 text-xs">{title}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="uppercase text-[10px] tracking-wider text-teal-400 font-semibold bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors bg-neutral-800/60 hover:bg-neutral-800 px-2.5 py-1 rounded-md border border-neutral-700/50"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-teal-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className="p-4 overflow-x-auto text-neutral-200 leading-relaxed font-mono">
        {showLineNumbers ? (
          <table className="border-collapse w-full">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="pr-4 text-right select-none text-neutral-600 font-mono text-[11px] w-8">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono pl-2 text-neutral-200">
                    {line}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="whitespace-pre font-mono">{code}</pre>
        )}
      </div>
    </div>
  );
};
