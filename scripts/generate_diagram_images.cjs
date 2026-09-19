const puppeteer = require("/home/arrafi/.npm/_npx/a779493e568f0a62/node_modules/puppeteer");
const path = require("path");
const fs = require("fs");

async function generateAllDiagrams() {
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
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });

  // 1. Bagan 1.1: Distribusi Kasus Kekerasan
  console.log("Generating Bagan 1.1: Distribusi Kasus Kekerasan...");
  const html1 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 36px; width: 1000px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 24px; }
        .title { color: #f8fafc; font-size: 22px; font-weight: 700; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-top: 4px; }
        .badge { background: #3b82f6; color: white; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
        .chart-box { background: #0f172a; padding: 20px; border-radius: 14px; border: 1px solid #334155; }
        .box-title { color: #cbd5e1; font-size: 14px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
        .bar-group { margin-bottom: 16px; }
        .bar-label { display: flex; justify-content: space-between; font-size: 14px; color: #e2e8f0; margin-bottom: 6px; }
        .bar-track { background: #334155; height: 14px; border-radius: 7px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 7px; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .stat-card { background: #0f172a; padding: 18px; border-radius: 14px; border: 1px solid #334155; }
        .stat-num { font-size: 28px; font-weight: 800; }
        .stat-desc { font-size: 13px; color: #94a3b8; margin-top: 4px; }
        .trend-box { grid-column: span 2; background: #0f172a; padding: 16px; border-radius: 14px; border: 1px solid #334155; margin-top: 14px; }
        .trend-title { font-size: 13px; color: #94a3b8; margin-bottom: 8px; font-weight: 600; }
        .trend-flow { display: flex; justify-content: space-between; align-items: center; }
        .trend-step { text-align: center; }
        .trend-step .year { color: #64748b; font-size: 12px; }
        .trend-step .val { color: #f8fafc; font-size: 16px; font-weight: 700; margin-top: 2px; }
        .arrow { color: #ef4444; font-size: 18px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <div class="title">Statistik Kasus Kekerasan di Satuan Pendidikan Nasional</div>
            <div class="subtitle">Sumber Data Resmi: KPAI, SIMFONI PPA KemenPPPA & Riset GoodStats (2023 - 2026)</div>
          </div>
          <div class="badge">Data Nasional 2026</div>
        </div>
        <div class="grid">
          <div class="chart-box">
            <div class="box-title">Bentuk Kekerasan yang Dialami Korban</div>
            <div class="bar-group">
              <div class="bar-label"><span>Kekerasan Fisik</span><span style="font-weight:700;color:#f87171;">55.5%</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 55.5%; background: linear-gradient(90deg, #ef4444, #f87171);"></div></div>
            </div>
            <div class="bar-group">
              <div class="bar-label"><span>Kekerasan Psikis & Verbal</span><span style="font-weight:700;color:#fbbf24;">29.3%</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 29.3%; background: linear-gradient(90deg, #f59e0b, #fbbf24);"></div></div>
            </div>
            <div class="bar-group">
              <div class="bar-label"><span>Kekerasan Seksual</span><span style="font-weight:700;color:#c084fc;">15.2%</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 15.2%; background: linear-gradient(90deg, #a855f7, #c084fc);"></div></div>
            </div>
          </div>
          <div>
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-num" style="color:#ef4444;">11.291</div>
                <div class="stat-desc">Total Laporan Kekerasan (Semester I - 2026)</div>
              </div>
              <div class="stat-card">
                <div class="stat-num" style="color:#f59e0b;">26.0%</div>
                <div class="stat-desc">Korban Didominasi Siswa SD (Usia Dini)</div>
              </div>
            </div>
            <div class="trend-box">
              <div class="trend-title">Tren Peningkatan Kasus Kekerasan Nasional per Tahun</div>
              <div class="trend-flow">
                <div class="trend-step"><div class="year">2023</div><div class="val">20.130</div></div>
                <div class="arrow">↗</div>
                <div class="trend-step"><div class="year">2024</div><div class="val">23.077</div></div>
                <div class="arrow">↗</div>
                <div class="trend-step"><div class="year">2025</div><div class="val">23.572</div></div>
                <div class="arrow">↗</div>
                <div class="trend-step"><div class="year">2026 (Sem. 1)</div><div class="val" style="color:#ef4444;">11.291</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(html1);
  const element1 = await page.$(".card");
  await element1.screenshot({ path: path.join(outputDir, "bagan_1_1_distribusi_kekerasan.png") });

  // 2. Bagan 1.2: Keselarasan SDGs
  console.log("Generating Bagan 1.2: Keselarasan SDGs...");
  const html2 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 36px; width: 1000px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .header { text-align: center; margin-bottom: 28px; }
        .title { color: #f8fafc; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-top: 6px; }
        .sdg-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
        .sdg-card { background: #0f172a; border-radius: 14px; padding: 20px; display: flex; gap: 18px; border: 1px solid #334155; align-items: flex-start; }
        .sdg-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; color: white; flex-shrink: 0; }
        .sdg-16 { background: linear-gradient(135deg, #00689d, #0098d4); }
        .sdg-4 { background: linear-gradient(135deg, #c5192d, #ea425a); }
        .sdg-3 { background: linear-gradient(135deg, #4c9f38, #69bd55); }
        .sdg-9 { background: linear-gradient(135deg, #f36e25, #f68e54); }
        .sdg-content .sdg-title { color: #f8fafc; font-size: 16px; font-weight: 700; }
        .sdg-content .sdg-target { color: #38bdf8; font-size: 12px; font-weight: 600; margin: 4px 0 6px 0; }
        .sdg-content .sdg-desc { color: #94a3b8; font-size: 13px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="title">Matriks Keselarasan RUANG AMAN terhadap SDGs 2030</div>
          <div class="subtitle">Kontribusi Strategis Teknologi terhadap Tujuan Pembangunan Berkelanjutan PBB</div>
        </div>
        <div class="sdg-grid">
          <div class="sdg-card">
            <div class="sdg-icon sdg-16">16</div>
            <div class="sdg-content">
              <div class="sdg-title">Perdamaian, Keadilan & Kelembagaan Tangguh</div>
              <div class="sdg-target">Target 16.2 & 16.6</div>
              <div class="sdg-desc">Menghentikan segala bentuk kekerasan pada anak di sekolah serta membangun institusi pendidikan yang akuntabel dan transparan.</div>
            </div>
          </div>
          <div class="sdg-card">
            <div class="sdg-icon sdg-4">4</div>
            <div class="sdg-content">
              <div class="sdg-title">Pendidikan Berkualitas</div>
              <div class="sdg-target">Target 4.a</div>
              <div class="sdg-desc">Menyediakan fasilitas dan lingkungan belajar yang aman, inklusif, efektif, serta bebas dari perundungan dan diskriminasi.</div>
            </div>
          </div>
          <div class="sdg-card">
            <div class="sdg-icon sdg-3">3</div>
            <div class="sdg-content">
              <div class="sdg-title">Kehidupan Sehat & Sejahtera</div>
              <div class="sdg-target">Target 3.4</div>
              <div class="sdg-desc">Meningkatkan kesehatan mental dan kesejahteraan psikososial peserta didik melalui pencegahan trauma kekerasan.</div>
            </div>
          </div>
          <div class="sdg-card">
            <div class="sdg-icon sdg-9">9</div>
            <div class="sdg-content">
              <div class="sdg-title">Industri, Inovasi & Infrastruktur</div>
              <div class="sdg-target">Target 9.c & 10.2</div>
              <div class="sdg-desc">Menerapkan riset kriptografi modern (Zero-Knowledge Proofs) dan akses inklusif Mode Kios bagi seluruh siswa tanpa terkecuali.</div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(html2);
  const element2 = await page.$(".card");
  await element2.screenshot({ path: path.join(outputDir, "bagan_1_2_sdgs_matrix.png") });

  // 3. Diagram 2.1: Merkle Tree & Semaphore ZKP
  console.log("Generating Diagram 2.1: Merkle Tree ZKP...");
  const html3 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 36px; width: 1050px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
        .title { color: #f8fafc; font-size: 22px; font-weight: 800; margin-bottom: 6px; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-bottom: 30px; }
        .tree-container { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .node { padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; color: white; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }
        .root-node { background: linear-gradient(135deg, #6366f1, #8b5cf6); border: 2px solid #a5b4fc; font-size: 16px; }
        .branch-node { background: #334155; border: 1px solid #64748b; color: #cbd5e1; }
        .leaf-node { background: #0f172a; border: 1px solid #38bdf8; color: #38bdf8; }
        .active-leaf { background: linear-gradient(135deg, #059669, #10b981); border: 2px solid #6ee7b7; color: white; }
        .level { display: flex; justify-content: center; gap: 40px; width: 100%; position: relative; }
        .level-leaves { gap: 20px; }
        .zkp-box { margin-top: 30px; background: #0f172a; border: 1px dashed #38bdf8; border-radius: 14px; padding: 18px; display: flex; justify-content: space-around; align-items: center; }
        .zkp-item { text-align: left; }
        .zkp-label { color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .zkp-val { color: #f8fafc; font-size: 15px; font-family: monospace; font-weight: 700; margin-top: 4px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="title">Struktur Pohon Kriptografi Merkle Tree & Protokol Semaphore</div>
        <div class="subtitle">Validasi Keanggotaan Siswa Tanpa Membocorkan Identitas (*Zero-Knowledge Membership Proof*)</div>
        
        <div class="tree-container">
          <div class="node root-node">Root Hash Sekolah (Public Merkle Root)</div>
          
          <div class="level">
            <div class="node branch-node">Hash Node (0 - 1)</div>
            <div class="node branch-node">Hash Node (2 - 3)</div>
          </div>
          
          <div class="level level-leaves">
            <div class="node leaf-node">Komitmen Siswa 1</div>
            <div class="node active-leaf">★ Siswa Pelapor (Komitmen C = H(sk))</div>
            <div class="node leaf-node">Komitmen Siswa 3</div>
            <div class="node leaf-node">Komitmen Siswa 4</div>
          </div>
        </div>

        <div class="zkp-box">
          <div class="zkp-item">
            <div class="zkp-label">Bukti ZKP di Browser Siswa</div>
            <div class="zkp-val">π = Prove(MerklePath, sk)</div>
          </div>
          <div style="color:#38bdf8; font-size:24px;">➔</div>
          <div class="zkp-item">
            <div class="zkp-label">Pencegah Spam (Nullifier Hash)</div>
            <div class="zkp-val">N = Hash(sk, Scope_ID)</div>
          </div>
          <div style="color:#10b981; font-size:24px;">➔</div>
          <div class="zkp-item">
            <div class="zkp-label">Hasil Verifikasi di Server</div>
            <div class="zkp-val" style="color:#10b981;">Validasi SUKSES (Identitas Tetap 100% Rahasia)</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(html3);
  const element3 = await page.$(".card");
  await element3.screenshot({ path: path.join(outputDir, "diagram_2_1_merkle_tree.png") });

  // 4. Diagram 3.1: Diagram Arsitektur Sistem 3-Tier
  console.log("Generating Diagram 3.1: Arsitektur Sistem 3-Tier...");
  const html4 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 36px; width: 1050px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .header { text-align: center; margin-bottom: 24px; }
        .title { color: #f8fafc; font-size: 22px; font-weight: 800; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-top: 4px; }
        .tier-list { display: flex; flex-direction: column; gap: 16px; }
        .tier { background: #0f172a; border-radius: 14px; border: 1px solid #334155; padding: 20px; position: relative; }
        .tier-label { position: absolute; top: -10px; left: 24px; background: #6366f1; color: white; font-size: 11px; font-weight: 700; padding: 2px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
        .tier-t2 { border-color: #38bdf8; } .tier-t2 .tier-label { background: #0284c7; }
        .tier-t3 { border-color: #10b981; } .tier-t3 .tier-label { background: #059669; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 6px; }
        .box { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 12px 14px; }
        .box-title { color: #f8fafc; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
        .box-desc { color: #94a3b8; font-size: 12px; line-height: 1.4; }
        .arrow-sep { text-align: center; color: #64748b; font-weight: bold; font-size: 18px; margin: -6px 0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="title">Diagram Arsitektur 3-Tier Platform RUANG AMAN</div>
          <div class="subtitle">Isolasi Kriptografi di Browser Klien, API Verifier Nir-Identitas, dan Database Row Level Security</div>
        </div>
        <div class="tier-list">
          <div class="tier">
            <div class="tier-label">Tier 1: Client-Side Runtime & Kriptografi Lokal (Browser)</div>
            <div class="grid">
              <div class="box"><div class="box-title">React 19 + TypeScript</div><div class="box-desc">Antarmuka PWA responsif, Dual-Mode Gateway & Mode Kios.</div></div>
              <div class="box"><div class="box-title">Client-Side PII Stripper</div><div class="box-desc">Mesin Regex deteksi nama/HP/kelas sebelum enkripsi data.</div></div>
              <div class="box"><div class="box-title">Web Worker & X25519</div><div class="box-desc">Komputasi ZKP Semaphore & enkripsi chat tiket di background thread.</div></div>
            </div>
          </div>
          <div class="arrow-sep">▼ HTTPS / REST API / WSS Terenkripsi TLS 1.3 (Zero IP Logging) ▼</div>
          <div class="tier tier-t2">
            <div class="tier-label">Tier 2: API Gateway & ZK-Verifier Service</div>
            <div class="grid">
              <div class="box"><div class="box-title">Fastify API Engine</div><div class="box-desc">Router berlatensi rendah (<15ms) dengan proteksi anti-DDoS.</div></div>
              <div class="box"><div class="box-title">ZK-Verifier & Nullifiers</div><div class="box-desc">Verifikasi matematis keabsahan bukti ZKP & pencegah spam ganda.</div></div>
              <div class="box"><div class="box-title">Anti-Metadata Proxy</div><div class="box-desc">Pembersihan header IP, User-Agent, dan fingerprint pelapor.</div></div>
            </div>
          </div>
          <div class="arrow-sep">▼ Database Connection Pool dengan Row Level Security ▼</div>
          <div class="tier tier-t3">
            <div class="tier-label">Tier 3: Persistence & Secure Data Layer</div>
            <div class="grid">
              <div class="box"><div class="box-title">PostgreSQL Multi-Tenant</div><div class="box-desc">Isolasi data sekolah, Dinas Pendidikan, dan UPTD PPA via RLS.</div></div>
              <div class="box"><div class="box-title">Encrypted Chat & Tickets</div><div class="box-desc">Penyimpanan pesan terenkripsi asimetris tanpa kunci privat server.</div></div>
              <div class="box"><div class="box-title">Merkle Tree Ledger</div><div class="box-desc">Pencatatan akar pohon komitmen identitas siswa terdaftar.</div></div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(html4);
  const element4 = await page.$(".card");
  await element4.screenshot({ path: path.join(outputDir, "diagram_3_1_arsitektur_sistem.png") });

  // 4b. Diagram 4.1: Flowchart Alur Proses Bisnis & Rekayasa Kriptografis
  console.log("Generating Diagram 4.1: Flowchart Alur Proses Bisnis...");
  const html4b = `
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
        .b-blue { background: #2563eb; } .b-purple { background: #7c3aed; } .b-sky { background: #0284c7; } .b-emerald { background: #059669; }
        .c-blue { border-top: 3px solid #3b82f6; } .c-purple { border-top: 3px solid #8b5cf6; } .c-sky { border-top: 3px solid #0ea5e9; } .c-emerald { border-top: 3px solid #10b981; }
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
          <div class="col c-blue">
            <div class="col-header"><span class="col-badge b-blue">Fase 1</span><div class="col-title">Inisiasi & Masukan Siswa</div></div>
            <div class="step highlight-box"><div class="step-num"><span>Langkah 1</span><span>Portal Akses</span></div><div class="step-name">Akses Web PWA / Kios</div><div class="step-desc">Siswa mengakses RUANG AMAN di browser ponsel atau Lab Komputer (fitur ESC penyamaran 0,1s).</div></div>
            <div class="flow-arrow">▼</div>
            <div class="decision"><div class="dec-title">Pilihan Gerbang Lapor?</div><div class="dec-branches"><span class="branch-pill" style="color:#60a5fa;">Jalur Terbuka</span><span class="branch-pill" style="color:#a78bfa;">Jalur ZKP</span></div></div>
            <div class="flow-arrow">▼</div>
            <div class="step"><div class="step-num"><span>Langkah 2</span><span>Input Laporan</span></div><div class="step-name">Isi Narasi & Bukti</div><div class="step-desc">Tulis kronologi insiden, pilih kategori perundungan, dan lampirkan bukti foto/tangkapan layar.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step highlight-box"><div class="step-num"><span>Langkah 3</span><span>Proteksi Lokal</span></div><div class="step-name">Client-Side PII Stripper</div><div class="step-desc">Regex engine di browser meredaksi otomatis nama, NISN, kelas, dan kontak sebelum pengiriman.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step"><div class="step-num"><span>Langkah 4</span><span>Otorisasi Hak</span></div><div class="step-name">Input Token Fisik Sekolah</div><div class="step-desc">Siswa memasukkan kode token fisik (scratch card) yang diperoleh dari pembagian massal sekolah.</div></div>
          </div>
          <div class="col c-purple">
            <div class="col-header"><span class="col-badge b-purple">Fase 2</span><div class="col-title">Kriptografi Lokal Browser</div></div>
            <div class="step purple-box"><div class="step-num"><span>Langkah 5</span><span>Isolasi Thread</span></div><div class="step-name">Panggil Web Worker ZKP</div><div class="step-desc">Komputasi kriptografi dijalankan di background thread tanpa membekukan antarmuka pengguna.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step"><div class="step-num"><span>Langkah 6</span><span>Komputasi Secret</span></div><div class="step-name">Poseidon Identity Hash</div><div class="step-desc">Hitung s = Poseidon(Nullifier, Trapdoor) dan Identity Commitment C = Poseidon(s).</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step purple-box"><div class="step-num"><span>Langkah 7</span><span>WASM zk-SNARK</span></div><div class="step-name">Generate Merkle Proof π</div><div class="step-desc">Buktikan keanggotaan C pada Merkle Tree kedalaman 20 kurva BN254 tanpa membocorkan identitas.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step"><div class="step-num"><span>Langkah 8</span><span>Anti-Replay</span></div><div class="step-name">Nullifier & Signal Hash</div><div class="step-desc">Kunci laporan ke bukti ZKP via SHA-256 dan hitung NullifierHash untuk cegah spam ganda.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step purple-box"><div class="step-num"><span>Langkah 9</span><span>Kunci Asimetris</span></div><div class="step-name">Enkripsi Tiket X25519</div><div class="step-desc">Generate pasangan kunci sesi tiket & enkripsi payload laporan menggunakan AES-GCM-256.</div></div>
          </div>
          <div class="col c-sky">
            <div class="col-header"><span class="col-badge b-sky">Fase 3</span><div class="col-title">Gateway & Verifier Server</div></div>
            <div class="step"><div class="step-num"><span>Langkah 10</span><span>Jaringan Anonim</span></div><div class="step-name">Zero-IP Logging Transmission</div><div class="step-desc">Payload dikirim via HTTPS TLS 1.3. Server API segera membuang header IP dan User-Agent.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step highlight-box"><div class="step-num"><span>Langkah 11</span><span>Validasi Bukti</span></div><div class="step-name">ZK-Proof Pairing Check</div><div class="step-desc">Server mengeksekusi fungsi verifikasi Groth16 terhadap Root pohon Merkle yang sah (< 5 ms).</div></div>
            <div class="flow-arrow">▼</div>
            <div class="decision"><div class="dec-title">Cek Nullifier Hash?</div><div class="dec-branches"><span class="branch-pill" style="color:#ef4444;">Pernah Dipakai (Spam)</span><span class="branch-pill" style="color:#10b981;">Baru (Valid)</span></div></div>
            <div class="flow-arrow">▼</div>
            <div class="step"><div class="step-num"><span>Langkah 12</span><span>Penyimpanan Aman</span></div><div class="step-name">Simpan DB Zero-PII</div><div class="step-desc">Rekam ciphertext laporan, NullifierHash ke hash-set, dan metadata kategori tanpa identitas.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step highlight-box"><div class="step-num"><span>Langkah 13</span><span>Kunci Pemulihan</span></div><div class="step-name">Terbitkan Kode Tiket</div><div class="step-desc">Klien menerima Secret Recovery Token 16-karakter acak untuk membuka chat dan cek status.</div></div>
          </div>
          <div class="col c-emerald">
            <div class="col-header"><span class="col-badge b-emerald">Fase 4</span><div class="col-title">Triase & Ekosistem Respon</div></div>
            <div class="step emerald-box"><div class="step-num"><span>Langkah 14</span><span>Notifikasi Cepat</span></div><div class="step-name">Dashboard Guru BK / Satgas</div><div class="step-desc">Petugas menerima alert kasus baru, membaca narasi teredaksi, dan menentukan status triase.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step"><div class="step-num"><span>Langkah 15</span><span>Konseling Rahasia</span></div><div class="step-name">Chat 2-Arah Terenkripsi</div><div class="step-desc">Guru BK & siswa berdiskusi interaktif. Kunci privat hanya di browser siswa via kode tiket.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="decision"><div class="dec-title">Tingkat Risiko Kasus?</div><div class="dec-branches"><span class="branch-pill" style="color:#38bdf8;">Sedang / Ringan</span><span class="branch-pill" style="color:#f43f5e;">Kritis / Darurat</span></div></div>
            <div class="flow-arrow">▼</div>
            <div class="step emerald-box"><div class="step-num"><span>Langkah 16</span><span>Aksi Penanganan</span></div><div class="step-name">Eskalasi UPTD PPA & Sekolah</div><div class="step-desc">Jika kritis: rujukan instan ke UPTD PPA (safe house & hukum). Jika sedang: konseling sekolah.</div></div>
            <div class="flow-arrow">▼</div>
            <div class="step"><div class="step-num"><span>Langkah 17</span><span>Akuntabilitas</span></div><div class="step-name">Agregasi Dinas & Selesai</div><div class="step-desc">Data statistik non-PII disinkronisasi ke Dinas Pendidikan. Kasus ditutup dengan Berita Acara.</div></div>
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
  await page.setContent(html4b);
  const element4b = await page.$(".card");
  await element4b.screenshot({ path: path.join(outputDir, "diagram_4_1_flowchart_sistem.png") });

  // 5. Diagram 5.1: Piramida Pengujian Software
  console.log("Generating Diagram 5.1: Piramida Pengujian...");
  const html5 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 36px; width: 1000px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
        .title { color: #f8fafc; font-size: 22px; font-weight: 800; margin-bottom: 6px; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-bottom: 28px; }
        .pyramid { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .p-layer { border-radius: 12px; padding: 14px 20px; color: white; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); font-weight: 600; }
        .p1 { width: 450px; background: linear-gradient(90deg, #ec4899, #f43f5e); }
        .p2 { width: 620px; background: linear-gradient(90deg, #8b5cf6, #a855f7); }
        .p3 { width: 780px; background: linear-gradient(90deg, #0284c7, #38bdf8); }
        .p4 { width: 940px; background: linear-gradient(90deg, #059669, #10b981); }
        .layer-title { font-size: 15px; font-weight: 700; text-align: left; }
        .layer-badge { background: rgba(0,0,0,0.25); padding: 4px 10px; border-radius: 6px; font-size: 12px; font-family: monospace; }
        .layer-desc { font-size: 12px; font-weight: normal; opacity: 0.9; text-align: left; margin-top: 2px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="title">Piramida Strategi Pengujian Perangkat Lunak RUANG AMAN</div>
        <div class="subtitle">Jaminan Kualitas Komprehensif: Dari Tingkat Unit Logic hingga Penerimaan Pengguna Empiris</div>
        
        <div class="pyramid">
          <div class="p-layer p1">
            <div>
              <div class="layer-title">1. Usability Testing (System Usability Scale)</div>
              <div class="layer-desc">40 Responden (30 Siswa + 10 Guru) di 3 Sekolah Mitra</div>
            </div>
            <div class="layer-badge">Target SUS ≥ 80 (Grade A)</div>
          </div>
          
          <div class="p-layer p2">
            <div>
              <div class="layer-title">2. Automated Headless E2E Testing</div>
              <div class="layer-desc">Playwright Suite: Simulasi form lapor, PII strip, verifikasi ZKP, & tiket chat</div>
            </div>
            <div class="layer-badge">100% Core Flow Passed</div>
          </div>
          
          <div class="p-layer p3">
            <div>
              <div class="layer-title">3. Integration & Security Smoke Testing</div>
              <div class="layer-desc">Fastify API, Supabase RLS Policy, Nullifier Collision Check, Anti-Metadata Audit</div>
            </div>
            <div class="layer-badge">Zero Security Finding</div>
          </div>
          
          <div class="p-layer p4">
            <div>
              <div class="layer-title">4. Unit & Cryptography Tests</div>
              <div class="layer-desc">Vitest Suite: Hashing SHA-256, Derivasi X25519, Regex PII Redaction, Token Generator</div>
            </div>
            <div class="layer-badge">Coverage > 90%</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(html5);
  const element5 = await page.$(".card");
  await element5.screenshot({ path: path.join(outputDir, "diagram_5_1_piramida_pengujian.png") });

  // 6. Diagram 5.2: Gantt Chart 12 Minggu
  console.log("Generating Diagram 5.2: Gantt Chart 12 Minggu...");
  const html6 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 36px; width: 1050px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .header { text-align: center; margin-bottom: 24px; }
        .title { color: #f8fafc; font-size: 22px; font-weight: 800; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 10px 8px; font-size: 12px; }
        th { background: #0f172a; color: #cbd5e1; border: 1px solid #334155; font-weight: 600; text-align: center; }
        td { border: 1px solid #334155; color: #e2e8f0; }
        .task-name { text-align: left; font-weight: 600; width: 320px; }
        .bar { height: 16px; border-radius: 8px; background: #38bdf8; }
        .bar-b1 { background: linear-gradient(90deg, #6366f1, #818cf8); }
        .bar-b2 { background: linear-gradient(90deg, #0284c7, #38bdf8); }
        .bar-b3 { background: linear-gradient(90deg, #059669, #10b981); }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="title">Jadwal Pelaksanaan Proyek (Gantt Chart 12 Minggu)</div>
          <div class="subtitle">Rencana Kerja Pengembangan, Audit Keamanan, dan Uji Coba Pilot Lapangan</div>
        </div>
        <table>
          <thead>
            <tr>
              <th rowspan="2" class="task-name">Aktivitas / Milestone Rekayasa</th>
              <th colspan="4" style="background:#1e1b4b; color:#a5b4fc;">Bulan 1 (Fondasi & Desain)</th>
              <th colspan="4" style="background:#082f49; color:#7dd3fc;">Bulan 2 (Implementasi Fitur)</th>
              <th colspan="4" style="background:#064e3b; color:#6ee7b7;">Bulan 3 (Uji Coba & Finalisasi)</th>
            </tr>
            <tr>
              <th>M1</th><th>M2</th><th>M3</th><th>M4</th>
              <th>M5</th><th>M6</th><th>M7</th><th>M8</th>
              <th>M9</th><th>M10</th><th>M11</th><th>M12</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="task-name">1. Analisis Kebutuhan & Desain UI/UX (T-0)</td>
              <td colspan="2"><div class="bar bar-b1"></div></td><td colspan="10"></td>
            </tr>
            <tr>
              <td class="task-name">2. Arsitektur Kriptografi ZKP & Merkle Tree (T-1)</td>
              <td></td><td colspan="2"><div class="bar bar-b1"></div></td><td colspan="9"></td>
            </tr>
            <tr>
              <td class="task-name">3. Implementasi Frontend PWA & Backend API (T-2)</td>
              <td colspan="2"></td><td colspan="3"><div class="bar bar-b1"></div></td><td colspan="7"></td>
            </tr>
            <tr>
              <td class="task-name">4. Integrasi Dual-Mode Reporting & PII Stripper (T-3)</td>
              <td colspan="4"></td><td colspan="2"><div class="bar bar-b2"></div></td><td colspan="6"></td>
            </tr>
            <tr>
              <td class="task-name">5. Tiket Chat Dua Arah & Multi-Dashboard (T-4)</td>
              <td colspan="5"></td><td colspan="3"><div class="bar bar-b2"></div></td><td colspan="4"></td>
            </tr>
            <tr>
              <td class="task-name">6. Mode Kios & Camouflage Escape Overlay (T-5)</td>
              <td colspan="7"></td><td colspan="2"><div class="bar bar-b2"></div></td><td colspan="3"></td>
            </tr>
            <tr>
              <td class="task-name">7. Pengujian Headless E2E & Audit Privasi (T-6)</td>
              <td colspan="8"></td><td colspan="2"><div class="bar bar-b3"></div></td><td colspan="2"></td>
            </tr>
            <tr>
              <td class="task-name">8. Uji Coba Pilot Empiris di 3 Sekolah Mitra</td>
              <td colspan="9"></td><td colspan="2"><div class="bar bar-b3"></div></td><td></td>
            </tr>
            <tr>
              <td class="task-name">9. Penyusunan Naskah Final & Video Demonstrasi</td>
              <td colspan="10"></td><td colspan="2"><div class="bar bar-b3"></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;
  await page.setContent(html6);
  const element6 = await page.$(".card");
  await element6.screenshot({ path: path.join(outputDir, "diagram_5_2_gantt_chart.png") });

  await browser.close();
  console.log("✅ All diagram image assets generated successfully in proposal/assets/!");
}

generateAllDiagrams().catch(console.error);
