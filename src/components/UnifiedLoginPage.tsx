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
import { useLanguage } from "../lib/i18n";

interface UnifiedLoginPageProps {
  onLogin: (role: AppUserRole, counselor?: CounselorUser) => void;
}

export const UnifiedLoginPage: React.FC<UnifiedLoginPageProps> = ({
  onLogin,
}) => {
  const { t, lang } = useLanguage();
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
      const cleanEmail = email.trim().toLowerCase();

      // Find role from MOCK_USERS if known, or let backend determine
      const roles: AppUserRole[] = [
        "guru",
        "admin",
        "dinas-pendidikan",
        "dinas-perlindungan",
      ];

      let candidateRole: AppUserRole | undefined = undefined;
      for (const role of roles) {
        if (MOCK_USERS[role]?.email.toLowerCase() === cleanEmail) {
          candidateRole = role;
          break;
        }
      }

      // Authenticate via backend to obtain secure JWT token
      let authData: any = null;
      try {
        authData = await api.login({
          email: cleanEmail,
          password,
          role: candidateRole,
        });
      } catch (authErr: any) {
        setError(authErr.message || (lang === "en" ? "Invalid email or password." : "Email atau kata sandi salah."));
        return;
      }

      const userRole = (authData?.role || authData?.user?.role || candidateRole || "admin") as AppUserRole;
      const userName = authData?.user?.name || "Petugas";
      const userOrg = authData?.user?.organization || "Satuan Pendidikan";
      const userNip = authData?.user?.identifier?.replace("NIP: ", "") || "";
      const userAvatar = authData?.user?.avatar_url || authData?.user?.avatar || "";

      const counselor: CounselorUser | undefined =
        userRole === "guru"
          ? {
              id: authData?.user?.id || "usr-guru-01",
              name: userName,
              email: cleanEmail,
              role: "Guru Bimbingan Konseling (BK)",
              nip: userNip,
              avatar: userAvatar,
              schoolName: userOrg,
            }
          : undefined;

      onLogin(userRole, counselor);
    } catch (err) {
      setError(lang === "en" ? "An error occurred during login. Please try again." : "Terjadi kesalahan saat masuk. Silakan coba lagi.");
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
            <h1 className="text-xl font-extrabold">{t("login.title")}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t("login.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="name@school.sch.id"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t("login.password")}
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
                    <span>{t("login.verifying")}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{t("login.submit")}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials helper */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                {t("login.quickTitle")}
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("arrafinur1@gmail.com");
                    setPassword("11223344");
                    setError("");
                  }}
                  className="px-2.5 py-1.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer text-slate-700"
                >
                  <span className="font-bold block text-[11px]">Admin</span>
                  <span className="text-[10px] text-slate-500 font-mono">arrafinur1@gmail.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("arrafinur2@gmail.com");
                    setPassword("11223344");
                    setError("");
                  }}
                  className="px-2.5 py-1.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer text-slate-700"
                >
                  <span className="font-bold block text-[11px]">Guru BK</span>
                  <span className="text-[10px] text-slate-500 font-mono">arrafinur2@gmail.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("arrafinur3@gmail.com");
                    setPassword("11223344");
                    setError("");
                  }}
                  className="px-2.5 py-1.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer text-slate-700"
                >
                  <span className="font-bold block text-[11px]">Dinas Pendidikan</span>
                  <span className="text-[10px] text-slate-500 font-mono">arrafinur3@gmail.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("arrafinur4@gmail.com");
                    setPassword("11223344");
                    setError("");
                  }}
                  className="px-2.5 py-1.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer text-slate-700"
                >
                  <span className="font-bold block text-[11px]">Dinas Perlindungan</span>
                  <span className="text-[10px] text-slate-500 font-mono">arrafinur4@gmail.com</span>
                </button>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400 space-y-2">
              <p>{lang === "en" ? "Don't have an account? Contact System Admin to request staff access." : "Belum punya akun? Hubungi Admin Sistem untuk pengajuan akun petugas."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
