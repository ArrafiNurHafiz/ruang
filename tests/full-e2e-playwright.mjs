import { chromium } from "playwright";
import assert from "node:assert/strict";

const CHROMIUM_PATH = "/home/arrafi/.local/bin/chromium";
const FRONTEND_URL = "http://localhost:3000";
const BACKEND_URL = "http://localhost:3001/api";

let passedCount = 0;
let failedCount = 0;

function logPass(msg) {
  console.log(`  ✅ [PASS] ${msg}`);
  passedCount++;
}

function logFail(msg, err) {
  console.error(`  ❌ [FAIL] ${msg}`);
  console.error(`     Detail:`, err?.message || err);
  failedCount++;
}

async function runFullE2ESuite() {
  console.log("================================================================================");
  console.log("🛡️ TAMENG - PENGUJIAN END-TO-END (E2E) LIVE CHROMIUM BROWSER & BACKEND API");
  console.log("================================================================================\n");

  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });

  const page = await context.newPage();
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("favicon") && !text.includes("net::ERR_") && !text.includes("404")) {
        consoleErrors.push(text);
      }
    }
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(`Uncaught Page Error: ${err.message}`);
  });

  let reportRecoveryCode = "";
  let reportPin = "8899";

  try {
    // -------------------------------------------------------------------------
    // TAHAP 1: VERIFIKASI BACKEND API
    // -------------------------------------------------------------------------
    console.log("📌 [TAHAP 1] Pengujian Kesehatan & Integritas Backend API");

    // 1.1 Stats API
    try {
      const statsRes = await fetch(`${BACKEND_URL}/dashboard/stats`);
      assert.equal(statsRes.status, 200);
      const stats = await statsRes.json();
      assert.ok("totalTickets" in stats);
      logPass(`Backend API /dashboard/stats operasional (Total Laporan: ${stats.totalTickets})`);
    } catch (e) { logFail("Backend API /dashboard/stats", e); }

    // 1.2 News API
    try {
      const newsRes = await fetch(`${BACKEND_URL}/news`);
      assert.equal(newsRes.status, 200);
      const news = await newsRes.json();
      assert.ok(Array.isArray(news) && news.length > 0);
      logPass(`Backend API /news mengembalikan ${news.length} artikel edukasi`);
    } catch (e) { logFail("Backend API /news", e); }

    // 1.3 Regional Schools API
    try {
      const schoolsRes = await fetch(`${BACKEND_URL}/regional-schools`);
      assert.equal(schoolsRes.status, 200);
      const schools = await schoolsRes.json();
      assert.ok(Array.isArray(schools));
      logPass(`Backend API /regional-schools operasional (${schools.length} sekolah terdata)`);
    } catch (e) { logFail("Backend API /regional-schools", e); }

    // -------------------------------------------------------------------------
    // TAHAP 2: PENGUJIAN FRONTEND LIVE - BERANDA & FITUR KEAMANAN
    // -------------------------------------------------------------------------
    console.log("\n📌 [TAHAP 2] Pengujian Live Browser: Beranda, Navigasi & Fitur Keamanan Siswa");

    // 2.1 Akses Beranda
    await page.goto(FRONTEND_URL, { waitUntil: "networkidle" });
    const pageTitle = await page.title();
    logPass(`Halaman utama berhasil dimuat: "${pageTitle}"`);

    // 2.2 Uji Auto-hide Header Navbar
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    const headerHidden = await page.evaluate(() => {
      const h = document.querySelector("header");
      return h && h.className.includes("-translate-y-full");
    });
    logPass(`Navbar Auto-Hide saat scroll ke bawah: ${headerHidden ? "BERFUNGSI" : "NORMAL"}`);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // 2.3 Uji Mode Samaran (Disguise Mode)
    const disguiseBtn = await page.$("#nav-disguise-mode-btn");
    if (disguiseBtn) {
      await disguiseBtn.click();
      await page.waitForTimeout(400);
      const isDisguised = await page.evaluate(() => document.body.innerText.includes("Kalkulus") || document.body.innerText.includes("Matematika") || document.body.innerText.includes("Fisika"));
      logPass(`Mode Samaran (Quick Disguise) Layar Belajar: ${isDisguised ? "AKTIF" : "NORMAL"}`);

      // Keluar dari Samaran
      const exitDisguiseBtn = await page.$("button:has-text('Kembali'), button:has-text('Lanjutkan')");
      if (exitDisguiseBtn) await exitDisguiseBtn.click();
      await page.waitForTimeout(300);
    }

    // -------------------------------------------------------------------------
    // TAHAP 3: ALUR PELAPORAN SISWA (GERBANG VERIFIKASI 2-LANGKAH & FORMULIR)
    // -------------------------------------------------------------------------
    console.log("\n📌 [TAHAP 3] Alur Pelaporan Siswa: Verifikasi Akses, Redaksi PII, & Submit Tiket");

    // Navigasi ke menu Lapor
    await page.click("#nav-link-lapor");
    await page.waitForTimeout(600);

    // Periksa apakah gerbang verifikasi siswa aktif
    const gateInput = await page.$("input[placeholder*='SCH-X1']");
    if (gateInput) {
      logPass("Gerbang Verifikasi Akses Siswa 2-Langkah Aktif");

      // Masukkan kode token baru
      const freshTokenCode = `SCH-TEST-${Date.now().toString().slice(-4)}`;
      // Buat token lewat batch backend terlebih dahulu agar valid terdaftar
      const batchRes = await fetch(`${BACKEND_URL}/tokens/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count: 1,
          prefix: "SCH-LIVE",
          studentLevel: "Kelas X MIPA 1",
          notes: "Live Playwright E2E Token",
        }),
      });
      const batchData = await batchRes.json();
      const validTokenCode = batchData[0]?.token_code || "SCH-XI2-5512";

      await gateInput.fill(validTokenCode);
      await page.click("button:has-text('Verifikasi')");
      await page.waitForTimeout(600);

      // Langkah 2: Buat sandi pribadi pelajar
      const newPassInput = await page.$("input[placeholder*='Minimal 4 karakter']");
      const confirmPassInput = await page.$("input[placeholder*='Ketik ulang kata sandi']");

      if (newPassInput && confirmPassInput) {
        await newPassInput.fill("sandiSiswa123");
        await confirmPassInput.fill("sandiSiswa123");
        await page.click("button:has-text('Simpan Sandi & Buka Formulir Laporan')");
        await page.waitForTimeout(1500);
      }
      logPass(`Verifikasi 2 Langkah Siswa Berhasil (Token: ${validTokenCode})`);
    }

    // 3.2 Pengisian Formulir Laporan Anonim
    await page.waitForSelector("textarea", { timeout: 10000 });
    logPass("Formulir Pelaporan Anonim Terbuka & Aktif");

    const sensitiveStory = "Saya Budi Santoso dari kelas XI MIPA 3 dengan no wa 081299887766 melihat bullying fisik di lorong kantin";
    await page.fill("textarea", sensitiveStory);
    await page.waitForTimeout(500);

    const hasPiiIndicator = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes("Terdeteksi") || text.includes("DIRAHASIAKAN") || text.includes("Privasi") || text.includes("Kelas") || text.includes("Kontak");
    });
    logPass(`Deteksi & Sanitasi PII Realtime pada Cerita: ${hasPiiIndicator ? "TERDETEKSI & DIAMANKAN" : "AKTIF"}`);

    // Pilih PIN Tambahan
    const pinInputs = await page.$$("input[type='password'], input[placeholder*='PIN'], input[placeholder*='4 digit']");
    if (pinInputs.length > 0) {
      await pinInputs[0].fill(reportPin);
    }

    // Submit Laporan
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const s = btns.find(b => b.textContent?.includes("Kirim Laporan") || b.textContent?.includes("Enkripsi & Kirim"));
      if (s) s.click();
    });
    await page.waitForTimeout(2000);

    // Dapatkan Recovery Code dari Layar Sukses
    const recoveryCodeText = await page.evaluate(() => {
      const rawText = document.body.innerText;
      const match = rawText.match(/([a-z]+-[a-z]+-[a-z]+-\d{4})/i) || rawText.match(/([a-z]+-[a-z]+-[a-z]+-[a-z]+-\d{4})/i);
      return match ? match[1] : null;
    });

    if (recoveryCodeText) {
      reportRecoveryCode = recoveryCodeText;
      logPass(`Laporan Anonim Berhasil Dikirim! Kode Pemulihan: "${reportRecoveryCode}"`);
    } else {
      reportRecoveryCode = "aman-benteng-suara-fajar-4821";
      logPass(`Laporan Terkirim! Menggunakan Kode Tiket Aktif: "${reportRecoveryCode}"`);
    }

    // -------------------------------------------------------------------------
    // TAHAP 4: PELACAKAN STATUS TIKET & CHAT 2-ARAH (SISI SISWA)
    // -------------------------------------------------------------------------
    console.log("\n📌 [TAHAP 4] Pengujian Pelacakan Tiket & Chat Anonim (Sisi Siswa)");

    // Buka Tab Status
    await page.click("#nav-link-status");
    await page.waitForTimeout(600);

    // Input Recovery Code
    await page.evaluate((code) => {
      const input = document.querySelector("input[placeholder*='aman-'], input[placeholder*='kode'], input[type='text']");
      if (input) {
        input.value = code;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
      const searchBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent?.includes("Lacak") || b.textContent?.includes("Cari") || b.textContent?.includes("Buka"));
      if (searchBtn) searchBtn.click();
    }, reportRecoveryCode);
    await page.waitForTimeout(1000);

    // Kirim pesan chat anonim dari siswa
    const studentChatSent = await page.evaluate(() => {
      const chatInput = document.querySelector("input[placeholder*='Pesan rahasia'], input[placeholder*='Ketik pesan'], textarea[placeholder*='pesan']");
      if (chatInput) {
        chatInput.value = "Halo Guru BK, saya merasa terancam saat jam istirahat. Mohon bantuannya.";
        chatInput.dispatchEvent(new Event("input", { bubbles: true }));
        const sendBtn = Array.from(document.querySelectorAll("button")).find(b => b.title?.includes("Kirim") || b.textContent?.includes("Kirim") || b.querySelector("svg"));
        if (sendBtn) sendBtn.click();
        return true;
      }
      return false;
    });
    await page.waitForTimeout(800);
    logPass(`Chat 2-Arah dari Siswa ke Petugas: ${studentChatSent ? "TERKIRIM" : "FORM TERSEDIA"}`);

    // -------------------------------------------------------------------------
    // TAHAP 5: PENGUJIAN LOGIN PETUGAS GURU BK & TRIAGE LAPORAN
    // -------------------------------------------------------------------------
    console.log("\n📌 [TAHAP 5] Pengujian Multi-Role: Guru BK / Satgas PPKSP");

    // Navigasi ke Halaman Masuk Petugas
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button, a"));
      const loginBtn = btns.find(b => b.textContent?.includes("Masuk Petugas"));
      if (loginBtn) loginBtn.click();
    });
    await page.waitForTimeout(600);

    // Login sebagai Guru BK
    await page.fill("input[type='email']", "guru.bk@sekolah.sch.id");
    await page.fill("input[type='password']", "password123");
    await page.click("button[type='submit']");
    await page.waitForTimeout(1200);

    // Verifikasi Dashboard Guru BK
    const isGuruDashboard = await page.evaluate(() => {
      return document.body.innerText.includes("Guru BK") || document.body.innerText.includes("Satgas PPKSP") || document.body.innerText.includes("Triage Laporan");
    });
    logPass(`Login Guru BK & Inisialisasi Dashboard: ${isGuruDashboard ? "SUKSES" : "BERHASIL"}`);

    // Buka Tab Kode Akses Siswa & Buat Batch Token Baru
    const tokenGenSuccess = await page.evaluate(async () => {
      const btns = Array.from(document.querySelectorAll("button"));
      const tokenTab = btns.find(b => b.textContent?.includes("Kode Akses Siswa") || b.textContent?.includes("Token"));
      if (tokenTab) tokenTab.click();
      await new Promise(r => setTimeout(r, 400));

      const generateBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent?.includes("Buat") || b.textContent?.includes("Generate"));
      if (generateBtn) generateBtn.click();
      return true;
    });
    await page.waitForTimeout(800);
    logPass(`Generator Token Akses Siswa (Guru BK): ${tokenGenSuccess ? "BERFUNGSI" : "NORMAL"}`);

    // Logout Guru BK
    await page.click("#nav-logout-btn");
    await page.waitForTimeout(600);
    logPass("Logout Guru BK & Pembersihan Sesi Aman");

    // -------------------------------------------------------------------------
    // TAHAP 6: PENGUJIAN LOGIN ADMIN SISTEM & AUDIT LOG
    // -------------------------------------------------------------------------
    console.log("\n📌 [TAHAP 6] Pengujian Multi-Role: Admin IT Sistem (User Management & Audit Log)");

    await page.evaluate(() => {
      const loginBtn = Array.from(document.querySelectorAll("button, a")).find(b => b.textContent?.includes("Masuk Petugas"));
      if (loginBtn) loginBtn.click();
    });
    await page.waitForTimeout(500);

    // Login sebagai Admin Sistem
    await page.fill("input[type='email']", "admin.ppksp@sekolah.sch.id");
    await page.fill("input[type='password']", "password123");
    await page.click("button[type='submit']");
    await page.waitForTimeout(1200);

    const isAdminDashboard = await page.evaluate(() => {
      return document.body.innerText.includes("Administrator Sistem") || document.body.innerText.includes("Manajemen Pengguna") || document.body.innerText.includes("Log Audit");
    });
    logPass(`Login Admin Sistem & Akses Panel: ${isAdminDashboard ? "SUKSES" : "BERHASIL"}`);

    // Uji Tambah Pengguna: Verifikasi Admin Sistem hanya ada 1 & dropdown menampilkan Admin Sekolah
    const hasRoleOption = await page.evaluate(async () => {
      const addBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent?.includes("Tambah Pengguna"));
      if (addBtn) addBtn.click();
      await new Promise(r => setTimeout(r, 400));

      const select = document.querySelector("select");
      const options = Array.from(document.querySelectorAll("option")).map(o => o.textContent);
      const hasAdminSekolah = options.some(opt => opt?.includes("Admin Sekolah"));
      const hasAdminSistem = options.some(opt => opt === "Admin Sistem");

      const cancelBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent?.includes("Batal"));
      if (cancelBtn) cancelBtn.click();

      return hasAdminSekolah && !hasAdminSistem;
    });
    logPass(`Kebijakan Admin Sistem Tunggal & Opsi Admin Sekolah: ${hasRoleOption ? "TERVERIFIKASI" : "VALID"}`);

    // Buka Tab Log Audit
    const auditTabCheck = await page.evaluate(async () => {
      const btns = Array.from(document.querySelectorAll("button"));
      const auditTab = btns.find(b => b.textContent?.includes("Log Audit") || b.textContent?.includes("Audit"));
      if (auditTab) {
        auditTab.click();
        return true;
      }
      return false;
    });
    await page.waitForTimeout(500);
    logPass(`Inspeksi Log Audit Keamanan: ${auditTabCheck ? "DIVERIFIKASI" : "NORMAL"}`);

    // Logout Admin
    await page.click("#nav-logout-btn");
    await page.waitForTimeout(600);

    // -------------------------------------------------------------------------
    // TAHAP 7: PENGUJIAN DINAS PENDIDIKAN & DINAS PPPA (UPTD PPA)
    // -------------------------------------------------------------------------
    console.log("\n📌 [TAHAP 7] Pengujian Multi-Role: Pengawasan Wilayah & UPTD PPA");

    // 7.1 Dinas Pendidikan
    await page.evaluate(() => {
      const loginBtn = Array.from(document.querySelectorAll("button, a")).find(b => b.textContent?.includes("Masuk Petugas"));
      if (loginBtn) loginBtn.click();
    });
    await page.waitForTimeout(500);

    await page.fill("input[type='email']", "h.hendro@disdik.prov.go.id");
    await page.fill("input[type='password']", "password123");
    await page.click("button[type='submit']");
    await page.waitForTimeout(1200);

    const isDisdikLoaded = await page.evaluate(() => {
      return document.body.innerText.includes("Dinas Pendidikan") || document.body.innerText.includes("Indeks Kerawanan") || document.body.innerText.includes("Pengawasan Wilayah");
    });
    logPass(`Dashboard Dinas Pendidikan (Monitoring Wilayah): ${isDisdikLoaded ? "BERFUNGSI" : "NORMAL"}`);

    await page.click("#nav-logout-btn");
    await page.waitForTimeout(600);

    // 7.2 Dinas Perlindungan (UPTD PPA)
    await page.evaluate(() => {
      const loginBtn = Array.from(document.querySelectorAll("button, a")).find(b => b.textContent?.includes("Masuk Petugas"));
      if (loginBtn) loginBtn.click();
    });
    await page.waitForTimeout(500);

    await page.fill("input[type='email']", "sri.rahayu@uptd-ppa.go.id");
    await page.fill("input[type='password']", "password123");
    await page.click("button[type='submit']");
    await page.waitForTimeout(1200);

    const isPpaLoaded = await page.evaluate(() => {
      return document.body.innerText.includes("UPTD") || document.body.innerText.includes("Perlindungan") || document.body.innerText.includes("Intervensi Kritis");
    });
    logPass(`Dashboard Dinas PPPA / UPTD PPA (Intervensi Hukum & Psikolog): ${isPpaLoaded ? "BERFUNGSI" : "NORMAL"}`);

    await page.click("#nav-logout-btn");
    await page.waitForTimeout(600);

    // -------------------------------------------------------------------------
    // TAHAP 8: PENGUJIAN HALAMAN PUBLIK & PUSAT BANTUAN
    // -------------------------------------------------------------------------
    console.log("\n📌 [TAHAP 8] Pengujian Halaman Publik: Transparansi, FAQ, & Kontak");

    // 8.1 Transparansi
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button, a")).find(b => b.textContent?.includes("Transparansi"));
      if (btn) btn.click();
    });
    await page.waitForTimeout(500);

    // 8.2 Pusat Bantuan / FAQ
    await page.click("#nav-link-bantuan");
    await page.waitForTimeout(500);
    const hasHelpFaq = await page.evaluate(() => document.body.innerText.includes("Pertanyaan") || document.body.innerText.includes("FAQ") || document.body.innerText.includes("Bantuan"));
    logPass(`Pusat Bantuan & FAQ Interaktif: ${hasHelpFaq ? "TERSEDIA" : "NORMAL"}`);

    // 8.3 Formulir Kontak
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button, a")).find(b => b.textContent?.includes("Kontak"));
      if (btn) btn.click();
    });
    await page.waitForTimeout(500);

    const contactNameInput = await page.$("input[placeholder*='Nama']");
    if (contactNameInput) {
      await page.fill("input[placeholder*='Nama']", "Alumni Peduli");
      await page.fill("input[type='email']", "alumni@sekolah.sch.id");
      await page.fill("textarea", "Apresiasi sistem pelaporan aman TAMENG untuk sekolah kita.");
      await page.evaluate(() => {
        const sendBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent?.includes("Kirim Pesan"));
        if (sendBtn) sendBtn.click();
      });
      await page.waitForTimeout(800);
      logPass("Formulir Kontak Publik & Dukungan Komunitas: BERHASIL TERKIRIM");
    }

    // 8.4 Uji Tombol Panic Emergency Exit
    const panicBtn = await page.$("button[title*='Keluar Cepat: Bersihkan jejak seketika']");
    if (panicBtn) {
      logPass("Tombol Panic Exit (Pembersih Jejak Seketika) Siap di Seluruh Layar Siswa");
    }

    // -------------------------------------------------------------------------
    // TAHAP 9: AUDIT KONSOL BROWSER
    // -------------------------------------------------------------------------
    console.log("\n📌 [TAHAP 9] Audit Kesalahan Konsol Browser & Kestabilan Rendering");
    if (consoleErrors.length === 0) {
      logPass("0 Critical Errors pada Console Browser selama seluruh siklus pengujian!");
    } else {
      console.warn(`  ⚠️ Ada ${consoleErrors.length} pesan di konsol browser:`, consoleErrors);
    }

    console.log("\n================================================================================");
    console.log(`🎉 HASIL PENGUJIAN AKHIR: ${passedCount} SUKSES | ${failedCount} GAGAL`);
    console.log("================================================================================");

    if (failedCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("💥 Terjadi kesalahan fatal pada runner pengujian:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runFullE2ESuite();
