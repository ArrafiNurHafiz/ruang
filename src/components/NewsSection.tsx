import React, { useState, useEffect, useMemo } from "react";
import {
  Newspaper,
  Search,
  Clock,
  ArrowRight,
  Share2,
  Bookmark,
  BookmarkCheck,
  ShieldAlert,
  Sparkles,
  Check,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { NewsArticle } from "../types";
import { api } from "../lib/api";
import { MOCK_NEWS_ARTICLES } from "../data/mockNews";
import {
  PPKSPVectorArt,
  CyberSafetyVectorArt,
  UpstanderVectorArt,
  MentalHealthVectorArt,
  ZKPVectorArt,
} from "./AnimatedIllustrations";

interface NewsSectionProps {
  onNavigateToReport: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  onNavigateToReport,
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const [savedArticles, setSavedArticles] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('tameng_saved_articles');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    try { localStorage.setItem('tameng_saved_articles', JSON.stringify(savedArticles)); } catch {}
  }, [savedArticles]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNewsArticles();
      setArticles(data.length > 0 ? data : MOCK_NEWS_ARTICLES);
    } catch (err) {
      console.error("Failed to load news:", err);
      setArticles(MOCK_NEWS_ARTICLES);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "Semua",
    "Regulasi & PPKSP",
    "Edukasi Anti-Bullying",
    "Kesehatan Mental",
    "Keamanan Digital",
  ];

  const renderIllustration = (type?: string, className = "w-full h-full") => {
    switch (type) {
      case "ppksp":
        return <PPKSPVectorArt className={className} />;
      case "cyber":
        return <CyberSafetyVectorArt className={className} />;
      case "upstander":
        return <UpstanderVectorArt className={className} />;
      case "mental":
        return <MentalHealthVectorArt className={className} />;
      case "zkp":
        return <ZKPVectorArt className={className} />;
      default:
        return <PPKSPVectorArt className={className} />;
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;
      const matchQuery =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      return matchCategory && matchQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.isFeatured) || articles[0];
  }, [articles]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedArticles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleShare = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}#berita-${article.id}`,
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
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

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium border border-white/25 backdrop-blur-md">
            <Newspaper className="w-3.5 h-3.5 text-sky-200" />
            <span>Kanal Berita &amp; Edukasi Ruang Aman</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Berita &amp; Edukasi Perlindungan Siswa
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Kumpulan informasi resmi, panduan pencegahan perundungan, regulasi
            PPKSP, dan edukasi kesehatan mental untuk menciptakan sekolah yang
            aman dan inklusif.
          </p>
        </div>
      </div>

      {!searchQuery && selectedCategory === "Semua" && featuredArticle && (
        <div
          onClick={() => setSelectedArticle(featuredArticle)}
          className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 group"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full overflow-hidden bg-slate-900 flex items-center justify-center">
              {renderIllustration(
                featuredArticle.illustrationType,
                "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
              )}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sorotan Utama</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
                    {featuredArticle.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {featuredArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {featuredArticle.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {featuredArticle.author}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {featuredArticle.publishedAt}
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel, topik, regulasi..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const isSaved = savedArticles.includes(article.id);
            return (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    {renderIllustration(
                      article.illustrationType,
                      "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                        {article.category}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      title={isSaved ? "Hapus Simpanan" : "Simpan Artikel"}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-blue-600 flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-blue-600 fill-blue-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>{article.publishedAt}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                      {article.author}
                    </span>
                    <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Baca</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3 shadow-md">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Tidak ada artikel ditemukan
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba gunakan kata kunci pencarian lain atau pilih kategori Semua
            untuk menampilkan seluruh artikel.
          </p>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-800/80 text-sky-300 flex items-center justify-center shrink-0 border border-blue-700 shadow-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-extrabold text-white">
              Mengalami atau Menyaksikan Kejadian Serupa?
            </h3>
            <p className="text-xs text-blue-200 max-w-xl">
              Jangan simpan sendiri. Suaramu dilindungi oleh enkripsi penuh.
              Buat pengaduan anonim sekarang dan dapatkan pertolongan dari Guru
              BK.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToReport}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 transition-all hover:scale-105 shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span>Buat Laporan Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col my-auto animate-scaleUp">
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-300 font-mono uppercase">
                  {selectedArticle.category}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  {selectedArticle.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleShare(selectedArticle, e)}
                  title="Salin Tautan Artikel"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-xs">
                {renderIllustration(
                  selectedArticle.illustrationType,
                  "w-full h-full object-cover",
                )}
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex items-center gap-3 text-xs text-slate-500 border-b border-slate-100 pb-4">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                    {selectedArticle.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {selectedArticle.author}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {selectedArticle.authorRole} |{" "}
                      {selectedArticle.publishedAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-blue-950 space-y-0.5">
                  <span className="font-bold block">
                    Butuh bantuan darurat atau konsultasi rahasia?
                  </span>
                  <p className="text-slate-600">
                    Laporkan insiden atau hubungi Guru BK tanpa takut identitas
                    terungkap.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    onNavigateToReport();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-md cursor-pointer shrink-0"
                >
                  Buat Pengaduan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
