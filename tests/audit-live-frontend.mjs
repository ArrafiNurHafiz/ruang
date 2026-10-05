import { chromium } from "playwright";

const CHROMIUM_PATH = "/home/arrafi/.local/bin/chromium";
const TARGET_URL = "https://ruang.rapsdev.web.id";

async function auditFrontend() {
  console.log("=======================================================");
  console.log("🌐 AUDIT LIVE FRONTEND: " + TARGET_URL);
  console.log("=======================================================\n");

  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });

  const page = await context.newPage();

  const consoleMessages = [];
  const networkErrors = [];

  page.on("console", (msg) => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });

  page.on("pageerror", (err) => {
    consoleMessages.push({
      type: "uncaught-page-error",
      text: err.message,
      stack: err.stack,
    });
  });

  page.on("response", (res) => {
    if (res.status() >= 400 && !res.url().includes("favicon.ico")) {
      networkErrors.push({
        url: res.url(),
        status: res.status(),
        statusText: res.statusText(),
      });
    }
  });

  console.log("📌 1. Mengakses Halaman Utama...");
  try {
    const res = await page.goto(TARGET_URL, { waitUntil: "networkidle", timeout: 30000 });
    console.log(`  HTTP Status Beranda: ${res.status()}`);
    console.log(`  Title: "${await page.title()}"`);
  } catch (err) {
    console.error("  ❌ Gagal memuat beranda:", err.message);
  }

  // Check initial errors
  console.log("\n📌 2. Memeriksa Console Messages Awal:");
  const initialErrors = consoleMessages.filter((m) => m.type === "error" || m.type === "uncaught-page-error");
  if (initialErrors.length === 0) {
    console.log("  ✅ Nol error pada saat beranda dimuat.");
  } else {
    initialErrors.forEach((e) => console.log(`  ❌ Console ${e.type}: ${e.text}`));
  }

  console.log("\n📌 3. Memeriksa Network Errors Awal:");
  if (networkErrors.length === 0) {
    console.log("  ✅ Nol HTTP 4xx/5xx network errors.");
  } else {
    networkErrors.forEach((n) => console.log(`  ❌ HTTP ${n.status} pada ${n.url}`));
  }

  // 4. Test Navbar Links & Modals
  console.log("\n📌 4. Menguji Navigasi & Modal Utama...");

  // Modal Student Access Gate
  try {
    const laporBtn = await page.locator("button:has-text('Mulai Lapor'), a:has-text('Mulai Lapor'), button:has-text('Lapor Sekarang')").first();
    if (await laporBtn.isVisible()) {
      console.log("  Mengeklik tombol Lapor...");
      await laporBtn.click();
      await page.waitForTimeout(1000);
      const gateModal = await page.locator("text=Gerbang Akses Pelapor, text=Verifikasi Akses Siswa, text=Verifikasi Identitas Siswa").first();
      console.log(`  Gate Modal Visible: ${await gateModal.isVisible()}`);
    }
  } catch (e) {
    console.log("  Info lapor button test:", e.message);
  }

  // Check if there are any broken images
  const brokenImages = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"));
    return images
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src);
  });

  console.log(`\n📌 5. Memeriksa Gambar Rusak: ${brokenImages.length} gambar rusak ditemukan.`);
  if (brokenImages.length > 0) {
    brokenImages.forEach((src) => console.log(`  ⚠️ Broken img: ${src}`));
  }

  await browser.close();
  console.log("\n=======================================================");
  console.log("🏁 Audit Awal Selesai.");
  console.log("=======================================================");
}

auditFrontend();
