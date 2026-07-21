import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does the Android Technical Blueprint Generator ensure Privacy by Design?",
    answer: "The AI model is instructed to strictly prioritize local-only data persistence (Room with SQLCipher), biometric unlock via BiometricPrompt, hardware-backed Android KeyStore key generation, and zero-knowledge synchronization architectures."
  },
  {
    question: "Can I export generated blueprints to my developer team?",
    answer: "Yes! You can copy individual Kotlin files, export complete Markdown technical specification documents, or download ready-to-run Gradle & Compose snippet files directly into your IDE."
  },
  {
    question: "Is Jetpack Compose MVI supported natively?",
    answer: "Absolut. Every generated UI specification uses pure Jetpack Compose Material 3 with unidirectional MVI state management, including typed UiState data classes and UiIntent sealed structures."
  }
];

interface FaqSectionProps {
  activeFaqIndex: number | null;
  onToggleFaq: (index: number) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ activeFaqIndex, onToggleFaq }) => {
  return (
    <div className="space-y-4 pt-6 border-t border-neutral-800">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-teal-400" />
        <h3 className="text-base font-bold text-white">Frequently Asked Questions</h3>
      </div>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = activeFaqIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden transition-all"
            >
              <button
                onClick={() => onToggleFaq(isOpen ? -1 : idx)}
                className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800/50 transition-colors"
              >
                <span>{item.question}</span>
                <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-90 text-teal-400' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-3 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/50 bg-neutral-950/30">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
