import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, RotateCcw, Coins, Award, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TestAttemptResult, Language } from '../types';
import { translations } from '../i18n/translations';

interface QuizResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TestAttemptResult | null;
  onRetake: () => void;
  onProceedNext: () => void;
  hasNextLesson: boolean;
  lang: Language;
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  isOpen,
  onClose,
  result,
  onRetake,
  onProceedNext,
  hasNextLesson,
  lang
}) => {
  if (!isOpen || !result) return null;

  const t = translations[lang];
  const isPassed = result.passed;
  const incorrectAnswers = result.answers.filter(a => !a.isCorrect);
  const correctCount = result.score;
  const incorrectCount = result.maxScore - result.score;
  const passThreshold = result.type === 'lesson_10' ? 6 : 24;

  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isPassed]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Banner Header */}
        <div className={`p-6 sm:p-8 text-white flex items-start justify-between gap-4 ${
          isPassed
            ? 'bg-linear-to-r from-emerald-800 to-teal-900'
            : 'bg-linear-to-r from-rose-900 to-slate-900'
        }`}>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/10 text-white">
              {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{isPassed ? t.resultTitleSuccess : t.resultTitleFail}</span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums">
                {result.score}/{result.maxScore}
              </span>
              <span className="text-xs text-white/80">
                (O‘tish talabi: {passThreshold}/{result.maxScore})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
              {isPassed ? t.nextLessonUnlockedMsg : t.rewatchVideoMsg}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50 divide-x divide-slate-100 text-center p-3 text-xs">
          <div>
            <span className="text-slate-500">To‘g‘ri javoblar</span>
            <div className="font-bold text-emerald-700 font-mono text-base tabular-nums">{correctCount}</div>
          </div>
          <div>
            <span className="text-slate-500">Noto‘g‘ri javoblar</span>
            <div className="font-bold text-rose-700 font-mono text-base tabular-nums">{incorrectCount}</div>
          </div>
          <div>
            <span className="text-slate-500">To‘plangan coin</span>
            <div className="font-bold text-amber-600 font-mono text-base tabular-nums">
              {isPassed ? (result.type === 'lesson_10' ? '+10' : '+50') : '0'}
            </div>
          </div>
        </div>

        {/* Error Breakdown Analysis Section (STRICTLY HIDING CORRECT ANSWER KEYS!) */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {t.errorAnalysisHeading}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.errorAnalysisNotice}
            </p>
          </div>

          {incorrectAnswers.length > 0 ? (
            <div className="space-y-4">
              {incorrectAnswers.map((ans, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Savol {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[11px] font-bold rounded-md">
                      Xato javob
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                    {ans.questionText}
                  </h4>

                  {/* Student selected answer */}
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-xs space-y-1">
                    <div className="text-rose-700 font-medium">{t.yourAnswer}:</div>
                    <div className="font-semibold text-rose-950 font-mono">
                      {ans.selectedOptionText}
                    </div>
                    <div className="text-[11px] text-rose-600 italic">
                      {t.answerIncorrect}
                    </div>
                  </div>

                  {/* Guidance hint / review recommendation (Without revealing answer!) */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
                    <div className="text-amber-800 font-bold">{t.topicRecommendation}:</div>
                    <div className="text-amber-950 leading-relaxed">
                      {ans.explanationHint}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">A’lo darajadagi natija!</h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Barcha savollarga 100% to‘g‘ri javob berdingiz. Mavzularni a’lo o‘zlashtirganingiz tasdiqlandi.
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
          <button
            onClick={onRetake}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retakeTestBtn}</span>
          </button>

          {isPassed && hasNextLesson ? (
            <button
              onClick={onProceedNext}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>{t.goToNextLessonBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>{t.backToCourseBtn}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
