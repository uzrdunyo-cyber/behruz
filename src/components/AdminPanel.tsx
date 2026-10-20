import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  Video,
  FileQuestion,
  Award,
  Coins,
  Settings,
  Search,
  Plus,
  Trash2,
  Edit,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  Shield,
  Filter,
  Save,
  X,
  Eye,
  EyeOff,
  Lock,
  KeyRound
} from 'lucide-react';
import {
  User,
  Subject,
  Course,
  VideoLesson,
  Question,
  LessonProgress,
  Certificate,
  CoinTransaction,
  AdminAuditLog,
  SystemSettings,
  Language,
  TestAttemptResult
} from '../types';
import { translations } from '../i18n/translations';

interface AdminPanelProps {
  currentUser: User;
  users: User[];
  subjects: Subject[];
  courses: Course[];
  lessons: VideoLesson[];
  questions: Question[];
  progressList: LessonProgress[];
  certificates: Certificate[];
  transactions: CoinTransaction[];
  auditLogs: AdminAuditLog[];
  settings: SystemSettings;
  onSaveSubject: (sub: Subject) => void;
  onSaveCourse: (course: Course) => void;
  onSaveLesson: (lesson: VideoLesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onSaveQuestion: (question: Question) => void;
  onDeleteQuestion: (qId: string) => void;
  onAdjustCoins: (targetUserId: string, amount: number, reason: string) => void;
  onUpdateSettings: (settings: SystemSettings) => void;
  onUpdateAdminPassword?: (newPass: string) => Promise<boolean>;
  lang: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  users,
  subjects,
  courses,
  lessons,
  questions,
  progressList,
  certificates,
  transactions,
  auditLogs,
  settings,
  onSaveSubject,
  onSaveCourse,
  onSaveLesson,
  onDeleteLesson,
  onSaveQuestion,
  onDeleteQuestion,
  onAdjustCoins,
  onUpdateSettings,
  onUpdateAdminPassword,
  lang
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<
    'overview' | 'subjects' | 'videos' | 'questions' | 'students' | 'certs' | 'audit' | 'settings'
  >('overview');

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');

  // Modal states for CRUD
  const [editingLesson, setEditingLesson] = useState<VideoLesson | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const [coinModalUser, setCoinModalUser] = useState<User | null>(null);
  const [coinAdjustmentAmount, setCoinAdjustmentAmount] = useState<number>(10);
  const [coinAdjustmentReason, setCoinAdjustmentReason] = useState<string>('Faollik va namunali xulq uchun rag‘bat');

  // Admin password change states
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showAdminNewPass, setShowAdminNewPass] = useState(false);
  const [showAdminConfirmPass, setShowAdminConfirmPass] = useState(false);
  const [adminPassNotice, setAdminPassNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [isAdminPassChanging, setIsAdminPassChanging] = useState(false);

  // Settings form state
  const [tempSettings, setTempSettings] = useState<SystemSettings>({ ...settings });
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  // Filter students
  const students = users.filter(u => u.role === 'student');
  const groupsList = Array.from(new Set(students.map(s => s.group))).filter(Boolean);

  const filteredStudents = students.filter(s => {
    const matchesGroup = groupFilter === 'all' || s.group === groupFilter;
    const fullName = `${s.name} ${s.surname} ${s.login}`.toLowerCase();
    const matchesSearch = !studentSearch.trim() || fullName.includes(studentSearch.trim().toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Calculate high-level KPIs
  const totalCoinsCirculating = students.reduce((acc, s) => acc + s.coins, 0);

  // CSV Export for Student Monitoring
  const handleExportCSV = () => {
    const headers = ['Oquvchi', 'Guruh', 'Login', 'Boshlangan Kurslar', 'Tugatilgan Videolar', 'Coin Balansi', 'Sertifikatlar'];
    const rows = filteredStudents.map(s => {
      const userProg = progressList.filter(p => p.userId === s.id);
      const completed = userProg.filter(p => p.isCompleted).length;
      const startedCourses = new Set(userProg.map(p => p.courseId)).size;
      const userCerts = certificates.filter(c => c.userId === s.id).length;
      return [
        `"${s.name} ${s.surname}"`,
        `"${s.group}"`,
        `"${s.login}"`,
        startedCourses,
        completed,
        s.coins,
        userCerts
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IIV_Litsey_Oquvchilar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 2500);
  };

  const handleAdminPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassNotice(null);

    if (adminNewPassword.length < 4) {
      setAdminPassNotice({ type: 'error', msg: 'Parol kamida 4 ta belgidan iborat bo‘lishi lozim!' });
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setAdminPassNotice({ type: 'error', msg: 'Kiritilgan yangi parollar bir-biriga mos kelmadi!' });
      return;
    }

    setIsAdminPassChanging(true);
    try {
      let ok = false;
      if (onUpdateAdminPassword) {
        ok = await onUpdateAdminPassword(adminNewPassword);
      } else {
        const { storage } = await import('../services/storage');
        ok = await storage.updateAdminPassword(adminNewPassword);
      }

      if (ok) {
        setAdminPassNotice({ type: 'success', msg: 'Admin paroli muvaffaqiyatli o‘zgartirildi va saqlandi!' });
        setAdminNewPassword('');
        setAdminConfirmPassword('');
      } else {
        setAdminPassNotice({ type: 'error', msg: 'Parolni yangilashda xatolik yuz berdi.' });
      }
    } finally {
      setIsAdminPassChanging(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>IIV Andijon Akademik Litseyi — Ma’muriyat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.adminDashboardTitle}
          </h1>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl overflow-x-auto">
          {[
            { id: 'overview', label: t.adminTabOverview, icon: BookOpen },
            { id: 'students', label: t.adminTabStudents, icon: Users },
            { id: 'videos', label: t.adminTabVideos, icon: Video },
            { id: 'questions', label: t.adminTabQuestions, icon: FileQuestion },
            { id: 'certs', label: t.adminTabCerts, icon: Award },
            { id: 'audit', label: t.adminTabAudit, icon: History },
            { id: 'settings', label: t.adminTabSettings, icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* High-level KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">{t.adminTotalStudents}</span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{students.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">{t.adminTotalCourses}</span>
              <div className="text-2xl font-bold font-mono text-blue-900 tabular-nums">{courses.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">{t.adminTotalVideos}</span>
              <div className="text-2xl font-bold font-mono text-indigo-900 tabular-nums">{lessons.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">{t.adminTotalTests}</span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{questions.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">{t.adminTotalCerts}</span>
              <div className="text-2xl font-bold font-mono text-rose-700 tabular-nums">{certificates.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500">{t.adminCoinsCirculating}</span>
              <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">{totalCoinsCirculating}</div>
            </div>
          </div>

          {/* Quick Actions & Recent Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Quick Students Activity Snippet */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Faol o‘quvchilar va natijalar</h3>
                <button
                  onClick={() => setActiveTab('students')}
                  className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
                >
                  To‘liq jadval
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {students.slice(0, 5).map(s => {
                  const sProg = progressList.filter(p => p.userId === s.id);
                  const completedLessons = sProg.filter(p => p.isCompleted).length;
                  return (
                    <div key={s.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-900">{s.name} {s.surname}</span>
                        <span className="text-slate-400 ml-2 font-mono">({s.group}-guruh)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-600">{completedLessons} ta dars</span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-mono font-bold rounded">
                          {s.coins} coin
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Audit Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Oxirgi ma’muriy amallar jurnali</h3>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
                >
                  Barcha audit
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {auditLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-900">{log.action}: </span>
                      <span className="text-slate-600">{log.target}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. STUDENTS MONITORING TAB (TZ Section 12 requirements) */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">O‘quvchilar Monitoringi</h2>
              <p className="text-xs text-slate-500">
                Har bir o‘quvchining video ko‘rish holati, test natijalari (masalan, 9/10), urinishlari va coin balansi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>{t.exportCsvBtn}</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder={t.searchStudents}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={groupFilter}
                onChange={e => setGroupFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900 font-medium"
              >
                <option value="all">Barcha guruhlar</option>
                {groupsList.map(g => (
                  <option key={g} value={g}>{g}-guruh</option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed Students Table (Responsive & Domain-Native) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">{t.studentNameCol}</th>
                    <th className="px-4 py-3">{t.groupCol}</th>
                    <th className="px-4 py-3">{t.courseCol}</th>
                    <th className="px-4 py-3">{t.videoCol}</th>
                    <th className="px-4 py-3 text-center">{t.testResultCol}</th>
                    <th className="px-4 py-3 text-center">{t.statusCol}</th>
                    <th className="px-4 py-3 text-right">{t.coinsCol}</th>
                    <th className="px-4 py-3 text-center">{t.actionsCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => {
                    // Get latest progress record
                    const userProgs = progressList.filter(p => p.userId === student.id);
                    const latestProg = userProgs[userProgs.length - 1];
                    const course = latestProg ? courses.find(c => c.id === latestProg.courseId) : courses[0];
                    const lesson = latestProg ? lessons.find(l => l.id === latestProg.lessonId) : lessons[0];

                    const testScore = latestProg?.highestScore || 0;
                    const isPassed = !!(latestProg && latestProg.isCompleted);
                    const attempts = latestProg?.attemptsCount || 0;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                          {student.name} {student.surname}
                          <span className="block text-[11px] font-mono text-slate-400 font-normal">
                            @{student.login}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono font-semibold text-blue-900">
                          {student.group}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 max-w-[180px] truncate">
                          {course ? course.title[lang] || course.title.uz : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 max-w-[200px] truncate">
                          {lesson ? lesson.title[lang] || lesson.title.uz : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono font-bold tabular-nums">
                          {testScore > 0 ? (
                            <span className={testScore >= 6 ? 'text-emerald-700' : 'text-rose-700'}>
                              {testScore}/10
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {isPassed ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                              {t.statusCompleted}
                            </span>
                          ) : testScore > 0 ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold">
                              {t.statusRetake}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                              {t.statusInProgress}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-600 tabular-nums">
                          {student.coins} coin
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => {
                              setCoinModalUser(student);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            {t.adjustCoinsBtn}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3. VIDEOS MANAGER TAB */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Videodarslar Boshqaruvi</h2>
              <p className="text-xs text-slate-500">
                Har bir fanga tegishli videodarslar, tartib raqami, havola va 10 talik testlar.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingLesson({
                  id: 'les_' + Date.now(),
                  courseId: courses[0]?.id || 'course_python',
                  title: { uz: 'Yangi videodars', ru: 'Новый видеоурок', en: 'New Video Lesson' },
                  description: { uz: 'Dars tavsifi...', ru: 'Описание урока...', en: 'Lesson description...' },
                  videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
                  order: lessons.length + 1,
                  durationSeconds: 300,
                  isPublished: true
                });
                setIsLessonModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addVideoBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map(l => {
              const c = courses.find(course => course.id === l.courseId);
              return (
                <div key={l.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-blue-900">
                        {c?.title[lang] || c?.title.uz} · {l.order}-dars
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{l.title[lang] || l.title.uz}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingLesson(l);
                          setIsLessonModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteLesson(l.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {l.description[lang] || l.description.uz}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 font-mono">
                    <span className="truncate max-w-[240px]">{l.videoUrl}</span>
                    <span className="text-emerald-700 font-medium">Faol</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. QUESTIONS BANK TAB */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Savollar va Testlar Banki</h2>
              <p className="text-xs text-slate-500">
                10 talik dars testlari va 30 talik fan yakuniy imtihon savollari hamda to‘g‘ri javob kalitlari.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingQuestion({
                  id: 'q_' + Date.now(),
                  lessonId: lessons[0]?.id,
                  courseId: courses[0]?.id || 'course_python',
                  text: { uz: 'Yangi savol matni...', ru: 'Текст нового вопроса...', en: 'New question text...' },
                  options: [
                    { uz: 'A varianti', ru: 'Вариант A', en: 'Option A' },
                    { uz: 'B varianti', ru: 'Вариант B', en: 'Option B' },
                    { uz: 'C varianti', ru: 'Вариант C', en: 'Option C' },
                    { uz: 'D varianti', ru: 'Вариант D', en: 'Option D' }
                  ],
                  correctOptionIndex: 0,
                  explanationHint: {
                    uz: 'Ushbu mavzuni videodarsdan qayta ko‘rib chiqing.',
                    ru: 'Повторите тему в видеоуроке.',
                    en: 'Review this concept in the video lecture.'
                  }
                });
                setIsQuestionModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addQuestionBtn}</span>
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-blue-900 uppercase">
                      {q.lessonId ? '10 talik dars testi' : '30 talik yakuniy imtihon'} · Savol #{idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {q.text[lang] || q.text.uz}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingQuestion(q);
                        setIsQuestionModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Options grid with visible Correct Key for Admin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isKey = q.correctOptionIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border flex items-center gap-2 ${
                          isKey
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] bg-white border border-slate-300">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt[lang] || opt.uz}</span>
                        {isKey && (
                          <span className="ml-auto text-[10px] font-bold text-emerald-700 uppercase">
                            To‘g‘ri kalit
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                  <span className="font-semibold">O‘quvchi uchun tavsiya hint: </span>
                  {q.explanationHint[lang] || q.explanationHint.uz}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CERTS & COINS TAB */}
      {activeTab === 'certs' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Sertifikatlar va Coinlar Jurnali</h2>
            <p className="text-xs text-slate-500">
              Platforma orqali berilgan barcha sertifikatlar va 50 coinlik to‘lov operatsiyalari.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="px-4 py-3">Seriya raqami</th>
                    <th className="px-4 py-3">O‘quvchi</th>
                    <th className="px-4 py-3">Kurs</th>
                    <th className="px-4 py-3 text-center">Imtihon bali</th>
                    <th className="px-4 py-3">Berilgan sana</th>
                    <th className="px-4 py-3 text-center">To‘langan coin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificates.map(cert => (
                    <tr key={cert.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5 font-mono font-bold text-blue-900">
                        {cert.certNumber}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {cert.userName} ({cert.userGroup}-guruh)
                      </td>
                      <td className="px-4 py-3.5 text-slate-700">
                        {cert.courseTitle}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-emerald-700">
                        {cert.score} / {cert.maxScore}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-500">
                        {cert.issueDate}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-amber-600">
                        {cert.coinPaid} coin
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Audit Jurnali</h2>
            <p className="text-xs text-slate-500">
              Admin va tizim tomonidan amalga oshirilgan xavfsizlik va o‘zgarishlar jurnali.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{log.action}: </span>
                  <span className="text-slate-600">{log.target}</span>
                  <span className="text-slate-400 ml-2 font-mono">({log.adminName})</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px] shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.adminTabSettings}</h2>
            <p className="text-xs text-slate-500">
              Dars testlari va yakuniy imtihon o‘tish ballari, mukofot va sertifikat narxini boshqarish.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            {settingsSavedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t.settingsSaveSuccess}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Dars testi o‘tish bali (10 tadan):
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={tempSettings.lessonPassScore}
                onChange={e => setTempSettings({ ...tempSettings, lessonPassScore: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                30 talik yakuniy imtihon o‘tish bali:
              </label>
              <input
                type="number"
                min="10"
                max="30"
                value={tempSettings.finalExamPassScore}
                onChange={e => setTempSettings({ ...tempSettings, finalExamPassScore: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Dars testidan o‘tganlik uchun coin mukofoti:
              </label>
              <input
                type="number"
                min="0"
                value={tempSettings.lessonPassReward}
                onChange={e => setTempSettings({ ...tempSettings, lessonPassReward: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Sertifikat rasmiylashtirish narxi (coin):
              </label>
              <input
                type="number"
                min="0"
                value={tempSettings.certCoinCost}
                onChange={e => setTempSettings({ ...tempSettings, certCoinCost: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveBtn}</span>
            </button>
          </form>

          {/* Admin Password Change Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Admin hisob parolini o‘zgartirish</h3>
                  <p className="text-[11px] text-slate-500">
                    Administrator hisobi parolini o‘zgartirish. Yozayotgan parolni ko‘z tugmasiga bosib ko‘rishingiz mumkin.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                login: admin
              </span>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>
                  Standart admin paroli: <strong className="font-mono text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded">abdurahmonkiber</strong>
                </p>
                <p className="text-[11px] text-amber-700">
                  Ushbu formadan yangi istalgan parolni o‘rnatishingiz mumkin. Kiritilayotgan parolni bemalol ko‘rish imkoniyati mavjud.
                </p>
              </div>
            </div>

            {adminPassNotice && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                adminPassNotice.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {adminPassNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{adminPassNotice.msg}</span>
              </div>
            )}

            <form onSubmit={handleAdminPasswordChange} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Yangi admin paroli:</label>
                  <button
                    type="button"
                    onClick={() => setShowAdminNewPass(!showAdminNewPass)}
                    className="text-[11px] text-blue-900 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {showAdminNewPass ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Yashirish</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Yozilayotganni ko‘rish</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAdminNewPass ? "text" : "password"}
                    required
                    value={adminNewPassword}
                    onChange={e => setAdminNewPassword(e.target.value)}
                    placeholder="Masalan: abdurahmonkiber"
                    className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminNewPass(!showAdminNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                    title={showAdminNewPass ? "Yashirish" : "Yozilayotgan parolni ko‘rish"}
                  >
                    {showAdminNewPass ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Yangi parolni qayta kiriting:</label>
                  <button
                    type="button"
                    onClick={() => setShowAdminConfirmPass(!showAdminConfirmPass)}
                    className="text-[11px] text-blue-900 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {showAdminConfirmPass ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Yashirish</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Yozilayotganni ko‘rish</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAdminConfirmPass ? "text" : "password"}
                    required
                    value={adminConfirmPassword}
                    onChange={e => setAdminConfirmPassword(e.target.value)}
                    placeholder="Parolni qayta tering"
                    className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminConfirmPass(!showAdminConfirmPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                    title={showAdminConfirmPass ? "Yashirish" : "Yozilayotgan parolni ko‘rish"}
                  >
                    {showAdminConfirmPass ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isAdminPassChanging}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isAdminPassChanging ? 'Saqlanmoqda...' : 'Admin parolini yangilash'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAdminNewPassword('abdurahmonkiber');
                    setAdminConfirmPassword('abdurahmonkiber');
                    setShowAdminNewPass(true);
                    setShowAdminConfirmPass(true);
                  }}
                  className="px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border border-slate-200"
                >
                  «abdurahmonkiber» parolini tanlash
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone: Reset All Data to Zero */}
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Barcha o‘quvchilar natijalarini tozalash (Nolga tushirish)</span>
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              Bu amal barcha o‘quvchilarning ko‘rgan videolari, test natijalari, coinlari va sertifikatlarini tozalab, tizimni toza boshlang‘ich nol holatiga qaytaradi.
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Haqiqatan ham barcha o‘quvchilar natijalari va coinlarini tozalab, nol holatiga qaytarmoqchimisiz?")) {
                  // Clear local storage and reload
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Natijalarni tozalash (Toza boshlash)
            </button>
          </div>
        </div>
      )}

      {/* Adjust Coin Modal */}
      {coinModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Coin balansi sozlash</h3>
              <button onClick={() => setCoinModalUser(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              O‘quvchi: <span className="font-bold text-slate-900">{coinModalUser.name} {coinModalUser.surname}</span>
              <br />
              Joriy balans: <span className="font-bold font-mono text-amber-600">{coinModalUser.coins} coin</span>
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Miqdor (manfiy son ayiradi):</label>
              <input
                type="number"
                value={coinAdjustmentAmount}
                onChange={e => setCoinAdjustmentAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Sabab:</label>
              <input
                type="text"
                value={coinAdjustmentReason}
                onChange={e => setCoinAdjustmentReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCoinModalUser(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  onAdjustCoins(coinModalUser.id, coinAdjustmentAmount, coinAdjustmentReason);
                  setCoinModalUser(null);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs"
              >
                {t.saveBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Lesson Editor Modal */}
      {isLessonModalOpen && editingLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 my-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Videodarsni tahrirlash</h3>
              <button onClick={() => setIsLessonModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Dars nomi (O‘zbekcha):</label>
                <input
                  type="text"
                  value={editingLesson.title.uz}
                  onChange={e => setEditingLesson({
                    ...editingLesson,
                    title: { ...editingLesson.title, uz: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Video havolasi (YouTube yoki MP4):</label>
                <input
                  type="text"
                  value={editingLesson.videoUrl}
                  onChange={e => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px]"
                />
              </div>

              {/* Course Selector */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Qaysi kursga tegishli:</label>
                <select
                  value={editingLesson.courseId}
                  onChange={e => setEditingLesson({ ...editingLesson, courseId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title[lang] || c.title.uz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Video Language Selector */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Dars tili (Video tili):</label>
                <select
                  value={editingLesson.videoLang || 'uz'}
                  onChange={e => setEditingLesson({ ...editingLesson, videoLang: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="uz">O‘zbek tili (Uzbek)</option>
                  <option value="ru">Rus tili (Русский язык)</option>
                  <option value="en">Ingliz tili (English)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tartib raqami:</label>
                  <input
                    type="number"
                    value={editingLesson.order}
                    onChange={e => setEditingLesson({ ...editingLesson, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Davomiyligi (soniya):</label>
                  <input
                    type="number"
                    value={editingLesson.durationSeconds}
                    onChange={e => setEditingLesson({ ...editingLesson, durationSeconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Dars tavsifi:</label>
                <textarea
                  rows={3}
                  value={editingLesson.description.uz}
                  onChange={e => setEditingLesson({
                    ...editingLesson,
                    description: {
                      uz: e.target.value,
                      ru: editingLesson.description.ru || e.target.value,
                      en: editingLesson.description.en || e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <p className="text-[11px] text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                Ushbu videodars saqlanganda o‘quvchilar darhol bilimini sinashi uchun 10 talik test savollari avtomatik ulanadi.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLessonModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSaveLesson(editingLesson);
                  setIsLessonModalOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-900 rounded-xl"
              >
                {t.saveBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Editor Modal */}
      {isQuestionModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 my-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Savolni tahrirlash</h3>
              <button onClick={() => setIsQuestionModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Savol matni (O‘zbekcha):</label>
                <input
                  type="text"
                  value={editingQuestion.text.uz}
                  onChange={e => setEditingQuestion({
                    ...editingQuestion,
                    text: { ...editingQuestion.text, uz: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700">Javob variantlari va To‘g‘ri kalit:</label>
                {editingQuestion.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctKey"
                      checked={editingQuestion.correctOptionIndex === optIdx}
                      onChange={() => setEditingQuestion({ ...editingQuestion, correctOptionIndex: optIdx })}
                      className="cursor-pointer"
                      title="To‘g‘ri kalit deb belgilash"
                    />
                    <span className="font-mono font-bold text-slate-500 w-4">
                      {String.fromCharCode(65 + optIdx)}:
                    </span>
                    <input
                      type="text"
                      value={opt.uz}
                      onChange={e => {
                        const newOpts = [...editingQuestion.options];
                        newOpts[optIdx] = { ...newOpts[optIdx], uz: e.target.value };
                        setEditingQuestion({ ...editingQuestion, options: newOpts });
                      }}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Xato qilganda chiqadigan tavsiya:</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanationHint.uz}
                  onChange={e => setEditingQuestion({
                    ...editingQuestion,
                    explanationHint: { ...editingQuestion.explanationHint, uz: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSaveQuestion(editingQuestion);
                  setIsQuestionModalOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-900 rounded-xl"
              >
                {t.saveBtn}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
