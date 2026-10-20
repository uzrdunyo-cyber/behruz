import React from 'react';
import { ArrowLeft, Play, Lock, CheckCircle2, Clock, Award, Shield, FileQuestion, Sparkles } from 'lucide-react';
import { Course, VideoLesson, Subject, LessonProgress, Language, Certificate } from '../types';
import { translations } from '../i18n/translations';

interface CourseDetailViewProps {
  course: Course;
  subject?: Subject;
  lessons: VideoLesson[];
  progressList: LessonProgress[];
  currentUserId: string;
  hasCertificate: boolean;
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
  onStartFinalExam: (courseId: string) => void;
  lang: Language;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  subject,
  lessons,
  progressList,
  currentUserId,
  hasCertificate,
  onBack,
  onOpenLesson,
  onStartFinalExam,
  lang
}) => {
  const t = translations[lang];

  // Lessons order sort
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  // User progress for this course
  const userProgress = progressList.filter(p => p.userId === currentUserId && p.courseId === course.id);
  const completedLessonsCount = sortedLessons.filter(l => {
    const p = userProgress.find(prog => prog.lessonId === l.id);
    return p && p.isCompleted;
  }).length;

  const allLessonsCompleted = sortedLessons.length > 0 && completedLessonsCount === sortedLessons.length;
  const progressPercent = sortedLessons.length > 0
    ? Math.round((completedLessonsCount / sortedLessons.length) * 100)
    : 0;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Back button & Breadcrumbs */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{subject?.title[lang] || subject?.title.uz || t.navSubjects} ga qaytish</span>
      </button>

      {/* Course Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
              <span>{subject?.title[lang] || subject?.title.uz}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">{course.level} daraja</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">{sortedLessons.length} ta dars</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {course.title[lang] || course.title.uz}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {course.description[lang] || course.description.uz}
            </p>
          </div>

          {/* Quick Progress KPI Widget */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 min-w-[220px] text-center space-y-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.courseProgress}</span>
            <div className="text-3xl font-extrabold text-blue-900 font-mono tabular-nums">
              {progressPercent}%
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-900 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              {completedLessonsCount} / {sortedLessons.length} dars topshirildi
            </p>
          </div>
        </div>

        {/* Certificate Eligibility Strip */}
        <div className="flex items-center gap-3 p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950 text-xs">
          <Award className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Rasmiy Bilim Sertifikati: </span>
            <span>Barcha videodarslarni ko‘rib, 30 talik yakuniy imtihondan kamida 24/30 ball olganingizda 50 coin evaziga taqdim etiladi.</span>
          </div>
          {hasCertificate && (
            <span className="px-2.5 py-1 bg-amber-200 text-amber-900 font-bold rounded-lg shrink-0">
              Sertifikat olingan
            </span>
          )}
        </div>
      </div>

      {/* Sequential Lessons Syllabus List */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.syllabusTitle}</h2>
          <p className="text-xs text-slate-500">
            Darslar qat’iy ketma-ketlikda ochiladi: avvalgi dars videosi ko‘rilib, 10 talik testdan kamida 6 ta to‘g‘ri javob berilgach keyingi dars faollashadi.
          </p>
        </div>

        <div className="space-y-3">
          {sortedLessons.map((lesson, idx) => {
            const lessonProg = userProgress.find(p => p.lessonId === lesson.id);
            const isCompleted = !!(lessonProg && lessonProg.isCompleted);
            
            // Check if this lesson is unlocked:
            // 1st lesson is always unlocked
            // Next lessons are unlocked if previous lesson is completed with score >= 6
            let isUnlocked = idx === 0;
            if (idx > 0) {
              const prevLesson = sortedLessons[idx - 1];
              const prevProg = userProgress.find(p => p.lessonId === prevLesson.id);
              isUnlocked = !!(prevProg && prevProg.isCompleted && prevProg.highestScore >= 6);
            }

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  if (isUnlocked) onOpenLesson(lesson.id);
                }}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isUnlocked
                    ? 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xs cursor-pointer'
                    : 'bg-slate-50/70 border-slate-200 opacity-65 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isUnlocked
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isUnlocked ? (
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span>{idx + 1}{t.lessonNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>10 talik test</span>
                      {lessonProg && lessonProg.highestScore > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-blue-900 font-bold">
                            Natija: {lessonProg.highestScore}/10
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {lesson.title[lang] || lesson.title.uz}
                    </h3>

                    <p className="text-xs text-slate-600 max-w-2xl line-clamp-1">
                      {lesson.description[lang] || lesson.description.uz}
                    </p>
                  </div>
                </div>

                {/* Right CTA / Badge */}
                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                      {t.lessonPassedBadge}
                    </span>
                  ) : isUnlocked ? (
                    <button className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer">
                      {lessonProg && lessonProg.watchedPercentage > 0 ? t.continueLessonBtn : t.startCourse}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t.lessonLockedBadge}</span>
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Final 30-Question Exam Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        allLessonsCompleted
          ? 'bg-linear-to-r from-blue-900 to-indigo-950 text-white shadow-md border-blue-700'
          : 'bg-white border-slate-200 opacity-80'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                allLessonsCompleted ? 'text-amber-300' : 'text-slate-500'
              }`}>
                {t.finalExamTitle}
              </span>
              {allLessonsCompleted && (
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 font-extrabold text-[10px]">
                  {t.finalExamUnlockedBadge}
                </span>
              )}
            </div>

            <h3 className={`text-xl font-extrabold ${allLessonsCompleted ? 'text-white' : 'text-slate-900'}`}>
              30 talik fan yakuniy bilim imtihoni
            </h3>

            <p className={`text-xs leading-relaxed ${allLessonsCompleted ? 'text-blue-100' : 'text-slate-600'}`}>
              {allLessonsCompleted ? t.finalExamReadyDesc : t.finalExamLockedDesc}
            </p>

            <div className={`flex items-center gap-4 text-xs pt-1 ${allLessonsCompleted ? 'text-blue-200' : 'text-slate-500'}`}>
              <span>Jami savollar: 30 ta</span>
              <span aria-hidden="true">·</span>
              <span>O‘tish talabi: kamida 24/30 (80%)</span>
              <span aria-hidden="true">·</span>
              <span>Mukofot: +50 coin</span>
            </div>
          </div>

          <div className="shrink-0">
            {allLessonsCompleted ? (
              <button
                onClick={() => onStartFinalExam(course.id)}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-slate-900" />
                <span>{t.startFinalExam}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Hozircha qulflangan</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
