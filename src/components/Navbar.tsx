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
  Info,
  FileCheck2,
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
  activeRole = "siswa",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      {/* Brand Logo & Title */}
      <div
        onClick={() => handleNavClick("beranda")}
        className="flex items-center gap-3 cursor-pointer select-none"
        id="brand-logo-button"
      >
        <span className="brand-mark">
          <ShieldCheck size={22} strokeWidth={2.5} />
        </span>
        <span className="leading-tight">
          <strong className="block text-[17px] text-ink font-bold">
            Ruang Aman
          </strong>
          <small className="text-[11px] text-muted-foreground font-medium">
            {activeRole === "guru" && schoolProfile?.schoolName
              ? `Satgas PPKSP • ${schoolProfile.schoolName}`
              : "PPKSP • Suara Siswa"}
          </small>
        </span>
      </div>

      {/* Desktop Navigation Links */}
      {activeRole === "siswa" ? (
        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Navigasi utama"
        >
          <button
            type="button"
            id="nav-link-beranda"
            onClick={() => handleNavClick("beranda")}
            className={`nav-btn ${currentTab === "beranda" ? "nav-active" : ""}`}
          >
            Beranda
          </button>
          <button
            type="button"
            id="nav-link-tentang"
            onClick={() => handleNavClick("tentang")}
            className={`nav-btn ${currentTab === "tentang" ? "nav-active" : ""}`}
          >
            Tentang
          </button>
          <button
            type="button"
            id="nav-link-cara-kerja"
            onClick={() => handleNavClick("cara-kerja")}
            className={`nav-btn ${currentTab === "cara-kerja" ? "nav-active" : ""}`}
          >
            Cara Melapor
          </button>
          <button
            type="button"
            id="nav-link-status"
            onClick={() => handleNavClick("status")}
            className={`nav-btn ${currentTab === "status" ? "nav-active" : ""}`}
          >
            Pantau Tiket
          </button>
          <button
            type="button"
            id="nav-link-bantuan"
            onClick={() => handleNavClick("bantuan")}
            className={`nav-btn ${currentTab === "bantuan" ? "nav-active" : ""}`}
          >
            Pusat Bantuan
          </button>
        </nav>
      ) : (
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white shadow-xs text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {activeRole === "guru" && "Ruang Kerja Guru BK / Admin Sekolah"}
              {activeRole === "admin" && "Konsol Admin Sistem (Manajemen User & IT)"}
              {activeRole === "dinas-pendidikan" && "Portal Pengawasan Dinas Pendidikan"}
              {activeRole === "dinas-perlindungan" && "Portal Intervensi UPTD PPA"}
            </span>
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {activeRole === "siswa" && (
          <button
            type="button"
            onClick={() => handleNavClick("lapor")}
            className="primary-pill hidden sm:inline-flex"
            id="nav-lapor-btn"
            data-testid="nav-link-lapor"
          >
            <Send size={16} />
            <span>Lapor Anonim</span>
          </button>
        )}

        {/* Student Session Token Tag */}
        {activeRole === "siswa" && studentSession && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-[11px] font-bold">
              {studentSession.tokenCode}
            </span>
          </div>
        )}

        {/* Disguise / Samaran Button for Student */}
        {activeRole === "siswa" && (
          <button
            type="button"
            onClick={onToggleDisguise}
            className="icon-button"
            title="Mode Samaran: Tutupi layar seketika jadi materi pelajaran (ESC 2x)"
            aria-label="Mode Samaran"
          >
            <EyeOff size={18} />
          </button>
        )}

        {/* Staff Authentication / Logout Button */}
        {activeRole !== "siswa" ? (
          <button
            type="button"
            onClick={onLogoutRole || onCounselorLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
            id="nav-logout-btn"
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleNavClick("login")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-bold transition cursor-pointer"
            id="nav-login-btn"
          >
            <UserCheck size={15} className="text-muted-foreground" />
            <span>Masuk Petugas</span>
          </button>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="icon-button lg:hidden"
          aria-label="Buka menu"
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[76px] left-0 right-0 bg-card border-b border-border p-4 shadow-xl z-50 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={() => handleNavClick("beranda")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              currentTab === "beranda"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            Beranda
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("lapor")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              currentTab === "lapor"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-primary hover:bg-muted/80"
            }`}
          >
            <Send size={15} />
            <span>Buat Laporan Anonim</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("status")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              currentTab === "status"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Search size={15} />
            <span>Pantau Status Tiket</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("tentang")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              currentTab === "tentang"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            Tentang Platform
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("cara-kerja")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              currentTab === "cara-kerja"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            Cara Melapor
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("bantuan")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
              currentTab === "bantuan"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <HelpCircle size={15} />
            <span>Pusat Bantuan &amp; FAQ</span>
          </button>

          <div className="pt-2 border-t border-border mt-1">
            {activeRole !== "siswa" ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLogoutRole) onLogoutRole();
                  else if (onCounselorLogout) onCounselorLogout();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center justify-center gap-2"
              >
                <LogOut size={15} />
                <span>Keluar dari Sesi</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick("login")}
                className="w-full py-2.5 px-4 rounded-xl border border-border bg-muted text-foreground text-sm font-bold flex items-center justify-center gap-2"
              >
                <UserCheck size={15} />
                <span>Masuk Petugas / Guru BK</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
