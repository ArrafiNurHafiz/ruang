import React, { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Users,
  FileText,
  Sliders,
  Plus,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Search,
  Lock,
  RefreshCw,
  Server,
  UserCheck,
  UserX,
  LogOut,
  Sparkles,
  Building2,
  Cpu,
  Printer,
  FileSpreadsheet,
  Layers,
  GraduationCap,
  ShieldAlert,
  HelpCircle,
  Eye,
  X,
  Database,
  Upload,
  BookOpen,
  Award,
  LogIn,
} from "lucide-react";
import {
  SchoolToken,
  CounselorUser,
  AuditLog,
  UserAccount,
  SchoolProfile,
} from "../types";
import { api } from "../lib/api";
import { PrintTokenSlipsModal } from "./PrintTokenSlipsModal";

interface AdminDashboardProps {
  tokens: SchoolToken[];
  onAddToken?: (token: SchoolToken) => void;
  onGenerateBatchTokens: (
    count: number,
    prefix: string,
    studentLevel?: string,
    notes?: string,
  ) => void;
  onToggleTokenStatus?: (tokenCode: string) => void;
  onDeleteToken?: (tokenCode: string) => void;
  counselors?: CounselorUser[];
  onAddCounselor?: (counselor: CounselorUser) => void;
  onToggleCounselorStatus?: (id: string) => void;
  users?: UserAccount[];
  onCreateUser?: (user: Partial<UserAccount>) => void;
  onToggleUserStatus?: (id: string) => void;
  auditLogs: AuditLog[];
  onLogout: () => void;
  adminName?: string;
  schoolProfile: SchoolProfile;
  onUpdateSchoolProfile: (profile: SchoolProfile) => void;
  onExportBackup?: () => void;
  onImportBackup?: (jsonString: string) => void;
  onFactoryReset?: (profile: SchoolProfile) => void;
  onOpenHibahGuide?: () => void;
  skipLogin?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tokens = [],
  onAddToken,
  onGenerateBatchTokens,
  onToggleTokenStatus,
  onDeleteToken,
  counselors = [],
  onAddCounselor,
  users = [],
  onCreateUser,
  onToggleUserStatus,
  auditLogs = [],
  onLogout,
  adminName = "Bambang Prasetyo, S.Kom",
  schoolProfile,
  onUpdateSchoolProfile,
  onExportBackup,
  onImportBackup,
  onFactoryReset,
  onOpenHibahGuide,
  skipLogin = false,
}) => {
  const [activeTab, setActiveTab] = useState<
    "tokens" | "petugas" | "profil" | "backup" | "audit" | "pengaturan"
  >("tokens");

  // Token generation state
  const [batchCount, setBatchCount] = useState<number>(10);
  const [customCountInput, setCustomCountInput] = useState<string>("10");
  const [customPrefix, setCustomPrefix] = useState<string>("SCH-X1");
  const [selectedStudentLevel, setSelectedStudentLevel] = useState<string>(
    "Kelas X - MIPA 1 (Angkatan 2026)",
  );
  const [customLevelInput, setCustomLevelInput] = useState<string>("");
  const [batchNotes, setBatchNotes] = useState<string>(
    "Pembagian Slip Kode MPLS Siswa Baru",
  );
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [searchToken, setSearchToken] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Tersedia" | "Aktif" | "Kedaluwarsa"
  >("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [tokenSuccessMsg, setTokenSuccessMsg] = useState<string>("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Add Counselor state
  const [showAddCounselorModal, setShowAddCounselorModal] = useState(false);
  const [newCounselorName, setNewCounselorName] = useState("");
  const [newCounselorEmail, setNewCounselorEmail] = useState("");
  const [newCounselorNip, setNewCounselorNip] = useState("");
  const [newCounselorRole, setNewCounselorRole] = useState<
    "Guru Bimbingan Konseling (BK)" | "Satgas PPKSP" | "Kepala Sekolah"
  >("Guru Bimbingan Konseling (BK)");

  // Editable School Profile Form State
  const [profileForm, setProfileForm] = useState<SchoolProfile>(schoolProfile);
  const [profileSavedMsg, setProfileSavedMsg] = useState("");

  // Backup & Import state
  const [importStatusMsg, setImportStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState(false);

  // Security config
  const [kioskTimeout, setKioskTimeout] = useState("180");
  const [autoRedactEnabled, setAutoRedactEnabled] = useState(true);
  const [antiInfiltratorEnforced, setAntiInfiltratorEnforced] = useState(true);
  const [configSaved, setConfigSaved] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleBatchGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const count =
      batchCount === -1 ? parseInt(customCountInput) || 10 : batchCount;
    const level = customLevelInput.trim() || selectedStudentLevel;

    onGenerateBatchTokens(
      count,
      customPrefix.trim().toUpperCase() || "SCH",
      level,
      batchNotes,
    );
    setTokenSuccessMsg(
      `Berhasil men-generate ${count} Kode Akses Siswa baru untuk ${level}!`,
    );
    setTimeout(() => setTokenSuccessMsg(""), 4000);
  };

  const handleCreateCounselor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounselorName || !newCounselorEmail) return;

    if (onAddCounselor) {
      const newCsl: CounselorUser = {
        id: `csl-${Date.now()}`,
        name: newCounselorName,
        email: newCounselorEmail,
        nip: newCounselorNip || "19850101 201001 1 001",
        role: newCounselorRole,
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        schoolName: profileForm.schoolName,
      };
      onAddCounselor(newCsl);
    }

    if (onCreateUser) {
      onCreateUser({
        name: newCounselorName,
        email: newCounselorEmail,
        role: "guru",
        roleTitle: newCounselorRole,
        organization: profileForm.schoolName,
        identifier: newCounselorNip
          ? `NIP: ${newCounselorNip}`
          : "ID: SATGAS-SCH-01",
      });
    }

    setShowAddCounselorModal(false);
    setNewCounselorName("");
    setNewCounselorEmail("");
    setNewCounselorNip("");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolProfile(profileForm);
    setProfileSavedMsg(
      "Profil dan Kop Surat Sekolah Berhasil Disimpan & Disinkronkan!",
    );
    setTimeout(() => setProfileSavedMsg(""), 4000);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kioskTimeout: parseInt(kioskTimeout) || 180,
          autoRedactEnabled,
          antiInfiltratorEnforced
        })
      });
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save config:", err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (onImportBackup) {
          onImportBackup(content);
          setImportStatusMsg({
            type: "success",
            text: "Cadangan database berhasil dipulihkan secara penuh!",
          });
        }
      } catch (err: any) {
        setImportStatusMsg({
          type: "error",
          text: `Gagal memulihkan cadangan: ${err.message || "Format tidak valid"}`,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExecuteFactoryReset = () => {
    if (onFactoryReset) {
      onFactoryReset(profileForm);
      setShowResetConfirmModal(false);
      setResetSuccessMsg(true);
      setTimeout(() => setResetSuccessMsg(false), 4000);
    }
  };

  // Filter Tokens
  const uniqueBatches = Array.from(
    new Set(tokens.map((t) => t.studentLevel || "Umum")),
  ).filter(Boolean);

  const filteredTokens = tokens.filter((t) => {
    const code = (t.tokenCode ?? t.token_code ?? "").toString();
    const matchesSearch =
      code.toLowerCase().includes(searchToken.toLowerCase()) ||
      (t.studentLevel &&
        t.studentLevel.toLowerCase().includes(searchToken.toLowerCase())) ||
      (t.notes && t.notes.toLowerCase().includes(searchToken.toLowerCase()));

    const tokenStatus = t.status || (t.isActivated ? "Aktif" : "Tersedia");
    const matchesStatus =
      statusFilter === "all" || tokenStatus === statusFilter;
    const matchesBatch =
      batchFilter === "all" || t.studentLevel === batchFilter;

    return matchesSearch && matchesStatus && matchesBatch;
  });

  const availableCount = tokens.filter(
    (t) => !t.isActivated && (t.status === "Tersedia" || !t.status),
  ).length;
  const activatedCount = tokens.filter(
    (t) => t.isActivated || t.status === "Aktif",
  ).length;
  const revokedCount = tokens.filter((t) => t.status === "Kedaluwarsa").length;

  const [isLoggedIn, setIsLoggedIn] = useState(skipLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  const handleLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await api.login({ email, password, role: 'admin' });
      setIsLoggedIn(true);
    } catch (err: any) {
      const msg = err.name === 'AbortError' ? 'Server tidak merespons. Pastikan backend berjalan di port 3001.' : (err.message || "Login failed");
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
          <div className="bg-slate-900 p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/40">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Portal Administrator</h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Keamanan Sistem & Satgas IT</p>
          </div>
          
          <div className="p-8 space-y-5">
            <form onSubmit={handleLoginForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Admin:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                  placeholder="admin.ppksp@sekolah.sch.id"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Password:</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{loginError}</div>
              )}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
              >
                {isLoggingIn ? <RefreshCw className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                <span>Masuk ke Sistem</span>
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 leading-relaxed">
              Gunakan akun Administrator IT Sekolah untuk mengelola token siswa, petugas BK, dan audit log sistem.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Top Admin Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>PORTAL ADMINISTRATOR SATUAN PENDIDIKAN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pusat Manajemen Satgas PPKSP &amp; Kode Siswa
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Sistem operasional resmi perlindungan siswa{" "}
              {schoolProfile.schoolName}. Kelola profil kop surat, distribusi
              token anti-penyusup, manajemen petugas BK, dan cadangan data
              mandiri.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenHibahGuide && (
              <button
                type="button"
                onClick={onOpenHibahGuide}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Buku Panduan &amp; SOP Hibah</span>
              </button>
            )}

            <div className="text-right hidden sm:block bg-white/10 p-2.5 px-3.5 rounded-xl border border-white/20">
              <span className="text-xs font-bold block text-white">
                {adminName}
              </span>
              <span className="text-[10px] text-blue-200 font-mono truncate max-w-[180px] block">
                {schoolProfile.schoolName}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Admin</span>
            </button>
          </div>
        </div>

        {/* System Protection Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">
              Total Kode Digenerate
            </span>
            <span className="text-xl font-extrabold text-white">
              {tokens.length} Kode
            </span>
            <span className="text-[10px] text-sky-300 block mt-0.5">
              {uniqueBatches.length} Rombel / Angkatan
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">
              Kode Siap Pakai (Tersedia)
            </span>
            <span className="text-xl font-extrabold text-emerald-400">
              {availableCount} Kode
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Belum Terklaim
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">
              Kode Aktif Digunakan
            </span>
            <span className="text-xl font-extrabold text-sky-300">
              {activatedCount} Siswa
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              Terotentikasi Anonim
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">
              Proteksi Anti-Penyusup
            </span>
            <span className="text-xl font-extrabold text-emerald-400">
              100% Aktif
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Akses Luar Terblokir
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          {
            id: "tokens",
            label: "Generator & Kelola Kode Siswa",
            icon: KeyRound,
          },
          { id: "petugas", label: "Petugas & Guru BK Satgas", icon: Users },
          {
            id: "profil",
            label: "Profil Sekolah & Kop Surat BAP",
            icon: Building2,
          },
          {
            id: "backup",
            label: "Cadangan & Pemulihan (JSON)",
            icon: Database,
          },
          { id: "audit", label: "Audit Log & Enkripsi ZKP", icon: FileText },
          { id: "pengaturan", label: "Konfigurasi Proteksi", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: TOKEN MANAGEMENT (GENERATOR & BATCH DISTRIBUTION) */}
      {/* ======================================================== */}
      {activeTab === "tokens" && (
        <div className="space-y-6 animate-fadeIn">
          {tokenSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{tokenSuccessMsg}</span>
            </div>
          )}

          {/* Batch Generator Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>Generator Kode Akses Siswa Massal (Anti-Penyusup)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Buat kode unik sekaligus untuk dibagikan per kelas/angkatan.
                  Siswa dapat menggunakan kode ini untuk login &amp; melapor
                  secara aman.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Slip Kode Rahasia</span>
              </button>
            </div>

            <form
              onSubmit={handleBatchGenerate}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {/* Jumlah Kode */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Jumlah Kode:
                </label>
                <select
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={5}>5 Kode Baru</option>
                  <option value={10}>10 Kode Baru (1 Kelompok)</option>
                  <option value={25}>25 Kode Baru (1 Rombel / Kelas)</option>
                  <option value={50}>50 Kode Baru (2 Rombel)</option>
                  <option value={100}>100 Kode Baru (1 Angkatan)</option>
                  <option value={-1}>Kustom Jumlah Lain...</option>
                </select>

                {batchCount === -1 && (
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={customCountInput}
                    onChange={(e) => setCustomCountInput(e.target.value)}
                    placeholder="Masukkan jumlah (misal: 36)"
                    className="w-full mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Target Rombel / Jenjang */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Target Rombel / Kelas:
                </label>
                <select
                  value={selectedStudentLevel}
                  onChange={(e) => {
                    setSelectedStudentLevel(e.target.value);
                    if (e.target.value !== "custom") setCustomLevelInput("");
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Kelas X - MIPA 1 (Angkatan 2026)">
                    Kelas X - MIPA 1 (Angkatan 2026)
                  </option>
                  <option value="Kelas X - MIPA 2 (Angkatan 2026)">
                    Kelas X - MIPA 2 (Angkatan 2026)
                  </option>
                  <option value="Kelas X - IPS 1 (Angkatan 2026)">
                    Kelas X - IPS 1 (Angkatan 2026)
                  </option>
                  <option value="Kelas XI - MIPA 1 (Angkatan 2025)">
                    Kelas XI - MIPA 1 (Angkatan 2025)
                  </option>
                  <option value="Kelas XI - IPS 2 (Angkatan 2025)">
                    Kelas XI - IPS 2 (Angkatan 2025)
                  </option>
                  <option value="Kelas XII - MIPA 3 (Angkatan 2024)">
                    Kelas XII - MIPA 3 (Angkatan 2024)
                  </option>
                  <option value="Seluruh Siswa Baru (MPLS 2026)">
                    Seluruh Siswa Baru (MPLS 2026)
                  </option>
                  <option value="custom">Input Rombel Kustom...</option>
                </select>

                {selectedStudentLevel === "custom" && (
                  <input
                    type="text"
                    value={customLevelInput}
                    onChange={(e) => setCustomLevelInput(e.target.value)}
                    placeholder="Contoh: Kelas 7A / Reguler"
                    className="w-full mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Format Prefix */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Format Awalan Prefix:
                </label>
                <input
                  type="text"
                  value={customPrefix}
                  onChange={(e) =>
                    setCustomPrefix(e.target.value.toUpperCase())
                  }
                  placeholder="Contoh: SCH-X1 atau TMG-SMAN1"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer h-[42px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate Kode Massal</span>
                </button>
              </div>
            </form>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Prinsip Anti-Penyusup:</strong> Kode yang dibuat
                bersifat rahasia dan dibagikan secara acak oleh wali kelas.
                Server tidak mencatat nama siswa yang menerima kode tertentu
                sehingga laporan tetap 100% anonim.
              </span>
            </div>
          </div>

          {/* Tokens List Table with Filtering */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>
                    Daftar Kode Akses Siswa Terdaftar ({filteredTokens.length}{" "}
                    dari {tokens.length})
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Status verifikasi desentralisasi anti-penyusup.
                </p>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchToken}
                    onChange={(e) => setSearchToken(e.target.value)}
                    placeholder="Cari kode atau kelas..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="Tersedia">Tersedia ({availableCount})</option>
                  <option value="Aktif">
                    Aktif Dipakai ({activatedCount})
                  </option>
                  <option value="Kedaluwarsa">
                    Kedaluwarsa ({revokedCount})
                  </option>
                </select>

                <select
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">Semua Rombel</option>
                  {uniqueBatches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Kode Akses Rahasia</th>
                    <th className="py-3 px-3">Rombel / Jenjang Kelas</th>
                    <th className="py-3 px-3">Keterangan Batch</th>
                    <th className="py-3 px-3">Status Penggunaan</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTokens.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-400"
                      >
                        Tidak ada kode token yang cocok dengan pencarian /
                        filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTokens.map((token) => {
                      const isRevoked = token.status === "Kedaluwarsa";
                      const isUsed =
                        token.isActivated || token.status === "Aktif";

                      return (
                        <tr
                          key={token.tokenCode}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-3 px-3 font-mono font-bold text-blue-950">
                            <span
                              className={`px-2.5 py-1 rounded-lg border font-mono ${
                                isRevoked
                                  ? "bg-red-50 border-red-200 text-red-700 line-through"
                                  : isUsed
                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                              }`}
                            >
                              {token.tokenCode}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {token.studentLevel || "Umum"}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {token.notes || "Batch Distribusi Sekolah"}
                          </td>
                          <td className="py-3 px-3">
                            {isRevoked ? (
                              <span className="inline-flex items-center gap-1 text-red-700 font-bold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                                <X className="w-3 h-3 text-red-600" />
                                <span>Dinonaktifkan</span>
                              </span>
                            ) : isUsed ? (
                              <span className="inline-flex items-center gap-1 text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                <Check className="w-3 h-3 text-blue-600" />
                                <span>Aktif (Digunakan Siswa)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <KeyRound className="w-3 h-3 text-emerald-600" />
                                <span>Tersedia (Siap Pakai)</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleCopy(token.tokenCode)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Salin Kode Akses"
                              >
                                {copiedToken === token.tokenCode ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {onToggleTokenStatus && (
                                <button
                                  onClick={() =>
                                    onToggleTokenStatus(token.tokenCode)
                                  }
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold ${
                                    isRevoked
                                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                      : "bg-red-50 text-red-600 hover:bg-red-100"
                                  }`}
                                  title={
                                    isRevoked
                                      ? "Aktifkan Kembali Kode"
                                      : "Nonaktifkan Kode (Revoke)"
                                  }
                                >
                                  {isRevoked ? "Aktifkan" : "Revoke"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: COUNSELORS & SATGAS PPKSP                         */}
      {/* ======================================================== */}
      {activeTab === "petugas" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Daftar Petugas Bimbingan Konseling &amp; Satgas PPKSP
                </h3>
                <p className="text-xs text-slate-500">
                  Petugas resmi yang berwenang menerima dan merespons aduan
                  anonim siswa.
                </p>
              </div>

              <button
                onClick={() => setShowAddCounselorModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Petugas Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {users.filter(u => u.role === 'guru').map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {u.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-blue-700">
                        {u.roleTitle}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {u.identifier}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{u.email}</span>
                    <button
                      onClick={() => onToggleUserStatus && onToggleUserStatus(u.id)}
                      className={`px-2 py-0.5 font-bold rounded-full text-[10px] cursor-pointer ${
                        u.status !== "Non-Aktif" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.status !== "Non-Aktif" ? "Aktif Siaga" : "Dinonaktifkan"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: AUDIT LOG & CRYPTOGRAPHIC ZERO-KNOWLEDGE PROOF    */}
      {/* ======================================================== */}
      {activeTab === "audit" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Log Audit Sistem &amp; Validasi Kriptografis ZKP</span>
              </h3>
              <p className="text-xs text-slate-500">
                Setiap laporan diverifikasi menggunakan Zero-Knowledge Proof
                untuk memastikan pelapor adalah siswa sah tanpa membuka
                identitas personal.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Waktu</th>
                    <th className="py-3 px-3">Aksi / Peristiwa</th>
                    <th className="py-3 px-3">Aktor / Entitas</th>
                    <th className="py-3 px-3">Keterangan Audit</th>
                    <th className="py-3 px-3 text-right">Status Kriptografi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {log.action}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {log.actorRole} ({log.actorName})
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {log.details}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{log.zkpProofStatus}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PROFIL SEKOLAH & KOP SURAT BAP                    */}
      {/* ======================================================== */}
      {activeTab === "profil" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Identitas Resmi Satgas PPKSP
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Profil Satuan Pendidikan &amp; Pejabat Berwenang
                </h3>
                <p className="text-xs text-slate-500">
                  Data ini digunakan otomatis pada Kop Surat Berita Acara Kasus
                  (BAP), Lembar Rujukan UPTD, dan Tanda Tangan Resmi.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenHibahGuide}
                  className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>Lihat SOP Hibah</span>
                </button>
              </div>
            </div>

            {profileSavedMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{profileSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
              {/* Bagian 1: Identitas Sekolah */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>1. Identitas Satuan Pendidikan</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">
                      Nama Resmi Sekolah:
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.schoolName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          schoolName: e.target.value,
                        })
                      }
                      placeholder="Contoh: SMA Negeri 1 Jakarta / SMP Negeri 5 Bandung"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      NPSN (Nomor Pokok Sekolah Nasional):
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.npsn}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, npsn: e.target.value })
                      }
                      placeholder="Contoh: 20100192"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Provinsi:
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.province}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          province: e.target.value,
                        })
                      }
                      placeholder="Contoh: DKI Jakarta / Jawa Barat"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">
                      Alamat Lengkap Satuan Pendidikan:
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          address: e.target.value,
                        })
                      }
                      placeholder="Jl. Budi Utomo No. 7, Sawah Besar, Jakarta Pusat 10710"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Telepon Kantor / Fax:
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="(021) 3865001"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Email Resmi Satgas:
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="satgas.ppksp@sekolah.sch.id"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Legalitas SK Satgas */}
              <div className="space-y-4 pt-2">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>2. Legalitas Surat Keputusan (SK) Satgas PPKSP</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Nomor SK Satgas:
                    </label>
                    <input
                      type="text"
                      value={profileForm.satgasSkNumber}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          satgasSkNumber: e.target.value,
                        })
                      }
                      placeholder="SK-PPKSP/046/SMAN1/2024"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Tanggal Penetapan SK:
                    </label>
                    <input
                      type="text"
                      value={profileForm.satgasSkDate}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          satgasSkDate: e.target.value,
                        })
                      }
                      placeholder="15 Januari 2024"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 3: Lembar Pejabat Penandatangan Dokumen BAP */}
              <div className="space-y-4 pt-2">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>
                    3. Pejabat Penandatangan Dokumen Berita Acara Kasus (BAP)
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Kepala Sekolah */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <span className="font-bold text-slate-900 block text-xs">
                      Kepala Satuan Pendidikan:
                    </span>
                    <input
                      type="text"
                      required
                      value={profileForm.principalName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          principalName: e.target.value,
                        })
                      }
                      placeholder="Nama & Gelar Kepala Sekolah"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={profileForm.principalNip}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          principalNip: e.target.value,
                        })
                      }
                      placeholder="NIP: 19680315 199303 1 004"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-700 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Ketua Satgas */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <span className="font-bold text-slate-900 block text-xs">
                      Ketua Satgas PPKSP:
                    </span>
                    <input
                      type="text"
                      required
                      value={profileForm.satgasLeaderName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          satgasLeaderName: e.target.value,
                        })
                      }
                      placeholder="Nama & Gelar Ketua Satgas"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={profileForm.satgasLeaderNip}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          satgasLeaderNip: e.target.value,
                        })
                      }
                      placeholder="NIP / NUPTK: 19840719 200902 1 003"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-700 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Koordinator Guru BK */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 sm:col-span-2">
                    <span className="font-bold text-slate-900 block text-xs">
                      Koordinator Guru Bimbingan Konseling (BK):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={profileForm.counselorCoordinatorName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            counselorCoordinatorName: e.target.value,
                          })
                        }
                        placeholder="Nama & Gelar Koordinator Guru BK"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={profileForm.counselorCoordinatorNip}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            counselorCoordinatorNip: e.target.value,
                          })
                        }
                        placeholder="NIP / NUPTK: 19780412 200501 2 003"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-700 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan Profil Sekolah &amp; Kop Surat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: CADANGAN & PEMULIHAN DATABASE (JSON ENGINE)       */}
      {/* ======================================================== */}
      {activeTab === "backup" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Kemandirian &amp; Ketahanan Data
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Cadangan &amp; Pemulihan Database Satgas
              </h3>
              <p className="text-xs text-slate-500">
                Unduh seluruh data laporan, token siswa, dan histori penanganan
                ke file terenkripsi untuk arsip mandiri sekolah atau migrasi
                server.
              </p>
            </div>

            {importStatusMsg && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                  importStatusMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
                    : "bg-red-50 border border-red-300 text-red-900"
                }`}
              >
                {importStatusMsg.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{importStatusMsg.text}</span>
              </div>
            )}

            {resetSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Database berhasil di-reset ke status bersih siap pakai untuk
                  satuan pendidikan!
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Ekspor Cadangan */}
              <div className="p-5 bg-gradient-to-br from-blue-50/70 to-slate-50 rounded-2xl border border-blue-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Unduh Cadangan Database (.json)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Menghasilkan file arsip JSON lengkap berisi profil sekolah,
                    tiket aduan, kode siswa, akun petugas, dan log audit
                    kriptografis.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onExportBackup}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors mt-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File Cadangan Sekarang</span>
                </button>
              </div>

              {/* Card 2: Pulihkan Cadangan */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Pulihkan Cadangan dari File
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Unggah file cadangan JSON yang pernah Anda unduh sebelumnya
                    untuk memulihkan seluruh data operasional sekolah.
                  </p>
                </div>

                <label className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors mt-2">
                  <Upload className="w-4 h-4" />
                  <span>Pilih &amp; Pulihkan File JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Card 3: Danger Zone - Clean Factory Reset for Donation */}
            <div className="p-6 bg-rose-50/60 border border-rose-200 rounded-3xl space-y-4">
              <div className="flex items-start gap-3.5">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-black text-rose-950 text-sm">
                    Inisialisasi Bersih Siap Pakai (Persiapan Serah Terima
                    Hibah)
                  </h4>
                  <p className="text-xs text-rose-900/80 leading-relaxed">
                    Gunakan fitur ini saat Anda siap menyerahkan website ke
                    pihak sekolah. Opsi ini akan menghapus semua laporan
                    demo/pengujian, menjaga profil sekolah resmi Anda, dan
                    men-generate batch slip kode siswa baru yang bersih untuk
                    dibagikan ke siswa kelas X, XI, dan XII.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirmModal(true)}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>
                    Bersihkan Data Uji Coba &amp; Mulai Operasional Bersih
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Factory Reset */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp border border-rose-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-slate-900">
                Konfirmasi Inisialisasi Bersih Sekolah
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tindakan ini akan mengosongkan seluruh tiket aduan simulasi dan
                membuat token perdana baru untuk{" "}
                <strong>{profileForm.schoolName}</strong>. Pastikan Anda telah
                mengunduh cadangan jika masih membutuhkan data sebelumnya.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteFactoryReset}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Ya, Inisialisasi Bersih Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {activeTab === "pengaturan" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 max-w-3xl">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Konfigurasi Keamanan &amp; Parameter Satuan Pendidikan
              </h3>
              <p className="text-xs text-slate-500">
                Atur kebijakan operasional pencegahan penyusup dan privasi data
                siswa.
              </p>
            </div>

            {configSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>
                  Pengaturan berhasil disimpan dan disinkronkan ke seluruh
                  terminal sekolah!
                </span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Nama Satuan Pendidikan:
                </label>
                <input
                  type="text"
                  value={profileForm.schoolName}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      schoolName: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Hotline Darurat Satgas Sekolah:
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Anti-Infiltrator Toggle */}
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-blue-950">
                    Wajibkan Kode Akses Sekolah (Anti-Penyusup)
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Hanya menerima laporan dari siswa yang memiliki kode
                    terdaftar dari sekolah.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={antiInfiltratorEnforced}
                  onChange={(e) => setAntiInfiltratorEnforced(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* PII Redaction Toggle */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-slate-900">
                    Sensor Entitas Pribadi (PII) Otomatis
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Mendeteksi dan menghapus nama, NISN, nomor HP di kronologi
                    laporan.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoRedactEnabled}
                  onChange={(e) => setAutoRedactEnabled(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Konfigurasi Satgas PPKSP</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Petugas BK */}
      {showAddCounselorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Tambah Petugas Konselor / Satgas
            </h3>

            <form
              onSubmit={handleCreateCounselor}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Nama Lengkap beserta Gelar:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dra. Sri Wahyuni, M.Pd"
                  value={newCounselorName}
                  onChange={(e) => setNewCounselorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Email Kedinasan / Sekolah:
                </label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: sri.wahyuni@sekolah.sch.id"
                  value={newCounselorEmail}
                  onChange={(e) => setNewCounselorEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">NIP / NUPTK:</label>
                <input
                  type="text"
                  placeholder="Contoh: 19800512 200604 2 007"
                  value={newCounselorNip}
                  onChange={(e) => setNewCounselorNip(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Peran &amp; Kewenangan:
                </label>
                <select
                  value={newCounselorRole}
                  onChange={(e) => setNewCounselorRole(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Guru Bimbingan Konseling (BK)">
                    Guru Bimbingan Konseling (BK)
                  </option>
                  <option value="Satgas PPKSP">Satgas PPKSP</option>
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCounselorModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Token Slips Modal */}
      <PrintTokenSlipsModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        tokens={tokens}
        schoolName={profileForm.schoolName}
      />
    </div>
  );
};
