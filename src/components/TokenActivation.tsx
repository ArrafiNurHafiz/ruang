import React, { useState } from "react";
import {
  KeyRound,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  CreditCard,
  RefreshCw,
  Send,
} from "lucide-react";
import confetti from "canvas-confetti";
import { SchoolToken } from "../types";
import { api } from "../lib/api";
import { generateRecoveryKey } from "../utils/crypto";

interface TokenActivationProps {
  onTokenActivated: (token: SchoolToken) => void;
  onNavigateToReport: () => void;
}

export const TokenActivation: React.FC<TokenActivationProps> = ({
  onTokenActivated,
  onNavigateToReport,
}) => {
  const [step, setStep] = useState<number>(1);
  const [tokenInput, setTokenInput] = useState<string>("");
  const [selectedPresetToken, setSelectedPresetToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string>("");

  // Step 2: 6-digit PIN
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>("");

  // Step 3: Recovery Key
  const [recoveryKey, setRecoveryKey] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [activatedToken, setActivatedToken] = useState<SchoolToken | null>(
    null,
  );

  const handleSelectPreset = (code: string) => {
    setSelectedPresetToken(code);
    setTokenInput(code);
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim().toUpperCase();
    if (!cleanToken) return;

    setIsLoading(true);
    try {
      const found = await api.verifyToken(cleanToken);
      if (found.isActivated) {
        setTokenError(`Token ${cleanToken} sudah diaktivasi sebelumnya. Gunakan Kode Pemulihan untuk masuk.`);
        return;
      }
      setStep(2);
    } catch (err) {
      setTokenError("Kode Akses Siswa tidak valid atau tidak ditemukan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setPinError("PIN harus berupa 6 angka rahasia.");
      return;
    }
    if (pin !== confirmPin) {
      setPinError("Konfirmasi PIN tidak cocok dengan PIN pertama.");
      return;
    }

    setIsLoading(true);
    try {
      // Generate Recovery Key for Step 3
      const key = generateRecoveryKey();
      setRecoveryKey(key);

      const activated = await api.activateToken(tokenInput.toUpperCase(), btoa(pin));

      const targetToken: SchoolToken = {
        ...activated,
        tokenCode: activated.tokenCode,
        recoveryKey: key,
      };

      setActivatedToken(targetToken);
      onTokenActivated(targetToken);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#10b981", "#6366f1"],
      });
      
      setStep(3);
    } catch (err) {
      setTokenError("Gagal mengaktifkan token. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyRecoveryKey = () => {
    navigator.clipboard.writeText(recoveryKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

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
            <CreditCard className="w-3.5 h-3.5 text-sky-200" />
            <span>Kartu Fisik / Digital Sekolah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Aktivasi Token Siswa
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Aktivasi token verifikasi dari sekolah dalam 3 langkah sederhana
            untuk memastikan keamanan lokal tanpa mengirim identitas pribadi ke
            server.
          </p>
        </div>
      </div>

      {/* Stepper Visualizer */}
      <div>
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
          {[
            { step: 1, title: "1. Masukkan Token" },
            { step: 2, title: "2. Buat PIN 6-Digit" },
            { step: 3, title: "3. Simpan Pemulihan" },
          ].map((item) => (
            <div key={item.step} className="space-y-1.5">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  step >= item.step ? "bg-blue-600 shadow-xs" : "bg-slate-200"
                }`}
              />
              <span
                className={`block truncate ${step === item.step ? "text-blue-700 font-extrabold" : "text-slate-400 font-medium"}`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        {/* STEP 1: INPUT TOKEN */}
        {step === 1 && (
          <form
            onSubmit={handleStep1Submit}
            className="space-y-6 animate-fadeIn"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                <span>Langkah 1: Masukkan Kode Token Sekolah</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Token adalah kombinasi acak yang tercetak pada kartu privasi
                fisik yang dibagikan sekolah.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Nomor Token Kartu Siswa:
              </label>
              <input
                type="text"
                required
                value={tokenInput}
                onChange={(e) => { setTokenInput(e.target.value); setTokenError(""); }}
                placeholder="Contoh: TMG-SCH-8831"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono font-bold tracking-widest text-slate-900 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {tokenError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{tokenError}</div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={!tokenInput.trim()}
                className={`flex items-center gap-2 font-bold py-3 px-6 rounded-xl transition-all shadow-md ${
                  tokenInput.trim()
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span>Lanjut ke Buat PIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: BUAT PIN 6-DIGIT */}
        {step === 2 && (
          <form
            onSubmit={handleStep2Submit}
            className="space-y-6 animate-fadeIn"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <span>Langkah 2: Buat PIN 6-Digit Lokal</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                PIN ini hanya disimpan di memori browser perangkat Anda sendiri
                dan tidak pernah dikirim ke server.
              </p>
            </div>

            {/* Local Security Guarantee */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Privasi Mutlak PIN:</strong>
                <p className="text-slate-700">
                  Guru, staf sekolah, maupun developer Ruang Aman tidak memiliki
                  akses terhadap PIN ini.
                </p>
              </div>
            </div>

            {pinError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Buat PIN 6 Digit:
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl font-mono tracking-widest text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPin ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Konfirmasi PIN:
                </label>
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={6}
                  required
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xl font-mono tracking-widest text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm py-2 px-4 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="submit"
                disabled={pin.length !== 6 || confirmPin.length !== 6}
                className={`flex items-center gap-2 font-bold py-3 px-6 rounded-xl transition-all shadow-md ${
                  pin.length === 6 && confirmPin.length === 6
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span>Aktivasi &amp; Simpan Pemulihan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SIMPAN KODE PEMULIHAN */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Token Berhasil Diaktivasi!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Simpan kode pemulihan berikut jika Anda perlu mengakses akun
                dari perangkat lain atau jika lupa PIN.
              </p>
            </div>

            {/* Recovery Key Display Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase text-sky-400 font-bold">
                  KODE PEMULIHAN (RECOVERY KEY)
                </span>
                <span className="text-[11px] text-slate-400">
                  16 Karakter Rahasia
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <span className="font-mono font-bold text-sm sm:text-base text-sky-200 tracking-wider">
                  {recoveryKey}
                </span>
                <button
                  onClick={copyRecoveryKey}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey ? "Tersalin!" : "Salin"}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Catat kode ini di buku catatan pribadi atau simpan di pengelola
                kata sandi Anda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onNavigateToReport}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-101 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Mulai Buat Laporan Anonim Sekarang</span>
              </button>

              <button
                onClick={() => {
                  setStep(1);
                  setTokenInput("");
                  setPin("");
                  setConfirmPin("");
                }}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl transition-colors text-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Aktivasi Token Lain</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
