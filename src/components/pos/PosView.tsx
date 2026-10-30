import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Plus,
  BookOpen,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR } from '../../utils/exportUtils.ts';
import { FoodCategory, MenuItem } from '../../types/index.ts';
import { getThemeClasses } from '../../utils/themeHelper.ts';

const CATEGORIES: FoodCategory[] = [
  'Semua',
  'Makanan Utama',
  'Ayam & Bebek',
  'Sate & Bakso',
  'Sayur & Sup',
  'Minuman Tradisional',
  'Dessert & Camilan',
];

export const PosView: React.FC = () => {
  const {
    menuItems,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    addToCart,
    setSelectedRecipeItem,
    playSound,
    themeColor,
  } = useApp();

  const theme = getThemeClasses(themeColor);
  const [selectedSpiceModalItem, setSelectedSpiceModalItem] = useState<MenuItem | null>(null);
  const [spiceLevel, setSpiceLevel] = useState<'Sedang' | 'Pedas' | 'Ekstra Pedas' | 'Tidak Pedas'>('Sedang');
  const [customNote, setCustomNote] = useState('');

  // Filter items based on category and search query
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.indonesianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Trending items for the bottom section
  const trendingItems = menuItems.filter((m) => m.isTopWeek || m.isTopMonth || m.rating >= 4.8).slice(0, 4);

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // If it has spice customization like Rendang or Ayam Geprek, offer modal or quick add
    if (item.category === 'Makanan Utama' || item.category === 'Ayam & Bebek') {
      setSelectedSpiceModalItem(item);
    } else {
      addToCart(item);
    }
  };

  const confirmAddWithSpice = () => {
    if (selectedSpiceModalItem) {
      addToCart(selectedSpiceModalItem, spiceLevel, customNote);
      setSelectedSpiceModalItem(null);
      setCustomNote('');
      setSpiceLevel('Sedang');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-7 custom-scrollbar pb-24 lg:pb-8">
      {/* Hero Promotional Banner matching reference image */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 dark:from-slate-800 dark:via-slate-800/90 dark:to-orange-950/30 border border-orange-200/60 dark:border-slate-700 p-6 md:p-8 shadow-sm">
        <div className="relative z-10 max-w-lg space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 tracking-wide uppercase">
              Promo Spesial Hari Ini
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-500 text-white shadow-sm">
              <Sparkles className="w-3 h-3" /> GRATIS Ongkir
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Eksplorasi Kelezatan Menu Nusantara Hari Ini
          </h1>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Sajian autentik dengan 100% rempah pilihan khas Indonesia. Dilengkapi takaran resep presisi & sinkronisasi stok bahan otomatis.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                playSound('click');
                setSelectedCategory('Semua');
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHover} shadow-md shadow-orange-500/20 transition-all flex items-center gap-2`}
            >
              Lihat Semua Menu
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ⚡ Transaksi Cepat & Otomatis
            </span>
          </div>
        </div>

        {/* Decorative background food imagery illustration matching mockup layout */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5 pointer-events-none hidden sm:block">
          <div className="relative w-full h-full flex items-center justify-end pr-6">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 rotate-6 transform hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                alt="Promo Refood"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 right-32 w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 -rotate-12">
              <img
                src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80"
                alt="Minuman Segar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
              Kategori Kuliner Nusantara
            </h2>
          </div>
          <span className="text-xs text-slate-400">{filteredItems.length} menu tersedia</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  playSound('click');
                  setSelectedCategory(category);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? `${theme.primaryBg} text-white shadow-md shadow-orange-500/20`
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Menu Grid: "Based In The Type Of Food You Like" matching reference */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
              Menu Terpilih Sesuai Selera Anda
            </h2>
            <p className="text-xs text-slate-400">Pilihan hidangan tradisional favorit pelanggan restoran</p>
          </div>
          <button
            onClick={() => setSelectedCategory('Semua')}
            className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-sm text-slate-500">Tidak ada menu yang sesuai dengan filter pencarian "{searchQuery}".</p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
              }}
              className="mt-3 px-4 py-1.5 text-xs rounded-full bg-orange-500 text-white font-medium"
            >
              Reset Kategori
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image and Badges */}
                <div className="relative h-36 overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 shadow-sm backdrop-blur-sm">
                      ★ {item.rating}
                    </span>
                    {item.isTopWeek && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500 text-white shadow-sm flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Favorit Minggu Ini
                      </span>
                    )}
                  </div>

                  {/* View Recipe Button */}
                  {item.recipe.length > 0 && (
                    <button
                      onClick={() => {
                        playSound('click');
                        setSelectedRecipeItem(item);
                      }}
                      className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg text-[10px] font-semibold bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm flex items-center gap-1 transition-colors"
                      title="Lihat Takaran Resep & Bahan"
                    >
                      <BookOpen className="w-3 h-3 text-orange-400" /> Resep
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      {item.category}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Meta stats */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
                    <span>🔥 {item.calories} kkal</span>
                    <span>🍽️ {item.serves}</span>
                  </div>

                  {/* Price & Add to Cart button */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs text-slate-400 block font-normal leading-none mb-0.5">Harga</span>
                      <span className="text-base font-extrabold text-orange-600 dark:text-orange-400">
                        {formatIDR(item.price)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(item, e)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white ${theme.primaryBg} ${theme.primaryHover} shadow-sm active:scale-95 transition-all flex items-center gap-1`}
                      aria-label={`Tambah ${item.name} ke pesanan`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: "Trending Orders" matching bottom cards from reference */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
              Trending Orders (Pesanan Paling Populer)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Update penjualan real-time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {trendingItems.map((item, idx) => {
            const isFeaturedOrange = idx === 1; // card with solid orange background from reference image!

            return (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 flex items-center gap-4 relative overflow-hidden group shadow-sm hover:shadow-md ${
                  isFeaturedOrange
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/20'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                {/* Circular image matching reference */}
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white/80 shadow-md group-hover:scale-105 transition-transform">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isFeaturedOrange
                          ? 'bg-white/20 text-white'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
                      }`}
                    >
                      {item.isTopMonth ? 'Top of the month' : 'Top of the week'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold truncate leading-tight">{item.name}</h4>

                  <div
                    className={`text-[10px] mt-1 flex items-center gap-2 ${
                      isFeaturedOrange ? 'text-orange-100' : 'text-slate-400'
                    }`}
                  >
                    <span>{item.calories} Cal</span>
                    <span>•</span>
                    <span>{item.serves}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`text-sm font-extrabold ${
                        isFeaturedOrange ? 'text-white' : 'text-orange-600 dark:text-orange-400'
                      }`}
                    >
                      {formatIDR(item.price)}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                        isFeaturedOrange
                          ? 'bg-white text-orange-600'
                          : 'bg-orange-50 text-orange-600 dark:bg-slate-700 dark:text-white'
                      }`}
                    >
                      + Order
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spice level & Notes Modal */}
      {selectedSpiceModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-850 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Kustomisasi {selectedSpiceModalItem.name}
                </h3>
                <span className="text-xs text-orange-600 font-extrabold">
                  {formatIDR(selectedSpiceModalItem.price)}
                </span>
              </div>
              <button
                onClick={() => setSelectedSpiceModalItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Tingkat Kepedasan:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Tidak Pedas', 'Sedang', 'Pedas', 'Ekstra Pedas'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      spiceLevel === level
                        ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {level === 'Ekstra Pedas' ? '🔥 Ekstra Pedas' : level === 'Pedas' ? '🌶️ Pedas' : level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Catatan Khusus (Opsional):
              </label>
              <input
                type="text"
                placeholder="Contoh: Kuah dipisah, jangan pakai bawang goreng..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSpiceModalItem(null)}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmAddWithSpice}
                className={`flex-1 py-2.5 text-xs font-bold text-white rounded-xl ${theme.primaryBg} ${theme.primaryHover} shadow-md`}
              >
                Tambahkan ke Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
