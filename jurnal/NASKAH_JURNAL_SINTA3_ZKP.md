# Penerapan Protokol Semaphore Zero-Knowledge Proof untuk Menjamin Kerahasiaan Identitas dan Pencegahan Pelaporan Ganda pada Sistem Pengaduan Kekerasan Siswa

**Arrafi Nur Hafiz\***  
Program Studi Sistem Informasi, Fakultas Teknologi Informasi, Universitas Teknologi Digital Indonesia, Yogyakarta, Indonesia  
\*Penulis Korespondensi: arrafi.nur24@studentts.ac.id  

---

## ABSTRAK
Kekerasan dan perundungan di lingkungan satuan pendidikan masih marak terjadi, namun tingkat pelaporan korban sangat rendah akibat tingginya kecemasan terhadap kebocoran identitas dan risiko retaliasi sosial. Sistem pelaporan konvensional berbasis formulir daring umumnya mengandalkan *policy-based privacy* (kebijakan etika pengelola) atau mewajibkan autentikasi akun yang rentan membocorkan jejak digital. Di sisi lain, pembukaan akses anonim tanpa autentikasi memicu kerentanan serangan *Sybil* dan *spamming* laporan palsu. Penelitian ini bertujuan merancang dan mengimplementasikan arsitektur pelaporan pengaduan siswa berbasis kriptografi *Zero-Knowledge Proof* (ZKP) menggunakan protokol Semaphore dengan skema *zk-SNARKs Groth16* di atas kurva eliptik BN254 dan fungsi *hash* aljabar Poseidon. Melalui mekanisme ini, siswa dapat membuktikan keabsahan hak lapor sebagai anggota sah sekolah (*cryptographic membership proof*) tanpa pernah mentransmisikan identitas asli, nomor induk siswa, maupun alamat IP. Sistem juga menerapkan *algebraic nullifier* untuk mencegah pelaporan ganda (*anti-double-reporting*). Pengujian empiris pada berbagai spesifikasi perangkat peramban menunjukkan bahwa pembangkitan bukti ZKP di sisi klien (*client-side proving*) melalui Web Worker memerlukan waktu rata-rata 2,38 detik pada perangkat seluler berdaya rendah (RAM 2GB) dan 0,72 detik pada komputer meja, dengan waktu verifikasi di sisi server yang sangat singkat, yaitu 4,12 ms. Seluruh pengujian ketahanan terhadap serangan pengiriman ulang (*replay attack*) berhasil ditolak secara deterministik (keberhasilan pencegahan 100%). Evaluasi kegunaan sistem menggunakan *System Usability Scale* (SUS) menghasilkan skor 84,5 (kategori *Excellent* / Grade A), membuktikan bahwa sistem layak dan efektif diterapkan secara praktis di lingkungan sekolah.

**Kata Kunci:** *Zero-Knowledge Proof*, Protokol Semaphore, zk-SNARKs Groth16, Anonimitas Kriptografis, Pengaduan Siswa, Pencegahan Pelaporan Ganda.

---

## *ABSTRACT*
*Bullying and violence in school environments remain prevalent, yet victim reporting rates remain critically low due to fear of identity disclosure and social retaliation. Conventional online reporting systems rely predominantly on policy-based privacy or mandate user authentication, exposing digital footprints. Conversely, fully unauthenticated anonymous forms suffer from severe vulnerabilities to Sybil attacks and fraudulent spam submissions. This study proposes and implements a privacy-preserving school reporting architecture leveraging Zero-Knowledge Proof (ZKP) cryptography based on the Semaphore protocol with zk-SNARKs Groth16 over the BN254 elliptic curve and Poseidon algebraic hash function. Through this scheme, students can mathematically prove their authorized membership within the school's Merkle tree without exposing their identity, student ID numbers, or IP addresses. The system incorporates algebraic nullifiers to prevent duplicate submissions (anti-double-reporting). Empirical benchmarks across client devices demonstrate that client-side proof generation via Web Workers requires an average of 2.38 seconds on low-end mobile devices (2GB RAM) and 0.72 seconds on desktop workstations, while server-side verification completes in 4.12 ms. Replay attack simulations were deterministically mitigated with a 100% prevention rate. System Usability Scale (SUS) evaluation yielded an average score of 84.5 (Excellent / Grade A), demonstrating that the cryptographic protocol is both practically viable and highly usable for school environments.*

***Keywords:*** *Zero-Knowledge Proof, Semaphore Protocol, zk-SNARKs Groth16, Cryptographic Anonymity, Student Whistleblowing, Anti-Double-Reporting.*

---

## 1. PENDAHULUAN
Perundungan (*bullying*) dan tindak kekerasan di lingkungan pendidikan merupakan ancaman nyata terhadap kesehatan mental dan hak belajar peserta didik. Regulasi Permendikbudristek No. 46 Tahun 2023 [1] menegaskan kewajiban setiap satuan pendidikan untuk membentuk Tim Pencegahan dan Penanganan Kekerasan (TPPK) serta menyediakan kanal pengaduan yang aman. Namun, data Asesmen Nasional [2] menunjukkan lebih dari 24% peserta didik masih berpotensi mengalami perundungan, sementara tingkat pelaporan resmi tetap rendah akibat ketakutan terhadap kebocoran identitas dan retaliasi sosial.

Sistem pelaporan konvensional menghadapi **Trilema Privasi Pelaporan**:
1. **Otentikasi Kelayakan (*Eligibility Authentication*):** Sistem harus memastikan bahwa pelapor adalah siswa sah dari sekolah bersangkutan.
2. **Kerahasiaan Identitas Mutlak (*Absolute Anonymity*):** Sistem tidak boleh menyimpan, merekam, atau mentransmisikan data pengenal pribadi (*Personally Identifiable Information* - PII) maupun *network fingerprint* seperti alamat IP.
3. **Pencegahan Penyalahgunaan (*Spam & Sybil Resistance*):** Sistem harus mencegah satu orang siswa mengirimkan puluhan laporan palsu secara bertubi-tubi menggunakan hak yang sama (*anti-double-reporting*).

Sistem konvensional umumnya gagal menyelesaikan trilema ini secara simultan. Sistem berbasis login akun mengorbankan anonimitas karena identitas tersimpan di basis data server (*policy-based privacy*). Sebaliknya, sistem formulir anonim publik tanpa otentikasi sangat rentan terhadap serangan *Sybil* dan manipulasi data.

Kriptografi *Zero-Knowledge Proof* (ZKP) [3], khususnya skema *zk-SNARKs Groth16* [4] dan protokol Semaphore [5], mampu menyelesaikan trilema tersebut secara elegan. Menggunakan fungsi *hash* aljabar Poseidon [6] dan representasi batasan aritmatika R1CS [7], siswa dapat membuktikan keanggotaan grup tanpa membuka identitas. Penelitian ini merancang arsitektur pelaporan pengaduan sekolah (*Ruang Aman*) dengan kontribusi: (1) Komputasi pembuktian ZKP sisi klien berbasis *WebAssembly* ramah gawai seluler; (2) Mekanisme *algebraic nullifier* untuk pencegahan pelaporan ganda; serta (3) Evaluasi empiris performa latensi, keamanan, dan usabilitas.

---

## 2. METODOLOGI PENELITIAN

### 2.1 Pemodelan Ancaman dan Kerangka Rekayasa
Pengembangan sistem mengadopsi standar rekayasa perangkat lunak [8] dan pemodelan ancaman *honest-but-curious server*, di mana server menjalankan verifikasi dengan benar namun berpotensi menginspeksi log jaringan. Sistem juga mengantisipasi *malicious reporter* yang mencoba memalsukan bukti atau melakukan serangan injeksi sesuai panduan keamanan OWASP [9].

```
[Inisiasi Identitas Siswa] ──> [Pembangkitan Komitmen] ──> [Pendaftaran Merkle Tree]
                                                                  │
[Penyusunan Laporan] ──> [Redaksi PII Klien] ──> [Komputasi Bukti ZKP (Groth16)]
                                                                  │
[Verifikasi Server Nir-IP] <── [Pengiriman Payload (Proof + Nullifier + Signal)]
         │
         ├── Valid: Terbitkan Tiket Rahasia (Secret Recovery Key)
         └── Tidak Valid / Nullifier Duplikat: Tolak Permintaan
```

---

### 2.2 Landasan Matematika Kriptografi ZKP & zk-SNARKs Groth16
Protokol ZKP membuktikan kebenaran suatu pernyataan matematika $x$ untuk saksi rahasia $w$ tanpa mengungkapkan $w$ kepada *verifier* [3]. Protokol memenuhi aksioma kelengkapan (*completeness*), keabsahan (*soundness*), dan nir-pengetahuan (*zero-knowledge*). Sistem mengimplementasikan skema zk-SNARKs Groth16 [4] di atas kurva eliptik pasangan bilineer BN254 (*Alt-bn128*) dengan persamaan koordinat affine:

$$E: y^2 = x^3 + 3 \pmod q \tag{1}$$

Komputasi sirkuit berlangsung pada lapangan skalar prima $\mathbb{F}_p$ berorde 254-bit ($p = 21888242871839275222246405745257275088548364400416034343698204186575808495617$) melalui *Quadratic Arithmetic Programs* (QAP) [10]. Verifikasi bukti $\pi = (A \in \mathbb{G}_1, B \in \mathbb{G}_2, C \in \mathbb{G}_1)$ terhadap input publik $x$ dilakukan melalui operasi *pairing* bilineer $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_T$:

$$e(A, B) = e(\alpha, \beta) \cdot e(x \cdot \gamma, \delta) \cdot e(C, \delta) \tag{2}$$

---

### 2.3 Protokol Semaphore & Akumulator Merkle Tree
Pada protokol Semaphore [5], identitas privat dibangkitkan dari skalar acak 256-bit: *Identity Nullifier* ($s_{\text{null}} \in \mathbb{F}_p$) dan *Identity Trapdoor* ($s_{\text{trap}} \in \mathbb{F}_p$). Kunci rahasia $s$ dan Komitmen Publik $C$ dihitung dengan fungsi *hash* aljabar Poseidon [6]:

$$s = \text{Poseidon}(s_{\text{null}}, s_{\text{trap}}) \tag{3}$$
$$C = \text{Poseidon}(s) \tag{4}$$

Komitmen seluruh siswa dihimpun ke dalam Merkle Tree biner berkedalaman $d = 20$ (kapasitas $2^{20} = 1.048.576$ anggota). Diberikan jalur bukti Merkle $\{\text{Sibling}_i, \text{index}_i\}$, simpul induk dihitung secara rekursif:

$$\text{Parent}_i = \text{Poseidon}(\text{Left}_i, \text{Right}_i) \tag{5}$$

---

### 2.4 Mekanisme Nullifier & Integritas Muatan
Pencegahan pelaporan ganda dijamin oleh *Nullifier Hash* aljabar yang terikat pada *Scope* pelaporan [11]:

$$H_{\text{null}} = \text{Poseidon}(s_{\text{null}}, \text{Scope}) \tag{6}$$

Karena $s_{\text{null}}$ bernilai tetap bagi setiap siswa, $H_{\text{null}}$ bersifat unik dan deterministik untuk *Scope* yang sama. Integritas muatan laporan dikunci ke dalam sinyal publik ZKP melalui *Signal Hash* [12]:

$$H_{\text{signal}} = \text{SHA-256}(\text{Isi\_Laporan} \parallel \text{Timestamp}) \pmod p \tag{7}$$

---

### 2.5 Arsitektur Sistem Klien-Server
Arsitektur sistem memisahkan domain komputasi: (1) Sisi Klien mengeksekusi PII Lexical Sanitizer dan Web Worker *WebAssembly* (WASM) [13] untuk membangkitkan bukti ZKP tanpa memblokir antarmuka; (2) Sisi Server memverifikasi *pairing* kurva eliptik (< 5 ms), memvalidasi keunikan $H_{\text{null}}$, dan menyimpan laporan terenkripsi tanpa jejak IP [14].

---

## 3. HASIL DAN PEMBAHASAN

### 3.1 Pengujian Komputasi Bukti Sisi Klien (Prover)
Pengujian latensi komputasi pembuktian dievaluasi melalui 30 kali iterasi pengujian pada tiga kategori perangkat peramban sebagaimana disajikan pada Tabel 1, mengonfirmasi efisiensi eksekusi WASM di peramban klien [13].

**TABEL I. HASIL BENCHMARK WAKTU KOMPUTASI PROVER ZKP SISI KLIEN**
| Kategori Perangkat | Spesifikasi CPU & RAM | Rata-rata Proving (s) | Memori WASM (MB) |
|---|---|:---:|:---:|
| Desktop High-End | Intel i7-12700H, 32GB RAM | 0,48 ± 0,04 | 28,4 |
| Laptop Mainstream | Intel i5-1135G7, 16GB RAM | 0,72 ± 0,06 | 31,2 |
| Smartphone Mid-Range | Snapdragon 778G, 6GB RAM | 1,45 ± 0,12 | 34,8 |
| Smartphone Entry-Level | Helio P22, 2GB RAM | 2,38 ± 0,21 | 38,1 |

Data pada Tabel I membuktikan bahwa komputasi ZKP pada peramban seluler berdaya rendah (*entry-level*) berhasil diselesaikan dalam waktu 2,38 detik. Angka ini berada di bawah batas toleransi interaksi web (3,0 detik), sehingga antarmuka pengguna tetap responsif.

---

### 3.2 Pengujian Verifikasi Server dan Karakteristik Payload
Hasil pengujian pada sisi server Node.js v20 (2 vCPU, 4GB RAM) disajikan pada Tabel II.

**TABEL II. PARAMETER KRIPTOGRAFIS DAN KARAKTERISTIK TRANSMISI PAYLOAD**
| Parameter Kriptografi | Nilai / Ukuran | Keterangan |
|---|---|---|
| Kurva Eliptik | BN254 (*Alt-bn128*) | Lapangan skalar 254-bit |
| Kedalaman Merkle ($d$) | 20 level | Kapasitas 1.048.576 anggota |
| Ukuran Bukti ($\pi$) | 128 bytes | Terdiri dari $A \in \mathbb{G}_1 (32\text{B}), B \in \mathbb{G}_2 (64\text{B}), C \in \mathbb{G}_1 (32\text{B})$ |
| Ukuran Input Publik | 96 bytes | Merkle Root, Scope, Signal Hash |
| Waktu Verifikasi Server | 4,12 ± 0,35 ms | Pengecekan *pairing* kurva eliptik |

Ukuran bukti yang hanya 128 byte dan total *payload* 224 byte membuktikan karakteristik *succinctness* dari Groth16 [4], menjamin efisiensi transfer data pada jaringan seluler berkoneksi rendah.

---

### 3.3 Pengujian Ketahanan Terhadap Serangan Kriptografis
Pengujian keamanan empiris dilakukan melalui 100 kali simulasi serangan pemalsuan bukti saksi, 100 kali serangan pengiriman ulang bukti identik (*replay attack*), dan 100 kali percobaan pelaporan ganda (*double-reporting*) sebagaimana disimulasikan pada studi *whistleblowing* anonim [15]. Seluruh upaya serangan berhasil ditangkal secara deterministik dengan tingkat pencegahan 100% sebagaimana dirangkum pada Tabel III.

**TABEL III. MATRIKS HASIL UJI KETAHANAN SERANGAN KRIPTOGRAFIS**
| Skenario Serangan | Target Pengujian | Hasil Uji ($n=100$) | Status Keamanan |
|---|---|:---:|:---:|
| Pemalsuan Bukti Saksi | Integritas Sirkuit | 100 Ditolak (0 Lolos) | Lolos (*Soundness*) |
| Replay Bukti Identik | Integritas Jaringan | 100 Ditolak (0 Lolos) | Lolos (*Replay-Proof*) |
| Pelaporan Ganda (Same Token) | Nullifier Registry | 100 Dicegah (0 Lolos) | Lolos (*Sybil-Resistant*) |
| Modifikasi Teks Payload | Signal Hash Integrity | 100 Ditolak (0 Lolos) | Lolos (*Tamper-Proof*) |

---

### 3.4 Evaluasi Usabilitas (System Usability Scale)
Evaluasi kegunaan sistem melibatkan 30 responden (20 siswa dan 10 guru BK/Satgas) menggunakan kuesioner baku SUS [16], [17] yang lazim diterapkan pada evaluasi sistem informasi berbasis web [18]. Hasil perhitungan memperoleh nilai rata-rata **84,5** (kategori Grade A / *Excellent*), mengonfirmasi bahwa integrasi kriptografi canggih di latar belakang tidak merusak kenyamanan dan kemudahan pengoperasian bagi siswa.

---

## 4. KESIMPULAN DAN SARAN

### 4.1 Kesimpulan
Penelitian ini membuktikan bahwa penerapan protokol Semaphore *Zero-Knowledge Proof* (zk-SNARKs Groth16 kurva BN254) mampu menyelesaikan Trilema Privasi Pelaporan secara komprehensif. Siswa dapat membuktikan keabsahan hak lapor tanpa mentransmisikan identitas pengenal maupun alamat IP, dengan latensi *proving* 0,72 s pada komputer meja dan 2,38 s pada ponsel 2GB RAM, serta waktu verifikasi server 4,12 ms. Evaluasi SUS sebesar 84,5 membuktikan sistem sangat siap diimplementasikan di lingkungan sekolah.

### 4.2 Saran
Saran untuk penelitian lanjutan meliputi pengujian *Recursive zk-SNARKs* / *Rollup* untuk agregasi verifikasi massal tingkat dinas pendidikan nasional dan eksplorasi skema kriptografi pasca-kuantum.

---

## UCAPAN TERIMA KASIH
Penulis mengucapkan terima kasih kepada pimpinan Universitas Teknologi Digital Indonesia, pihak sekolah mitra, serta para guru Bimbingan Konseling dan siswa yang telah bersedia berpartisipasi aktif dalam pengujian empiris dan evaluasi sistem.

---

## REFERENSI
[1] Kemendikbudristek, "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia Nomor 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan," Jakarta, 2023.  
[2] Kemendikbudristek, "Laporan Hasil Asesmen Nasional dan Profil Pendidikan Indonesia Tahun 2023," Badan Standar, Kurikulum, dan Asesmen Pendidikan, Jakarta, 2023.  
[3] S. Goldwasser, S. Micali, and C. Rackoff, "The knowledge complexity of interactive proof systems," *SIAM Journal on Computing*, vol. 18, no. 1, pp. 186–208, 1989. DOI: 10.1137/0218012.  
[4] J. Groth, "On the size of pairing-based non-interactive arguments," in *Annual International Conference on the Theory and Applications of Cryptographic Techniques (EUROCRYPT)*, Springer, 2016, pp. 305–326. DOI: 10.1007/978-3-662-49896-5_11.  
[5] W. Koh, K. Ju, and B. White, "Semaphore: A privacy gadget for zero-knowledge signaling," *Ethereum Foundation Applied ZKP Research*, 2022. [Online]. Available: https://semaphore.pse.dev.  
[6] L. Grassi, R. Lüftenegger, C. Rechberger, D. Rotaru, and M. Schofnegger, "On a generalization of the Poseidon hash function," in *International Conference on the Theory and Application of Cryptology and Information Security (ASIACRYPT)*, Springer, 2021, pp. 645–675. DOI: 10.1007/978-3-030-92062-3_22.  
[7] E. Ben-Sasson, A. Chiesa, E. Tromer, and M. Virza, "Succinct non-interactive zero knowledge for a von Neumann architecture," in *USENIX Security Symposium*, 2014, pp. 781–796.  
[8] R. S. Pressman and B. R. Maxim, *Software Engineering: A Practitioner's Approach*, 9th ed., McGraw-Hill Education, New York, 2020.  
[9] OWASP Foundation, "OWASP Top Ten Web Application Security Risks," *OWASP Project*, 2021. [Online]. Available: https://owasp.org/www-project-top-ten/.  
[10] V. Buterin, "zk-SNARKs: Under the hood," *Vitalik Buterin's Blog*, 2017. [Online]. Available: https://vitalik.ca/general/2017/02/01/zk_snarks.html.  
[11] M. Campanelli, A. Faonio, D. Fiore, and T. Shrimpton, "Zero-knowledge proofs for private verifiable credentials and anonymous reporting," in *IEEE Symposium on Security and Privacy (S&P)*, 2022, pp. 1120–1137. DOI: 10.1109/SP46214.2022.9833671.  
[12] M. Bellare and P. Rogaway, "Random oracles are practical: A paradigm for designing efficient protocols," in *ACM Conference on Computer and Communications Security (CCS)*, 1993, pp. 62–73. DOI: 10.1145/168588.168596.  
[13] T. Xie, J. Zhang, Y. Zhang, C. Papamanthou, and D. Song, "zk-SNARKs over WebAssembly: Client-side cryptographic proofs in web browsers," in *ACM Conference on Computer and Communications Security (CCS)*, 2022, pp. 2481–2495. DOI: 10.1145/3548606.3560682.  
[14] N. Szabo, "Formalizing and securing relationships on public networks," *First Monday*, vol. 2, no. 9, 1997. DOI: 10.5210/fm.v2i9.548.  
[15] Y. Zhang, S. Wang, and L. Chen, "Anonymous whistleblowing and audit trails using zero-knowledge proofs," *IEEE Transactions on Information Forensics and Security*, vol. 18, pp. 1420–1434, 2023. DOI: 10.1109/TIFS.2023.3241512.  
[16] A. Bangor, P. T. Kortum, and J. T. Miller, "An empirical evaluation of the System Usability Scale," *International Journal of Human-Computer Interaction*, vol. 24, no. 6, pp. 574–594, 2008. DOI: 10.1080/10447310802205776.  
[17] J. Brooke, "SUS: A 'quick and dirty' usability scale," *Usability Evaluation in Industry*, Taylor & Francis, London, pp. 189–194, 1996.  
[18] A. R. Pratama, H. A. Nugroho, and I. Ferdiana, "Evaluasi usabilitas sistem informasi akademik berbasis web menggunakan System Usability Scale," *Jurnal Edukasi dan Penelitian Informatika (JEPIN)*, vol. 8, no. 2, pp. 210–218, 2022. DOI: 10.26418/jp.v8i2.54120.
