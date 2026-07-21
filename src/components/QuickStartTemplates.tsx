import React from 'react';
import { Sparkles } from 'lucide-react';
import { TEMPLATES, Template } from '../types';

interface QuickStartTemplatesProps {
  selectedTemplateId: string;
  onTemplateChange: (template: Template) => void;
}

export const QuickStartTemplates: React.FC<QuickStartTemplatesProps> = ({
  selectedTemplateId,
  onTemplateChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    onTemplateChange(template);
  };

  return (
    <div className="space-y-2 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Quick-Start Concept Templates</span>
      </div>
      <p className="text-xs text-neutral-400">
        Wähle eine Vorlage aus, um die Spezifikationen automatisch auszufüllen:
      </p>

      <div className="relative mt-1">
        <select
          value={selectedTemplateId}
          onChange={handleChange}
          className="w-full appearance-none bg-neutral-950 border border-neutral-800 text-white py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:border-teal-500/50 transition-colors text-xs font-medium cursor-pointer"
        >
          {TEMPLATES.map((t) => (
            <option key={t.id} value={t.id} className="bg-neutral-950 text-neutral-300 py-2">
              {t.label}
            </option>
          ))}
        </select>

        {/* Custom Chevron Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
