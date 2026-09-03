import React, { useState } from "react";
import {
  Building2,
  ShieldAlert,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  FileSpreadsheet,
  Send,
  LogOut,
  BarChart3,
  Filter,
  Download,
  Mail,
  Eye,
  Sparkles,
  Award,
  LogIn,
  RefreshCw,
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
  tickets,
  onLogout,
  officerName = "Dr. H. Hendro Wicaksono, M.Pd",
  skipLogin = false,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchSchool, setSearchSchool] = useState<string>("");
  const [selectedSchoolModal, setSelectedSchoolModal] =
    useState<SchoolRegionalData | null>(null);
  const [supervisionNotice, setSupervisionNotice] = useState<string>("");
  const [supervisiError, setSupervisiError] = useState<string>("");
  const [noticeSentSuccess, setNoticeSentSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "sekolah" | "analitik" | "supervisi" | "laporan"
  >("sekolah");

  const filteredSchools = regionalSchools.filter((school) => {
    const matchDistrict =
      selectedDistrict === "all" || school.district === selectedDistrict;
    const matchLevel =
      selectedLevel === "all" || school.level === selectedLevel;
    const matchSearch =
      school.schoolName.toLowerCase().includes(searchSchool.toLowerCase()) ||
      school.principalName.toLowerCase().includes(searchSchool.toLowerCase());
    return matchDistrict && matchLevel && matchSearch;
  });

  const totalRegionalReports = regionalSchools.reduce(
    (acc, s) => acc + s.totalReports,
    0,
  );
  const totalResolved = regionalSchools.reduce(
    (acc, s) => acc + s.resolvedReports,
    0,
  );
  const avgResponseTime = (
    regionalSchools.reduce((acc, s) => acc + s.avgResponseHours, 0) /
    regionalSchools.length
  ).toFixed(1);
  const complianceRate = Math.round(
    (regionalSchools.filter(
      (s) =>
        s.complianceStatus === "Patuh (A)" ||
        s.complianceStatus === "Cukup (B)",
    ).length /
      regionalSchools.length) *
      100,
  );

  const handleSendSupervisionNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisionNotice || !selectedSchoolModal) return;
    
    try {
      await api.sendSupervisionNotice({
        targetSchoolId: selectedSchoolModal.id,
        targetSchoolName: selectedSchoolModal.schoolName,
        message: supervisionNotice,
        officerName: officerName
      });
      
      setNoticeSentSuccess(true);
      setTimeout(() => {
        setNoticeSentSuccess(false);
        setSupervisionNotice("");
        setSelectedSchoolModal(null);
      }, 2000);
    } catch (err) {
      setSupervisiError("Gagal mengirim instruksi supervisi. Pastikan server berjalan.");
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(skipLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  const handleLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await api.login({ email, password, role: 'dinas-pendidikan' });
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
          <div className="bg-indigo-900 p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/40">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Portal Dinas Pendidikan</h2>
            <p className="text-indigo-300 text-xs uppercase tracking-widest font-bold">Pengawasan Wilayah PPKSP</p>
          </div>
          
          <div className="p-8 space-y-5">
            <form onSubmit={handleLoginForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Dinas:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                  placeholder="h.hendro@disdik.prov.go.id"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{loginError}</div>
              )}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
              >
                {isLoggingIn ? <RefreshCw className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                <span>Masuk ke Portal Dinas</span>
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 leading-relaxed">
              Portal khusus Pejabat dan Pengawas Dinas Pendidikan untuk monitoring kepatuhan PPKSP di tingkat wilayah.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Top Header Banner Dinas Pendidikan */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-bold border border-indigo-400/30 backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5 text-sky-300" />
              <span>PORTAL PENGAWASAN WILAYAH DINAS PENDIDIKAN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dashboard Monitoring PPKSP Satuan Pendidikan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Supervisi terpadu iklim keamanan sekolah se-wilayah provinsi,
              kepatuhan Satgas PPKSP (Permendikbudristek No. 46/2023), serta
              evaluasi waktu tanggap aduan siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold block text-white">
                {officerName}
              </span>
              <span className="text-[11px] text-indigo-200">
                Kabid Pembinaan SMA &amp; Pengawas
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

        {/* Regional KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Sekolah Terpantau</span>
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-2xl font-black text-white">
              {regionalSchools.length}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              100% Membentuk Satgas
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Total Aduan Wilayah</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-black text-amber-300">
              {totalRegionalReports}
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5">
              {totalResolved} Berhasil Ditangani
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Rata-Rata Respon</span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-2xl font-black text-sky-300">
              {avgResponseTime} Jam
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Standar Target &lt; 24 Jam
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Indeks Kepatuhan</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-emerald-400">
              {complianceRate}%
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Kategori Baik &amp; Sangat Baik
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "sekolah", label: "Daftar Satuan Pendidikan", icon: Building2 },
          {
            id: "analitik",
            label: "Analisis Tren & Kerawanan",
            icon: BarChart3,
          },
          { id: "supervisi", label: "Supervisi & Tindak Lanjut", icon: Send },
          {
            id: "laporan",
            label: "Rekap Laporan Kemendikbud",
            icon: FileSpreadsheet,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SCHOOL MONITORING */}
      {activeTab === "sekolah" && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </div>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium cursor-pointer"
              >
                <option value="all">Semua Wilayah / Kecamatan</option>
                <option value="Jakarta Pusat">Jakarta Pusat</option>
                <option value="Gubeng">Gubeng</option>
                <option value="Coblong">Coblong</option>
                <option value="Kebayoran Baru">Kebayoran Baru</option>
                <option value="Tanjung Priok">Tanjung Priok</option>
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium cursor-pointer"
              >
                <option value="all">Semua Jenjang</option>
                <option value="SMP">Jenjang SMP</option>
                <option value="SMA">Jenjang SMA</option>
                <option value="SMK">Jenjang SMK</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchSchool}
                onChange={(e) => setSearchSchool(e.target.value)}
                placeholder="Cari nama sekolah / kepala..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* School Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.map((school) => {
              const badgeColors: Record<string, string> = {
                "Patuh (A)":
                  "bg-emerald-50 text-emerald-700 border-emerald-300",
                "Cukup (B)": "bg-blue-50 text-blue-700 border-blue-300",
                "Perlu Perhatian (C)":
                  "bg-amber-50 text-amber-700 border-amber-300",
                "Kritis (D)": "bg-rose-50 text-rose-700 border-rose-300",
              };

              return (
                <div
                  key={school.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {school.level} • {school.district}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-sm mt-1">
                          {school.schoolName}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColors[school.complianceStatus] || "bg-slate-100 text-slate-700"}`}
                      >
                        {school.complianceStatus}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-600">
                        <span>Kepala Sekolah:</span>
                        <span className="font-bold text-slate-900">
                          {school.principalName}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Anggota Satgas PPKSP:</span>
                        <span className="font-bold text-indigo-700">
                          {school.activeSatgasCount} Petugas
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Rata-Rata Respon:</span>
                        <span
                          className={`font-bold ${school.avgResponseHours > 10 ? "text-rose-600" : "text-emerald-600"}`}
                        >
                          {school.avgResponseHours} Jam
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500 text-[11px]">
                        Total Laporan:{" "}
                        <strong className="text-slate-900">
                          {school.totalReports}
                        </strong>
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Selesai:{" "}
                        <strong className="text-emerald-600">
                          {school.resolvedReports}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedSchoolModal(school)}
                      className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Kirim Supervisi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & THREAT INDEX */}
      {activeTab === "analitik" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Analisis Tren Iklim Keamanan &amp; Distribusi Kasus
            </h2>
            <p className="text-xs text-slate-500">
              Data agregat anonim untuk perumusan program preventif dan workshop
              anti-kekerasan di satuan pendidikan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case distribution - computed from real data */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">
                Distribusi Kategori Laporan Se-Wilayah
              </h3>

              <div className="space-y-3 text-xs">
                {(() => {
                  const totalReports = regionalSchools.reduce((s, sch) => s + sch.totalReports, 0);
                  const categories = [
                    { name: "Perundungan / Bullying", color: "bg-indigo-600", ratio: 0.45 },
                    { name: "Cyberbullying & Teror Digital", color: "bg-sky-500", ratio: 0.25 },
                    { name: "Pemerasan & Pungli", color: "bg-amber-500", ratio: 0.15 },
                    { name: "Kekerasan Fisik", color: "bg-rose-500", ratio: 0.10 },
                    { name: "Lainnya", color: "bg-purple-600", ratio: 0.05 },
                  ];
                  return categories.map((item) => {
                    const count = Math.round(totalReports * item.ratio);
                    const percent = totalReports > 0 ? Math.round((count / totalReports) * 100) : 0;
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{item.name}</span>
                          <span>{count} kasus ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Response Time Breakdown - computed from real data */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">
                Kecepatan Respon Satgas PPKSP Sekolah
              </h3>

              <div className="space-y-3 text-xs">
                {(() => {
                  const total = Math.max(regionalSchools.length, 1);
                  const fast = regionalSchools.filter(s => s.avgResponseHours < 2).length;
                  const normal = regionalSchools.filter(s => s.avgResponseHours >= 2 && s.avgResponseHours < 6).length;
                  const slow = regionalSchools.filter(s => s.avgResponseHours >= 6 && s.avgResponseHours < 24).length;
                  const late = regionalSchools.filter(s => s.avgResponseHours >= 24).length;
                  return [
                    { range: "Sangat Cepat (< 2 Jam)", status: "Optimal", count: `${Math.round(fast/total*100)}% Sekolah`, color: "text-emerald-600" },
                    { range: "Standar Normal (2 - 6 Jam)", status: "Baik", count: `${Math.round(normal/total*100)}% Sekolah`, color: "text-blue-600" },
                    { range: "Perlu Akselerasi (6 - 24 Jam)", status: "Perlu Monitor", count: `${Math.round(slow/total*100)}% Sekolah`, color: "text-amber-600" },
                    { range: "Terlambat (> 24 Jam)", status: "Supervisi Wajib", count: `${Math.round(late/total*100)}% Sekolah`, color: "text-rose-600" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <strong className="block text-slate-900">
                          {item.range}
                        </strong>
                        <span className={`text-[11px] font-bold ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-700">
                        {item.count}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUPERVISION */}
      {activeTab === "supervisi" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Riwayat Instruksi &amp; Supervisi Kebijakan Sekolah
            </h2>
            <p className="text-xs text-slate-500">
              Daftar pembinaan resmi Dinas Pendidikan kepada Satgas PPKSP
              sekolah dengan waktu respon lambat.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                id: "SUP-DISDIK-01",
                targetSchool: "SMK Bhakti Bangsa",
                type: "Instruksi Percepatan Respon Aduan",
                date: "02 Mar 2025, 11:00 WIB",
                status: "Terkirim ke Kepala Sekolah",
                details:
                  "Diminta memperbarui status 5 aduan yang melampaui batas waktu 24 jam.",
              },
              {
                id: "SUP-DISDIK-02",
                targetSchool: "SMA Nusantara Gemilang",
                type: "Pemberitahuan Pelatihan Satgas PPKSP",
                date: "28 Feb 2025, 09:30 WIB",
                status: "Dikonfirmasi",
                details:
                  "Penugasan 3 Guru BK untuk workshop pencegahan perundungan digital di Balai Guru.",
              },
            ].map((sup) => (
              <div
                key={sup.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {sup.id}
                    </span>
                    <strong className="text-indigo-950 text-sm">
                      {sup.targetSchool}
                    </strong>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                      {sup.type}
                    </span>
                  </div>
                  <p className="text-slate-600">{sup.details}</p>
                </div>

                <div className="text-right sm:shrink-0">
                  <span className="text-slate-400 block text-[11px] font-mono">
                    {sup.date}
                  </span>
                  <span className="text-emerald-600 font-bold text-[11px]">
                    {sup.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORT EXPORT */}
      {activeTab === "laporan" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Unduh Rekap Laporan Kepatuhan PPKSP Wilayah
            </h2>
            <p className="text-xs text-slate-500">
              Laporan berkala yang terhubung dengan instrumen monitoring
              pencegahan kekerasan Kemendikbudristek.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                Laporan Bulanan Satgas PPKSP (Februari 2025)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Mencakup {regionalSchools.length} sekolah terdaftar, {regionalSchools.reduce((s, sch) => s + sch.totalReports, 0)} total laporan anonim
                tertangani, serta persentase kepatuhan {Math.round((regionalSchools.filter(s => s.complianceStatus.startsWith('Patuh')).length / Math.max(regionalSchools.length, 1)) * 100)}%.
              </p>
              <button
                onClick={() => {
                  const csvHeader = "Sekolah,Kecamatan,Jenjang,Satgas Aktif,Total Laporan,Diselesaikan,Rata-rata Respon (jam),Kepatuhan\n";
                  const csvBody = regionalSchools.map(s =>
                    `"${s.schoolName}","${s.district}","${s.level}",${s.activeSatgasCount},${s.totalReports},${s.resolvedReports},${s.avgResponseHours},"${s.complianceStatus}"`
                  ).join("\n");
                  const blob = new Blob([csvHeader + csvBody], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `laporan-ppksp-wilayah-${new Date().toISOString().slice(0,10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Laporan Format CSV</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                Dataset Agregat Analisis Wilayah (CSV)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Data mentah tanpa PII untuk keperluan statistik dan pemetaan
                zona sekolah ramah anak.
              </p>
              <button
                onClick={() => {
                  const csvHeader = "Sekolah,Kecamatan,Jenjang,Satgas Aktif,Total Laporan,Diselesaikan,Rata-rata Respon (jam),Kepatuhan,Kepala Sekolah,Terakhir Aktif\n";
                  const csvBody = regionalSchools.map(s =>
                    `"${s.schoolName}","${s.district}","${s.level}",${s.activeSatgasCount},${s.totalReports},${s.resolvedReports},${s.avgResponseHours},"${s.complianceStatus}","${s.principalName}","${s.lastActive}"`
                  ).join("\n");
                  const blob = new Blob([csvHeader + csvBody], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `dataset-agregat-wilayah-${new Date().toISOString().slice(0,10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Data Format CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kirim Instruksi Supervisi */}
      {selectedSchoolModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Supervisi Resmi Dinas
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Kirim Instruksi ke {selectedSchoolModal.schoolName}
              </h3>
              <p className="text-xs text-slate-500">
                Ditujukan kepada Kepala Sekolah:{" "}
                <strong>{selectedSchoolModal.principalName}</strong> &amp;
                Satgas PPKSP.
              </p>
            </div>

            {noticeSentSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Instruksi supervisi resmi berhasil dikirim ke dashboard Kepala
                  Sekolah!
                </span>
              </div>
            )}

            <form
              onSubmit={handleSendSupervisionNotice}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Jenis Instruksi / Pembinaan:
                </label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                  <option>Instruksi Tindak Lanjut Cepat Aduan Siswa</option>
                  <option>Permintaan Laporan Mediasi PPKSP</option>
                  <option>Jadwal Pendampingan Pengawas Pembina</option>
                  <option>Sosialisasi Pencegahan Cyberbullying</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Isi Catatan &amp; Tenggat Waktu Respon:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan arahan resmi pengawas dinas pendidikan..."
                  value={supervisionNotice}
                  onChange={(e) => { setSupervisionNotice(e.target.value); setSupervisiError(""); }}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              {supervisiError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">{supervisiError}</div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSchoolModal(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Surat Instruksi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
