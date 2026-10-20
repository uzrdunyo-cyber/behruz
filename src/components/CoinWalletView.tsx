import React from 'react';
import { Coins, ArrowUpRight, ArrowDownLeft, Shield, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { User, CoinTransaction, Language } from '../types';
import { translations } from '../i18n/translations';

interface CoinWalletViewProps {
  currentUser: User;
  transactions: CoinTransaction[];
  onNavigateTab: (tab: string) => void;
  lang: Language;
}

export const CoinWalletView: React.FC<CoinWalletViewProps> = ({
  currentUser,
  transactions,
  onNavigateTab,
  lang
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      
      {/* Wallet Balance Hero Card */}
      <div className="bg-linear-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-2xl p-6 sm:p-8 text-slate-950 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-amber-950/80">
              {t.walletBalance}
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black font-mono tabular-nums text-slate-950">
                {currentUser.coins}
              </span>
              <span className="text-lg font-bold text-amber-950 font-serif">coin</span>
            </div>
            <p className="text-xs text-amber-950/90 font-medium max-w-md">
              Litsey ta’lim platformasidagi dars testlari va imtihonlarni topshirib coin to‘plang va rasmiy sertifikatlarga almashtiring.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 text-xs space-y-1.5 shrink-0 min-w-[200px]">
            <span className="font-bold text-slate-950 block">Sertifikat narxi:</span>
            <div className="text-base font-extrabold font-mono text-slate-950">50 coin / ta</div>
            <span className="text-[11px] text-amber-950">
              {currentUser.coins >= 50
                ? 'Siz sertifikat olishingiz mumkin!'
                : `Yana ${50 - currentUser.coins} coin to‘plashingiz kerak`}
            </span>
          </div>
        </div>

        {/* Ambient coins glow */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Rules Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {t.walletRulesTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 font-mono text-xs">
              +10
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Dars testidan o‘tish:</span>
              <span className="text-slate-600">Har bir videodars testida kamida 6/10 to‘planganda beriladi.</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 font-mono text-xs">
              +25
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Kursni yakunlash:</span>
              <span className="text-slate-600">Barcha videodarslarni to‘liq yakunlaganda mukofotlanadi.</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 font-mono text-xs">
              +50
            </div>
            <div>
              <span className="font-bold text-slate-900 block">30 talik imtihon:</span>
              <span className="text-slate-600">Fan yakuniy imtihonida kamida 24/30 ball to‘planganda.</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0 font-mono text-xs">
              -50
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Sertifikat chiqarish:</span>
              <span className="text-slate-600">Rasmiy QR-kodli sertifikat rasmiylashtirish uchun 1 marta yechiladi.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900">
          {t.transactionHistory}
        </h3>

        {transactions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {transactions.map(tx => {
              const isPositive = tx.amount > 0;
              const formattedDate = new Date(tx.timestamp).toLocaleString();

              return (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isPositive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        {tx.description[lang] || tx.description.uz}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className={`font-mono font-bold text-sm shrink-0 tabular-nums ${
                    isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isPositive ? `+${tx.amount}` : tx.amount} coin
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">{t.noTransactionsYet}</p>
        )}
      </div>

    </div>
  );
};
