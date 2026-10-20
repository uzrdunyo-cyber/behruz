import React from 'react';
import { Shield, Coins, Award, User, LogOut, Settings, CheckCircle2, Globe } from 'lucide-react';
import { Language, User as UserType } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserType | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenProfile,
  lang,
  onLangChange
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* Zone 1: Single-element Brand Title */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-900 to-indigo-950 flex items-center justify-center text-white shadow-md border border-blue-800">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap leading-tight">
                {t.lyceumTitle}
              </span>
              <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                {t.platformSubtitle}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean unboxed text links) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentTab('home')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'home' ? 'text-blue-900 font-semibold border-b-2 border-blue-900' : ''
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => setCurrentTab('subjects')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'subjects' || currentTab === 'course-detail' ? 'text-blue-900 font-semibold border-b-2 border-blue-900' : ''
              }`}
            >
              {t.navSubjects}
            </button>
            <button
              onClick={() => setCurrentTab('wallet')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'wallet' ? 'text-blue-900 font-semibold border-b-2 border-blue-900' : ''
              }`}
            >
              {t.navWallet}
            </button>
            <button
              onClick={() => setCurrentTab('certificates')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'certificates' ? 'text-blue-900 font-semibold border-b-2 border-blue-900' : ''
              }`}
            >
              {t.navCertificates}
            </button>
            <button
              onClick={() => setCurrentTab('verify')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap py-1 cursor-pointer ${
                currentTab === 'verify' ? 'text-blue-900 font-semibold border-b-2 border-blue-900' : ''
              }`}
            >
              {t.navVerifyCert}
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => onLangChange('uz')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  lang === 'uz' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                O‘Z
              </button>
              <button
                onClick={() => onLangChange('ru')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  lang === 'ru' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                РУ
              </button>
              <button
                onClick={() => onLangChange('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  lang === 'en' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* If logged in */}
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {/* Coins Counter */}
                <button
                  onClick={() => setCurrentTab('wallet')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                  title="Coin hamyoningiz"
                >
                  <Coins className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span className="font-mono tabular-nums text-sm">{currentUser.coins}</span>
                  <span className="text-[10px] text-amber-700 font-medium">coin</span>
                </button>

                {/* Admin Mode Switcher if user is admin */}
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => setCurrentTab(currentTab === 'admin' ? 'home' : 'admin')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      currentTab === 'admin'
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{currentTab === 'admin' ? t.studentPanelBtn : t.adminPanelBtn}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Switch to demo admin
                      setCurrentTab('admin');
                    }}
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:text-blue-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Admin panelini ko‘rish"
                  >
                    <span>{t.adminPanelBtn}</span>
                  </button>
                )}

                {/* Profile Avatar / Menu */}
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-800 text-xs font-medium transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs border border-blue-200">
                    {currentUser.name[0]}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-semibold text-slate-900 leading-tight">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{currentUser.group}-guruh</span>
                  </div>
                </button>

                {/* Logout */}
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title={t.logoutBtn}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              >
                {t.loginBtn}
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
