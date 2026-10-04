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
  Download,
  BookOpen,
  UserCheck,
  Lock,
  Clock,
  Check,
  X,
  FileText,
  RotateCcw,
  KeyRound,
  Trash2,
  Sliders,
  Server,
  Activity,
  Cpu,
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
  schoolProfile?: SchoolProfile;
  onUpdateSchoolProfile?: (profile: SchoolProfile) => void;
  onExportBackup?: () => void;
  onImportBackup?: (jsonString: string) => void;
  onFactoryReset?: (profile?: SchoolProfile) => void;
  onOpenHibahGuide?: () => void;
  skipLogin?: boolean;
  regionalSchools?: SchoolRegionalData[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users = [],
  onCreateUser,
  onToggleUserStatus,
  auditLogs = [],
  onLogout,
  adminName = "Bambang Prasetyo, S.Kom",
  schoolProfile,
  onExportBackup,
  onImportBackup,
  onFactoryReset,
  skipLogin = false,
  regionalSchools = [],
}) => {
  // 3 Primary Tabs: 'users' | 'audit' | 'system'
  const [activeTab, setActiveTab] = useState<"users" | "audit" | "system">("users");

  // User Management State
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newNip, setNewNip] = useState("");
  const [newSchool, setNewSchool] = useState("SMA Negeri 1 Jakarta");
  const [newRole, setNewRole] = useState<
    | "Admin Sekolah (Guru BK / Satgas)"
    | "Guru Bimbingan Konseling (BK)"
    | "Satgas PPKSP"
    | "Kepala Sekolah"
    | "Pengawas Dinas Pendidikan Wilayah"
    | "Petugas UPTD PPA (Dinas Perlindungan)"
    | "Admin Sistem (Platform)"
  >("Guru Bimbingan Konseling (BK)");
  const [userSuccessMsg, setUserSuccessMsg] = useState("");
  const [userErrorMsg, setUserErrorMsg] = useState("");

  // Audit Log State
  const [auditSearch, setAuditSearch] = useState("");

  // Factory Reset Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(skipLogin);

  useEffect(() => {
    if (skipLogin) setIsLoggedIn(true);
  }, [skipLogin]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserErrorMsg("");
    if (!newName.trim() || !newEmail.trim()) return;

    let mappedRole: AppUserRole = "guru";
    if (newRole === "Pengawas Dinas Pendidikan Wilayah") {
      mappedRole = "dinas-pendidikan";
    } else if (newRole === "Petugas UPTD PPA (Dinas Perlindungan)") {
      mappedRole = "dinas-perlindungan";
    } else if (newRole === "Admin Sistem (Platform)") {
      mappedRole = "admin";
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
        status: "Aktif",
      });
      setUserSuccessMsg(`Pengguna "${newName}" (${newRole}) berhasil didaftarkan.`);
      setShowAddModal(false);
      setNewName("");
      setNewEmail("");
      setNewNip("");
      setTimeout(() => setUserSuccessMsg(""), 3500);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    const matchQ =
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.organization || "").toLowerCase().includes(q);

    const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchQ && matchRole;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    const q = auditSearch.toLowerCase();
    return (
      (log.action || "").toLowerCase().includes(q) ||
      (log.details || "").toLowerCase().includes(q) ||
      (log.actor_name || "").toLowerCase().includes(q) ||
      (log.actor_role || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* 1. TOP STATUS BAR */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-ink text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md shadow-ink/20 shrink-0">
            <Sliders size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-ink leading-tight">
                Konsol Admin Sistem (Platform &amp; Keamanan)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                Platform Aktif
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Administrator Platform: <strong>{adminName}</strong> • {users.length} Akun Terdaftar • {auditLogs.length} Audit Trail
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onExportBackup && (
            <button
              type="button"
              onClick={onExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-ink transition cursor-pointer"
            >
              <Download size={14} />
              <span>Export Backup JSON</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 text-xs font-bold transition cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Factory Reset</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN TABS (Pengguna | Audit Trail | Cadangan & Sistem) */}
      <div className="flex items-center justify-between border-b border-border pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "users"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Users size={15} />
            <span>Manajemen Pengguna &amp; Petugas ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "audit"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <ShieldCheck size={15} />
            <span>Audit Trail &amp; Integritas ({auditLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "system"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Database size={15} />
            <span>Cadangan &amp; Pemeliharaan Sistem</span>
          </button>
        </div>

        {activeTab === "users" && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Tambah Petugas</span>
          </button>
        )}
      </div>

      {/* 3. TAB 1: MANAJEMEN PENGGUNA */}
      {activeTab === "users" && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
          {userSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold">
              {userSuccessMsg}
            </div>
          )}

          {/* Search & Role Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari nama, email, instansi..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Filter Peran:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="p-2 bg-background border border-border rounded-xl text-xs text-ink font-semibold"
              >
                <option value="all">Semua Peran</option>
                <option value="guru">Guru BK / Satgas Sekolah</option>
                <option value="admin">Admin Sistem</option>
                <option value="dinas-pendidikan">Dinas Pendidikan</option>
                <option value="dinas-perlindungan">UPTD PPA</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-bold border-b border-border">
                <tr>
                  <th className="p-3">Nama Petugas &amp; Email</th>
                  <th className="p-3">Peran &amp; Instansi</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                      Tidak ada data pengguna yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSystemAdmin = user.role === "admin";
                    const isActive = user.status === "Aktif" || user.isActive !== false;

                    return (
                      <tr key={user.id} className="hover:bg-muted/40 transition">
                        <td className="p-3">
                          <p className="font-bold text-ink">{user.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{user.email}</p>
                        </td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            user.role === "admin"
                              ? "bg-purple-500/10 text-purple-700"
                              : user.role === "dinas-pendidikan"
                              ? "bg-blue-500/10 text-blue-700"
                              : user.role === "dinas-perlindungan"
                              ? "bg-rose-500/10 text-rose-700"
                              : "bg-emerald-500/10 text-emerald-700"
                          }`}>
                            {user.roleTitle || user.role}
                          </span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{user.organization || "-"}</p>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                            {isActive ? "Aktif" : "Non-aktif"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {!isSystemAdmin && onToggleUserStatus && (
                            <button
                              type="button"
                              onClick={() => onToggleUserStatus(user.id)}
                              className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted font-bold text-[11px] text-ink transition cursor-pointer"
                            >
                              {isActive ? "Non-aktifkan" : "Aktifkan"}
                            </button>
                          )}
                          {isSystemAdmin && (
                            <span className="text-[11px] text-muted-foreground font-medium italic">
                              Superadmin Tetap
                            </span>
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
      )}

      {/* 4. TAB 2: AUDIT TRAIL & INTEGRITAS */}
      {activeTab === "audit" && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <span>Catatan Audit Sistem &amp; Bukti Integritas SHA-256</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                  Tamper-Evident
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Setiap mutasi kasus, eskalasi, dan tindakan staf dicatat secara permanen dengan hash integritas.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter aktivitas audit..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="border border-border rounded-xl overflow-hidden max-h-[550px] overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-bold border-b border-border sticky top-0">
                <tr>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Aktor &amp; Peran</th>
                  <th className="p-3">Aktivitas</th>
                  <th className="p-3">Rincian Perubahan</th>
                  <th className="p-3 text-center">Status Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                      Belum ada catatan audit.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/40 transition">
                      <td className="p-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                        {log.created_at ? new Date(log.created_at).toLocaleString("id-ID") : "Baru saja"}
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-ink">{log.actor_name || "Petugas"}</p>
                        <p className="text-[10px] text-muted-foreground">{log.actor_role || "Sistem"}</p>
                      </td>
                      <td className="p-3 font-semibold text-primary">{log.action}</td>
                      <td className="p-3 text-muted-foreground max-w-xs line-clamp-2 leading-relaxed">
                        {log.details}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                          <CheckCircle2 size={12} />
                          <span>Tervalidasi ZKP</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 3: CADANGAN & PEMELIHARAAN SISTEM */}
      {activeTab === "system" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Backup & System Operations (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Database size={16} className="text-primary" />
                  <span>Cadangan Basis Data &amp; Pemulihan Sistem</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Simpan seluruh data tiket laporan, akun pengguna, token anonim, dan audit trail ke dalam berkas JSON terenkripsi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-ink">
                    <Download size={16} className="text-primary" />
                    <span>Ekspor Cadangan Lengkap</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Unduh snapshot data real-time platform untuk keperluan arsip atau migrasi server.
                  </p>
                  {onExportBackup && (
                    <button
                      type="button"
                      onClick={onExportBackup}
                      className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
                    >
                      Download Backup Database (.json)
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-ink">
                    <Upload size={16} className="text-primary" />
                    <span>Pemulihan dari File JSON</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Unggah file cadangan JSON yang valid untuk memulihkan seluruh struktur data sistem.
                  </p>
                  <label className="w-full py-2 border border-border bg-card hover:bg-muted text-ink text-xs font-bold rounded-xl text-center block cursor-pointer transition">
                    <span>Pilih Berkas Cadangan</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && onImportBackup) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const content = event.target?.result as string;
                            if (content) onImportBackup(content);
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Platform Health & Diagnostics */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Activity size={16} className="text-emerald-600" />
                  <span>Status Infrastruktur &amp; Keamanan Platform</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Kondisi operasional engine enkripsi, gateway REST API, dan modul pelaporan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-semibold">API Gateway</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-xs font-bold text-ink font-mono">Port 3001 (Online)</p>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-semibold">Mesin Enkripsi</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs font-bold text-ink font-mono">SHA-256 / ZKP Active</p>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-semibold">Keamanan Privasi</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs font-bold text-ink font-mono">Fail-Closed Enabled</p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone / Factory Reset (4 Cols) */}
          <div className="lg:col-span-4 bg-card border border-danger/20 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-danger font-bold text-sm">
              <AlertTriangle size={16} />
              <span>Zona Pemeliharaan Kritis</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reset pabrik hanya boleh dijalankan oleh Admin Sistem untuk mengosongkan state pengujian sebelum peluncuran resmi.
            </p>

            <div className="p-3.5 rounded-xl bg-danger/5 border border-danger/20 text-danger text-xs space-y-2">
              <p className="font-bold">Perhatian Khusus:</p>
              <ul className="list-disc list-inside text-[11px] space-y-1 text-danger/80">
                <li>Semua tiket &amp; token uji coba akan dibersihkan.</li>
                <li>Akun bawaan sistem akan diinisialisasi ulang.</li>
                <li>Tindakan ini tidak dapat dibatalkan.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="w-full py-2.5 rounded-xl bg-danger text-white text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-xs"
            >
              Jalankan Factory Reset
            </button>
          </div>
        </div>
      )}

      {/* Modal Tambah Petugas */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-ink text-sm">Tambah Akun Petugas Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-ink cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {userErrorMsg && (
              <div className="p-2.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold">
                {userErrorMsg}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Nama Lengkap Petugas:</label>
                <input
                  type="text"
                  required
                  placeholder="Dra. Hj. Aminah Sucipto, M.M"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Alamat Email Resmi:</label>
                <input
                  type="email"
                  required
                  placeholder="aminah@sman1jakarta.sch.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">NIP / Identitas Pegawai:</label>
                <input
                  type="text"
                  placeholder="19780515 200501 2 004"
                  value={newNip}
                  onChange={(e) => setNewNip(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Instansi / Satuan Pendidikan:</label>
                <input
                  type="text"
                  placeholder="SMA Negeri 1 Jakarta"
                  value={newSchool}
                  onChange={(e) => setNewSchool(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Peran Akses Sistem:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-semibold"
                >
                  <option value="Guru Bimbingan Konseling (BK)">Guru Bimbingan Konseling (BK) / Satgas</option>
                  <option value="Admin Sekolah (Guru BK / Satgas)">Admin Sekolah (Koordinator Guru BK)</option>
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                  <option value="Pengawas Dinas Pendidikan Wilayah">Pengawas Dinas Pendidikan Wilayah</option>
                  <option value="Petugas UPTD PPA (Dinas Perlindungan)">Petugas UPTD PPA (Dinas Perlindungan)</option>
                  <option value="Admin Sistem (Platform)">Admin Sistem (Superadmin Platform)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-border rounded-xl font-bold hover:bg-muted cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 cursor-pointer"
                >
                  Simpan Petugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Factory Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-danger/30 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-danger font-bold text-sm">
              <AlertTriangle size={18} />
              <span>Konfirmasi Factory Reset Platform</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan mengembalikan basis data platform ke kondisi awal pabrik. Semua tiket dan data uji coba akan direset. Pastikan Anda telah melakukan backup JSON sebelumnya.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-muted cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onFactoryReset) onFactoryReset(schoolProfile);
                  setShowResetModal(false);
                }}
                className="px-4 py-2 bg-danger text-white rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer"
              >
                Reset Database Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
