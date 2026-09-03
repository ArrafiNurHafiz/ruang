import React, { useState, useEffect } from "react";
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Lock,
  LogIn,
  Search,
  Filter,
  MessageSquare,
  CheckCircle2,
  AlertOctagon,
  Clock,
  FileText,
  Download,
  Eye,
  Send,
  Plus,
  Sparkles,
  ChevronDown,
  Layers,
  BarChart3,
  Calendar,
  LogOut,
  Printer,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  ReportTicket,
  CounselorUser,
  ReportStatus,
  ReportCategory,
  ReportUrgency,
  SchoolProfile,
} from "../types";
import { api } from "../lib/api";
import { formatBytes } from "../utils/crypto";
import { CounselorVectorAvatar } from "./AnimatedIllustrations";
import { OfficialCaseReportModal } from "./OfficialCaseReportModal";

interface AdminCounselorDashboardProps {
  tickets: ReportTicket[];
  loggedCounselor: CounselorUser | null;
  onLogin: (user: CounselorUser) => void;
  onLogout: () => void;
  onUpdateTicketStatus: (
    ticketId: string,
    status: ReportStatus,
    actionSummary?: string,
  ) => void;
  onAddCounselorNote: (ticketId: string, note: string) => void;
  onCounselorReply: (ticketId: string, text: string) => void;
  onEscalateTicket?: (
    ticketId: string,
    target: "Dinas Pendidikan" | "Dinas Perlindungan (UPTD PPA)" | "Keduanya",
    reason: string,
  ) => void;
  onOpenRoleSwitcher?: () => void;
  schoolProfile: SchoolProfile;
}

export const AdminCounselorDashboard: React.FC<
  AdminCounselorDashboardProps
> = ({
  tickets,
  loggedCounselor,
  onLogin,
  onLogout,
  onUpdateTicketStatus,
  onAddCounselorNote,
  onCounselorReply,
  onEscalateTicket,
  onOpenRoleSwitcher,
  schoolProfile,
}) => {
  // BAP Modal State
  const [showBapModal, setShowBapModal] = useState(false);
  const [bapSelectedTicket, setBapSelectedTicket] =
    useState<ReportTicket | null>(null);

  // Login State
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  // Account Request State
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqRole, setReqRole] = useState("guru");
  const [reqOrg, setReqOrg] = useState("");
  const [reqIdentifier, setReqIdentifier] = useState("");
  const [reqReason, setReqReason] = useState("");
  const [reqSubmitting, setReqSubmitting] = useState(false);
  const [reqSuccess, setReqSuccess] = useState(false);
  const [reqError, setReqError] = useState("");

  // Dashboard Filters
  const [filterCategory, setFilterCategory] = useState<string>("Semua");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [filterUrgency, setFilterUrgency] = useState<string>("Semua");
  const [searchTicket, setSearchTicket] = useState<string>("");

  // Active Selected Ticket for Detailed Inspection
  const safeTickets = tickets.map((t) => ({
    ...t,
    attachments: t.attachments ?? [],
    messages: t.messages ?? [],
    counselorNotes: t.counselorNotes ?? [],
  }));
  const [selectedTicket, setSelectedTicket] = useState<ReportTicket | null>(
    safeTickets[0] || null,
  );
  const [replyText, setReplyText] = useState<string>("");
  const [internalNoteText, setInternalNoteText] = useState<string>("");

  useEffect(() => {
    if (selectedTicket) {
      const updated = safeTickets.find((t) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  }, [tickets]);
  const [newStatusSelection, setNewStatusSelection] =
    useState<ReportStatus>("ditinjau");
  const [actionSummaryInput, setActionSummaryInput] = useState<string>("");

  // Escalation Modal State
  const [showEscalationModal, setShowEscalationModal] =
    useState<boolean>(false);
  const [escalationTarget, setEscalationTarget] = useState<
    "Dinas Pendidikan" | "Dinas Perlindungan (UPTD PPA)" | "Keduanya"
  >("Dinas Perlindungan (UPTD PPA)");
  const [escalationReason, setEscalationReason] = useState<string>("");
  const [escalationSuccess, setEscalationSuccess] = useState<boolean>(false);

  const handleLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await api.login({ email, password, role: 'guru' });
      onLogin({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.roleTitle,
        nip: response.user.identifier.replace('NIP: ', ''),
        avatar: response.user.avatar,
        schoolName: response.user.organization
      });
    } catch (err: any) {
      const msg = err.name === 'AbortError' ? 'Server tidak merespons. Pastikan backend berjalan di port 3001.' : (err.message || "Login failed");
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAccountRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqSubmitting(true);
    setReqError("");
    try {
      const res = await fetch('/api/account-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: reqName, email: reqEmail, role: reqRole, organization: reqOrg, identifier: reqIdentifier, reason: reqReason })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal mengirim pengajuan');
      }
      setReqSuccess(true);
    } catch (err: any) {
      setReqError(err.name === 'AbortError' ? 'Server tidak merespons.' : (err.message || 'Gagal mengirim pengajuan'));
    } finally {
      setReqSubmitting(false);
    }
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !escalationReason) return;
    if (onEscalateTicket) {
      onEscalateTicket(selectedTicket.id, escalationTarget, escalationReason);
    }
    setEscalationSuccess(true);
    setTimeout(() => {
      setEscalationSuccess(false);
      setShowEscalationModal(false);
      setEscalationReason("");
    }, 2000);
  };

  const filteredTickets = safeTickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTicket.toLowerCase()) ||
      t.story.toLowerCase().includes(searchTicket.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTicket.toLowerCase());
    const matchesCat =
      filterCategory === "Semua" || t.category === filterCategory;
    const matchesStatus = filterStatus === "Semua" || t.status === filterStatus;
    const matchesUrgency =
      filterUrgency === "Semua" || t.urgency.includes(filterUrgency);
    return matchesSearch && matchesCat && matchesStatus && matchesUrgency;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    onCounselorReply(selectedTicket.id, replyText.trim());
    setReplyText("");

    // Refresh selected ticket from latest props
    const updated = safeTickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !internalNoteText.trim()) return;

    onAddCounselorNote(selectedTicket.id, internalNoteText.trim());
    setInternalNoteText("");
  };

  const handleStatusChange = () => {
    if (!selectedTicket) return;
    onUpdateTicketStatus(
      selectedTicket.id,
      newStatusSelection,
      actionSummaryInput,
    );
    setActionSummaryInput("");
  };

  // Metrics
const totalCount = safeTickets.length;
  const criticalCount = safeTickets.filter((t) =>
    t.urgency === "Kritis" || t.urgency === "Tinggi",
  ).length;
  const inActionCount = safeTickets.filter((t) => t.status === "tindakan").length;
  const closedCount = safeTickets.filter((t) => t.status === "ditutup").length;

  // 1. IF NOT LOGGED IN: SHOW LOGIN SCREEN
  if (!loggedCounselor) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-fadeIn">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] text-white p-6 sm:p-8 text-center space-y-2 border-b border-blue-500/30">
            <div className="w-14 h-14 bg-white/15 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/20 shadow-lg shadow-blue-950/20 backdrop-blur-xs">
              <UserCheck className="w-8 h-8 text-sky-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Portal Guru BK &amp; Satgas PPKSP
            </h2>
            <p className="text-xs text-blue-100/90">
              Akses khusus konselor terverifikasi untuk menangani laporan siswa
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <form onSubmit={handleLoginForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Konselor / Guru BK:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Kata Sandi:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                id="btn-counselor-login-submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:bg-slate-300 disabled:shadow-none"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk Dashboard Konselor</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setShowRequestForm(!showRequestForm); setReqSuccess(false); setReqError(""); }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                {showRequestForm ? "← Kembali ke Login" : "Belum punya akun? Ajukan akun baru"}
              </button>
            </div>

            {showRequestForm && (
              <div className="border-t border-slate-200 pt-5 mt-2 space-y-4 animate-fadeIn">
                <h3 className="font-bold text-sm text-slate-900">Pengajuan Akun Baru</h3>
                <p className="text-[11px] text-slate-500">Ajukan akun untuk Guru BK, Satgas, atau Dinas. Admin sekolah akan menyetujui pengajuan Anda.</p>

                {reqSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-emerald-800">Pengajuan berhasil dikirim!</p>
                    <p className="text-[11px] text-emerald-700">Admin sekolah akan meninjau dan menyetujui akun Anda.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAccountRequest} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Nama Lengkap</label>
                        <input type="text" required value={reqName} onChange={(e) => setReqName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Email</label>
                        <input type="email" required value={reqEmail} onChange={(e) => setReqEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Peran</label>
                        <select value={reqRole} onChange={(e) => setReqRole(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="guru">Guru BK / Satgas</option>
                          <option value="admin">Admin Sekolah</option>
                          <option value="dinas-pendidikan">Dinas Pendidikan</option>
                          <option value="dinas-perlindungan">Dinas Perlindungan (PPA)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Instansi / Sekolah</label>
                        <input type="text" required value={reqOrg} onChange={(e) => setReqOrg(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">NIP / ID Pegawai</label>
                      <input type="text" value={reqIdentifier} onChange={(e) => setReqIdentifier(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Alasan Pengajuan</label>
                      <textarea rows={2} required value={reqReason} onChange={(e) => setReqReason(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jelaskan kebutuhan akses Anda..." />
                    </div>
                    {reqError && <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-[11px] text-red-700">{reqError}</div>}
                    <button type="submit" disabled={reqSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2">
                      {reqSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengirim...</> : "Kirim Pengajuan"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED IN COUNSELOR DASHBOARD
  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Top Welcome & Counselor Profile Bar */}
      <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] text-white rounded-3xl p-6 shadow-xl border border-blue-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CounselorVectorAvatar className="w-14 h-14 border-2 border-blue-300 shadow-md shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white">
                {loggedCounselor.name}
              </h1>
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-md">
                {loggedCounselor.role}
              </span>
            </div>
            <p className="text-xs text-blue-100 font-mono mt-0.5">
              NIP: {loggedCounselor.nip} | {loggedCounselor.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-950/80 hover:bg-red-600 text-xs font-bold text-slate-100 hover:text-white transition-all border border-blue-400/40 hover:border-red-500 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Portal</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Laporan
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {totalCount}
          </div>
          <span className="text-[11px] text-blue-600 font-medium">
            Terlindungi Kriptografi
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-red-100 shadow-lg shadow-red-100/30 space-y-1 bg-red-50/30">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
            Kasus Kritis
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-700">
            {criticalCount}
          </div>
          <span className="text-[11px] text-red-600 font-medium">
            Prioritas Triage Utama
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-lg shadow-amber-100/30 space-y-1 bg-amber-50/30">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Dalam Tindakan
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-800">
            {inActionCount}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">
            Satgas Sedang Menangani
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-lg shadow-emerald-100/30 space-y-1 bg-emerald-50/30">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Tuntas &amp; Ditutup
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
            {closedCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            Siswa Terpantau Aman
          </span>
        </div>
      </div>

      {/* Main Workspace: Left List + Right Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage List & Search (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                placeholder="Cari ID tiket, kronologi, lokasi..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs focus:outline-none cursor-pointer"
              >
                <option value="Semua">Status: Semua</option>
                <option value="diterima">Diterima</option>
                <option value="ditinjau">Ditinjau</option>
                <option value="tindakan">Tindakan</option>
                <option value="ditutup">Ditutup</option>
              </select>

              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs focus:outline-none cursor-pointer"
              >
                <option value="Semua">Urgensi: Semua</option>
                <option value="Kritis">Kritis</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>

            {/* Ticket List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Tidak ada laporan yang cocok dengan filter.
                </div>
              ) : (
                filteredTickets.map((item) => {
                  const isSelected = selectedTicket?.id === item.id;
                  const isCritical = item.urgency.includes("Kritis");

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTicket(item)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500"
                          : "border-slate-100 bg-white hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-blue-950">
                            {item.id}
                          </span>
                          {isCritical && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-600 text-white animate-pulse">
                              Kritis
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            item.status === "diterima"
                              ? "bg-amber-100 text-amber-800"
                              : item.status === "ditinjau"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "tindakan"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-800 truncate mb-1">
                        {item.category}
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                        {item.redactedStory}
                      </p>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                        <span>{item.location}</span>
                        <span>{item.messages.length} pesan chat</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Ticket Case Manager & 2-Way Reply (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTicket ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 space-y-6 animate-fadeIn">
              {/* Ticket Header & Status Changer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-black text-blue-950">
                      {selectedTicket.id}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Masuk:{" "}
                    {new Date(selectedTicket.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBapSelectedTicket(selectedTicket);
                      setShowBapModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title="Cetak Berita Acara Penanganan Kasus (BAP)"
                  >
                    <Printer className="w-3.5 h-3.5 text-sky-300" />
                    <span>Cetak BAP Resmi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEscalationModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Eskalasi ke Dinas / UPTD</span>
                  </button>

                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      onUpdateTicketStatus(
                        selectedTicket.id,
                        e.target.value as ReportStatus,
                      )
                    }
                    className="p-2 bg-blue-50 border border-blue-300 rounded-xl text-xs font-bold text-blue-950 focus:outline-none cursor-pointer"
                  >
                    <option value="diterima">Status: Diterima</option>
                    <option value="ditinjau">Status: Ditinjau</option>
                    <option value="tindakan">Status: Tindakan</option>
                    <option value="ditutup">Status: Ditutup</option>
                  </select>
                </div>
              </div>

              {/* Case Details Box */}
              <div className="space-y-3">
                {selectedTicket.verifiedSchoolToken && (
                  <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Verifikasi Sekolah:</strong> Siswa Terotentikasi
                      Kode Resmi{" "}
                      <span className="font-mono font-bold bg-emerald-200/80 px-1.5 py-0.5 rounded text-emerald-950">
                        {selectedTicket.verifiedSchoolToken}
                      </span>{" "}
                      ({selectedTicket.studentBatch || "Siswa Terdaftar"}) •
                      Bebas Infiltrator/Penyusup
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Urgensi:
                    </span>
                    <strong className="text-red-700 font-bold">
                      {selectedTicket.urgency}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Lokasi:
                    </span>
                    <strong className="text-slate-800">
                      {selectedTicket.location}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Waktu:
                    </span>
                    <strong className="text-slate-800">
                      {selectedTicket.incidentDate}
                    </strong>
                  </div>
                </div>

                {/* Sanitized Narrative */}
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Deskripsi Kejadian (Terenkripsi &amp; Disanitasi):
                  </span>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                    {selectedTicket.redactedStory}
                  </div>
                </div>

                {/* Attachments */}
                {(selectedTicket.attachments ?? []).length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Bukti Lampiran Siswa ({(selectedTicket.attachments ?? []).length}
                      ):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(selectedTicket.attachments ?? []).map((att) => (
                        <div
                          key={att.id}
                          className="p-2.5 border border-slate-200 rounded-xl flex items-center justify-between text-xs bg-white"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="truncate font-medium">
                              {att.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {formatBytes(att.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Counselor Notes (Confidential) */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Catatan Internal Rahasia BK (Hanya Terlihat Guru BK):
                  </span>
                </div>

                <div className="space-y-1 text-xs text-amber-900">
                  {selectedTicket.counselorNotes &&
                    selectedTicket.counselorNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-white rounded-lg border border-amber-200/80"
                      >
                        • {note}
                      </div>
                    ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    placeholder="Tambah catatan internal tim BK..."
                    className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Simpan Catatan
                  </button>
                </form>
              </div>

              {/* 2-Way Encrypted Chat with Student */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-72">
                <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-3 px-4 flex items-center justify-between text-xs border-b border-blue-900/40">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span className="font-bold">
                      Kanal Percakapan Rahasia dengan Tiket #{selectedTicket.id}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    End-to-End Encrypted
                  </span>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50 text-xs">
                  {(selectedTicket.messages ?? []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "counselor" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-2.5 rounded-xl ${
                          msg.sender === "counselor"
                            ? "bg-blue-600 text-white"
                            : msg.sender === "system"
                              ? "bg-slate-200 text-slate-700 text-center w-full"
                              : "bg-white border border-slate-200 text-slate-800"
                        }`}
                      >
                        <div className="text-[10px] opacity-75 mb-0.5">
                          {msg.sender === "counselor"
                            ? "Anda (Guru BK)"
                            : msg.sender === "pelapor"
                              ? "Siswa (Anonim)"
                              : "Sistem"}
                        </div>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleSendReply}
                  className="p-2.5 bg-white border-t border-slate-100 flex gap-2"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Balas pesan siswa (arahkan ke tempat aman / jadwal konseling)..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-12 text-center text-slate-400">
              Pilih laporan di sebelah kiri untuk melihat detail.
            </div>
          )}
        </div>
      </div>

      {/* Modal Eskalasi Kasus ke Dinas / UPTD */}
      {showEscalationModal && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp">
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Protokol Penanganan Darurat
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Eskalasi Kasus Tiket #{selectedTicket.id}
              </h3>
              <p className="text-xs text-slate-500">
                Teruskan rujukan kasus berisiko tinggi / trauma khusus ke dinas
                pembina dan unit perlindungan anak.
              </p>
            </div>

            {escalationSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Rujukan darurat berhasil diteruskan ke {escalationTarget}!
                </span>
              </div>
            )}

            <form onSubmit={handleEscalateSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Tujuan Eskalasi &amp; Rujukan:
                </label>
                <select
                  value={escalationTarget}
                  onChange={(e) => setEscalationTarget(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  <option value="Dinas Perlindungan (UPTD PPA)">
                    Dinas Perlindungan (UPTD PPA) - Pendampingan Psikologis
                    &amp; Rumah Aman
                  </option>
                  <option value="Dinas Pendidikan">
                    Dinas Pendidikan - Supervisi Mediasi Antar-Sekolah &amp;
                    Bantuan Hukum
                  </option>
                  <option value="Keduanya">
                    Keduanya (UPTD PPA &amp; Dinas Pendidikan Terpadu)
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Alasan Eskalasi &amp; Kondisi Korban Saat Ini:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Misal: Korban mengalami trauma berat/ancaman fisik berulang di luar area sekolah yang memerlukan safehouse..."
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEscalationModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Kirim Rujukan Resmi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cetak Berita Acara Kasus Resmi (BAP) */}
      <OfficialCaseReportModal
        isOpen={showBapModal}
        onClose={() => {
          setShowBapModal(false);
          setBapSelectedTicket(null);
        }}
        ticket={bapSelectedTicket}
        schoolProfile={schoolProfile}
      />
    </div>
  );
};
