const puppeteer = require("/home/arrafi/.npm/_npx/a779493e568f0a62/node_modules/puppeteer");
const path = require("path");
const fs = require("fs");

async function generateCryptoFlowDiagram() {
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
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });

  console.log("Generating Diagram Kriptografi ZKP Ruang Aman...");
  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
        body { 
          background: #090d16; 
          padding: 30px; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh;
          color: #f1f5f9;
        }
        
        .card { 
          background: linear-gradient(145deg, #111827, #0f172a); 
          border: 1px solid #1e293b; 
          border-radius: 24px; 
          padding: 36px 40px; 
          width: 1360px; 
          box-shadow: 0 25px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(56, 189, 248, 0.05); 
          position: relative;
          overflow: hidden;
        }

        .glow-top {
          position: absolute;
          top: -100px;
          left: 30%;
          width: 500px;
          height: 200px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
          pointer-events: none;
        }

        /* HEADER */
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start; 
          border-bottom: 1px solid #1e293b; 
          padding-bottom: 22px; 
          margin-bottom: 28px; 
        }
        .header-left { max-width: 880px; }
        .badge-bar { display: flex; gap: 8px; margin-bottom: 8px; }
        .badge { 
          font-size: 11px; 
          font-weight: 700; 
          padding: 4px 10px; 
          border-radius: 999px; 
          text-transform: uppercase; 
          letter-spacing: 0.6px; 
        }
        .badge-cyan { background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
        .badge-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.3); }
        .badge-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3); }
        
        .title { 
          font-size: 24px; 
          font-weight: 800; 
          color: #ffffff; 
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
        .subtitle { 
          color: #94a3b8; 
          font-size: 13px; 
          margin-top: 6px; 
          line-height: 1.5; 
        }

        /* STATS / PILL HEADER RIGHT */
        .header-right {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 14px;
          padding: 12px 18px;
          display: flex;
          gap: 20px;
          text-align: center;
        }
        .h-stat-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .h-stat-val { font-size: 15px; font-weight: 800; color: #38bdf8; font-family: ui-monospace, monospace; margin-top: 2px; }

        /* PIPELINE GRID */
        .pipeline-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .phase-box {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid #1e293b;
          border-radius: 16px;
          padding: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .phase-box.client-zone { border-top: 3px solid #38bdf8; background: linear-gradient(180deg, rgba(14, 165, 233, 0.05) 0%, rgba(15, 23, 42, 0.8) 100%); }
        .phase-box.zkp-zone { border-top: 3px solid #a855f7; background: linear-gradient(180deg, rgba(168, 85, 247, 0.05) 0%, rgba(15, 23, 42, 0.8) 100%); }
        .phase-box.server-zone { border-top: 3px solid #10b981; background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(15, 23, 42, 0.8) 100%); }

        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #1e293b;
        }
        .phase-title {
          font-size: 14px;
          font-weight: 800;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .phase-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
          text-transform: uppercase;
        }
        .tag-blue { background: #0369a1; color: #e0f2fe; }
        .tag-purple { background: #6b21a8; color: #f3e8ff; }
        .tag-emerald { background: #065f46; color: #d1fae5; }

        /* STEP CARDS */
        .step-card {
          background: #111c30;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 12px 14px;
          position: relative;
        }
        .step-num {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: #38bdf8;
          letter-spacing: 0.5px;
          margin-bottom: 3px;
        }
        .step-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }
        .step-formula {
          background: #090e1a;
          border: 1px solid #24344d;
          border-radius: 8px;
          padding: 8px 10px;
          font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
          font-size: 11px;
          color: #38bdf8;
          line-height: 1.4;
          margin: 6px 0;
          word-break: break-all;
        }
        .formula-purple { color: #c084fc; border-color: #3b2856; }
        .formula-green { color: #34d399; border-color: #1a4336; }
        .formula-amber { color: #fbbf24; border-color: #453418; }
        
        .step-desc {
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.4;
        }

        /* CONNECTOR BAR BETWEEN SECTIONS */
        .full-width-bridge {
          background: #0d1527;
          border: 1px dashed #334155;
          border-radius: 14px;
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .bridge-step {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bridge-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
        }
        .icon-blue { background: rgba(14, 165, 233, 0.2); color: #38bdf8; border: 1px solid #0284c7; }
        .icon-purple { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid #9333ea; }
        .icon-green { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #059669; }
        .bridge-text { text-align: left; }
        .bridge-label { font-size: 11px; font-weight: 700; color: #e2e8f0; }
        .bridge-sub { font-size: 10px; color: #64748b; font-family: monospace; }
        .bridge-arrow { color: #64748b; font-size: 18px; font-weight: 800; }

        /* BOTTOM GUARANTEE CARDS */
        .bottom-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .guarantee-card {
          background: #0b1120;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 12px 14px;
        }
        .g-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .g-dot { width: 8px; height: 8px; border-radius: 50%; }
        .g-title { font-size: 12px; font-weight: 700; color: #f1f5f9; }
        .g-desc { font-size: 10.5px; color: #94a3b8; line-height: 1.4; }

        .dot-cyan { background: #38bdf8; box-shadow: 0 0 8px #38bdf8; }
        .dot-purple { background: #a855f7; box-shadow: 0 0 8px #a855f7; }
        .dot-emerald { background: #10b981; box-shadow: 0 0 8px #10b981; }
        .dot-amber { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="glow-top"></div>

        <!-- HEADER -->
        <div class="header">
          <div class="header-left">
            <div class="badge-bar">
              <span class="badge badge-cyan">Kriptografi Zero-Knowledge Proof (ZKP)</span>
              <span class="badge badge-purple">Protokol Semaphore & Poseidon Hash</span>
              <span class="badge badge-emerald">zk-SNARKs Groth16 (128 Bytes Proof)</span>
            </div>
            <div class="title">Arsitektur & Alur Rekayasa Kriptografis RUANG AMAN</div>
            <div class="subtitle">
              Siklus Hidup Bukti Matematika: Pembangkitan Kunci Lokal, Akumulator Merkle Tree Kedalaman d=20, Prover Browser di Web Worker, Binding Integritas Laporan, hingga Verifikasi Nir-IP di API Gateway.
            </div>
          </div>
          <div class="header-right">
            <div>
              <div class="h-stat-label">Ukuran Bukti (π)</div>
              <div class="h-stat-val">128 Byte</div>
            </div>
            <div style="border-left: 1px solid #334155; padding-left: 16px;">
              <div class="h-stat-label">Waktu Prover Klien</div>
              <div class="h-stat-val">&lt; 2,5 Detik</div>
            </div>
            <div style="border-left: 1px solid #334155; padding-left: 16px;">
              <div class="h-stat-label">Anonimitas</div>
              <div class="h-stat-val" style="color: #34d399;">100% Matematis</div>
            </div>
          </div>
        </div>

        <!-- 3 MAIN PHASES GRID -->
        <div class="pipeline-grid">
          
          <!-- PHASE 1: SISI KLIEN -->
          <div class="phase-box client-zone">
            <div class="phase-header">
              <div class="phase-title">
                <span>🔐</span> 1. Inisiasi Kunci Klien
              </div>
              <span class="phase-tag tag-blue">Web Worker Klien</span>
            </div>

            <div class="step-card">
              <div class="step-num">Langkah 1.1 • Entropi Rahasia Siswa</div>
              <div class="step-title">Pembangkitan Kunci Entropi 256-Bit</div>
              <div class="step-formula">
                s_null ∈ 𝔽_p (Identity Nullifier)<br>
                s_trap ∈ 𝔽_p (Identity Trapdoor)
              </div>
              <div class="step-desc">Dihasilkan oleh Web Crypto API CSPRNG secara lokal. Kunci tersimpan privat di memori peramban dan tidak pernah ditransmisikan.</div>
            </div>

            <div class="step-card">
              <div class="step-num">Langkah 1.2 • Komitmen Identitas Publik</div>
              <div class="step-title">Identity Commitment Generation</div>
              <div class="step-formula">
                s = Poseidon(s_null, s_trap)<br>
                Commitment C = Poseidon(s)
              </div>
              <div class="step-desc">Komitmen C bertindak sebagai sidik jari publik siswa yang didaftarkan sebagai daun (leaf) di pohon Merkle sekolah.</div>
            </div>

            <div class="step-card">
              <div class="step-num">Langkah 1.3 • Redaksi & Binding Integritas</div>
              <div class="step-title">Sanitasi PII & Hash Muatan</div>
              <div class="step-formula formula-amber">
                M_clean = RedactPII(Laporan)<br>
                SignalHash = SHA256(M_clean ∥ Timestamp)
              </div>
              <div class="step-desc">Teks laporan disanitasi dari data pribadi, lalu diikatkan (bound) ke dalam sinyal sirkuit ZKP agar muatan laporan tidak dapat diubah (tamper-proof).</div>
            </div>
          </div>

          <!-- PHASE 2: AKUMULATOR & ZK PROVER -->
          <div class="phase-box zkp-zone">
            <div class="phase-header">
              <div class="phase-title">
                <span>⚡</span> 2. Sirkuit ZKP & Prover
              </div>
              <span class="phase-tag tag-purple">zk-SNARKs Groth16</span>
            </div>

            <div class="step-card">
              <div class="step-num">Langkah 2.1 • Pohon Merkle Keanggotaan</div>
              <div class="step-title">Merkle Path d=20 (Kapasitas 1M+)</div>
              <div class="step-formula formula-purple">
                H^(0) = C<br>
                H^(i+1) = Poseidon(H^(i), Sibling_i)<br>
                Root_Merkle = H^(20)
              </div>
              <div class="step-desc">Merekontruksi jalur pembuktian (Merkle Proof) ke akar pohon sekolah yang aktif tanpa mengungkap indeks daun siswa.</div>
            </div>

            <div class="step-card">
              <div class="step-num">Langkah 2.2 • Pencegah Serangan Sybil</div>
              <div class="step-title">Cryptographic Nullifier Hash</div>
              <div class="step-formula formula-purple">
                ExtNull = Poseidon(School_ID, Scope_Epoch)<br>
                NullifierHash = Poseidon(s_null, ExtNull)
              </div>
              <div class="step-desc">Mencegah siswa yang sama mengirim spam laporan ganda pada satu kasus/lingkup waktu tanpa mengetahui siapa siswa tersebut.</div>
            </div>

            <div class="step-card">
              <div class="step-num">Langkah 2.3 • Generasi Bukti Groth16</div>
              <div class="step-title">Sirkuit zk-SNARK di Web Worker</div>
              <div class="step-formula formula-purple">
                Private: { s_null, s_trap, MerklePath }<br>
                Public: { Root_Merkle, NullifierHash, SignalHash }<br>
                Bukti: π = Groth16.Prove(Circuit, Private, Public)
              </div>
              <div class="step-desc">Menghasilkan bukti ringkas π = (A ∈ 𝔾₁, B ∈ 𝔾₂, C ∈ 𝔾₁) berukuran konstan 128 byte di background thread (&lt; 2,5 detik).</div>
            </div>
          </div>

          <!-- PHASE 3: VERIFIKASI SERVER & PENANGANAN -->
          <div class="phase-box server-zone">
            <div class="phase-header">
              <div class="phase-title">
                <span>🛡️</span> 3. Verifikasi Server Nir-IP
              </div>
              <span class="phase-tag tag-emerald">Zero-Trust Gateway</span>
            </div>

            <div class="step-card">
              <div class="step-num">Langkah 3.1 • Validasi Root & Nullifier</div>
              <div class="step-title">Cek Keunikan Anti-Double-Submit</div>
              <div class="step-formula formula-green">
                Root_Merkle ∈ ActiveSchoolRoots ∧<br>
                NullifierHash ∉ UsedNullifiers_DB
              </div>
              <div class="step-desc">Server memastikan akar pohon sekolah valid dan menolak jika NullifierHash sudah pernah dipakai di scope yang sama.</div>
            </div>

            <div class="step-card">
              <div class="step-num">Langkah 3.2 • Verifikasi Pairing Kriptografi</div>
              <div class="step-title">Verifikasi Persamaan Bilinear Pairing</div>
              <div class="step-formula formula-green">
                e(A, B) = e(α, β) · e(∑ x_i · γ_i, δ) · e(C, δ)<br>
                Hasil: TRUE (Sah secara Matematis)
              </div>
              <div class="step-desc">Verifikasi tereksekusi dalam &lt; 5 ms di server tanpa memerlukan informasi identitas siswa atau alamat IP.</div>
            </div>

            <div class="step-card">
              <div class="step-num">Langkah 3.3 • Enkripsi Tiket & Penyimpanan</div>
              <div class="step-title">Disposisi & Chat Terenkripsi</div>
              <div class="step-formula formula-green">
                EncryptedPayload = AES_GCM(Laporan, K_sym)<br>
                TicketToken = BIP39_Passphrase + Salt
              </div>
              <div class="step-desc">Laporan disimpan terenkripsi; siswa memantau progres dan membalas pesan konseling menggunakan tiket anonim.</div>
            </div>
          </div>

        </div>

        <!-- TRANSIT & TRANSMISSION BRIDGE -->
        <div class="full-width-bridge">
          <div class="bridge-step">
            <div class="bridge-icon icon-blue">1</div>
            <div class="bridge-text">
              <div class="bridge-label">Pembangkitan Kunci Lokal</div>
              <div class="bridge-sub">s_null, s_trap, C (Memori Klien)</div>
            </div>
          </div>
          <div class="bridge-arrow">➔</div>
          <div class="bridge-step">
            <div class="bridge-icon icon-purple">2</div>
            <div class="bridge-text">
              <div class="bridge-label">Komputasi Bukti zk-SNARK</div>
              <div class="bridge-sub">π (128 Bytes) + Nullifier + SignalHash</div>
            </div>
          </div>
          <div class="bridge-arrow">➔</div>
          <div class="bridge-step">
            <div class="bridge-icon icon-purple">3</div>
            <div class="bridge-text">
              <div class="bridge-label">Transmisi Nir-Metadata</div>
              <div class="bridge-sub">Stripped IP, Zero Cookies, HTTPS POST</div>
            </div>
          </div>
          <div class="bridge-arrow">➔</div>
          <div class="bridge-step">
            <div class="bridge-icon icon-green">4</div>
            <div class="bridge-text">
              <div class="bridge-label">Verifikasi Pairing Server</div>
              <div class="bridge-sub">Evaluasi Polinomial &lt; 5ms</div>
            </div>
          </div>
          <div class="bridge-arrow">➔</div>
          <div class="bridge-step">
            <div class="bridge-icon icon-green">5</div>
            <div class="bridge-text">
              <div class="bridge-label">Disposisi Penanganan Aman</div>
              <div class="bridge-sub">Guru BK / Dinas / UPTD PPA</div>
            </div>
          </div>
        </div>

        <!-- BOTTOM GUARANTEES (4 PILARS) -->
        <div class="bottom-grid">
          <div class="guarantee-card">
            <div class="g-header">
              <div class="g-dot dot-cyan"></div>
              <div class="g-title">Mathematical Anonymity</div>
            </div>
            <div class="g-desc">Privasi dijamin oleh teorema kriptografi, bukan sekadar janji kebijakan privasi server.</div>
          </div>
          <div class="guarantee-card">
            <div class="g-header">
              <div class="g-dot dot-purple"></div>
              <div class="g-title">Tamper-Proof Integrity</div>
            </div>
            <div class="g-desc">Muatan laporan terikat langsung ke sinyal publik ZKP melalui SHA-256 integrity digest.</div>
          </div>
          <div class="guarantee-card">
            <div class="g-header">
              <div class="g-dot dot-amber"></div>
              <div class="g-title">Sybil & Double-Spam Proof</div>
            </div>
            <div class="g-desc">Nullifier Hash deterministik menggagalkan spam ganda tanpa perlu melacak ID pengirim.</div>
          </div>
          <div class="guarantee-card">
            <div class="g-header">
              <div class="g-dot dot-emerald"></div>
              <div class="g-title">Zero Metadata Leakage</div>
            </div>
            <div class="g-desc">Arsitektur nir-IP memotong pencatatan alamat IP dan sidik jari perangkat di gateway.</div>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const element = await page.$(".card");
  const outputPath = path.join(outputDir, "diagram_kriptografi_zkp.png");
  await element.screenshot({ path: outputPath });
  console.log(`✅ Berhasil membuat gambar diagram kriptografi di: ${outputPath}`);

  await browser.close();
}

generateCryptoFlowDiagram().catch(err => {
  console.error("Error generating diagram:", err);
  process.exit(1);
});
