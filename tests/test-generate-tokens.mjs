import { chromium } from "playwright";
import assert from "node:assert/strict";

const CHROMIUM_PATH = "/home/arrafi/.local/bin/chromium";
const FRONTEND_URL = "http://localhost:3000";

async function testTokenGeneration() {
  console.log("=================================================");
  console.log("🧪 UJI LIVE BROWSER: GENERATE BATCH TOKEN SISWA");
  console.log("=================================================\n");

  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });

  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(`  [Browser Error]:`, msg.text());
    }
  });

  try {
    // 1. Buka aplikasi
    console.log("📌 1. Membuka Halaman Utama...");
    await page.goto(FRONTEND_URL, { waitUntil: "networkidle" });

    // 2. Switch role ke Guru BK
    console.log("📌 2. Beralih ke Peran Guru BK (Admin Sekolah)...");
    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("guru");
      }
    });
    await page.waitForTimeout(1000);

    // 3. Masuk ke Tab Kelola Token Anonim
    console.log("📌 3. Membuka Tab 'Kelola Token Anonim'...");
    const tokensTabBtn = await page.waitForSelector("button:has-text('Kelola Token Anonim')", {
      timeout: 5000,
    });
    await tokensTabBtn.click();
    await page.waitForTimeout(600);

    // 4. Baca jumlah token sebelum generate
    const tabTextBefore = await tokensTabBtn.textContent();
    console.log(`  📊 Status Tab Sebelum Generate: "${tabTextBefore.trim()}"`);
    const matchBefore = tabTextBefore.match(/\((\d+)\)/);
    const countBefore = matchBefore ? parseInt(matchBefore[1], 10) : 0;
    console.log(`  🔢 Jumlah Token Awal: ${countBefore}`);

    // 5. Isi Formulir Batch Token
    console.log("📌 4. Mengisi Formulir Batch Token (5 token, prefix: SCH-TEST)...");
    const countInput = await page.waitForSelector("input[type='number']", { timeout: 5000 });
    await countInput.fill("5");

    const prefixInput = await page.waitForSelector("input[placeholder*='SCH-X1']", { timeout: 5000 });
    await prefixInput.fill("SCH-TEST");

    const levelInput = await page.waitForSelector("input[placeholder*='Kelas X']", { timeout: 5000 });
    await levelInput.fill("Kelas X - Uji Tambah");

    // 6. Submit Generate Token
    console.log("📌 5. Mengklik tombol 'Generate Token'...");
    const submitBtn = await page.waitForSelector("button:has-text('Generate Token')", { timeout: 5000 });
    await submitBtn.click();

    // 7. Tunggu respon dan update UI
    await page.waitForTimeout(2000);

    // 8. Cek banner notifikasi
    const alertSuccess = await page.$("div:has-text('Berhasil membuat 5 token')");
    assert.ok(alertSuccess, "Alert sukses pembuatan token harus muncul");
    console.log("  ✅ Banner sukses tampil: 'Berhasil membuat 5 token'");

    // 9. Baca jumlah token sesudah generate
    const tabTextAfter = await tokensTabBtn.textContent();
    console.log(`  📊 Status Tab Sesudah Generate: "${tabTextAfter.trim()}"`);
    const matchAfter = tabTextAfter.match(/\((\d+)\)/);
    const countAfter = matchAfter ? parseInt(matchAfter[1], 10) : 0;
    console.log(`  🔢 Jumlah Token Akhir: ${countAfter}`);

    assert.equal(
      countAfter,
      countBefore + 5,
      `Jumlah token harus bertambah tepat 5! (Awal: ${countBefore}, Akhir: ${countAfter})`
    );
    console.log(`  ✅ Verifikasi jumlah: Token bertambah dari ${countBefore} menjadi ${countAfter} (+5)`);

    // 10. Periksa apakah kode token baru muncul di baris tabel
    const newRow = await page.$("td:has-text('SCH-TEST-')");
    assert.ok(newRow, "Baris tabel dengan kode token baru (SCH-TEST-) harus muncul");
    console.log("  ✅ Baris tabel dengan kode token baru (SCH-TEST-) terverifikasi ada");

    console.log("\n=================================================");
    console.log("🎉 PENGUJIAN SELESAI: GENERATE TOKEN BERTAMBAH NORMAL!");
    console.log("=================================================");
  } catch (err) {
    console.error("\n❌ PENGUJIAN GAGAL:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testTokenGeneration();
