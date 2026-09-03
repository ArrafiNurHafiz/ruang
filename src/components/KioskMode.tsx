import React, { useState } from "react";
import {
  Monitor,
  KeyRound,
  Clock,
  ShieldAlert,
  Lock,
  ArrowRight,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck,
} from "lucide-react";

interface KioskModeProps {
  onStartKioskSession: (sessionCode: string) => void;
  isKioskActive: boolean;
  onEndKioskSession: () => void;
  onNavigateToReport: () => void;
  onNavigateToStatus: () => void;
}

export const KioskMode: React.FC<KioskModeProps> = ({
  onStartKioskSession,
  isKioskActive,
  onEndKioskSession,
  onNavigateToReport,
  onNavigateToStatus,
}) => {
  const [sessionCode, setSessionCode] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const sampleTUCodes = ["TU-SMAN1-2025", "TU-LABKOMP-88", "TU-PERPUS-01"];

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    const code = sessionCode.trim().toUpperCase();
    if (!code) {
      setErrorMsg("Masukkan kode sesi TU atau kode pemulihan Anda.");
      return;
    }
    // Validate: must be a known TU code or match recovery code pattern (word-word-word-number)
    const isValidTUCode = sampleTUCodes.includes(code);
    const isValidRecoveryPattern = /^[A-Z]+-[A-Z]+-[A-Z]+-\d{4}$/.test(code);
    if (!isValidTUCode && !isValidRecoveryPattern) {
      setErrorMsg("Kode sesi tidak valid. Gunakan kode TU dari petugas atau Kode Pemulihan tiket Anda.");
      return;
    }
    setErrorMsg("");
    onStartKioskSession(code);
  };

  if (isKioskActive) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] text-white p-6 sm:p-8 text-center space-y-2 border-b border-blue-400/30">
            <div className="w-14 h-14 bg-white/20 text-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/30 backdrop-blur-md shadow-lg">
              <Monitor className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase font-mono tracking-widest text-sky-200 font-bold">
              SESI AKTIF PERANGKAT BERSAMA
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Mode Kios Sekolah Sedang Berjalan
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
              Sistem akan menghapus seluruh data tampilan secara otomatis jika
              tidak ada aktivitas selama 3 menit.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={onNavigateToReport}
                className="p-5 rounded-2xl border-2 border-blue-600 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-all shadow-xs space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950 text-base">
                    1. Buat Laporan Cepat
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">
                  Kirim pengaduan perundungan/kekerasan secara instan tanpa
                  meninggalkan jejak di komputer ini.
                </p>
              </div>

              <div
                onClick={onNavigateToStatus}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base">
                    2. Cek Status Tiket
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-slate-600">
                  Pantau respons Guru BK atau lanjutkan percakapan 2-arah yang
                  sedang berlangsung.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">
                  Peringatan Keamanan Komputer Bersama:
                </span>
                <p className="text-slate-700">
                  Pastikan tidak ada orang lain di belakang Anda yang dapat
                  mengintip layar. Tekan tombol &quot;Selesai &amp;
                  Bersihkan&quot; saat Anda hendak meninggalkan komputer.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onEndKioskSession}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-red-600/20 hover:scale-101 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Akhiri Sesi &amp; Hapus Seluruh Memori</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-950/20 border border-blue-400/30">
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 800 400"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-50 100 C200 50 450 250 850 150"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
            <path
              d="M-50 200 C300 150 500 350 850 250"
              stroke="white"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium border border-white/25 backdrop-blur-md">
            <Monitor className="w-3.5 h-3.5 text-sky-200" />
            <span>Komputer Lab / Tablet Sekolah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Mode Kios (Perangkat Bersama)
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Dirancang khusus bagi siswa yang menggunakan komputer perpustakaan
            atau lab sekolah tanpa meninggalkan riwayat penelusuran.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
        {/* Features Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Batas Waktu 3 Menit</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Sesi terputus otomatis bila ditinggalkan tanpa aktivitas.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Zero-Storage Cache</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Tidak menyimpan cookie, password, ataupun histori browser.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Enkripsi Sesi Ephemeral</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Kunci enkripsi dihancurkan seketika saat sesi ditutup.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleStartSession} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Masukkan Kode Sesi Petugas TU atau Kode Pemulihan:
            </label>
            <input
              type="text"
              required
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              placeholder="Contoh: TU-SMAN1-2025 atau kata-kunci-pemulihan"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono font-bold tracking-wider text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-bold">{errorMsg}</p>
          )}

          {/* Quick Demo Sesi Codes */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 block">
              Gunakan Kode Sesi Demo Petugas TU:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleTUCodes.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSessionCode(code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    sessionCode === code
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-slate-100">
            <button
              type="submit"
              disabled={!sessionCode.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span>Mulai Sesi Bersih (3 Menit)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
