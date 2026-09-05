import React from "react";
import {
  ShieldCheck,
  Send,
  KeyRound,
  Monitor,
  Search,
  Newspaper,
  HelpCircle,
  PhoneCall,
  BookOpen,
  User,
  UserCheck,
  LogOut,
  EyeOff,
  AlertTriangle,
  Menu,
  X,
  Lock,
} from "lucide-react";
import {
  CounselorUser,
  AppUserRole,
  UserAccount,
  StudentSession,
  SchoolProfile,
} from "../types";

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onQuickExit: () => void;
  onOpenEmergencyModal: () => void;
  onToggleDisguise: () => void;
  isKioskActive: boolean;
  loggedCounselor: CounselorUser | null;
  onCounselorLogout: () => void;
  currentUser?: UserAccount | null;
  onLogoutRole?: () => void;
  studentSession?: StudentSession | null;
  onOpenStudentGate?: () => void;
  schoolProfile?: SchoolProfile;
  onOpenHibahGuide?: () => void;
  activeRole?: AppUserRole;
  onOpenRoleSwitcher?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onQuickExit,
  onOpenEmergencyModal,
  onToggleDisguise,
  isKioskActive,
  loggedCounselor,
  onCounselorLogout,
  currentUser,
  onLogoutRole,
  studentSession,
  onOpenStudentGate,
  schoolProfile,
  onOpenHibahGuide,
  activeRole,
  onOpenRoleSwitcher,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Main navigation items as shown in the desktop mockup
  const mainNavItems = [
    { id: "beranda", label: "Beranda" },
    { id: "tentang", label: "Tentang" },
    { id: "cara-kerja", label: "Cara Kerja" },
    { id: "bantuan", label: "Pusat Bantuan" },
    { id: "kontak", label: "Kontak" },
  ];

  // Secondary tools for quick access
  const appTools = [
    { id: "lapor", label: "Lapor Anonim", icon: Send },
    { id: "status", label: "Cek Tiket & Chat", icon: Search },
    { id: "aktivasi", label: "Aktivasi Token", icon: KeyRound },
    { id: "kios", label: "Mode Kios", icon: Monitor },
    { id: "berita", label: "Berita & Edukasi", icon: Newspaper },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  const isHeroTab = currentTab === "beranda";

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        isHeroTab
          ? "bg-[#1d4ed8] text-white border-b border-blue-500/30 shadow-md"
          : "bg-white text-slate-900 border-b border-slate-200 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* BRAND / LOGO (RUANG AMAN) */}
          <div
            onClick={() => handleNavClick("beranda")}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            id="brand-logo-button"
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                isHeroTab
                  ? "bg-white/20 text-white border border-white/30 shadow-inner"
                  : "bg-blue-600 text-white shadow-blue-500/20 shadow-md"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 10a3 3 0 0 0 6 0" />
                <circle cx="9" cy="8" r="0.5" fill="currentColor" />
                <circle cx="15" cy="8" r="0.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h1
                className={`text-xl sm:text-2xl font-extrabold tracking-tight leading-none ${
                  isHeroTab ? "text-white" : "text-slate-900"
                }`}
              >
                Ruang Aman
              </h1>
              <span
                className={`text-[9px] font-semibold tracking-wider uppercase block ${
                  isHeroTab ? "text-blue-200" : "text-slate-400"
                }`}
              >
                Platform PPKSP Siswa
              </span>
            </div>
          </div>

          {/* DESKTOP NAV LINKS (CENTER) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isHeroTab
                      ? isActive
                        ? "bg-white/20 text-white font-bold backdrop-blur-xs"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                      : isActive
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Quick Access to Report & Chat */}
            <div
              className={`h-4 w-px mx-1 ${isHeroTab ? "bg-white/20" : "bg-slate-200"}`}
            ></div>

            <button
              onClick={() => handleNavClick("lapor")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isHeroTab
                  ? currentTab === "lapor"
                    ? "bg-white text-blue-700"
                    : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                  : currentTab === "lapor"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <Send className="w-3 h-3" />
              <span>Lapor Anonim</span>
            </button>

            <button
              onClick={() => handleNavClick("status")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isHeroTab
                  ? currentTab === "status"
                    ? "bg-white/25 text-white font-bold"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                  : currentTab === "status"
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Pantau Tiket</span>
            </button>

            {onOpenHibahGuide && (
              <button
                type="button"
                onClick={onOpenHibahGuide}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isHeroTab
                    ? "bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 border border-amber-300/30"
                    : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
                }`}
                title="Buku Panduan Hibah & SOP PPKSP"
              >
                <BookOpen className="w-3 h-3 text-amber-300" />
                <span>SOP Hibah</span>
              </button>
            )}
          </nav>

          {/* RIGHT ACTIONS: LOGIN & CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Student Token Status Badge / Gate Button */}
            {activeRole === "siswa" && studentSession && (
              <div
                className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${
                  isHeroTab
                    ? "bg-emerald-500/25 border-emerald-400/40 text-emerald-200"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono font-bold">
                  {studentSession.tokenCode}
                </span>
                <span className="text-[10px] opacity-80">• Sah</span>
              </div>
            )}
            {activeRole === "siswa" && !studentSession && onOpenStudentGate && (
              <button
                onClick={onOpenStudentGate}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  isHeroTab
                    ? "bg-white/10 hover:bg-white/20 border-white/30 text-white"
                    : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                }`}
                title="Masukkan Kode Akses Sekolah (Cegah Penyusup)"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Kode Siswa</span>
              </button>
            )}

            {/* Login Button */}
            <button
              onClick={() => onSelectTab("login")}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                isHeroTab
                  ? "bg-white/10 hover:bg-white/20 border-white/30 text-white"
                  : "bg-slate-900 hover:bg-slate-800 border-slate-900 text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>

            {/* Counselor / Authenticated User Status */}
            {currentUser || loggedCounselor ? (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                  isHeroTab
                    ? "bg-white/15 border-white/30 text-white"
                    : "bg-indigo-50 border-indigo-200 text-indigo-900"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {activeRole === "siswa"
                    ? "S"
                    : activeRole === "guru"
                      ? "BK"
                      : activeRole === "admin"
                        ? "AD"
                        : activeRole === "dinas-pendidikan"
                          ? "DP"
                          : "PA"}
                </div>
                <button
                  id="nav-user-dashboard"
                  onClick={() =>
                    handleNavClick(
                      activeRole === "admin"
                        ? "admin-system"
                        : activeRole === "dinas-pendidikan"
                          ? "disdik"
                          : activeRole === "dinas-perlindungan"
                            ? "dinas-pppa"
                            : "admin",
                    )
                  }
                  className="text-xs font-bold hover:underline cursor-pointer truncate max-w-[100px] sm:max-w-none"
                >
                  {
                    (
                      currentUser?.name ||
                      loggedCounselor?.name ||
                      "Pengguna"
                    ).split(",")[0]
                  }
                </button>
                <button
                  id="nav-user-logout"
                  onClick={onLogoutRole || onCounselorLogout}
                  title="Logout"
                  className="text-slate-300 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}

            {/* Quick Exit Disguise / Safety Button */}
            <button
              onClick={onToggleDisguise}
              id="nav-disguise-mode-btn"
              title="Mode Samaran: Samarkan layar jadi catatan pelajaran"
              className={`p-2 rounded-full transition-colors cursor-pointer hidden sm:flex items-center justify-center ${
                isHeroTab
                  ? "text-white/80 hover:text-white hover:bg-white/15"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <EyeOff className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg cursor-pointer ${
                isHeroTab
                  ? "text-white hover:bg-white/15"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER / MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl text-white border-t border-slate-800 px-4 py-6 space-y-4 shadow-2xl">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 px-3 tracking-wider">
              Navigasi Utama
            </p>
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  currentTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400 px-3 tracking-wider">
              Akses Cepat Fitur
            </p>
            {appTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleNavClick(tool.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    currentTab === tool.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                handleNavClick("login");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Login</span>
            </button>

            <button
              onClick={onQuickExit}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600/30 text-red-300 hover:bg-red-600 hover:text-white font-bold text-xs transition-colors border border-red-500/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Cepat &amp; Hapus Jejak</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
