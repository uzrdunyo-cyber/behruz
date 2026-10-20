import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, XCircle, CheckCircle2, Award, Calendar, User, School, ArrowRight } from 'lucide-react';
import { Certificate, Language } from '../types';
import { translations } from '../i18n/translations';

interface CertificateVerifyViewProps {
  initialCertNumber?: string;
  onSearchCertificate: (number: string) => Certificate | undefined;
  onOpenCertificateModal: (cert: Certificate) => void;
  lang: Language;
}

export const CertificateVerifyView: React.FC<CertificateVerifyViewProps> = ({
  initialCertNumber,
  onSearchCertificate,
  onOpenCertificateModal,
  lang
}) => {
  const t = translations[lang];
  const [inputNumber, setInputNumber] = useState<string>(initialCertNumber || '');
  const [searchedCert, setSearchedCert] = useState<Certificate | null | undefined>(undefined);

  useEffect(() => {
    if (initialCertNumber) {
      setInputNumber(initialCertNumber);
      const found = onSearchCertificate(initialCertNumber);
      setSearchedCert(found || null);
    }
  }, [initialCertNumber, onSearchCertificate]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNumber.trim()) return;
    const found = onSearchCertificate(inputNumber.trim());
    setSearchedCert(found || null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-blue-200">
          <ShieldCheck className="w-6 h-6 text-blue-900" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.verifyPageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          {t.verifyPageDesc}
        </p>
      </div>

      {/* Verification Input Form */}
      <form onSubmit={handleVerify} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputNumber}
              onChange={e => setInputNumber(e.target.value.toUpperCase())}
              placeholder={t.verifyInputPlaceholder}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900 font-mono uppercase tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
          >
            {t.verifyCheckBtn}
          </button>
        </div>

        {/* Quick demo links */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>Namuna tekshiruv:</span>
          <button
            type="button"
            onClick={() => {
              setInputNumber('AL-IIV-2026-9481');
              const found = onSearchCertificate('AL-IIV-2026-9481');
              setSearchedCert(found || null);
            }}
            className="text-blue-900 font-mono font-semibold hover:underline cursor-pointer"
          >
            AL-IIV-2026-9481
          </button>
        </div>
      </form>

      {/* Verification Result Display */}
      {searchedCert !== undefined && (
        searchedCert ? (
          <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-300">
            
            {/* Valid Badge */}
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{t.certValidBadge}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">{t.certOwnerLabel}</span>
                <p className="text-sm font-bold text-slate-900">{searchedCert.userName}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">{t.certGroupLabel}</span>
                <p className="text-sm font-bold text-slate-900">{searchedCert.userGroup}-guruh o‘quvchisi</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 sm:col-span-2">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">{t.certCourseLabel}</span>
                <p className="text-sm font-bold text-blue-950">{searchedCert.courseTitle}</p>
                <p className="text-[11px] text-slate-500">{searchedCert.subjectTitle}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">{t.certScoreLabel}</span>
                <p className="text-sm font-bold text-emerald-700 font-mono tabular-nums">
                  {searchedCert.score} / {searchedCert.maxScore} ball (A’lo)
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">{t.certDateLabel}</span>
                <p className="text-sm font-bold text-slate-800 font-mono">{searchedCert.issueDate}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">
                Seriya: {searchedCert.certNumber}
              </span>
              <button
                onClick={() => onOpenCertificateModal(searchedCert)}
                className="px-4 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              >
                Hujjatni ko‘rish
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
            <XCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="text-base font-bold text-rose-950">
              {t.certNotFoundBadge}
            </h3>
            <p className="text-xs text-rose-800 max-w-md mx-auto leading-relaxed">
              Kiritilgan seriya raqami bo‘yicha IIV Andijon akademik litseyi bazasida tasdiqlangan sertifikat topilmadi. Raqamni tekshirib, qayta urinib ko‘ring.
            </p>
          </div>
        )
      )}

    </div>
  );
};
