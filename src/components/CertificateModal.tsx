import React, { useEffect, useState } from 'react';
import { X, Printer, Shield, CheckCircle2, Award, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { Certificate, Language } from '../types';
import { translations } from '../i18n/translations';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  lang: Language;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
  lang
}) => {
  if (!isOpen || !certificate) return null;

  const t = translations[lang];
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (certificate) {
      QRCode.toDataURL(certificate.qrData, {
        width: 140,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('QR code error:', err));
    }
  }, [certificate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        {/* Modal Top Bar (hidden during print) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-slate-900">
              {certificate.courseTitle} — Rasmiy Sertifikat
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printDownloadBtn}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Certificate Canvas */}
        <div className="p-4 sm:p-8 bg-slate-100 overflow-x-auto flex justify-center">
          <div
            id="printable-certificate"
            className="w-full max-w-3xl bg-amber-50/20 border-8 border-double border-blue-950 p-8 sm:p-12 rounded-xl shadow-lg relative text-slate-900 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"
          >
            
            {/* Elegant Inner Border */}
            <div className="border border-blue-900/40 p-6 sm:p-8 rounded-lg relative space-y-6 text-center">
              
              {/* Official Seal / Coat of Arms Header */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-linear-to-b from-blue-900 to-indigo-950 text-white flex items-center justify-center shadow-md border-2 border-amber-400">
                  <Shield className="w-9 h-9 text-amber-400" />
                </div>
                
                <div className="space-y-0.5">
                  <p className="text-[11px] sm:text-xs font-bold text-blue-950 tracking-widest uppercase">
                    O‘ZBEKISTON RESPUBLIKASI ICHKI ISHLAR VAZIRLIGI
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-blue-900 tracking-wider">
                    ANDIJON AKADEMIK LITSEYI
                  </p>
                </div>
              </div>

              {/* Certificate Document Title */}
              <div className="py-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-amber-700">
                  RASMIY HUJJAT
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight mt-0.5 font-serif">
                  {t.certDocumentTitle}
                </h1>
                <div className="w-32 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2" />
              </div>

              {/* Awarded Body */}
              <div className="space-y-3 max-w-xl mx-auto py-2">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {t.certGivenTo}
                </p>

                <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-wide border-b border-dashed border-slate-400 pb-1 inline-block px-8">
                  {certificate.userName}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
                  <span className="font-bold text-blue-950">{certificate.userGroup}-guruh</span> o‘quvchisi
                  IIV Andijon akademik litseyining <span className="font-bold text-blue-950">«{certificate.courseTitle}»</span> kursi
                  bo‘yicha barcha nazariy va amaliy darslarni hamda 30 talik fan yakuniy imtihonini muvaffaqiyatli topshirib,
                  <span className="font-mono font-bold text-blue-950"> {certificate.score}/{certificate.maxScore} </span>
                  natija bilan ushbu sertifikatni qo‘lga kiritdi.
                </p>
              </div>

              {/* Lower Section: Serial, QR Code, Signature & Seal */}
              <div className="pt-6 border-t border-blue-900/20 grid grid-cols-3 items-end gap-4 text-left">
                
                {/* Left: Serial Number & Date */}
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Sertifikat ID:</span>
                    <span className="font-mono font-bold text-blue-950 text-sm tracking-wider">
                      {certificate.certNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Berilgan sana:</span>
                    <span className="font-mono text-slate-700 font-medium">
                      {certificate.issueDate}
                    </span>
                  </div>
                </div>

                {/* Center: Live Scannable QR Code */}
                <div className="flex flex-col items-center justify-center text-center space-y-1">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Sertifikat tekshirish QR-kodi"
                      className="w-20 h-20 border border-slate-300 rounded-md shadow-2xs p-0.5 bg-white"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-200 rounded animate-pulse" />
                  )}
                  <span className="text-[9px] text-slate-500 font-mono tracking-tight">
                    Haqiqiylikni tekshirish
                  </span>
                </div>

                {/* Right: Signature & Lyceum Stamp */}
                <div className="space-y-2 text-right">
                  <div className="inline-block relative">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-900/40 absolute -top-10 right-4 flex items-center justify-center rotate-12 opacity-80 pointer-events-none text-[8px] text-blue-950 font-bold uppercase text-center p-1">
                      IIV Andijon AL * Tasdiqlandi
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-400">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Litsey direktori</p>
                    <p className="text-xs font-serif font-bold text-slate-900">Podpolkovnik / Ilmiy rahbar</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
