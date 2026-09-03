import React, { useState } from "react";
import {
  Printer,
  Copy,
  Download,
  X,
  Check,
  ShieldCheck,
  KeyRound,
  School,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";
import { SchoolToken } from "../types";

interface PrintTokenSlipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: SchoolToken[];
  schoolName?: string;
}

export const PrintTokenSlipsModal: React.FC<PrintTokenSlipsModalProps> = ({
  isOpen,
  onClose,
  tokens,
  schoolName = "SMA Negeri 1 Jakarta",
}) => {
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Extract unique batches
  const batches = Array.from(
    new Set(tokens.map((t) => t.studentLevel || "Umum")),
  ).filter(Boolean);

  const filteredTokens =
    selectedBatch === "all"
      ? tokens
      : tokens.filter((t) => (t.studentLevel || "Umum") === selectedBatch);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAll = () => {
    const textList = filteredTokens
      .map(
        (t, idx) =>
          `${idx + 1}. Kode: ${t.tokenCode} | Rombel: ${t.studentLevel} | Status: ${t.status || "Tersedia"}`,
      )
      .join("\n");

    navigator.clipboard.writeText(
      `DAFTAR KODE AKSES SISWA SATGAS PPKSP - ${schoolName}\n` +
        `Tanggal: ${new Date().toLocaleDateString("id-ID")}\n` +
        `Total Kode: ${filteredTokens.length}\n\n` +
        textList,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csvHeader =
      "No,Kode Akses,Sekolah,Rombel / Angkatan,Status,Dibuat Pada\n";
    const csvRows = filteredTokens
      .map(
        (t, idx) =>
          `${idx + 1},"${t.tokenCode}","${t.schoolName}","${t.studentLevel}","${t.status || "Tersedia"}","${t.createdAt || "-"}"`,
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `kode_akses_siswa_${selectedBatch.replace(/\s+/g, "_")}_${Date.now()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white flex items-center justify-between border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30 text-sky-300">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Cetak &amp; Distribusi Slip Kode Akses Siswa
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Bagikan potongan slip kode rahasia ini secara acak kepada siswa
                untuk mencegah penyusup luar tanpa mencatat nama penerima.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Action Toolbar */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Filter Rombel / Kelas:
            </span>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Semua Rombel ({tokens.length} Kode)</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Tersalin!" : "Salin Semua"}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Slip ({filteredTokens.length})</span>
            </button>
          </div>
        </div>

        {/* Printable Grid of Slips */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-3">
            {filteredTokens.map((token, index) => (
              <div
                key={token.tokenCode}
                className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-4 relative shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                {/* Header of slip */}
                <div className="border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      <span>SATGAS PPKSP</span>
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                      #{index + 1}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {token.schoolName}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {token.studentLevel}
                  </p>
                </div>

                {/* Main Secret Code Box */}
                <div className="bg-slate-900 text-white rounded-xl p-3 text-center my-1.5 border border-slate-800">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 block mb-0.5">
                    KODE AKSES RAHASIA SISWA
                  </span>
                  <span className="font-mono text-base font-black tracking-widest text-sky-300 select-all">
                    {token.tokenCode}
                  </span>
                </div>

                {/* Instructions */}
                <div className="text-[9px] text-slate-500 space-y-1 mt-2 border-t border-slate-100 pt-2 leading-tight">
                  <p>
                    🔒 <strong>Petunjuk:</strong> Masukkan kode ini di portal
                    pelaporan anonim. Jangan berikan ke orang luar.
                  </p>
                  <p className="text-slate-400">
                    Sistem ZKP: Nama Anda tetap 100% anonim dan terlindungi.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total: <strong>{filteredTokens.length} Slip Kode</strong> siap
            digunting &amp; dibagikan
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
