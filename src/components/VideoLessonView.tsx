import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Clock,
  ExternalLink,
  BookOpen,
  MonitorPlay,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Sun,
  Moon
} from 'lucide-react';
import { VideoLesson, Course, LessonProgress, Language } from '../types';
import { translations } from '../i18n/translations';

interface VideoLessonViewProps {
  lesson: VideoLesson;
  course: Course;
  allCourseLessons: VideoLesson[];
  progress?: LessonProgress;
  onBackToCourse: () => void;
  onStartQuiz: (lessonId: string) => void;
  onUpdateWatchProgress: (percentage: number) => void;
  onNavigateLesson: (lessonId: string) => void;
  lang: Language;
}

export const VideoLessonView: React.FC<VideoLessonViewProps> = ({
  lesson,
  course,
  allCourseLessons,
  progress,
  onBackToCourse,
  onStartQuiz,
  onUpdateWatchProgress,
  onNavigateLesson,
  lang
}) => {
  const t = translations[lang];

  // Initial watch percentage
  const initialWatched = progress?.isCompleted ? 100 : (progress?.watchedPercentage || 0);
  const [watchedPct, setWatchedPct] = useState<number>(initialWatched);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playerMode, setPlayerMode] = useState<'stream' | 'html5' | 'notes'>('stream');
  const [accumulatedSeconds, setAccumulatedSeconds] = useState<number>(
    Math.round((initialWatched / 100) * lesson.durationSeconds)
  );

  // Eye Protection / Eye Care Mode state
  const [eyeCareMode, setEyeCareMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('iiv_eye_care_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [eyeCareLevel, setEyeCareLevel] = useState<'mild' | 'warm' | 'night'>('warm');

  const toggleEyeCare = () => {
    const next = !eyeCareMode;
    setEyeCareMode(next);
    try {
      localStorage.setItem('iiv_eye_care_mode', String(next));
    } catch {}
  };

  const getEyeCareFilter = () => {
    if (!eyeCareMode) return 'none';
    if (eyeCareLevel === 'mild') return 'sepia(25%) brightness(95%) contrast(92%)';
    if (eyeCareLevel === 'warm') return 'sepia(45%) brightness(90%) contrast(90%) hue-rotate(-8deg)';
    return 'sepia(65%) brightness(85%) contrast(88%) hue-rotate(-15deg)';
  };

  // Sync state if lesson changes
  useEffect(() => {
    const currentProgress = progress?.isCompleted ? 100 : (progress?.watchedPercentage || 0);
    setWatchedPct(currentProgress);
    setAccumulatedSeconds(Math.round((currentProgress / 100) * lesson.durationSeconds));
    setIsPlaying(false);
  }, [lesson.id, progress]);

  // Continuous watch tracking timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && watchedPct < 100) {
      interval = setInterval(() => {
        setAccumulatedSeconds(prevSec => {
          const nextSec = prevSec + 5;
          const nextPct = Math.min(100, Math.round((nextSec / lesson.durationSeconds) * 100));
          setWatchedPct(nextPct);
          onUpdateWatchProgress(nextPct);
          if (nextPct >= 100) {
            setIsPlaying(false);
          }
          return nextSec;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, watchedPct, lesson.durationSeconds, onUpdateWatchProgress]);

  // Fast forward / direct mark as completed
  const handleCompleteWatch = () => {
    setWatchedPct(100);
    setAccumulatedSeconds(lesson.durationSeconds);
    setIsPlaying(false);
    onUpdateWatchProgress(100);
  };

  const handleIncrementWatch = (amount = 25) => {
    const nextPct = Math.min(100, watchedPct + amount);
    setWatchedPct(nextPct);
    setAccumulatedSeconds(Math.round((nextPct / 100) * lesson.durationSeconds));
    onUpdateWatchProgress(nextPct);
  };

  const isTestReady = watchedPct >= 90 || (progress && progress.isCompleted);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Lessons order navigation
  const sortedLessons = [...allCourseLessons].sort((a, b) => a.order - b.order);
  const currentIndex = sortedLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;

  // Convert youtube watch URL to embed URL with privacy enhancements
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(lesson.videoUrl);

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Top Navigation Strip */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToCourse}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{course.title[lang] || course.title.uz} ga qaytish</span>
        </button>

        <div className="flex items-center gap-2">
          {prevLesson && (
            <button
              onClick={() => onNavigateLesson(prevLesson.id)}
              className="p-2 text-slate-600 hover:text-blue-900 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer shadow-2xs"
              title={prevLesson.title[lang] || prevLesson.title.uz}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs font-mono font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
            {lesson.order} / {sortedLessons.length}
          </span>
          {nextLesson && (
            <button
              onClick={() => {
                if (progress?.isCompleted) {
                  onNavigateLesson(nextLesson.id);
                }
              }}
              disabled={!progress?.isCompleted}
              className={`p-2 border rounded-lg text-xs font-medium transition-colors ${
                progress?.isCompleted
                  ? 'text-slate-600 hover:text-blue-900 bg-white border-slate-200 cursor-pointer shadow-2xs'
                  : 'text-slate-300 bg-slate-50 border-slate-200 cursor-not-allowed'
              }`}
              title={nextLesson.title[lang] || nextLesson.title.uz}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Video Presentation Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Player Mode Switcher Tabs */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-slate-100 bg-slate-50 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPlayerMode('stream')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                playerMode === 'stream'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>Video Oqimi (Asosiy)</span>
            </button>
            <button
              onClick={() => setPlayerMode('html5')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                playerMode === 'html5'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Ichki Pleyer (HTML5)</span>
            </button>
            <button
              onClick={() => setPlayerMode('notes')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                playerMode === 'notes'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dars Konspekti</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Ko'zni asrash (Eye Care) Toggle Button */}
            <button
              type="button"
              onClick={toggleEyeCare}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                eyeCareMode
                  ? 'bg-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300/80 hover:bg-amber-300'
                  : 'bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 shadow-2xs'
              }`}
              title="Ko‘zni asrash rejimi: Uzoq vaqt dars ko‘rishda ko‘z toliqishi va zararli ko‘k nurni kamaytiradi"
            >
              {eyeCareMode ? (
                <Eye className="w-3.5 h-3.5 text-amber-950" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Ko‘zni asrash</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-mono font-bold ${
                eyeCareMode ? 'bg-amber-950 text-amber-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {eyeCareMode ? 'ON' : 'OFF'}
              </span>
            </button>

            <a
              href={lesson.videoUrl.replace('/embed/', '/watch?v=')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-blue-900 hover:underline"
            >
              <span>Tashqi manbada</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Video Player Display Container with Eye Care Filter */}
        <div
          className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden transition-all duration-300"
          style={{ filter: getEyeCareFilter() }}
        >
          {/* Eye Protection Soft Warm Tint Overlay */}
          {eyeCareMode && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-amber-500/12 mix-blend-multiply z-20 transition-opacity duration-300"
            />
          )}

          {/* Active Eye Care Mode Badge */}
          {eyeCareMode && (
            <div className="absolute top-3 right-3 z-30 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/85 backdrop-blur-xs text-amber-300 text-[10px] font-bold border border-amber-600/40 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Ko‘zni asrash: Faol ({eyeCareLevel === 'mild' ? 'Yumshoq' : eyeCareLevel === 'warm' ? 'Iliq' : 'Tungi'})</span>
            </div>
          )}
          
          {playerMode === 'stream' && (
            <div className="w-full h-full relative">
              <iframe
                src={`${embedUrl}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
                title={lesson.title[lang] || lesson.title.uz}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {playerMode === 'html5' && (
            <div className="w-full h-full relative flex items-center justify-center bg-radial from-slate-900 to-slate-950">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                controls
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleCompleteWatch}
              />
            </div>
          )}

          {playerMode === 'notes' && (
            <div className="w-full h-full bg-slate-900 text-white p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400">
                <BookOpen className="w-4 h-4" />
                <span>Mavzu konspekti va asosiy qoidalar</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {lesson.title[lang] || lesson.title.uz}
              </h2>
              <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
                <p>
                  {lesson.description[lang] || lesson.description.uz}
                </p>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                  <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                    Asosiy metodik tushunchalar:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                    <li>Mavzuning amaliy qo‘llanilishi va algoritmlar;</li>
                    <li>Sintaksis va operatorlar ustuvorligi;</li>
                    <li>Test savollarida e’tibor qaratilishi lozim bo‘lgan nozik nuqtalar.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Eye Care Settings Notification Banner */}
        {eyeCareMode && (
          <div className="px-4 sm:px-6 py-2.5 bg-amber-50/90 border-b border-amber-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold shrink-0">
                <Eye className="w-3 h-3 text-amber-900" />
              </div>
              <span className="font-semibold text-slate-800">
                Ko‘zni asrash yoqilgan: ekran ko‘k nuri yumshatildi, ko‘z toliqishi kamaytirildi.
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-amber-900">Nur harorati:</span>
              {(['mild', 'warm', 'night'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEyeCareLevel(lvl)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    eyeCareLevel === lvl
                      ? 'bg-amber-600 text-white shadow-2xs font-bold'
                      : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-300/80'
                  }`}
                >
                  {lvl === 'mild' ? 'Yumshoq' : lvl === 'warm' ? 'Iliq (Tavsiya)' : 'Tungi nur'}
                </button>
              ))}
              <button
                type="button"
                onClick={toggleEyeCare}
                className="ml-1 text-[11px] text-amber-900 hover:underline font-semibold cursor-pointer"
              >
                O‘chirish
              </button>
            </div>
          </div>
        )}

        {/* Video Playback & Anti-Skip Monitoring Bar */}
        <div className="p-5 sm:p-6 space-y-4 border-b border-slate-100 bg-slate-50/80">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Watch Progress Indicator */}
            <div className="flex items-center gap-2 flex-wrap">
              <ShieldCheck className="w-4 h-4 text-blue-900" />
              <span className="text-xs font-bold text-slate-800">{t.videoWatchedProgress}:</span>
              <span className="text-xs font-mono font-bold text-blue-900 tabular-nums">{watchedPct}%</span>
              <span className="text-[11px] text-slate-500 font-mono">
                ({formatTime(accumulatedSeconds)} / {formatTime(lesson.durationSeconds)})
              </span>

              {watchedPct >= 90 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test topshirish ochiq</span>
                </span>
              )}
            </div>

            {/* Anti-skip controls & Quick Unlocking Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Continuous Watch Toggle */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  isPlaying
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-blue-900 text-white hover:bg-blue-800'
                }`}
              >
                {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{isPlaying ? 'Kuzatuv davom etmoqda...' : 'Kuzatuvni yoqish (Play)'}</span>
              </button>

              {/* Step Advance Button */}
              {watchedPct < 90 && (
                <button
                  onClick={() => handleIncrementWatch(25)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                  title="Ko‘rish vaqtini oshirish"
                >
                  <span>+25%</span>
                </button>
              )}

              {/* Direct Instant Complete Button (Ensures user NEVER gets stuck!) */}
              {watchedPct < 90 && (
                <button
                  onClick={handleCompleteWatch}
                  className="px-3 py-1.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Darsni to‘liq ko‘rganlikni tasdiqlash"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Darsni o‘zlashtirdim (Testni ochish)</span>
                </button>
              )}
            </div>

          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                watchedPct >= 90 ? 'bg-emerald-600' : 'bg-blue-900'
              }`}
              style={{ width: `${watchedPct}%` }}
            />
          </div>

          {/* Anti-skip note */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {t.antiSkipWarning} Agar tashqi video pleer yuklanmasa, yuqoridagi <strong>«Darsni o‘zlashtirdim (Testni ochish)»</strong> yoki <strong>«Ichki Pleyer»</strong> tugmasidan foydalanishingiz mumkin.
            </span>
          </div>

        </div>

        {/* Lesson Details & Test CTA Button */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
              <span>{lesson.order}{t.lessonNumber}</span>
              <span aria-hidden="true">·</span>
              <span>10 ta test savoli</span>
              <span aria-hidden="true">·</span>
              <span>O‘tish talabi: 6/10</span>
              {lesson.videoLang && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase text-amber-700 font-bold">
                    {lesson.videoLang === 'uz' ? 'O‘zbekcha' : lesson.videoLang === 'ru' ? 'Ruscha' : 'Inglizcha'}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {lesson.title[lang] || lesson.title.uz}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {lesson.description[lang] || lesson.description.uz}
            </p>
          </div>

          {/* Test Action Strip */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {progress?.highestScore ? (
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-slate-600">Avvalgi eng yaxshi natijangiz:</span>
                  <span className="text-blue-900 font-mono font-bold">{progress.highestScore}/10</span>
                  {progress.isCompleted && (
                    <span className="text-emerald-700 font-bold ml-1">({t.lessonPassedBadge})</span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  {isTestReady ? t.videoFinishedNotice : t.testLockedWatchFirst}
                </p>
              )}
            </div>

            <button
              onClick={() => onStartQuiz(lesson.id)}
              disabled={!isTestReady}
              className={`px-6 py-3 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 ${
                isTestReady
                  ? 'bg-blue-900 hover:bg-blue-800 text-white cursor-pointer shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              <span>{t.startLessonTest}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
