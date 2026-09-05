import React, { useState, useEffect } from "react";
import {
  Search,
  ShieldCheck,
  Clock,
  Send,
  Lock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  Paperclip,
  FileText,
  CornerDownLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { api } from "../lib/api";
import { ReportTicket, ReportStatus } from "../types";

interface TicketStatusAndChatProps {
  tickets: ReportTicket[];
  initialTicketId?: string;
  onSendMessage: (ticketId: string, messageText: string) => void;
}

const STATUS_STEPS: { key: ReportStatus; label: string; desc: string }[] = [
  {
    key: "diterima",
    label: "1. Diterima",
    desc: "Laporan telah dienkripsi & masuk ke antrean triage BK",
  },
  {
    key: "ditinjau",
    label: "2. Ditinjau",
    desc: "Guru BK & Satgas PPKSP memverifikasi kronologi",
  },
  {
    key: "tindakan",
    label: "3. Tindakan",
    desc: "Langkah perlindungan & pemanggilan dilakukan",
  },
  {
    key: "ditutup",
    label: "4. Ditutup",
    desc: "Kasus selesai & pemulihan korban terpantau aman",
  },
];

export const TicketStatusAndChat: React.FC<TicketStatusAndChatProps> = ({
  tickets,
  initialTicketId = "",
  onSendMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialTicketId);
  const [activeTicket, setActiveTicket] = useState<ReportTicket | null>(
    initialTicketId
      ? tickets.find((t) => t.id === initialTicketId) || null
      : null,
  );
  const [chatInput, setChatInput] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");

  useEffect(() => {
    if (activeTicket) {
      const updated = tickets.find((t) => t.id === activeTicket.id);
      if (updated) setActiveTicket(updated);
    }
  }, [tickets]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    const q = searchQuery.trim();
    if (!q) return;

    try {
      const found = await api.getTicketByRecoveryCode(q);

      // Map API response to Ticket interface if needed
      const mappedFound: ReportTicket = {
        ...found,
        reporterRole: (found as any).reporter_role,
        incidentDate: (found as any).incident_date,
        redactedStory: (found as any).redacted_story,
        detectedPII: (found as any).detected_pii,
        recoveryCode: (found as any).recovery_code,
        isKioskSubmission: (found as any).is_kiosk_submission,
        messages:
          (found as any).messages?.map((m: any) => ({
            id: m.id,
            sender: m.sender_type,
            senderTitle: m.sender_title,
            text: m.message_text,
            timestamp: new Date(m.created_at).toLocaleString("id-ID"),
            isEncrypted: m.is_encrypted,
          })) || [],
      };

      setActiveTicket(mappedFound);
    } catch (err) {
      // Fallback search in prop tickets
      const found = tickets.find(
        (t) =>
          t.id.toUpperCase() === q.toUpperCase() ||
          t.recoveryCode.toLowerCase() === q.toLowerCase(),
      );
      if (found) {
        setActiveTicket(found);
      } else {
        setSearchError(
          `Nomor Tiket atau Kode Pemulihan tidak ditemukan. Pastikan format penulisan benar.`,
        );
      }
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeTicket) return;

    onSendMessage(activeTicket.id, chatInput.trim());
    setChatInput("");
  };

  const getStepIndex = (status: ReportStatus): number => {
    switch (status) {
      case "diterima":
        return 0;
      case "ditinjau":
        return 1;
      case "tindakan":
        return 2;
      case "ditutup":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header Banner Matching Beranda */}
      <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-950/20 border border-blue-400/30">
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 800 400"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-50 100 C200 50 450 250 850 150"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
            <path
              d="M-50 200 C300 150 500 350 850 250"
              stroke="white"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium border border-white/25 backdrop-blur-md">
            <Search className="w-3.5 h-3.5 text-sky-200" />
            <span>Tracking Tanpa Login Akun</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Cek Status Tiket &amp; Komunikasi 2 Arah
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Masukkan Nomor Tiket laporan Anda untuk memantau status tindak
            lanjut dan berkomunikasi secara aman dan terenkripsi dengan Guru BK.
          </p>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-4 sm:p-6">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan Nomor Tiket (Contoh: TMG-2025-78A1)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm sm:text-base font-bold text-slate-900 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Cari Tiket</span>
            </button>
          </div>

          {searchError && (
            <p className="text-xs text-red-600 font-bold flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </p>
          )}

          {/* Quick Demo Tickets Picker */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              Contoh Tiket Demo:
            </span>
            {tickets.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSearchQuery(t.id);
                  setActiveTicket(t);
                  setSearchError("");
                }}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold border transition-all cursor-pointer ${
                  activeTicket?.id === t.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
              >
                {t.id} ({t.category.split("/")[0].trim()})
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* ACTIVE TICKET DETAILS & CHAT */}
      {activeTicket && (
        <div className="space-y-6 animate-fadeIn">
          {/* Status Timeline Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80">
                    TIKET: {activeTicket.id}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {activeTicket.category}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Perkembangan Penanganan Laporan
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Terakhir Diperbarui:
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {new Date(activeTicket.updatedAt).toLocaleDateString(
                    "id-ID",
                    { day: "numeric", month: "short", year: "numeric" },
                  )}
                </span>
              </div>
            </div>

            {/* 4-Step Status Progress Bar */}
            <div className="py-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(activeTicket.status);
                  const isCompleted = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={step.key}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? "border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-400"
                          : isCompleted
                            ? "border-emerald-200 bg-emerald-50/40 text-slate-700"
                            : "border-slate-200 bg-slate-50/50 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-xs font-bold ${isCurrent ? "text-blue-950" : isCompleted ? "text-emerald-800" : "text-slate-400"}`}
                        >
                          {step.label}
                        </span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isCurrent ? (
                          <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
                        ) : null}
                      </div>
                      <p className="text-[11px] leading-tight text-slate-500">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Counselor Note or Action Summary */}
            {activeTicket.actionSummary && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-950">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-blue-900 block">
                    Tindakan dari Tim Satgas / Guru BK:
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {activeTicket.actionSummary}
                  </p>
                </div>
              </div>
            )}

            {/* Sanitized Story Reference */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 font-bold block">
                Ringkasan Laporan Terkirim (Tersanitasi):
              </span>
              <p className="text-slate-700 leading-relaxed italic">
                "{activeTicket.redactedStory}"
              </p>
            </div>
          </div>

          {/* 2-Way Encrypted Chat Thread */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-[520px]">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#1e40af] text-white p-4 px-6 flex items-center justify-between border-b border-blue-400/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 text-white flex items-center justify-center border border-white/25 shadow-sm backdrop-blur-md">
                  <MessageSquare className="w-5 h-5 text-sky-200" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Ruang Komunikasi Rahasia 2-Arah</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-200 font-mono px-2 py-0.5 rounded-full border border-emerald-400/40 font-bold">
                      End-to-End Encrypted
                    </span>
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    {activeTicket.assignedCounselor ||
                      "Tim Bimbingan Konseling & Satgas PPKSP"}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-sky-200 font-mono hidden sm:block font-bold">
                ZKP Verified
              </div>
            </div>

            {/* Chat Body (Message Stream) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {(activeTicket.messages ?? []).map((msg) => {
                const isPelapor = msg.sender === "pelapor";
                const isSystem = msg.sender === "system";

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="bg-slate-200/80 text-slate-700 text-xs px-4 py-1.5 rounded-full text-center max-w-md shadow-2xs font-medium">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isPelapor ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 space-y-1.5 shadow-xs ${
                        isPelapor
                          ? "bg-blue-600 text-white rounded-tr-xs"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[11px] opacity-80 border-b pb-1 border-white/10">
                        <span className="font-bold">
                          {isPelapor
                            ? "Anda (Pelapor Anonim)"
                            : msg.senderTitle || "Guru BK"}
                        </span>
                        <span className="text-[10px] font-mono">
                          {msg.timestamp}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                        {msg.text}
                      </p>

                      <div className="flex items-center justify-end gap-1 text-[10px] opacity-70 pt-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Terenkripsi</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
              <form
                onSubmit={handleSendChat}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ketik pesan aman untuk Guru BK di sini..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md ${
                    chatInput.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Kirim Pesan</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Empty State / How It Works Graphic Card */}
      {!activeTicket && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Bagaimana Sistem Komunikasi Rahasia 2-Arah Bekerja?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Anda dapat berkonsultasi, menambah kronologi, atau menjawab
                pertanyaan Guru BK secara langsung tanpa perlu membuat akun,
                tanpa login Google, dan tanpa meninggalkan jejak identitas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Kunci Kriptografis ZKP</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Hanya pemegang Nomor Tiket yang memiliki akses membaca respon
                tim BK.
              </p>
            </div>

            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Tindak Lanjut Bertahap</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Pantau proses dari Diterima, Ditinjau Satgas, Tindakan, hingga
                Selesai.
              </p>
            </div>

            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Identitas Terjaga</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Percakapan dienkripsi ujung ke ujung (E2EE) dan identitas tetap
                terlindungi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
