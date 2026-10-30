import React from 'react';
import { BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR } from '../../utils/exportUtils.ts';

export const RecipeModal: React.FC = () => {
  const { selectedRecipeItem, setSelectedRecipeItem, rawMaterials } = useApp();

  if (!selectedRecipeItem) return null;

  const item = selectedRecipeItem;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 animate-in fade-in zoom-in-95 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Resep & Takaran Bahan Baku
              </h3>
              <p className="text-[11px] text-slate-400">Refood POS Recipe Matrix</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRecipeItem(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Dish Overview */}
        <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {item.name}
            </h4>
            <div className="text-xs text-orange-600 dark:text-orange-400 font-extrabold mt-0.5">
              Harga Jual: {formatIDR(item.price)} • HPP: {formatIDR(item.costPrice)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Porsi: {item.serves} • {item.calories} Kalori
            </div>
          </div>
        </div>

        {/* Ingredients & Stock Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Komposisi Bahan Baku (Pengurangan Otomatis per Pesanan):
          </h4>

          {item.recipe.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 italic">
              Menu ini dibuat tanpa bahan baku inventaris terpisah (siap saji).
            </p>
          ) : (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {item.recipe.map((ing) => {
                const stockItem = rawMaterials.find(m => m.id === ing.rawMaterialId);
                const currentStock = stockItem ? stockItem.currentStock : 0;
                const isShort = currentStock < ing.amountNeeded;

                return (
                  <div
                    key={ing.rawMaterialId}
                    className="p-3 flex items-center justify-between text-xs bg-white dark:bg-slate-850"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {ing.rawMaterialName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Dibutuhkan: <strong className="text-orange-600 font-semibold">{ing.amountNeeded} {ing.unit}</strong> per porsi
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 font-semibold">
                        {isShort ? (
                          <span className="text-red-500 flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> Stok Kritis ({currentStock} {ing.unit})
                          </span>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Stok Aman ({currentStock} {ing.unit})
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Supplier: {stockItem?.supplier || 'Gudang'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Culinary Notes */}
        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
          <div className="font-bold">💡 Standar Operasional Kuliner (SOP):</div>
          <div>{item.description}</div>
        </div>

        <button
          onClick={() => setSelectedRecipeItem(null)}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold"
        >
          Tutup Rincian Resep
        </button>
      </div>
    </div>
  );
};
