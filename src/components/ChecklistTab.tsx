import React from 'react';
import { CheckCircle2, Shield } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'c1', category: 'Security', title: 'Hardware-Backed Keystore Integration', description: 'AES-GCM master encryption keys generated in AndroidKeyStore.' },
  { id: 'c2', category: 'Security', title: 'SQLCipher Room Database Encryption', description: 'Database passphrases derived via PBKDF2 with salt.' },
  { id: 'c3', category: 'Architecture', title: 'Unidirectional MVI Flow', description: 'State management strictly isolated into UiState & UiIntent.' },
  { id: 'c4', category: 'Architecture', title: 'Hilt Dependency Injection', description: 'Singleton and ViewModel scopes injected via Dagger Hilt.' },
  { id: 'c5', category: 'Quality', title: 'JUnit & MockK Unit Tests', description: 'Repositories and ViewModels verified with 80%+ test coverage.' },
  { id: 'c6', category: 'CI/CD', title: 'GitHub Actions Pipeline', description: 'Automated typecheck, linting, and release APK building.' }
];

interface ChecklistTabProps {
  checkedItems: Record<string, boolean>;
  onToggleItem: (id: string) => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({ checkedItems, onToggleItem }) => {
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">Android Production Readiness Audit</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Verify that your application satisfies all enterprise security and architectural criteria.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-teal-400">{progressPercent}%</span>
          <p className="text-[11px] text-neutral-500 font-medium">{completedCount} of {totalCount} verified</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = !!checkedItems[item.id];
          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                isChecked
                  ? 'bg-teal-500/10 border-teal-500/40 text-neutral-200'
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 text-neutral-300'
              }`}
            >
              <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${
                isChecked ? 'text-teal-400 fill-teal-500/20' : 'text-neutral-600'
              }`} />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
