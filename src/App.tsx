/**
 * IIV Andijon Akademik Litseyi — Ta'lim Platformasi
 * Asosiy dastur komponenti (Main Application Component)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { SubjectsCatalog } from './components/SubjectsCatalog';
import { CourseDetailView } from './components/CourseDetailView';
import { VideoLessonView } from './components/VideoLessonView';
import { QuizModal } from './components/QuizModal';
import { QuizResultModal } from './components/QuizResultModal';
import { CertificateModal } from './components/CertificateModal';
import { CertificateView } from './components/CertificateView';
import { CertificateVerifyView } from './components/CertificateVerifyView';
import { CoinWalletView } from './components/CoinWalletView';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { AdminPanel } from './components/AdminPanel';
import { storage } from './services/storage';
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
  TestAttemptResult,
  TestAnswerSubmission
} from './types';
import { translations } from './i18n/translations';
import { Shield, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Global Language state
  const [lang, setLang] = useState<Language>(storage.getCurrentLanguage());

  // Current user state
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>('course_python');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>('les_py_1');
  const [verifyCertInitialQuery, setVerifyCertInitialQuery] = useState<string>('');

  // Core Data loaded from storage
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  const [subjects, setSubjects] = useState<Subject[]>(storage.getSubjects());
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [lessons, setLessons] = useState<VideoLesson[]>(storage.getLessons());
  const [questions, setQuestions] = useState<Question[]>(storage.getQuestions());
  const [progressList, setProgressList] = useState<LessonProgress[]>(storage.getProgressList());
  const [certificates, setCertificates] = useState<Certificate[]>(storage.getCertificates());
  const [transactions, setTransactions] = useState<CoinTransaction[]>(storage.getTransactions());
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(storage.getAuditLogs());
  const [settings, setSettings] = useState<SystemSettings>(storage.getSettings());

  // Modal controls
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isResultOpen, setIsResultOpen] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);

  // Active Quiz & Certificate inspection states
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>('');
  const [activeQuizType, setActiveQuizType] = useState<'lesson_10' | 'final_30'>('lesson_10');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);
  const [activeQuizResult, setActiveQuizResult] = useState<TestAttemptResult | null>(null);
  const [inspectedCertificate, setInspectedCertificate] = useState<Certificate | null>(null);

  // Refresh all data from storage
  const reloadData = useCallback(() => {
    setUsers(storage.getUsers());
    setSubjects(storage.getSubjects());
    setCourses(storage.getCourses());
    setLessons(storage.getLessons());
    setQuestions(storage.getQuestions());
    setProgressList(storage.getProgressList());
    setCertificates(storage.getCertificates());
    setTransactions(storage.getTransactions());
    setAuditLogs(storage.getAuditLogs());
    setSettings(storage.getSettings());
    const refreshedUser = storage.getCurrentUser();
    setCurrentUser(refreshedUser);
  }, []);

  // Check URL query parameters for ?verify=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const verifyParam = params.get('verify');
      if (verifyParam) {
        setVerifyCertInitialQuery(verifyParam);
        setCurrentTab('verify');
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Language change handler
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    storage.setCurrentLanguage(newLang);
  };

  // Auth Handlers
  const handleLogin = async (login: string, pass: string) => {
    const res = await storage.login(login, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      reloadData();
    }
    return res;
  };

  const handleRegister = async (data: {
    name: string;
    surname: string;
    group: string;
    login: string;
    password: string;
  }) => {
    const res = await storage.register(data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      reloadData();
    }
    return res;
  };

  const handleResetPassword = async (login: string, newPass: string) => {
    const success = await storage.resetPassword(login, newPass);
    if (success) reloadData();
    return success;
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleQuickDemo = async (login: string) => {
    const target = users.find(u => u.login === login);
    if (target) {
      storage.setCurrentUser(target);
      setCurrentUser(target);
      setIsAuthOpen(false);
      reloadData();
    }
  };

  const handleUpdateProfile = (data: { name: string; surname: string; group: string }) => {
    if (!currentUser) return;
    const updated = storage.updateProfile(currentUser.id, data);
    if (updated) {
      setCurrentUser({ ...updated });
      reloadData();
    }
  };

  const handleChangePassword = async (newPass: string) => {
    if (!currentUser) return false;
    const res = await storage.resetPassword(currentUser.login, newPass);
    if (res) reloadData();
    return res;
  };

  const handleUpdateAdminPassword = async (newPass: string) => {
    const success = await storage.updateAdminPassword(newPass);
    if (success) reloadData();
    return success;
  };

  // Navigation handlers
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentTab('course-detail');
  };

  const handleOpenLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('lesson-view');
  };

  // Video watch progress update
  const handleUpdateWatchProgress = (percentage: number) => {
    if (!currentUser || !selectedCourseId || !selectedLessonId) return;
    storage.updateVideoProgress(currentUser.id, selectedCourseId, selectedLessonId, percentage);
    setProgressList(storage.getProgressList());
  };

  // Start 10-Question Lesson Test
  const handleStartLessonQuiz = (lessonId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const lesson = lessons.find(l => l.id === lessonId);
    const lessonQList = storage.getQuestionsForLesson(lessonId);
    if (!lesson || lessonQList.length === 0) return;

    setActiveQuizTitle(lesson.title[lang] || lesson.title.uz);
    setActiveQuizType('lesson_10');
    setActiveQuizQuestions(lessonQList);
    setIsQuizOpen(true);
  };

  // Start 30-Question Final Exam
  const handleStartFinalExam = (courseId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const course = courses.find(c => c.id === courseId);
    const finalQList = storage.getFinalExamQuestionsForCourse(courseId);
    if (!course || finalQList.length === 0) return;

    setActiveQuizTitle(`${course.title[lang] || course.title.uz} — 30 talik yakuniy imtihon`);
    setActiveQuizType('final_30');
    setActiveQuizQuestions(finalQList);
    setIsQuizOpen(true);
  };

  // Evaluate and submit test (Server-authoritative evaluation)
  const handleSubmitQuiz = (submissions: TestAnswerSubmission[]) => {
    if (!currentUser || !selectedCourseId) return;

    const lessonId = activeQuizType === 'lesson_10' ? selectedLessonId || undefined : undefined;
    const result = storage.evaluateTest(
      currentUser.id,
      selectedCourseId,
      lessonId,
      submissions,
      activeQuizType,
      lang
    );

    setActiveQuizResult(result);
    setIsQuizOpen(false);
    setIsResultOpen(true);
    reloadData();
  };

  // Claim Certificate (Deducts 50 coins once)
  const handleClaimCertificate = (courseId: string) => {
    if (!currentUser) return;
    const cert = storage.issueCertificate(currentUser.id, courseId);
    if (cert) {
      setInspectedCertificate(cert);
      setIsCertModalOpen(true);
      reloadData();
    }
  };

  // Admin CRUD and settings
  const handleSaveSubject = (sub: Subject) => {
    storage.saveSubject(sub);
    reloadData();
  };

  const handleDeleteSubject = (subId: string) => {
    storage.deleteSubject(subId);
    reloadData();
  };

  const handleSaveCourse = (course: Course) => {
    storage.saveCourse(course);
    reloadData();
  };

  const handleDeleteCourse = (courseId: string) => {
    storage.deleteCourse(courseId);
    reloadData();
  };

  const handleSaveLesson = (lesson: VideoLesson) => {
    storage.saveLesson(lesson);

    // If new lesson has no questions yet, create standard 10 questions for immediate testability
    const existingQ = storage.getQuestionsForLesson(lesson.id);
    if (existingQ.length === 0) {
      for (let i = 1; i <= 10; i++) {
        storage.saveQuestion({
          id: `q_${lesson.id}_${i}`,
          lessonId: lesson.id,
          courseId: lesson.courseId,
          text: {
            uz: `${lesson.title.uz} bo‘yicha ${i}-savol: Darsdagi asosiy qoida qaysi variantda to‘g‘ri ifodalangan?`,
            ru: `Вопрос ${i} по теме «${lesson.title.ru || lesson.title.uz}»: Какое утверждение является верным?`,
            en: `Question ${i} for "${lesson.title.en || lesson.title.uz}": Which statement is correct?`
          },
          options: [
            { uz: 'A varianti (To‘g‘ri javob)', ru: 'Вариант A (Верный ответ)', en: 'Option A (Correct statement)' },
            { uz: 'B varianti (Noto‘g‘ri)', ru: 'Вариант B (Неверно)', en: 'Option B (Incorrect)' },
            { uz: 'C varianti (Noto‘g‘ri)', ru: 'Вариант C (Неверно)', en: 'Option C (Incorrect)' },
            { uz: 'D varianti (Noto‘g‘ri)', ru: 'Вариант D (Неверно)', en: 'Option D (Incorrect)' }
          ],
          correctOptionIndex: 0,
          explanationHint: {
            uz: `Ushbu mavzu bo‘yicha «${lesson.title.uz}» videosini qayta tomosha qilish tavsiya etiladi.`,
            ru: `Рекомендуется повторно ознакомиться с материалом видеоурока.`,
            en: `It is recommended to review the video lecture carefully.`
          }
        });
      }
    }

    storage.addAuditLog('Admin', 'Videodars va 10 ta test saqlandi', lesson.title.uz);
    reloadData();
  };

  const handleDeleteLesson = (lessonId: string) => {
    storage.deleteLesson(lessonId);
    storage.addAuditLog('Admin', 'Videodars o‘chirildi', `ID: ${lessonId}`);
    reloadData();
  };

  const handleSaveQuestion = (q: Question) => {
    storage.saveQuestion(q);
    storage.addAuditLog('Admin', 'Savol saqlandi', q.text.uz);
    reloadData();
  };

  const handleDeleteQuestion = (qId: string) => {
    storage.deleteQuestion(qId);
    storage.addAuditLog('Admin', 'Savol o‘chirildi', `ID: ${qId}`);
    reloadData();
  };

  const handleAdjustCoins = (targetUserId: string, amount: number, reason: string) => {
    storage.addCoins(
      targetUserId,
      amount,
      amount > 0 ? 'admin_bonus' : 'admin_deduction',
      { uz: `Admin tomonidan: ${reason}`, ru: `Администратором: ${reason}`, en: `By Administrator: ${reason}` }
    );
    storage.addAuditLog('Admin', `Coin o‘zgartirildi (${amount > 0 ? '+' : ''}${amount})`, `User: ${targetUserId}`);
    reloadData();
  };

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    storage.updateSettings(newSettings);
    storage.addAuditLog('Admin', 'Tizim sozlamalari yangilandi', 'Ballar va narxlar');
    reloadData();
  };

  // Active course and lesson objects
  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const activeSubject = subjects.find(s => s.id === activeCourse?.subjectId);
  const activeLesson = lessons.find(l => l.id === selectedLessonId) || lessons[0];
  const activeCourseLessons = activeCourse ? storage.getLessonsByCourse(activeCourse.id) : [];

  // Eligible courses for certificates (passed 30-final exam)
  const eligibleCoursesForCert = courses.filter(course => {
    if (!currentUser) return false;
    const attempts = storage.getUserAttempts(currentUser.id);
    return attempts.some(
      a => a.courseId === course.id && a.type === 'final_30' && a.score >= settings.finalExamPassScore
    );
  });

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* 3-zone Top Bar Contract Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
        lang={lang}
        onLangChange={handleLanguageChange}
      />

      {/* Main Viewport Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* 1. Home / Student Dashboard */}
        {currentTab === 'home' && currentUser && (
          <StudentDashboard
            currentUser={currentUser}
            courses={courses}
            lessons={lessons}
            progressList={progressList}
            certificates={certificates}
            onSelectCourse={handleSelectCourse}
            onOpenLesson={handleOpenLesson}
            onNavigateTab={setCurrentTab}
            lang={lang}
          />
        )}

        {/* Guest Home View (if not logged in) */}
        {currentTab === 'home' && !currentUser && (
          <div className="space-y-12 py-8">
            <div className="bg-linear-to-r from-blue-950 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl border border-blue-800">
              <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto border border-white/20">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <div className="space-y-2 max-w-2xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {t.lyceumTitle}
                </h1>
                <p className="text-sm text-blue-100/90 leading-relaxed">
                  Litsey o‘quvchilari uchun IT, tarix, ingliz tili va matematika fanlaridan sifatli videodarslar, 10 talik testlar, bilim tahlili hamda rasmiy QR-kodli sertifikatlar platformasi.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {t.loginBtn} / {t.registerBtn}
                </button>
                <button
                  onClick={() => handleQuickDemo('behruz')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer border border-white/20"
                >
                  Namuna o‘quvchi bilan kirish
                </button>
              </div>
            </div>

            <SubjectsCatalog
              subjects={subjects}
              courses={courses}
              lessons={lessons}
              progressList={progressList}
              currentUserId=""
              onSelectCourse={handleSelectCourse}
              lang={lang}
            />
          </div>
        )}

        {/* 2. Subjects Catalog */}
        {currentTab === 'subjects' && (
          <SubjectsCatalog
            subjects={subjects}
            courses={courses}
            lessons={lessons}
            progressList={progressList}
            currentUserId={currentUser?.id || ''}
            onSelectCourse={handleSelectCourse}
            lang={lang}
          />
        )}

        {/* 3. Course Detail View */}
        {currentTab === 'course-detail' && activeCourse && (
          <CourseDetailView
            course={activeCourse}
            subject={activeSubject}
            lessons={activeCourseLessons}
            progressList={progressList}
            currentUserId={currentUser?.id || ''}
            hasCertificate={currentUser ? storage.hasCertificate(currentUser.id, activeCourse.id) : false}
            onBack={() => setCurrentTab('subjects')}
            onOpenLesson={handleOpenLesson}
            onStartFinalExam={handleStartFinalExam}
            lang={lang}
          />
        )}

        {/* 4. Video Lesson View */}
        {currentTab === 'lesson-view' && activeLesson && activeCourse && (
          <VideoLessonView
            lesson={activeLesson}
            course={activeCourse}
            allCourseLessons={activeCourseLessons}
            progress={currentUser ? storage.getUserProgress(currentUser.id, activeLesson.id) : undefined}
            onBackToCourse={() => setCurrentTab('course-detail')}
            onStartQuiz={handleStartLessonQuiz}
            onUpdateWatchProgress={handleUpdateWatchProgress}
            onNavigateLesson={handleOpenLesson}
            lang={lang}
          />
        )}

        {/* 5. Certificates View */}
        {currentTab === 'certificates' && (
          currentUser ? (
            <CertificateView
              currentUser={currentUser}
              certificates={certificates}
              eligibleCourses={eligibleCoursesForCert}
              onClaimCertificate={handleClaimCertificate}
              onOpenCertificateModal={cert => {
                setInspectedCertificate(cert);
                setIsCertModalOpen(true);
              }}
              onNavigateTab={setCurrentTab}
              lang={lang}
            />
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <Award className="w-12 h-12 text-blue-900 mx-auto" />
              <h2 className="text-lg font-bold">Sertifikatlarni ko‘rish uchun tizimga kiring</h2>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-5 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl"
              >
                {t.loginBtn}
              </button>
            </div>
          )
        )}

        {/* 6. Verify Certificate Online */}
        {currentTab === 'verify' && (
          <CertificateVerifyView
            initialCertNumber={verifyCertInitialQuery}
            onSearchCertificate={number => storage.getCertificateByNumber(number)}
            onOpenCertificateModal={cert => {
              setInspectedCertificate(cert);
              setIsCertModalOpen(true);
            }}
            lang={lang}
          />
        )}

        {/* 7. Coin Wallet View */}
        {currentTab === 'wallet' && (
          currentUser ? (
            <CoinWalletView
              currentUser={currentUser}
              transactions={storage.getUserTransactions(currentUser.id)}
              onNavigateTab={setCurrentTab}
              lang={lang}
            />
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-lg font-bold">Coin hamyonini ko‘rish uchun tizimga kiring</h2>
            </div>
          )
        )}

        {/* 8. Admin Panel */}
        {currentTab === 'admin' && (
          <AdminPanel
            currentUser={currentUser || users[0]}
            users={users}
            subjects={subjects}
            courses={courses}
            lessons={lessons}
            questions={questions}
            progressList={progressList}
            certificates={certificates}
            transactions={transactions}
            auditLogs={auditLogs}
            settings={settings}
            onSaveSubject={() => {}}
            onSaveCourse={() => {}}
            onSaveLesson={handleSaveLesson}
            onDeleteLesson={handleDeleteLesson}
            onSaveQuestion={handleSaveQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onAdjustCoins={handleAdjustCoins}
            onUpdateSettings={handleUpdateSettings}
            onUpdateAdminPassword={handleUpdateAdminPassword}
            lang={lang}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <Shield className="w-4 h-4 text-blue-900" />
            <span>© 2026 O‘zbekiston Respublikasi IIV Andijon Akademik Litseyi. Barcha huquqlar himoyalangan.</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Elektron Ta’lim Portali</span>
            <span aria-hidden="true">·</span>
            <span>Versiya 2.4-LMS</span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onResetPass={handleResetPassword}
        onQuickDemoLogin={handleQuickDemo}
        lang={lang}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleChangePassword}
        lang={lang}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        title={activeQuizTitle}
        type={activeQuizType}
        questions={activeQuizQuestions}
        onSubmitQuiz={handleSubmitQuiz}
        lang={lang}
      />

      <QuizResultModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        result={activeQuizResult}
        onRetake={() => {
          setIsResultOpen(false);
          setIsQuizOpen(true);
        }}
        onProceedNext={() => {
          setIsResultOpen(false);
          // Find next lesson
          const currentIndex = activeCourseLessons.findIndex(l => l.id === selectedLessonId);
          if (currentIndex < activeCourseLessons.length - 1) {
            handleOpenLesson(activeCourseLessons[currentIndex + 1].id);
          } else {
            setCurrentTab('course-detail');
          }
        }}
        hasNextLesson={
          activeQuizType === 'lesson_10' &&
          activeCourseLessons.findIndex(l => l.id === selectedLessonId) < activeCourseLessons.length - 1
        }
        lang={lang}
      />

      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificate={inspectedCertificate}
        lang={lang}
      />

    </div>
  );
}
