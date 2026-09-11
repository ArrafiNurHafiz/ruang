const puppeteer = require("/home/arrafi/.npm/_npx/a779493e568f0a62/node_modules/puppeteer");

async function runTest() {
  console.log("=================================================");
  console.log("🔍 TESTING NAVBAR AUTO-HIDE, DEDUP & ADMIN ROLES");
  console.log("=================================================\n");

  const browser = await puppeteer.launch({
    executablePath: "/home/arrafi/.cache/puppeteer/chrome/linux-148.0.7778.97/chrome-linux64/chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });

  // 1. Check initial navbar state at top of page
  let headerClass = await page.$eval("header", (el) => el.className);
  console.log("1. Initial Header has 'translate-y-0':", headerClass.includes("translate-y-0"));
  if (!headerClass.includes("translate-y-0")) {
    throw new Error("Header should be visible at top of page");
  }

  // 2. Scroll down 400px
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise((r) => setTimeout(r, 400));

  headerClass = await page.$eval("header", (el) => el.className);
  console.log("2. After scrolling down 400px, has '-translate-y-full':", headerClass.includes("-translate-y-full"));
  if (!headerClass.includes("-translate-y-full")) {
    throw new Error("Header should have -translate-y-full after scrolling down");
  }

  // 3. Scroll up 100px (to 300px)
  await page.evaluate(() => window.scrollTo(0, 300));
  await new Promise((r) => setTimeout(r, 400));

  headerClass = await page.$eval("header", (el) => el.className);
  console.log("3. After scrolling up to 300px, has 'translate-y-0':", headerClass.includes("translate-y-0"));
  if (!headerClass.includes("translate-y-0")) {
    throw new Error("Header should be visible after scrolling up");
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));

  // 4. Test Roles Dedup for ALL 4 staff roles
  const roles = [
    { role: "guru", name: "Guru BK / Admin Sekolah" },
    { role: "admin", name: "Admin Sistem (System Administrator)" },
    { role: "dinas-pendidikan", name: "Dinas Pendidikan Wilayah" },
    { role: "dinas-perlindungan", name: "UPTD Perlindungan Perempuan & Anak" },
  ];

  for (const { role, name } of roles) {
    console.log(`\n--- Testing Role: ${name} (${role}) ---`);
    await page.evaluate((r) => window.__switchRole(r), role);
    await new Promise((r) => setTimeout(r, 400));

    // Navbar should have single Keluar button
    const hasNavbarLogout = await page.evaluate(() => {
      const btn = document.querySelector("#nav-logout-btn");
      return btn !== null && btn.textContent.includes("Keluar");
    });
    console.log(`- Navbar has #nav-logout-btn with text 'Keluar':`, hasNavbarLogout);
    if (!hasNavbarLogout) {
      throw new Error(`Expected Navbar logout button to be present for role ${role}`);
    }

    // Inside <main>, verify NO duplicate button with text "Keluar"
    const duplicateKeluarCount = await page.evaluate(() => {
      const mainEl = document.querySelector("main");
      if (!mainEl) return 0;
      const btns = Array.from(mainEl.querySelectorAll("button"));
      return btns.filter((b) => b.textContent.trim() === "Keluar" || b.textContent.trim().startsWith("Keluar")).length;
    });
    console.log(`- Main dashboard duplicate 'Keluar' count:`, duplicateKeluarCount);
    if (duplicateKeluarCount !== 0) {
      throw new Error(`Expected 0 duplicate Keluar buttons in main for role ${role}, found ${duplicateKeluarCount}`);
    }

    // Inside <main>, verify NO duplicate button with text "Ganti Peran"
    const duplicateGantiCount = await page.evaluate(() => {
      const mainEl = document.querySelector("main");
      if (!mainEl) return 0;
      const btns = Array.from(mainEl.querySelectorAll("button"));
      return btns.filter((b) => b.textContent.trim() === "Ganti Peran" || b.textContent.trim().startsWith("Ganti Peran")).length;
    });
    console.log(`- Main dashboard duplicate 'Ganti Peran' count:`, duplicateGantiCount);
    if (duplicateGantiCount !== 0) {
      throw new Error(`Expected 0 duplicate Ganti Peran buttons in main for role ${role}, found ${duplicateGantiCount}`);
    }

    // Verify floating emergency panic button is HIDDEN for staff
    const isFloatingPanicVisible = await page.evaluate(() => {
      const btn = document.querySelector("button[title*='Keluar Cepat: Bersihkan jejak seketika']");
      return btn !== null;
    });
    console.log(`- Floating Panic Button Hidden for staff:`, !isFloatingPanicVisible);
    if (isFloatingPanicVisible) {
      throw new Error(`Floating emergency panic exit should NOT be visible for staff role ${role}`);
    }
  }

  // 5. TEST SPECIFIC ROLE TASKS
  console.log("\n--- Testing Specific Role Duties ---");

  // 5A. Guru BK (Admin Sekolah) has Token Generation tab
  await page.evaluate(() => window.__switchRole("guru"));
  await new Promise((r) => setTimeout(r, 400));

  const guruHasTokenTab = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return btns.some((b) => b.textContent.includes("Kode Akses Siswa"));
  });
  console.log("5A. Guru BK has 'Kode Akses Siswa' tab:", guruHasTokenTab);
  if (!guruHasTokenTab) {
    throw new Error("Guru BK should have 'Kode Akses Siswa' tab!");
  }

  // Switch to Kode Akses Siswa tab in Guru BK
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const tab = btns.find((b) => b.textContent.includes("Kode Akses Siswa"));
    if (tab) tab.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  const guruHasTokenGenerator = await page.evaluate(() => {
    const form = document.querySelector("form");
    const hasGenerateBtn = form && form.textContent.includes("Buat Kode");
    const hasCetakBtn = document.body.textContent.includes("Cetak Slip Token");
    return hasGenerateBtn && hasCetakBtn;
  });
  console.log("5B. Guru BK can Generate Tokens & Print Slips:", guruHasTokenGenerator);
  if (!guruHasTokenGenerator) {
    throw new Error("Guru BK should have token generator form and Print Slip button");
  }

  // 5C. Admin Sistem (System Administrator) has User Management tab and NO token generator
  await page.evaluate(() => window.__switchRole("admin"));
  await new Promise((r) => setTimeout(r, 400));

  const adminHasUserTab = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const hasUserTab = btns.some((b) => b.textContent.includes("Manajemen Pengguna"));
    const hasAuditTab = btns.some((b) => b.textContent.includes("Log Audit"));
    return hasUserTab && hasAuditTab;
  });
  console.log("5C. Admin Sistem has User Management and Audit Log tabs:", adminHasUserTab);
  if (!adminHasUserTab) {
    throw new Error("Admin Sistem should have User Management and Audit Log tabs");
  }

  const adminHasNoTokenGenerator = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    return !btns.some((b) => b.textContent.includes("Kode Akses Siswa"));
  });
  console.log("5D. Admin Sistem does NOT have token generator tab:", adminHasNoTokenGenerator);
  if (!adminHasNoTokenGenerator) {
    throw new Error("Admin Sistem should not have token generator tab (it belongs to Guru BK)");
  }

  // 6. Test returning to Siswa via Navbar Logout
  console.log("\n--- Testing Logout via Navbar ---");
  await page.click("#nav-logout-btn");
  await new Promise((r) => setTimeout(r, 400));

  const isBackToSiswa = await page.evaluate(() => {
    const floatingBtn = document.querySelector("button[title*='Keluar Cepat: Bersihkan jejak seketika']");
    const berandaNav = document.querySelector("#nav-link-beranda");
    return floatingBtn !== null && berandaNav !== null;
  });
  console.log("Returned to Siswa & Panic button restored:", isBackToSiswa);
  if (!isBackToSiswa) {
    throw new Error("Expected to be back in Siswa mode after clicking navbar logout");
  }

  console.log("\n=================================================");
  console.log("🎉 ALL TESTS PASSED: AUTO-HIDE, DEDUP & ROLE REDEFINITION SUCCESS!");
  console.log("=================================================");
  await browser.close();
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
