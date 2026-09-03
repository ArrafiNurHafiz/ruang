import React from "react";
import {
  Users,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { AppUserRole } from "../types";

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: AppUserRole;
  onSelectRole: (role: AppUserRole) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  const rolesList: {
    id: AppUserRole;
    name: string;
    subtitle: string;
    icon: React.ElementType;
    badge: string;
    badgeColor: string;
    bgColor: string;
    features: string[];
    officialAgency: string;
  }[] = [
    {
      id: "siswa",
      name: "1. Siswa / Pelapor Anonim",
      subtitle: "Warga Satuan Pendidikan (Korban / Saksi)",
      icon: GraduationCap,
      badge: "Siswa",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
      bgColor: "hover:border-sky-400 hover:bg-sky-50/40",
      officialAgency: "Pelajar Terlindungi Haknya",
      features: [
        "Kirim Laporan Anonim Berbasis ZKP",
        "Chat 2-Arah Terenkripsi dengan Guru BK",
        "Aktivasi Token Semaphore & Recovery Key",
        "Mode Kios Komputer Bersama (Auto 3 Mnt)",
      ],
    },
    {
      id: "guru",
      name: "2. Guru BK & Satgas PPKSP",
      subtitle: "Tenaga Pendidik & Tim Penanganan Satuan Pendidikan",
      icon: UserCheck,
      badge: "Guru BK / Satgas",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      bgColor: "hover:border-blue-400 hover:bg-blue-50/40",
      officialAgency: "Satuan Pendidikan Sekolah",
      features: [
        "Triage & Investigasi Laporan Masuk",
        "Chat Langsung Terenkripsi dengan Siswa",
        "Catatan Konseling Rahasia & Jadwal Mediasi",
        "Eskalasi Kasus Kritis ke Dinas & UPTD PPA",
      ],
    },
    {
      id: "admin",
      name: "3. Admin Sekolah & Sistem",
      subtitle: "Administrator Keamanan IT & Operator PPKSP",
      icon: ShieldCheck,
      badge: "Admin Sekolah",
      badgeColor: "bg-slate-200 text-slate-800 border-slate-300",
      bgColor: "hover:border-slate-400 hover:bg-slate-50",
      officialAgency: "Manajemen Sistem Sekolah",
      features: [
        "Batch Generator Token Siswa Semaphore",
        "Manajemen Akun Guru BK & Hak Akses",
        "Audit Trail Enkripsi ZKP (Zero PII)",
        "Konfigurasi Satuan Pendidikan & Hotline",
      ],
    },
    {
      id: "dinas-pendidikan",
      name: "4. Dinas Pendidikan Wilayah",
      subtitle: "Pengawas Satuan Pendidikan & Bidang Pembinaan",
      icon: Building2,
      badge: "Dinas Pendidikan",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      bgColor: "hover:border-indigo-400 hover:bg-indigo-50/40",
      officialAgency: "Dinas Pendidikan Provinsi / Daerah",
      features: [
        "Monitoring Iklim Keamanan Seluruh Sekolah",
        "Evaluasi KPI Response Time Satgas Sekolah",
        "Kirim Instruksi & Supervisi Resmi",
        "Rekap Laporan Kemendikbudristek No. 46/2023",
      ],
    },
    {
      id: "dinas-perlindungan",
      name: "5. Dinas Perlindungan (UPTD PPA)",
      subtitle: "Dinas PPPA / Unit Pelaksana Teknis Perlindungan Anak",
      icon: HeartHandshake,
      badge: "UPTD PPA / DP3A",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      bgColor: "hover:border-rose-400 hover:bg-rose-50/40",
      officialAgency: "Kementerian PPPA & UPTD Daerah",
      features: [
        "Penanganan Kasus Kritis & Risiko Tinggi",
        "Disposisi Psikolog Klinis & Trauma Healing",
        "Pendampingan Advokat Ramah Anak / LBH",
        "Fasilitasi Shelter Rumah Aman (Safehouse)",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 my-8 animate-scaleUp border border-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              <span>PILIH PERAN PENGGUNA (5 USER ROLES)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Pusat Navigasi &amp; Portal 5 Peran
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Pilih peran di bawah ini untuk melihat antarmuka dan fungsi khusus
              yang disesuaikan untuk masing-masing pemangku kepentingan.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesList.map((r) => {
            const Icon = r.icon;
            const isCurrent = activeRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => {
                  onSelectRole(r.id);
                  onClose();
                }}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                    : `border-slate-200 bg-white ${r.bgColor}`
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isCurrent
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${r.badgeColor}`}
                    >
                      {r.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {r.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {r.subtitle}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Fitur &amp; Wewenang:
                    </p>
                    {r.features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-[11px] text-slate-600"
                      >
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    {r.officialAgency}
                  </span>
                  <button
                    className={`text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                      isCurrent
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{isCurrent ? "Sedang Aktif" : "Buka Portal"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom helper */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Setiap peran memiliki isolasi data dan otentikasi hak akses
              tersendiri.
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
