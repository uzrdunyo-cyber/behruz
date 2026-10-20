import React, { useState } from 'react';
import { X, Shield, Lock, User, KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (login: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (data: {
    name: string;
    surname: string;
    group: string;
    login: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onResetPass: (login: string, newPass: string) => Promise<boolean>;
  onQuickDemoLogin: (login: string) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onResetPass,
  onQuickDemoLogin,
  lang
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [group, setGroup] = useState('101');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await onLogin(login, password);
        if (!res.success) {
          setErrorMsg(res.error ? (t as any)[res.error] || res.error : t.invalidCredentials);
        } else {
          onClose();
        }
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setErrorMsg(t.passwordsDoNotMatch);
          setIsLoading(false);
          return;
        }
        if (password.length < 4) {
          setErrorMsg('Parol kamida 4 ta belgidan iborat bo‘lishi lozim');
          setIsLoading(false);
          return;
        }

        const res = await onRegister({
          name,
          surname,
          group,
          login,
          password
        });

        if (!res.success) {
          setErrorMsg(res.error ? (t as any)[res.error] || res.error : 'Xatolik yuz berdi');
        } else {
          onClose();
        }
      } else if (mode === 'forgot') {
        if (password !== confirmPassword) {
          setErrorMsg(t.passwordsDoNotMatch);
          setIsLoading(false);
          return;
        }

        const success = await onResetPass(login, password);
        if (success) {
          setSuccessMsg(t.resetPassSuccess);
          setTimeout(() => setMode('login'), 1200);
        } else {
          setErrorMsg('Bunday loginli o‘quvchi topilmadi');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {mode === 'login' ? t.loginTitle : mode === 'register' ? t.registerTitle : t.forgotPassTitle}
              </h3>
              <p className="text-[11px] text-slate-500">IIV Andijon Akademik Litseyi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Student Login, Register, Admin Login) */}
        <div className="flex border-b border-slate-100 text-xs font-semibold bg-white">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'login'
                ? 'border-blue-900 text-blue-900 font-bold bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.loginBtn}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'register'
                ? 'border-blue-900 text-blue-900 font-bold bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.registerBtn}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLogin('admin');
              setPassword('');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              login === 'admin' && mode === 'login'
                ? 'border-amber-600 text-amber-700 font-bold bg-amber-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Admin Kirish
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">{t.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Behruzbek"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">{t.surnameLabel}</label>
                <input
                  type="text"
                  required
                  value={surname}
                  onChange={e => setSurname(e.target.value)}
                  placeholder="Anvarjonov"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="space-y-1 col-span-2">
                <label className="text-[11px] font-semibold text-slate-700">{t.groupLabel}</label>
                <input
                  type="text"
                  required
                  value={group}
                  onChange={e => setGroup(e.target.value)}
                  placeholder="101"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>
          )}

          {/* Login identifier */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-700">{t.loginLabel}</label>
            <input
              type="text"
              required
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="behruz"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            />
          </div>

          {/* Password with Eye Show/Hide toggle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-700">{t.passwordLabel}</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-blue-900 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-medium"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Yashirish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Yozilayotganni ko‘rsatish</span>
                    </>
                  )}
                </button>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-slate-500 hover:text-blue-900 hover:underline cursor-pointer"
                  >
                    {t.forgotPassLink}
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={login === 'admin' ? "Admin paroli (abdurahmonkiber)" : "••••••••"}
                className="w-full pl-3 pr-10 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900 font-mono font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                title={showPassword ? "Parolni yashirish" : "Yozayotgan parolni ko‘rsatish"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-blue-900" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {login === 'admin' && (
              <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                Admin paroli: <strong className="font-mono">abdurahmonkiber</strong> (ko‘z belgisiga bosib yozilayotganini ko‘rishingiz mumkin)
              </p>
            )}
          </div>

          {(mode === 'register' || mode === 'forgot') && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700">{t.confirmPasswordLabel}</label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[11px] text-blue-900 hover:text-blue-700 flex items-center gap-1 cursor-pointer font-medium"
                >
                  {showConfirmPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Yashirish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Yozilayotganni ko‘rsatish</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900 font-mono font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title={showConfirmPassword ? "Parolni yashirish" : "Yozayotgan parolni ko‘rsatish"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 text-blue-900" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading
              ? 'Tekshirilmoqda...'
              : mode === 'login'
              ? t.loginBtn
              : mode === 'register'
              ? t.registerBtn
              : 'Parolni saqlash'}
          </button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center space-y-2">
          <p className="text-[11px] font-semibold text-slate-500">
            Sinov uchun tezkor kirish:
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onQuickDemoLogin('behruz')}
              className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-blue-50 text-blue-900 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Behruzbek (101-guruh)
            </button>
            <button
              type="button"
              onClick={() => onQuickDemoLogin('admin')}
              className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer"
            >
              Admin (Ma’muriyat)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
