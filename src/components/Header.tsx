import React, { useState } from 'react';
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Shield,
  ChevronDown,
  ShoppingBag,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { getThemeClasses } from '../utils/themeHelper.ts';

export const Header: React.FC<{ onOpenMobileCart?: () => void }> = ({ onOpenMobileCart }) => {
  const {
    t,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    currentStaff,
    staffList,
    directSwitchStaffRole,
    isPinModalOpen: _isPinModalOpen,
    setIsPinModalOpen,
    setPendingRoleSwitch,
    soundEnabled,
    setSoundEnabled,
    darkMode,
    toggleDarkMode,
    offlineMode,
    setOfflineMode,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    playSound,
    themeColor,
    cart,
  } = useApp();

  const theme = getThemeClasses(themeColor);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'kasir':
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <header className="h-16 md:h-18 px-4 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 transition-colors z-20">
      {/* Search Input matching reference design */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-850 transition-all"
            aria-label="Cari menu makanan dan minuman"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 ml-4">
        {/* Language quick switcher */}
        <button
          onClick={() => {
            playSound('click');
            setLanguage(language === 'id' ? 'en' : 'id');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
          title={language === 'id' ? 'Beralih ke English' : 'Switch to Bahasa Indonesia'}
          aria-label="Ganti Bahasa / Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-orange-500" />
          <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
        </button>

        {/* Offline / Online Sync Toggle */}
        <button
          onClick={() => {
            playSound('click');
            setOfflineMode(!offlineMode);
          }}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all ${
            offlineMode
              ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
          }`}
          title={offlineMode ? 'Mode Offline aktif. Transaksi disimpan lokal dan otomatis sinkron saat online.' : 'Koneksi Online & Cloud Sync Otomatis'}
          aria-label="Status Sinkronisasi Jaringan"
        >
          {offlineMode ? (
            <>
              <WifiOff className="w-3.5 h-3.5 animate-pulse text-amber-600" />
              <span className="font-medium">{t('offlineMode')}</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">{t('cloudOnline')}</span>
            </>
          )}
        </button>

        {/* Sound toggle */}
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (!soundEnabled) playSound('click');
          }}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title={soundEnabled ? 'Matikan Efek Suara' : 'Aktifkan Efek Suara'}
          aria-label="Pengaturan Suara"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-500" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={() => {
            playSound('click');
            toggleDarkMode();
          }}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          aria-label="Pengaturan Mode Gelap atau Terang"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              playSound('click');
              setShowNotifDropdown(!showNotifDropdown);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer"
            aria-label="Notifikasi Sistem"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pemberitahuan Real-Time</h4>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 font-bold">
                      {unreadNotificationsCount} Baru
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium"
                >
                  Tandai Dibaca
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 py-1">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">Tidak ada notifikasi saat ini.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`py-2.5 px-2 rounded-lg transition-colors ${
                        !n.read ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Cart Button Toggle */}
        {onOpenMobileCart && (
          <button
            onClick={onOpenMobileCart}
            className={`lg:hidden relative p-2 rounded-full ${theme.primaryBg} text-white shadow-md`}
            aria-label="Buka Keranjang Pesanan"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                {cartTotalItems}
              </span>
            )}
          </button>
        )}

        {/* User Profile Pill matching reference screenshot (e.g. Henry Stark style) */}
        <div className="relative">
          <button
            onClick={() => {
              playSound('click');
              setShowRoleDropdown(!showRoleDropdown);
            }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
            aria-label="Menu Profil Pengguna dan Hak Akses"
          >
            <div className="relative">
              <img
                src={currentStaff.avatar}
                alt={currentStaff.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentStaff.name}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${getRoleBadge(currentStaff.role)}`}>
                  {currentStaff.role}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* Role Switching Dropdown */}
          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50">
              <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-700 text-xs text-slate-400 flex items-center justify-between">
                <span>Ganti Peran / Pengguna:</span>
                <Shield className="w-3.5 h-3.5 text-orange-500" />
              </div>

              <div className="space-y-1.5">
                {staffList.map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => {
                      setShowRoleDropdown(false);
                      if (staff.role === currentStaff.role) return;
                      // Prompt PIN for security as requested
                      setPendingRoleSwitch(staff.role);
                      setIsPinModalOpen(true);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      currentStaff.id === staff.id
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold">{staff.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{staff.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500">
                      PIN: {staff.pin}
                    </span>
                  </button>
                ))}
              </div>

              {/* Instant quick demo switch */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 mb-1">Pintas Demo (Tanpa PIN):</div>
                <div className="grid grid-cols-3 gap-1">
                  {(['kasir', 'manager', 'admin'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        directSwitchStaffRole(role);
                        setShowRoleDropdown(false);
                      }}
                      className={`text-[10px] py-1 px-1.5 rounded font-medium text-center uppercase tracking-wider ${
                        currentStaff.role === role ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
