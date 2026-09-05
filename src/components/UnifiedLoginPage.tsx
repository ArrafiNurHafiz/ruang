import React, { useState } from "react";
import {
  ShieldCheck,
  LogIn,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { AppUserRole, CounselorUser } from "../types";
import { MOCK_USERS } from "../data/mockData";
import { api } from "../lib/api";

interface UnifiedLoginPageProps {
  onLogin: (role: AppUserRole, counselor?: CounselorUser) => void;
}

export const UnifiedLoginPage: React.FC<UnifiedLoginPageProps> = ({
  onLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 250));

      const roles: AppUserRole[] = [
        "guru",
        "admin",
        "dinas-pendidikan",
        "dinas-perlindungan",
      ];

      let matched: AppUserRole | null = null;
      let matchedUser: (typeof MOCK_USERS)[AppUserRole] | null = null;
      for (const role of roles) {
        const candidate = MOCK_USERS[role];
        if (
          candidate &&
          candidate.email.toLowerCase() === email.trim().toLowerCase()
        ) {
          matched = role;
          matchedUser = candidate;
          break;
        }
      }

      if (!matched || !matchedUser) {
        setError("User dengan email tersebut tidak terdaftar.");
        return;
      }

      // Authenticate via backend to obtain secure JWT token
      try {
        await api.login({
          email: email.trim().toLowerCase(),
          password,
          role: matched,
        });
      } catch (authErr: any) {
        setError(authErr.message || "Email atau password salah.");
        return;
      }

      const counselor: CounselorUser | undefined =
        matched === "guru"
          ? {
              id: matchedUser.id,
              name: matchedUser.name,
              email: matchedUser.email,
              role: "Guru Bimbingan Konseling (BK)",
              nip: matchedUser.identifier?.replace("NIP: ", "") || "",
              avatar: matchedUser.avatar || "",
              schoolName: matchedUser.organization,
            }
          : undefined;

      onLogin(matched, counselor);
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-center text-white">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-xl font-extrabold">Masuk ke TAMENG</h1>
            <p className="text-xs text-slate-400 mt-1">
              Satu akun untuk semua peran — Guru BK, Admin, Dinas
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="nama@sekolah.sch.id"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-[11px] text-slate-400 space-y-2">
              <p>Belum punya akun? Hubungi admin sekolah untuk pengajuan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
