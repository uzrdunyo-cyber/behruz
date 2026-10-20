import React from 'react';
import { BookOpen, Video, CheckCircle2, Award, Coins, ArrowRight, Play, Flame, Sparkles } from 'lucide-react';
import { User, Course, VideoLesson, LessonProgress, Certificate, Language } from '../types';
import { translations } from '../i18n/translations';

interface StudentDashboardProps {
  currentUser: User;
  courses: Course[];
  lessons: VideoLesson[];
  progressList: LessonProgress[];
  certificates: Certificate[];
  onSelectCourse: (courseId: string) => void;
  onOpenLesson: (lessonId: string) => void;
  onNavigateTab: (tab: string) => void;
  lang: Language;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  courses,
  lessons,
  progressList,
  certificates,
  onSelectCourse,
  onOpenLesson,
  onNavigateTab,
  lang
}) => {
  const t = translations[lang];

  // User-specific stats calculation
  const userProgress = progressList.filter(p => p.userId === currentUser.id);
  const completedLessonsCount = userProgress.filter(p => p.isCompleted).length;
  
  // Calculate average score across attempts
  const testsCompleted = userProgress.filter(p => p.highestScore > 0);
  const avgScore = testsCompleted.length > 0
    ? (testsCompleted.reduce((acc, p) => acc + p.highestScore, 0) / testsCompleted.length).toFixed(1)
    : '0';

  const userCertificates = certificates.filter(c => c.userId === currentUser.id);

  // Determine started courses count
  const startedCourseIds = new Set(userProgress.map(p => p.courseId));
  const startedCoursesCount = startedCourseIds.size || (courses.length > 0 ? 1 : 0);

  // Find next lesson to resume
  // Find first lesson in courses that is not completed yet
  let nextLessonToResume: VideoLesson | null = null;
  let nextLessonCourse: Course | null = null;

  for (const course of courses) {
    const courseLessons = lessons.filter(l => l.courseId === course.id);
    for (const lesson of courseLessons) {
      const prog = userProgress.find(p => p.lessonId === lesson.id);
      if (!prog || !prog.isCompleted) {
        nextLessonToResume = lesson;
        nextLessonCourse = course;
        break;
      }
    }
    if (nextLessonToResume) break;
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-md border border-blue-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200">
            <span>{currentUser.group}-guruh o‘quvchisi</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-bold">{currentUser.coins} coin to‘plangan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Assalomu alaykum, {currentUser.name} {currentUser.surname}!
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed max-w-2xl">
            IIV Andijon akademik litseyi elektron platformasiga xush kelibsiz. Bilimlaringizni oshiring, dars testlaridan muvaffaqiyatli o‘tib coinlar yig‘ing va rasmiy bilim sertifikatiga ega bo‘ling!
          </p>
        </div>

        {/* Decorative subtle background geometry */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none" />
      </div>

      {/* Primary KPI Grid (Tabular numerals, disciplined unboxed styling) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Started Courses */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">{t.statsCoursesStarted}</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {startedCoursesCount}
            </span>
            <span className="text-xs text-slate-500 ml-1">/ {courses.length}</span>
          </div>
        </div>

        {/* Completed Lessons */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">{t.statsLessonsCompleted}</span>
            <Video className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {completedLessonsCount}
            </span>
            <span className="text-xs text-slate-500 ml-1">ta dars</span>
          </div>
        </div>

        {/* Avg Test Score */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">{t.statsAvgScore}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {avgScore}
            </span>
            <span className="text-xs text-slate-500 ml-1">/ 10</span>
          </div>
        </div>

        {/* Total Coins */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">{t.statsTotalCoins}</span>
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
              {currentUser.coins}
            </span>
            <span className="text-xs text-slate-500 ml-1">coin</span>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">{t.statsCertificatesCount}</span>
            <Award className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {userCertificates.length}
            </span>
            <span className="text-xs text-slate-500 ml-1">ta</span>
          </div>
        </div>

      </div>

      {/* Up Next: Continue Lesson Banner */}
      {nextLessonToResume && nextLessonCourse ? (
        <div className="bg-linear-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-blue-800 font-medium">
                <span>{t.nextLessonResume}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold">{nextLessonCourse.title[lang] || nextLessonCourse.title.uz}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {nextLessonToResume.title[lang] || nextLessonToResume.title.uz}
              </h2>
              <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                {nextLessonToResume.description[lang] || nextLessonToResume.description.uz}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenLesson(nextLessonToResume!.id)}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>{t.continueLessonBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{t.allCaughtUp}</span>
        </div>
      )}

      {/* Active Courses Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Mening Kurslarim</h2>
            <p className="text-xs text-slate-500">Siz boshlagan va o‘rganayotgan fanlar ketma-ketligi</p>
          </div>
          <button
            onClick={() => onNavigateTab('subjects')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Barcha fanlar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map(course => {
            const courseLessons = lessons.filter(l => l.courseId === course.id);
            const completedInCourse = courseLessons.filter(l => {
              const p = userProgress.find(prog => prog.lessonId === l.id);
              return p && p.isCompleted;
            }).length;
            const percentage = courseLessons.length > 0
              ? Math.round((completedInCourse / courseLessons.length) * 100)
              : 0;

            const hasCert = certificates.some(c => c.userId === currentUser.id && c.courseId === course.id);

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-blue-900">{course.level} daraja</span>
                    <span className="font-mono tabular-nums">{completedInCourse}/{courseLessons.length} dars</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {course.title[lang] || course.title.uz}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {course.description[lang] || course.description.uz}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-5 space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">{t.courseProgress}</span>
                    <span className="text-blue-900 font-mono tabular-nums">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-900 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {hasCert && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold pt-1">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sertifikat rasmiylashtirilgan</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
