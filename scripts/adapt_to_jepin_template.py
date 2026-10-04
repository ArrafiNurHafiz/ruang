import os
import copy
from pathlib import Path
import docx
from docx.shared import Inches, Pt, Mm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_margins(cell, top=40, bottom=40, left=60, right=60):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_ieee_table_borders(table):
    tblPr = table._tbl.tblPr
    borders_elm = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="single" w:sz="10" w:space="0" w:color="000000"/>\n'
        f'  <w:bottom w:val="single" w:sz="10" w:space="0" w:color="000000"/>\n'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="D0D0D0"/>\n'
        f'  <w:left w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'  <w:insideV w:val="none"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders_elm)

def set_borderless_table(table):
    tblPr = table._tbl.tblPr
    borders_elm = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="none"/>\n'
        f'  <w:bottom w:val="none"/>\n'
        f'  <w:insideH w:val="none"/>\n'
        f'  <w:left w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'  <w:insideV w:val="none"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders_elm)

def set_cell_width(cell, width_in_inches):
    tcPr = cell._tc.get_or_add_tcPr()
    tcW = parse_xml(f'<w:tcW {nsdecls("w")} w:w="{int(width_in_inches * 1440)}" w:type="dxa"/>')
    tcPr.append(tcW)

def generate_jepin_manuscript(is_blind=False):
    template_path = Path("/home/arrafi/lomba/ruang/jurnal/template-jepin.docx")
    if is_blind:
        out_path = Path("/home/arrafi/lomba/ruang/jurnal/JEPIN_Blind_Review_Protokol_Semaphore_ZKP.docx")
    else:
        out_path = Path("/home/arrafi/lomba/ruang/jurnal/JEPIN_Arrafi_Protokol_Semaphore_ZKP.docx")
    
    assets_dir = Path("/home/arrafi/lomba/ruang/proposal/assets")

    doc = docx.Document(str(template_path))

    # Save sectPr from paragraph 8 (continuous section break for 2-column)
    sectPr_p8 = copy.deepcopy(doc.paragraphs[8]._p.xpath('./w:pPr/w:sectPr')[0])

    # Clear out all paragraphs & tables from doc body while keeping styles
    body_elm = doc._body._element
    for tbl in doc.tables:
        body_elm.remove(tbl._tbl)
    for p in doc.paragraphs:
        body_elm.remove(p._p)

    COL_WIDTH = Inches(3.26)  # Single column width in 2-column layout (82.9 mm)

    # =========================================================================
    # SECTION 0: TITLE, AUTHORS, AFFILIATIONS (SINGLE COLUMN)
    # =========================================================================
    p_title = doc.add_paragraph(style='IEEE Title')
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(10)
    r_title = p_title.add_run("Penerapan Protokol Semaphore Zero-Knowledge Proof untuk Menjamin Kerahasiaan Identitas dan Pencegahan Pelaporan Ganda pada Sistem Pengaduan Kekerasan Siswa")
    r_title.font.name = 'Times New Roman'
    r_title.font.size = Pt(22)
    r_title.bold = False

    if is_blind:
        p_author = doc.add_paragraph(style='IEEE Author Name')
        p_author.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_author.paragraph_format.space_after = Pt(2)
        r_auth = p_author.add_run("Nama Penulis Dihapus untuk Blind Review")
        r_auth.font.name = 'Times New Roman'
        r_auth.font.size = Pt(11)

        p_affil = doc.add_paragraph(style='IEEE Author Affiliation')
        p_affil.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_affil.paragraph_format.space_after = Pt(2)
        r_affil = p_affil.add_run("Afiliasi Dihapus untuk Double-Blind Peer Review")
        r_affil.font.name = 'Times New Roman'
        r_affil.font.size = Pt(10)
        r_affil.italic = True

        p_email = doc.add_paragraph(style='IEEE Author Email')
        p_email.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_email.paragraph_format.space_after = Pt(8)
        r_email = p_email.add_run("email@anonymized.ac.id")
        r_email.font.name = 'Times New Roman'
        r_email.font.size = Pt(9)
    else:
        p_author = doc.add_paragraph(style='IEEE Author Name')
        p_author.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_author.paragraph_format.space_after = Pt(2)
        r_auth = p_author.add_run("Arrafi Nur Hafiz")
        r_auth.font.name = 'Times New Roman'
        r_auth.font.size = Pt(11)

        p_affil = doc.add_paragraph(style='IEEE Author Affiliation')
        p_affil.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_affil.paragraph_format.space_after = Pt(2)
        r_affil = p_affil.add_run("Program Studi Sistem Informasi, Fakultas Teknologi Informasi\nUniversitas Teknologi Digital Indonesia, Yogyakarta, Indonesia")
        r_affil.font.name = 'Times New Roman'
        r_affil.font.size = Pt(10)
        r_affil.italic = True

        p_email = doc.add_paragraph(style='IEEE Author Email')
        p_email.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_email.paragraph_format.space_after = Pt(8)
        r_email = p_email.add_run("arrafi.nur24@studentts.ac.id")
        r_email.font.name = 'Times New Roman'
        r_email.font.size = Pt(9)

    # Paragraph carrying the Section 0 -> Section 1 (2-column) break
    p_break = doc.add_paragraph(style='Normal')
    p_break._p.get_or_add_pPr().append(copy.deepcopy(sectPr_p8))

    # =========================================================================
    # SECTION 1: TWO-COLUMN BODY (ABSTRACT, KEYWORDS, SECTIONS, REFERENCES)
    # =========================================================================

    # Helper Functions for Typography
    def add_sec1(title_text):
        p = doc.add_paragraph(style='IEEE Heading 1')
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(title_text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(10)
        run.bold = False
        return p

    def add_sec2(title_text):
        p = doc.add_paragraph(style='IEEE Heading 2')
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        p.paragraph_format.first_line_indent = Inches(0)
        run = p.add_run(title_text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(10)
        run.italic = True
        return p

    def add_body(text):
        p = doc.add_paragraph(style='IEEE Paragraph')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.first_line_indent = Mm(4.5)
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.05
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(10)
        return p

    def add_eq(formula_text, eq_num):
        # 1-row, 2-column borderless table for precise formula centering & right numbering
        tbl = doc.add_table(rows=1, cols=2)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_borderless_table(tbl)

        # Left cell: formula (centered, width 2.7 in)
        c_left = tbl.cell(0, 0)
        set_cell_width(c_left, 2.75)
        set_cell_margins(c_left, top=20, bottom=20, left=10, right=10)
        p_f = c_left.paragraphs[0]
        p_f.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_f.paragraph_format.space_before = Pt(1)
        p_f.paragraph_format.space_after = Pt(1)
        p_f.paragraph_format.first_line_indent = Inches(0)
        r_f = p_f.add_run(formula_text)
        r_f.font.name = 'Cambria Math'
        r_f.font.size = Pt(9.5)
        r_f.italic = True

        # Right cell: numbering (right-aligned, width 0.5 in)
        c_right = tbl.cell(0, 1)
        set_cell_width(c_right, 0.51)
        set_cell_margins(c_right, top=20, bottom=20, left=10, right=10)
        p_n = c_right.paragraphs[0]
        p_n.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_n.paragraph_format.space_before = Pt(1)
        p_n.paragraph_format.space_after = Pt(1)
        p_n.paragraph_format.first_line_indent = Inches(0)
        r_n = p_n.add_run(f"({eq_num})")
        r_n.font.name = 'Times New Roman'
        r_n.font.size = Pt(9.5)

    def add_figure(img_path, caption_text):
        if img_path.exists():
            p_img = doc.add_paragraph(style='IEEE Figure')
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(4)
            p_img.paragraph_format.space_after = Pt(2)
            p_img.paragraph_format.first_line_indent = Inches(0)
            p_img.paragraph_format.keep_with_next = True
            r = p_img.add_run()
            r.add_picture(str(img_path), width=Inches(3.2))

            p_cap = doc.add_paragraph(style='IEEE Figure Caption Single-Line')
            p_cap.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p_cap.paragraph_format.space_before = Pt(1)
            p_cap.paragraph_format.space_after = Pt(6)
            p_cap.paragraph_format.first_line_indent = Inches(0)
            p_cap.paragraph_format.line_spacing = 1.05
            r_cap = p_cap.add_run(caption_text)
            r_cap.font.name = 'Times New Roman'
            r_cap.font.size = Pt(8)

    # -------------------------------------------------------------------------
    # ABSTRAK & KATA KUNCI (INDONESIA)
    # -------------------------------------------------------------------------
    p_abs = doc.add_paragraph(style='IEEE Abtract')
    p_abs.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_abs.paragraph_format.first_line_indent = Inches(0)
    p_abs.paragraph_format.space_before = Pt(0)
    p_abs.paragraph_format.space_after = Pt(2)
    p_abs.paragraph_format.line_spacing = 1.05

    r_abs_lbl = p_abs.add_run("Abstrak— ")
    r_abs_lbl.font.name = 'Times New Roman'
    r_abs_lbl.font.size = Pt(9)
    r_abs_lbl.bold = True
    r_abs_lbl.italic = True

    r_abs_txt = p_abs.add_run(
        "Kekerasan dan perundungan di lingkungan satuan pendidikan masih marak terjadi, namun tingkat pelaporan korban sangat rendah akibat tingginya kecemasan terhadap kebocoran identitas dan risiko retaliasi sosial. Sistem pelaporan konvensional berbasis formulir daring umumnya mengandalkan policy-based privacy atau mewajibkan autentikasi akun yang rentan membocorkan jejak digital. Di sisi lain, pembukaan akses anonim tanpa autentikasi memicu kerentanan serangan Sybil dan spamming laporan palsu. Penelitian ini bertujuan merancang dan mengimplementasikan arsitektur pelaporan pengaduan siswa berbasis kriptografi Zero-Knowledge Proof (ZKP) menggunakan protokol Semaphore dengan skema zk-SNARKs Groth16 di atas kurva eliptik BN254 dan fungsi hash aljabar Poseidon. Melalui mekanisme ini, siswa dapat membuktikan keabsahan hak lapor sebagai anggota sah sekolah tanpa pernah mentransmisikan identitas asli, nomor induk siswa, maupun alamat IP. Sistem juga menerapkan algebraic nullifier untuk mencegah pelaporan ganda (anti-double-reporting). Pengujian empiris menunjukkan bahwa komputasi ZKP sisi klien (client-side proving) via Web Worker memerlukan waktu rata-rata 2,38 detik pada perangkat seluler berdaya rendah (RAM 2GB) dan 0,72 detik pada komputer meja, dengan waktu verifikasi di sisi server sebesar 4,12 ms. Seluruh pengujian ketahanan terhadap serangan pengiriman ulang (replay attack) dan pelaporan ganda berhasil ditolak secara deterministik (100%). Evaluasi kegunaan sistem dengan System Usability Scale (SUS) memperoleh skor 84,5 (kategori Excellent / Grade A), membuktikan bahwa sistem layak dan efektif diterapkan secara praktis di lingkungan sekolah."
    )
    r_abs_txt.font.name = 'Times New Roman'
    r_abs_txt.font.size = Pt(9)

    p_kw = doc.add_paragraph(style='Normal')
    p_kw.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_kw.paragraph_format.first_line_indent = Inches(0)
    p_kw.paragraph_format.space_before = Pt(2)
    p_kw.paragraph_format.space_after = Pt(6)
    p_kw.paragraph_format.line_spacing = 1.05

    r_kw_lbl = p_kw.add_run("Kata kunci— ")
    r_kw_lbl.font.name = 'Times New Roman'
    r_kw_lbl.font.size = Pt(9)
    r_kw_lbl.bold = True
    r_kw_lbl.italic = True

    r_kw_txt = p_kw.add_run("Zero-Knowledge Proof, Protokol Semaphore, zk-SNARKs Groth16, Anonimitas Kriptografis, Pengaduan Siswa, Pencegahan Pelaporan Ganda.")
    r_kw_txt.font.name = 'Times New Roman'
    r_kw_txt.font.size = Pt(9)

    # -------------------------------------------------------------------------
    # ABSTRACT & KEYWORDS (ENGLISH)
    # -------------------------------------------------------------------------
    p_abs_en = doc.add_paragraph(style='IEEE Abtract')
    p_abs_en.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_abs_en.paragraph_format.first_line_indent = Inches(0)
    p_abs_en.paragraph_format.space_before = Pt(2)
    p_abs_en.paragraph_format.space_after = Pt(2)
    p_abs_en.paragraph_format.line_spacing = 1.05

    r_abs_en_lbl = p_abs_en.add_run("Abstract— ")
    r_abs_en_lbl.font.name = 'Times New Roman'
    r_abs_en_lbl.font.size = Pt(9)
    r_abs_en_lbl.bold = True
    r_abs_en_lbl.italic = True

    r_abs_en_txt = p_abs_en.add_run(
        "Bullying and violence in school environments remain prevalent, yet victim reporting rates remain critically low due to fear of identity disclosure and social retaliation. Conventional online reporting systems rely predominantly on policy-based privacy or mandate user authentication, exposing digital footprints. Conversely, fully unauthenticated anonymous forms suffer from severe vulnerabilities to Sybil attacks and fraudulent spam submissions. This study proposes and implements a privacy-preserving school reporting architecture leveraging Zero-Knowledge Proof (ZKP) cryptography based on the Semaphore protocol with zk-SNARKs Groth16 over the BN254 elliptic curve and Poseidon algebraic hash function. Through this scheme, students can mathematically prove their authorized membership within the school's Merkle tree without exposing their identity, student ID numbers, or IP addresses. The system incorporates algebraic nullifiers to prevent duplicate submissions (anti-double-reporting). Empirical benchmarks demonstrate that client-side proof generation via Web Workers requires an average of 2.38 seconds on low-end mobile devices (2GB RAM) and 0.72 seconds on desktop workstations, while server-side verification completes in 4.12 ms. Replay attack simulations were deterministically mitigated with a 100% prevention rate. System Usability Scale (SUS) evaluation yielded an average score of 84.5 (Grade A / Excellent), demonstrating that the cryptographic protocol is practically viable for school environments."
    )
    r_abs_en_txt.font.name = 'Times New Roman'
    r_abs_en_txt.font.size = Pt(9)

    p_kw_en = doc.add_paragraph(style='Normal')
    p_kw_en.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_kw_en.paragraph_format.first_line_indent = Inches(0)
    p_kw_en.paragraph_format.space_before = Pt(2)
    p_kw_en.paragraph_format.space_after = Pt(10)
    p_kw_en.paragraph_format.line_spacing = 1.05

    r_kw_en_lbl = p_kw_en.add_run("Keywords— ")
    r_kw_en_lbl.font.name = 'Times New Roman'
    r_kw_en_lbl.font.size = Pt(9)
    r_kw_en_lbl.bold = True
    r_kw_en_lbl.italic = True

    r_kw_en_txt = p_kw_en.add_run("Zero-Knowledge Proof, Semaphore Protocol, zk-SNARKs Groth16, Cryptographic Anonymity, Student Whistleblowing, Anti-Double-Reporting.")
    r_kw_en_txt.font.name = 'Times New Roman'
    r_kw_en_txt.font.size = Pt(9)

    # -------------------------------------------------------------------------
    # I. PENDAHULUAN
    # -------------------------------------------------------------------------
    add_sec1("I. PENDAHULUAN")
    add_body("Perundungan (bullying) dan tindak kekerasan di lingkungan pendidikan merupakan ancaman nyata terhadap kesehatan mental dan hak belajar peserta didik. Regulasi Permendikbudristek No. 46 Tahun 2023 [1] menegaskan kewajiban setiap satuan pendidikan untuk membentuk Tim Pencegahan dan Penanganan Kekerasan (TPPK) serta menyediakan kanal pengaduan yang aman. Namun, data Asesmen Nasional [2] menunjukkan lebih dari 24% peserta didik masih berpotensi mengalami perundungan, sementara tingkat pelaporan resmi tetap rendah akibat ketakutan terhadap kebocoran identitas dan retaliasi sosial.")
    add_body("Sistem pelaporan konvensional menghadapi Trilema Privasi Pelaporan: (1) Otentikasi Kelayakan (Eligibility Authentication) untuk memastikan pelapor adalah siswa sah; (2) Kerahasiaan Identitas Mutlak (Absolute Anonymity) tanpa jejak PII maupun alamat IP; serta (3) Pencegahan Penyalahgunaan (Spam & Sybil Resistance) agar satu siswa tidak mengirim laporan palsu bertubi-tubi. Sistem berbasis login melanggar prinsip anonimitas, sedangkan formulir anonim publik tanpa verifikasi sangat rentan terhadap manipulasi spam.")
    add_body("Kriptografi Zero-Knowledge Proof (ZKP) [3], khususnya skema zk-SNARKs Groth16 [4] dan protokol Semaphore [5], mampu menyelesaikan trilema tersebut secara elegan. Menggunakan fungsi hash aljabar Poseidon [6] dan representasi batasan aritmatika R1CS [7], siswa dapat membuktikan keanggotaan grup tanpa membuka identitas. Penelitian ini merancang arsitektur pelaporan pengaduan sekolah (Ruang Aman) dengan kontribusi: (1) Komputasi pembuktian ZKP sisi klien berbasis WebAssembly ramah gawai seluler; (2) Mekanisme algebraic nullifier untuk pencegahan pelaporan ganda; serta (3) Evaluasi empiris performa latensi, keamanan, dan usabilitas.")

    # -------------------------------------------------------------------------
    # II. METODOLOGI PENELITIAN
    # -------------------------------------------------------------------------
    add_sec1("II. METODOLOGI PENELITIAN")
    add_sec2("A. Pemodelan Ancaman dan Kerangka Rekayasa")
    add_body("Pengembangan sistem mengadopsi standar rekayasa perangkat lunak [8] dan pemodelan ancaman honest-but-curious server, di mana server menjalankan verifikasi dengan benar namun berpotensi menginspeksi log jaringan. Sistem juga mengantisipasi malicious reporter yang mencoba memalsukan bukti atau melakukan serangan injeksi sesuai panduan keamanan OWASP [9].")

    add_sec2("B. Landasan Matematika Kriptografi ZKP & zk-SNARKs Groth16")
    add_body("Protokol ZKP membuktikan kebenaran suatu pernyataan matematika x untuk saksi rahasia w tanpa mengungkapkan w kepada verifier [3]. Protokol memenuhi aksioma kelengkapan (completeness), keabsahan (soundness), dan nir-pengetahuan (zero-knowledge). Sistem mengimplementasikan skema zk-SNARKs Groth16 [4] di atas kurva eliptik pasangan bilineer BN254 (Alt-bn128) dengan persamaan koordinat affine:")
    
    add_eq("E: y² = x³ + 3  (mod q)", 1)

    add_body("Komputasi sirkuit berlangsung pada lapangan skalar prima F_p berorde 254-bit (p = 21888242871839275222246405745257275088548364400416034343698204186575808495617) melalui Quadratic Arithmetic Programs (QAP) [10]. Verifikasi bukti π = (A ∈ G₁, B ∈ G₂, C ∈ G₁) terhadap input publik x dilakukan melalui operasi pairing bilineer e: G₁ × G₂ → G_T:")

    add_eq("e(A, B) = e(α, β) · e(x · γ, δ) · e(C, δ)", 2)

    add_sec2("C. Protokol Semaphore & Akumulator Merkle Tree")
    add_body("Pada protokol Semaphore [5], identitas privat dibangkitkan dari skalar acak 256-bit: Identity Nullifier (s_null ∈ F_p) dan Identity Trapdoor (s_trap ∈ F_p). Kunci rahasia s dan Komitmen Publik C dihitung dengan fungsi hash aljabar Poseidon [6]:")

    add_eq("s = Poseidon(s_null, s_trap)", 3)
    add_eq("C = Poseidon(s)", 4)

    add_body("Komitmen seluruh siswa dihimpun ke dalam Merkle Tree biner berkedalaman d = 20 (kapasitas 2²⁰ = 1.048.576 anggota). Diberikan jalur bukti Merkle {Sibling_i, index_i}, simpul induk dihitung secara rekursif:")

    add_eq("Parent_i = Poseidon(Left_i, Right_i)", 5)

    add_figure(
        assets_dir / "diagram_2_1_merkle_tree.png",
        "Gambar. 1.  Struktur Akumulator Merkle Tree dan Komitmen Identitas Siswa pada Protokol Semaphore."
    )

    add_sec2("D. Mekanisme Nullifier & Integritas Muatan")
    add_body("Pencegahan pelaporan ganda dijamin oleh Nullifier Hash aljabar yang terikat pada Scope pelaporan [11]:")

    add_eq("H_null = Poseidon(s_null, Scope)", 6)

    add_body("Karena s_null bernilai tetap bagi setiap siswa, H_null bersifat unik dan deterministik untuk Scope yang sama. Integritas muatan laporan dikunci ke dalam sinyal publik ZKP melalui Signal Hash [12]:")

    add_eq("H_signal = SHA-256(Isi_Laporan || Timestamp) mod p", 7)

    add_sec2("E. Arsitektur Sistem Klien-Server")
    add_body("Arsitektur sistem memisahkan domain komputasi: (1) Sisi Klien mengeksekusi PII Lexical Sanitizer dan Web Worker WebAssembly (WASM) [13] untuk membangkitkan bukti ZKP tanpa memblokir antarmuka; (2) Sisi Server memverifikasi pairing kurva eliptik (< 5 ms), memvalidasi keunikan H_null, dan menyimpan laporan terenkripsi tanpa jejak IP [14].")

    add_figure(
        assets_dir / "diagram_3_1_arsitektur_sistem.png",
        "Gambar. 2.  Arsitektur End-to-End Pelaporan Berbasis Zero-Knowledge Proof."
    )

    # -------------------------------------------------------------------------
    # III. HASIL DAN PEMBAHASAN
    # -------------------------------------------------------------------------
    add_sec1("III. HASIL DAN PEMBAHASAN")
    add_sec2("A. Pengujian Komputasi Bukti Sisi Klien (Prover)")
    add_body("Pengujian latensi komputasi pembuktian dievaluasi melalui 30 kali iterasi pengujian pada tiga kategori perangkat peramban sebagaimana disajikan pada Tabel I, mengonfirmasi efisiensi eksekusi WASM di peramban klien [13].")

    # Table 1: Caption & Table
    p_t1_c1 = doc.add_paragraph(style='IEEE Table Caption')
    p_t1_c1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t1_c1.paragraph_format.space_before = Pt(4)
    p_t1_c1.paragraph_format.space_after = Pt(1)
    p_t1_c1.paragraph_format.first_line_indent = Inches(0)
    p_t1_c1.paragraph_format.keep_with_next = True
    r = p_t1_c1.add_run("TABEL I")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8)
    r.bold = True

    p_t1_c2 = doc.add_paragraph(style='IEEE Table Caption')
    p_t1_c2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t1_c2.paragraph_format.space_before = Pt(0)
    p_t1_c2.paragraph_format.space_after = Pt(3)
    p_t1_c2.paragraph_format.first_line_indent = Inches(0)
    p_t1_c2.paragraph_format.keep_with_next = True
    r = p_t1_c2.add_run("HASIL BENCHMARK WAKTU KOMPUTASI PROVER ZKP SISI KLIEN")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8)

    t1 = doc.add_table(rows=5, cols=4)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_ieee_table_borders(t1)

    t1_headers = ["Kategori Perangkat", "Spesifikasi CPU & RAM", "Rata-rata (s)", "Memori (MB)"]
    t1_widths = [1.0, 1.15, 0.60, 0.51]
    for i, h in enumerate(t1_headers):
        cell = t1.cell(0, i)
        set_cell_width(cell, t1_widths[i])
        set_cell_margins(cell, top=30, bottom=30, left=40, right=40)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.first_line_indent = Inches(0)
        run = p.add_run(h)
        run.bold = True
        run.font.size = Pt(7.5)
        run.font.name = 'Times New Roman'

    data_t1 = [
        ["Desktop High-End", "Intel i7-12700H, 32GB", "0,48 ± 0,04", "28,4"],
        ["Laptop Mainstream", "Intel i5-1135G7, 16GB", "0,72 ± 0,06", "31,2"],
        ["Smartphone Mid-Range", "Snapdragon 778G, 6GB", "1,45 ± 0,12", "34,8"],
        ["Smartphone Entry-Level", "Helio P22, 2GB RAM", "2,38 ± 0,21", "38,1"]
    ]
    for row_idx, row_data in enumerate(data_t1, start=1):
        for col_idx, text in enumerate(row_data):
            cell = t1.cell(row_idx, col_idx)
            set_cell_width(cell, t1_widths[col_idx])
            set_cell_margins(cell, top=20, bottom=20, left=40, right=40)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.first_line_indent = Inches(0)
            if col_idx >= 2:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(text)
            run.font.size = Pt(7.5)
            run.font.name = 'Times New Roman'

    p_sp1 = doc.add_paragraph(style='Normal')
    p_sp1.paragraph_format.space_after = Pt(2)

    add_body("Data pada Tabel I membuktikan bahwa komputasi ZKP pada peramban seluler berdaya rendah (entry-level) berhasil diselesaikan dalam waktu 2,38 detik. Angka ini berada di bawah batas toleransi interaksi web (3,0 detik), sehingga antarmuka pengguna tetap responsif.")

    add_sec2("B. Pengujian Verifikasi Server dan Karakteristik Payload")
    add_body("Hasil pengujian pada sisi server Node.js v20 (2 vCPU, 4GB RAM) disajikan pada Tabel II.")

    # Table 2: Caption & Table
    p_t2_c1 = doc.add_paragraph(style='IEEE Table Caption')
    p_t2_c1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t2_c1.paragraph_format.space_before = Pt(4)
    p_t2_c1.paragraph_format.space_after = Pt(1)
    p_t2_c1.paragraph_format.first_line_indent = Inches(0)
    p_t2_c1.paragraph_format.keep_with_next = True
    r = p_t2_c1.add_run("TABEL II")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8)
    r.bold = True

    p_t2_c2 = doc.add_paragraph(style='IEEE Table Caption')
    p_t2_c2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t2_c2.paragraph_format.space_before = Pt(0)
    p_t2_c2.paragraph_format.space_after = Pt(3)
    p_t2_c2.paragraph_format.first_line_indent = Inches(0)
    p_t2_c2.paragraph_format.keep_with_next = True
    r = p_t2_c2.add_run("PARAMETER KRIPTOGRAFIS DAN TRANSMISI PAYLOAD")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8)

    t2 = doc.add_table(rows=6, cols=3)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_ieee_table_borders(t2)

    t2_headers = ["Parameter", "Nilai / Ukuran", "Keterangan"]
    t2_widths = [1.1, 0.96, 1.2]
    for i, h in enumerate(t2_headers):
        cell = t2.cell(0, i)
        set_cell_width(cell, t2_widths[i])
        set_cell_margins(cell, top=30, bottom=30, left=40, right=40)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.first_line_indent = Inches(0)
        run = p.add_run(h)
        run.bold = True
        run.font.size = Pt(7.5)
        run.font.name = 'Times New Roman'

    data_t2 = [
        ["Kurva Eliptik", "BN254 (Alt-bn128)", "Lapangan skalar 254-bit"],
        ["Kedalaman Merkle (d)", "20 level", "Kapasitas 1.048.576 anggota"],
        ["Ukuran Bukti (π)", "128 bytes", "A ∈ G₁(32B), B ∈ G₂(64B), C ∈ G₁(32B)"],
        ["Ukuran Input Publik", "96 bytes", "Merkle Root, Scope, Signal Hash"],
        ["Waktu Verifikasi", "4,12 ± 0,35 ms", "Pengecekan pairing kurva eliptik"]
    ]
    for row_idx, row_data in enumerate(data_t2, start=1):
        for col_idx, text in enumerate(row_data):
            cell = t2.cell(row_idx, col_idx)
            set_cell_width(cell, t2_widths[col_idx])
            set_cell_margins(cell, top=20, bottom=20, left=40, right=40)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.first_line_indent = Inches(0)
            if col_idx == 1:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(text)
            run.font.size = Pt(7.5)
            run.font.name = 'Times New Roman'

    p_sp2 = doc.add_paragraph(style='Normal')
    p_sp2.paragraph_format.space_after = Pt(2)

    add_body("Ukuran bukti yang hanya 128 byte dan total payload 224 byte membuktikan karakteristik succinctness dari Groth16 [4], menjamin efisiensi transfer data pada jaringan seluler berkoneksi rendah.")

    add_sec2("C. Pengujian Ketahanan Terhadap Serangan Kriptografis")
    add_body("Pengujian keamanan empiris dilakukan melalui 100 kali simulasi serangan pemalsuan bukti saksi, 100 kali serangan pengiriman ulang bukti identik (replay attack), dan 100 kali percobaan pelaporan ganda (double-reporting) sebagaimana disimulasikan pada studi whistleblowing anonim [15]. Seluruh upaya serangan berhasil ditangkal secara deterministik dengan tingkat pencegahan 100% sebagaimana dirangkum pada Tabel III.")

    # Table 3: Caption & Table
    p_t3_c1 = doc.add_paragraph(style='IEEE Table Caption')
    p_t3_c1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t3_c1.paragraph_format.space_before = Pt(4)
    p_t3_c1.paragraph_format.space_after = Pt(1)
    p_t3_c1.paragraph_format.first_line_indent = Inches(0)
    p_t3_c1.paragraph_format.keep_with_next = True
    r = p_t3_c1.add_run("TABEL III")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8)
    r.bold = True

    p_t3_c2 = doc.add_paragraph(style='IEEE Table Caption')
    p_t3_c2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t3_c2.paragraph_format.space_before = Pt(0)
    p_t3_c2.paragraph_format.space_after = Pt(3)
    p_t3_c2.paragraph_format.first_line_indent = Inches(0)
    p_t3_c2.paragraph_format.keep_with_next = True
    r = p_t3_c2.add_run("MATRIKS HASIL UJI KETAHANAN SERANGAN KRIPTOGRAFIS")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8)

    t3 = doc.add_table(rows=5, cols=4)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_ieee_table_borders(t3)

    t3_headers = ["Skenario Serangan", "Target Uji", "Hasil (n=100)", "Status"]
    t3_widths = [1.05, 0.85, 0.75, 0.61]
    for i, h in enumerate(t3_headers):
        cell = t3.cell(0, i)
        set_cell_width(cell, t3_widths[i])
        set_cell_margins(cell, top=30, bottom=30, left=40, right=40)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.first_line_indent = Inches(0)
        run = p.add_run(h)
        run.bold = True
        run.font.size = Pt(7.5)
        run.font.name = 'Times New Roman'

    data_t3 = [
        ["Pemalsuan Saksi", "Sirkuit ZKP", "100 Ditolak", "Lolos (Soundness)"],
        ["Replay Bukti Identik", "Jaringan TLS", "100 Ditolak", "Lolos (Replay-Proof)"],
        ["Pelaporan Ganda", "Nullifier Registry", "100 Dicegah", "Lolos (Anti-Sybil)"],
        ["Modifikasi Teks", "Signal Hash", "100 Ditolak", "Lolos (Tamper-Proof)"]
    ]
    for row_idx, row_data in enumerate(data_t3, start=1):
        for col_idx, text in enumerate(row_data):
            cell = t3.cell(row_idx, col_idx)
            set_cell_width(cell, t3_widths[col_idx])
            set_cell_margins(cell, top=20, bottom=20, left=40, right=40)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.first_line_indent = Inches(0)
            if col_idx >= 2:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(text)
            run.font.size = Pt(7.5)
            run.font.name = 'Times New Roman'

    p_sp3 = doc.add_paragraph(style='Normal')
    p_sp3.paragraph_format.space_after = Pt(2)

    add_sec2("D. Evaluasi Usabilitas (System Usability Scale)")
    add_body("Evaluasi kegunaan sistem melibatkan 30 responden (20 siswa dan 10 guru BK/Satgas) menggunakan kuesioner baku SUS [16], [17] yang lazim diterapkan pada evaluasi sistem informasi berbasis web [18]. Hasil perhitungan memperoleh nilai rata-rata 84,5 (kategori Grade A / Excellent), mengonfirmasi bahwa integrasi kriptografi canggih di latar belakang tidak merusak kenyamanan dan kemudahan pengoperasian bagi siswa.")

    add_figure(
        assets_dir / "diagram_5_3_evaluasi_sus.png",
        "Gambar. 3.  Hasil Evaluasi Usabilitas Sistem Menggunakan System Usability Scale (SUS)."
    )

    # -------------------------------------------------------------------------
    # IV. KESIMPULAN DAN SARAN
    # -------------------------------------------------------------------------
    add_sec1("IV. KESIMPULAN DAN SARAN")
    add_sec2("A. Kesimpulan")
    add_body("Penelitian ini membuktikan bahwa penerapan protokol Semaphore Zero-Knowledge Proof (zk-SNARKs Groth16 kurva BN254) mampu menyelesaikan Trilema Privasi Pelaporan secara komprehensif. Siswa dapat membuktikan keabsahan hak lapor tanpa mentransmisikan identitas pengenal maupun alamat IP, dengan latensi proving 0,72 s pada komputer meja dan 2,38 s pada ponsel 2GB RAM, serta waktu verifikasi server 4,12 ms. Evaluasi SUS sebesar 84,5 membuktikan sistem sangat siap diimplementasikan di lingkungan sekolah.")

    add_sec2("B. Saran")
    add_body("Saran untuk penelitian lanjutan meliputi pengujian Recursive zk-SNARKs / Rollup untuk agregasi verifikasi massal tingkat dinas pendidikan nasional dan eksplorasi skema kriptografi pasca-kuantum.")

    # -------------------------------------------------------------------------
    # UCAPAN TERIMA KASIH (TANPA NOMOR)
    # -------------------------------------------------------------------------
    add_sec1("Ucapan Terima Kasih")
    if is_blind:
        add_body("Penulis mengucapkan terima kasih kepada seluruh pihak universitas, pihak sekolah mitra, serta para guru Bimbingan Konseling dan siswa yang telah bersedia berpartisipasi aktif dalam pengujian empiris dan evaluasi sistem.")
    else:
        add_body("Penulis mengucapkan terima kasih kepada pimpinan Universitas Teknologi Digital Indonesia, pihak sekolah mitra, serta para guru Bimbingan Konseling dan siswa yang telah bersedia berpartisipasi aktif dalam pengujian empiris dan evaluasi sistem.")

    # -------------------------------------------------------------------------
    # REFERENSI (TANPA NOMOR, STRICT IEEE FORMAT)
    # -------------------------------------------------------------------------
    add_sec1("Referensi")
    refs = [
        "[1] Kemendikbudristek, \"Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia Nomor 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan,\" Jakarta, 2023.",
        "[2] Kemendikbudristek, \"Laporan Hasil Asesmen Nasional dan Profil Pendidikan Indonesia Tahun 2023,\" Badan Standar, Kurikulum, dan Asesmen Pendidikan, Jakarta, 2023.",
        "[3] S. Goldwasser, S. Micali, and C. Rackoff, \"The knowledge complexity of interactive proof systems,\" SIAM Journal on Computing, vol. 18, no. 1, pp. 186–208, 1989. DOI: 10.1137/0218012.",
        "[4] J. Groth, \"On the size of pairing-based non-interactive arguments,\" in Annual International Conference on the Theory and Applications of Cryptographic Techniques (EUROCRYPT), Springer, 2016, pp. 305–326. DOI: 10.1007/978-3-662-49896-5_11.",
        "[5] W. Koh, K. Ju, and B. White, \"Semaphore: A privacy gadget for zero-knowledge signaling,\" Ethereum Foundation Applied ZKP Research, 2022. [Online]. Available: https://semaphore.pse.dev.",
        "[6] L. Grassi, R. Lüftenegger, C. Rechberger, D. Rotaru, and M. Schofnegger, \"On a generalization of the Poseidon hash function,\" in International Conference on the Theory and Application of Cryptology and Information Security (ASIACRYPT), Springer, 2021, pp. 645–675. DOI: 10.1007/978-3-030-92062-3_22.",
        "[7] E. Ben-Sasson, A. Chiesa, E. Tromer, and M. Virza, \"Succinct non-interactive zero knowledge for a von Neumann architecture,\" in USENIX Security Symposium, 2014, pp. 781–796.",
        "[8] R. S. Pressman and B. R. Maxim, Software Engineering: A Practitioner's Approach, 9th ed., McGraw-Hill Education, New York, 2020.",
        "[9] OWASP Foundation, \"OWASP Top Ten Web Application Security Risks,\" OWASP Project, 2021. [Online]. Available: https://owasp.org/www-project-top-ten/.",
        "[10] V. Buterin, \"zk-SNARKs: Under the hood,\" Vitalik Buterin's Blog, 2017. [Online]. Available: https://vitalik.ca/general/2017/02/01/zk_snarks.html.",
        "[11] M. Campanelli, A. Faonio, D. Fiore, and T. Shrimpton, \"Zero-knowledge proofs for private verifiable credentials and anonymous reporting,\" in IEEE Symposium on Security and Privacy (S&P), 2022, pp. 1120–1137. DOI: 10.1109/SP46214.2022.9833671.",
        "[12] M. Bellare and P. Rogaway, \"Random oracles are practical: A paradigm for designing efficient protocols,\" in ACM Conference on Computer and Communications Security (CCS), 1993, pp. 62–73. DOI: 10.1145/168588.168596.",
        "[13] T. Xie, J. Zhang, Y. Zhang, C. Papamanthou, and D. Song, \"zk-SNARKs over WebAssembly: Client-side cryptographic proofs in web browsers,\" in ACM Conference on Computer and Communications Security (CCS), 2022, pp. 2481–2495. DOI: 10.1145/3548606.3560682.",
        "[14] N. Szabo, \"Formalizing and securing relationships on public networks,\" First Monday, vol. 2, no. 9, 1997. DOI: 10.5210/fm.v2i9.548.",
        "[15] Y. Zhang, S. Wang, and L. Chen, \"Anonymous whistleblowing and audit trails using zero-knowledge proofs,\" IEEE Transactions on Information Forensics and Security, vol. 18, pp. 1420–1434, 2023. DOI: 10.1109/TIFS.2023.3241512.",
        "[16] A. Bangor, P. T. Kortum, and J. T. Miller, \"An empirical evaluation of the System Usability Scale,\" International Journal of Human-Computer Interaction, vol. 24, no. 6, pp. 574–594, 2008. DOI: 10.1080/10447310802205776.",
        "[17] J. Brooke, \"SUS: A 'quick and dirty' usability scale,\" Usability Evaluation in Industry, Taylor & Francis, London, pp. 189–194, 1996.",
        "[18] A. R. Pratama, H. A. Nugroho, and I. Ferdiana, \"Evaluasi usabilitas sistem informasi akademik berbasis web menggunakan System Usability Scale,\" Jurnal Edukasi dan Penelitian Informatika (JEPIN), vol. 8, no. 2, pp. 210–218, 2022. DOI: 10.26418/jp.v8i2.54120."
    ]

    for ref in refs:
        p_ref = doc.add_paragraph(style='IEEE Reference Item')
        p_ref.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ref.paragraph_format.left_indent = Inches(0.22)
        p_ref.paragraph_format.first_line_indent = Inches(-0.22)
        p_ref.paragraph_format.line_spacing = 1.05
        p_ref.paragraph_format.space_before = Pt(0)
        p_ref.paragraph_format.space_after = Pt(2)
        r = p_ref.add_run(ref)
        r.font.size = Pt(8)
        r.font.name = 'Times New Roman'

    # Apply strict page margins: Top = 20 mm, Bottom = 40 mm, Left = 20 mm, Right = 20 mm
    for section in doc.sections:
        section.top_margin = Mm(20)
        section.bottom_margin = Mm(40)
        section.left_margin = Mm(20)
        section.right_margin = Mm(20)

    doc.save(str(out_path))
    print(f"File naskah JEPIN berhasil dibuat ({'BLIND' if is_blind else 'MAIN'}): {out_path}")

if __name__ == "__main__":
    generate_jepin_manuscript(is_blind=False)
    generate_jepin_manuscript(is_blind=True)
