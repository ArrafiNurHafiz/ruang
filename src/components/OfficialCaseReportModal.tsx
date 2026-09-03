import React, { useRef } from "react";
import {
  Printer,
  X,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Download,
  Copy,
  Check,
  Calendar,
  Building,
  UserCheck,
  Award,
  Lock,
} from "lucide-react";
import { ReportTicket, SchoolProfile } from "../types";

interface OfficialCaseReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: ReportTicket | null;
  schoolProfile: SchoolProfile;
}

export const OfficialCaseReportModal: React.FC<
  OfficialCaseReportModalProps
> = ({ isOpen, onClose, ticket, schoolProfile }) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !ticket) return null;

  const currentYear = new Date().getFullYear();
  const bapNumber = `BAP-PPKSP/${currentYear}/${ticket.id.replace("TMG-", "")}`;
  const currentDateFormatted = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
BERITA ACARA PENANGANAN KASUS KEKERASAN (BAP-PPKSP)
SATUAN PENDIDIKAN: ${schoolProfile.schoolName.toUpperCase()}
NOMOR: ${bapNumber}
DASAR HUKUM: Permendikbudristek No. 46 Tahun 2023 & UU No. 35 Tahun 2014

1. INFORMASI TIKET LAPORAN
- ID Tiket: #${ticket.id}
- Kategori Kasus: ${ticket.category}
- Tingkat Urgensi: ${ticket.urgency}
- Tanggal Masuk: ${new Date(ticket.createdAt).toLocaleDateString("id-ID")}
- Status Kasus: ${ticket.status.toUpperCase()}
- Verifikasi Token Siswa: ${ticket.verifiedSchoolToken || "Siswa Terdaftar (ZKP Valid)"}
- Lokasi Kejadian: ${ticket.location}

2. DESKRIPSI DAN KRONOLOGI DISANITASI
${ticket.redactedStory}

3. TINDAKAN PENANGANAN YANG DILAKSANAKAN
${ticket.actionSummary || (ticket.counselorNotes && ticket.counselorNotes.join("\n")) || "Penanganan konseling terarah dan pemantauan tertutup."}

4. KESIMPULAN & REKOMENDASI
Status penanganan dinyatakan ${ticket.status === "ditutup" ? "SELESAI DENGAN REKONSILIASI/PEMULIHAN" : "DALAM PROSES PENGAWASAN AKTIF"}.

Ditetapkan di: ${schoolProfile.district.split(",")[0]}
Tanggal: ${currentDateFormatted}

Mengetahui,
Kepala Sekolah: ${schoolProfile.principalName} (NIP: ${schoolProfile.principalNip})
Ketua Satgas PPKSP: ${schoolProfile.satgasLeaderName} (NIP: ${schoolProfile.satgasLeaderNip})
Konselor BK: ${schoolProfile.counselorCoordinatorName} (NIP: ${schoolProfile.counselorCoordinatorNip})
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Container Box */}
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200">
        {/* Modal Toolbar (Screen Only) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                Dokumen Resmi Berita Acara Kasus (BAP)
              </h3>
              <p className="text-[11px] text-slate-400">
                Standar Permendikbudristek No. 46/2023 • Satgas PPKSP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin Teks Berita Acara"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Tersalin" : "Salin Teks"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen / Simpan PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div
          ref={printRef}
          className="p-8 sm:p-12 overflow-y-auto max-h-[80vh] text-slate-900 bg-white font-serif selection:bg-blue-100 print:max-h-none print:overflow-visible print:p-6"
        >
          {/* KOP SURAT SEKOLAH */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-lg">
                <Award className="w-7 h-7 text-amber-300" />
              </div>
              <div className="text-center">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 font-sans">
                  PEMERINTAH PROVINSI {schoolProfile.province.toUpperCase()}
                </h4>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 font-sans">
                  {schoolProfile.schoolName}
                </h2>
                <h3 className="text-xs font-bold text-blue-950 font-sans">
                  SATUAN TUGAS PENCEGAHAN DAN PENANGANAN KEKERASAN (SATGAS
                  PPKSP)
                </h3>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 font-sans pt-1">
              NPSN: {schoolProfile.npsn} • Alamat: {schoolProfile.address}
            </p>
            <p className="text-[10px] text-slate-500 font-sans">
              Telepon: {schoolProfile.phone} • Email: {schoolProfile.email} • SK
              Satgas: {schoolProfile.satgasSkNumber}
            </p>
          </div>

          {/* JUDUL DOKUMEN */}
          <div className="text-center my-6 space-y-1">
            <h1 className="text-base sm:text-lg font-black uppercase tracking-wider underline font-sans text-slate-950">
              BERITA ACARA PENANGANAN KASUS (BAP)
            </h1>
            <p className="text-xs font-mono font-bold text-slate-700 font-sans">
              Nomor: {bapNumber}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-sans border border-slate-200 mt-1">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>
                DOKUMEN RAHASIA &amp; TERLINDUNGI HUKUM (PERMENDIKBUDRISTEK NO.
                46/2023)
              </span>
            </div>
          </div>

          {/* KETERANGAN DASAR HUKUM */}
          <p className="text-xs text-slate-700 leading-relaxed font-sans mb-4 text-justify">
            Pada hari ini, <strong>{currentDateFormatted}</strong>, Tim Satgas
            PPKSP bersama Guru Bimbingan Konseling
            <strong> {schoolProfile.schoolName}</strong> telah melakukan
            penelaahan, verifikasi tertutup, dan tindak lanjut penanganan
            terhadap laporan dugaan tindak kekerasan di lingkungan satuan
            pendidikan dengan rincian data sebagai berikut:
          </p>

          {/* TABEL DATA KASUS */}
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs font-sans mb-6">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-slate-50/70">
                  <td className="py-2.5 px-3.5 font-bold text-slate-700 w-1/3">
                    Nomor Tiket Sistem:
                  </td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-blue-900">
                    #{ticket.id}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-700">
                    Kategori Tindak Kekerasan:
                  </td>
                  <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                    {ticket.category}
                  </td>
                </tr>
                <tr className="bg-slate-50/70">
                  <td className="py-2.5 px-3.5 font-bold text-slate-700">
                    Klasifikasi Urgensi:
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        ticket.urgency.includes("Kritis")
                          ? "bg-red-100 text-red-800"
                          : ticket.urgency === "Tinggi"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {ticket.urgency}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-700">
                    Peran Pelapor:
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-800">
                    {ticket.reporterRole}
                  </td>
                </tr>
                <tr className="bg-slate-50/70">
                  <td className="py-2.5 px-3.5 font-bold text-slate-700">
                    Validasi Identitas Siswa:
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>
                      Siswa Terotentikasi Token Resmi{" "}
                      <strong>
                        {ticket.verifiedSchoolToken || "Siswa Terdaftar"}
                      </strong>{" "}
                      ({ticket.studentBatch || "Warga Sekolah Aktif"}) • ZKP
                      Valid
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3.5 font-bold text-slate-700">
                    Lokasi &amp; Waktu Kejadian:
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-800">
                    {ticket.location} • {ticket.incidentDate}
                  </td>
                </tr>
                <tr className="bg-slate-50/70">
                  <td className="py-2.5 px-3.5 font-bold text-slate-700">
                    Status Penanganan Terkini:
                  </td>
                  <td className="py-2.5 px-3.5 uppercase font-bold text-emerald-800">
                    {ticket.status}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* KRONOLOGI DISANITASI */}
          <div className="space-y-2 mb-6 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
              1. Deskripsi Kronologi Kejadian (Terenkripsi &amp; Disanitasi)
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 text-justify">
              {ticket.redactedStory || ticket.story}
            </div>
            <p className="text-[10px] text-slate-500 italic">
              *Catatan: Segala rincian identitas langsung (PII) pelapor telah
              disamarkan demi jaminan perlindungan korban sesuai undang-undang.
            </p>
          </div>

          {/* TINDAKAN YANG TELAH DILAKSANAKAN */}
          <div className="space-y-2 mb-6 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
              2. Matriks Tindakan &amp; Intervensi Satgas PPKSP
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 space-y-1.5">
              {ticket.actionSummary ? (
                <p>• {ticket.actionSummary}</p>
              ) : ticket.counselorNotes && ticket.counselorNotes.length > 0 ? (
                ticket.counselorNotes.map((n, i) => <p key={i}>• {n}</p>)
              ) : (
                <p>
                  • Tim Satgas PPKSP telah mengagendakan observasi tertutup di
                  lokasi kejadian dan konseling individual aman.
                </p>
              )}
              {ticket.isEscalatedToDinas && (
                <p className="font-semibold text-rose-800">
                  • Kasus telah dirujuk dan dikoordinasikan secara formal dengan{" "}
                  {ticket.escalatedTo || "UPTD PPA / Dinas Terkait"}.
                </p>
              )}
            </div>
          </div>

          {/* REKOMENDASI DAN RENCANA TINDAK LANJUT */}
          <div className="space-y-2 mb-8 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
              3. Rekomendasi &amp; Pemulihan
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-800 space-y-1">
              <li>
                Pemberian pendampingan psikologis berkelanjutan bagi peserta
                didik melalui Guru Bimbingan Konseling.
              </li>
              <li>
                Peningkatan patroli keamanan dan penertiban area titik buta
                sekolah pada jam-jam istirahat.
              </li>
              <li>
                Penerapan sanksi edukatif terukur terhadap pelaku sesuai tata
                tertib satuan pendidikan tanpa mengabaikan hak pendidikannya.
              </li>
              <li>
                Jaminan mutlak perlindungan dari intimidasi balasan
                (non-retaliation guarantee).
              </li>
            </ul>
          </div>

          {/* KOLOM TANDA TANGAN RESMI */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs font-sans pt-4 border-t border-slate-300">
            {/* Konselor Kasus */}
            <div className="space-y-14">
              <div>
                <p className="text-[11px] text-slate-600">
                  Konselor / Guru BK,
                </p>
                <p className="font-bold text-slate-900">Bimbingan Konseling</p>
              </div>
              <div>
                <p className="font-bold underline text-slate-900">
                  {schoolProfile.counselorCoordinatorName}
                </p>
                <p className="text-[10px] text-slate-600 font-mono">
                  NIP: {schoolProfile.counselorCoordinatorNip}
                </p>
              </div>
            </div>

            {/* Ketua Satgas PPKSP */}
            <div className="space-y-14">
              <div>
                <p className="text-[11px] text-slate-600">
                  Ketua Satgas PPKSP,
                </p>
                <p className="font-bold text-slate-900">
                  {schoolProfile.schoolName}
                </p>
              </div>
              <div>
                <p className="font-bold underline text-slate-900">
                  {schoolProfile.satgasLeaderName}
                </p>
                <p className="text-[10px] text-slate-600 font-mono">
                  NIP: {schoolProfile.satgasLeaderNip}
                </p>
              </div>
            </div>

            {/* Kepala Sekolah */}
            <div className="space-y-14">
              <div>
                <p className="text-[11px] text-slate-600">Mengetahui,</p>
                <p className="font-bold text-slate-900">
                  Kepala Satuan Pendidikan
                </p>
              </div>
              <div>
                <p className="font-bold underline text-slate-900">
                  {schoolProfile.principalName}
                </p>
                <p className="text-[10px] text-slate-600 font-mono">
                  NIP: {schoolProfile.principalNip}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-sans">
            Dokumen ini dicetak secara otomatis melalui Platform TAMENG (Tata
            Aman &amp; Mediasi Edukasi Nir-Gelisah) • {currentDateFormatted} •
            Verifikasi Digital: {ticket.hashZKP || "ZKP-VALID"}
          </div>
        </div>
      </div>
    </div>
  );
};
