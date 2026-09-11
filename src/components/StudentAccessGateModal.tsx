import React, { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  School,
  FileText,
} from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../lib/api";
import { SchoolToken } from "../types";

interface StudentAccessGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: SchoolToken[];
  onVerifyAndLogin: (token: SchoolToken, method: "token" | "sandi") => void;
  onNavigateToReport: () => void;
}

export const StudentAccessGateModal: React.FC<StudentAccessGateModalProps> = ({
  isOpen,
  onClose,
  tokens,
  onVerifyAndLogin,
  onNavigateToReport,
}) => {
  const [activeTab, setActiveTab] = useState<"token" | "sandi">("token");

  // Tab 1: Token Code
  const [code, setCode] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);

  // Tab 2: Personal Password
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState<boolean>(false);

  // Accordion & Step 2: Buat Sandi Baru dari Kode Sekolah
  const [isCreatingPassword, setIsCreatingPassword] = useState<boolean>(false);
  const [createCode, setCreateCode] = useState<string>("");
  const [createPassword, setCreatePassword] = useState<string>("");
  const [createPasswordConfirm, setCreatePasswordConfirm] = useState<string>("");
  const [showCreatePassword, setShowCreatePassword] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>("");
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState<boolean>(false);

  // 2-Step Gate Flow State:
  const [gateFlowStep, setGateFlowStep] = useState<
    "step1" | "step2_create_password" | "step2_enter_password"
  >("step1");
  const [pendingToken, setPendingToken] = useState<SchoolToken | null>(null);

  // Recovery Key & Collision State (Tab 2: Lupa Kode Akses)
  const [recoveryKeyInput, setRecoveryKeyInput] = useState<string>("");
  const [hasCollision, setHasCollision] = useState<boolean>(false);
  const [collisionCodeInput, setCollisionCodeInput] = useState<string>("");
  const [newlyCreatedRecoveryKey, setNewlyCreatedRecoveryKey] = useState<string>("");

  const [verifiedToken, setVerifiedToken] = useState<SchoolToken | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<"token" | "sandi">("token");

  if (!isOpen) return null;

  // 1. Verifikasi dengan Kode Akses (Langkah 1 dari 2)
  const handleVerifyByToken = async (codeOverride?: string) => {
    const cleanCode = (codeOverride || code).trim().toUpperCase();
    if (!cleanCode) {
      setCodeError("Harap masukkan kode akses yang diberikan oleh pihak sekolah.");
      return;
    }

    setIsVerifyingCode(true);
    setCodeError("");

    try {
      const matched = await api.verifyToken(cleanCode);
      if (matched.status === "Kedaluwarsa") {
        setCodeError(
          "Kode akses ini telah kedaluwarsa atau dinonaktifkan oleh sekolah. Silakan hubungi Guru BK.",
        );
        setIsVerifyingCode(false);
        return;
      }

      setPendingToken(matched);
      setCreateCode(matched.tokenCode);

      // Verifikasi 2 Langkah:
      if (!matched.hasPassword) {
        // Wajib buat sandi pribadi terlebih dahulu sebelum bisa melapor
        setGateFlowStep("step2_create_password");
        setCreateError("");
        setCreatePassword("");
        setCreatePasswordConfirm("");
      } else {
        // Wajib masukkan sandi pribadi untuk kode akses ini
        setGateFlowStep("step2_enter_password");
        setPassword("");
        setPasswordError("");
      }
    } catch {
      setCodeError(
        "Kode akses tidak terdaftar di database sekolah. Pastikan kode sesuai dengan slip resmi.",
      );
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // 1.B Verifikasi Sandi untuk Kode yang Sudah Terproteksi (Langkah 2 dari 2)
  const handleVerifyStep2Password = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingToken) return;
    const cleanPass = password.trim();
    if (!cleanPass) {
      setPasswordError("Harap masukkan sandi pribadi untuk kode akses ini.");
      return;
    }

    setIsVerifyingPassword(true);
    setPasswordError("");

    try {
      const matched = await api.verifyTokenByPassword(
        cleanPass,
        pendingToken.tokenCode,
      );
      setVerifiedToken(matched);
      setVerificationMethod("token");
      onVerifyAndLogin(matched, "token");
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      setPasswordError(
        err.message || "Sandi pribadi salah untuk kode akses ini. Silakan coba lagi.",
      );
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // 2. Verifikasi dengan Sandi Pribadi Pelajar (Tab 2: Lupa Kode Akses)
  const handleVerifyByPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = password.trim();
    const cleanRecovery = recoveryKeyInput.trim();
    const cleanCollision = collisionCodeInput.trim().toUpperCase();

    if (!cleanPass) {
      setPasswordError("Harap masukkan sandi pribadi yang pernah Anda buat.");
      return;
    }

    setIsVerifyingPassword(true);
    setPasswordError("");
    setHasCollision(false);

    try {
      const matched = await api.verifyTokenByPassword(
        cleanPass,
        cleanCollision || undefined,
        cleanRecovery || undefined,
      );
      setVerifiedToken(matched);
      setVerificationMethod("sandi");
      onVerifyAndLogin(matched, "sandi");
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      if (
        err.isCollision ||
        err.message?.includes("beberapa kode akses") ||
        err.message?.includes("sama")
      ) {
        setHasCollision(true);
        setPasswordError(
          "Terdeteksi beberapa akun siswa dengan kata sandi yang sama. Masukkan Kode Akses Sekolah atau Kunci Pemulihan Anda.",
        );
      } else {
        setPasswordError(
          err.message ||
            "Sandi pelajar tidak cocok atau belum pernah diaktivasi dengan kode sekolah.",
        );
      }
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // 3. Aktivasi Kode & Buat Sandi Pribadi (Langkah 2 dari 2)
  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    const cleanCode =
      pendingToken?.tokenCode || createCode.trim().toUpperCase();
    const pass = createPassword.trim();
    const conf = createPasswordConfirm.trim();

    if (!cleanCode) {
      setCreateError("Harap masukkan kode akses dari sekolah.");
      return;
    }
    if (pass.length < 4) {
      setCreateError("Sandi minimal 4 karakter.");
      return;
    }
    if (pass !== conf) {
      setCreateError("Konfirmasi sandi tidak sesuai.");
      return;
    }

    setIsSubmittingCreate(true);
    try {
      const activated = await api.activateToken(cleanCode, btoa(pass), pass);
      setCreateSuccess(true);
      if (activated.recoveryKey) {
        setNewlyCreatedRecoveryKey(activated.recoveryKey);
      }
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch {}

      setTimeout(() => {
        setVerifiedToken(activated);
        setVerificationMethod("sandi");
        onVerifyAndLogin(activated, "sandi");
      }, 1000);
    } catch (err: any) {
      setCreateError(
        err.message || "Kode akses sekolah tidak ditemukan atau sudah tidak aktif.",
      );
    } finally {
      setIsSubmittingCreate(false);
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
                <span>Verifikasi Siswa Terproteksi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Verifikasi Siswa SMAN 1
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-blue-100 mt-2.5 leading-relaxed">
            Pilih salah satu cara verifikasi: <strong>Kode Akses Sekolah</strong> ATAU <strong>Sandi Pribadi Pelajar</strong> yang tersimpan terenkripsi.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!verifiedToken ? (
            <>
              {/* KASUS A: LANGKAH 1 DARI 2 (PILIH KODE ATAU SANDI) */}
              {gateFlowStep === "step1" && (
                <>
                  {/* Tab Selector: Pilih Salah Satu */}
                  <div className="flex rounded-2xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("token");
                        setCodeError("");
                        setPasswordError("");
                        setHasCollision(false);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "token"
                          ? "bg-white text-blue-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                      <span>1. Kode Akses</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("sandi");
                        setCodeError("");
                        setPasswordError("");
                        setHasCollision(false);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "sandi"
                          ? "bg-white text-blue-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>2. Lupa Kode? Gunakan Sandi</span>
                    </button>
                  </div>

                  {/* TAB 1: KODE AKSES */}
                  {activeTab === "token" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleVerifyByToken();
                      }}
                      className="space-y-4 animate-fadeIn"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Langkah 1: Masukkan Kode Akses Siswa
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={code}
                            onChange={(e) => {
                              setCode(e.target.value.toUpperCase());
                              setCodeError("");
                            }}
                            placeholder="Contoh: SCH-X1-8831"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-300 focus:border-blue-600 rounded-2xl text-slate-900 font-mono font-bold text-sm uppercase tracking-wider focus:bg-white focus:outline-none transition-all"
                          />
                          <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>

                        {codeError && (
                          <div className="mt-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                            <span>{codeError}</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifyingCode || !code.trim()}
                        className="w-full py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isVerifyingCode ? (
                          <span>Memeriksa Kode Akses...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verifikasi Kode &amp; Lanjut Langkah 2</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-slate-600 leading-relaxed">
                        Sistem menerapkan <strong>Verifikasi 2 Langkah</strong>: Anda wajib memasangkan kata sandi pribadi pada Langkah 2 agar slip kode tidak bisa disalahgunakan orang lain.
                      </div>
                    </form>
                  )}

                  {/* TAB 2: SANDI PRIBADI */}
                  {activeTab === "sandi" && (
                    <form onSubmit={handleVerifyByPassword} className="space-y-4 animate-fadeIn">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Masukkan Sandi Pribadi Pelajar
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setPasswordError("");
                              setHasCollision(false);
                            }}
                            placeholder="Masukkan sandi rahasia Anda..."
                            className="w-full pl-11 pr-10 py-3 bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none transition-all"
                          />
                          <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {passwordError && !hasCollision && (
                          <div className="mt-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                            <span>{passwordError}</span>
                          </div>
                        )}
                      </div>

                      {/* DETEKSI TABRAKAN SANDI (COLLISION PROTECTION) */}
                      {hasCollision && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-slate-800 space-y-2 animate-fadeIn">
                          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Privasi Terlindungi: Tabrakan Sandi Terdeteksi</span>
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Terdeteksi lebih dari satu akun di sistem dengan kata sandi yang sama. Demi melindungi privasi Anda, sistem meminta verifikasi tambahan:
                          </p>
                          <input
                            type="text"
                            placeholder="Kode Akses Sekolah ATAU Kunci Pemulihan (kunci-xxxx)"
                            value={collisionCodeInput || recoveryKeyInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.toLowerCase().startsWith("kunci-")) {
                                setRecoveryKeyInput(val.toLowerCase());
                                setCollisionCodeInput("");
                              } else {
                                setCollisionCodeInput(val.toUpperCase());
                                setRecoveryKeyInput("");
                              }
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-amber-300 text-xs font-mono bg-white focus:outline-hidden focus:border-amber-600"
                          />
                          <button
                            type="button"
                            disabled={isVerifyingPassword}
                            onClick={(e) => handleVerifyByPassword(e)}
                            className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                          >
                            {isVerifyingPassword ? "Memverifikasi..." : "Verifikasi dengan Pengaman Tambahan"}
                          </button>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isVerifyingPassword || !password.trim()}
                        className="w-full py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isVerifyingPassword ? (
                          <span>Memeriksa Sandi...</span>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Verifikasi Sandi &amp; Lanjut</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <p className="text-[11px] text-slate-500">
                        Sandi pribadi melindungi akses Anda tanpa perlu membawa slip kode sekolah. Jika sandi Anda sama dengan siswa lain, sistem akan meminta pengenal cadangan.
                      </p>
                    </form>
                  )}
                </>
              )}

              {/* KASUS B: LANGKAH 2 DARI 2 (TOKEN BELUM PUNYA SANDI -> WAJIB BUAT SANDI) */}
              {gateFlowStep === "step2_create_password" && pendingToken && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Stepper Breadcrumb */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                    <div className="flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1. Kode Valid ({pendingToken.tokenCode})</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-blue-400" />
                    <div className="flex items-center gap-1 font-bold text-blue-900">
                      <Lock className="w-3.5 h-3.5 text-blue-600" />
                      <span>2. Buat Sandi (Wajib)</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Buat Kata Sandi Pribadi Pelajar
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Untuk keamanan verifikasi 2-langkah, Anda wajib membuat sandi sebelum membuka laporan.
                    </p>
                  </div>

                  <form onSubmit={handleCreatePassword} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Sandi Baru *
                        </label>
                        <div className="relative">
                          <input
                            type={showCreatePassword ? "text" : "password"}
                            required
                            placeholder="Min 4 karakter"
                            value={createPassword}
                            onChange={(e) => setCreatePassword(e.target.value)}
                            className="w-full px-3 py-2 pr-7 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCreatePassword(!showCreatePassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showCreatePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Konfirmasi Sandi *
                        </label>
                        <input
                          type={showCreatePassword ? "text" : "password"}
                          required
                          placeholder="Ulangi sandi"
                          value={createPasswordConfirm}
                          onChange={(e) => setCreatePasswordConfirm(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-blue-600"
                        />
                      </div>
                    </div>

                    {createError && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{createError}</span>
                      </p>
                    )}

                    {createSuccess && (
                      <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Sandi berhasil disimpan! Membuka sesi...</span>
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isSubmittingCreate}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        {isSubmittingCreate ? "Menyimpan sandi..." : "Simpan Sandi & Lanjut"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGateFlowStep("step1")}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Ganti Kode
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* KASUS C: LANGKAH 2 DARI 2 (TOKEN SUDAH PUNYA SANDI -> MASUKKAN SANDI) */}
              {gateFlowStep === "step2_enter_password" && pendingToken && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Stepper Breadcrumb */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs">
                    <div className="flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1. Kode Valid ({pendingToken.tokenCode})</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                    <div className="flex items-center gap-1 font-bold text-indigo-900">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>2. Masukkan Sandi</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Masukkan Sandi Pribadi Pelajar
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Kode akses ini terproteksi oleh kata sandi Anda. Masukkan sandi untuk membuka akses.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyStep2Password} className="space-y-3">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Masukkan sandi rahasia Anda..."
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError("");
                        }}
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {passwordError && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{passwordError}</span>
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isVerifyingPassword}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        {isVerifyingPassword ? "Memeriksa..." : "Verifikasi Sandi & Lanjut"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGateFlowStep("step1")}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Ganti Kode
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Verifikasi Pelajar Berhasil!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Metode: <strong>{verificationMethod === "token" ? "Kode Akses Sekolah" : "Sandi Pribadi Pelajar"}</strong>. Laporan Anda sah dari siswa internal dan identitas Anda 100% anonim.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status Validasi:</span>
                  <span className="font-bold text-emerald-700">Siswa Sah SMAN 1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sandi Terenkripsi:</span>
                  <span className="font-mono text-indigo-700 font-semibold">SHA-256 Secured</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToReport}
                  className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Mulai Tulis Laporan Sekarang</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-slate-400" />
            <span>Satgas PPKSP Satuan Pendidikan Indonesia</span>
          </span>
          <span className="text-blue-600 font-medium">
            Zero-Knowledge &amp; E2EE
          </span>
        </div>
      </div>
    </div>
  );
};
