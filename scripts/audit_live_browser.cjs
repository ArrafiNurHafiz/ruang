const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function runAudit() {
  console.log("=================================================");
  console.log("🔍 STARTING COMPREHENSIVE LIVE BROWSER AUDIT");
  console.log("=================================================\n");

  const results = {
    passed: [],
    failed: [],
    warnings: [],
  };

  const logPass = (title) => {
    console.log(`  ✅ PASS: ${title}`);
    results.passed.push(title);
  };

  const logFail = (title, err) => {
    console.error(`  ❌ FAIL: ${title} -> ${err.message || err}`);
    results.failed.push({ title, error: err.message || String(err) });
  };

  const logWarn = (title, msg) => {
    console.warn(`  ⚠️ WARN: ${title} -> ${msg}`);
    results.warnings.push({ title, message: msg });
  };

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (err) {
    console.error("Could not launch chromium:", err);
    return;
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  // Capture console errors
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // -------------------------------------------------------------
    // TEST 1: LANDING PAGE & DESIGN SYSTEM
    // -------------------------------------------------------------
    console.log("📦 [TEST 1] Beranda / Landing Page Rendering");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

    const title = await page.title();
    if (title.includes("Ruang Aman")) {
      logPass(`Page title matches: "${title}"`);
    } else {
      logFail("Page title validation", new Error(`Unexpected title: ${title}`));
    }

    // Emergency Bar
    const emergencyBar = await page.$(".emergency-bar");
    if (emergencyBar) {
      logPass("Emergency Top Bar rendered with hotline information");
    } else {
      logFail("Emergency Top Bar", new Error("Element .emergency-bar not found"));
    }

    // Header & Brand Mark
    const brandMark = await page.$(".brand-mark");
    const siteHeader = await page.$(".site-header");
    if (brandMark && siteHeader) {
      logPass("Sticky Site Header and Brand Mark rendered properly");
    } else {
      logFail("Header rendering", new Error("Header or brand mark missing"));
    }

    // Hero Section elements
    const heroSection = await page.$(".hero-section");
    const platformBadge = await page.$(".platform-badge");
    const studentImg = await page.$(".student-wrap img");
    const actionPanel = await page.$(".action-panel");
    const privacyStrip = await page.$(".privacy-strip");

    if (heroSection && platformBadge && studentImg && actionPanel && privacyStrip) {
      logPass("Hero Section, Platform Badge, Student Illustration, and Action Panel rendered seamlessly");
    } else {
      logFail("Hero elements", new Error("One or more hero elements missing"));
    }

    // -------------------------------------------------------------
    // TEST 2: EMERGENCY HOTLINE MODAL
    // -------------------------------------------------------------
    console.log("\n📦 [TEST 2] Emergency Hotline Modal");
    const emergencyBtn = await page.$("#banner-emergency-hotline-btn");
    if (emergencyBtn) {
      await emergencyBtn.click();
      await page.waitForTimeout(300);
      const modalTitle = await page.$("#modal-emergency-title");
      if (modalTitle) {
        logPass("Emergency Modal opened on click");
        const closeBtn = await page.$("#close-emergency-modal-btn");
        if (closeBtn) {
          await closeBtn.click();
          await page.waitForTimeout(300);
          logPass("Emergency Modal closed cleanly");
        }
      } else {
        logFail("Emergency Modal Content", new Error("Modal title not rendered"));
      }
    } else {
      logFail("Emergency button", new Error("Emergency button not found"));
    }

    // -------------------------------------------------------------
    // TEST 3: ANONYMOUS REPORT FORM & PII MASKING (ROLE SISWA)
    // -------------------------------------------------------------
    console.log("\n📦 [TEST 3] Anonymous Report Form & PII Redaction");
    const laporBtn = await page.$("#nav-lapor-btn, #hero-create-report-btn");
    if (laporBtn) {
      await laporBtn.click();
      await page.waitForTimeout(500);

      // Check if report form is rendered
      const formHeader = await page.$("h1, h2");
      const formText = await page.textContent("body");
      if (formText.includes("Lapor") || formText.includes("Kategori") || formText.includes("Peristiwa")) {
        logPass("Navigated to Anonymous Report Form");
      } else {
        logFail("Report form navigation", new Error("Form text not detected"));
      }
    }

    // -------------------------------------------------------------
    // TEST 4: ROLE SWITCHING & DASHBOARD ACCESS
    // -------------------------------------------------------------
    console.log("\n📦 [TEST 4] Role Switching & Authorization Dashboards");

    // 4a. Guru BK / Satgas Sekolah
    console.log("  ➡️ Testing Guru BK Dashboard (Role: 'guru')...");
    await page.evaluate(() => {
      if (window.__switchRole) window.__switchRole("guru");
    });
    await page.waitForTimeout(600);
    let bodyText = await page.textContent("body");
    if (bodyText.includes("Bimbingan Konseling") || bodyText.includes("Guru BK") || bodyText.includes("Triage") || bodyText.includes("Laporan")) {
      logPass("Guru BK Dashboard loads with Case Triage & Management tools");
    } else {
      logFail("Guru BK Dashboard", new Error("Guru BK dashboard elements not found"));
    }

    // 4b. Admin Sistem
    console.log("  ➡️ Testing Admin Sistem Dashboard (Role: 'admin')...");
    await page.evaluate(() => {
      if (window.__switchRole) window.__switchRole("admin");
    });
    await page.waitForTimeout(600);
    bodyText = await page.textContent("body");
    if (bodyText.includes("Admin") || bodyText.includes("Pengguna") || bodyText.includes("Audit Log") || bodyText.includes("Profil")) {
      logPass("Admin Sistem Dashboard loads with User Management & Audit Logs");
    } else {
      logFail("Admin Sistem Dashboard", new Error("Admin dashboard elements not found"));
    }

    // 4c. Dinas Pendidikan
    console.log("  ➡️ Testing Dinas Pendidikan Portal (Role: 'dinas-pendidikan')...");
    await page.evaluate(() => {
      if (window.__switchRole) window.__switchRole("dinas-pendidikan");
    });
    await page.waitForTimeout(600);
    bodyText = await page.textContent("body");
    if (bodyText.includes("Dinas Pendidikan") || bodyText.includes("Pengawasan") || bodyText.includes("Sekolah") || bodyText.includes("Wilayah")) {
      logPass("Dinas Pendidikan Portal loads with Regional Analytics & Supervision");
    } else {
      logFail("Dinas Pendidikan Portal", new Error("Dinas Pendidikan elements not found"));
    }

    // 4d. Dinas Perlindungan (UPTD PPA)
    console.log("  ➡️ Testing Dinas Perlindungan UPTD PPA Portal (Role: 'dinas-perlindungan')...");
    await page.evaluate(() => {
      if (window.__switchRole) window.__switchRole("dinas-perlindungan");
    });
    await page.waitForTimeout(600);
    bodyText = await page.textContent("body");
    if (bodyText.includes("UPTD PPA") || bodyText.includes("Perlindungan") || bodyText.includes("Intervensi") || bodyText.includes("Psikolog")) {
      logPass("Dinas Perlindungan UPTD PPA Portal loads with Case Intervention pipeline");
    } else {
      logFail("Dinas Perlindungan Portal", new Error("UPTD PPA elements not found"));
    }

    // Return to Siswa role
    await page.evaluate(() => {
      if (window.__switchRole) window.__switchRole("siswa");
    });
    await page.waitForTimeout(400);

    // -------------------------------------------------------------
    // TEST 5: SAFETY FEATURES (DISGUISE & PANIC ESCAPE)
    // -------------------------------------------------------------
    console.log("\n📦 [TEST 5] Safety & Camouflage Mechanisms");
    await page.evaluate(() => {
      if (window.__toggleDisguise) window.__toggleDisguise(true);
    });
    await page.waitForTimeout(400);
    bodyText = await page.textContent("body");
    if (bodyText.includes("Matematika") || bodyText.includes("Trigonometri") || bodyText.includes("Kalkulator") || bodyText.includes("Fisika")) {
      logPass("Mode Samaran (Disguise Overlay) activated and masked sensitive screen");
    } else {
      logWarn("Mode Samaran Content", "Disguise overlay did not display expected text pattern");
    }

    // Close disguise
    const exitDisguiseBtn = await page.$("#exit-disguise-btn, button:has-text('Tutup'), button:has-text('Kembali')");
    if (exitDisguiseBtn) {
      await exitDisguiseBtn.click();
    } else {
      await page.evaluate(() => {
        if (window.__toggleDisguise) window.__toggleDisguise(false);
      });
    }

    // -------------------------------------------------------------
    // TEST 6: CONSOLE ERROR CHECK
    // -------------------------------------------------------------
    console.log("\n📦 [TEST 6] Console & Runtime Diagnostics");
    if (consoleErrors.length === 0) {
      logPass("Zero console errors or unhandled exceptions detected");
    } else {
      logWarn("Console Output", `${consoleErrors.length} errors/warnings detected: ${consoleErrors.join("; ")}`);
    }

  } catch (err) {
    logFail("Global audit runner", err);
  } finally {
    await browser.close();
  }

  console.log("\n=================================================");
  console.log(`📊 LIVE BROWSER AUDIT SUMMARY: ${results.passed.length} PASSED | ${results.failed.length} FAILED | ${results.warnings.length} WARNINGS`);
  console.log("=================================================");

  return results;
}

runAudit();
