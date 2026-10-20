import React, { useState } from 'react';
import { Search, Code2, Landmark, Languages, Calculator, ArrowRight, CheckCircle2, Award, Clock } from 'lucide-react';
import { Subject, Course, VideoLesson, LessonProgress, Language } from '../types';
import { translations } from '../i18n/translations';

interface SubjectsCatalogProps {
  subjects: Subject[];
  courses: Course[];
  lessons: VideoLesson[];
  progressList: LessonProgress[];
  currentUserId: string;
  onSelectCourse: (courseId: string) => void;
  lang: Language;
}

export const SubjectsCatalog: React.FC<SubjectsCatalogProps> = ({
  subjects,
  courses,
  lessons,
  progressList,
  currentUserId,
  onSelectCourse,
  lang
}) => {
  const t = translations[lang];
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5" />;
      case 'Landmark': return <Landmark className="w-5 h-5" />;
      case 'Languages': return <Languages className="w-5 h-5" />;
      case 'Calculator': return <Calculator className="w-5 h-5" />;
      default: return <Code2 className="w-5 h-5" />;
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSubject = selectedSubjectId === 'all' || course.subjectId === selectedSubjectId;
    const titleText = (course.title[lang] || course.title.uz).toLowerCase();
    const descText = (course.description[lang] || course.description.uz).toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || titleText.includes(query) || descText.includes(query);
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header and Search */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.catalogHeading}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.catalogSubheading}
          </p>
        </div>

        {/* Search bar & Category filter tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          
          {/* Functional filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedSubjectId('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedSubjectId === 'all'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.allSubjectsFilter}
            </button>
            {subjects.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedSubjectId === sub.id
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{sub.title[lang] || sub.title.uz}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all shadow-2xs"
            />
          </div>

        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const subject = subjects.find(s => s.id === course.subjectId);
          const courseLessons = lessons.filter(l => l.courseId === course.id);
          
          // User progress
          const userProg = progressList.filter(p => p.userId === currentUserId && p.courseId === course.id);
          const completedCount = courseLessons.filter(l => {
            const p = userProg.find(item => item.lessonId === l.id);
            return p && p.isCompleted;
          }).length;
          const percentage = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header Strip with Subject Accent */}
              <div className="p-6 space-y-4">
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
                    {subject && getSubjectIcon(subject.icon)}
                    <span>{subject?.title[lang] || subject?.title.uz}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {course.level}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                    {course.title[lang] || course.title.uz}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {course.description[lang] || course.description.uz}
                  </p>
                </div>

                {/* Lesson metadata */}
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>{courseLessons.length} {t.lessonsCount}</span>
                  <span aria-hidden="true">·</span>
                  <span>10 talik testlar</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-600 font-semibold">50 coin sertifikat</span>
                </div>

              </div>

              {/* Card Footer: Progress & CTA */}
              <div className="p-6 bg-slate-50/70 border-t border-slate-100 space-y-4">
                {/* Progress bar if started */}
                {percentage > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{t.courseProgress}</span>
                      <span className="font-mono tabular-nums">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-900 h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onSelectCourse(course.id)}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{percentage > 0 ? t.continueLessonBtn : t.startCourse}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">Qidiruv bo‘yicha hech qanday kurs topilmadi</p>
          <p className="text-xs text-slate-400 mt-1">Iltimos, boshqa kalit so‘z bilan qidirib ko‘ring.</p>
        </div>
      )}

    </div>
  );
};
