import React, { useState } from 'react';
import { Award, Coins, CheckCircle2, ArrowRight, Printer, Shield, AlertCircle, Sparkles } from 'lucide-react';
import { Certificate, Course, User, Language } from '../types';
import { translations } from '../i18n/translations';

interface CertificateViewProps {
  currentUser: User;
  certificates: Certificate[];
  eligibleCourses: Course[]; // Courses where user passed final 30 exam
  onClaimCertificate: (courseId: string) => void;
  onOpenCertificateModal: (cert: Certificate) => void;
  onNavigateTab: (tab: string) => void;
  lang: Language;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  currentUser,
  certificates,
  eligibleCourses,
  onClaimCertificate,
  onOpenCertificateModal,
  onNavigateTab,
  lang
}) => {
  const t = translations[lang];
  const [claimCourseId, setClaimCourseId] = useState<string | null>(null);

  const userCertificates = certificates.filter(c => c.userId === currentUser.id);

  // Filter eligible courses where certificate is not yet claimed
  const pendingClaimCourses = eligibleCourses.filter(
    course => !userCertificates.some(c => c.courseId === course.id)
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.certificatesHeading}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {t.certificatesSubheading}
        </p>
      </div>

      {/* Eligible to claim banner (50 coins) */}
      {pendingClaimCourses.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Sertifikat olish huquqiga egasiz!</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-amber-950">
                Yakuniy imtihonlarni muvaffaqiyatli topshirgan kurslaringiz
              </h3>
              <p className="text-xs text-amber-800">
                Har bir sertifikat rasmiylashtirish uchun 50 coin yechiladi. Sizning balansingiz: <span className="font-bold font-mono">{currentUser.coins} coin</span>.
              </p>
            </div>

            <div className="px-3 py-1.5 bg-amber-200/80 rounded-xl text-amber-950 font-mono font-bold text-xs shrink-0 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-700" />
              <span>50 coin / ta</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {pendingClaimCourses.map(c => {
              const hasEnoughCoins = currentUser.coins >= 50;
              return (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="truncate">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {c.title[lang] || c.title.uz}
                    </h4>
                    <p className="text-[11px] text-slate-500">Imtihon topshirilgan</p>
                  </div>

                  <button
                    onClick={() => onClaimCertificate(c.id)}
                    disabled={!hasEnoughCoins}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                      hasEnoughCoins
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {hasEnoughCoins ? t.claimCertBtn : 'Coin yetarli emas (50 kerak)'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Existing Certificates Grid */}
      {userCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCertificates.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-blue-900 font-bold">{cert.certNumber}</span>
                  <span>{cert.issueDate}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                    <Award className="w-4 h-4" />
                    <span>{cert.subjectTitle}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                    {cert.courseTitle}
                  </h3>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Imtihon natijasi:</span>
                  <span className="font-mono font-bold text-blue-900 tabular-nums">
                    {cert.score} / {cert.maxScore} ball
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onOpenCertificateModal(cert)}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.viewPrintCert}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              Hozircha olingan sertifikatlar mavjud emas
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.noCertificatesYet}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('subjects')}
            className="px-5 py-2.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Fanlar katalogiga o‘tish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lyceum Policy Notice */}
      <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-start gap-3">
        <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          IIV Andijon akademik litseyi elektron platformasining barcha sertifikatlari markaziy bazada saqlanadi va ularning haqiqiyligi unikal seriya raqami hamda QR-kod orqali istalgan vaqtda onlayn tekshirilishi mumkin.
        </p>
      </div>

    </div>
  );
};
