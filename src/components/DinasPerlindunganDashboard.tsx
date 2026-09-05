import React, { useState } from "react";
import {
  HeartHandshake,
  ShieldAlert,
  UserCheck,
  Scale,
  PhoneCall,
  FileText,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Search,
  LogOut,
  Activity,
  Home,
  Stethoscope,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  LogIn,
  RefreshCw,
} from "lucide-react";
import { ProtectionIntervention, ReportTicket } from "../types";
import { api } from "../lib/api";

interface DinasPerlindunganDashboardProps {
  interventions: ProtectionIntervention[];
  onUpdateInterventionStage: (
    id: string,
    stage: ProtectionIntervention["stage"],
    note?: string,
  ) => void;
  onAssignExpert: (
    id: string,
    psychologist?: string,
    legalAid?: string,
  ) => void;
  onLogout: () => void;
  officerName?: string;
  skipLogin?: boolean;
}

export const DinasPerlindunganDashboard: React.FC<
  DinasPerlindunganDashboardProps
> = ({
  interventions,
  onUpdateInterventionStage,
  onAssignExpert,
  onLogout,
  officerName = "Sri Rahayu, S.Psi., M.Si",
  skipLogin = false,
}) => {
  const [selectedIntervention, setSelectedIntervention] =
    useState<ProtectionIntervention | null>(interventions[0] || null);
  const [activeTab, setActiveTab] = useState<"kasus" | "tim" | "jejaring">(
    "kasus",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");
  const [selectedStage, setSelectedStage] =
    useState<ProtectionIntervention["stage"]>("Asesmen Awal");

  // Assign Expert state
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [assignedPsychologist, setAssignedPsychologist] = useState<string>(
    "Dr. Maria Ulfah, M.Psi., Psikolog",
  );
  const [assignedLegal, setAssignedLegal] = useState<string>(
    "LBH Advokat Ramah Anak",
  );

  const filteredInterventions = interventions.filter(
    (item) =>
      item.victimAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.schoolOrigin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeCount = interventions.filter((i) => i.stage !== "Selesai").length;
  const psychologicalCount = interventions.filter(
    (i) => i.assignedPsychologist,
  ).length;
  const legalCount = interventions.filter((i) => i.assignedLegalAid).length;

  const handleAddNoteAndStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntervention) return;
    onUpdateInterventionStage(selectedIntervention.id, selectedStage, newNote);

    // Update local selectedIntervention
    setSelectedIntervention((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        stage: selectedStage,
        notes: newNote ? [...prev.notes, newNote] : prev.notes,
        updatedAt: new Date().toISOString(),
      };
    });
    setNewNote("");
  };

  const handleSaveExpertAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntervention) return;
    onAssignExpert(
      selectedIntervention.id,
      assignedPsychologist,
      assignedLegal,
    );

    setSelectedIntervention((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        assignedPsychologist,
        assignedLegalAid: assignedLegal,
        updatedAt: new Date().toISOString(),
      };
    });
    setShowAssignModal(false);
  };

  const stages: ProtectionIntervention["stage"][] = [
    "Asesmen Awal",
    "Perlindungan & Safehouse",
    "Pemulihan Psikologis",
    "Pendampingan Hukum",
    "Selesai",
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(skipLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  const handleLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await api.login({ email, password, role: "dinas-perlindungan" });
      setIsLoggedIn(true);
    } catch (err: any) {
      const msg =
        err.name === "AbortError"
          ? "Server tidak merespons. Pastikan backend berjalan di port 3001."
          : err.message || "Login failed";
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
          <div className="bg-rose-950 p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-500/40">
              <HeartHandshake className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Portal UPTD PPA
            </h2>
            <p className="text-rose-300 text-xs uppercase tracking-widest font-bold">
              Intervensi & Perlindungan Anak
            </p>
          </div>

          <div className="p-8 space-y-5">
            <form onSubmit={handleLoginForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Petugas PPA:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="sri.rahayu@uptd-ppa.go.id"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
              </div>
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
              >
                {isLoggingIn ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                <span>Masuk Portal Perlindungan</span>
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 leading-relaxed">
              Portal rujukan khusus UPTD Perlindungan Perempuan dan Anak untuk
              penanganan kasus kritis rujukan Satgas Sekolah.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Top Banner Dinas PPPA / UPTD PPA */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-400/30 backdrop-blur-md">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-300" />
              <span>
                PORTAL RUJUKAN KHUSUS &amp; INTERVENSI UPTD PPA (DINAS PPPA)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pusat Penanganan Kasus Perlindungan Anak
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Penanganan kasus kekerasan anak berisiko tinggi, pelecehan, dan
              trauma berat rujukan Satgas Sekolah dengan pendekatan
              multi-disiplin (Psikologi Klinis, Advokasi Hukum, &amp; Rumah
              Aman).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold block text-white">
                {officerName}
              </span>
              <span className="text-[11px] text-rose-200">
                Kepala Satlak Kasus UPTD PPA
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Dinas</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">
              Intervensi Aktif
            </span>
            <span className="text-2xl font-black text-rose-300">
              {activeCount} Kasus
            </span>
            <span className="text-[10px] text-rose-200 block mt-0.5">
              Prioritas Tinggi &amp; Kritis
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">
              Pendampingan Psikologis
            </span>
            <span className="text-2xl font-black text-sky-300">
              {psychologicalCount} Anak
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Trauma Healing Berjalan
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">
              Advokasi Hukum &amp; Saksi
            </span>
            <span className="text-2xl font-black text-amber-300">
              {legalCount} Kasus
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              LBH Ramah Anak Siaga
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">
              Layanan Hotline SAPA
            </span>
            <span className="text-2xl font-black text-emerald-400">
              Siaga 24 Jam
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5">
              Hotline 129 Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          {
            id: "kasus",
            label: "Daftar Kasus Rujukan Sekolah",
            icon: Activity,
          },
          { id: "tim", label: "Direktori Tim Ahli Terpadu", icon: UserCheck },
          { id: "jejaring", label: "Jejaring Rumah Aman & Mitra", icon: Home },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CASES MANAGEMENT */}
      {activeTab === "kasus" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Left: Case List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari ID kasus, alias, sekolah..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredInterventions.map((item) => {
                  const isSelected = selectedIntervention?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedIntervention(item);
                        setSelectedStage(item.stage);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                        isSelected
                          ? "bg-rose-50/70 border-rose-400 shadow-xs ring-2 ring-rose-500/20"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {item.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.urgency.includes("Kritis")
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {item.victimAlias}
                        </h4>
                        <p className="text-slate-500 text-[11px]">
                          {item.schoolOrigin}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                        <span className="font-bold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-md">
                          Tahap: {item.stage}
                        </span>
                        <span className="text-slate-400 font-mono">
                          Tiket: {item.ticketId}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Case Detail & Action Panel (7 cols) */}
          <div className="lg:col-span-7">
            {selectedIntervention ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
                {/* Header detail */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-wider">
                      Nomor Registrasi UPTD: {selectedIntervention.id}
                    </span>
                    <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                      {selectedIntervention.victimAlias}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {selectedIntervention.schoolOrigin} •{" "}
                      {selectedIntervention.category}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Disposisi Tim Ahli</span>
                  </button>
                </div>

                {/* Stepper Tahapan Perlindungan */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tahapan Manajemen Kasus Terpadu:
                  </h4>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                    {stages.map((stg, idx) => {
                      const currentIdx = stages.indexOf(
                        selectedIntervention.stage,
                      );
                      const isPast = idx <= currentIdx;
                      return (
                        <div key={stg} className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full ${isPast ? "bg-rose-600" : "bg-slate-200"}`}
                          />
                          <span
                            className={`block truncate ${isPast ? "text-rose-700 font-extrabold" : "text-slate-400"}`}
                          >
                            {stg}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Team Assigned Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Psikolog Klinis Pendamping:
                    </span>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Stethoscope className="w-4 h-4 text-sky-600" />
                      <span>
                        {selectedIntervention.assignedPsychologist ||
                          "Belum ditugaskan"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Advokasi Bantuan Hukum:
                    </span>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Scale className="w-4 h-4 text-amber-600" />
                      <span>
                        {selectedIntervention.assignedLegalAid ||
                          "Belum ditugaskan"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes History */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">
                    Catatan Asesmen &amp; Log Tindakan:
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedIntervention.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Update Stage & Add Note Form */}
                <form
                  onSubmit={handleAddNoteAndStage}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs"
                >
                  <h4 className="font-bold text-slate-900">
                    Pembaruan Tahap &amp; Tambah Catatan Asesmen:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold">
                        Ubah Tahap Perlindungan:
                      </label>
                      <select
                        value={selectedStage}
                        onChange={(e) =>
                          setSelectedStage(e.target.value as any)
                        }
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                      >
                        {stages.map((stg) => (
                          <option key={stg} value={stg}>
                            {stg}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold">
                        Rekomendasi Shelter Rumah Aman:
                      </label>
                      <select className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer">
                        <option>Tidak Diperlukan (Rumah Keluarga Aman)</option>
                        <option>Siaga Penempatan Rumah Aman UPTD</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold">
                      Tambah Catatan Intervensi / Perkembangan Korban:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tuliskan hasil sesi trauma healing, kondisi fisik, atau persiapan advokasi..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Perkembangan Kasus</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                Pilih salah satu kasus untuk melihat detail intervensi.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DIRECTORY OF EXPERTS */}
      {activeTab === "tim" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Direktori Tim Ahli Penanganan Kekerasan Anak UPTD PPA
            </h2>
            <p className="text-xs text-slate-500">
              Tenaga profesional bersertifikasi yang siap ditugaskan mendampingi
              korban anak dan keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                name: "Dr. Maria Ulfah, M.Psi., Psikolog",
                role: "Psikolog Klinis Spesialis Anak & Trauma",
                contact: "0812-9900-1122",
                status: "Siaga Tugas",
                casesCount: 4,
                avatar:
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
              },
              {
                name: "Faisal Akbar, S.Psi",
                role: "Konselor Kesehatan Mental Remaja",
                contact: "0813-7766-5544",
                status: "Siaga Tugas",
                casesCount: 3,
                avatar:
                  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80",
              },
              {
                name: "Nurul Hidayati, S.H., M.H",
                role: "Advokat Ramah Anak / LBH Perlindungan",
                contact: "0811-2233-4455",
                status: "Pendampingan Berjalan",
                casesCount: 2,
                avatar:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
              },
            ].map((exp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={exp.avatar}
                    alt={exp.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {exp.name}
                    </h4>
                    <span className="text-[11px] text-rose-700 font-bold block">
                      {exp.role}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 text-slate-600 font-mono">
                  <p>Kontak: {exp.contact}</p>
                  <p>Beban Kasus Aktif: {exp.casesCount} Anak</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{exp.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NETWORK & SHELTER */}
      {activeTab === "jejaring" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Jejaring Rumah Aman (Safehouse) &amp; Lembaga Mitra
            </h2>
            <p className="text-xs text-slate-500">
              Akses cepat penempatan sementara dan koordinasi aparat penegak
              hukum (Unit PPA Kepolisian).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <Home className="w-5 h-5" />
                <span>Rumah Aman UPTD PPA Terpadu (Zona Rahasia)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Fasilitas perlindungan fisik 24 jam dengan penjagaan keamanan,
                pemenuhan logistik anak, serta ruang konseling tertutup.
              </p>
              <div className="font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                Kapasitas Tersedia: <strong>4 Kamar Aman</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Scale className="w-5 h-5" />
                <span>Unit PPA Reskrim Polda &amp; Polres Wilayah</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Penyidik ramah anak khusus untuk penanganan kasus kekerasan
                seksual, penganiayaan berat, atau pemerasan yang memerlukan
                proses pro-justitia.
              </p>
              <div className="font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                Hotline Khusus PPA: <strong>110 / 0813-888-129</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Disposisi Tim Ahli */}
      {showAssignModal && selectedIntervention && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-scaleUp">
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Penugasan Resmi UPTD
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Disposisi Tim Ahli: {selectedIntervention.victimAlias}
              </h3>
            </div>

            <form
              onSubmit={handleSaveExpertAssignment}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Pilih Psikolog Klinis:
                </label>
                <select
                  value={assignedPsychologist}
                  onChange={(e) => setAssignedPsychologist(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  <option value="Dr. Maria Ulfah, M.Psi., Psikolog">
                    Dr. Maria Ulfah, M.Psi., Psikolog (Spesialis Trauma)
                  </option>
                  <option value="Faisal Akbar, S.Psi">
                    Faisal Akbar, S.Psi (Konselor Remaja)
                  </option>
                  <option value="Tim Psikologi UPTD PPA">
                    Tim Psikologi Terpadu UPTD
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Pilih Pendampingan Hukum:
                </label>
                <select
                  value={assignedLegal}
                  onChange={(e) => setAssignedLegal(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  <option value="LBH Advokat Ramah Anak">
                    LBH Advokat Ramah Anak
                  </option>
                  <option value="Divisi Advokasi DP3A">
                    Divisi Advokasi Hukum DP3A
                  </option>
                  <option value="LBH APIK (Bantuan Hukum Khusus)">
                    LBH APIK
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Tugaskan Tim Ahli
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
