/**
 * IIV Andijon Akademik Litseyi — Boshlang'ich Ma'lumotlar Bazasi
 * Barcha soxta progresslar olib tashlangan, toza nol holatidan boshlanadi.
 * O'zbek, Rus va Ingliz tillarida boyitilgan videodarslar to'plami.
 */

import {
  Subject,
  Course,
  VideoLesson,
  Question,
  User,
  LessonProgress,
  Certificate,
  CoinTransaction,
  SystemSettings,
  AdminAuditLog
} from '../types';

export const initialSettings: SystemSettings = {
  lessonPassScore: 6,
  finalExamPassScore: 24,
  lessonPassReward: 10,
  finalExamPassReward: 50,
  certCoinCost: 50,
};

// Admin hashes support: admin123 and admin2026
// Students start with 0 coins
export const initialUsers: User[] = [
  {
    id: 'user_admin',
    name: 'Administrator',
    surname: 'Litsey',
    group: 'Ma’muriyat',
    login: 'admin',
    passwordHash: '2ec444f53b1aa9adce6727b201cb6ec871c1653601b0d710d63167e35b77914b', // abdurahmonkiber
    role: 'admin',
    coins: 999,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'user_behruz',
    name: 'Behruzbek',
    surname: 'Anvarjonov',
    group: '101',
    login: 'behruz',
    passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // 101101
    role: 'student',
    coins: 0, // Starts at 0
    createdAt: '2026-09-02T09:30:00Z',
  },
  {
    id: 'user_madina',
    name: 'Madinaxon',
    surname: 'Rahimova',
    group: '102',
    login: 'madina',
    passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    role: 'student',
    coins: 0, // Starts at 0
    createdAt: '2026-09-03T11:15:00Z',
  }
];

export const initialSubjects: Subject[] = [
  {
    id: 'sub_it',
    title: {
      uz: 'IT va Dasturlash',
      ru: 'IT и Программирование',
      en: 'IT & Software Engineering'
    },
    description: {
      uz: 'Python, algoritmlar, ma’lumotlar bazasi va zamonaviy web texnologiyalari',
      ru: 'Python, алгоритмы, базы данных и современные веб-технологии',
      en: 'Python, algorithms, databases, and modern web application development'
    },
    icon: 'Code2',
    order: 1,
    color: 'from-blue-600 to-indigo-800'
  },
  {
    id: 'sub_history',
    title: {
      uz: 'Tarix va Davlatchilik',
      ru: 'История и Государственность',
      en: 'History & Statehood'
    },
    description: {
      uz: 'O‘zbekiston va jahon tarixi, Amir Temur saltanati, buyuk sarkardalar va huquqiy meros',
      ru: 'История Узбекистана и мира, держава Амира Темура и правовое наследие',
      en: 'History of Uzbekistan, Amir Timur empire, great military leaders and state legacy'
    },
    icon: 'Landmark',
    order: 2,
    color: 'from-amber-600 to-stone-800'
  },
  {
    id: 'sub_english',
    title: {
      uz: 'Ingliz Tili',
      ru: 'Английский Язык',
      en: 'English Language Mastery'
    },
    description: {
      uz: 'Grammatika, so‘zlashuv nutqi, xalqaro testlarga tayyorgarlik va akademik yozuv',
      ru: 'Грамматика, разговорная речь, подготовка к тестам и академическое письмо',
      en: 'Grammar structures, everyday communication, reading comprehension, and fluency'
    },
    icon: 'Languages',
    order: 3,
    color: 'from-emerald-600 to-teal-800'
  },
  {
    id: 'sub_math',
    title: {
      uz: 'Matematika va Mantiq',
      ru: 'Математика и Логика',
      en: 'Mathematics & Logical Reasoning'
    },
    description: {
      uz: 'Algebra, geometriya, kombinatorika, tenglamalar va olimpiada mantiqiy masalalari',
      ru: 'Алгебра, геометрия, комбинаторика, уравнения и олимпиадные логические задачи',
      en: 'Algebra, geometry, combinatorics, equation systems, and olympiad logic'
    },
    icon: 'Calculator',
    order: 4,
    color: 'from-rose-600 to-red-800'
  }
];

export const initialCourses: Course[] = [
  {
    id: 'course_python',
    subjectId: 'sub_it',
    title: {
      uz: 'Python Dasturlash Asoslari (O‘zbekcha)',
      ru: 'Основы Python (Узбекский курс)',
      en: 'Python Essentials (Uzbek Track)'
    },
    description: {
      uz: 'Sintaksis, o‘zgaruvchilar, shartlar, sikllar, funksiyalar va amaliy loyihalar.',
      ru: 'Синтаксис, переменные, циклы, условия, функции и прикладные алгоритмы.',
      en: 'Syntax, variables, conditional structures, loops, functions, and hands-on algorithms.'
    },
    level: 'Boshlang‘ich',
    order: 1,
    passingFinalScore: 24,
    certificateCost: 50
  },
  {
    id: 'course_python_ru',
    subjectId: 'sub_it',
    title: {
      uz: 'Python va Algoritmlar (Ruscha)',
      ru: 'Программирование на Python и алгоритмы (Русский язык)',
      en: 'Python & Data Structures (Russian Track)'
    },
    description: {
      uz: 'Python tili sintaksisi, ro‘yxatlar, lug‘atlar va algoritmlar rus tilida.',
      ru: 'Синтаксис языка Python, структуры данных, списки, словари и функции на русском языке.',
      en: 'Core Python syntax, data structures, lists, dictionaries, and functions in Russian.'
    },
    level: 'Boshlang‘ich',
    order: 2,
    passingFinalScore: 24,
    certificateCost: 50
  },
  {
    id: 'course_english_grammar',
    subjectId: 'sub_english',
    title: {
      uz: 'Academic English & Conversational Fluency (Inglizcha)',
      ru: 'Академический английский и разговорная речь (English)',
      en: 'Academic English & Conversational Fluency'
    },
    description: {
      uz: 'Tense system, daily communication, speaking mastery and essential vocabulary.',
      ru: 'Времена, словарный запас, восприятие речи на слух и диалоги.',
      en: 'Tense system, active vocabulary, spoken communication, and daily dialogues.'
    },
    level: 'Boshlang‘ich',
    order: 3,
    passingFinalScore: 24,
    certificateCost: 50
  },
  {
    id: 'course_history_temur',
    subjectId: 'sub_history',
    title: {
      uz: 'O‘zbekiston Tarixi: Sohibqiron Amir Temur Saltanati',
      ru: 'История Узбекистана: Эпоха Амира Темура и Темуридов',
      en: 'History of Uzbekistan: Amir Timur & Statehood Legacy'
    },
    description: {
      uz: 'Markazlashgan davlat asoslari, Temur tuzuklari, harbiy san’at va ilm-fan yuksalishi.',
      ru: 'Основы централизованного государства, Уложения Темура и расцвет наук.',
      en: 'Centralized state foundations, Timur’s Institutes, military strategy, and culture.'
    },
    level: 'Boshlang‘ich',
    order: 4,
    passingFinalScore: 24,
    certificateCost: 50
  },
  {
    id: 'course_math_logic',
    subjectId: 'sub_math',
    title: {
      uz: 'Matematika: Tenglamalar va Mantiqiy Masalalar',
      ru: 'Математика: Уравнения и олимпиадные логические задачи',
      en: 'Mathematics: Equations & Logic Problem Solving'
    },
    description: {
      uz: 'Chiziqli va kvadrat tenglamalar, parametrli ifodalar, mantiqiy xulosalar.',
      ru: 'Системы уравнений, логика рассуждений и комбинаторные задачи.',
      en: 'Linear and quadratic equation systems, combinatorial reasoning, and logic.'
    },
    level: 'O‘rta',
    order: 5,
    passingFinalScore: 24,
    certificateCost: 50
  }
];

export const initialLessons: VideoLesson[] = [
  // --- Python Course (Uzbek) ---
  {
    id: 'les_py_1',
    courseId: 'course_python',
    title: {
      uz: '1-video: Python bilan tanishuv va muhitni sozlash',
      ru: 'Урок 1: Знакомство с Python и установка среды',
      en: 'Lesson 1: Python Introduction & Setup'
    },
    description: {
      uz: 'Python dasturlash tilining imkoniyatlari, print() funksiyasi, izohlar va birinchi dasturni ishga tushirish.',
      ru: 'Возможности языка Python, функция print(), комментарии и запуск первой программы.',
      en: 'Overview of Python language, print() function, comments, and running your first script.'
    },
    videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
    order: 1,
    durationSeconds: 300,
    isPublished: true,
    videoLang: 'uz'
  },
  {
    id: 'les_py_2',
    courseId: 'course_python',
    title: {
      uz: '2-video: O‘zgaruvchilar va ma’lumot turlari',
      ru: 'Урок 2: Переменные и типы данных',
      en: 'Lesson 2: Variables & Data Types'
    },
    description: {
      uz: 'Int, float, string, boolean turlari, o‘zgaruvchilarni nomlash qoidalari va input() bilan foydalanuvchidan ma’lumot olish.',
      ru: 'Типы int, float, str, bool, правила именования переменных и ввод через input().',
      en: 'Integer, float, string, and boolean types, naming conventions, and reading input via input().'
    },
    videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
    order: 2,
    durationSeconds: 320,
    isPublished: true,
    videoLang: 'uz'
  },
  {
    id: 'les_py_3',
    courseId: 'course_python',
    title: {
      uz: '3-video: Shart operatorlari (if, elif, else) va mantiq',
      ru: 'Урок 3: Условные конструкции (if, elif, else) и логика',
      en: 'Lesson 3: Conditionals (if, elif, else) & Logic'
    },
    description: {
      uz: 'Taqqoslash amallari, and/or/not mantiqiy operatorlari va tarmoqlanuvchi dasturlar tuzish.',
      ru: 'Операторы сравнения, логические связки and/or/not и ветвление алгоритмов.',
      en: 'Comparison operators, logical and/or/not, and branching program structures.'
    },
    videoUrl: 'https://www.youtube.com/embed/Z1Yd7upQsXY',
    order: 3,
    durationSeconds: 340,
    isPublished: true,
    videoLang: 'uz'
  },
  {
    id: 'les_py_4',
    courseId: 'course_python',
    title: {
      uz: '4-video: Sikllar (for va while) va takrorlanishlar',
      ru: 'Урок 4: Циклы for и while, операторы break и continue',
      en: 'Lesson 4: Loops (for & while) & Iteration'
    },
    description: {
      uz: 'range() funksiyasi, takrorlanuvchi jarayonlar, break va continue bilan siklni boshqarish.',
      ru: 'Функция range(), циклические структуры и управление ходом выполнения.',
      en: 'range() function, loops, break and continue flow control.'
    },
    videoUrl: 'https://www.youtube.com/embed/94UHCEmprCY',
    order: 4,
    durationSeconds: 330,
    isPublished: true,
    videoLang: 'uz'
  },

  // --- Python Course (Russian Track) ---
  {
    id: 'les_pyru_1',
    courseId: 'course_python_ru',
    title: {
      uz: '1-video: Python asoslari va sintaksisi (Ruscha)',
      ru: 'Урок 1: Введение в Python, типы данных и ввод/вывод',
      en: 'Lesson 1: Python Basics & Syntax (Russian)'
    },
    description: {
      uz: 'Python dasturlash tiliga kirish, o‘zgaruvchilar va print/input funksiyalari rus tilida.',
      ru: 'Основы языка Python, переменные, числа, строки и базовые операции ввода-вывода.',
      en: 'Introduction to Python language, data types and console I/O in Russian.'
    },
    videoUrl: 'https://www.youtube.com/embed/fp54QtlPV3M',
    order: 1,
    durationSeconds: 350,
    isPublished: true,
    videoLang: 'ru'
  },
  {
    id: 'les_pyru_2',
    courseId: 'course_python_ru',
    title: {
      uz: '2-video: Ro‘yxatlar va lug‘atlar bilan ishlash (Ruscha)',
      ru: 'Урок 2: Списки (list), кортежи (tuple) и словари (dict)',
      en: 'Lesson 2: Lists, Tuples & Dictionaries in Python'
    },
    description: {
      uz: 'Kolleksiyalar, elementlarni indekslash, qo‘shish va o‘chirish metodlari.',
      ru: 'Коллекции в Python: методы списков, срезы, неизменяемые кортежи и словари ключ-значение.',
      en: 'Collections in Python: list methods, indexing, tuples and key-value dictionaries.'
    },
    videoUrl: 'https://www.youtube.com/embed/chPhlsHoEPo',
    order: 2,
    durationSeconds: 340,
    isPublished: true,
    videoLang: 'ru'
  },

  // --- English Course (English Track) ---
  {
    id: 'les_eng_1',
    courseId: 'course_english_grammar',
    title: {
      uz: '1-video: Present Simple va Continuous farqlari',
      ru: 'Lesson 1: Present Simple vs Present Continuous',
      en: 'Lesson 1: Present Simple vs Present Continuous Mastery'
    },
    description: {
      uz: 'Doimiy odatlar va ayni damda sodir bo‘layotgan jarayonlarni to‘g‘ri gapirish qoidalari.',
      ru: 'Постоянные привычки и действия в данный момент, маркеры времени и употребление.',
      en: 'Habits versus actions happening right now, stative verbs, and time markers.'
    },
    videoUrl: 'https://www.youtube.com/embed/AEBvibTkgnA',
    order: 1,
    durationSeconds: 270,
    isPublished: true,
    videoLang: 'en'
  },
  {
    id: 'les_eng_2',
    courseId: 'course_english_grammar',
    title: {
      uz: '2-video: Past Simple va hikoya qilish san’ati',
      ru: 'Lesson 2: Past Simple and Storytelling',
      en: 'Lesson 2: Past Simple & Narrative Fluency'
    },
    description: {
      uz: 'To‘g‘ri va noto‘g‘ri fe’llar, savol va inkor tuzilmalari, o‘tgan voqealarni bayon qilish.',
      ru: 'Правильные и неправильные глаголы, вопросы и построение связного рассказа.',
      en: 'Regular and irregular verbs, question forms, negations, and fluency in storytelling.'
    },
    videoUrl: 'https://www.youtube.com/embed/mwh_nW_qvdQ',
    order: 2,
    durationSeconds: 290,
    isPublished: true,
    videoLang: 'en'
  },
  {
    id: 'les_eng_3',
    courseId: 'course_english_grammar',
    title: {
      uz: '3-video: Everyday English Speaking & Communication',
      ru: 'Lesson 3: Everyday Conversational Fluency',
      en: 'Lesson 3: Everyday Conversational Fluency & Phrases'
    },
    description: {
      uz: 'Kundalik muloqotda kerak bo‘ladigan eng faol iboralar va ravon gapirish sirlari.',
      ru: 'Ключевые фразы для ежедневного общения и преодоление языкового барьера.',
      en: 'Core conversational phrases, listening tips, and speaking confidence.'
    },
    videoUrl: 'https://www.youtube.com/embed/7X_QnF2_xM0',
    order: 3,
    durationSeconds: 310,
    isPublished: true,
    videoLang: 'en'
  },
  {
    id: 'les_eng_4',
    courseId: 'course_english_grammar',
    title: {
      uz: '4-video: Future Tenses and Modal Verbs',
      ru: 'Lesson 4: Future Forms and Modal Verbs',
      en: 'Lesson 4: Future Forms & Modal Verbs Mastery'
    },
    description: {
      uz: 'Kelasi zamon shakllari (will, going to) va modal fe’llar (can, should, must) qoidalari.',
      ru: 'Будущее время (will, going to) и модальные глаголы (can, should, must) на практике.',
      en: 'Future forms (will vs going to) and essential modal verbs in conversational English.'
    },
    videoUrl: 'https://www.youtube.com/embed/juKd26qkNAw',
    order: 4,
    durationSeconds: 320,
    isPublished: true,
    videoLang: 'en'
  },

  // --- History Course (Uzbek Track) ---
  {
    id: 'les_hist_1',
    courseId: 'course_history_temur',
    title: {
      uz: '1-video: Amir Temurning markazlashgan davlat barpo etishi',
      ru: 'Урок 1: Создание централизованного государства Амиром Темуром',
      en: 'Lesson 1: Establishment of Centralized State by Amir Timur'
    },
    description: {
      uz: '1370-yilda hokimiyatga kelishi, tarqoqlikni bartaraf etish va poytaxt Samarqandning yuksalishi.',
      ru: 'Приход к власти в 1370 году, преодоление феодальной раздробленности и расцвет Самарканда.',
      en: 'Rise to power in 1370, overcoming feudal division, and growth of Samarkand.'
    },
    videoUrl: 'https://www.youtube.com/embed/1la40WpLMT4',
    order: 1,
    durationSeconds: 280,
    isPublished: true,
    videoLang: 'uz'
  },
  {
    id: 'les_hist_2',
    courseId: 'course_history_temur',
    title: {
      uz: '2-video: Temur tuzuklari va davlat boshqaruvi qoidalari',
      ru: 'Урок 2: Уложения Темура и правовые основы управления',
      en: 'Lesson 2: Timur’s Institutes and Statecraft Governance'
    },
    description: {
      uz: '“Kuch — adolatdadir” shiorining ma’nosi, adliya tizimi, lashkar tuzilishi va diplomatik aloqalar.',
      ru: 'Принцип «Сила в справедливости», правовая система, структура войска и дипломатия.',
      en: 'The principle "Strength is in Justice", judicial system, army command, and diplomacy.'
    },
    videoUrl: 'https://www.youtube.com/embed/x8VYWazR5mE',
    order: 2,
    durationSeconds: 310,
    isPublished: true,
    videoLang: 'uz'
  },
  {
    id: 'les_hist_3',
    courseId: 'course_history_temur',
    title: {
      uz: '3-video: Jaloliddin Manguberdi va vatanparvarlik jasorati',
      ru: 'Урок 3: Джалолиддин Мангуберды и героизм защитников родины',
      en: 'Lesson 3: Jaloliddin Manguberdi & Patriotic Heroism'
    },
    description: {
      uz: 'Mo‘g‘ullar istilosiga qarshi mardona kurash, Parvon jangi va Sind daryosi bo‘yidagi jasorat.',
      ru: 'Борьба против монгольского нашествия, битва при Парване и подвиг на реке Инд.',
      en: 'Courageous resistance against Mongol invasion, battle of Parwan, and historical legacy.'
    },
    videoUrl: 'https://www.youtube.com/embed/01qXhGgNfW4',
    order: 3,
    durationSeconds: 330,
    isPublished: true,
    videoLang: 'uz'
  },
  {
    id: 'les_hist_4',
    courseId: 'course_history_temur',
    title: {
      uz: '4-video: Temuriylar renessansi va jahon ilm-fani rivoji',
      ru: 'Урок 4: Темуридский ренессанс и расцвет мировой науки',
      en: 'Lesson 4: Timurid Renaissance & Scientific Advancements'
    },
    description: {
      uz: 'Ulug‘bek rasadxonasi, Alisher Navoiy adabiy merosi va me’morchilik durdonalari.',
      ru: 'Обсерватория Улугбека, литературное наследие Алишера Навои и архитектурные шедевры.',
      en: 'Ulugh Beg Observatory, Alisher Navoi literary heritage, and architectural masterpieces.'
    },
    videoUrl: 'https://www.youtube.com/embed/dC4vVq_jFuo',
    order: 4,
    durationSeconds: 340,
    isPublished: true,
    videoLang: 'uz'
  },

  // --- Math Course (Uzbek Track) ---
  {
    id: 'les_math_1',
    courseId: 'course_math_logic',
    title: {
      uz: '1-video: Kvadrat tenglamalar va Viyet teoremasi',
      ru: 'Урок 1: Квадратные уравнения и теорема Виета',
      en: 'Lesson 1: Quadratic Equations & Vieta’s Theorem'
    },
    description: {
      uz: 'Diskriminant formulasi, ildizlarning xususiyatlari va Viyet teoremasi orqali tez yechish.',
      ru: 'Формула дискриминанта, свойства корней и быстрый подсчет по теореме Виета.',
      en: 'Discriminant formula, roots properties, and fast calculations using Vieta’s theorem.'
    },
    videoUrl: 'https://www.youtube.com/embed/vDqOoI-4Z6M',
    order: 1,
    durationSeconds: 310,
    isPublished: true,
    videoLang: 'uz'
  },
  {
    id: 'les_math_2',
    courseId: 'course_math_logic',
    title: {
      uz: '2-video: Kombinatorika asoslari va mantiqiy masalalar',
      ru: 'Урок 2: Основы комбинаторики и логические задачи',
      en: 'Lesson 2: Combinatorics Basics & Logic Puzzles'
    },
    description: {
      uz: 'Ko‘paytirish qoidasi, o‘rin almashtirish (permutatsiya) va ehtimollik masalalariga kirish.',
      ru: 'Правило умножения, перестановки и базовые логические задачи.',
      en: 'Rule of product, permutations, combinations, and reasoning methods.'
    },
    videoUrl: 'https://www.youtube.com/embed/fOzfI1k3vK4',
    order: 2,
    durationSeconds: 320,
    isPublished: true,
    videoLang: 'uz'
  },
  {
    id: 'les_math_3',
    courseId: 'course_math_logic',
    title: {
      uz: '3-video: Geometriya: Pifagor teoremasi va shakllar yuzasi',
      ru: 'Урок 3: Теорема Пифагора и площади геометрических фигур',
      en: 'Lesson 3: Pythagorean Theorem & Geometric Area Calculation'
    },
    description: {
      uz: 'To‘g‘ri burchakli uchburchak gipotenuzasi, Pifagor sonlari va geometrik shakllar yuzasini hisoblash usullari.',
      ru: 'Свойства прямоугольного треугольника, пифагоровы тройки и расчет площадей фигур.',
      en: 'Right-angled triangle properties, Pythagorean triples, and surface area calculation.'
    },
    videoUrl: 'https://www.youtube.com/embed/dp2vG_6c_w0',
    order: 3,
    durationSeconds: 330,
    isPublished: true,
    videoLang: 'uz'
  },
  {
    id: 'les_math_4',
    courseId: 'course_math_logic',
    title: {
      uz: '4-video: Funksiyalar, chiziqli grafiklar va tengsizliklar',
      ru: 'Урок 4: Функции, графики и решение неравенств',
      en: 'Lesson 4: Functions, Graphs & Inequality Systems'
    },
    description: {
      uz: 'Chiziqli funksiya grafigi, burchak koeffitsiyenti, intervallar usuli va tengsizliklar yechish.',
      ru: 'Графики линейных функций, угловой коэффициент и метод интервалов при решении неравенств.',
      en: 'Linear function graphs, slope intercept, and interval methods for inequality systems.'
    },
    videoUrl: 'https://www.youtube.com/embed/N-7Kk2bE_iI',
    order: 4,
    durationSeconds: 340,
    isPublished: true,
    videoLang: 'uz'
  }
];

// Re-usable helper to generate standard 10 questions for any lesson
function generateTenQuestions(
  lessonId: string,
  courseId: string,
  topic: string,
  questionsData: { text: string; options: string[]; correctIdx: number; hint: string }[]
): Question[] {
  return questionsData.map((item, idx) => ({
    id: `q_${lessonId}_${idx + 1}`,
    lessonId,
    courseId,
    text: {
      uz: item.text,
      ru: item.text,
      en: item.text
    },
    options: item.options.map(opt => ({ uz: opt, ru: opt, en: opt })),
    correctOptionIndex: item.correctIdx,
    explanationHint: {
      uz: item.hint,
      ru: item.hint,
      en: item.hint
    }
  }));
}

// 10 Questions for Python Lesson 1
export const py1Questions = generateTenQuestions('les_py_1', 'course_python', 'Python Kirish', [
  {
    text: 'Python dasturlash tilida ekranga ma’lumot chiqarish uchun qaysi funksiya ishlatiladi?',
    options: ['input()', 'print()', 'echo()', 'console.log()'],
    correctIdx: 1,
    hint: 'Ushbu savol ekranga ma’lumot chiqarish mavzusiga tegishli. Video ichidagi print() qismini yana bir bor ko‘rib chiqing.'
  },
  {
    text: 'Python fayllari qanday kengaytma (extension) bilan saqlanadi?',
    options: ['.py', '.pt', '.python', '.txt'],
    correctIdx: 0,
    hint: 'Python fayllarining standart kengaytmasi (.py) mavzusini videoning boshidan qayta ko‘ring.'
  },
  {
    text: 'Python kodida bir qatorli izoh (comment) yozish uchun qaysi belgidan foydalaniladi?',
    options: ['//', '/*', '#', '--'],
    correctIdx: 2,
    hint: 'Izohlar interpretator tomonidan o‘qilmaydi. Python-da # belgisi bir qatorli izoh uchun xizmat qiladi.'
  },
  {
    text: 'Python tili qanday turdagi dasturlash tillari guruhiga kiradi?',
    options: ['Assembler kodi', 'Interpretatsiya qilinadigan yuqori darajali til', 'Faqat HTML kabi belgilash tili', 'Mikrokod'],
    correctIdx: 1,
    hint: 'Python qatorma-qator interpretator orqali bajariluvchi yuqori darajali til hisoblanadi.'
  },
  {
    text: 'Quyidagi kod natijasi nima bo‘ladi: print(5 + 3 * 2)?',
    options: ['16', '11', '10', 'Syntax Error'],
    correctIdx: 1,
    hint: 'Matematik amallarning ketma-ketlik ustuvorligini takrorlang: ko‘paytirish qo‘shishdan oldin bajariladi (3*2=6; 5+6=11).'
  },
  {
    text: 'Python dasturlash tilining asoschisi kim hisoblanadi?',
    options: ['Gvido van Rossum (Guido van Rossum)', 'Jeyms Gosling', 'Dennis Ritchi', 'Bjarne Stroustrup'],
    correctIdx: 0,
    hint: 'Python tili 1991-yilda niderlandiyalik dasturchi Gvido van Rossum tomonidan yaratilgan.'
  },
  {
    text: 'Quyidagi kod natijasi nima bo‘ladi: print("Andijon" + " " + "Litsey")?',
    options: ['AndijonLitsey', 'Andijon Litsey', 'TypeError', 'Andijon+Litsey'],
    correctIdx: 1,
    hint: 'Satrlarni qo‘shish (konkatenatsiya) amallarida bo‘sh joy qo‘shilganiga e’tibor bering.'
  },
  {
    text: 'Python dasturlash tilida bloklar (kod bo‘laklari) qanday ajratiladi?',
    options: ['Jingalak qavslar { } bilan', 'Satr boshidagi bo‘sh joylar (indentation / surilish) orqali', 'Nuqta-vergul ; bilan', 'begin va end bilan'],
    correctIdx: 1,
    hint: 'Python-da surilishlar (indentation) sintaktik majburiy qoida sanaladi.'
  },
  {
    text: 'Python dasturida har bir buyruqdan keyin nuqta-vergul (;) qo‘yish shartmi?',
    options: ['Ha, har doim shart', 'Yo‘q, shart emas (yangi qator yetarli)', 'Faqat matematik amallarda', 'Faqat kiritishda'],
    correctIdx: 1,
    hint: 'Python-da har bir qatordagi yangi qator belgisi buyruqni tugatadi.'
  },
  {
    text: 'Quyidagi kod natijasi nima bo‘ladi: print(type("100"))?',
    options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'number'>"],
    correctIdx: 1,
    hint: 'Qo‘shtirnoq ichiga olingan har qanday qiymat satr (str) ma’lumot turi hisoblanadi.'
  }
]);

// 10 Questions for Python Lesson 2
export const py2Questions = generateTenQuestions('les_py_2', 'course_python', 'O‘zgaruvchilar', [
  {
    text: 'Python-da foydalanuvchidan ma’lumot qabul qilish uchun qaysi funksiya ishlatiladi?',
    options: ['read()', 'input()', 'scan()', 'get()'],
    correctIdx: 1,
    hint: 'Foydalanuvchidan konsol orqali qiymat olish input() funksiyasi orqali amalga oshiriladi.'
  },
  {
    text: 'input() funksiyasi qabul qilingan ma’lumotni qaysi turda qaytaradi?',
    options: ['int (butun son)', 'str (satr / matn)', 'bool (mantiqiy)', 'float'],
    correctIdx: 1,
    hint: 'input() har doim satr (str) qaytaradi, raqam sifatida ishlatish uchun int() ga o‘tkazish kerak.'
  },
  {
    text: 'Quyidagilardan qaysi biri to‘g‘ri o‘zgaruvchi nomi hisoblanadi?',
    options: ['2kurs_bahosi', 'talaba_yoshi', 'talaba-yoshi', 'class'],
    correctIdx: 1,
    hint: 'O‘zgaruvchi nomi raqam bilan boshlanmaydi va maxsus kalit so‘zlardan foydalanilmaydi.'
  },
  {
    text: 'Python-da butun sonli bo‘lish (qoldiqsiz bo‘lish) amali qaysi belgi bilan bajariladi?',
    options: ['/', '//', '%', '**'],
    correctIdx: 1,
    hint: '// operatori bo‘linmaning butun qismini oladi.'
  },
  {
    text: '17 % 5 amali natijasi nechaga teng bo‘ladi?',
    options: ['3', '2', '3.4', '5'],
    correctIdx: 1,
    hint: '% operatori bo‘lishdagi qoldiqni topadi: 17 = 5 * 3 + 2, qoldiq 2.'
  },
  {
    text: 'Darajaga ko‘tarish amali qaysi operator yordamida yoziladi?',
    options: ['^', '**', 'pow', '^^'],
    correctIdx: 1,
    hint: 'Python-da daraja amali ikkita yulduzcha ** bilan yoziladi.'
  },
  {
    text: 'Satr ma’lumot turini butun songa aylantirish uchun qaysi funksiya chaqiriladi?',
    options: ['to_int()', 'int()', 'Integer()', 'str2num()'],
    correctIdx: 1,
    hint: 'Turlarni almashtirish (casting) uchun int() ishlatiladi.'
  },
  {
    text: 'Mantiqiy (boolean) turda qaysi ikkita qiymat mavjud?',
    options: ['YES va NO', 'True va False', '0 va 1 faqat', 'Right va Wrong'],
    correctIdx: 1,
    hint: 'Python-da mantiqiy qiymatlar bosh harf bilan: True va False.'
  },
  {
    text: 'Quyidagi kod natijasi nima bo‘ladi: x = "5"; y = 2; print(x * y)?',
    options: ['10', '"55"', 'TypeError', '25'],
    correctIdx: 1,
    hint: 'Satrni songa ko‘paytirganda satr shuncha marta takrorlanadi ("5" * 2 = "55").'
  },
  {
    text: 'O‘zgaruvchining turini aniqlash uchun qaysi funksiyadan foydalaniladi?',
    options: ['typeof()', 'type()', 'kind()', 'check()'],
    correctIdx: 1,
    hint: 'type() funksiyasi obyektning sinfini va turini qaytaradi.'
  }
]);

// 10 Questions for Python Lesson 3
export const py3Questions = generateTenQuestions('les_py_3', 'course_python', 'Shartlar', [
  {
    text: 'Python-da bir nechta shartlarni ketma-ket tekshirishda qaysi kalit so‘z ishlatiladi?',
    options: ['else if', 'elif', 'elseif', 'case'],
    correctIdx: 1,
    hint: 'Python-da boshqa tillardagi else if o‘rniga elif kalit so‘zi qo‘llaniladi.'
  },
  {
    text: 'Tenglikni taqqoslash uchun qaysi operator qo‘llaniladi?',
    options: ['=', '==', '===', 'equals'],
    correctIdx: 1,
    hint: '= qiymat biriktiradi, == esa tenglikni solishtiradi.'
  },
  {
    text: 'Ikkita shartning ikkalasi ham to‘g‘ri bo‘lishini talab qiluvchi mantiqiy operator qaysi?',
    options: ['or', 'and', 'not', 'both'],
    correctIdx: 1,
    hint: 'and operatorida ikkala taraf ham True bo‘lsagina True qaytadi.'
  },
  {
    text: 'range(1, 5) ifodasi qanday ketma-ketlikdagi sonlarni hosil qiladi?',
    options: ['1, 2, 3, 4, 5', '1, 2, 3, 4', '0, 1, 2, 3, 4', '2, 3, 4, 5'],
    correctIdx: 1,
    hint: 'range(boshlanish, tugash)da oxirgi son diapazonga kirmaydi.'
  },
  {
    text: 'Siklni muddatidan oldin butunlay to‘xtatish uchun qaysi kalit so‘z ishlatiladi?',
    options: ['continue', 'break', 'pass', 'exit'],
    correctIdx: 1,
    hint: 'break siklni darhol to‘xtatib, undan chiqadi.'
  },
  {
    text: 'Quyidagi kod necha marta aylanadi: while False: print("Litsey")?',
    options: ['1 marta', '0 marta (hech qachon)', 'Cheksiz marta', 'Xatolik beradi'],
    correctIdx: 1,
    hint: 'while sharti boshidanoq False bo‘lsa, sikl tanasi 0 marta bajariladi.'
  },
  {
    text: 'Teng emas (not equal) mantiqiy taqqoslash amali qaysi belgi bilan yoziladi?',
    options: ['<>', '!=', '!==', 'not='],
    correctIdx: 1,
    hint: 'Python-da teng emaslik amali != bilan belgilanadi.'
  },
  {
    text: 'Sikldagi joriy qadamni tashlab o‘tib, keyingi qadamga o‘tish uchun qaysi buyruq qo‘llaniladi?',
    options: ['skip', 'continue', 'next', 'jump'],
    correctIdx: 1,
    hint: 'continue navbatdagi iteratsiyaga o‘tkazadi.'
  },
  {
    text: 'Bo‘sh blok yaratishda sintaktik xatolik chiqmasligi uchun qaysi operator yoziladi?',
    options: ['null', 'pass', 'none', 'empty'],
    correctIdx: 1,
    hint: 'pass hech qanday amal bajarmaydigan sintaktik to‘ldiruvchidir.'
  },
  {
    text: 'Quyidagi kod natijasi nima bo‘ladi: x = 10; print("Katta" if x > 5 else "Kichik")?',
    options: ['Kichik', 'Katta', 'True', 'Syntax Error'],
    correctIdx: 1,
    hint: 'Ternar ifodada shart (x > 5) bajarilgani uchun "Katta" chiqadi.'
  }
]);

// 10 Questions for History Lesson 1
export const hist1Questions = generateTenQuestions('les_hist_1', 'course_history_temur', 'Amir Temur', [
  {
    text: 'Sohibqiron Amir Temur nechanchi yilda markazlashgan davlat barpo etdi?',
    options: ['1336-yilda', '1370-yilda', '1385-yilda', '1405-yilda'],
    correctIdx: 1,
    hint: 'Amir Temur 1370-yilda Balx qurultoyida Movarounnahrning oliy hukmdori deb e’lon qilingan.'
  },
  {
    text: 'Amir Temur saltanatining poytaxti qaysi shahar etib belgilangan?',
    options: ['Buxoro', 'Samarqand', 'Shahrisabz', 'Hirot'],
    correctIdx: 1,
    hint: 'Samarqand saltanatning poytaxti sifatida obod qilinib, dunyo markaziga aylantirilgan.'
  },
  {
    text: 'Amir Temurning davlat boshqaruvi shiori nima bo‘lgan?',
    options: ['Kuch — qudratdadir', 'Kuch — adolatdadir', 'Ilm — najotdadir', 'Tinchlik — boylikdir'],
    correctIdx: 1,
    hint: 'Amir Temur davlatining bosh qoidasi: "Rosti-rasti" ya’ni "Kuch — adolatdadir".'
  },
  {
    text: 'Amir Temur qaysi yili va qayerda tavallud topgan?',
    options: ['1336-yil Kesh (Shahrisabz) yaqinidagi Xo‘ja Ilg‘or qishlog‘ida', '1340-yil Samarqandda', '1330-yil Buxoroda', '1345-yil Toshkentda'],
    correctIdx: 0,
    hint: 'Sohibqiron 1336-yil 9-aprelda Xo‘ja Ilg‘or qishlog‘ida tavallud topgan.'
  },
  {
    text: 'Amir Temurning harbiy san’atida lashkar necha qismga bo‘lingan?',
    options: ['3 qismga', '7 qismga (qol, barang‘ar, juvang‘ar va h.k.)', '2 qismga', '10 qismga'],
    correctIdx: 1,
    hint: 'Temur lashkari jangda 7 bo‘lakka bo‘linib, mislsiz taktika bilan harakat qilgan.'
  },
  {
    text: 'Amir Temur davlat boshqaruvi qonun-qoidalari bayon etilgan mashhur asar qaysi?',
    options: ['Zafarnoma', 'Temur tuzuklari', 'Tarixi Rashidiy', 'Boburnoma'],
    correctIdx: 1,
    hint: 'Davlat qonunlari va o‘gitlari "Temur tuzuklari" kitobida jamlangan.'
  },
  {
    text: 'Amir Temur davrida qurilgan Samarqanddagi ulug‘vor jome masjidi qaysi?',
    options: ['Kalon masjidi', 'Bibi Xonim masjidi', 'Hazrati Imom masjidi', 'Mag‘oki Attori'],
    correctIdx: 1,
    hint: 'Bibi Xonim jome masjidi o‘z davrining eng baland gumbazli inshooti bo‘lgan.'
  },
  {
    text: 'Amir Temur Yevropa davlatlaridan qaysi biri bilan elchilik va savdo aloqalarini o‘rnatgan?',
    options: ['Fransiya va Ispaniya (Kastiliya)', 'Avstriya', 'Shvetsiya', 'Daniya'],
    correctIdx: 0,
    hint: 'Ispaniya qiroli elchisi Rui Gonsales de Klavixo Samarqandga kelgan va kundalik yozgan.'
  },
  {
    text: 'Amir Temur qayerga harbiy yurish paytida vafot etgan?',
    options: ['Hindistonga', 'Xitoyga (O‘tror shahrida 1405-yil)', 'Oltin O‘rdaga', 'Usmoniylar davlatiga'],
    correctIdx: 1,
    hint: 'Sohibqiron 1405-yil fevralida O‘trorda vafot etgan.'
  },
  {
    text: 'Amir Temur me’morchiligining o‘ziga xos belgisi qaysi rangdagi koshinlar edi?',
    options: ['Qizil va sariq', 'Feruza (moviy) va zangori sirlangan koshinlar', 'Qora marmar', 'Kulrang tosh'],
    correctIdx: 1,
    hint: 'Temuriylar me’morchiligi feruza moviy gumbazlari bilan mashhur.'
  }
]);

// 10 Questions for English Lesson 1
export const eng1Questions = generateTenQuestions('les_eng_1', 'course_english_grammar', 'English Grammar', [
  {
    text: 'Which sentence correctly uses the Present Simple tense for a habit?',
    options: ['I am playing football every day.', 'I play football every day.', 'I was played football every day.', 'I plays football every day.'],
    correctIdx: 1,
    hint: 'For daily habits with the subject "I", use the base form of the verb without -ing or -s: "I play".'
  },
  {
    text: 'Choose the correct sentence in Present Continuous:',
    options: ['She writes a letter right now.', 'She is writing a letter right now.', 'She written a letter right now.', 'She was write a letter.'],
    correctIdx: 1,
    hint: 'Actions happening "right now" require the verb to be + verb-ing: "is writing".'
  },
  {
    text: 'Which of the following is a stative verb that is usually NOT used in continuous tenses?',
    options: ['Run', 'Know', 'Eat', 'Watch'],
    correctIdx: 1,
    hint: 'Verbs of cognition like "know", "believe", and "understand" are rarely used in continuous form.'
  },
  {
    text: 'Complete the sentence: "He _____ to school by bus every morning."',
    options: ['go', 'goes', 'going', 'is go'],
    correctIdx: 1,
    hint: 'With third-person singular (he/she/it) in Present Simple, add -s/-es to the verb: "goes".'
  },
  {
    text: 'What is the correct negative form: "They _____ like coffee."',
    options: ["doesn't", "don't", "aren't", "isn't"],
    correctIdx: 1,
    hint: 'With "they", use the auxiliary "do not" (don\'t).'
  },
  {
    text: 'Identify the time signal for Present Continuous:',
    options: ['Every Monday', 'Usually', 'At the moment', 'Yesterday'],
    correctIdx: 2,
    hint: '"At the moment" refers to an action occurring right now in continuous aspect.'
  },
  {
    text: 'Choose the correct question form: "_____ you speak English?"',
    options: ['Are', 'Do', 'Does', 'Have'],
    correctIdx: 1,
    hint: 'In Present Simple questions with "you", use the auxiliary verb "Do".'
  },
  {
    text: 'Complete: "Listen! The birds _____ sweetly in the trees."',
    options: ['sing', 'are singing', 'sang', 'sings'],
    correctIdx: 1,
    hint: 'The exclamation "Listen!" signals an action occurring at the time of speaking (are singing).'
  },
  {
    text: 'Which sentence has a spelling error in third person singular?',
    options: ['He watches', 'She studys', 'He goes', 'She plays'],
    correctIdx: 1,
    hint: 'Consonant + y changes to -ies: "studies", not "studys".'
  },
  {
    text: 'Choose the correct form: "Water _____ at 100 degrees Celsius."',
    options: ['boil', 'boils', 'is boiling', 'boiled'],
    correctIdx: 1,
    hint: 'Scientific facts and general truths always take Present Simple (boils).'
  }
]);

// 10 Questions for Python Lesson 4
export const py4Questions = generateTenQuestions('les_py_4', 'course_python', 'Sikllar', [
  { text: 'for sikli Python-da asosan qanday maqsadlarda qo‘llaniladi?', options: ['Faqat kiritishda', 'Ketma-ketlik elementlarini birma-bir takrorlab o‘tishda', 'Fayllarni o‘chirishda', 'Faqat shart tekshirishda'], correctIdx: 1, hint: 'for sikli list, string, range kabi obyektlar bo‘ylab iteratsiya qiladi.' },
  { text: 'range(3) qanday sonlar to‘plamini beradi?', options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3'], correctIdx: 1, hint: 'range(n) 0 dan boshlanib n-1 gacha davom etadi.' },
  { text: 'while siklining for siklidan asosiy farqi nimada?', options: ['while faqat sonlar bilan ishlaydi', 'while shart qanoatlantirilguncha noma’lum marta takrorlanadi', 'Farqi yo‘q', 'for tezroq ishlaydi'], correctIdx: 1, hint: 'while mantiqiy ifoda True bo‘lib turguniga qadar aylanadi.' },
  { text: 'Siklda break buyrug‘i nima qiladi?', options: ['Keyingi qadamga o‘tkazadi', 'Sikldan butunlay chiqib ketadi', 'Dasturni to‘xtatadi', 'Xatolik beradi'], correctIdx: 1, hint: 'break sikl ijrosini majburan yakunlaydi.' },
  { text: 'continue operatori bajarilganda nima sodir bo‘ladi?', options: ['Sikl to‘xtaydi', 'Joriy iteratsiya o‘tkazib yuborilib, navbatdagi qadamga o‘tiladi', 'Kodni qayta boshlaydi', 'Chiqish beradi'], correctIdx: 1, hint: 'continue sikl tanasining qolgan qismini tashlab keyingi qadamga o‘tadi.' },
  { text: 'range(2, 10, 2) qadamida qanday sonlar chiqadi?', options: ['2, 4, 6, 8, 10', '2, 4, 6, 8', '2, 3, 4, 5', '10 gacha toq sonlar'], correctIdx: 1, hint: '3-parametr qadam (step) bo‘lib, oxirgi 10 soni kirmaydi: 2, 4, 6, 8.' },
  { text: 'Cheksiz (infinite) sikl qanday hosil bo‘ladi?', options: ['for i in range(10):', 'while True:', 'if True:', 'while False:'], correctIdx: 1, hint: 'while True sharti hech qachon False bo‘lmaydi, break bo‘lmasa abadiy aylanadi.' },
  { text: 'Sikl ichida yozilgan else bloki qachon ishlaydi?', options: ['Hech qachon', 'Sikl break-siz tabiiy tugagach', 'Faqat xatolik chiqqanda', 'Birinchi qadamda'], correctIdx: 1, hint: 'Python-da sikl else-i sikl to‘liq aylanib tugasa bajariladi.' },
  { text: 'Satr (string) harflarini birma-bir ekranga chiqarish uchun qaysi sikl qulay?', options: ['for char in text:', 'while text:', 'switch(text)', 'loop(text)'], correctIdx: 0, hint: 'for sikli satrning har bir belgisini qulay aylanib chiqadi.' },
  { text: 'Quyidagi kod necha marta aylanadi: for i in range(5, 5)?', options: ['5 marta', '0 marta (aylanmaydi)', '1 marta', 'Xatolik'], correctIdx: 1, hint: 'Boshlanish va tugash teng bo‘lsa, diapazon bo‘sh bo‘ladi.' }
]);

// 10 Questions for History Lesson 2
export const hist2Questions = generateTenQuestions('les_hist_2', 'course_history_temur', 'Temur Tuzuklari', [
  { text: '“Temur tuzuklari” asari necha qismdan iborat?', options: ['1 qismdan', '2 qismdan (tarjimai hol va davlat boshqaruvi)', '3 qismdan', '5 qismdan'], correctIdx: 1, hint: 'Asar ikki asosiy qismdan: o‘z hayoti va davlatni idora qilish qoidalaridan iborat.' },
  { text: 'Amir Temur davlat boshqaruvida nechta toifa kishilarga tayangan?', options: ['7 toifa', '12 toifa', '10 toifa', '4 toifa'], correctIdx: 1, hint: 'Tuzuklarda davlat ustunini tashkil etuvchi 12 toifa kishilar sanab o‘tilgan.' },
  { text: 'Amir Temur davlatida moliya va soliq ishlarini kimlar nazorat qilgan?', options: ['Lashkarboshilar', 'Devonbegi va vazirlar', 'Qozilar', 'Elchilar'], correctIdx: 1, hint: 'Markaziy devonda moliya, soliq va xazina vazirliklari faoliyat yuritgan.' },
  { text: 'Temur tuzuklarida sipohiylar maoshi qanday belgilangan?', options: ['Faqat o‘lja hisobidan', 'Martabasi, ot-yarog‘i va xizmatiga qarab davlat xazinasidan', 'Ixtiyoriy', 'Har yili bir marta'], correctIdx: 1, hint: 'Harbiy xizmatchilar doimiy xazinadan ot va qurol-aslahalari bilan ta’minlangan.' },
  { text: 'Amir Temur qaysi jazo turiga qarshi bo‘lgan va adolatni ustun qo‘ygan?', options: ['Jarima solish', 'Noo‘rin qon to‘kish va asossiz jazolash', 'Surgun qilish', 'Xizmatdan bo‘shatish'], correctIdx: 1, hint: 'Amir Temur: "Bir begunoh kishini nohaq jazolagandan ko‘ra, o‘nlab gunohkorni kechirgan ma’qul" deb hisoblagan.' },
  { text: 'Temur tuzuklarida vazirlar qanday fazilatlarga ega bo‘lishi talab etilgan?', options: ['Boylik va nasl-nasab', 'Asllik, tozalik, aql-idrok va hushyorlik', 'Faqat yoshlik', 'Chet tilini bilish'], correctIdx: 1, hint: 'Tuzuklarda vazir uchun 4 fazilat: asllik, zakovat, lashkar va raiyat holidan xabardorlik shart qilingan.' },
  { text: 'Amir Temur qo‘shinida o‘n kishilik bo‘linma boshlig‘i nima deb atalgan?', options: ['Yuzboshi', 'O‘nboshi', 'Mingboshi', 'Tumanboshi'], correctIdx: 1, hint: 'O‘nlik tizimi: o‘nboshi, yuzboshi, mingboshi va amir (tumanboshi).' },
  { text: 'Temuriylar davrida qozilik (sud) tizimi necha yo‘nalishda bo‘lgan?', options: ['Faqat bitta', 'Shariat qozisi va harbiy qozi (qoziyi askar)', 'Uchta', 'Xalq sudi'], correctIdx: 1, hint: 'Fuqarolik ishlari shariat qozisi, qo‘shin ishlari esa harbiy qozi ixtiyorida bo‘lgan.' },
  { text: 'Amir Temur saltanatida qaysi savdo yo‘li eng xavfsiz va gullagan davrga kirdi?', options: ['Yantar yo‘li', 'Buyuk Ipak Yo‘li', 'Lojuvard yo‘li', 'Shimoliy dengiz yo‘li'], correctIdx: 1, hint: 'Buyuk Ipak Yo‘li bo‘ylab karvonsaroylar qurilib, xavfsizlik to‘liq kafolatlangan.' },
  { text: '“Yuz ming otliq askar qila olmagan ishni bir to‘g‘ri tadbir bilan bitirish mumkin” o‘giti kimga tegishli?', options: ['Chingizxonga', 'Amir Temurga', 'Iskandar Zulqarnaynga', 'Mirzo Ulug‘bekka'], correctIdx: 1, hint: 'Bu purma’no so‘zlar "Temur tuzuklari"ning asosiy g‘oyalaridan biridir.' }
]);

// 10 Questions for History Lesson 3 & 4
export const hist3Questions = generateTenQuestions('les_hist_3', 'course_history_temur', 'Jaloliddin Manguberdi', [
  { text: 'Jaloliddin Manguberdi qaysi davlatning so‘nggi hukmdori va milliy qahramoni?', options: ['Somoniylar', 'Xorazmshohlar davlati', 'Qoraxoniylar', 'G‘aznaviylar'], correctIdx: 1, hint: 'Jaloliddin Anushteginiylar sulolasidan bo‘lgan Xorazmshohlar hukmdoridir.' },
  { text: '1221-yilda Jaloliddin mo‘g‘ul qo‘shinlarini qaysi mashhur jangda tor-mor etgan?', options: ['Parvon jangi', 'Kulikov jangi', 'Katvan jangi', 'Balx jangi'], correctIdx: 0, hint: 'Parvon jangi mo‘g‘ullarning yengilmaslik afsonasiga birinchi kuchli zarba bo‘lgan.' },
  { text: 'Sind daryosi bo‘yidagi jangda Jaloliddinning jasoratiga kim tan bergan?', options: ['Botuxon', 'Chingizxon', 'Jo‘chixon', 'Chig‘atoy'], correctIdx: 1, hint: 'Chingizxon o‘z o‘g‘illariga qarab: "Otaning shunday o‘g‘li bo‘lishi lozim!" deya tan bergan.' },
  { text: 'Jaloliddin Manguberdi tavalludining 800 yilligi O‘zbekistonda qaysi yili keng nishonlandi?', options: ['1991-yil', '1999-yil', '2005-yil', '2015-yil'], correctIdx: 1, hint: '1999-yilda Xorazmda Jaloliddin Manguberdi yubileyi nishonlanib, orden ta’sis etildi.' },
  { text: 'O‘zbekiston Respublikasida harbiy xizmatchilar uchun qaysi yuksak orden ta’sis etilgan?', options: ['Do‘stlik ordeni', 'Jaloliddin Manguberdi ordeni', 'Amir Temur ordeni', 'Shon-sharaf'], correctIdx: 1, hint: 'Jaloliddin Manguberdi ordeni Vatan sarhadlarini qo‘riqlashdagi jasorat uchun beriladi.' },
  { text: 'Jaloliddin Manguberdining asosiy maqsadi nima edi?', options: ['Yangi yerlar zabt etish', 'Vatanni mo‘g‘ul istilosidan ozod etish va davlatchilikni tiklash', 'Boylik orttirish', 'Yevropaga yurish'], correctIdx: 1, hint: 'U umrining oxirigacha vatan mustaqilligi va ozodligi uchun kurashdi.' },
  { text: 'Jaloliddin qo‘shini tarkibida qaysi mashhur sarkardalar qatnashgan?', options: ['Temur Malik va Sayfiddin Ig‘roq', 'Alp Er To‘nga', 'Qutayba ibn Muslim', 'Abu Muslim'], correctIdx: 0, hint: 'Xo‘jand mudofaasi qahramoni Temur Malik Jaloliddinning eng yaqin safdoshi bo‘lgan.' },
  { text: 'Parvon jangi qaysi hududda bo‘lib o‘tgan?', options: ['Samarqand yaqinida', 'Hozirgi Afg‘oniston hududidagi Parvon darasida', 'Xorazmda', 'Marvda'], correctIdx: 1, hint: 'Parvon Kobul yaqinidagi tog‘li vodiy hisoblanadi.' },
  { text: 'Mo‘g‘ullar istilosi paytida O‘tror mudofaasi necha oy davom etgan?', options: ['1 oy', '6 oy (Qayirxon boshchiligida)', '3 oy', '1 yil'], correctIdx: 1, hint: 'O‘tror shahri aholisi 6 oy davomida mardona qarshilik ko‘rsatgan.' },
  { text: 'Jaloliddin Manguberdining vatanparvarlik fazilati yoshlar uchun qanday ibrat maktabi?', options: ['Tinchlikni mensimaslik', 'Vatanga fidoyilik, metin iroda va qat’iyat timsoli', 'Faqat jismoniy kuch', 'Ortga chekinish'], correctIdx: 1, hint: 'Jaloliddin nomi o‘zbek harbiy an’analarida qahramonlik ramzidir.' }
]);

export const hist4Questions = generateTenQuestions('les_hist_4', 'course_history_temur', 'Temuriylar Renessansi', [
  { text: 'Mirzo Ulug‘bek Samarqandda nechanchi yili mashhur rasadxona qurdirdi?', options: ['1410-yil', '1424-1428-yillarda', '1450-yil', '1400-yil'], correctIdx: 1, hint: 'Ulug‘bek rasadxonasi 1420-yillarda Kohak tepaligida bunyod etilgan.' },
  { text: 'Ulug‘bekning 1018 ta yulduz harakati kiritilgan fundamental asari qaysi?', options: ['Ziji Ko‘ragoniy (Yulduzlar jadvali)', 'Al-Qonun', 'Hindiston', 'Surat ul-arz'], correctIdx: 0, hint: 'Ziji jadvali jahon astronomiyasida asrlar davomida eng aniq manba bo‘lgan.' },
  { text: 'O‘zbek adabiy tilining asoschisi va buyuk mutafakkir kim?', options: ['Lutfiy', 'Alisher Navoiy', 'Bobur', 'Atoiy'], correctIdx: 1, hint: 'Nizomiddin Mir Alisher Navoiy turkiy tilning cheksiz qudratini isbotlagan.' },
  { text: 'Alisher Navoiyning besh buyuk dostondan iborat durdona asari nima deb ataladi?', options: ['Devon', 'Xamsa (Beshlik)', 'Chor devon', 'Mahbub ul-qulub'], correctIdx: 1, hint: 'Xamsa turkiy tilda yaratilgan birinchi beshlik dostonlar majmuidir.' },
  { text: 'Zahiriddin Muhammad Boburning dunyo adabiyotiga kirgan mashhur qomusiy asari qaysi?', options: ['Boburnoma', 'Xatti Boburiy', 'Mubayyin', 'Aruz risolasi'], correctIdx: 0, hint: 'Boburnoma tarixiy, jug‘rofiy va memuar asar sifatida bebahodir.' },
  { text: 'Temuriylar davri miniatyura san’atining “Sharq Rafaeli” deb tan olingan dahosi kim?', options: ['Kamoliddin Behzod', 'Mahmud Muzahhib', 'Qosim Ali', 'Shoh Muzaffar'], correctIdx: 0, hint: 'Kamoliddin Behzod Hirot miniatyura maktabining eng yetuk namoyondasidir.' },
  { text: 'Mirzo Ulug‘bek barpo ettirgan madrasalar qaysi shaharlarda joylashgan?', options: ['Faqat Samarqandda', 'Buxoro, Samarqand va G‘ijduvonda', 'Xiva va Toshkentda', 'Qo‘qonda'], correctIdx: 1, hint: 'Ulug‘bek Samarqand Registonida, Buxoro va G‘ijduvonda muhtasham madrasalar qurdirgan.' },
  { text: '“Bilim olish har bir musulmon erkak va ayol uchun farzdir” hadisi qaysi madrasa peshtoqiga yozilgan?', options: ['Tillakori madrasasi', 'Ulug‘bekning Buxorodagi madrasasiga', 'Ko‘kaldosh madrasasi', 'Mir Arab'], correctIdx: 1, hint: 'Bu yozuv Buxorodagi Ulug‘bek madrasasi darvozasiga o‘yib yozilgan.' },
  { text: 'Alisher Navoiy qaysi temuriy hukmdor bilan do‘st va vazir bo‘lgan?', options: ['Shohrux Mirzo', 'Husayn Boyqaro', 'Abu Said', 'Xalil Sulton'], correctIdx: 1, hint: 'Navoiy va Husayn Boyqaro maktabdosh do‘st bo‘lib, Hirotni madaniyat poytaxtiga aylantirgan.' },
  { text: 'Temuriylar me’morchiligida koshinlar uchun asosan qaysi ranglar uyg‘unligi qo‘llangan?', options: ['Kulrang va oq', 'Moviy, feruza va zarhal naqshlar', 'Faqat qizil', 'Sariq va qora'], correctIdx: 1, hint: 'Samarqandning moviy gumbazlari va sirlangan koshinlari shundan dalolat beradi.' }
]);

// 10 Questions for English Lesson 2, 3, 4
export const eng2Questions = generateTenQuestions('les_eng_2', 'course_english_grammar', 'Past Simple', [
  { text: 'Which sentence is in the correct Past Simple form?', options: ['I go to school yesterday.', 'I went to school yesterday.', 'I was go to school yesterday.', 'I am going to school.'], correctIdx: 1, hint: 'The past form of the irregular verb "go" is "went".' },
  { text: 'What is the past simple of the regular verb "play"?', options: ['Plaid', 'Played', 'Playied', 'Playd'], correctIdx: 1, hint: 'Regular verbs ending in vowel + y simply take -ed: "played".' },
  { text: 'Choose the correct negative sentence in Past Simple:', options: ['He didn\'t saw the movie.', 'He didn\'t see the movie.', 'He doesn\'t saw the movie.', 'He not saw the movie.'], correctIdx: 1, hint: 'After "didn\'t", always use the base form of the main verb: "didn\'t see".' },
  { text: 'Complete the question: "_____ you finish your homework last night?"', options: ['Do', 'Did', 'Were', 'Have'], correctIdx: 1, hint: 'Questions in Past Simple use the auxiliary verb "Did".' },
  { text: 'Which of the following is an irregular verb?', options: ['Watch', 'Visit', 'Buy (bought)', 'Cook'], correctIdx: 2, hint: '"Buy" changes completely to "bought".' },
  { text: 'What is the past simple of "write"?', options: ['Writed', 'Wrote', 'Written', 'Writing'], correctIdx: 1, hint: 'The second form of write is "wrote".' },
  { text: 'Identify the time expression used with Past Simple:', options: ['Tomorrow', 'Yesterday', 'Right now', 'Always'], correctIdx: 1, hint: '"Yesterday" denotes a completed event in the past.' },
  { text: 'Correct the sentence: "She was happy when she _____ the news."', options: ['hear', 'heard', 'heared', 'is hearing'], correctIdx: 1, hint: 'The past tense of hear is "heard".' },
  { text: 'Choose the correct form of to be in the past: "They _____ at the litsey yesterday."', options: ['was', 'were', 'are', 'been'], correctIdx: 1, hint: 'With plural subjects like "they", use "were".' },
  { text: 'What did you do two days ago? (Choose grammatically correct response)', options: ['I study English.', 'I studied English.', 'I am studied English.', 'I was study English.'], correctIdx: 1, hint: '"I studied" correctly uses the past simple form.' }
]);

export const eng3Questions = generateTenQuestions('les_eng_3', 'course_english_grammar', 'Everyday English', [
  { text: 'What is the polite way to ask for assistance in English?', options: ['Help me now!', 'Could you please help me with this?', 'You must help!', 'Give me hand!'], correctIdx: 1, hint: '"Could you please..." is universally polite and professional.' },
  { text: 'How do you respond when someone says "Thank you very much"?', options: ['No problem / You\'re welcome', 'Never mind', 'What?', 'Yes, of course you do'], correctIdx: 0, hint: '"You\'re welcome" or "No problem" is the natural standard response.' },
  { text: 'Which phrase is used to introduce yourself professionally?', options: ['I am called ...', 'Hello, my name is ... and I am a student here.', 'Me is ...', 'Who am I'], correctIdx: 1, hint: '"Hello, my name is..." is clear and grammatically formal.' },
  { text: 'What do you say when you accidentally bump into someone?', options: ['Excuse me / I am so sorry!', 'Look out!', 'Whatever', 'It was you'], correctIdx: 0, hint: '"Excuse me" or "I\'m sorry" expresses immediate courtesy.' },
  { text: 'Choose the correct phrase to agree with someone\'s opinion:', options: ['I am agree with you.', 'I completely agree with you.', 'I agreeable.', 'I agree you.'], correctIdx: 1, hint: 'In English "agree" is a verb: "I agree", never "I am agree".' },
  { text: 'How do you ask for clarification when you didn\'t catch what was said?', options: ['What do you want?', 'Could you repeat that more slowly, please?', 'Speak louder!', 'Say it again fast'], correctIdx: 1, hint: '"Could you repeat that, please?" is courteous and effective.' },
  { text: 'Which word connects contrasting ideas in a sentence?', options: ['Because', 'However / Although', 'Therefore', 'And'], correctIdx: 1, hint: '"However" indicates contrast between two thoughts.' },
  { text: 'What is the appropriate greeting at 9:00 AM?', options: ['Good evening', 'Good morning', 'Good night', 'Good afternoon'], correctIdx: 1, hint: 'Morning greetings apply until midday (12:00 PM).' },
  { text: 'Choose the correct phone call phrase to ask who is speaking:', options: ['Who are you?', 'May I ask who is calling, please?', 'Tell me your name', 'Speak now'], correctIdx: 1, hint: '"May I ask who is calling?" is polite telephone etiquette.' },
  { text: 'How do you express a preference between two choices?', options: ['I prefer coffee rather than tea.', 'I prefer coffee to tea.', 'I like coffee more high than tea.', 'Coffee is my prefer.'], correctIdx: 1, hint: 'The standard English preposition with prefer is "to": "prefer X to Y".' }
]);

export const eng4Questions = generateTenQuestions('les_eng_4', 'course_english_grammar', 'Future & Modals', [
  { text: 'Which modal verb expresses strong obligation or necessity?', options: ['Might', 'Must / Have to', 'Could', 'May'], correctIdx: 1, hint: '"Must" indicates strong obligation or rule.' },
  { text: 'Complete: "You _____ wear a seatbelt while driving. It is the law."', options: ['might', 'must', 'can', 'could'], correctIdx: 1, hint: 'Legal obligations require "must".' },
  { text: 'Choose the sentence that shows a planned future intention:', options: ['I will probably go.', 'I am going to visit my grandparents this weekend.', 'I visit tomorrow.', 'I was going.'], correctIdx: 1, hint: '"be going to" expresses prior plans and intentions.' },
  { text: 'Which sentence correctly gives advice to a friend?', options: ['You should study regularly for the exam.', 'You must to study.', 'You can to study.', 'You ought study.'], correctIdx: 0, hint: '"Should" followed by base verb offers advice.' },
  { text: 'What modal verb expresses ability in the present?', options: ['Can', 'Must', 'Should', 'Might'], correctIdx: 0, hint: '"Can" denotes physical or mental ability in the present.' },
  { text: 'Complete: "Look at those dark clouds! It _____ rain soon."', options: ['will to', 'is going to', 'shall to', 'was'], correctIdx: 1, hint: 'Predictions based on present evidence use "is going to".' },
  { text: 'Which modal verb expresses polite permission?', options: ['May I come in?', 'Must I come in?', 'Will I come in?', 'Should I come in?'], correctIdx: 0, hint: '"May I...?" is standard formal permission.' },
  { text: 'Complete: "If you want to pass, you _____ practice speaking every day."', options: ['need to', 'must to', 'should to', 'can to'], correctIdx: 0, hint: '"need to" takes a full infinitive with to.' },
  { text: 'What is the negative form of "can"?', options: ['Cannot / Can\'t', 'Don\'t can', 'Not can', 'Cann\'t'], correctIdx: 0, hint: '"Cannot" is written as a single word or contracted as "can\'t".' },
  { text: 'Choose the correct spontaneous decision in future:', options: ['The phone is ringing. I will answer it!', 'I am answering it yesterday.', 'I answer it.', 'I was answered.'], correctIdx: 0, hint: 'Spontaneous decisions made at the moment of speaking use "will".' }
]);

// 10 Questions for Math Lessons 1, 2, 3, 4
export const math1Questions = generateTenQuestions('les_math_1', 'course_math_logic', 'Kvadrat Tenglamalar', [
  { text: 'ax² + bx + c = 0 kvadrat tenglamasining diskriminanti qaysi formula bilan topiladi?', options: ['D = b² - 4ac', 'D = b² + 4ac', 'D = 2a - 4bc', 'D = b - 4ac'], correctIdx: 0, hint: 'Diskriminant formulasi: D = b² - 4ac.' },
  { text: 'Agar kvadrat tenglamada D > 0 bo‘lsa, u nechta haqiqiy ildizga ega?', options: ['Ildizi yo‘q', '1 ta karrali ildiz', '2 ta turli haqiqiy ildiz', 'Cheksiz ko‘p'], correctIdx: 2, hint: 'D > 0 bo‘lganda ikkita har xil haqiqiy ildiz mavjud bo‘ladi.' },
  { text: 'Viyet teoremasiga ko‘ra, keltirilgan x² + px + q = 0 tenglama ildizlari yig‘indisi nimaga teng?', options: ['x₁ + x₂ = q', 'x₁ + x₂ = -p', 'x₁ + x₂ = p', 'x₁ + x₂ = -q'], correctIdx: 1, hint: 'Ildizlar yig‘indisi qarama-qarshi ishora bilan olingan ikkinchi koeffitsiyentga (-p) teng.' },
  { text: 'x² - 7x + 12 = 0 tenglamaning ildizlarini Viyet teoremasi bilan toping:', options: ['x₁ = 2, x₂ = 6', 'x₁ = 3, x₂ = 4', 'x₁ = -3, x₂ = -4', 'x₁ = 1, x₂ = 12'], correctIdx: 1, hint: '3 + 4 = 7 va 3 * 4 = 12. Demak ildizlar 3 va 4.' },
  { text: 'Agar D = 0 bo‘lsa, kvadrat tenglama ildizlari qanday bo‘ladi?', options: ['Ildizga ega emas', 'Ikkita teng (bitta karrali) ildiz: x = -b / (2a)', 'Musbat ildizlar', 'Ixtiyoriy son'], correctIdx: 1, hint: 'D = 0 bo‘lganda x₁ = x₂ = -b / (2a).' },
  { text: 'x² - 25 = 0 chala kvadrat tenglamaning ildizlari nechaga teng?', options: ['5 faqat', '-5 va 5', '25 faqat', '0 va 5'], correctIdx: 1, hint: 'x² = 25 bo‘lib, x = ±5 bo‘ladi.' },
  { text: '2x² - 8x = 0 tenglamaning ildizlarini toping:', options: ['x₁ = 0, x₂ = 4', 'x₁ = 2, x₂ = 4', 'x₁ = 0, x₂ = -4', 'x₁ = 4 faqat'], correctIdx: 0, hint: '2x(x - 4) = 0 dan x₁ = 0 va x₂ = 4 kelib chiqadi.' },
  { text: 'Agar D < 0 bo‘lsa, kvadrat tenglama haqiqiy sonlar to‘plamida nechta ildizga ega?', options: ['2 ta', '1 ta', 'Haqiqiy ildizga ega emas (0 ta)', '3 ta'], correctIdx: 2, hint: 'Manfiy sondan haqiqiy kvadrat ildiz chiqmaydi, shuning uchun haqiqiy ildiz yo‘q.' },
  { text: 'x² + 5x + 6 = 0 tenglama ildizlari ko‘paytmasi nimaga teng?', options: ['-5', '6', '-6', '5'], correctIdx: 1, hint: 'Viyet teoremasiga ko‘ra ildizlar ko‘paytmasi ozod hadga (q = 6) teng.' },
  { text: 'Kvadrat tenglamada bosh koeffitsiyent a nolga teng bo‘lishi mumkinmi?', options: ['Ha, mumkin', 'Yo‘q, agar a = 0 bo‘lsa chiziqli tenglamaga aylanadi', 'Faqat x = 0 bo‘lganda', 'Ixtiyoriy'], correctIdx: 1, hint: 'Kvadrat tenglama bo‘lishi uchun a ≠ 0 sharti majburiydir.' }
]);

export const math2Questions = generateTenQuestions('les_math_2', 'course_math_logic', 'Kombinatorika', [
  { text: 'Kombinatorikaning ko‘paytirish qoidasiga ko‘ra, 3 xil ko‘ylak va 4 xil shimdan necha xil kiyinish to‘plami tuzish mumkin?', options: ['7 xil', '12 xil (3 * 4)', '1 xil', '10 xil'], correctIdx: 1, hint: 'Mustaqil tanlovlar soni ko‘paytiriladi: 3 * 4 = 12.' },
  { text: '4 ta turli kitobni javonga necha xil ketma-ketlikda terib qo‘yish mumkin (4!)?', options: ['16 xil', '24 xil (4 * 3 * 2 * 1)', '10 xil', '8 xil'], correctIdx: 1, hint: 'Permutatsiya P₄ = 4! = 24.' },
  { text: '0! (nol faktorial) qiymati nechaga teng deb qabul qilingan?', options: ['0', '1', 'Aniqlanmagan', '-1'], correctIdx: 1, hint: 'Kombinatorikada 0! = 1 deb ta’riflangan.' },
  { text: '5 nafar o‘quvchidan 2 nafar navbatchini tanlab olish usullari soni (C⁵₂)?', options: ['10 xil', '20 xil', '25 xil', '7 xil'], correctIdx: 0, hint: 'Kombinatsiya formulasi: C⁵₂ = (5 * 4) / (2 * 1) = 10.' },
  { text: 'Tanga bir marta tashlanganda "gerb" tomoni tushish ehtimoli qancha?', options: ['1', '0.5 (1/2 yoki 50%)', '0', '0.25'], correctIdx: 1, hint: '2 ta teng imkoniyatli natijadan 1 tasi gerb: 1/2.' },
  { text: 'O‘yin zori (kubik) tashlanganda 6 raqami tushish ehtimoli qancha?', options: ['1/2', '1/6', '1/3', '6'], correctIdx: 1, hint: 'Kubikda 6 ta yoq bor, qulay hodisa 1 ta: 1/6.' },
  { text: '1, 2, 3 raqamlaridan raqamlari takrorlanmaydigan nechta 3 xonali son tuzish mumkin?', options: ['3 ta', '6 ta (3!)', '9 ta', '27 ta'], correctIdx: 1, hint: '3 * 2 * 1 = 6 ta son tuzish mumkin.' },
  { text: 'Muqarrar (aniq sodir bo‘ladigan) hodisaning ehtimolligi nechaga teng?', options: ['0', '1', '100', '0.5'], correctIdx: 1, hint: 'Muqarrar hodisa ehtimoli har doim 1 ga teng.' },
  { text: 'Mumkin bo‘lmagan hodisaning ehtimolligi nechaga teng?', options: ['1', '0', '-1', '0.1'], correctIdx: 1, hint: 'Amalga oshishi mutlaqo imkonsiz hodisa ehtimoli 0 ga teng.' },
  { text: 'Guruhda 10 ta o‘g‘il va 15 ta qiz bola bor. Tasodifan tanlangan bitta o‘quvchi qiz bola bo‘lish ehtimoli qancha?', options: ['15/10', '15/25 (3/5 yoki 0.6)', '10/25', '1/2'], correctIdx: 1, hint: 'Jami 25 o‘quvchi, qizlar 15 ta: 15/25 = 0.6.' }
]);

export const math3Questions = generateTenQuestions('les_math_3', 'course_math_logic', 'Geometriya', [
  { text: 'To‘g‘ri burchakli uchburchakda gipotenuza va katetlar o‘rtasidagi bog‘lanish qaysi teorema?', options: ['Fales teoremasi', 'Pifagor teoremasi: c² = a² + b²', 'Kosinuslar teoremasi', 'Viyet teoremasi'], correctIdx: 1, hint: 'Pifagor teoremasi: gipotenuza kvadrati katetlar kvadratlari yig‘indisiga teng.' },
  { text: 'Katetlari 3 sm va 4 sm bo‘lgan to‘g‘ri burchakli uchburchakning gipotenuzasi necha sm?', options: ['7 sm', '5 sm (Misr uchburchagi)', '6 sm', '12 sm'], correctIdx: 1, hint: '3² + 4² = 9 + 16 = 25, √25 = 5 sm.' },
  { text: 'Asosi a va balandligi h bo‘lgan uchburchak yuzi qaysi formula bilan hisoblanadi?', options: ['S = a * h', 'S = (1/2) * a * h', 'S = 2 * a * h', 'S = a + h'], correctIdx: 1, hint: 'Uchburchak yuzi asosining yarmisi bilan balandligi ko‘paytmasiga teng.' },
  { text: 'Kvadratning tomoni 6 sm bo‘lsa, uning yuzi nechaga teng?', options: ['24 sm²', '36 sm²', '12 sm²', '18 sm²'], correctIdx: 1, hint: 'S = a² = 6 * 6 = 36 sm².' },
  { text: 'Doira yuzini hisoblash formulasi qaysi?', options: ['S = 2πR', 'S = πR²', 'S = πd', 'S = 4πR'], correctIdx: 1, hint: 'Doira yuzi radiusi kvadratining π soni bilan ko‘paytmasiga teng.' },
  { text: 'Uchburchak ichki burchaklari yig‘indisi har doim necha gradusga teng?', options: ['360°', '180°', '90°', '270°'], correctIdx: 1, hint: 'Tekislikdagi ixtiyoriy uchburchak ichki burchaklari yig‘indisi 180°.' },
  { text: 'To‘g‘ri to‘rtburchakning bo‘yi 8 sm, eni 5 sm bo‘lsa, uning perimetri nechaga teng?', options: ['40 sm', '26 sm (2 * (8 + 5))', '13 sm', '30 sm'], correctIdx: 1, hint: 'P = 2 * (a + b) = 2 * 13 = 26 sm.' },
  { text: 'Katetlari 6 va 8 bo‘lgan to‘g‘ri burchakli uchburchak yuzi nechaga teng?', options: ['48', '24 ( (6 * 8) / 2 )', '14', '10'], correctIdx: 1, hint: 'S = (a * b) / 2 = 48 / 2 = 24.' },
  { text: 'Teng tomonli uchburchakning har bir ichki burchagi necha gradusdan bo‘ladi?', options: ['90°', '60°', '45°', '120°'], correctIdx: 1, hint: '180° / 3 = 60°.' },
  { text: 'Doiraning radiusi 5 sm bo‘lsa, uning diametri necha sm bo‘ladi?', options: ['2.5 sm', '10 sm (2 * R)', '25 sm', '15 sm'], correctIdx: 1, hint: 'Diametr radiusdan 2 barobar katta: d = 2R = 10 sm.' }
]);

export const math4Questions = generateTenQuestions('les_math_4', 'course_math_logic', 'Funksiyalar va Grafiklar', [
  { text: 'y = kx + b chiziqli funksiyasining grafigi qanday chiziqdan iborat?', options: ['Parabola', 'To‘g‘ri chiziq', 'Giperbola', 'Aylana'], correctIdx: 1, hint: 'Chiziqli funksiya grafigi tekislikdagi to‘g‘ri chiziqdir.' },
  { text: 'y = kx + b formulasida k koeffitsiyenti nima deb ataladi?', options: ['Ozod had', 'Burchak koeffitsiyenti (og‘ish burchagi)', 'Ildiz', 'Argument'], correctIdx: 1, hint: 'k to‘g‘ri chiziqning Ox o‘qiga og‘ish burchagi tangensidir.' },
  { text: 'y = 2x - 4 to‘g‘ri chizig‘i Oy o‘qini qaysi nuqtada kesib o‘tadi (x = 0)?', options: ['(0, 2)', '(0, -4)', '(2, 0)', '(0, 4)'], correctIdx: 1, hint: 'x = 0 bo‘lganda y = -4 bo‘ladi: (0, -4).' },
  { text: 'y = x² kvadratik funksiyasining grafigi nima deb ataladi?', options: ['Giperbola', 'Parabola', 'To‘g‘ri chiziq', 'Ellips'], correctIdx: 1, hint: 'Kvadratik funksiya grafigi uchi koordinata boshida bo‘lgan parabola.' },
  { text: '2x + 6 > 10 tengsizlikning yechimi qaysi oraliq bo‘ladi?', options: ['x > 8', 'x > 2 (2x > 4)', 'x < 2', 'x > 4'], correctIdx: 1, hint: '2x > 4 dan x > 2 kelib chiqadi.' },
  { text: 'Agar chiziqli funksiyada k > 0 bo‘lsa, funksiya qanday xarakterga ega?', options: ['Kamayuvchi', 'O‘suvchi', 'O‘zgarmas', 'Davriy'], correctIdx: 1, hint: 'Burchak koeffitsiyenti musbat bo‘lsa funksiya doimiy o‘suvchidir.' },
  { text: 'Funksiyaning aniqlanish sohasi (D(f)) nima?', options: ['y qabul qiladigan qiymatlar', 'x (argument) qabul qilishi mumkin bo‘lgan barcha qiymatlar', 'Faqat musbat sonlar', 'Faqat butun sonlar'], correctIdx: 1, hint: 'Aniqlanish sohasi argument x ning joiz qiymatlari to‘plamidir.' },
  { text: 'y = 1 / x funksiyasining grafigi nima deb ataladi?', options: ['Parabola', 'Giperbola', 'To‘g‘ri chiziq', 'Sinusoida'], correctIdx: 1, hint: 'Teskari proporsionallik grafigi giperbola bo‘ladi.' },
  { text: '-3x ≤ 9 tengsizlikni yechganda ishora qanday o‘zgaradi?', options: ['O‘zgarmaydi', 'Manfiy songa bo‘lganda qarama-qarshisiga o‘zgaradi: x ≥ -3', 'Nolga aylanadi', 'Musbat bo‘ladi'], correctIdx: 1, hint: 'Tengsizlik ikkala tomonini manfiy songa bo‘lganda ishora teskarisiga o‘zgaradi.' },
  { text: 'y = 5 o‘zgarmas funksiyasining grafigi qanday joylashadi?', options: ['Ox o‘qiga parallel to‘g‘ri chiziq', 'Oy o‘qiga parallel', 'Koordinata boshidan o‘tadi', 'Vertikal'], correctIdx: 0, hint: 'y = const grafigi gorizontal to‘g‘ri chiziqdir.' }
]);

// Final 30 questions bank for each course
export const pythonFinal30Questions: Question[] = [
  ...py1Questions.map((q, i) => ({ ...q, id: `q_final_py_${i + 1}`, lessonId: undefined })),
  ...py2Questions.map((q, i) => ({ ...q, id: `q_final_py_${i + 11}`, lessonId: undefined })),
  ...py3Questions.map((q, i) => ({ ...q, id: `q_final_py_${i + 21}`, lessonId: undefined }))
];

export const historyFinal30Questions: Question[] = [
  ...hist1Questions.map((q, i) => ({ ...q, id: `q_final_hist_${i + 1}`, lessonId: undefined, courseId: 'course_history_temur' })),
  ...hist2Questions.map((q, i) => ({ ...q, id: `q_final_hist_${i + 11}`, lessonId: undefined, courseId: 'course_history_temur' })),
  ...hist3Questions.map((q, i) => ({ ...q, id: `q_final_hist_${i + 21}`, lessonId: undefined, courseId: 'course_history_temur' }))
];

export const englishFinal30Questions: Question[] = [
  ...eng1Questions.map((q, i) => ({ ...q, id: `q_final_eng_${i + 1}`, lessonId: undefined, courseId: 'course_english_grammar' })),
  ...eng2Questions.map((q, i) => ({ ...q, id: `q_final_eng_${i + 11}`, lessonId: undefined, courseId: 'course_english_grammar' })),
  ...eng3Questions.map((q, i) => ({ ...q, id: `q_final_eng_${i + 21}`, lessonId: undefined, courseId: 'course_english_grammar' }))
];

export const mathFinal30Questions: Question[] = [
  ...math1Questions.map((q, i) => ({ ...q, id: `q_final_math_${i + 1}`, lessonId: undefined, courseId: 'course_math_logic' })),
  ...math2Questions.map((q, i) => ({ ...q, id: `q_final_math_${i + 11}`, lessonId: undefined, courseId: 'course_math_logic' })),
  ...math3Questions.map((q, i) => ({ ...q, id: `q_final_math_${i + 21}`, lessonId: undefined, courseId: 'course_math_logic' }))
];

export const allInitialQuestions: Question[] = [
  ...py1Questions,
  ...py2Questions,
  ...py3Questions,
  ...py4Questions,
  ...hist1Questions,
  ...hist2Questions,
  ...hist3Questions,
  ...hist4Questions,
  ...eng1Questions,
  ...eng2Questions,
  ...eng3Questions,
  ...eng4Questions,
  ...math1Questions,
  ...math2Questions,
  ...math3Questions,
  ...math4Questions,
  ...pythonFinal30Questions,
  ...historyFinal30Questions,
  ...englishFinal30Questions,
  ...mathFinal30Questions
];

export const initialQuestions = allInitialQuestions;

// CLEAN ZERO PROGRESS:
// No fake completed lessons, no fake tests, no fake certificates!
// Everything will be earned by the student in real-time.
export const initialProgress: LessonProgress[] = [];
export const initialCertificates: Certificate[] = [];
export const initialCoinTransactions: CoinTransaction[] = [];

export const initialAuditLogs: AdminAuditLog[] = [
  {
    id: 'log_init',
    adminId: 'user_admin',
    adminName: 'Administrator',
    action: 'Platforma ishga tushirildi',
    target: 'IIV Andijon AL LMS v2.4',
    timestamp: '2026-09-01T08:00:00Z'
  }
];
