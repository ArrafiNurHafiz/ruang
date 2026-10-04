import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  ShieldAlert,
  Scale,
  CheckCircle2,
  Search,
  Sparkles,
  X,
  UserCheck,
  Home,
  Plus,
  ArrowRight,
  Clock,
  AlertTriangle,
  Send,
  Lock,
} from "lucide-react";
import { ProtectionIntervention, ReportTicket } from "../types";

interface DinasPerlindunganDashboardProps {
  interventions: ProtectionIntervention[];
  tickets?: ReportTicket[];
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
  tickets = [],
  onUpdateInterventionStage,
  onAssignExpert,
  onLogout,
  officerName = "Sri Rahayu, S.Psi., M.Si",
  skipLogin = false,
}) => {
  const [activeTab, setActiveTab] = useState<"intervensi" | "eskalasi">("intervensi");
  const [selectedInterventionId, setSelectedInterventionId] = useState<string | null>(
    interventions[0]?.id || null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedPsychologist, setAssignedPsychologist] = useState(
    "Dr. Maria Ulfah, M.Psi., Psikolog",
  );
  const [assignedLegal, setAssignedLegal] = useState("LBH Advokat Ramah Anak");
  const [isLoggedIn, setIsLoggedIn] = useState(skipLogin);

  useEffect(() => {
    if (skipLogin) setIsLoggedIn(true);
  }, [skipLogin]);

  const stages: ProtectionIntervention["stage"][] = [
    "Asesmen Awal",
    "Perlindungan & Safehouse",
    "Pendampingan Hukum",
    "Pemulihan Psikologis",
    "Selesai",
  ];

  const filteredInterventions = (interventions || []).filter((i) => {
    const q = searchQuery.toLowerCase();
    return (
      (i.victimAlias || "").toLowerCase().includes(q) ||
      (i.schoolOrigin || "").toLowerCase().includes(q) ||
      (i.category || "").toLowerCase().includes(q)
    );
  });

  const selectedIntervention =
    interventions.find((i) => i.id === selectedInterventionId) || interventions[0] || null;

  const criticalTickets = (tickets || []).filter(
    (t) =>
      t.urgency === "Kritis" ||
      t.urgency === "Tinggi" ||
      Boolean(t.isEscalatedToDinas) ||
      Boolean(t.category && (t.category.includes("Seksual") || t.category.includes("Fisik"))),
  );

  const handleStageClick = (stage: ProtectionIntervention["stage"]) => {
    if (!selectedIntervention) return;
    onUpdateInterventionStage(selectedIntervention.id, stage);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntervention || !newNote.trim()) return;
    onUpdateInterventionStage(selectedIntervention.id, selectedIntervention.stage, newNote);
    setNewNote("");
  };

  const handleSaveExpert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntervention) return;
    onAssignExpert(selectedIntervention.id, assignedPsychologist, assignedLegal);
    setShowAssignModal(false);
  };

  const shelterRequiredCount = interventions.filter((i) => i.shelterRequired).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* 1. TOP HEADER & STATS */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-danger text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md shadow-danger/20 shrink-0">
            <HeartHandshake size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-ink leading-tight">
                Portal Intervensi Khusus UPTD PPA
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger text-[10px] font-bold">
                Perlindungan Perempuan &amp; Anak
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kepala Satuan Pelaksana: <strong>{officerName}</strong> • Penanganan Terpadu Korban Anak
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-1.5">
            <UserCheck size={13} />
            <span>{interventions.length} Kasus Rujukan</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold flex items-center gap-1.5">
            <Home size={13} />
            <span>{shelterRequiredCount} Butuh Safehouse</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-1.5">
            <Scale size={13} />
            <span>Pendampingan LBH Aktif</span>
          </div>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("intervensi")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "intervensi"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <ShieldAlert size={15} />
          <span>Pipeline Intervensi Korban ({interventions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("eskalasi")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "eskalasi"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <AlertTriangle size={15} />
          <span>Rujukan Kasus Kritis Sekolah ({criticalTickets.length})</span>
        </button>
      </div>

      {/* 3. TAB 1: INTERVENSI PIPELINE (2 Columns) */}
      {activeTab === "intervensi" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: INTERVENTION LIST (4 Cols) */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-4 shadow-xs space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari nama inisial / sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredInterventions.map((item) => {
                const isSelected = selectedIntervention?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedInterventionId(item.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer text-left space-y-1.5 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-ink">{item.victimAlias || "Ananda Korban"}</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {item.stage}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-1">{item.schoolOrigin}</p>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                      <span>Kategori: {item.category}</span>
                      {item.shelterRequired && (
                        <span className="text-danger font-bold">Butuh Safehouse</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: INTERVENTION DETAIL & STAGES (8 Cols) */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
            {selectedIntervention ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                  <div>
                    <h2 className="text-base font-bold text-ink">
                      {selectedIntervention.victimAlias || "Ananda Korban"} ({selectedIntervention.id})
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Asal: {selectedIntervention.schoolOrigin} • Kasus: {selectedIntervention.category} ({selectedIntervention.urgency})
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAssignModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:opacity-90 transition cursor-pointer"
                  >
                    <UserCheck size={14} />
                    <span>Tugaskan Psikolog &amp; LBH</span>
                  </button>
                </div>

                {/* 5-STAGE PIPELINE STEPPER */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink block">
                    Tahapan Intervensi Perlindungan (Klik untuk update progress):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {stages.map((stg, idx) => {
                      const isCurrent = selectedIntervention.stage === stg;
                      const currentIndex = stages.indexOf(selectedIntervention.stage);
                      const isPast = currentIndex >= idx;

                      return (
                        <button
                          key={stg}
                          type="button"
                          onClick={() => handleStageClick(stg)}
                          className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                            isCurrent
                              ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                              : isPast
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 font-semibold"
                              : "bg-background border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <span className="text-[10px] opacity-75">Tahap {idx + 1}</span>
                          <span className="text-[11px] leading-tight">{stg}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Experts Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/40 border border-border rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-ink block mb-0.5">Psikolog Klinis Anak:</span>
                    <p className="text-muted-foreground">{selectedIntervention.assignedPsychologist || "Belum ditugaskan"}</p>
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">Pendamping Hukum (LBH):</span>
                    <p className="text-muted-foreground">{selectedIntervention.assignedLegalAid || "Belum ditugaskan"}</p>
                  </div>
                </div>

                {/* Notes History & Add Note */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-ink block">
                    Catatan Perkembangan Pemulihan Anak:
                  </label>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedIntervention.notes && selectedIntervention.notes.length > 0 ? (
                      selectedIntervention.notes.map((n, i) => (
                        <div key={i} className="p-3 bg-background border border-border rounded-xl text-xs text-foreground">
                          • {n}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Belum ada catatan intervensi.</p>
                    )}
                  </div>

                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tuliskan hasil asesmen psikologi atau pendampingan hukum..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-xl text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-ink text-primary-foreground font-bold text-xs rounded-xl hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Send size={13} />
                      <span>Simpan Catatan</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground text-xs">
                Pilih kasus rujukan di sebelah kiri untuk melihat detail intervensi.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB 2: KASUS KRITIS ESKALASI */}
      {activeTab === "eskalasi" && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-ink">Kasus Kritis &amp; Rujukan Baru dari Satgas Sekolah</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daftar insiden dengan urgensi Kritis/Tinggi yang memerlukan perlindungan terpadu UPTD PPA.
            </p>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-bold border-b border-border">
                <tr>
                  <th className="p-3">ID Tiket</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Urgensi</th>
                  <th className="p-3">Kronologi / Laporan</th>
                  <th className="p-3 text-right">Status Penanganan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {criticalTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Tidak ada rujukan kasus kritis baru saat ini.
                    </td>
                  </tr>
                ) : (
                  criticalTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/40 transition">
                      <td className="p-3 font-mono font-bold text-ink">{t.ticketNumber || t.id.slice(0, 8)}</td>
                      <td className="p-3 font-bold text-ink">{t.category}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger font-bold text-[10px]">
                          {t.urgency}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground max-w-sm line-clamp-2">
                        {t.redactedStory || t.story}
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] capitalize">
                          {t.status.replace("_", " ")}
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

      {/* 5. MODAL TUGASKAN AHLI */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-ink">Penugasan Tim Ahli UPTD PPA</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-muted-foreground hover:text-ink cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveExpert} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Psikolog Klinis Anak:</label>
                <select
                  value={assignedPsychologist}
                  onChange={(e) => setAssignedPsychologist(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-semibold"
                >
                  <option value="Dr. Maria Ulfah, M.Psi., Psikolog">Dr. Maria Ulfah, M.Psi., Psikolog (Spesialis Trauma Anak)</option>
                  <option value="Farhan Maulana, S.Psi., M.Psi">Farhan Maulana, S.Psi., M.Psi (Konselor Remaja)</option>
                  <option value="Hj. Nuraini, M.Psi., Psikolog">Hj. Nuraini, M.Psi., Psikolog (Asosiasi Psikologi Forensik)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Lembaga Bantuan Hukum (LBH):</label>
                <select
                  value={assignedLegal}
                  onChange={(e) => setAssignedLegal(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl text-ink font-semibold"
                >
                  <option value="LBH Advokat Ramah Anak">LBH Advokat Ramah Anak Indonesia</option>
                  <option value="Pusat Bantuan Hukum Peradi PPPA">Pusat Bantuan Hukum Peradi PPPA</option>
                  <option value="Yayasan Pendampingan Hak Anak">Yayasan Pendampingan Hak Anak</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-border rounded-xl font-bold hover:bg-muted cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 cursor-pointer"
                >
                  Simpan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
