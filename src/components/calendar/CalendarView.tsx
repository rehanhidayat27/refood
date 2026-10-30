import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  Trash2,
  Tag,
  CheckCircle2,
  Truck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { CalendarEvent } from '../../types/index.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent, playSound, themeColor } = useApp();
  const theme = getThemeClasses(themeColor);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-10-31');
  const [time, setTime] = useState('09:00 WIB');
  const [type, setType] = useState<CalendarEvent['type']>('restock');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');

  const getTypeBadge = (eventType: CalendarEvent['type']) => {
    switch (eventType) {
      case 'restock':
        return {
          icon: Truck,
          label: 'Pasokan / Restock',
          classes: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
        };
      case 'promo':
        return {
          icon: Sparkles,
          label: 'Acara Promo',
          classes: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
        };
      case 'maintenance':
        return {
          icon: Wrench,
          label: 'Perawatan Dapur',
          classes: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
        };
      case 'shift':
      default:
        return {
          icon: User,
          label: 'Shift Kerja Kasir',
          classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        };
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCalendarEvent({
      title,
      date,
      time,
      type,
      description,
      assignee: assignee || 'Staff Refood POS',
    });

    playSound('pay');
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setAssignee('');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 custom-scrollbar pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Manajemen Jadwal Restoran
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Kalender Jadwal & Aktivitas Otomatis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jadwalkan jadwal penerimaan pasokan bahan baku, pergantian shift kasir, dan promo berkala secara terpusat.
          </p>
        </div>

        <button
          onClick={() => {
            playSound('click');
            setIsModalOpen(true);
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHover} shadow-md shadow-orange-500/20 flex items-center gap-2 self-start sm:self-auto`}
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Aktivitas</span>
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calendarEvents.map((event) => {
          const typeInfo = getTypeBadge(event.type);
          const Icon = typeInfo.icon;

          return (
            <div
              key={event.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-600"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${typeInfo.classes}`}
                  >
                    <Icon className="w-3 h-3" /> {typeInfo.label}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {event.title}
                  </h3>
                </div>

                <button
                  onClick={() => deleteCalendarEvent(event.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  title="Hapus Jadwal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {event.description}
              </p>

              <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <CalendarIcon className="w-3.5 h-3.5 text-orange-500" />
                  {event.date} • {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {event.assignee}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Buat Jadwal Baru Restoran
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Aktivitas:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengiriman Daging Sapi & Santan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal:
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jam / Waktu:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="08:30 WIB"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kategori Jadwal:
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CalendarEvent['type'])}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="restock">Pasokan / Restock Bahan Baku</option>
                  <option value="shift">Shift Kasir / Petugas POS</option>
                  <option value="promo">Promo & Diskon Menu</option>
                  <option value="maintenance">Sanitasi & Perawatan Dapur</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Penanggung Jawab (Assignee):
                </label>
                <input
                  type="text"
                  placeholder="Nama Kasir / Petugas Dapur"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Keterangan:
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruksi khusus pelaksanaan jadwal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-white font-bold ${theme.primaryBg} ${theme.primaryHover} shadow-md`}
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
