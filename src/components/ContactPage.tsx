import React, { useState } from "react";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { ContactMessage } from "../types";
import { useLanguage } from "../lib/i18n";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const API_URL = isLocalhost
  ? (import.meta.env.VITE_API_URL || "/api")
  : "/api";

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [category, setCategory] = useState<string>("Pertanyaan Layanan");
  const [message, setMessage] = useState<string>("");
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !name.trim()) return;

    setIsSending(true);
    setSendError("");

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, category, message }),
      });
      if (!response.ok) throw new Error("Gagal mengirim pesan");

      setIsSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setSendError(
        "Gagal mengirim pesan. Pastikan server backend berjalan dan coba lagi.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
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
            <PhoneCall className="w-3.5 h-3.5 text-sky-200" />
            <span>{t("contact.bannerBadge", "Hubungi Tim Ruang Aman & Satgas Sekolah")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {t("contact.bannerTitle", "Kontak Layanan Dukungan")}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {t("contact.bannerSub", "Kirimkan saran, permohonan sosialisasi, atau pertanyaan resmi kepada pengelola sistem dan konselor sekolah.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Send Message (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>{t("contact.formTitle", "Formulir Pesan Resmi")}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("contact.formNotice", "Jika ini adalah perundungan langsung, gunakan menu Lapor Anonim untuk perlindungan enkripsi penuh.")}
            </p>
          </div>

          {isSent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                {t("contact.sentTitle", "Pesan Anda Berhasil Terkirim!")}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {t("contact.sentSub", "Tim pengelola akan meninjau dan merespons pertanyaan Anda dalam 1x24 jam kerja.")}
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                {t("contact.sendAnother", "Kirim Pesan Lainnya")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t("contact.nameLabel", "Nama / Inisial (Opsional):")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("contact.namePlaceholder", "Boleh dikosongkan jika anonim")}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t("contact.emailLabel", "Email Kontak / Balasan:")}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("contact.emailPlaceholder", "email.anda@contoh.com")}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t("contact.categoryLabel", "Kategori Pesan:")}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pertanyaan Layanan">
                      {t("contact.catService", "Pertanyaan Layanan")}
                    </option>
                    <option value="Masalah Token">
                      {t("contact.catToken", "Kendala Kartu Token")}
                    </option>
                    <option value="Saran & Masukan">
                      {t("contact.catFeedback", "Saran & Masukan")}
                    </option>
                    <option value="Konsultasi Guru / Ortu">
                      {t("contact.catConsult", "Konsultasi Guru / Orang Tua")}
                    </option>
                    <option value="Lainnya">{t("contact.catOther", "Lainnya")}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t("contact.subjectLabel", "Subjek / Judul:")}
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t("contact.subjectPlaceholder", "Perihal pesan Anda")}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t("contact.messageLabel", "Isi Pesan:")}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("contact.messagePlaceholder", "Tuliskan pertanyaan atau informasi yang ingin disampaikan...")}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {sendError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                  {t("contact.sendError", sendError)}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer text-xs sm:text-sm"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("contact.sending", "Mengirim...")}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t("contact.submitBtn", "Kirim Pesan Dukungan")}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Info: Contact Directory & Office Hours (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 text-white rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl border border-blue-800">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-sky-300 font-bold">
                {t("contact.dirHeader", "INFORMASI RESMI")}
              </span>
              <h3 className="text-xl font-extrabold mt-1">
                {t("contact.dirTitle", "Sekretariat BK & PPKSP")}
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                {t("contact.dirSubtitle", "Pusat Pelayanan Terpadu Perlindungan Siswa")}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-800/80 text-sky-300 shrink-0 border border-blue-700">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-blue-200 block text-[10px]">
                    {t("contact.emailTitle", "Email Pengaduan:")}
                  </span>
                  <strong className="text-white">
                    ruangaman.ppksp@sekolah.sch.id
                  </strong>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-800/80 text-sky-300 shrink-0 border border-blue-700">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-blue-200 block text-[10px]">
                    {t("contact.phoneTitle", "Hotline Siaga BK (WA):")}
                  </span>
                  <strong className="text-white">
                    0821-9988-7711 {t("contact.phoneNote", "(Chat Khusus)")}
                  </strong>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-800/80 text-sky-300 shrink-0 border border-blue-700">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-blue-200 block text-[10px]">
                    {t("contact.hoursTitle", "Jam Layanan Konseling:")}
                  </span>
                  <strong className="text-white">
                    {t("contact.hoursValue", "Senin – Jumat: 07.00 – 17.00 WIB")}
                  </strong>
                  <span className="block text-blue-200/80 text-[10px] mt-0.5">
                    {t("contact.hoursNote", "Pelaporan online aktif 24 jam")}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-800/80 text-sky-300 shrink-0 border border-blue-700">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-blue-200 block text-[10px]">
                    {t("contact.locationTitle", "Alamat Fisik Safe Room:")}
                  </span>
                  <strong className="text-white">
                    {t("contact.locationValue", "Ruang Bimbingan Konseling (Gedung Utama Sayap Timur Lt. 2)")}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-800 text-[11px] text-blue-200/90 leading-relaxed">
              {t("contact.dirFooter", "Semua laporan fisik maupun daring dijamin kerahasiaannya di bawah sumpah Kode Etik Bimbingan Konseling Indonesia (ABKIN).")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
