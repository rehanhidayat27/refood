import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Delete, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { getThemeClasses } from '../../utils/themeHelper.ts';

export const PinModal: React.FC = () => {
  const {
    isPinModalOpen,
    setIsPinModalOpen,
    pendingRoleSwitch,
    setPendingRoleSwitch,
    switchStaffRoleWithPin,
    playSound,
    themeColor,
  } = useApp();

  const theme = getThemeClasses(themeColor);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isPinModalOpen) {
      setPin('');
      setErrorMsg('');
      setShake(false);
    }
  }, [isPinModalOpen]);

  if (!isPinModalOpen) return null;

  const targetRoleName = pendingRoleSwitch ? pendingRoleSwitch.toUpperCase() : 'USER';

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      playSound('click');
      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    playSound('click');
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    playSound('click');
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (pinToTest: string) => {
    const success = switchStaffRoleWithPin(pinToTest);
    if (!success) {
      playSound('alert');
      setErrorMsg('PIN 6-digit salah! Silakan periksa kembali.');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPin('');
      }, 600);
    }
  };

  const handleCancel = () => {
    setIsPinModalOpen(false);
    setPendingRoleSwitch(null);
    setPin('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className={`bg-white dark:bg-slate-850 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-5 animate-in fade-in zoom-in-95 ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 mx-auto flex items-center justify-center shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
            Autentikasi Akses Aman
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
            Masukkan PIN 6-Digit
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Untuk beralih ke hak akses akun <strong className="text-slate-700 dark:text-slate-200">{targetRoleName}</strong>
          </p>
        </div>

        {/* 6 PIN Indicator Bullets */}
        <div className="flex justify-center gap-3 py-2">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? `${theme.primaryBg} scale-110 shadow-sm`
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-lg font-bold text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 transition-all flex items-center justify-center"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-lg font-bold text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 transition-all flex items-center justify-center"
            aria-label="Hapus satu angka"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Demo PIN hints */}
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2.5 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 text-left border border-slate-200/60 dark:border-slate-700/60">
          <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>PIN Pengguna Demo:</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
            <span>Kasir: 123456</span>
            <span>Manager: 234567</span>
            <span>Admin: 888888</span>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          Batalkan
        </button>
      </div>
    </div>
  );
};
