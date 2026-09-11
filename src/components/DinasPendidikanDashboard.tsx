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
} from "lucide-react";
import { SchoolRegionalData, ReportTicket } from "../types";
import { api } from "../lib/api";

interface DinasPendidikanDashboardProps {
  regionalSchools: SchoolRegionalData[];
  tickets: ReportTicket[];
  onLogout: () => void;
  officerName?: string;
  skipLogin?: boolean;
}

export const DinasPendidikanDashboard: React.FC<
  DinasPendidikanDashboardProps
> = ({
  regionalSchools,
  tickets = [],
  onLogout,
  officerName = "Dr. H. Hendro Wicaksono, M.Pd",
  skipLogin = false,
}) => {
  const [activeTab, setActiveTab] = useState<"sekolah" | "sla">("sekolah");

  // Filter States
  const [searchSchool, setSearchSchool] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedSchoolModal, setSelectedSchoolModal] = useState<SchoolRegionalData | null>(null);
  const [supervisionNotice, setSupervisionNotice] = useState("");
  const [noticeSentSuccess, setNoticeSentSuccess] = useState(false);

  // Selected Ticket for review
  const [selectedTicket, setSelectedTicket] = useState<ReportTicket | null>(null);

  // Login State
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
    (t) => isDelayedResponse(t) || t.urgency === "Kritis",
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

  // UNAUTHENTICATED
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Portal Pengawasan Dinas Pendidikan</h2>
            <p className="text-xs text-slate-500 mt-1">Supervisi Kepatuhan Satgas PPKSP Wilayah</p>
          </div>
          <button
            type="button"
            onClick={() => setIsLoggedIn(true)}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Masuk Langsung (Dr. H. Hendro)</span>
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
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
            DISDIK
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-none">
              Dinas Pendidikan Wilayah • Pengawasan PPKSP
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              Pengawas: {officerName} • {regionalSchools.length} Sekolah Terpantau ({delayedTickets.length} Perlu Supervisi Segera)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Sinkronisasi Otomatis</span>
          </span>
        </div>
      </div>

      {/* 2 Clean Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("sekolah")}
          className={`pb-2.5 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === "sekolah"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <School className="w-3.5 h-3.5" />
          <span>Kepatuhan Sekolah Wilayah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sla")}
          className={`pb-2.5 px-3 transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === "sla"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Kasus Telat SLA / Kritis</span>
          {delayedTickets.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
              {delayedTickets.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: KEPATUHAN SEKOLAH */}
      {activeTab === "sekolah" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchSchool}
                onChange={(e) => setSearchSchool(e.target.value)}
                placeholder="Cari sekolah atau NPSN..."
                className="w-56 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="all">Semua Wilayah</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <span className="text-slate-400 text-[11px]">
              {filteredSchools.length} Sekolah Terdaftar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-semibold">
                  <th className="py-2.5 px-3">Nama Sekolah</th>
                  <th className="py-2.5 px-3">Wilayah</th>
                  <th className="py-2.5 px-3">Status Satgas</th>
                  <th className="py-2.5 px-3">Kecepatan Respon</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSchools.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block">{s.schoolName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">NPSN: {s.npsn}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{s.district}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {s.satgasStatus || "Satgas Aktif"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {s.avgResponseHours ? `${s.avgResponseHours} Jam` : "3.2 Jam"}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSchoolModal(s);
                          setSupervisionNotice(
                            `Instruksi Pengawas: Evaluasi berkala tindak lanjut aduan siswa di ${s.schoolName}.`,
                          );
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Beri Supervisi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RADAR SLA & KASUS KRITIS */}
      {activeTab === "sla" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-100 text-xs text-slate-500">
            Daftar laporan siswa yang membutuhkan atensi khusus atau belum mendapatkan respon dalam 24 jam.
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-semibold">
                  <th className="py-2.5 px-3">ID Tiket</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Urgensi</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {delayedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Tidak ada laporan yang terlambat atau memerlukan supervisi darurat saat ini.
                    </td>
                  </tr>
                ) : (
                  delayedTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{t.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{t.category}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          {t.urgency}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Telat SLA &gt;24j
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTicket(t)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Lihat Detail
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

      {/* Modal Supervisi Sekolah */}
      {selectedSchoolModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl space-y-3.5 text-xs animate-scaleUp">
            <h3 className="font-bold text-sm text-slate-900">
              Kirim Supervisi: {selectedSchoolModal.schoolName}
            </h3>
            {noticeSentSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span>Instruksi resmi berhasil dikirim ke Satgas sekolah.</span>
              </div>
            ) : (
              <form onSubmit={handleSendNotice} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  value={supervisionNotice}
                  onChange={(e) => setSupervisionNotice(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSchoolModal(null)}
                    className="px-3 py-1.5 font-semibold hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                  >
                    Kirim Instruksi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Detail Tiket */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl space-y-3 text-xs animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Laporan #{selectedTicket.id}</h3>
              <button type="button" onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedTicket.redactedStory}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
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
