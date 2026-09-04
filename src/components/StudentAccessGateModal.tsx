import React, { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Building2,
  Sparkles,
  School,
  FileText,
  UserCheck,
  Zap,
  HelpCircle,
} from "lucide-react";
import { api } from "../lib/api";
import { SchoolToken, StudentSession } from "../types";

interface StudentAccessGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: SchoolToken[];
  onVerifyAndLogin: (token: SchoolToken) => void;
  onNavigateToReport: () => void;
}

export const StudentAccessGateModal: React.FC<StudentAccessGateModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onVerifyAndLogin,
  onNavigateToReport,
}) => {
  const [code, setCode] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedToken, setVerifiedToken] = useState<SchoolToken | null>(null);

  if (!isOpen) return null;

  // Available tokens for quick-fill testing
  const availableTokens = tokens.filter(
    (t) => !t.isActivated || t.status === "Tersedia",
  );
  const demoTokens = (
    availableTokens.length > 0 ? availableTokens : tokens
  ).slice(0, 4);

  const handleQuickSelect = (tok: SchoolToken) => {
    setCode(tok.tokenCode);
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg(
        "Harap masukkan kode akses yang diberikan oleh pihak sekolah.",
      );
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    try {
      const matched = await api.verifyToken(cleanCode);
      
      if (matched.status === "Kedaluwarsa") {
        setErrorMsg(
          "Kode akses ini telah kedaluwarsa atau dinonaktifkan oleh admin sekolah. Silakan minta kode baru ke Guru BK / Satgas.",
        );
        setIsVerifying(false);
        return;
      }

      setVerifiedToken(matched);
      onVerifyAndLogin(matched);
    } catch (err) {
      setErrorMsg(
        "Kode akses tidak terdaftar di database sekolah. Pastikan Anda memasukkan kode resmi yang dibagikan wali kelas / Satgas.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleProceedToReport = () => {
    onClose();
    onNavigateToReport();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 rounded-2xl border border-white/20 backdrop-blur-md shadow-inner">
              <KeyRound className="w-7 h-7 text-sky-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-300/30 text-[11px] font-bold text-blue-100 mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Sistem Verifikasi Siswa Sah</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Login Akses Kode Sekolah
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-blue-100 mt-3 leading-relaxed">
            Untuk mencegah penyusup dan laporan palsu dari pihak luar, sistem
            ini hanya menerima aduan dari siswa yang memiliki kode akses resmi
            sekolah.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!verifiedToken ? (
            <>
              {/* Security guarantee note */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sky-950">
                  <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Jaminan Privasi &amp; Tanpa Nama (ZKP)</span>
                </div>
                <p className="leading-relaxed text-slate-600">
                  Kode ini{" "}
                  <strong>TIDAK terhubung dengan nama atau NISN Anda</strong>.
                  Sistem hanya memvalidasi bahwa Anda adalah siswa sah dari
                  sekolah terdaftar secara kriptografis tanpa membocorkan
                  identitas.
                </p>
              </div>

              {/* Form Input Code */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Masukkan Kode Akses Siswa (8 - 14 Karakter)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setErrorMsg("");
                      }}
                      placeholder="Contoh: SCH-X1-8831"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-300 focus:border-blue-600 rounded-2xl text-slate-900 font-mono font-bold text-base uppercase tracking-wider focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal"
                    />
                    <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>

                  {errorMsg && (
                    <div className="mt-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || !code.trim()}
                  className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memverifikasi Otoritas Sekolah...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verifikasi &amp; Masuk Melapor</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo / Sample Codes for Easy Testing */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Coba Kode Contoh yang Dibuat Sekolah:</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    1-Klik untuk coba
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {demoTokens.map((t) => (
                    <button
                      key={t.tokenCode}
                      type="button"
                      onClick={() => handleQuickSelect(t)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        code === t.tokenCode
                          ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-slate-50/70 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono font-bold text-blue-700">
                        <span>{t.tokenCode}</span>
                        <span className="text-[10px] font-sans font-semibold px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-600">
                          {t.status || (t.isActivated ? "Aktif" : "Tersedia")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Kode Berhasil Diverifikasi!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Anda telah terotentikasi sebagai siswa resmi yang terlindungi.
                  Laporan Anda dijamin aman dari penyusup luar dan identitas
                  Anda 100% anonim.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Status Proteksi:
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    ✓ Siswa Terverifikasi Resmi
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Kode Akses Sesi:
                  </span>
                  <span className="text-xs font-mono font-extrabold text-blue-700">
                    {verifiedToken.tokenCode}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Status Proteksi:
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    🛡️ Lolos Verifikasi Anti-Penyusup
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToReport}
                  className="flex-1 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Mulai Tulis Laporan Sekarang</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup &amp; Jelajahi Portal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3.5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-slate-400" />
            <span>Satgas PPKSP SMA Negeri 1 Jakarta</span>
          </span>
          <span className="text-blue-600 font-medium">
            Bebas Pelacak &amp; Zero-Knowledge
          </span>
        </div>
      </div>
    </div>
  );
};
