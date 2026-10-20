import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { Question, Language, TestAnswerSubmission } from '../types';
import { translations } from '../i18n/translations';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'lesson_10' | 'final_30';
  questions: Question[];
  onSubmitQuiz: (submissions: TestAnswerSubmission[]) => void;
  lang: Language;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  questions,
  onSubmitQuiz,
  lang
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (qId: string, optIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optIdx
    }));
    setShowWarning(false);
  };

  const handleFinish = () => {
    if (answeredCount < totalQuestions) {
      setShowWarning(true);
      return;
    }

    const submissions: TestAnswerSubmission[] = questions.map(q => ({
      questionId: q.id,
      selectedOptionIndex: selectedAnswers[q.id] ?? -1
    }));

    onSubmitQuiz(submissions);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
              <span>{type === 'lesson_10' ? '10 talik dars testi' : '30 talik yakuniy imtihon'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{answeredCount} / {totalQuestions} belgilandi</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Navigation Bubbles Strip */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-white">
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-900 text-white shadow-xs'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Body */}
        {currentQ && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-900 tracking-wider uppercase">
                {t.quizQuestion} {currentIdx + 1} {t.quizOf} {totalQuestions}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQ.text[lang] || currentQ.text.uz}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                      isSelected
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {optLetter}
                    </div>

                    <span className={`text-xs sm:text-sm ${isSelected ? 'font-semibold text-blue-950' : 'text-slate-700'}`}>
                      {opt[lang] || opt.uz}
                    </span>
                  </button>
                );
              })}
            </div>

            {showWarning && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t.quizSelectWarning} ({totalQuestions - answeredCount} ta savol qoldi)</span>
              </div>
            )}

          </div>
        )}

        {/* Footer Controls */}
        <div className="p-5 sm:p-6 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Oldingisi</span>
            </button>

            <button
              onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentIdx === totalQuestions - 1}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Keyingisi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleFinish}
            className="px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.quizSubmitBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
