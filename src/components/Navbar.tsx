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
import { useLanguage } from "../lib/i18n";

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
  const { lang, setLang, t } = useLanguage();
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
            {t("brand.name")}
          </strong>
          <small className="text-[11px] text-muted-foreground font-medium">
            {activeRole === "guru" && schoolProfile?.schoolName
              ? `${t("brand.satgas")} • ${schoolProfile.schoolName}`
              : t("brand.tagline")}
          </small>
        </span>
      </div>

      {/* Desktop Navigation Links */}
      {activeRole === "siswa" ? (
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Main Navigation"
        >
          <button
            type="button"
            id="nav-link-beranda"
            onClick={() => handleNavClick("beranda")}
            className={`nav-btn ${currentTab === "beranda" ? "nav-active" : ""}`}
          >
            {t("nav.home")}
          </button>
          <button
            type="button"
            id="nav-link-tentang"
            onClick={() => handleNavClick("tentang")}
            className={`nav-btn ${currentTab === "tentang" ? "nav-active" : ""}`}
          >
            {t("nav.about")}
          </button>
          <button
            type="button"
            id="nav-link-cara-kerja"
            onClick={() => handleNavClick("cara-kerja")}
            className={`nav-btn ${currentTab === "cara-kerja" ? "nav-active" : ""}`}
          >
            {t("nav.howItWorks")}
          </button>
          <button
            type="button"
            id="nav-link-status"
            onClick={() => handleNavClick("status")}
            className={`nav-btn ${currentTab === "status" ? "nav-active" : ""}`}
          >
            {t("nav.track")}
          </button>
          <button
            type="button"
            id="nav-link-bantuan"
            onClick={() => handleNavClick("bantuan")}
            className={`nav-btn ${currentTab === "bantuan" ? "nav-active" : ""}`}
          >
            {t("nav.help")}
          </button>
        </nav>
      ) : (
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white shadow-xs text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {activeRole === "guru" && t("role.counselor")}
              {activeRole === "admin" && t("role.admin")}
              {activeRole === "dinas-pendidikan" && t("role.dinasPendidikan")}
              {activeRole === "dinas-perlindungan" && t("role.dinasPerlindungan")}
            </span>
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Language Switcher Toggle Pill */}
        <div
          className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
          role="group"
          aria-label="Language Selector"
        >
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              lang === "en"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="English"
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("id")}
            className={`px-2 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              lang === "id"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Bahasa Indonesia"
          >
            ID
          </button>
        </div>

        {activeRole === "siswa" && (
          <button
            type="button"
            onClick={() => handleNavClick("lapor")}
            className="primary-pill hidden sm:inline-flex"
            id="nav-lapor-btn"
            data-testid="nav-link-lapor"
          >
            <Send size={15} />
            <span>{t("nav.reportAnonymous")}</span>
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
            title={t("nav.disguiseTooltip")}
            aria-label={t("nav.disguiseTooltip")}
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
            <span>{t("nav.logout")}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleNavClick("login")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-bold transition cursor-pointer"
            id="nav-login-btn"
          >
            <UserCheck size={15} className="text-muted-foreground" />
            <span>{t("nav.staffLogin")}</span>
          </button>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="icon-button lg:hidden"
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[76px] left-0 right-0 bg-card border-b border-border p-4 shadow-xl z-50 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase">Language / Bahasa</span>
            <div className="inline-flex items-center bg-muted p-0.5 rounded-lg border border-border text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-md text-xs font-bold ${lang === "en" ? "bg-card text-primary shadow-xs" : "text-muted-foreground"}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("id")}
                className={`px-3 py-1 rounded-md text-xs font-bold ${lang === "id" ? "bg-card text-primary shadow-xs" : "text-muted-foreground"}`}
              >
                Indonesia
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNavClick("beranda")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              currentTab === "beranda"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {t("nav.home")}
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
            <span>{t("nav.reportAnonymous")}</span>
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
            <span>{t("nav.track")}</span>
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
            {t("nav.about")}
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
            {t("nav.howItWorks")}
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
            <span>{t("nav.help")}</span>
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
                <span>{t("nav.logout")}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick("login")}
                className="w-full py-2.5 px-4 rounded-xl border border-border bg-muted text-foreground text-sm font-bold flex items-center justify-center gap-2"
              >
                <UserCheck size={15} />
                <span>{t("nav.staffLogin")}</span>
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
