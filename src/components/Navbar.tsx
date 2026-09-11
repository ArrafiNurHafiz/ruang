import React from "react";
import {
  ShieldCheck,
  Send,
  Search,
  HelpCircle,
  LogOut,
  EyeOff,
  Menu,
  X,
  UserCheck,
  KeyRound,
  Shield,
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Selalu tampil jika berada di posisi teratas
      if (currentScrollY < 50) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Jangan sembunyikan jika menu drawer mobile sedang terbuka
      if (mobileMenuOpen) {
        setIsVisible(true);
        return;
      }

      // Threshold selisih scroll untuk mencegah jitter pada trackpad
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < 8) {
        return;
      }

      if (delta > 0) {
        // Scroll ke bawah -> sembunyikan navbar
        setIsVisible(false);
      } else {
        // Scroll ke atas -> munculkan navbar
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* BRAND / LOGO */}
          <div
            onClick={() => handleNavClick("beranda")}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
            id="brand-logo-button"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                  TAMENG
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 tracking-wider">
                  Ruang Aman
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {activeRole === "guru" && schoolProfile?.schoolName
                  ? `Satgas PPKSP • ${schoolProfile.schoolName}`
                  : "Platform Nasional PPKSP • Satuan Pendidikan Indonesia"}
              </p>
            </div>
          </div>

          {/* DESKTOP NAV LINKS (CENTER) */}
          {activeRole === "siswa" ? (
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              <button
                id="nav-link-beranda"
                onClick={() => handleNavClick("beranda")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === "beranda"
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Beranda
              </button>

              <button
                id="nav-link-lapor"
                onClick={() => handleNavClick("lapor")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === "lapor"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Lapor Anonim</span>
              </button>

              <button
                id="nav-link-status"
                onClick={() => handleNavClick("status")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === "status"
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Pantau Tiket</span>
              </button>

              <button
                id="nav-link-bantuan"
                onClick={() => handleNavClick("bantuan")}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === "bantuan"
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Pusat Bantuan
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white shadow-xs text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold tracking-wide">
                  {activeRole === "guru" && "Ruang Kerja Guru BK / Admin Sekolah"}
                  {activeRole === "admin" && "Konsol Admin Sistem (Manajemen User & IT)"}
                  {activeRole === "dinas-pendidikan" && "Portal Pengawasan Dinas Pendidikan"}
                  {activeRole === "dinas-perlindungan" && "Portal Intervensi UPTD PPA"}
                </span>
              </div>
            </div>
          )}

          {/* RIGHT CONTROLS */}
          <div className="flex items-center gap-2">
            {/* Student Token Verified Badge */}
            {activeRole === "siswa" && studentSession && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-mono text-[11px] font-bold">
                  {studentSession.tokenCode}
                </span>
              </div>
            )}

            {/* Mode Samaran Button (only for student role) */}
            {activeRole === "siswa" && (
              <button
                onClick={onToggleDisguise}
                id="nav-disguise-mode-btn"
                title="Mode Samaran: Tutupi layar seketika jadi materi pelajaran (ESC 2x)"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                <EyeOff className="w-4 h-4" />
                <span className="hidden xl:inline text-[11px] text-slate-500 font-medium">
                  Samaran
                </span>
              </button>
            )}

            {/* Counselor / Staff Logged in or Login Button */}
            {activeRole !== "siswa" ? (
              <div className="flex items-center gap-2 pl-1.5 border-l border-slate-200">
                <button
                  id="nav-logout-btn"
                  onClick={onLogoutRole || onCounselorLogout}
                  title="Keluar dari sesi petugas & kembali ke portal siswa"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition cursor-pointer shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : currentUser || loggedCounselor ? (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
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
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                    {activeRole === "guru"
                      ? "BK"
                      : activeRole === "admin"
                        ? "AD"
                        : "ST"}
                  </div>
                  <span className="truncate max-w-[80px] sm:max-w-[120px]">
                    {
                      (
                        currentUser?.name ||
                        loggedCounselor?.name ||
                        "Petugas"
                      ).split(" ")[0]
                    }
                  </span>
                </button>
                <button
                  id="nav-user-logout"
                  onClick={onLogoutRole || onCounselorLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("login")}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Masuk Petugas</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              id="mobile-menu-toggle"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1.5 shadow-lg">
          <button
            onClick={() => handleNavClick("beranda")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === "beranda"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>Beranda</span>
          </button>
          <button
            onClick={() => handleNavClick("lapor")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
              currentTab === "lapor"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Lapor Anonim</span>
          </button>
          <button
            onClick={() => handleNavClick("status")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === "status"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Pantau Status Tiket</span>
          </button>
          <button
            onClick={() => handleNavClick("bantuan")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              currentTab === "bantuan"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Pusat Bantuan &amp; Edukasi</span>
          </button>

          {activeRole !== "siswa" ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
                <span>Peran Aktif:</span>
                <span className="font-semibold text-slate-800">
                  {activeRole === "guru" && "Guru BK / Admin Sekolah"}
                  {activeRole === "admin" && "Admin Sistem"}
                  {activeRole === "dinas-pendidikan" && "Dinas Pendidikan"}
                  {activeRole === "dinas-perlindungan" && "UPTD PPA"}
                </span>
              </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogoutRole) onLogoutRole();
                    else if (onCounselorLogout) onCounselorLogout();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-rose-50 border border-rose-200 text-center text-xs font-semibold text-rose-700 hover:bg-rose-100 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  handleNavClick("login");
                }}
                className="w-full py-2 rounded-lg border border-slate-200 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Masuk Petugas
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
