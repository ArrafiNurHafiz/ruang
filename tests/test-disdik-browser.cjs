const { chromium } = require("playwright");

async function run() {
  console.log("Launching browser for live UI verification...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("[BROWSER ERROR]", msg.text());
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // 1. Switch to Guru BK role
  console.log("Switching to Guru BK role...");
  await page.evaluate(() => {
    if (window.__switchRole) window.__switchRole("guru");
  });
  await page.waitForTimeout(1000);

  // 2. Click a ticket item in left sidebar if available
  console.log("Selecting a ticket in Guru BK dashboard...");
  const firstTicketItem = page.locator("div[role='button'], div.cursor-pointer, button").filter({ hasText: /TMG-|Tiket|Laporan|Kekerasan|Bullying/i }).first();
  if (await firstTicketItem.isVisible()) {
    await firstTicketItem.click();
    await page.waitForTimeout(500);
  }

  // Find escalation button
  const escalateBtn = page.locator("button").filter({ hasText: /Eskalasi Kasus/i }).first();
  if (await escalateBtn.isVisible({ timeout: 3000 })) {
    console.log("Clicking 'Eskalasi Kasus' button...");
    await escalateBtn.click();
    await page.waitForTimeout(500);

    // Fill escalation modal
    console.log("Filling escalation modal...");
    const targetSelect = page.locator("select").filter({ hasText: /Dinas Pendidikan/i }).first();
    if (await targetSelect.isVisible()) {
      await targetSelect.selectOption("Keduanya");
    }

    const reasonTextarea = page.locator("textarea[placeholder*='pertimbangan']").first();
    if (await reasonTextarea.isVisible()) {
      await reasonTextarea.fill("Membutuhkan intervensi gabungan Dinas Pendidikan dan UPTD PPA karena situasi kritis.");
    }

    const confirmBtn = page.locator("button").filter({ hasText: /Konfirmasi Eskalasi/i }).first();
    await confirmBtn.click();
    console.log("Confirmed escalation!");
    await page.waitForTimeout(1000);
  } else {
    console.log("Escalation button not directly visible on selection, testing direct switch to Dinas Pendidikan...");
  }

  // 3. Switch to Dinas Pendidikan view
  console.log("Switching to Dinas Pendidikan portal...");
  await page.evaluate(() => {
    if (window.__switchRole) window.__switchRole("dinas-pendidikan");
  });
  await page.waitForTimeout(1500);

  // 4. Verify Dinas Pendidikan view
  const disdikHeader = await page.locator("h1").filter({ hasText: /Portal Pengawasan Satgas PPKSP Dinas Pendidikan/i }).first().isVisible();
  console.log("Dinas Pendidikan portal visible:", disdikHeader);

  // Check alert banner on Tab 1
  const alertBanner = await page.locator("div").filter({ hasText: /Perhatian Pengawas:/i }).first().isVisible();
  console.log("Tab 1 alert banner visible:", alertBanner);

  // Click Tab 2: Kasus Eskalasi & Respon Lambat
  console.log("Clicking Tab 2: Kasus Eskalasi...");
  const tab2Btn = page.locator("button").filter({ hasText: /Kasus Eskalasi & Respon Lambat/i }).first();
  await tab2Btn.click();
  await page.waitForTimeout(1000);

  // Verify escalated tickets in table
  const tableContent = await page.locator("table").innerText();
  const hasEscalatedBadge = tableContent.includes("Rujukan:") || tableContent.includes("Dinas") || tableContent.includes("Kritis");
  console.log("Tab 2 table contains escalated / critical tickets:", hasEscalatedBadge);

  await page.screenshot({ path: "tests/disdik-escalation-success.png", fullPage: true });
  console.log("Screenshot saved to tests/disdik-escalation-success.png");

  await browser.close();
  if (!disdikHeader) {
    throw new Error("Dinas Pendidikan header not found!");
  }
  console.log("✅ Playwright verification completed successfully!");
}

run().catch((err) => {
  console.error("Browser test failed:", err);
  process.exit(1);
});
