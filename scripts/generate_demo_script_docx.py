#!/usr/bin/env python3
"""
RUANG AMAN - Official Demo Script DOCX Generator
Generates a beautifully styled, competition-ready Word document for the demo script
with the updated realistic flow:
1. Guru BK / Satgas generates token batch in dashboard
2. Blind distribution of token slips
3. Student uses token to report anonymously
"""

import os
import sys
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

# Color Palette
PRIMARY_BLUE = RGBColor(0x1E, 0x40, 0xAF)    # #1E40AF (Deep Blue)
NAVY_HEADER = RGBColor(0x0F, 0x17, 0x2A)     # #0F172A (Slate 900)
ACCENT_GREEN = RGBColor(0x05, 0x96, 0x69)    # #059669 (Emerald)
TEXT_DARK = RGBColor(0x1F, 0x29, 0x37)       # #1F2937
TEXT_MUTED = RGBColor(0x4B, 0x55, 0x63)      # #4B5563
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

def set_cell_shading(cell, color_hex: str):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading)

def set_cell_border(cell, **kwargs):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}/>')
    for edge, attrs in kwargs.items():
        element = parse_xml(
            f'<w:{edge} {nsdecls("w")} w:val="{attrs.get("val", "single")}" '
            f'w:sz="{attrs.get("sz", "4")}" w:space="0" '
            f'w:color="{attrs.get("color", "D1D5DB")}"/>'
        )
        tcBorders.append(element)
    tcPr.append(tcBorders)

def add_callout(doc, text: str, title: str = "CATATAN OPERATOR"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.5)
    
    cell = table.cell(0, 0)
    set_cell_shading(cell, "F0FDF4")
    set_cell_border(cell, 
                    left={'sz': '24', 'color': '059669', 'val': 'single'},
                    top={'sz': '4', 'color': 'D1FAE5', 'val': 'single'},
                    bottom={'sz': '4', 'color': 'D1FAE5', 'val': 'single'},
                    right={'sz': '4', 'color': 'D1FAE5', 'val': 'single'})
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.left_indent = Inches(0.1)
    p.paragraph_format.right_indent = Inches(0.1)
    
    run_title = p.add_run(f"💡 {title}\n")
    run_title.bold = True
    run_title.font.name = "Arial"
    run_title.font.size = Pt(9.5)
    run_title.font.color.rgb = RGBColor(0x06, 0x5F, 0x46)
    
    run_text = p.add_run(text)
    run_text.font.name = "Arial"
    run_text.font.size = Pt(9)
    run_text.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

def main():
    doc = Document()

    # Page Margins (Normal: 1 inch / 2.54 cm)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Base Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = TEXT_DARK
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    # Document Header Title
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_t = title_p.add_run("🎙️ NASKAH RESMI DEMONSTRASI & PITCHING PLATFORM")
    run_t.bold = True
    run_t.font.name = "Arial"
    run_t.font.size = Pt(15)
    run_t.font.color.rgb = PRIMARY_BLUE

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(14)
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_sub = sub_p.add_run("RUANG AMAN: Platform Pencegahan & Penanganan Kekerasan di Satuan Pendidikan Berbasis Zero-Knowledge Proof (ZKP)")
    run_sub.bold = True
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = NAVY_HEADER

    # Metadata Table
    meta_table = doc.add_table(rows=5, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    meta_table.columns[0].width = Inches(2.2)
    meta_table.columns[1].width = Inches(4.3)

    meta_data = [
        ("Aplikasi Live (Produksi)", "https://ruang.rapsdev.web.id"),
        ("Repositori Sumber (GitHub)", "https://github.com/ArrafiNurHafiz/ruang"),
        ("Target Durasi Presentasi", "Tepat 3 Menit (180 Detik) [Ekspansi Tanya Jawab s/d 5 Menit]"),
        ("Kesesuaian Regulasi Resmi", "Permendikbudristek No. 46 Tahun 2023 & UU TPKS No. 12 Tahun 2022"),
        ("Validasi Usabilitas Teruji", "Skor System Usability Scale (SUS): 86,4 / Grade A+ (Exceptional)")
    ]

    for i, (k, v) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        set_cell_shading(c0, "F8FAFC")
        set_cell_shading(c1, "FFFFFF" if i % 2 == 0 else "F8FAFC")
        for c in (c0, c1):
            set_cell_border(c, top={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                               bottom={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                               left={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                               right={'sz': '4', 'color': 'E2E8F0', 'val': 'single'})
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(3)
        p0.paragraph_format.space_after = Pt(3)
        r0 = p0.add_run(k)
        r0.bold = True
        r0.font.size = Pt(8.5)
        r0.font.color.rgb = TEXT_DARK
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(3)
        p1.paragraph_format.space_after = Pt(3)
        r1 = p1.add_run(v)
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = PRIMARY_BLUE if "http" in v else TEXT_DARK

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # SECTION 1: CREDENTIALS & OPERATOR CHEAT SHEET
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(6)
    r_h1 = h1.add_run("1. Kredensial Akun & Operator Cheat Sheet (Alur Hulu ke Hilir)")
    r_h1.bold = True
    r_h1.font.size = Pt(12)
    r_h1.font.color.rgb = PRIMARY_BLUE

    cred_table = doc.add_table(rows=7, cols=4)
    cred_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cred_table.autofit = False
    cred_table.columns[0].width = Inches(1.5)
    cred_table.columns[1].width = Inches(1.6)
    cred_table.columns[2].width = Inches(1.1)
    cred_table.columns[3].width = Inches(2.3)

    cred_headers = ["Peran Pengguna", "Identitas / Email", "Kata Sandi", "Fitur Kunci yang Ditampilkan"]
    for j, h in enumerate(cred_headers):
        cell = cred_table.cell(0, j)
        set_cell_shading(cell, "1E40AF")
        set_cell_border(cell, top={'sz': '6', 'color': '1E40AF', 'val': 'single'},
                               bottom={'sz': '6', 'color': '1E40AF', 'val': 'single'},
                               left={'sz': '4', 'color': '1E40AF', 'val': 'single'},
                               right={'sz': '4', 'color': '1E40AF', 'val': 'single'})
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(h)
        run.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = WHITE

    creds_rows = [
        ("Guru BK (Hulu)", "guru.bk@sekolah.sch.id", "password123\n(11223344)", "LANGKAH 1: Generate batch token siswa (prefix SCH-X1-), salin kode SCH-X1-8831 / cetak slip acak."),
        ("Siswa / Pelapor", "Tanpa Login Akun\nToken: SCH-X1-8831", "Sandi: siswa2026\nPIN: 7890", "LANGKAH 2: Masukkan token hasil generate, pasang sandi pribadi, sensor AI PII, ZKP, & Camouflage ESC 2x."),
        ("Guru BK (Hilir)", "guru.bk@sekolah.sch.id", "password123", "LANGKAH 3: Triase kasus baru, chat dua arah, catatan investigasi, & terbitkan Berita Acara (BAP) resmi."),
        ("Dinas Pendidikan", "h.hendro@disdik.prov.go.id", "password123", "Monitoring heatmap kerawanan wilayah agregat, SLA respon sekolah, & terbitkan Nota Supervisi."),
        ("UPTD PPA (PPPA)", "sri.rahayu@uptd-ppa.go.id", "password123", "Intervensi kasus kritis, disposisi psikolog klinis, pendampingan hukum, & safehouse."),
        ("Admin Sistem (IT)", "admin@ruang.com", "admin123", "Audit log kriptografi tak terhapus (immutable), kelola akun wilayah, & backup database.")
    ]

    for i, row_data in enumerate(creds_rows, start=1):
        bg = "FFFFFF" if i % 2 != 0 else "F8FAFC"
        for j, val in enumerate(row_data):
            cell = cred_table.cell(i, j)
            set_cell_shading(cell, bg)
            set_cell_border(cell, top={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                                   bottom={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                                   left={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                                   right={'sz': '4', 'color': 'E2E8F0', 'val': 'single'})
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            run = p.add_run(val)
            run.font.size = Pt(8)
            if j == 0:
                run.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    add_callout(doc, 
                "Presenter dapat membuka Developer Tools Console (F12) untuk berpindah peran secara instan tanpa perlu logout-login manual:\n"
                "• window.__switchRole('guru')  • window.__switchRole('siswa')  • window.__switchRole('dinas-pendidikan')\n"
                "• window.__switchRole('dinas-perlindungan')  • window.__toggleDisguise(true)  [Atau tekan tombol ESC 2 kali secara cepat]",
                "PINTASAN KONSOL PENGUJI (DEV SHORTCUTS)")

    # SECTION 2: TIMELINE DEMO
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(6)
    r_h2 = h2.add_run("2. Struktur Garis Waktu Demonstrasi (Timeline 180 Detik)")
    r_h2.bold = True
    r_h2.font.size = Pt(12)
    r_h2.font.color.rgb = PRIMARY_BLUE

    timeline_table = doc.add_table(rows=7, cols=3)
    timeline_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    timeline_table.autofit = False
    timeline_table.columns[0].width = Inches(1.3)
    timeline_table.columns[1].width = Inches(2.2)
    timeline_table.columns[2].width = Inches(3.0)

    t_headers = ["Waktu (Timecode)", "Bab & Fokus Utama", "Capaian & Output Pembuktian"]
    for j, h in enumerate(t_headers):
        cell = timeline_table.cell(0, j)
        set_cell_shading(cell, "0F172A")
        set_cell_border(cell, top={'sz': '6', 'color': '0F172A', 'val': 'single'},
                               bottom={'sz': '6', 'color': '0F172A', 'val': 'single'},
                               left={'sz': '4', 'color': '0F172A', 'val': 'single'},
                               right={'sz': '4', 'color': '0F172A', 'val': 'single'})
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(h)
        run.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = WHITE

    t_data = [
        ("00:00 - 00:25 (25s)", "Bab 1: Dilema Fenomena Gunung Es", "Membangun empati, paparan data KPAI, & limitasi janji etika privasi."),
        ("00:25 - 01:00 (35s)", "Bab 2: ZKP & Guru BK Generate Token", "Sekolah menerbitkan 25 batch token Kelas X (SCH-X1-), salin token & slip cetak acak."),
        ("01:00 - 01:45 (45s)", "Bab 3: Demo Siswa Melapor dengan Token", "Siswa input token hasil generate, pasang sandi pribadi, sensor AI PII, ZKP < 3s."),
        ("01:45 - 02:10 (25s)", "Bab 4: Tiket Asimetris & Kiosk Camouflage", "Pelacakan tiket rahasia & demo darurat tombol ESC 2x mutasi ke soal Fisika."),
        ("02:10 - 02:45 (35s)", "Bab 5: Kolaborasi Terpadu Lintas Lembaga", "Triase Guru BK, draft BAP digital, supervisi Disdik, & intervensi UPTD PPA."),
        ("02:45 - 03:00 (15s)", "Bab 6: Validasi Empiris & Penutup", "Skor SUS 86,4 (Grade A+ Exceptional), kesiapan open source, & Call to Action.")
    ]

    for i, row in enumerate(t_data, start=1):
        bg = "FFFFFF" if i % 2 != 0 else "F8FAFC"
        for j, val in enumerate(row):
            cell = timeline_table.cell(i, j)
            set_cell_shading(cell, bg)
            set_cell_border(cell, top={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                                   bottom={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                                   left={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                                   right={'sz': '4', 'color': 'E2E8F0', 'val': 'single'})
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            run = p.add_run(val)
            run.font.size = Pt(8)
            if j == 0:
                run.bold = True

    # SECTION 3: VERBATIM SCRIPT DETAILS
    doc.add_page_break()

    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(0)
    h3.paragraph_format.space_after = Pt(6)
    r_h3 = h3.add_run("3. Naskah Kata-per-Kata (Verbatim Speech) & Panduan Visual Layar")
    r_h3.bold = True
    r_h3.font.size = Pt(13)
    r_h3.font.color.rgb = PRIMARY_BLUE

    chapters = [
        {
            "id": "BAB 1",
            "time": "00:00 - 00:25 (25 Detik)",
            "title": "Pendahuluan & Dilema Fenomena Gunung Es (Dark Number)",
            "visual": [
                "Buka laman utama https://ruang.rapsdev.web.id.",
                "Scroll halus menyoroti statistik darurat: 573 kasus lonjakan KPAI, 11.291 aduan nasional, dan 85% korban memilih diam.",
                "Arahkan kursor ke perbandingan: 'Janji Kebijakan vs Jaminan Matematis'."
            ],
            "narration": (
                "\"Assalamualaikum warahmatullahi wabarakatuh, selamat pagi dewan juri yang terhormat dan rekan-rekan sekalian.\n\n"
                "Sepanjang tahun 2024, KPAI dan JPPI mencatat lebih dari 11 ribu aduan kekerasan anak dengan lonjakan tajam kasus di lingkungan pendidikan. "
                "Namun angka ini hanyalah puncak dari fenomena gunung es.\n\n"
                "Faktanya, lebih dari 85% korban dan saksi perundungan memilih bungkam. Mengapa? Bukan karena mereka tidak ingin melapor, "
                "melainkan karena dibayangi ketakutan akan intimidasi balasan dan keraguan atas kerahasiaan identitas mereka.\n\n"
                "Selama ini, kanal aduan konvensional hanya menjanjikan privasi berbasis etika pengelola. Padahal di belakang layar, alamat IP, akun email, "
                "nomor WhatsApp, dan jejak digital siswa tetap terekam di server.\n\n"
                "Inilah alasan kami membangun RUANG AMAN—ekosistem pencegahan dan penanganan kekerasan sekolah pertama di Indonesia yang mengonversi "
                "'janji etika' menjadi 'jaminan matematis' menggunakan Zero-Knowledge Proof.\""
            ),
            "legal": "Permendikbudristek No. 46 Tahun 2023 mewajibkan mekanisme pengaduan ramah anak yang menjamin kerahasiaan identitas saksi dan korban."
        },
        {
            "id": "BAB 2",
            "time": "00:25 - 01:00 (35 Detik)",
            "title": "Inovasi ZKP & Persiapan Sekolah: Guru BK Generate Batch Token",
            "visual": [
                "Beralih ke konsol Guru BK / Satgas PPKSP (guru.bk@sekolah.sch.id).",
                "Buka tab 'Kelola Token Anonim'.",
                "Masukkan jumlah token: 25, pilih rombel: Kelas X, dan custom prefix: SCH-X1-.",
                "Klik tombol 'Generate Token' (Tunjukkan notifikasi sukses 'Berhasil membuat 25 token untuk Kelas X' dan token baru muncul di tabel).",
                "Klik tombol 'Salin' pada salah satu token (SCH-X1-8831) atau tunjukkan modal 'Cetak Slip Token Siswa' untuk distribusi acak."
            ],
            "narration": (
                "\"Lalu bagaimana sistem memastikan hanya siswa sah yang melapor tanpa mengorbankan privasi mereka?\n\n"
                "Alur dimulai dari Satgas PPKSP sekolah. Di dashboard Guru BK, sekolah menerbitkan kumpulan token akses anonim secara batch per tingkatan kelas.\n\n"
                "Token-token ini dicetak dalam bentuk slip fisik acak atau dibagikan secara blind distribution ke seluruh siswa di kelas tanpa mencatat siapa mendapatkan kode apa. "
                "Sekolah pun tidak pernah tahu siswa mana yang memegang token nomor berapa!\n\n"
                "Dengan protokol Semaphore dan Poseidon Hash, token ini menjadi tiket keanggotaan Merkle Tree sekolah. Siswa dapat membuktikan hak lapornya secara sah "
                "tanpa sekolah mengetahui identitas pribadinya—menerapkan prinsip Zero Identity Storage mutlak.\""
            ),
            "legal": "Distribusi slip token secara acak (blind distribution) memutus korelasi identitas siswa sejak tahap awal pendaftaran."
        },
        {
            "id": "BAB 3",
            "time": "01:00 - 01:45 (45 Detik)",
            "title": "Demo Siswa — Pelaporan dengan Token, Sensor AI PII, & Komputasi ZKP",
            "visual": [
                "Beralih ke antarmuka siswa (klik 'Lapor Anonim' di Navbar).",
                "Masukkan Token Sekolah yang baru saja digenerate: SCH-X1-8831 lalu klik Verifikasi.",
                "Buat Sandi Pelajar: siswa2026 lalu klik Simpan Sandi & Buka Formulir.",
                "Pilih kategori 'Perundungan / Bullying'. Ketik cerita: 'Saya Budi Santoso dari kelas X-1 mengalami pemalakan di kantin belakang. Hubungi saya di 081234567890.'",
                "Klik tombol 'Samarkan PII Otomatis' (Tunjukkan teks sensitif berubah menjadi tag sensor otomatis secara instan).",
                "Input PIN Pemulihan: 7890, centang persetujuan, lalu klik 'Kirim Laporan Terenkripsi'.",
                "Tunjukkan Web Worker memproses ZKP dalam 2,4 detik dan menerbitkan Nomor Tiket TMG-2026-XXXX."
            ],
            "narration": (
                "\"Sekarang, mari kita posisikan diri sebagai siswa bernama Rani yang memegang slip token tersebut.\n\n"
                "Rani membuka web Ruang Aman di ponselnya, memasukkan token SCH-X1-8831, dan membuat sandi rahasia pribadi yang hanya diketahui dirinya sendiri. "
                "Tanpa registrasi email, tanpa nomor handphone.\n\n"
                "Ketika menuliskan kronologi peristiwa, seringkali siswa tanpa sadar menyebutkan nama lengkap, kelas, atau nomor kontak. RUANG AMAN dilengkapi fitur cerdas "
                "Client-Side PII Stripper. Hanya dengan satu klik, mesin kami secara instan mendeteksi dan menyamarkan data pribadi tersebut langsung di browser sebelum data apapun keluar dari perangkat!\n\n"
                "Rani kemudian memasukkan 4-digit PIN rahasia untuk akses darurat. Saat tombol kirim ditekan, Web Worker di latar belakang menghitung bukti kriptografi Zero-Knowledge Proof "
                "dalam waktu kurang dari 3 detik! Laporan terenkripsi dikirim dan diterbitkanlah Nomor Tiket unik beserta Kunci Pemulihan rahasia.\""
            ),
            "legal": "Komputasi ZKP sisi klien menjamin data mentah dan identitas tidak pernah meninggalkan peramban siswa."
        },
        {
            "id": "BAB 4",
            "time": "01:45 - 02:10 (25 Detik)",
            "title": "Tiket Asimetris & Kiosk Camouflage Escape (Perlindungan Fisik ESC 2x)",
            "visual": [
                "Buka menu 'Pantau Tiket'. Masukkan nomor tiket TMG-2025-78A1 lalu klik Periksa.",
                "Tunjukkan linimasa investigasi dan fitur chat dua arah yang terenkripsi.",
                "AKSI DRAMATIS: Tekan tombol ESC 2 kali secara cepat.",
                "Layar seketika bermutasi menjadi modul latihan soal Matematika dan Fisika lengkap dengan timer.",
                "Klik tombol pojok untuk kembali ke aplikasi."
            ],
            "narration": (
                "\"Dengan Nomor Tiket dan sandi rahasia, siswa dapat memantau perkembangan kasus dan melakukan dialog chat dua arah dengan Guru BK secara aman melalui enkripsi asimetris.\n\n"
                "Namun perlindungan digital saja tidak cukup jika keamanan fisik terancam. Bayangkan jika siswa sedang melapor di komputer laboratorium sekolah atau warnet, "
                "lalu pelaku perundungan atau orang asing tiba-tiba menghampiri?\n\n"
                "Kami menghadirkan fitur revolusioner: Camouflage Escape. Siswa cukup menekan tombol ESC dua kali, dan dalam waktu 0,1 detik—tanpa reload halaman—layar "
                "seketika berubah menjadi modul latihan soal Matematika dan Fisika akademik! Privasi fisik terlindungi secara instan dari bahaya shoulder surfing.\""
            ),
            "legal": "Mitigasi bahaya intimidasi langsung di ruang fisik satuan pendidikan melalui antarmuka kamuflase instan."
        },
        {
            "id": "BAB 5",
            "time": "02:10 - 02:45 (35 Detik)",
            "title": "Dashboard Multi-Peran & Kolaborasi Lintas Lembaga Terpadu",
            "visual": [
                "Beralih kembali ke peran Guru BK (guru.bk@sekolah.sch.id). Buka tiket laporan, tunjukkan kolom triase urgensi, catatan internal, lalu klik 'Cetak BAP Digital'.",
                "Beralih ke portal Dinas Pendidikan (h.hendro@disdik.prov.go.id). Tunjukkan heatmap kerawanan wilayah, SLA respon 4,2 jam, dan tombol kirim Nota Supervisi.",
                "Beralih ke portal UPTD PPA (sri.rahayu@uptd-ppa.go.id). Tunjukkan disposisi psikolog klinis, bantuan hukum, dan safehouse."
            ],
            "narration": (
                "\"RUANG AMAN bukan sekadar kotak pengaduan, melainkan ekosistem penanganan terpadu.\n\n"
                "Di sisi satuan pendidikan, Guru BK dan Satgas PPKSP menerima laporan terklasifikasi berdasarkan tingkat urgensi. Guru BK dapat membalas pesan siswa, "
                "mencatat investigasi tertutup, dan mengunduh draft Berita Acara Pemeriksaan (BAP) Digital yang 100% selaras dengan regulasi Permendikbudristek 46/2023.\n\n"
                "Beralih ke tingkat wilayah, Dinas Pendidikan memantau indeks kerawanan sekolah dan kecepatan respon Satgas tanpa melanggar privasi kasus individual. "
                "Dinas dapat langsung mengirimkan nota supervisi resmi jika ada sekolah yang lambat merespon.\n\n"
                "Dan untuk kasus kekerasan berat atau kekerasan seksual anak, sistem terintegrasi langsung dengan portal UPTD PPA untuk disposisi psikolog klinis, "
                "pendampingan hukum, hingga penyediaan rumah aman.\""
            ),
            "legal": "Implementasi kolaboratif lintas sektor sesuai mandat UU No. 12 Tahun 2022 (UU TPKS) dan tata kelola PPKSP terpadu."
        },
        {
            "id": "BAB 6",
            "time": "02:45 - 03:00 (15 Detik)",
            "title": "Validasi Empiris Usabilitas (SUS 86,4 / Grade A+) & Penutup",
            "visual": [
                "Kembali ke beranda utama atau slide penutup.",
                "Sorot skor System Usability Scale (SUS) 86,4 / Grade A+ (Exceptional).",
                "Tunjukkan alamat repositori GitHub dan domain produksi live."
            ],
            "narration": (
                "\"Platform RUANG AMAN telah diuji coba secara empiris melibatkan siswa, guru bimbingan konseling, dan satgas dengan perolehan skor "
                "System Usability Scale sebesar 86,4 atau predikat Grade A+ (Exceptional).\n\n"
                "Aplikasi ini telah berstatus production-ready, dideploy secara global di ruang.rapsdev.web.id, dan seluruh kodenya bersifat open source.\n\n"
                "Mari bersama kita hapus rasa takut, tegakkan keadilan, dan wujudkan sekolah yang aman, nyaman, dan inklusif bagi seluruh anak Indonesia. "
                "Suaramu berarti, kami siap melindungi.\n\n"
                "Wassalamualaikum warahmatullahi wabarakatuh. Terima kasih.\""
            ),
            "legal": "Validasi usabilitas berstandar ilmiah internasional membuktikan kesiapan adopsi teknologi di kalangan pelajar dan tenaga pendidik."
        }
    ]

    for chap in chapters:
        # Chapter Title Box
        ch_p = doc.add_paragraph()
        ch_p.paragraph_format.space_before = Pt(14)
        ch_p.paragraph_format.space_after = Pt(2)
        r_cp1 = ch_p.add_run(f"[{chap['id']}]  {chap['time']}\n")
        r_cp1.bold = True
        r_cp1.font.size = Pt(10)
        r_cp1.font.color.rgb = ACCENT_GREEN
        
        r_cp2 = ch_p.add_run(chap['title'])
        r_cp2.bold = True
        r_cp2.font.size = Pt(12)
        r_cp2.font.color.rgb = NAVY_HEADER

        # Content Table: Visual vs Speech
        table = doc.add_table(rows=3, cols=2)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        table.columns[0].width = Inches(2.2)
        table.columns[1].width = Inches(4.3)

        # Header
        h_row = table.rows[0]
        h_row.cells[0].paragraphs[0].add_run("Panduan Visual & Interaksi Layar").bold = True
        h_row.cells[0].paragraphs[0].runs[0].font.size = Pt(8.5)
        h_row.cells[0].paragraphs[0].runs[0].font.color.rgb = WHITE
        set_cell_shading(h_row.cells[0], "1E40AF")
        
        h_row.cells[1].paragraphs[0].add_run("Naskah Lisan Pembicara (Verbatim Narration)").bold = True
        h_row.cells[1].paragraphs[0].runs[0].font.size = Pt(8.5)
        h_row.cells[1].paragraphs[0].runs[0].font.color.rgb = WHITE
        set_cell_shading(h_row.cells[1], "1E40AF")

        # Body
        b_row = table.rows[1]
        set_cell_shading(b_row.cells[0], "F8FAFC")
        set_cell_shading(b_row.cells[1], "FFFFFF")

        # Visual items
        vp = b_row.cells[0].paragraphs[0]
        vp.paragraph_format.space_before = Pt(2)
        vp.paragraph_format.space_after = Pt(2)
        for idx, item in enumerate(chap['visual'], 1):
            vr = vp.add_run(f"{idx}. {item}\n\n")
            vr.font.size = Pt(8)
            vr.font.color.rgb = TEXT_DARK

        # Narration
        np = b_row.cells[1].paragraphs[0]
        np.paragraph_format.space_before = Pt(2)
        np.paragraph_format.space_after = Pt(2)
        nr = np.add_run(chap['narration'])
        nr.font.size = Pt(8.5)
        nr.font.color.rgb = TEXT_DARK
        nr.italic = True

        # Footer Row (Legal / Key insight)
        f_row = table.rows[2]
        set_cell_shading(f_row.cells[0], "F1F5F9")
        set_cell_shading(f_row.cells[1], "F1F5F9")
        
        fp0 = f_row.cells[0].paragraphs[0]
        fr0 = fp0.add_run("Poin Kunci & Regulasi")
        fr0.bold = True
        fr0.font.size = Pt(8)
        fr0.font.color.rgb = TEXT_MUTED
        
        fp1 = f_row.cells[1].paragraphs[0]
        fr1 = fp1.add_run(chap['legal'])
        fr1.font.size = Pt(8)
        fr1.font.color.rgb = PRIMARY_BLUE

        for r in table.rows:
            for c in r.cells:
                set_cell_border(c, top={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                                   bottom={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                                   left={'sz': '4', 'color': 'E2E8F0', 'val': 'single'},
                                   right={'sz': '4', 'color': 'E2E8F0', 'val': 'single'})

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # SECTION 4: Q&A DEFENSE GUIDE
    doc.add_page_break()

    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(0)
    h4.paragraph_format.space_after = Pt(6)
    r_h4 = h4.add_run("4. Panduan Pertahanan Tanya-Jawab Dewan Juri (Q&A Defense Guide)")
    r_h4.bold = True
    r_h4.font.size = Pt(13)
    r_h4.font.color.rgb = PRIMARY_BLUE

    qas = [
        ("Q1: Bagaimana cara siswa mendapatkan token dan bagaimana mencegah guru tahu pemilik token tersebut?",
         "Satgas sekolah menerbitkan token secara batch per angkatan/kelas dan mencetaknya dalam bentuk slip kartu fisik acak. "
         "Slip dibagikan di kelas secara blind distribution (seperti membagikan kertas ulangan tertutup secara acak tanpa presensi nama). "
         "Guru tidak mencatat token X diberikan ke siswa Y. Bahkan jika guru mencoba melacak, token tersebut baru diaktifkan saat siswa memasukkan kata sandi pribadi yang hanya ada di kepala siswa. "
         "Sehingga keterkaitan identitas terputus sejak detik pertama."),

        ("Q2: Jika pelapor 100% anonim, bagaimana cara sistem mencegah laporan palsu/hoaks jika pelapor 100% anonim?",
         "Kami menerapkan sistem pertahanan berlapis (Two-Layer Anti-Sybil Defense):\n"
         "1. Secara teknis, siswa wajib memiliki bukti keanggotaan dalam Merkle Tree Sekolah melalui token akses berkala. Pihak dari luar sekolah tidak dapat melakukan injeksi laporan ke sistem sekolah tersebut.\n"
         "2. Kedua, arsitektur ZKP Semaphore kami menggunakan Nullifier Hash. Sistem membatasi frekuensi pelaporan berulang dari entitas bukti yang sama dalam jeda waktu tertentu untuk mencegah spamming/DDoS tanpa perlu mengidentifikasi pelapor.\n"
         "3. Setiap laporan yang masuk tetap melalui tahapan klarifikasi dan triase awal oleh Satgas PPKSP sekolah sebelum tindakan formal diambil, sesuai amanat Pasal 40 Permendikbudristek 46/2023."),
        
        ("Q3: Mengapa harus menggunakan ZKP? Apakah tidak cukup dengan fitur 'Lapor Tanpa Nama' biasa?",
         "Fitur 'lapor tanpa nama' konvensional hanya bersifat pseudo-anonymous (anonim semu). Secara teknis, server web dan penyedia hosting tetap mencatat alamat IP pengirim, User-Agent browser, timestamp request, dan alamat email jika terhubung dengan akun.\n"
         "Jika terjadi insiden kebocoran data (data breach) atau penyitaan server oleh pihak tidak berwenang, identitas siswa rentan terbongkar.\n"
         "Dengan Zero-Knowledge Proof, server kami bahkan tidak memiliki data apapun mengenai identitas pelapor. Privasi dijamin secara matematis, bukan sekadar janji kebijakan."),
        
        ("Q4: Bagaimana jika siswa kehilangan Nomor Tiket dan Sandi Rahasianya?",
         "RUANG AMAN menyediakan mekanisme Dual Verification Key Recovery. Selain kode tiket standar, siswa dapat memulihkan akses menggunakan PIN 4-digit darurat yang dipadukan dengan kata sandi pribadinya saat token diverifikasi.\n"
         "Jika kedua kunci tersebut hilang total, demi alasan keamanan kriptografi zero-knowledge, data tidak dapat dibuka kembali oleh siapapun untuk mencegah pembajakan tiket oleh pihak ketiga."),
        
        ("Q5: Apakah komputasi ZKP di browser memberatkan ponsel atau laptop siswa yang berspesifikasi rendah?",
         "Tidak memberatkan. Kami menggunakan algoritma hash Poseidon yang dirancang khusus untuk efisiensi sirkuit aritmatika ZKP, dikombinasikan dengan eksekusi di latar belakang via HTML5 Web Worker.\n"
         "Berdasarkan pengujian performa kami di berbagai perangkat low-end (termasuk smartphone dengan RAM 3GB), proses pembuatan proof tuntas dalam waktu rata-rata 2,4 detik dengan konsumsi memori di bawah 45MB."),
        
        ("Q6: Bagaimana integrasi sistem ini dengan instansi resmi seperti UPTD PPA atau kepolisian?",
         "Sesuai amanat UU No. 12 Tahun 2022 (UU TPKS) dan Permendikbudristek 46/2023, kasus kekerasan anak yang masuk kategori sedang hingga berat wajib dilaporkan ke UPTD PPA.\n"
         "Di RUANG AMAN, Satgas sekolah dapat menekan tombol 'Eskalasi ke UPTD PPA'. Data kasus beserta Berita Acara terenkripsi otomatis diteruskan ke portal UPTD PPA provinsi/kota untuk segera diterbitkan surat tugas pendampingan psikolog klinis, bantuan hukum gratis, maupun evakuasi ke safehouse.")
    ]

    for q, a in qas:
        p_q = doc.add_paragraph()
        p_q.paragraph_format.space_before = Pt(8)
        p_q.paragraph_format.space_after = Pt(2)
        rq = p_q.add_run(q)
        rq.bold = True
        rq.font.size = Pt(9.5)
        rq.font.color.rgb = PRIMARY_BLUE

        p_a = doc.add_paragraph()
        p_a.paragraph_format.space_before = Pt(0)
        p_a.paragraph_format.space_after = Pt(6)
        p_a.paragraph_format.left_indent = Inches(0.15)
        ra = p_a.add_run(a)
        ra.font.size = Pt(9)
        ra.font.color.rgb = TEXT_DARK

    # Output path
    output_path = Path("/home/arrafi/lomba/ruang/NASKAH_DEMO_RUANG_AMAN.docx")
    doc.save(str(output_path))
    print(f"✅ Berhasil membuat dokumen DOCX di: {output_path}")

if __name__ == "__main__":
    main()
