const puppeteer = require("/home/arrafi/.npm/_npx/a779493e568f0a62/node_modules/puppeteer");
const path = require("path");
const fs = require("fs");

async function captureAllProposalScreenshots() {
  const outputDir = path.resolve(__dirname, "../proposal/assets");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Launching headless browser to capture proposal assets...");
  const browser = await puppeteer.launch({
    executablePath: "/home/arrafi/.cache/puppeteer/chrome/linux-148.0.7778.97/chrome-linux64/chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Beranda / Landing Hero
  console.log("1. Capturing Beranda...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, "01_hero_beranda.png") });

  // 2. Form Pelaporan & Deteksi PII
  console.log("2. Capturing Form Pelaporan ZKP & PII...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button, a"));
    const lapor = btns.find((b) => b.textContent?.includes("Lapor Sekarang") || b.textContent?.includes("Buat Laporan") || b.textContent?.includes("Lapor"));
    if (lapor) lapor.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Bypass token gate if present
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const demoChip = btns.find((b) => b.textContent?.includes("SCH-X1-8831"));
    if (demoChip) demoChip.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Type story to trigger PII
  const textarea = await page.$("textarea");
  if (textarea) {
    await page.type("textarea", "Saya Budi Santoso dari kelas 11 IPA 2 melihat perundungan di kantin belakang");
    await new Promise((r) => setTimeout(r, 600));
  }
  await page.screenshot({ path: path.join(outputDir, "02_pelaporan_zkp_pii.png") });

  // 3. Status Tiket & Chat Dua Arah
  console.log("3. Capturing Status Tiket & Chat...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button, a"));
    const tiketTab = btns.find((b) => b.textContent?.includes("Pantau Tiket") || b.textContent?.includes("Lacak"));
    if (tiketTab) tiketTab.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  // Enter sample ticket id if input exists
  await page.evaluate(() => {
    const input = document.querySelector("input[placeholder*='TMG']");
    if (input) {
      input.value = "TMG-2025-78A1";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const checkBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent?.includes("Cek Status") || b.textContent?.includes("Buka Tiket"));
    if (checkBtn) checkBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, "03_tiket_chat_terenkripsi.png") });

  // 4. Dashboard Guru BK / Satgas Sekolah
  console.log("4. Capturing Dashboard Guru BK...");
  await page.evaluate(() => window.__switchRole && window.__switchRole("guru"));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, "04_dashboard_guru_bk.png") });

  // 5. Cetak Slip Token Massal
  console.log("5. Capturing Cetak Token Massal...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const tokenTab = btns.find((b) => b.textContent?.includes("Kode Akses Siswa") || b.textContent?.includes("Cetak Slip"));
    if (tokenTab) tokenTab.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, "05_cetak_token_fisik.png") });

  // 6. Dashboard Dinas Pendidikan
  console.log("6. Capturing Dashboard Dinas Pendidikan...");
  await page.evaluate(() => window.__switchRole && window.__switchRole("dinas-pendidikan"));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, "06_dashboard_dinas_pendidikan.png") });

  // 7. Dashboard UPTD PPA
  console.log("7. Capturing Dashboard UPTD PPA...");
  await page.evaluate(() => window.__switchRole && window.__switchRole("dinas-perlindungan"));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outputDir, "07_dashboard_uptd_ppa.png") });

  // 8. Mode Kios & Overlay Penyamaran
  console.log("8. Capturing Mode Kios...");
  await page.evaluate(() => window.__switchRole && window.__switchRole("siswa"));
  await new Promise((r) => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button, a"));
    const kioskBtn = btns.find((b) => b.textContent?.includes("Mode Kios") || b.textContent?.includes("Lab Komputer"));
    if (kioskBtn) kioskBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outputDir, "08_mode_kios_penyamaran.png") });

  await browser.close();
  console.log("✅ All 8 proposal screenshots captured successfully in proposal/assets/!");
}

captureAllProposalScreenshots().catch(console.error);
