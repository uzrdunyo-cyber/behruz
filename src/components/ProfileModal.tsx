import React, { useState } from 'react';
import { X, User as UserIcon, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { User, Language } from '../types';
import { translations } from '../i18n/translations';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpdateProfile: (data: { name: string; surname: string; group: string }) => void;
  onChangePassword: (newPass: string) => Promise<boolean>;
  lang: Language;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onChangePassword,
  lang
}) => {
  if (!isOpen || !currentUser) return null;

  const t = translations[lang];
  const [name, setName] = useState(currentUser.name);
  const [surname, setSurname] = useState(currentUser.surname);
  const [group, setGroup] = useState(currentUser.group);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, surname, group });

    if (newPassword.trim()) {
      if (newPassword.length < 4) {
        setMessage('Parol kamida 4 belgidan iborat bo‘lishi lozim');
        return;
      }
      await onChangePassword(newPassword);
      setNewPassword('');
    }

    setMessage('Profil ma’lumotlari muvaffaqiyatli saqlandi!');
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-900" />
            <h3 className="text-base font-bold text-slate-900">{t.profileBtn}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">{t.nameLabel}</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
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
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-700">{t.groupLabel}</label>
            <input
              type="text"
              required
              value={group}
              onChange={e => setGroup(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-700">Yangi parol (ixtiyoriy)</label>
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
                    <span>Ko‘rsatish</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="O‘zgartirishni xohlasangiz kiriting"
                className="w-full pl-3 pr-10 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-900 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                title={showPassword ? "Parolni yashirish" : "Yozayotgan parolni ko‘rish"}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-blue-900" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Ko‘z belgisiga bosib kiritilayotgan parolni ochiq ko‘rishingiz mumkin.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
          >
            {t.saveBtn}
          </button>
        </form>

      </div>
    </div>
  );
};
