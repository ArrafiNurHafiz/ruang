const puppeteer = require("/home/arrafi/.npm/_npx/a779493e568f0a62/node_modules/puppeteer");
const path = require("path");

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    executablePath: "/home/arrafi/.cache/puppeteer/chrome/linux-148.0.7778.97/chrome-linux64/chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });

  const artifactDir = "/home/arrafi/.gemini/antigravity-ide/brain/62ed8b11-822f-4913-969f-58f715e517a4";

  // 1. Guru BK - Tab Laporan
  await page.evaluate(() => window.__switchRole("guru"));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, "guru_bk_laporan.png") });

  // 2. Guru BK - Tab Kode Akses Siswa
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const tab = btns.find((b) => b.textContent.includes("Kode Akses Siswa"));
    if (tab) tab.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(artifactDir, "guru_bk_kode_akses.png") });

  // 3. Admin Sistem - Manajemen Pengguna
  await page.evaluate(() => window.__switchRole("admin"));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, "admin_sistem_users.png") });

  // 4. Admin Sistem - Audit Log
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const tab = btns.find((b) => b.textContent.includes("Log Audit"));
    if (tab) tab.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(artifactDir, "admin_sistem_audit.png") });

  await browser.close();
  console.log("All screenshots saved successfully!");
}

takeScreenshots().catch(console.error);
