import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  ShieldAlert,
  Scale,
  CheckCircle2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { ProtectionIntervention, ReportTicket } from "../types";
import { api } from "../lib/api";

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
  const [selectedIntervention, setSelectedIntervention] = useState<ProtectionIntervention | null>(
    interventions[0] || null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState("");
  const [selectedStage, setSelectedStage] =
    useState<ProtectionIntervention["stage"]>("Asesmen Awal");

  // Assign expert modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedPsychologist, setAssignedPsychologist] = useState(
    "Dr. Maria Ulfah, M.Psi., Psikolog",
  );
  const [assignedLegal, setAssignedLegal] = useState("LBH Advokat Ramah Anak");

  // Critical Ticket Detail Modal
  const [selectedCriticalTicket, setSelectedCriticalTicket] = useState<ReportTicket | null>(null);

  // Login State
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

  const criticalTickets = (tickets || []).filter(
    (t) =>
      t.urgency === "Kritis" ||
      t.urgency === "Tinggi" ||
      Boolean(t.isEscalatedToDinas) ||
      Boolean(t.category && (t.category.includes("Seksual") || t.category.includes("Fisik"))),
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntervention) return;
    onUpdateInterventionStage(selectedIntervention.id, selectedStage, newNote);

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

  const handleSaveExpert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntervention) return;
    onAssignExpert(selectedIntervention.id, assignedPsychologist, assignedLegal);

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

  // UNAUTHENTICATED
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Portal UPTD PPA</h2>
            <p className="text-xs text-slate-500 mt-1">Perlindungan Perempuan &amp; Anak</p>
          </div>
          <button
            type="button"
            onClick={() => setIsLoggedIn(true)}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Masuk Langsung (Sri Rahayu)</span>
          </button>
        </div>
      </div>
    );
  }

  // LOGGED IN CLEAN SAAS DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4 animate-fadeIn">
      {/* Top Status Bar (No dark jumbotron!) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
            PPA
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none">
              UPTD Perlindungan Perempuan &amp; Anak (PPA)
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              Satlak: {officerName} • {interventions.length} Kasus Aktif ({criticalTickets.length} Eskalasi Darurat)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/70 text-rose-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>UPTD PPA Siaga</span>
          </span>
        </div>
      </div>

      {/* 2 Clean Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("intervensi")}
          className={`pb-2.5 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === "intervensi"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Intervensi Korban ({interventions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("eskalasi")}
          className={`pb-2.5 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === "eskalasi"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Eskalasi Kasus Sekolah</span>
          {criticalTickets.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px]">
              {criticalTickets.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: INTERVENSI KORBAN */}
      {activeTab === "intervensi" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari korban atau sekolah..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-600"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filteredInterventions.map((item) => {
                const isSelected = selectedIntervention?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIntervention(item)}
                    className={`p-3.5 transition cursor-pointer text-xs border-l-4 ${
                      isSelected
                        ? "bg-rose-50/60 border-l-rose-600"
                        : "hover:bg-slate-50 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-slate-900">{item.id}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                        {item.stage}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 truncate mb-0.5">{item.victimAlias}</p>
                    <p className="text-[11px] text-slate-500">{item.schoolOrigin}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
            {selectedIntervention ? (
              <div className="space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {selectedIntervention.victimAlias}
                    </h3>
                    <p className="text-slate-500 text-[11px]">
                      {selectedIntervention.schoolOrigin} • Kasus: {selectedIntervention.category}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAssignModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Tugaskan Ahli</span>
                  </button>
                </div>

                {/* Tahapan Progres */}
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1.5">
                    Tahapan Intervensi:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stages.map((stg) => (
                      <span
                        key={stg}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          selectedIntervention.stage === stg
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {stg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tenaga Pendamping */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold block">Psikolog Klinis:</span>
                    <p className="font-semibold text-slate-800">
                      {selectedIntervention.assignedPsychologist || "Belum ditugaskan"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold block">Bantuan Hukum (LBH):</span>
                    <p className="font-semibold text-slate-800">
                      {selectedIntervention.assignedLegalAid || "Belum ditugaskan"}
                    </p>
                  </div>
                </div>

                {/* Catatan Intervensi */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Catatan Perkembangan Pemulihan:
                  </span>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {(selectedIntervention.notes || []).map((n, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-50 text-slate-700 text-[11px]">
                        • {n}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                    <select
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value as any)}
                      className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Tambah catatan perkembangan..."
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold cursor-pointer"
                    >
                      Simpan
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center text-slate-400 text-xs">
                Pilih kasus di panel kiri untuk membuka intervensi.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RADAR ESKALASI */}
      {activeTab === "eskalasi" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-100 text-xs text-slate-500">
            Laporan kekerasan kritis dan darurat dari sekolah yang membutuhkan pendampingan medis, psikologis, atau hukum UPTD PPA.
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-semibold">
                  <th className="py-2.5 px-3">ID Tiket</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Urgensi</th>
                  <th className="py-2.5 px-3">Lokasi</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {criticalTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Tidak ada laporan eskalasi darurat.
                    </td>
                  </tr>
                ) : (
                  criticalTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{t.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{t.category}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          {t.urgency}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{t.location}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCriticalTicket(t)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Tinjau Laporan
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Assign Expert */}
      {showAssignModal && selectedIntervention && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl space-y-3.5 text-xs animate-scaleUp">
            <h3 className="font-bold text-sm text-slate-900">
              Tugaskan Ahli: {selectedIntervention.victimAlias}
            </h3>
            <form onSubmit={handleSaveExpert} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Psikolog Klinis:</label>
                <select
                  value={assignedPsychologist}
                  onChange={(e) => setAssignedPsychologist(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Dr. Maria Ulfah, M.Psi., Psikolog">Dr. Maria Ulfah, M.Psi., Psikolog</option>
                  <option value="Ahmad Fauzi, S.Psi., M.A.">Ahmad Fauzi, S.Psi., M.A.</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Pendamping Hukum (LBH):</label>
                <select
                  value={assignedLegal}
                  onChange={(e) => setAssignedLegal(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="LBH Advokat Ramah Anak">LBH Advokat Ramah Anak</option>
                  <option value="LBH APIK">LBH APIK</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3 py-1.5 font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl"
                >
                  Tetapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Eskalasi */}
      {selectedCriticalTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl space-y-3 text-xs animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Laporan #{selectedCriticalTicket.id}</h3>
              <button type="button" onClick={() => setSelectedCriticalTicket(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedCriticalTicket.redactedStory}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedCriticalTicket(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
