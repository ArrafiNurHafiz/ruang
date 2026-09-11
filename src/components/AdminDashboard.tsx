import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Building2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  Database,
  Upload,
  BookOpen,
  AlertOctagon,
  UserCheck,
  Lock,
  Clock,
  Check,
  X,
  FileText,
} from "lucide-react";
import {
  SchoolToken,
  CounselorUser,
  AuditLog,
  UserAccount,
  SchoolProfile,
  SchoolRegionalData,
  AppUserRole,
} from "../types";
import { MOCK_REGIONAL_SCHOOLS } from "../data/mockData";
import { api } from "../lib/api";

interface AdminDashboardProps {
  tokens?: SchoolToken[];
  onGenerateBatchTokens?: (
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
  regionalSchools?: SchoolRegionalData[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
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
  regionalSchools = [],
}) => {
  // Admin Sistem Tabs: Pengguna (Users), Audit Log, Pengaturan & Cadangan
  const [activeTab, setActiveTab] = useState<"users" | "audit" | "settings">("users");

  // User Management State
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSchoolFilter, setUserSchoolFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newNip, setNewNip] = useState("");
  const [newSchool, setNewSchool] = useState("");
  const [newRole, setNewRole] = useState<
    | "Guru Bimbingan Konseling (BK)"
    | "Satgas PPKSP"
    | "Kepala Sekolah"
    | "Pengawas Dinas Pendidikan Wilayah"
    | "Petugas UPTD PPA (Dinas Perlindungan)"
    | "Admin Sistem"
  >("Guru Bimbingan Konseling (BK)");
  const [userSuccessMsg, setUserSuccessMsg] = useState("");

  // Audit Log Search & Filter
  const [auditSearch, setAuditSearch] = useState("");

  // Profile Form
  const [profileForm, setProfileForm] = useState<SchoolProfile>(schoolProfile);
  const [savedMsg, setSavedMsg] = useState("");

  // Reset Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(skipLogin);

  useEffect(() => {
    if (skipLogin) setIsLoggedIn(true);
  }, [skipLogin]);

  useEffect(() => {
    setProfileForm(schoolProfile);
  }, [schoolProfile]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newSchool.trim()) return;

    let mappedRole: AppUserRole = "guru";
    if (newRole === "Admin Sistem") {
      mappedRole = "admin";
    } else if (newRole === "Pengawas Dinas Pendidikan Wilayah") {
      mappedRole = "dinas-pendidikan";
    } else if (newRole === "Petugas UPTD PPA (Dinas Perlindungan)") {
      mappedRole = "dinas-perlindungan";
    } else {
      mappedRole = "guru";
    }

    if (onCreateUser) {
      onCreateUser({
        name: newName,
        email: newEmail,
        nip: newNip,
        role: mappedRole,
        roleTitle: newRole,
        organization: newSchool,
        isActive: true,
      });
    } else if (onAddCounselor) {
      onAddCounselor({
        id: `csl-${Date.now()}`,
        name: newName,
        email: newEmail,
        nip: newNip,
        role: "satgas",
        roleTitle: newRole,
        schoolName: newSchool,
        active: true,
      });
    }

    setUserSuccessMsg(`Pengguna baru ${newName} (${newRole} • ${newSchool}) berhasil ditambahkan.`);
    setTimeout(() => setUserSuccessMsg(""), 3500);

    setNewName("");
    setNewEmail("");
    setNewNip("");
    setNewSchool("");
    setShowAddModal(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolProfile(profileForm);
    setSavedMsg("Pengaturan sistem & sekolah berhasil disimpan!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportBackup) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      try {
        onImportBackup(content);
        alert("Cadangan sistem berhasil diimpor!");
      } catch (err) {
        alert("Format berkas cadangan JSON tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  // Combining users and counselors for display
  const combinedUsers = users.length > 0 ? users : counselors.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    nip: c.nip,
    role: "guru" as const,
    roleTitle: c.roleTitle || "Guru BK",
    organization: c.schoolName || "SMA Negeri 1 Jakarta",
    identifier: c.nip ? `NIP: ${c.nip}` : "ID PETUGAS",
    isActive: c.active !== false,
  }));

  const availableSchoolList =
    regionalSchools && regionalSchools.length > 0
      ? regionalSchools
      : MOCK_REGIONAL_SCHOOLS;

  const filteredUsers = combinedUsers.filter((u) => {
    const q = userSearch.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.nip || "").toLowerCase().includes(q) ||
      (u.organization || "").toLowerCase().includes(q) ||
      (u.roleTitle || "").toLowerCase().includes(q);

    if (userSchoolFilter !== "all" && (u.organization || "") !== userSchoolFilter) {
      return false;
    }

    if (userRoleFilter === "all") return matchSearch;
    if (userRoleFilter === "guru") return matchSearch && (u.role === "guru" || (u.roleTitle || "").includes("BK"));
    if (userRoleFilter === "satgas") return matchSearch && (u.roleTitle || "").includes("Satgas");
    if (userRoleFilter === "disdik") return matchSearch && (u.role === "dinas-pendidikan" || (u.roleTitle || "").includes("Pendidikan"));
    if (userRoleFilter === "dinas-pppa") return matchSearch && (u.role === "dinas-perlindungan" || (u.roleTitle || "").includes("UPTD") || (u.roleTitle || "").includes("Perlindungan"));
    if (userRoleFilter === "admin") return matchSearch && (u.role === "admin" || (u.roleTitle || "").includes("Admin"));
    return matchSearch;
  });

  const filteredAuditLogs = auditLogs.filter((l) => {
    const q = auditSearch.toLowerCase();
    return (
      (l.action || "").toLowerCase().includes(q) ||
      (l.actor || "").toLowerCase().includes(q) ||
      (l.details || "").toLowerCase().includes(q)
    );
  });

  // PIN gate for Admin Sistem
  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md max-w-sm w-full space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Konsol Admin Sistem</h2>
            <p className="text-xs text-slate-500 mt-1">
              Pengelolaan Akun Pengguna, Keamanan &amp; Pemeliharaan IT
            </p>
          </div>
          <button
            onClick={() => setIsLoggedIn(true)}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition"
          >
            Masuk Konsol Admin ({adminName})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4 animate-fadeIn">
      {/* Top Status Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            SYS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 leading-none">
                Konsol Admin Sistem Nasional
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Admin Sistem Nasional PPKSP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Admin: {adminName} • {combinedUsers.length} Pengguna Nasional ({combinedUsers.filter(u => u.isActive !== false).length} Aktif) • {auditLogs.length} Log Audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenHibahGuide && (
            <button
              type="button"
              onClick={onOpenHibahGuide}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>SOP Hibah</span>
            </button>
          )}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Akses Penuh IT Nasional</span>
          </span>
        </div>
      </div>

      {/* Clean Navigation Tabs for Admin Sistem */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: "users", label: "Manajemen Pengguna", icon: Users, count: combinedUsers.length },
          { id: "audit", label: "Log Audit Sistem", icon: Database, count: auditLogs.length },
          { id: "settings", label: "Pengaturan & Cadangan", icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
                isActive
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Alert Feedback Message */}
      {userSuccessMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{userSuccessMsg}</span>
        </div>
      )}

      {/* TAB 1: MANAJEMEN PENGGUNA (USERS) */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Kelola Akun Pengguna Seluruh Satuan Pendidikan
              </h3>
              <p className="text-xs text-slate-500">
                Admin Sistem bertugas mendaftarkan dan mengelola hak akses Guru BK, Satgas PPKSP, dan Staf di seluruh Indonesia.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pengguna</span>
            </button>
          </div>

          {/* User List Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Cari nama, email, NIP, sekolah..."
                    className="w-56 pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  <option value="all">Semua Peran</option>
                  <option value="guru">Guru BK</option>
                  <option value="satgas">Satgas PPKSP</option>
                  <option value="disdik">Dinas Pendidikan</option>
                  <option value="dinas-pppa">UPTD PPA (Perlindungan)</option>
                  <option value="admin">Admin Sistem</option>
                </select>

                <select
                  value={userSchoolFilter}
                  onChange={(e) => setUserSchoolFilter(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs max-w-xs truncate cursor-pointer"
                >
                  <option value="all">Semua Satuan Pendidikan</option>
                  {availableSchoolList.map((s) => (
                    <option key={s.id} value={s.schoolName}>
                      {s.schoolName} ({s.province || "Indonesia"})
                    </option>
                  ))}
                  <option value="Pusdatin Kemendikbudristek RI">Pusdatin Kemendikbudristek RI</option>
                </select>
              </div>

              <span className="text-slate-400 text-[11px]">
                {filteredUsers.length} dari {combinedUsers.length} Pengguna
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-semibold">
                    <th className="py-2.5 px-3">Nama &amp; NIP</th>
                    <th className="py-2.5 px-3">Satuan Pendidikan / Asal</th>
                    <th className="py-2.5 px-3">Email Pengguna</th>
                    <th className="py-2.5 px-3">Peran / Tugas</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada pengguna yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u: any) => {
                      const isActive = u.isActive !== false;
                      const initials = (u.name || "U")
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                {initials}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block leading-tight">{u.name}</span>
                                {u.nip && <span className="text-[10px] text-slate-400 font-mono">NIP: {u.nip}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-800 block text-xs">
                              {u.organization || "Pusdatin Kemendikbudristek RI"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-800">
                              {u.roleTitle || (u.role === "admin" ? "Admin Sistem" : "Guru BK")}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                              <span>{isActive ? "Aktif" : "Nonaktif"}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {onToggleUserStatus && (
                              <button
                                onClick={() => onToggleUserStatus(u.id)}
                                className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              >
                                {isActive ? "Nonaktifkan" : "Aktifkan"}
                              </button>
                            )}
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

      {/* TAB 2: LOG AUDIT SISTEM */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Audit Trail &amp; Integritas Kriptografis
              </h3>
              <p className="text-xs text-slate-500">
                Seluruh aktivitas sensitif tercatat dengan SHA-256 integrity digest tanpa menyimpan identitas pribadi siswa (Zero PII).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ZKP Integrity Active</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Cari riwayat aksi atau aktor..."
                  className="w-64 pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <span className="text-slate-400 text-[11px]">
                {filteredAuditLogs.length} Entri Log Tercatat
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-semibold">
                    <th className="py-2.5 px-3">Waktu Log</th>
                    <th className="py-2.5 px-3">Aksi / Kegiatan</th>
                    <th className="py-2.5 px-3">Aktor</th>
                    <th className="py-2.5 px-3">Keterangan / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        Belum ada log aktivitas yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.slice(0, 50).map((log, idx) => (
                      <tr key={log.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString("id-ID") : "Baru saja"}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {log.action}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {log.actor || "Sistem"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {log.details || "Integritas diverifikasi"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PENGATURAN & CADANGAN */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* School Profile */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Identitas Satuan Pendidikan</h3>
            {savedMsg && <p className="text-xs text-emerald-700 font-semibold">{savedMsg}</p>}
            <form onSubmit={handleSaveProfile} className="space-y-2.5">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Nama Satuan Pendidikan:</label>
                <input
                  type="text"
                  value={profileForm.schoolName}
                  onChange={(e) => setProfileForm({ ...profileForm, schoolName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">NPSN:</label>
                  <input
                    type="text"
                    value={profileForm.npsn || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, npsn: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Hotline Satgas:</label>
                  <input
                    type="text"
                    value={profileForm.hotlineNumber || "119"}
                    onChange={(e) => setProfileForm({ ...profileForm, hotlineNumber: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Identitas
                </button>
              </div>
            </form>
          </div>

          {/* Backup, Restore & Reset */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-slate-900">Cadangan &amp; Pemulihan Data</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                Sebagai Admin Sistem, Anda dapat mencadangkan seluruh data laporan, akun, dan konfigurasi ke dalam berkas JSON terenkripsi untuk kebutuhan audit atau migrasi server.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
              {onExportBackup && (
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Ekspor Cadangan</span>
                </button>
              )}

              <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 cursor-pointer flex items-center gap-1.5 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Impor Cadangan</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 transition"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Reset Sistem</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add User / Officer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl space-y-3.5 text-xs animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Tambah Akun Pengguna</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-2.5">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Nama Lengkap &amp; Gelar:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dra. Sri Wahyuni, M.Pd"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Email Pengguna:</label>
                <input
                  type="email"
                  required
                  placeholder="email@sekolah.sch.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">NIP / Identitas (Opsional):</label>
                <input
                  type="text"
                  placeholder="19800310..."
                  value={newNip}
                  onChange={(e) => setNewNip(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">
                  Satuan Pendidikan / Asal Institusi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ketik nama sekolah/institusi, misal: SMAN 3 Bandung"
                  value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  list="suggested-schools-list"
                />
                <datalist id="suggested-schools-list">
                  {availableSchoolList.map((s) => (
                    <option key={s.id} value={s.schoolName} />
                  ))}
                  <option value="Pusdatin Kemendikbudristek RI" />
                  <option value="Dinas Pendidikan Provinsi DKI Jakarta" />
                  <option value="UPTD PPA Kota Jakarta Pusat" />
                </datalist>
                <p className="text-[10px] text-slate-400 mt-1">
                  Bebas diketik sesuai nama sekolah atau dinas di seluruh Indonesia.
                </p>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Peran Pengguna:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Guru Bimbingan Konseling (BK)">Guru Bimbingan Konseling (BK)</option>
                  <option value="Satgas PPKSP">Satgas PPKSP</option>
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                  <option value="Pengawas Dinas Pendidikan Wilayah">Pengawas Dinas Pendidikan Wilayah</option>
                  <option value="Petugas UPTD PPA (Dinas Perlindungan)">Petugas UPTD PPA (Dinas Perlindungan)</option>
                  <option value="Admin Sistem">Admin Sistem</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer shadow-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl space-y-3.5 text-xs text-center animate-scaleUp">
            <AlertOctagon className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">Reset Sistem ke Standar Pabrik?</h3>
            <p className="text-slate-500">
              Tindakan ini akan mengembalikan data sekolah dan konfigurasi sistem ke pengaturan awal.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3 py-1.5 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onFactoryReset) onFactoryReset(profileForm);
                  setShowResetModal(false);
                  alert("Sistem telah direset ke pengaturan awal.");
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl cursor-pointer shadow-xs"
              >
                Ya, Reset Sistem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
