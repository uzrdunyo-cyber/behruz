# IIV Andijon Akademik Litseyi — Ta’lim Platformasi

IIV Andijon akademik litseyi o'quvchilari uchun IT, tarix, ingliz tili, matematika va boshqa fanlarni sifatli videodarslar orqali mustaqil o‘rganish, 10 talik dars testlari va 30 talik yakuniy imtihonlar orqali bilimlarni tekshirish, xatolar tahlilini ko‘rish, coin to‘plash hamda rasmiy QR-kodli sertifikatlar olish imkonini beruvchi to‘liq funksional ta’lim platformasi.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Foydalanuvchi bilan aniqlashtirilgan va rejalashtirilgan asosiy qarorlar:

- **Confirmed Decision 1 (Loyiha qamrovi)**: Barcha funksiyalari to‘liq ishlaydigan mukammal web-platforma (Frontend + Backend API + Mustahkam saqlash arxitekturasi).
- **Confirmed Decision 2 (Interfeys tillari)**: 3 ta to‘liq til qo‘llab-quvvatlanadi: O‘zbek tili (asosiy), Rus tili va Ingliz tili (bir marta bosish bilan dinamik til almashtirish).
- **Confirmed Decision 3 (Boshlang‘ich kurslar bazasi)**: IT (Python), Tarix, Ingliz tili va Matematika fanlari bo‘yicha to‘liq namunaviy videodarslar, har bir dars uchun 10 talik maxsus testlar hamda yakuniy 30 talik imtihon savollari bilan ta’minlanadi.
- **Confirmed Decision 4 (Xavfsizlik va javoblar maxfiyligi)**: O‘quvchi xato javobini ko‘radi, lekin to‘g‘ri javob kaliti frontendga oshkor qilinmaydi; serverda xavfsiz solishtiriladi va o‘quvchiga faqat tahlil/tavsiya beriladi.
- **Confirmed Decision 5 (Coin va Sertifikat iqtisodiyoti)**: 1 ta sertifikat = 50 coin. Dars testlaridan o‘tganda (+10 coin), kursni yakunlaganda (+25 coin) va 30 talik imtihondan o‘tganda (+50 coin) mukofotlanadi; sertifikat rasmiylashtirishda 50 coin bir marta yechiladi va unikal verifikatsiya QR-kodi bilan PDF/chop etish formatida taqdim etiladi.

---

## 1. Overview & Core Concept

- **What It Does**: IIV Andijon akademik litseyi o‘quvchilari va ustozlari uchun mo‘ljallangan zamonaviy axborot-ta’lim portali. Tizim o‘quvchilarga ketma-ket ochiladigan videodarslar, video oxirigacha ko‘rilganini tekshiruvchi mexanizm, darsdan keyingi 10 talik testlar (o‘tish chegarasi $\ge 60\%$), o‘rganish tavsiyalari, 30 talik fan yakuniy imtihoni (o‘tish chegarasi $\ge 80\%$), coin hamyoni hamda QR-kodli verifikatsiyalanadigan sertifikatlar beradi. Adminlar uchun barcha fanlar, kurslar, video yuklash, testlar va javob kalitlari, o‘quvchilar monitoringi va audit jurnali mavjud.
- **Target Audience / Persona**:
  - *O‘quvchilar*: Litseyning 1- va 2-bosqich o‘quvchilari (guruhlari: 101, 102, 103 va h.k.).
  - *O‘qituvchilar va Ma’muriyat*: Litsey ma’murlari va fan o‘qituvchilari (kurs va testlarni boshqaruvchi adminlar).
  - *Tekshiruvchilar*: Sertifikat haqiqiyligini QR-kod yoki seriya raqami orqali tekshiruvchi ota-onalar va muassasalar.
- **Key Value**: Mustaqil ta’lim sifatini oshirish, bilimni adolatli va aldovdan xoli tekshirish (anti-skip mexanizmi, yashirin to‘g‘ri javoblar), o‘quvchilarni coinlar bilan rag‘batlantirish hamda litsey ta’lim jarayonini shaffof monitoring qilish.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **O‘quvchi ro‘yxatdan o‘tishi va kirishi**: Ism, familiya, guruh (masalan, 101), login va xavfsiz parol bilan hisob yaratish $\to$ Shaxsiy kabinetga kirish. Parolni xavfsiz tiklash imkoni mavjud.
2. **Dars o‘rganish va test topshirish**: Fan katalogidan kurs tanlanadi $\to$ 1-video ochiladi $\to$ Video ko‘rib bo‘lingach, darsga tegishli 10 talik test ochiladi $\to$ Agar $\ge 6/10$ to‘plansa, dars muvaffaqiyatli yakunlanadi (+coin yoziladi) va 2-video ochiladi. Agar $<6/10$ bo‘lsa, xatolar tahlili ko‘rsatiladi (to‘g‘ri javob aytilmaydi, faqat mavzu tavsiyasi) va darsni qayta ko‘rish taklif etiladi.
3. **Fan yakuniy imtihoni va sertifikat**: Fanning barcha videolari va testlari muvaffaqiyatli topshirilgach, 30 talik yakuniy imtihon ochiladi $\to$ $\ge 24/30$ ($80\%$) to‘plansa, sertifikat olish huquqi beriladi $\to$ 50 coin yechilib, unikal ID va QR-kodga ega sertifikat generatsiya qilinadi.
4. **Admin boshqaruvi**: Maxsus admin profili orqali kiriladi $\to$ Yangi fan/kurs ochish, videodars yuklash/havola qo‘yish, 10 talik test va javob kalitlarini kiritish, barcha o‘quvchilar natijalarini real vaqtda jadvalda ko‘rish, qidiruv va filtrlash.

### Visual Identity & Theme
- **Aesthetic Direction**: IIV Akademik Litseyiga xos vazmin, professional va akademik davlat muassasasi uslubi (Institutional Academy Blue, Crisp White, Muted Slate). Anti-AI slop qoidalariga qat’iy rioya qilinadi: soxta "neon", "chip/pill" to'plamlari va keraksiz bezaklar bo‘lmaydi.
- **Color Palette & Discipline (60-30-10)**:
  - *60% Dominant Canvas*: Toza, qulay oq va yengil sovuq kulrang fon (`#F8FAFC`, `#FFFFFF`, qorong‘i rejimda `#0B1120`).
  - *30% Structural Surfaces*: Akademik to‘q ko‘k panellar, aniq 1px chegaralar (`#E2E8F0` / `#1E293B`), yengil sirtlar.
  - *10% Semantic Accents*:
    - Boshqaruv va asosiy harakatlar: IIV Litsey To'q Ko'k (`#1E3A8A` / `#2563EB`)
    - Nominal / Muvaffaqiyat: Zangori Yashil (`#059669` / `#10B981`)
    - Xato / Ogohlantirish: To‘q Qizil / Sariq (`#DC2626` / `#D97706`)
    - Coinlar va Mukofot: Oltin Sariq (`#D97706` / `#F59E0B`)
- **Typography & Hierarchy**:
  - Sarlavhalar va brend: `Plus Jakarta Sans` / `Manrope` (vazmin, aniq, rasmiy).
  - Asosiy matn: `DM Sans` / `Public Sans` (oqilishi oson, ko‘zni charchatmaydi).
  - Sonlar, natijalar, hisob-kitoblar va audit: `tabular-nums font-mono` (`JetBrains Mono` uslubida aniq ustunli tekislanish).
- **Top Bar Contract**:
  - Chapda: Yagona qatorli rasmiy brend nomi (`IIV Andijon Akademik Litseyi`).
  - O'rtada: 4-5 ta aniq matnli navigatsiya havolalari (`Bosh sahifa`, `Fanlar`, `Mening kurslarim`, `Sertifikatlar`, `Hamyon`).
  - O'ngda: Til tanlash (UZ/RU/EN) + Foydalanuvchi profili / Admin o'tish tugmasi.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Anti-Cheat & Video Watching Verification**:
  - *Approach*: Foydalanuvchi shunchaki videoning oxirgi soniyasiga bosib testni ocha olmaydi. Video ko'rish vaqti vaqt oralig'i (progress interval) orqali hisoblanadi va kamida 90% tomosha qilingach, test topshirish ruxsati beriladi.
  - *Why*: TZ-dagi muhim talab — o‘quvchi videoni mustaqil va to‘liq o‘rganishi shart.
- **Decision 2: Yashirin test kalitlari va xatolar tahlili**:
  - *Approach*: O‘quvchi test ishlaganda to‘g‘ri javob kalitlari brauzerga yuborilmaydi. Javoblar tekshirilgach, faqat "To‘g‘ri" yoki "Xato" holati hamda xato qilgan savol bo‘yicha metodik tushuntirish ("Bu savol o‘zgaruvchilarni e’lon qilish mavzusiga oid...") ko‘rsatiladi.
  - *Why*: O‘quvchi sahifa kodini ochib to‘g‘ri javobni ko‘chirib olmasligi va xatosini tushunib videoni qayta o‘rganishi uchun.
- **Decision 3: Ma’lumotlar bazasi va doimiy saqlash**:
  - *Approach*: Barcha foydalanuvchilar, guruhlar, fanlar, darslar, 10 talik va 30 talik savollar, test urinishlari tarixi, coin tranzaksiyalari va sertifikatlar doimiy xotirada (LocalStorage + integratsiyalangan Data Engine) saqlanadi. Dastur sahifani yangilaganda ham hech qanday ma’lumot yo‘qolmaydi.
- **Decision 4: Rasmiy QR-kodli Sertifikatlar va Tekshiruv tizimi**:
  - *Approach*: Har bir sertifikat uchun unikal raqam (masalan, `AL-IIV-2026-9481`) va haqiqiylikni bir zumda tasdiqlovchi QR-kod yaratiladi. Tizimda alohida ommaviy "Sertifikatni tekshirish" sahifasi bo‘ladi.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│               IIV Andijon Akademik Litseyi Portali                     │
│               Frontend (React 19 + TypeScript + Tailwind)              │
├──────────────────────────────────┬─────────────────────────────────────┤
│        O'quvchi Kabineti         │            Admin Paneli             │
│  - Bosh sahifa & Statistika      │  - Boshqaruv & Umumiy tahlil        │
│  - Fanlar & Kurslar katalogi     │  - Fanlar va kurslar boshqaruvi     │
│  - Videodars pleyeri (anti-skip) │  - Video darslar & tartiblash       │
│  - 10 talik test & xatolar tahlili│  - Testlar (10 va 30 talik) & kalit │
│  - 30 talik yakuniy imtihon      │  - O'quvchilar monitoringi jadvali  │
│  - Coin hamyon & 50 coin narxi   │  - Sertifikatlar & Coin sozlamalari │
│  - QR Sertifikat & PDF eksport   │  - Audit loglar & CSV eksport       │
└──────────────────────────────────┴─────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Xavfsizlik & Mantiqiy Qatlam                         │
│  - Xavfsiz Parol Xeshlash & Seans Boshqaruvi                          │
│  - Server-Authoritative Test Baholash (Yashirin Kalitlar)              │
│  - Anti-Skip Video Kuzatuv Algoritmi                                   │
│  - 50 Coin Yechish & Tranzaksiya Idempotentligi                        │
│  - Ko'p tillilik provayderi (O'zbek / Rus / Ingliz)                    │
└────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Ma'lumotlar Modeli (JSON Schema)                     │
│  • users: id, name, surname, group, login, passwordHash, role, coins  │
│  • subjects: id, title, description, icon, order                       │
│  • courses: id, subjectId, title, level, order                         │
│  • videos: id, courseId, title, url, description, order, duration      │
│  • questions: id, lessonId/courseId, text, options[], correctIndex, hint│
│  • progress: userId, lessonId, watchedPct, testScore, status, attempts │
│  • certificates: id, certNumber, userId, courseId, date, qrCodeData    │
│  • coin_transactions: id, userId, amount, type, description, timestamp │
│  • audit_logs: id, adminId, action, target, timestamp                  │
└────────────────────────────────────────────────────────────────────────┘
```

### Amaliy Ishlash Rejasi (Bosqichlar):
1. **1-bosqich: Tizim poydevori, turlar va ko'p tillilik (i18n)**:
   - TypeScript turlari (`User`, `Subject`, `Course`, `Video`, `Question`, `Attempt`, `Certificate`, `CoinTransaction`, `AuditLog`).
   - O'zbek, Rus va Ingliz tillaridagi barcha terminlar va matnlar lug'ati.
   - Xavfsiz autentifikatsiya (kirish, ro'yxatdan o'tish, guruh tanlash, parol xeshlash, parolni tiklash).
2. **2-bosqich: Boshlang'ich namunaviy fanlar va kurslar bazasi**:
   - IT (Python: Kirish, O'zgaruvchilar, Shartlar va Sikllar) + 10 talik testlar + 30 talik imtihon savollari.
   - Tarix (O'zbekiston tarixi: Sohibqiron Amir Temur va Temuriylar renessansi) + 10 talik testlar.
   - Ingliz tili (Grammar & Communication) + 10 talik testlar.
   - Matematika (Algebra & Mantiqiy masalalar) + 10 talik testlar.
3. **3-bosqich: O'quvchi dars va test interfeysi**:
   - Anti-skip video pleyer va progress kuzatish.
   - 10 talik interaktiv dars testi.
   - Natija va xatolar tahlili sahifasi (to'g'ri javobni yashirib, o'quvchiga yo'naltiruvchi tushuntirish berish).
   - $\ge 6/10$ bo'lgandagina keyingi dars ochilishi, aks holda qayta ko'rish talabi.
4. **4-bosqich: 30 talik yakuniy imtihon, Coin tizimi va Sertifikat**:
   - Fanning barcha videolari tugagach 30 talik yakuniy testga kirish huquqi.
   - $\ge 24/30$ ($80\%$) to'planganda sertifikat olish huquqi.
   - 50 coin yechilishi, coin hamyoni balansi va tranzaksiyalar tarixi.
   - IIV Andijon Akademik Litseyi rasmiy sertifikati generatsiyasi (unikal raqam, QR-kod, chop etish/PDF yuklab olish) hamda tekshiruv moduli.
5. **5-bosqich: Admin Paneli**:
   - Boshqaruv paneli (statistika ko'rsatkichlari).
   - Fan va kurs yaratish/tahrirlash.
   - Video yuklash va dars tartibini belgilash.
   - 10 talik va 30 talik test savollari va javob kalitlarini boshqarish.
   - Barcha o'quvchilar faoliyati monitoringi, qidiruv, guruh filtri va CSV eksport.
   - Tizim sozlamalari va admin audit loglari.
6. **6-bosqich: Verifikatsiya va integratsion sinov**:
   - Barcha 18 ta majburiy test holatlarini tekshirish (`compile_applet`, qoidalar mustahkamligi).
