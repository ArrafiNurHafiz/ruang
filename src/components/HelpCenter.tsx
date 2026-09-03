import React, { useState, useEffect } from "react";
import {
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageSquare,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { HelpArticle, FAQItem } from "../types";
import { api } from "../lib/api";
import { isSupabaseEnabled } from "../lib/supabase";
import { MentalHealthVectorArt } from "./AnimatedIllustrations";
import { HELP_ARTICLES, FAQ_ITEMS } from "../data/mockData";

interface HelpCenterProps {
  onNavigateToContact: () => void;
  onNavigateToReport: () => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({
  onNavigateToContact,
  onNavigateToReport,
}) => {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(
    null,
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getHelpArticles(),
        api.getFAQs(),
      ]);
      const articlesData = results[0].status === 'fulfilled' ? results[0].value : [];
      const faqsData = results[1].status === 'fulfilled' ? results[1].value : [];
      setArticles(articlesData.length > 0 ? articlesData : HELP_ARTICLES);
      setFaqs(faqsData.length > 0 ? faqsData : FAQ_ITEMS);
    } catch {
      setArticles(HELP_ARTICLES);
      setFaqs(FAQ_ITEMS);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "Semua",
    "Cara Melapor",
    "Privasi & Keamanan",
    "Tracking Tiket",
    "Akun & Token",
    "Kebijakan Sekolah",
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCat =
      selectedCategory === "Semua" || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredFaqs = faqs.filter((faq) => {
    return (
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-2xs">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Pusat Bantuan &amp; Panduan Siswa</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ada yang Bisa Kami Bantu?
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Cari panduan langkah pelaporan, jaminan privasi kriptografis, dan
          informasi perlindungan hukum anak.
        </p>

        <div className="pt-2 relative max-w-xl mx-auto">
          <Search className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel bantuan, FAQ, atau kata kunci..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-950/20 border border-blue-400/30 overflow-hidden">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold border border-white/20 backdrop-blur-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Pendampingan Ramah Anak &amp; Guru BK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Jangan Ragu, Kamu Tidak Sendirian
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Semua proses konsultasi dan tindak lanjut dijamin bebas intimidasi,
            didampingi guru konselor bersertifikasi, dan hak privasimu
            dilindungi penuh oleh undang-undang.
          </p>
        </div>

        <div className="w-full sm:w-64 h-36 rounded-2xl overflow-hidden border border-white/20 shrink-0 shadow-lg bg-blue-950/40">
          <MentalHealthVectorArt className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedArticle && (
        <div className="bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {selectedArticle.category} • {selectedArticle.readTime}
            </span>
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1 rounded-lg bg-slate-100 cursor-pointer"
            >
              Tutup Artikel
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {selectedArticle.title}
          </h2>

          <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
            {selectedArticle.content.map((p, idx) => (
              <p
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={onNavigateToReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <span>Mulai Buat Laporan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Panduan Utama &amp; Topik Bantuan</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all space-y-2 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {art.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-blue-600">
                <span>Baca Panduan Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Jawaban langsung seputar kerahasiaan identitas, tindak lanjut, dan
            operasional aplikasi.
          </p>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-extrabold">
            Masih Memiliki Pertanyaan Lain?
          </h3>
          <p className="text-xs sm:text-sm text-blue-200 max-w-md">
            Hubungi saluran bantuan resmi kami atau kirim pesan rahasia langsung
            ke tim Guru BK.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onNavigateToContact}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl text-xs transition-colors shadow-md shadow-blue-900/30 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Kirim Pesan Resmi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
