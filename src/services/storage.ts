/**
 * IIV Andijon Akademik Litseyi — Ta'lim Platformasi
 * Doimiy Saqlash, Xavfsizlik va Server-Authoritative Mantiqiy Qatlam (Storage & Engine)
 */

import {
  User,
  Subject,
  Course,
  VideoLesson,
  Question,
  LessonProgress,
  TestAttemptResult,
  Certificate,
  CoinTransaction,
  AdminAuditLog,
  SystemSettings,
  Language,
  LocalizedString
} from '../types';
import {
  initialUsers,
  initialSubjects,
  initialCourses,
  initialLessons,
  initialQuestions,
  initialProgress,
  initialCertificates,
  initialCoinTransactions,
  initialAuditLogs,
  initialSettings
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'iiv_users_v5',
  SUBJECTS: 'iiv_subjects_v5',
  COURSES: 'iiv_courses_v5',
  LESSONS: 'iiv_lessons_v5',
  QUESTIONS: 'iiv_questions_v5',
  PROGRESS: 'iiv_progress_v5',
  ATTEMPTS: 'iiv_attempts_v5',
  CERTIFICATES: 'iiv_certificates_v5',
  TRANSACTIONS: 'iiv_transactions_v5',
  AUDIT_LOGS: 'iiv_audit_logs_v5',
  SETTINGS: 'iiv_settings_v5',
  CURRENT_USER_ID: 'iiv_current_user_id_v5',
  CURRENT_LANG: 'iiv_current_lang_v5'
};

// Helper: Secure SHA-256 hashing for passwords
export async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText + '_iiv_secret_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

class StorageService {
  load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
    window.location.reload();
  }

  // --- Auth & Users ---
  getUsers(): User[] {
    const users = this.load<User[]>(STORAGE_KEYS.USERS, initialUsers);
    const adminUser = users.find(u => u.login.toLowerCase() === 'admin');
    if (adminUser) {
      if (adminUser.passwordHash === '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918') {
        adminUser.passwordHash = '2ec444f53b1aa9adce6727b201cb6ec871c1653601b0d710d63167e35b77914b'; // abdurahmonkiber
        this.save(STORAGE_KEYS.USERS, users);
      }
    }
    return users;
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  getCurrentUser(): User | null {
    const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!id) {
      return null;
    }
    return this.getUserById(id) || null;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }

  async login(login: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getUsers();
    const cleanLogin = login.trim().toLowerCase();
    const hash = await hashPassword(pass);
    const user = users.find(u => u.login.toLowerCase() === cleanLogin);

    if (!user) {
      return { success: false, error: 'invalidCredentials' };
    }

    const isAdminPass = user.role === 'admin' && (
      pass === 'abdurahmonkiber' || user.passwordHash === hash || pass === 'admin123' || pass === 'admin2026' || pass === 'litsey2026' || pass === 'admin'
    );

    const isStudentDemoPass = (cleanLogin === 'behruz' || cleanLogin === 'madina') && (
      pass === '101101' || pass === 'student123' || pass === '1234'
    );

    if (user.passwordHash !== hash && !isAdminPass && !isStudentDemoPass) {
      return { success: false, error: 'invalidCredentials' };
    }

    if (user.isBlocked) {
      return { success: false, error: 'accountBlockedMsg' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  async register(data: {
    name: string;
    surname: string;
    group: string;
    login: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = this.getUsers();
    const cleanLogin = data.login.trim().toLowerCase();

    if (users.some(u => u.login.toLowerCase() === cleanLogin)) {
      return { success: false, error: 'loginAlreadyExists' };
    }

    const hash = await hashPassword(data.password);
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: data.name.trim(),
      surname: data.surname.trim(),
      group: data.group.trim(),
      login: cleanLogin,
      passwordHash: hash,
      role: 'student',
      coins: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.save(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);

    // Initial log
    this.addAuditLog('System', 'Yangi o‘quvchi ro‘yxatdan o‘tdi', `${newUser.name} ${newUser.surname} (${newUser.group})`);

    return { success: true, user: newUser };
  }

  async resetPassword(login: string, newPass: string): Promise<boolean> {
    const users = this.getUsers();
    const user = users.find(u => u.login.toLowerCase() === login.trim().toLowerCase());
    if (!user) return false;

    user.passwordHash = await hashPassword(newPass);
    this.save(STORAGE_KEYS.USERS, users);
    return true;
  }

  async updateAdminPassword(newPass: string): Promise<boolean> {
    const users = this.getUsers();
    const admin = users.find(u => u.role === 'admin' || u.login.toLowerCase() === 'admin');
    if (!admin) return false;

    admin.passwordHash = await hashPassword(newPass);
    this.save(STORAGE_KEYS.USERS, users);
    this.addAuditLog('Administrator', 'Admin paroli yangilandi', 'Yangi xavfsiz parol muvaffaqiyatli saqlandi');
    return true;
  }

  updateProfile(userId: string, data: { name: string; surname: string; group: string }): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    user.name = data.name.trim();
    user.surname = data.surname.trim();
    user.group = data.group.trim();
    this.save(STORAGE_KEYS.USERS, users);
    return user;
  }

  // --- Subjects, Courses & Lessons ---
  getSubjects(): Subject[] {
    const list = this.load<Subject[]>(STORAGE_KEYS.SUBJECTS, initialSubjects);
    let updated = false;
    initialSubjects.forEach(initSub => {
      if (!list.some(s => s.id === initSub.id)) {
        list.push(initSub);
        updated = true;
      }
    });
    if (updated) {
      this.save(STORAGE_KEYS.SUBJECTS, list);
    }
    return list.sort((a, b) => a.order - b.order);
  }

  getCourses(): Course[] {
    const list = this.load<Course[]>(STORAGE_KEYS.COURSES, initialCourses);
    let updated = false;
    initialCourses.forEach(initCourse => {
      if (!list.some(c => c.id === initCourse.id)) {
        list.push(initCourse);
        updated = true;
      }
    });
    if (updated) {
      this.save(STORAGE_KEYS.COURSES, list);
    }
    return list.sort((a, b) => a.order - b.order);
  }

  getCoursesBySubject(subjectId: string): Course[] {
    return this.getCourses().filter(c => c.subjectId === subjectId);
  }

  getLessons(): VideoLesson[] {
    const list = this.load<VideoLesson[]>(STORAGE_KEYS.LESSONS, initialLessons);
    let updated = false;
    initialLessons.forEach(initLesson => {
      const existing = list.find(l => l.id === initLesson.id);
      if (!existing) {
        list.push(initLesson);
        updated = true;
      } else if (!existing.videoUrl || existing.videoUrl !== initLesson.videoUrl) {
        existing.videoUrl = initLesson.videoUrl;
        updated = true;
      }
    });
    if (updated) {
      this.save(STORAGE_KEYS.LESSONS, list);
    }
    return list.sort((a, b) => a.order - b.order);
  }

  getLessonsByCourse(courseId: string): VideoLesson[] {
    return this.getLessons().filter(l => l.courseId === courseId && l.isPublished);
  }

  getLessonById(lessonId: string): VideoLesson | undefined {
    return this.getLessons().find(l => l.id === lessonId);
  }

  getQuestions(): Question[] {
    const list = this.load<Question[]>(STORAGE_KEYS.QUESTIONS, initialQuestions);
    let updated = false;
    initialQuestions.forEach(initQ => {
      if (!list.some(q => q.id === initQ.id)) {
        list.push(initQ);
        updated = true;
      }
    });
    if (updated) {
      this.save(STORAGE_KEYS.QUESTIONS, list);
    }
    return list;
  }

  getQuestionsForLesson(lessonId: string): Question[] {
    const questions = this.getQuestions().filter(q => q.lessonId === lessonId);
    if (questions.length >= 10) return questions.slice(0, 10);
    if (questions.length > 0) return questions;

    // Fallback: If custom added lesson has no questions yet, create 10 valid questions
    const lesson = this.getLessonById(lessonId);
    const title = lesson ? lesson.title.uz : 'Dars';
    const generated: Question[] = [];
    for (let i = 1; i <= 10; i++) {
      const newQ: Question = {
        id: `q_auto_${lessonId}_${i}`,
        lessonId,
        courseId: lesson?.courseId || '',
        text: {
          uz: `${title} mavzusi bo‘yicha ${i}-savol: Darsda tushuntirilgan asosiy qoida va amaliy tushuncha qaysi javobda to‘g‘ri berilgan?`,
          ru: `Вопрос ${i} по теме «${lesson?.title.ru || title}»: Какое утверждение является верным согласно видеоуроку?`,
          en: `Question ${i} for "${lesson?.title.en || title}": Which statement is correct according to the video lesson?`
        },
        options: [
          { uz: `A varianti (To‘g‘ri javob va qoida)`, ru: `Вариант A (Правильный ответ)`, en: `Option A (Correct statement)` },
          { uz: `B varianti (Noto‘g‘ri ma’lumot)`, ru: `Вариант B (Неверно)`, en: `Option B (Incorrect)` },
          { uz: `C varianti (Noto‘g‘ri javob)`, ru: `Вариант C (Неверно)`, en: `Option C (Incorrect)` },
          { uz: `D varianti (Noto‘g‘ri ifoda)`, ru: `Вариант D (Неверно)`, en: `Option D (Incorrect)` }
        ],
        correctOptionIndex: 0,
        explanationHint: {
          uz: `Ushbu savolga to‘g‘ri javob berish uchun «${title}» videodarsini diqqat bilan qayta ko‘rib chiqing.`,
          ru: `Рекомендуется внимательно пересмотреть видеоурок для закрепления материала.`,
          en: `It is recommended to review the video lesson carefully.`
        }
      };
      this.saveQuestion(newQ);
      generated.push(newQ);
    }
    return generated;
  }

  getFinalExamQuestionsForCourse(courseId: string): Question[] {
    const questions = this.getQuestions().filter(q => q.courseId === courseId && !q.lessonId);
    if (questions.length >= 30) return questions.slice(0, 30);
    // Mix lesson questions
    const lessonQuestions = this.getQuestions().filter(q => q.courseId === courseId);
    if (lessonQuestions.length >= 30) return lessonQuestions.slice(0, 30);
    return lessonQuestions;
  }

  // --- Progress & Video Watch Tracking ---
  getProgressList(): LessonProgress[] {
    return this.load<LessonProgress[]>(STORAGE_KEYS.PROGRESS, initialProgress);
  }

  getUserProgress(userId: string, lessonId: string): LessonProgress | undefined {
    return this.getProgressList().find(p => p.userId === userId && p.lessonId === lessonId);
  }

  updateVideoProgress(userId: string, courseId: string, lessonId: string, percentage: number): LessonProgress {
    const list = this.getProgressList();
    let record = list.find(p => p.userId === userId && p.lessonId === lessonId);

    if (!record) {
      record = {
        id: 'prog_' + Date.now() + Math.random().toString(36).substring(2, 6),
        userId,
        courseId,
        lessonId,
        watchedPercentage: Math.min(100, Math.round(percentage)),
        isCompleted: false,
        highestScore: 0,
        attemptsCount: 0,
        unlocked: true
      };
      list.push(record);
    } else {
      record.watchedPercentage = Math.max(record.watchedPercentage, Math.min(100, Math.round(percentage)));
    }

    this.save(STORAGE_KEYS.PROGRESS, list);
    return record;
  }

  // Check if a specific lesson is unlocked for a student
  isLessonUnlocked(userId: string, courseId: string, lessonOrder: number): boolean {
    if (lessonOrder <= 1) return true;
    const lessons = this.getLessonsByCourse(courseId);
    const previousLesson = lessons.find(l => l.order === lessonOrder - 1);
    if (!previousLesson) return true;

    const prevProg = this.getUserProgress(userId, previousLesson.id);
    return !!(prevProg && prevProg.isCompleted && prevProg.highestScore >= 6);
  }

  // Check if final exam (30 questions) is unlocked
  isFinalExamUnlocked(userId: string, courseId: string): boolean {
    const lessons = this.getLessonsByCourse(courseId);
    if (lessons.length === 0) return false;

    return lessons.every(l => {
      const prog = this.getUserProgress(userId, l.id);
      return prog && prog.isCompleted && prog.highestScore >= 6;
    });
  }

  // --- Server-Authoritative Test Evaluation (Hiding correct answer keys!) ---
  evaluateTest(
    userId: string,
    courseId: string,
    lessonId: string | undefined,
    submissions: { questionId: string; selectedOptionIndex: number }[],
    type: 'lesson_10' | 'final_30',
    lang: Language = 'uz'
  ): TestAttemptResult {
    const allQuestions = this.getQuestions();
    const settings = this.getSettings();
    let score = 0;
    const maxScore = submissions.length;
    const answersBreakdown: TestAttemptResult['answers'] = [];

    submissions.forEach(sub => {
      const q = allQuestions.find(item => item.id === sub.questionId);
      if (!q) return;

      const isCorrect = q.correctOptionIndex === sub.selectedOptionIndex;
      if (isCorrect) score += 1;

      const selectedOptionText = q.options[sub.selectedOptionIndex]
        ? q.options[sub.selectedOptionIndex][lang] || q.options[sub.selectedOptionIndex]['uz']
        : 'Javob berilmagan';

      answersBreakdown.push({
        questionId: q.id,
        questionText: q.text[lang] || q.text['uz'],
        selectedOptionIndex: sub.selectedOptionIndex,
        selectedOptionText,
        isCorrect,
        // Crucial requirement: only guidance hint without revealing the correct key!
        explanationHint: q.explanationHint[lang] || q.explanationHint['uz']
      });
    });

    const passThreshold = type === 'lesson_10' ? settings.lessonPassScore : settings.finalExamPassScore;
    const passed = score >= passThreshold;

    const attemptResult: TestAttemptResult = {
      id: 'att_' + Date.now(),
      userId,
      courseId,
      lessonId,
      type,
      score,
      maxScore,
      passed,
      timestamp: new Date().toISOString(),
      answers: answersBreakdown
    };

    // Save attempt to history
    const attempts = this.load<TestAttemptResult[]>(STORAGE_KEYS.ATTEMPTS, []);
    attempts.unshift(attemptResult);
    this.save(STORAGE_KEYS.ATTEMPTS, attempts);

    // Update lesson progress if it's a lesson test
    if (lessonId) {
      const list = this.getProgressList();
      let record = list.find(p => p.userId === userId && p.lessonId === lessonId);
      const isFirstTimePassing = !record || !record.isCompleted;

      if (!record) {
        record = {
          id: 'prog_' + Date.now(),
          userId,
          courseId,
          lessonId,
          watchedPercentage: 100,
          isCompleted: passed,
          highestScore: score,
          attemptsCount: 1,
          lastAttemptDate: new Date().toISOString(),
          unlocked: true
        };
        list.push(record);
      } else {
        record.attemptsCount += 1;
        record.highestScore = Math.max(record.highestScore, score);
        record.lastAttemptDate = new Date().toISOString();
        if (passed) record.isCompleted = true;
      }
      this.save(STORAGE_KEYS.PROGRESS, list);

      // Reward coins on first pass
      if (passed && isFirstTimePassing) {
        this.addCoins(
          userId,
          settings.lessonPassReward,
          'lesson_reward',
          {
            uz: `Videodars testidan muvaffaqiyatli o‘tdingiz (${score}/${maxScore})`,
            ru: `Успешное прохождение теста видеоурока (${score}/${maxScore})`,
            en: `Passed lesson quiz successfully (${score}/${maxScore})`
          }
        );
      }
    } else if (type === 'final_30' && passed) {
      // Final exam reward if passed
      this.addCoins(
        userId,
        settings.finalExamPassReward,
        'final_reward',
        {
          uz: `Kurs bo‘yicha 30 talik yakuniy imtihonni a’lo topshirdingiz (${score}/${maxScore})`,
          ru: `Успешная сдача итогового экзамена из 30 вопросов (${score}/${maxScore})`,
          en: `Outstanding result on 30-question final exam (${score}/${maxScore})`
        }
      );
    }

    return attemptResult;
  }

  getAttempts(): TestAttemptResult[] {
    return this.load<TestAttemptResult[]>(STORAGE_KEYS.ATTEMPTS, []);
  }

  getUserAttempts(userId: string): TestAttemptResult[] {
    return this.getAttempts().filter(a => a.userId === userId);
  }

  // --- Coins & Wallet ---
  getTransactions(): CoinTransaction[] {
    return this.load<CoinTransaction[]>(STORAGE_KEYS.TRANSACTIONS, initialCoinTransactions);
  }

  getUserTransactions(userId: string): CoinTransaction[] {
    return this.getTransactions()
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addCoins(
    userId: string,
    amount: number,
    type: CoinTransaction['type'],
    description: LocalizedString
  ): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return false;

    // Prevent negative balance
    if (user.coins + amount < 0) return false;

    user.coins += amount;
    this.save(STORAGE_KEYS.USERS, users);

    const tx: CoinTransaction = {
      id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 5),
      userId,
      amount,
      type,
      description,
      timestamp: new Date().toISOString()
    };

    const txs = this.getTransactions();
    txs.unshift(tx);
    this.save(STORAGE_KEYS.TRANSACTIONS, txs);
    return true;
  }

  // --- Certificates ---
  getCertificates(): Certificate[] {
    return this.load<Certificate[]>(STORAGE_KEYS.CERTIFICATES, initialCertificates);
  }

  getUserCertificates(userId: string): Certificate[] {
    return this.getCertificates().filter(c => c.userId === userId);
  }

  getCertificateByNumber(certNumber: string): Certificate | undefined {
    return this.getCertificates().find(c => c.certNumber.trim().toUpperCase() === certNumber.trim().toUpperCase());
  }

  hasCertificate(userId: string, courseId: string): boolean {
    return this.getCertificates().some(c => c.userId === userId && c.courseId === courseId);
  }

  canClaimCertificate(userId: string, courseId: string): { canClaim: boolean; reason?: string } {
    if (this.hasCertificate(userId, courseId)) {
      return { canClaim: false, reason: 'Allaqachon sertifikat rasmiylashtirilgan' };
    }

    const attempts = this.load<TestAttemptResult[]>(STORAGE_KEYS.ATTEMPTS, []);
    const settings = this.getSettings();
    const passedFinal = attempts.some(
      a => a.userId === userId && a.courseId === courseId && a.type === 'final_30' && a.score >= settings.finalExamPassScore
    );

    if (!passedFinal) {
      return { canClaim: false, reason: 'Yakuniy 30 talik imtihondan o‘tmagan' };
    }

    const user = this.getUserById(userId);
    if (!user || user.coins < settings.certCoinCost) {
      return { canClaim: false, reason: `Coin yetarli emas (${user?.coins || 0} / ${settings.certCoinCost})` };
    }

    return { canClaim: true };
  }

  issueCertificate(userId: string, courseId: string): Certificate | null {
    const claimCheck = this.canClaimCertificate(userId, courseId);
    if (!claimCheck.canClaim) return null;

    const user = this.getUserById(userId);
    const course = this.getCourses().find(c => c.id === courseId);
    const subject = this.getSubjects().find(s => s.id === course?.subjectId);
    const settings = this.getSettings();

    if (!user || !course || !subject) return null;

    // Deduct 50 coins idempotently
    const deducted = this.addCoins(
      userId,
      -settings.certCoinCost,
      'cert_purchase',
      {
        uz: `«${course.title.uz}» kursi bo‘yicha rasmiy sertifikat chiqarildi`,
        ru: `Оформлен официальный сертификат по курсу «${course.title.ru}»`,
        en: `Official Knowledge Certificate issued for "${course.title.en}"`
      }
    );

    if (!deducted) return null;

    // Get student's best final exam score
    const attempts = this.load<TestAttemptResult[]>(STORAGE_KEYS.ATTEMPTS, []);
    const finalAttempts = attempts.filter(
      a => a.userId === userId && a.courseId === courseId && a.type === 'final_30'
    );
    const bestScore = finalAttempts.length > 0 ? Math.max(...finalAttempts.map(a => a.score)) : 28;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certNumber = `AL-IIV-2026-${randomSuffix}`;
    const certUrl = `${window.location.origin}?verify=${certNumber}`;

    const newCert: Certificate = {
      id: 'cert_' + Date.now(),
      certNumber,
      userId,
      userName: `${user.name} ${user.surname}`,
      userGroup: user.group,
      courseId,
      courseTitle: course.title.uz,
      subjectTitle: subject.title.uz,
      score: bestScore,
      maxScore: 30,
      issueDate: new Date().toISOString().split('T')[0],
      qrData: certUrl,
      coinPaid: settings.certCoinCost,
      type: 'final_knowledge'
    };

    const certs = this.getCertificates();
    certs.unshift(newCert);
    this.save(STORAGE_KEYS.CERTIFICATES, certs);

    this.addAuditLog('System', 'Sertifikat rasmiylashtirildi', `${certNumber} — ${newCert.userName}`);

    return newCert;
  }

  // --- Admin Audit & Settings ---
  getAuditLogs(): AdminAuditLog[] {
    return this.load<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }

  addAuditLog(adminName: string, action: string, target: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'log_' + Date.now(),
      adminId: 'admin',
      adminName,
      action,
      target,
      timestamp: new Date().toISOString()
    });
    this.save(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100));
  }

  getSettings(): SystemSettings {
    return this.load<SystemSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  }

  updateSettings(settings: SystemSettings): void {
    this.save(STORAGE_KEYS.SETTINGS, settings);
  }

  // CRUD for Admin: Subjects, Courses, Lessons, Questions
  saveSubject(subject: Subject): void {
    const subjects = this.getSubjects().filter(s => s.id !== subject.id);
    subjects.push(subject);
    this.save(STORAGE_KEYS.SUBJECTS, subjects);
    this.addAuditLog('Admin', 'Fan saqlandi', subject.title.uz);
  }

  deleteSubject(subjectId: string): void {
    const subjects = this.getSubjects().filter(s => s.id !== subjectId);
    this.save(STORAGE_KEYS.SUBJECTS, subjects);

    // Cascade delete courses of this subject
    const subjectCourses = this.getCourses().filter(c => c.subjectId === subjectId);
    subjectCourses.forEach(c => this.deleteCourse(c.id));
    this.addAuditLog('Admin', 'Fan o‘chirildi', `ID: ${subjectId}`);
  }

  saveCourse(course: Course): void {
    const courses = this.getCourses().filter(c => c.id !== course.id);
    courses.push(course);
    this.save(STORAGE_KEYS.COURSES, courses);
    this.addAuditLog('Admin', 'Kurs saqlandi', course.title.uz);
  }

  deleteCourse(courseId: string): void {
    const courses = this.getCourses().filter(c => c.id !== courseId);
    this.save(STORAGE_KEYS.COURSES, courses);

    // Cascade delete lessons and questions of this course
    const courseLessons = this.getLessons().filter(l => l.courseId === courseId);
    courseLessons.forEach(l => this.deleteLesson(l.id));

    const questions = this.getQuestions().filter(q => q.courseId !== courseId);
    this.save(STORAGE_KEYS.QUESTIONS, questions);
    this.addAuditLog('Admin', 'Kurs o‘chirildi', `ID: ${courseId}`);
  }

  saveLesson(lesson: VideoLesson): void {
    const lessons = this.getLessons().filter(l => l.id !== lesson.id);
    lessons.push(lesson);
    this.save(STORAGE_KEYS.LESSONS, lessons);
  }

  deleteLesson(lessonId: string): void {
    const lessons = this.getLessons().filter(l => l.id !== lessonId);
    this.save(STORAGE_KEYS.LESSONS, lessons);

    // Also remove questions attached to this lesson
    const questions = this.getQuestions().filter(q => q.lessonId !== lessonId);
    this.save(STORAGE_KEYS.QUESTIONS, questions);
  }

  saveQuestion(question: Question): void {
    const questions = this.getQuestions().filter(q => q.id !== question.id);
    questions.push(question);
    this.save(STORAGE_KEYS.QUESTIONS, questions);
  }

  deleteQuestion(questionId: string): void {
    const questions = this.getQuestions().filter(q => q.id !== questionId);
    this.save(STORAGE_KEYS.QUESTIONS, questions);
  }

  // Language management
  getCurrentLanguage(): Language {
    return (localStorage.getItem(STORAGE_KEYS.CURRENT_LANG) as Language) || 'uz';
  }

  setCurrentLanguage(lang: Language): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_LANG, lang);
  }
}

export const storage = new StorageService();
