const puppeteer = require("/home/arrafi/.npm/_npx/a779493e568f0a62/node_modules/puppeteer");
const path = require("path");
const fs = require("fs");

async function generateFlowchart() {
  const outputDir = path.resolve(__dirname, "../proposal/assets");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: "/home/arrafi/.cache/puppeteer/chrome/linux-148.0.7778.97/chrome-linux64/chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1250, height: 1100, deviceScaleFactor: 2 });

  console.log("Generating Diagram 4.1: Flowchart Alur Proses Bisnis & Kriptografis...");
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; padding: 30px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px; width: 1180px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .header { text-align: center; margin-bottom: 24px; }
        .title { color: #f8fafc; font-size: 22px; font-weight: 800; }
        .subtitle { color: #94a3b8; font-size: 13px; margin-top: 4px; }
        
        .flow-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; position: relative; }
        
        .col { background: #0f172a; border-radius: 14px; border: 1px solid #334155; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .col-header { padding-bottom: 10px; border-bottom: 1px solid #1e293b; text-align: center; }
        .col-badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: white; margin-bottom: 4px; }
        .col-title { color: #f8fafc; font-size: 14px; font-weight: 700; }
        
        .b-blue { background: #2563eb; }
        .b-purple { background: #7c3aed; }
        .b-sky { background: #0284c7; }
        .b-emerald { background: #059669; }
        
        .c-blue { border-top: 3px solid #3b82f6; }
        .c-purple { border-top: 3px solid #8b5cf6; }
        .c-sky { border-top: 3px solid #0ea5e9; }
        .c-emerald { border-top: 3px solid #10b981; }
        
        .step { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 12px; position: relative; }
        .step-num { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 3px; display: flex; justify-content: space-between; align-items: center; }
        .step-name { color: #f8fafc; font-size: 12px; font-weight: 700; margin-bottom: 4px; }
        .step-desc { color: #94a3b8; font-size: 11px; line-height: 1.4; }
        
        .decision { background: #182234; border: 1px dashed #f59e0b; border-radius: 10px; padding: 10px; text-align: center; }
        .dec-title { color: #fbbf24; font-size: 11px; font-weight: 700; margin-bottom: 4px; }
        .dec-branches { display: flex; justify-content: space-around; font-size: 10px; color: #cbd5e1; font-weight: 600; margin-top: 4px; }
        .branch-pill { background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #334155; }
        
        .flow-arrow { text-align: center; color: #64748b; font-size: 14px; margin: -6px 0; font-weight: bold; }
        
        .highlight-box { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); }
        .purple-box { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); }
        .emerald-box { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); }
        
        .legend { margin-top: 20px; padding-top: 14px; border-top: 1px solid #334155; display: flex; justify-content: center; gap: 24px; font-size: 11px; color: #94a3b8; }
        .legend-item { display: flex; align-items: center; gap: 6px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="title">Diagram 4.1: Flowchart Alur Proses Bisnis & Rekayasa Kriptografis RUANG AMAN</div>
          <div class="subtitle">Siklus Hidup Pelaporan End-to-End: Inisiasi Klien, Bukti ZKP Matematika, Verifikasi Server Nir-IP, hingga Penanganan Multi-Lembaga</div>
        </div>
        
        <div class="flow-container">
          <!-- Kolom 1 -->
          <div class="col c-blue">
            <div class="col-header">
              <span class="col-badge b-blue">Fase 1</span>
              <div class="col-title">Inisiasi & Masukan Siswa</div>
            </div>
            
            <div class="step highlight-box">
              <div class="step-num"><span>Langkah 1</span><span>Portal Akses</span></div>
              <div class="step-name">Akses Web PWA / Kios</div>
              <div class="step-desc">Siswa mengakses RUANG AMAN di browser ponsel atau Lab Komputer (fitur ESC penyamaran 0,1s).</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="decision">
              <div class="dec-title">Pilihan Gerbang Lapor?</div>
              <div class="dec-branches">
                <span class="branch-pill" style="color:#60a5fa;">Jalur Terbuka</span>
                <span class="branch-pill" style="color:#a78bfa;">Jalur ZKP</span>
              </div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step">
              <div class="step-num"><span>Langkah 2</span><span>Input Laporan</span></div>
              <div class="step-name">Isi Narasi & Bukti</div>
              <div class="step-desc">Tulis kronologi insiden, pilih kategori perundungan, dan lampirkan bukti foto/tangkapan layar.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step highlight-box">
              <div class="step-num"><span>Langkah 3</span><span>Proteksi Lokal</span></div>
              <div class="step-name">Client-Side PII Stripper</div>
              <div class="step-desc">Regex engine di browser meredaksi otomatis nama, NISN, kelas, dan kontak sebelum pengiriman.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step">
              <div class="step-num"><span>Langkah 4</span><span>Otorisasi Hak</span></div>
              <div class="step-name">Input Token Fisik Sekolah</div>
              <div class="step-desc">Siswa memasukkan kode token fisik (scratch card) yang diperoleh dari pembagian massal sekolah.</div>
            </div>
          </div>
          
          <!-- Kolom 2 -->
          <div class="col c-purple">
            <div class="col-header">
              <span class="col-badge b-purple">Fase 2</span>
              <div class="col-title">Kriptografi Lokal Browser</div>
            </div>
            
            <div class="step purple-box">
              <div class="step-num"><span>Langkah 5</span><span>Isolasi Thread</span></div>
              <div class="step-name">Panggil Web Worker ZKP</div>
              <div class="step-desc">Komputasi kriptografi dijalankan di background thread tanpa membekukan antarmuka pengguna.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step">
              <div class="step-num"><span>Langkah 6</span><span>Komputasi Secret</span></div>
              <div class="step-name">Poseidon Identity Hash</div>
              <div class="step-desc">Hitung s = Poseidon(Nullifier, Trapdoor) dan Identity Commitment C = Poseidon(s).</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step purple-box">
              <div class="step-num"><span>Langkah 7</span><span>WASM zk-SNARK</span></div>
              <div class="step-name">Generate Merkle Proof π</div>
              <div class="step-desc">Buktikan keanggotaan C pada Merkle Tree kedalaman 20 kurva BN254 tanpa membocorkan identitas.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step">
              <div class="step-num"><span>Langkah 8</span><span>Anti-Replay</span></div>
              <div class="step-name">Nullifier & Signal Hash</div>
              <div class="step-desc">Kunci laporan ke bukti ZKP via SHA-256 dan hitung NullifierHash untuk cegah spam ganda.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step purple-box">
              <div class="step-num"><span>Langkah 9</span><span>Kunci Asimetris</span></div>
              <div class="step-name">Enkripsi Tiket X25519</div>
              <div class="step-desc">Generate pasangan kunci sesi tiket & enkripsi payload laporan menggunakan AES-GCM-256.</div>
            </div>
          </div>
          
          <!-- Kolom 3 -->
          <div class="col c-sky">
            <div class="col-header">
              <span class="col-badge b-sky">Fase 3</span>
              <div class="col-title">Gateway & Verifier Server</div>
            </div>
            
            <div class="step">
              <div class="step-num"><span>Langkah 10</span><span>Jaringan Anonim</span></div>
              <div class="step-name">Zero-IP Logging Transmission</div>
              <div class="step-desc">Payload dikirim via HTTPS TLS 1.3. Server API segera membuang header IP dan User-Agent.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step highlight-box">
              <div class="step-num"><span>Langkah 11</span><span>Validasi Bukti</span></div>
              <div class="step-name">ZK-Proof Pairing Check</div>
              <div class="step-desc">Server mengeksekusi fungsi verifikasi Groth16 terhadap Root pohon Merkle yang sah (< 5 ms).</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="decision">
              <div class="dec-title">Cek Nullifier Hash?</div>
              <div class="dec-branches">
                <span class="branch-pill" style="color:#ef4444;">Pernah Dipakai (Spam)</span>
                <span class="branch-pill" style="color:#10b981;">Baru (Valid)</span>
              </div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step">
              <div class="step-num"><span>Langkah 12</span><span>Penyimpanan Aman</span></div>
              <div class="step-name">Simpan DB Zero-PII</div>
              <div class="step-desc">Rekam ciphertext laporan, NullifierHash ke hash-set, dan metadata kategori tanpa identitas.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step highlight-box">
              <div class="step-num"><span>Langkah 13</span><span>Kunci Pemulihan</span></div>
              <div class="step-name">Terbitkan Kode Tiket</div>
              <div class="step-desc">Klien menerima Secret Recovery Token 16-karakter acak untuk membuka chat dan cek status.</div>
            </div>
          </div>
          
          <!-- Kolom 4 -->
          <div class="col c-emerald">
            <div class="col-header">
              <span class="col-badge b-emerald">Fase 4</span>
              <div class="col-title">Triase & Ekosistem Respon</div>
            </div>
            
            <div class="step emerald-box">
              <div class="step-num"><span>Langkah 14</span><span>Notifikasi Cepat</span></div>
              <div class="step-name">Dashboard Guru BK / Satgas</div>
              <div class="step-desc">Petugas menerima alert kasus baru, membaca narasi teredaksi, dan menentukan status triase.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step">
              <div class="step-num"><span>Langkah 15</span><span>Konseling Rahasia</span></div>
              <div class="step-name">Chat 2-Arah Terenkripsi</div>
              <div class="step-desc">Guru BK & siswa berdiskusi interaktif. Kunci privat hanya di browser siswa via kode tiket.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="decision">
              <div class="dec-title">Tingkat Risiko Kasus?</div>
              <div class="dec-branches">
                <span class="branch-pill" style="color:#38bdf8;">Sedang / Ringan</span>
                <span class="branch-pill" style="color:#f43f5e;">Kritis / Darurat</span>
              </div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step emerald-box">
              <div class="step-num"><span>Langkah 16</span><span>Aksi Penanganan</span></div>
              <div class="step-name">Eskalasi UPTD PPA & Sekolah</div>
              <div class="step-desc">Jika kritis: rujukan instan ke UPTD PPA (safe house & hukum). Jika sedang: konseling sekolah.</div>
            </div>
            
            <div class="flow-arrow">▼</div>
            
            <div class="step">
              <div class="step-num"><span>Langkah 17</span><span>Akuntabilitas</span></div>
              <div class="step-name">Agregasi Dinas & Selesai</div>
              <div class="step-desc">Data statistik non-PII disinkronisasi ke Dinas Pendidikan. Kasus ditutup dengan Berita Acara.</div>
            </div>
          </div>
        </div>
        
        <div class="legend">
          <div class="legend-item"><div class="dot" style="background:#3b82f6;"></div><span>Aktivitas Siswa & Kios</span></div>
          <div class="legend-item"><div class="dot" style="background:#8b5cf6;"></div><span>Komputasi Kriptografi Lokal (ZKP)</span></div>
          <div class="legend-item"><div class="dot" style="background:#0ea5e9;"></div><span>Verifikasi Server & DB Zero-PII</span></div>
          <div class="legend-item"><div class="dot" style="background:#10b981;"></div><span>Triase Satgas, PPA & Dinas</span></div>
          <div class="legend-item"><div class="dot" style="background:#f59e0b;"></div><span>Titik Keputusan / Validasi</span></div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const element = await page.$(".card");
  await element.screenshot({ path: path.join(outputDir, "diagram_4_1_flowchart_sistem.png") });
  await browser.close();
  console.log("✅ Diagram 4.1 Flowchart successfully generated at proposal/assets/diagram_4_1_flowchart_sistem.png!");
}

generateFlowchart().catch(console.error);
