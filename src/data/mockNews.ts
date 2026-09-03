import { NewsArticle } from "../types";

export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    title:
      "Sosialisasi Permendikbudristek No. 46 Tahun 2023: Sekolah Wajib Bentuk Satgas PPKSP",
    category: "Regulasi & PPKSP",
    publishedAt: "2 Maret 2025",
    author: "Satgas PPKSP Nasional",
    authorRole: "Puspeka Kemendikbudristek",
    readTime: "4 menit baca",
    illustrationType: "ppksp",
    excerpt:
      "Peraturan Menteri terbaru mempertegas perlindungan siswa dari segala bentuk perundungan, pemalakan, kekerasan seksual, dan diskriminasi dengan mekanisme penanganan rahasia dan aman.",
    content: [
      "Pemerintah melalui Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi resmi mengesahkan Permendikbudristek No. 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP).",
      "Regulasi ini mengamanatkan setiap satuan pendidikan untuk membentuk Tim Pencegahan dan Penanganan Kekerasan (TPPK) serta menyediakan kanal pelaporan yang terpercaya, anonim, dan bebas dari intimidasi.",
      "Melalui platform Rangkul (TAMENG), seluruh siswa dapat melaporkan tindakan perundungan tanpa khawatir identitas bocor, karena identitas dilindungi enkripsi mutlak dan tidak dicatat dalam server.",
      "Satgas di sekolah bertugas melakukan investigasi secara proporsional dan mengutamakan pemulihan fisik serta psikologis bagi korban.",
    ],
    tags: ["PPKSP", "Permendikbud", "Sekolah Ramah Anak", "Satgas"],
    isFeatured: true,
  },
  {
    id: "news-2",
    title:
      "Mengenali 5 Tanda Terselubung Cyberbullying di Media Sosial & Grup Chat Kelas",
    category: "Edukasi Anti-Bullying",
    publishedAt: "28 Februari 2025",
    author: "Dra. Hj. Nurjanah, M.Pd",
    authorRole: "Koordinator Guru BK",
    readTime: "3 menit baca",
    illustrationType: "cyber",
    excerpt:
      "Perundungan di dunia maya seringkali tidak kasat mata oleh guru. Kenali cirinya dan ketahui langkah aman mendokumentasikan bukti digital tanpa kepanikan.",
    content: [
      "Cyberbullying atau perundungan siber kerap terjadi di luar jam sekolah melalui grup obrolan instan, pesan anonim (menfess), atau komentar media sosial.",
      "Beberapa bentuk umum meliputi: penyebaran foto/video tanpa izin bernada mengejek, pengucilan terencana dari grup komunikasi kelas, doxxing (menyebarkan informasi pribadi), hingga komentar bernada merendahkan penampilan fisik (body shaming).",
      "Jika kamu atau temanmu mengalaminya, langkah pertama adalah: JANGAN membalas dengan emosi. Lakukan screenshot atau simpan bukti tautan, lalu segera laporkan melalui kanal pengaduan anonim kami.",
      "Tim BK akan menindaklanjuti secara bijaksana melalui pendekatan persuasif dan mediasi tertutup.",
    ],
    tags: ["Cyberbullying", "Edukasi", "Tips Siswa", "Bimbingan Konseling"],
    isFeatured: false,
  },
  {
    id: "news-3",
    title:
      'Menjadi "Upstander": Berani Bersuara Menolong Teman Tanpa Takut Terancam',
    category: "Edukasi Anti-Bullying",
    publishedAt: "25 Februari 2025",
    author: "Ahmad Fauzi, S.Pd",
    authorRole: "Divisi Pengaduan Satgas",
    readTime: "3 menit baca",
    illustrationType: "upstander",
    excerpt:
      "Jangan hanya menjadi bystander (penonton pasif). Kamu bisa menjadi penolong dengan melaporkan insiden sebagai saksi mata secara 100% anonim.",
    content: [
      "Mayoritas kasus perundungan berhenti ketika ada saksi yang bersuara atau memberikan laporan kepada pihak berwenang.",
      'Seringkali siswa enggan melapor karena takut dianggap "cepu" atau takut menjadi target berikutnya. Di Rangkul, kami merancang fitur khusus "Siswa (Saksi Mata)" di mana sistem secara otomatis menyamarkan segala petunjuk pengenalmu.',
      "Menolong teman yang tertekan adalah tindakan mulia dan pahlawan sejati di lingkungan sekolah.",
      "Kebaikanmu hari ini dapat menyelamatkan masa depan dan kesehatan mental sahabatmu.",
    ],
    tags: ["Upstander", "Solidaritas", "Saksi Aman", "Karakter"],
    isFeatured: false,
  },
  {
    id: "news-4",
    title:
      "Menjaga Kesehatan Mental Remaja: Mengatasi Stres Akademik dan Tekanan Sosial",
    category: "Kesehatan Mental",
    publishedAt: "20 Februari 2025",
    author: "Psikolog Klinis Mitra",
    authorRole: "Layanan Konseling Sahabat",
    readTime: "5 menit baca",
    illustrationType: "mental",
    excerpt:
      "Merasa cemas, tertekan, atau kehilangan semangat belajar? Ruang BK bukan tempat siswa bermasalah, melainkan tempat curhat yang aman dan nyaman.",
    content: [
      "Masa remaja adalah fase penting perkembangan emosi. Beban tugas sekolah, ekspektasi keluarga, serta dinamika pertemanan terkadang membuat seseorang merasa kewalahan.",
      "Jika kamu mengalami gangguan tidur berkepanjangan, merasa terisolasi, atau memiliki pikiran putus asa, ingatlah bahwa kamu tidak sendirian.",
      "Guru BK di sekolah hadir sebagai konselor profesional yang siap mendengarkan tanpa menghakimi.",
      "Kamu juga dapat mengirimkan pesan rahasia lewat fitur pengaduan kami untuk membuat jadwal sesi obrolan tatap muka atau daring.",
    ],
    tags: ["Kesehatan Mental", "Self Care", "Konseling", "Ruang Nyaman"],
    isFeatured: false,
  },
  {
    id: "news-5",
    title:
      "Panduan Keamanan Digital: Lindungi Bukti Pengaduan dan Bersihkan Cache Pribadi",
    category: "Keamanan Digital",
    publishedAt: "15 Februari 2025",
    author: "Tim Keamanan Siber Rangkul",
    authorRole: "Privacy & Cryptography Unit",
    readTime: "4 menit baca",
    illustrationType: "zkp",
    excerpt:
      "Pelajari bagaimana fitur Zero-Knowledge Proof (Semaphore) dan Mode Kios melindungi privasi pelapor dari pelacakan perangkat.",
    content: [
      "Keamanan pelapor adalah prioritas absolut dalam arsitektur aplikasi ini.",
      "Setiap berkas foto atau rekaman yang diunggah secara otomatis dipangkas metadata EXIF-nya (lokasi GPS, model kamera, waktu pengambilan asli) sebelum dikirim.",
      "Jika kamu menggunakan komputer bersama di perpustakaan atau lab komputer, pastikan selalu menggunakan Mode Kios yang secara otomatis membersihkan seluruh riwayat dalam 3 menit.",
      'Gunakan tombol "Keluar Cepat" (ESC 2x) kapan pun kamu merasa perlu menutup layar seketika.',
    ],
    tags: ["Keamanan Digital", "ZKP", "Privasi Data", "Mode Kios"],
    isFeatured: false,
  },
];
