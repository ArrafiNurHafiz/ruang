import React from "react";
import {
  Phone,
  AlertOctagon,
  X,
  MessageSquare,
  ShieldAlert,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { EMERGENCY_CONTACTS } from "../data/mockData";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickExit: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onQuickExit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-emergency-title"
      >
        {/* Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="modal-emergency-title" className="text-lg font-bold">
                Kontak Bantuan Darurat 24 Jam
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Gunakan saat ada ancaman fisik langsung atau krisis keselamatan
              </p>
            </div>
          </div>
          <button
            id="close-emergency-modal-btn"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Safety Protocol Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Panduan Keselamatan Mendesak:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>
                Segera cari tempat yang ramai (perpustakaan, ruang guru, pos
                satpam).
              </li>
              <li>
                Jangan merespons provokasi fisik terduga pelaku secara
                sendirian.
              </li>
              <li>
                Tekan nomor panggilan cepat di bawah untuk terhubung langsung.
              </li>
            </ul>
          </div>

          {/* Contact Cards */}
          <div className="space-y-2.5">
            {EMERGENCY_CONTACTS.map((item, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl p-3.5 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{item.description}</p>
                  {item.whatsapp !== "-" && (
                    <p className="text-xs text-blue-700 font-medium flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>WA: {item.whatsapp}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${item.number.replace(/\s+/g, "")}`}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Panggil {item.number}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Semua panggilan dilindungi kerahasiaan hukum anak</span>
            </div>
            <button
              id="emergency-modal-quick-exit"
              onClick={onQuickExit}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
            >
              Keluar Cepat dari Aplikasi (ESC)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
