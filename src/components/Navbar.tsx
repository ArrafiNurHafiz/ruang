import React from "react";
import {
  ShieldCheck,
  Send,
  Search,
  HelpCircle,
  LogOut,
  EyeOff,
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

  const handleNavClick = (id: string) => {
    onSelectTab(id);
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

      </div>
    </header>
  );
};
