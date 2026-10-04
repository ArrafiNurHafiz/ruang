import React, { useState, useEffect } from "react";
import {
  Building2,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Search,
  Sparkles,
  School,
  X,
  FileText,
  AlertTriangle,
  Send,
  Filter,
  Check,
} from "lucide-react";
import { SchoolRegionalData, ReportTicket } from "../types";
import { api } from "../lib/api";

interface DinasPendidikanDashboardProps {
  regionalSchools: SchoolRegionalData[];
  tickets: ReportTicket[];
  onLogout: () => void;
  officerName?: string;
  skipLogin?: boolean;
  onSupervisionSent?: (schoolId: string, message: string, officerName: string) => void;
}

export const DinasPendidikanDashboard: React.FC<
  DinasPendidikanDashboardProps
> = ({
  regionalSchools,
  tickets = [],
  onLogout,
  officerName = "Dr. H. Hendro Wicaksono, M.Pd",
  skipLogin = false,
  onSupervisionSent,
}) => {
  // Tabs: 'sekolah' | 'supervisi'
  const [activeTab, setActiveTab] = useState<"sekolah" | "supervisi">("sekolah");

  // Filters
  const [searchSchool, setSearchSchool] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedSchoolModal, setSelectedSchoolModal] = useState<SchoolRegionalData | null>(null);
  const [supervisionNotice, setSupervisionNotice] = useState("");
  const [noticeSentSuccess, setNoticeSentSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(skipLogin);

  useEffect(() => {
    if (skipLogin) setIsLoggedIn(true);
  }, [skipLogin]);

  // SLA >24h calculation
  const isDelayedResponse = (ticket: ReportTicket) => {
    if (ticket.status !== "diterima") return false;
    if (!ticket.createdAt) return false;
    const created = new Date(ticket.createdAt).getTime();
    if (isNaN(created)) return false;
    return (Date.now() - created) / (1000 * 60 * 60) >= 24;
  };

  const delayedTickets = (tickets || []).filter(
    (t) => isDelayedResponse(t) || t.urgency === "Kritis" || Boolean(t.isEscalatedToDinas),
  );

  const districts = Array.from(new Set(regionalSchools.map((s) => s.district))).filter(Boolean);

  const filteredSchools = (regionalSchools || []).filter((s) => {
    const q = searchSchool.toLowerCase();
    const matchQ = s.schoolName.toLowerCase().includes(q) || s.npsn.includes(q);
    const matchD = selectedDistrict === "all" || s.district === selectedDistrict;
    return matchQ && matchD;
  });

  const handleSendNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisionNotice || !selectedSchoolModal) return;

    try {
      await api.sendSupervisionNotice({
        targetSchoolId: selectedSchoolModal.id,
        targetSchoolName: selectedSchoolModal.schoolName,
        message: supervisionNotice,
        officerName,
      });
      if (onSupervisionSent) {
        onSupervisionSent(selectedSchoolModal.id, supervisionNotice, officerName);
      }
      setNoticeSentSuccess(true);
      setTimeout(() => {
        setNoticeSentSuccess(false);
        setSupervisionNotice("");
        setSelectedSchoolModal(null);
      }, 1500);
    } catch (err) {
      alert("Gagal mengirim supervisi.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* 1. TOP HEADER & METRICS */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md shadow-primary/20 shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-ink leading-tight">
                Portal Pengawasan Satgas PPKSP Dinas Pendidikan
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                Wilayah DKI Jakarta
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pengawas: <strong>{officerName}</strong> • {regionalSchools.length} Sekolah Terdaftar
            </p>
          </div>
        </div>

        {/* Metric Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            <span>94% Kepatuhan Satgas</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle size={13} />
            <span>{delayedTickets.length} Perlu Supervisi</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-1.5">
            <Clock size={13} />
            <span>Respon Rata-rata 1.8 Jam</span>
          </div>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("sekolah")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "sekolah"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <School size={15} />
          <span>Daftar Sekolah Binaan ({regionalSchools.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("supervisi")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "supervisi"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <ShieldAlert size={15} />
          <span>Kasus Eskalasi &amp; Respon Lambat ({delayedTickets.length})</span>
        </button>
      </div>

      {/* 3. TAB 1: DAFTAR SEKOLAH BINAAN */}
      {activeTab === "sekolah" && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari nama sekolah, NPSN..."
                value={searchSchool}
                onChange={(e) => setSearchSchool(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Wilayah:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="p-2 bg-background border border-border rounded-xl text-xs text-ink font-semibold"
              >
                <option value="all">Semua Wilayah</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-bold border-b border-border">
                <tr>
                  <th className="p-3">Nama Sekolah &amp; NPSN</th>
                  <th className="p-3">Wilayah</th>
                  <th className="p-3 text-center">Tim Satgas</th>
                  <th className="p-3 text-center">Laporan Masuk</th>
                  <th className="p-3 text-center">Selesai</th>
                  <th className="p-3">Status Kepatuhan</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSchools.map((sch) => (
                  <tr key={sch.id} className="hover:bg-muted/40 transition">
                    <td className="p-3">
                      <p className="font-bold text-ink">{sch.schoolName}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">NPSN: {sch.npsn}</p>
                    </td>
                    <td className="p-3 text-muted-foreground">{sch.district}</td>
                    <td className="p-3 text-center font-bold text-ink">{sch.activeSatgasCount} Org</td>
                    <td className="p-3 text-center font-bold text-ink">{sch.totalReports}</td>
                    <td className="p-3 text-center font-bold text-emerald-600">{sch.resolvedReports}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                        {sch.complianceStatus || "Patuh (A)"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSchoolModal(sch)}
                        className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold text-[11px] rounded-lg transition cursor-pointer"
                      >
                        Kirim Supervisi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB 2: KASUS ESKALASI & TERLAMBAT */}
      {activeTab === "supervisi" && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-ink">Daftar Kasus Kritis &amp; Rujukan Resmi ke Dinas</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kasus yang membutuhkan intervensi lintas sektoral atau memerlukan peringatan percepatan penanganan.
            </p>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-bold border-b border-border">
                <tr>
                  <th className="p-3">ID Tiket</th>
                  <th className="p-3">Kategori &amp; Urgensi</th>
                  <th className="p-3">Alasan Eskalasi / Status</th>
                  <th className="p-3">Waktu Masuk</th>
                  <th className="p-3 text-right">Status Penanganan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {delayedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Semua kasus telah tertangani sesuai SLA (&lt; 24 jam) dan tidak ada kasus eskalasi aktif.
                    </td>
                  </tr>
                ) : (
                  delayedTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/40 transition">
                      <td className="p-3 font-mono font-bold text-ink">{t.ticketNumber || t.id.slice(0, 8)}</td>
                      <td className="p-3">
                        <p className="font-bold text-ink">{t.category}</p>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger mt-0.5">
                          {t.urgency}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground max-w-sm line-clamp-2">
                        {t.escalationReason || t.redactedStory || t.story}
                      </td>
                      <td className="p-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString("id-ID") : "Hari ini"}
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px] capitalize">
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

      {/* 5. MODAL: KIRIM NOTA SUPERVISI */}
      {selectedSchoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-ink">Nota Supervisi Satgas</h3>
                <p className="text-xs text-muted-foreground">{selectedSchoolModal.schoolName}</p>
              </div>
              <button onClick={() => setSelectedSchoolModal(null)} className="text-muted-foreground hover:text-ink cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {noticeSentSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold text-xs flex items-center gap-2">
                <Check size={16} />
                <span>Nota supervisi berhasil dikirim ke Satgas sekolah!</span>
              </div>
            ) : (
              <form onSubmit={handleSendNotice} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-ink block mb-1">Pesan / Instruksi Supervisi:</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan arahan resmi dari dinas untuk percepatan investigasi atau pemulihan korban..."
                    value={supervisionNotice}
                    onChange={(e) => setSupervisionNotice(e.target.value)}
                    className="w-full p-2.5 bg-background border border-border rounded-xl text-ink focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSchoolModal(null)}
                    className="px-4 py-2 border border-border rounded-xl font-bold hover:bg-muted cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send size={13} />
                    <span>Kirim Nota</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
