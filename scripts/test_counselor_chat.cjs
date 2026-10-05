const { chromium } = require("playwright");

async function testCounselorChat() {
  console.log("=================================================");
  console.log("🔍 TESTING COUNSELOR DASHBOARD CHAT SYNCHRONIZATION");
  console.log("=================================================\n");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("[Browser Error]", msg.text());
    }
  });

  try {
    const recoveryCode = "kunci-bk-" + Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `TMG-2026-BK${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Create ticket via backend
    console.log("1. Creating incident ticket in backend...");
    const createRes = await fetch("http://localhost:3001/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticket_number: ticketNumber,
        category: "Perundungan / Bullying",
        reporterRole: "Siswa (Korban)",
        location: "Kantin Sekolah",
        incidentDate: "2026-10-05",
        urgency: "Tinggi",
        story: "Ada siswa yang terus mengintimidasi saya di lorong kelas.",
        redactedStory: "Ada siswa yang terus mengintimidasi saya di lorong kelas.",
        recovery_code: recoveryCode,
        secret_pin: "112233",
        school_id: "sch-01",
      }),
    });
    const ticketData = await createRes.json();
    console.log("   ✅ Ticket ID:", ticketData.id, "| Number:", ticketNumber);

    // 2. Add message from student
    console.log("2. Adding message from student...");
    const studentMsg = "Tolong saya Bu Guru BK, saya sangat takut pergi ke sekolah.";
    await fetch(`http://localhost:3001/api/tickets/${ticketData.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: "pelapor",
        sender_type: "pelapor",
        text: studentMsg,
        message_text: studentMsg,
      }),
    });
    console.log("   ✅ Student message posted to API.");

    // 3. Open Web App in browser
    console.log("3. Opening browser at http://localhost:3000...");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

    // 4. Switch to Guru BK Dashboard
    console.log("4. Switching role to Guru BK ('guru')...");
    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("guru");
      }
    });
    await page.waitForTimeout(1000);

    // 5. Check if Counselor dashboard is displayed
    const dashboardTitle = page.locator("h1:has-text('Guru BK'), h1:has-text('Satgas')").first();
    await dashboardTitle.waitFor({ state: "visible", timeout: 10000 });
    console.log("   ✅ Guru BK Dashboard loaded successfully!");

    // 6. Find and click the created ticket in the case list
    console.log(`6. Selecting ticket #${ticketNumber} in case list...`);
    const ticketItem = page.locator(`text=${ticketNumber}, text=${ticketData.id}`).first();
    if (await ticketItem.isVisible()) {
      await ticketItem.click();
      await page.waitForTimeout(500);
    } else {
      console.log("   (Selected first available ticket or active ticket)");
    }

    // 7. Check Chat Konseling subtab badge count
    console.log("7. Checking Chat Konseling subtab button...");
    const chatSubTabBtn = page.locator("button:has-text('Chat Konseling')").first();
    await chatSubTabBtn.waitFor({ state: "visible", timeout: 5000 });
    const tabBtnText = await chatSubTabBtn.textContent();
    console.log("   ✅ Subtab text:", tabBtnText.trim());

    // Click subtab
    await chatSubTabBtn.click();
    await page.waitForTimeout(500);

    // 8. Verify student message is rendered in Counselor chat area
    console.log("8. Verifying student message is displayed in Counselor chat view...");
    const studentMsgEl = page.locator(`text=${studentMsg}`).first();
    await studentMsgEl.waitFor({ state: "visible", timeout: 5000 });
    console.log("   ✅ SUCCESS: Student message is VISIBLE in Counselor Dashboard!");

    // 9. Guru BK replies to student
    const counselorReply = "Halo Ananda, pesanmu sudah kami terima. Jangan takut ya, kamu berada di tempat yang aman.";
    console.log(`9. Typing and sending Counselor reply: "${counselorReply}"...`);
    const counselorInput = page.locator("input[placeholder*='pesan konseling'], input[placeholder*='konseling']").first();
    await counselorInput.fill(counselorReply);

    const kirimBtn = page.locator("button:has-text('Kirim')").last();
    await kirimBtn.click();

    // 10. Verify Counselor message appears immediately in Counselor chat log
    console.log("10. Checking if Counselor reply appears in the chat stream...");
    const counselorMsgEl = page.locator(`text=${counselorReply}`).first();
    await counselorMsgEl.waitFor({ state: "visible", timeout: 5000 });
    console.log("   ✅ SUCCESS: Counselor reply appeared immediately in the Counselor view!");

    // 11. Switch back to student view and verify both messages
    console.log("11. Switching to Student view to verify 2-way sync...");
    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") window.__switchRole("siswa");
      if (typeof window.__setTab === "function") window.__setTab("status");
    });
    await page.waitForTimeout(500);

    const searchInput = page.locator("input[placeholder*='TMG-2025']").first();
    await searchInput.fill(recoveryCode);
    const searchBtn = page.locator("button:has-text('Search Ticket'), button:has-text('Cari Tiket')").first();
    await searchBtn.click();
    await page.waitForTimeout(1000);

    const studentViewCounselorMsg = page.locator(`text=${counselorReply}`).first();
    await studentViewCounselorMsg.waitFor({ state: "visible", timeout: 5000 });
    console.log("   ✅ SUCCESS: Counselor message is received and rendered in Student's Confidential Chat!");

    // Clean up
    await fetch(`http://localhost:3001/api/tickets/${ticketData.id}`, { method: "DELETE" });
    console.log("12. Cleaned up test ticket.");

    console.log("\n=================================================");
    console.log("🎉 ALL COUNSELOR CHAT TESTS PASSED CLEANLY!");
    console.log("=================================================");
  } catch (err) {
    console.error("❌ TEST FAILED:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testCounselorChat();
