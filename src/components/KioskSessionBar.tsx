import React from "react";
import { Clock, RefreshCw, Trash2, ShieldAlert } from "lucide-react";

interface KioskSessionBarProps {
  secondsLeft: number;
  onResetTimer: () => void;
  onEndKioskSession: () => void;
}

export const KioskSessionBar: React.FC<KioskSessionBarProps> = ({
  secondsLeft,
  onResetTimer,
  onEndKioskSession,
}) => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLow = secondsLeft <= 45;

  // Percentage for progress bar
  const pct = Math.max(0, Math.min(100, (secondsLeft / 180) * 100));

  return (
    <div
      className={`sticky top-16 z-30 px-4 py-2.5 transition-colors border-b shadow-sm ${
        isLow
          ? "bg-rose-900 text-rose-50 border-rose-800 animate-pulse"
          : "bg-slate-900 text-slate-100 border-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-teal-500/20 text-teal-300">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px] text-teal-400">
              Mode Kios Aktif
            </span>
            <span className="mx-2 text-slate-500">|</span>
            <span className="text-slate-300">
              Perangkat Bersama (Tanpa Rekam Jejak / Auto-Purge dalam 3 Menit)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Timer Pill */}
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            <Clock
              className={`w-3.5 h-3.5 ${isLow ? "text-rose-400 animate-spin" : "text-teal-400"}`}
            />
            <span className="font-mono font-bold text-xs">
              Sisa Waktu: {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </span>
            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden ml-1">
              <div
                className={`h-full transition-all duration-1000 ${isLow ? "bg-rose-500" : "bg-teal-400"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Reset / Extend Time */}
          <button
            id="kiosk-extend-timer-btn"
            onClick={onResetTimer}
            title="Tambah Waktu Sesi (+3 Menit)"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>+3 Mnt</span>
          </button>

          {/* End Session & Wipe */}
          <button
            id="kiosk-end-session-btn"
            onClick={onEndKioskSession}
            title="Akhiri Sesi Sekarang & Hapus Semua Cache"
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Trash2 className="w-3 h-3" />
            <span>Selesai & Bersihkan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
