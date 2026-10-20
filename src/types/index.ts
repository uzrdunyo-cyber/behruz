/**
 * IIV Andijon Akademik Litseyi — Ta'lim Platformasi
 * Asosiy ma'lumotlar turlari (Types & Interfaces)
 */

export type Language = 'uz' | 'ru' | 'en';

export interface LocalizedString {
  uz: string;
  ru: string;
  en: string;
}

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  surname: string;
  group: string; // e.g. "101", "102", "201"
  login: string;
  passwordHash: string;
  role: UserRole;
  coins: number;
  createdAt: string;
  isBlocked?: boolean;
}

export interface Subject {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  order: number;
  color: string;
}

export interface Course {
  id: string;
  subjectId: string;
  title: LocalizedString;
  description: LocalizedString;
  level: 'Boshlang‘ich' | 'O‘rta' | 'Murakkab';
  order: number;
  passingFinalScore: number; // default 24 out of 30
  certificateCost: number; // default 50 coins
}

export interface VideoLesson {
  id: string;
  courseId: string;
  title: LocalizedString;
  description: LocalizedString;
  videoUrl: string; // Direct mp4 or YouTube embed
  order: number;
  durationSeconds: number;
  isPublished: boolean;
  videoLang?: 'uz' | 'ru' | 'en';
}

export interface Question {
  id: string;
  lessonId?: string; // If null, belongs to courseId for final 30 exam
  courseId: string;
  text: LocalizedString;
  options: LocalizedString[];
  correctOptionIndex: number; // Server/admin only - never exposed to student in quiz mode!
  explanationHint: LocalizedString; // Advice shown on wrong answer without revealing correct key
}

export interface LessonProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  watchedPercentage: number;
  isCompleted: boolean;
  highestScore: number; // 0-10
  attemptsCount: number;
  lastAttemptDate?: string;
  unlocked: boolean;
}

export interface TestAnswerSubmission {
  questionId: string;
  selectedOptionIndex: number;
}

export interface TestAttemptResult {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  type: 'lesson_10' | 'final_30';
  score: number;
  maxScore: number;
  passed: boolean;
  timestamp: string;
  answers: {
    questionId: string;
    questionText: string;
    selectedOptionIndex: number;
    selectedOptionText: string;
    isCorrect: boolean;
    explanationHint: string;
  }[];
}

export interface Certificate {
  id: string;
  certNumber: string; // e.g. "AL-IIV-2026-8910"
  userId: string;
  userName: string;
  userGroup: string;
  courseId: string;
  courseTitle: string;
  subjectTitle: string;
  score: number;
  maxScore: number;
  issueDate: string;
  qrData: string;
  coinPaid: number;
  type: 'final_knowledge' | 'course_completion';
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number; // +10, -50, etc.
  type: 'lesson_reward' | 'course_reward' | 'final_reward' | 'cert_purchase' | 'admin_bonus' | 'admin_deduction';
  description: LocalizedString;
  timestamp: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SystemSettings {
  lessonPassScore: number; // default: 6 (out of 10)
  finalExamPassScore: number; // default: 24 (out of 30)
  lessonPassReward: number; // default: 10 coins
  finalExamPassReward: number; // default: 50 coins
  certCoinCost: number; // default: 50 coins
}
