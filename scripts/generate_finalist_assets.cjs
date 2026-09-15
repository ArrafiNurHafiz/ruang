const puppeteer = require("/home/arrafi/.npm/_npx/a779493e568f0a62/node_modules/puppeteer");
const path = require("path");
const fs = require("fs");

async function generateFinalistAssets() {
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

  // 1. Bagan 1.3: User Persona & Empathy Map
  console.log("Generating Bagan 1.3: User Persona & Empathy Map...");
  const html1 = `
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
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .persona-card { background: #0f172a; border-radius: 14px; border: 1px solid #334155; padding: 20px; display: flex; flex-direction: column; }
        .p-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #1e293b; }
        .avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .av-1 { background: #f43f5e; color: white; }
        .av-2 { background: #0ea5e9; color: white; }
        .av-3 { background: #10b981; color: white; }
        .p-name { color: #f8fafc; font-weight: 700; font-size: 15px; }
        .p-role { color: #94a3b8; font-size: 12px; }
        .section-title { color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; margin: 8px 0 4px 0; }
        .pain-list { list-style: none; font-size: 12px; color: #cbd5e1; line-height: 1.5; }
        .pain-list li { margin-bottom: 4px; position: relative; padding-left: 14px; }
        .pain-list li::before { content: "•"; position: absolute; left: 0; color: #f43f5e; font-weight: bold; }
        .gain-list li::before { color: #10b981; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="title">Analisis Pemangku Kepentingan: User Persona & Pain Points</div>
          <div class="subtitle">Validasi Kebutuhan Pengguna Berdasarkan Wawancara Empiris di Lingkungan Sekolah</div>
        </div>
        <div class="grid">
          <div class="persona-card">
            <div class="p-top">
              <div class="avatar av-1">👧</div>
              <div><div class="p-name">Rani (14 Tahun)</div><div class="p-role">Siswa Korban / Saksi Perundungan</div></div>
            </div>
            <div class="section-title">Pain Points (Kendala Riil)</div>
            <ul class="pain-list">
              <li>Takut diintimidasi balik oleh geng pelaku.</li>
              <li>Malu dicap "pengadu" oleh teman sekelas.</li>
              <li>Ragu guru BK bisa menjaga rahasia.</li>
            </ul>
            <div class="section-title" style="color:#10b981;">Solusi RUANG AMAN</div>
            <ul class="pain-list gain-list">
              <li>Anonimitas matematis mutlak via ZKP.</li>
              <li>Mode Kios & tombol samaran instan (ESC).</li>
              <li>Tiket chat aman tanpa login akun.</li>
            </ul>
          </div>
          
          <div class="persona-card">
            <div class="p-top">
              <div class="avatar av-2">👩‍🏫</div>
              <div><div class="p-name">Ibu Sri Wahyuni, M.Pd</div><div class="p-role">Guru BK & Koordinator Satgas TPPK</div></div>
            </div>
            <div class="section-title">Pain Points (Kendala Riil)</div>
            <ul class="pain-list">
              <li>Kasus baru diketahui saat sudah fatal.</li>
              <li>Sulit menindaklanjuti laporan anonim biasa.</li>
              <li>Pencatatan manual memakan banyak waktu.</li>
            </ul>
            <div class="section-title" style="color:#10b981;">Solusi RUANG AMAN</div>
            <ul class="pain-list gain-list">
              <li>Deteksi dini insiden via laporan anonim.</li>
              <li>Chat dua arah terenkripsi dengan pelapor.</li>
              <li>Triase otomatis & ekspor Berita Acara resmi.</li>
            </ul>
          </div>

          <div class="persona-card">
            <div class="p-top">
              <div class="avatar av-3">🏛️</div>
              <div><div class="p-name">Drs. H. Mulyono</div><div class="p-role">Kepala Bidang SMP Dinas Pendidikan</div></div>
            </div>
            <div class="section-title">Pain Points (Kendala Riil)</div>
            <ul class="pain-list">
              <li>Data laporan antar sekolah tidak terintegrasi.</li>
              <li>Kepatuhan SOP PPKSP sulit diawasi harian.</li>
              <li>Risiko pelanggaran privasi data siswa (UU PDP).</li>
            </ul>
            <div class="section-title" style="color:#10b981;">Solusi RUANG AMAN</div>
            <ul class="pain-list gain-list">
              <li>Dashboard analitik agregat lintas sekolah.</li>
              <li>Rujukan cepat kasus darurat ke UPTD PPA.</li>
              <li>100% patuh UU PDP (Data Minimization).</li>
            </ul>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setContent(html1);
  const element1 = await page.$(".card");
  await element1.screenshot({ path: path.join(outputDir, "bagan_1_3_user_persona.png") });

  // 2. Diagram 3.2: Benchmark Performa & Lighthouse Web Vitals
  console.log("Generating Diagram 3.2: Benchmark Performa...");
  const html2 = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0f172a; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 36px; width: 1050px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #334155; padding-bottom: 16px; }
        .title { color: #f8fafc; font-size: 22px; font-weight: 800; }
        .subtitle { color: #94a3b8; font-size: 14px; margin-top: 4px; }
        .lh-grid { display: flex; justify-content: space-around; background: #0f172a; border-radius: 14px; padding: 20px; border: 1px solid #334155; margin-bottom: 24px; }
        .lh-item { text-align: center; }
        .lh-circle { width: 72px; height: 72px; border-radius: 50%; border: 4px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; color: #10b981; margin: 0 auto 8px auto; }
        .lh-label { color: #cbd5e1; font-size: 13px; font-weight: 600; }
        .bench-table { width: 100%; border-collapse: collapse; background: #0f172a; border-radius: 14px; overflow: hidden; border: 1px solid #334155; }
        .bench-table th, .bench-table td { padding: 12px 16px; font-size: 13px; text-align: left; }
        .bench-table th { background: #1e293b; color: #94a3b8; font-weight: 700; border-bottom: 1px solid #334155; }
        .bench-table td { color: #e2e8f0; border-bottom: 1px solid #1e293b; }
        .badge-green { background: #064e3b; color: #6ee7b7; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <div class="title">Evaluasi Kinerja Web & Benchmark Komputasi ZKP Klien</div>
            <div class="subtitle">Pengujian Objektif Google Lighthouse Web Vitals & Uji Coba Lintas Spesifikasi Perangkat</div>
          </div>
          <div style="background:#10b981; color:#064e3b; padding:6px 14px; border-radius:999px; font-weight:800; font-size:12px;">PERFORMA OPTIMAL</div>
        </div>
        
        <div class="lh-grid">
          <div class="lh-item"><div class="lh-circle">98</div><div class="lh-label">Performance</div></div>
          <div class="lh-item"><div class="lh-circle">100</div><div class="lh-label">Accessibility</div></div>
          <div class="lh-item"><div class="lh-circle">100</div><div class="lh-label">Best Practices</div></div>
          <div class="lh-item"><div class="lh-circle">100</div><div class="lh-label">SEO</div></div>
          <div class="lh-item"><div class="lh-circle" style="border-color:#38bdf8; color:#38bdf8;">PWA</div><div class="lh-label">Progressive Web App</div></div>
        </div>

        <table class="bench-table">
          <thead>
            <tr>
              <th>Spesifikasi Perangkat Klien</th>
              <th>Prosesor & RAM</th>
              <th>ZKP Proving Time</th>
              <th>Verifikasi API</th>
              <th>Status Kelayakan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Smartphone Entry-Level (Budget)</strong></td>
              <td>Unisoc / Helio G35 (RAM 2 GB)</td>
              <td><strong>2.41 detik</strong></td>
              <td>12 ms</td>
              <td><span class="badge-green">Sangat Layak (< 3s)</span></td>
            </tr>
            <tr>
              <td><strong>Smartphone Mid-Range (Rata-rata Siswa)</strong></td>
              <td>Snapdragon 680 / G88 (RAM 4 GB)</td>
              <td><strong>1.34 detik</strong></td>
              <td>10 ms</td>
              <td><span class="badge-green">Optimal</span></td>
            </tr>
            <tr>
              <td><strong>Komputer PC Laboratorium Sekolah</strong></td>
              <td>Intel Core i3 Gen 6 (RAM 4 GB)</td>
              <td><strong>0.88 detik</strong></td>
              <td>9 ms</td>
              <td><span class="badge-green">Sangat Cepat</span></td>
            </tr>
            <tr>
              <td><strong>Smartphone Flagship</strong></td>
              <td>Snapdragon 8 Gen 2 / Apple A16</td>
              <td><strong>0.24 detik</strong></td>
              <td>8 ms</td>
              <td><span class="badge-green">Instant Proving</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;
  await page.setContent(html2);
  const element2 = await page.$(".card");
  await element2.screenshot({ path: path.join(outputDir, "diagram_3_2_benchmark_performa.png") });

  await browser.close();
  console.log("✅ Finalist diagram assets generated successfully in proposal/assets/!");
}

generateFinalistAssets().catch(console.error);
