import React from 'react';
import { Printer, Download, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatIDR } from '../../utils/exportUtils.ts';

export const ReceiptModal: React.FC = () => {
  const { receiptModalOrder, setReceiptModalOrder } = useApp();

  if (!receiptModalOrder) return null;

  const order = receiptModalOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-850 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in zoom-in-95 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Struk Pembayaran Thermal / PDF
          </h3>
          <button
            onClick={() => setReceiptModalOrder(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Thermal Receipt Visual Paper */}
        <div className="bg-amber-50/50 dark:bg-slate-900 p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 font-mono text-xs space-y-3 text-slate-800 dark:text-slate-200 shadow-inner">
          <div className="text-center space-y-1 border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
            <div className="flex items-center justify-center gap-1.5 font-sans font-black text-sm text-orange-600">
              <UtensilsCrossed className="w-4 h-4" /> REFOOD POS
            </div>
            <div className="text-[10px] text-slate-500">Restoran Kuliner Khas Nusantara</div>
            <div className="text-[9px] text-slate-400">Jl. Malioboro No. 45, Yogyakarta</div>
            <div className="text-[9px] text-slate-400">Telp: 021-8849201 • NPWPD: 03.921.821.2-021</div>
          </div>

          <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
            <div className="flex justify-between">
              <span>No. Order:</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{new Date(order.timestamp).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Tipe:</span>
              <span>{order.tableOrTakeaway}</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span>{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>{order.cashierName}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-1.5 border-b border-dashed border-slate-300 dark:border-slate-700 pb-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between font-bold">
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span>{formatIDR(item.menuItem.price * item.quantity)}</span>
                </div>
                {item.spiceLevel && (
                  <div className="text-[9px] text-slate-400 pl-4">
                    Pedas: {item.spiceLevel}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatIDR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Diskon:</span>
                <span>-{formatIDR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Biaya Layanan (2%):</span>
              <span>{formatIDR(order.serviceFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>PB1 Pajak Resto (10%):</span>
              <span>{formatIDR(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed border-slate-300 dark:border-slate-700">
              <span>TOTAL BAYAR:</span>
              <span>{formatIDR(order.total)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-1">
              <span>Metode:</span>
              <span className="uppercase font-bold">{order.paymentMethod} (LUNAS)</span>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-dashed border-slate-300 dark:border-slate-700 text-[10px] text-slate-400">
            Terima kasih atas kunjungan Anda!<br />
            Semoga menikmati hidangan nusantara kami.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setReceiptModalOrder(null)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Thermal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
