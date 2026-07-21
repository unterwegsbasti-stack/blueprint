import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  optionalTag?: boolean;
  type?: string;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  optionalTag = false,
  type = 'text',
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
          {label} {required && <span className="text-teal-400">*</span>}
        </label>
        {optionalTag && (
          <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">
            Optional
          </span>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all text-sm font-normal"
      />
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
        {label} {required && <span className="text-teal-400">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all text-sm resize-none leading-relaxed font-normal"
      />
    </div>
  );
};
