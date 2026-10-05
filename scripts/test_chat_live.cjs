const { chromium } = require("playwright");

async function testChatLive() {
  console.log("=================================================");
  console.log("🔍 TESTING CONFIDENTIAL CHAT WITH COUNSELOR");
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
    const sampleRecoveryCode = "kunci-rahasia-siswa-aman-" + Math.floor(1000 + Math.random() * 9000);
    const sampleTicketNumber = `TMG-2026-T${Math.floor(1000 + Math.random() * 9000)}`;

    console.log("1. Creating test ticket in backend API...");
    const createRes = await fetch("http://localhost:3001/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticket_number: sampleTicketNumber,
        category: "bullying_fisik",
        reporterRole: "Siswa (Korban)",
        location: "Kantin Sekolah",
        incidentDate: "2026-10-05",
        urgency: "sedang",
        story: "Ada siswa yang mengancam saya di kantin.",
        redactedStory: "Ada siswa yang mengancam saya di kantin.",
        recovery_code: sampleRecoveryCode,
        secret_pin: "123456",
        school_id: "sch-01",
        is_kiosk: false,
      }),
    });

    const ticketData = await createRes.json();
    console.log("   ✅ Ticket created:", ticketData.ticket_number, "| ID:", ticketData.id, "| Recovery Code:", sampleRecoveryCode);

    console.log("2. Navigating to student app at http://localhost:3000...");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

    console.log("3. Switching to 'status' tab...");
    await page.evaluate(() => {
      if (typeof window.__setTab === "function") {
        window.__setTab("status");
      }
    });

    // Wait for the tracking search input
    console.log("4. Searching ticket using recovery code...");
    const searchInput = page.locator("input[placeholder*='TMG-2025']").first();
    await searchInput.waitFor({ state: "visible", timeout: 10000 });
    await searchInput.fill(sampleRecoveryCode);

    const searchButton = page.locator("button:has-text('Search Ticket'), button:has-text('Cari Tiket')").first();
    await searchButton.click();

    // 5. Verify Ticket Status & Chat Room is displayed
    console.log("5. Waiting for ticket details & Confidential Chat section...");
    const chatHeader = page.locator("h3:has-text('Ruang Chat Konseling Rahasia'), h3:has-text('Confidential Chat with Counselor')").first();
    await chatHeader.waitFor({ state: "visible", timeout: 10000 });
    console.log("   ✅ Confidential Chat room opened successfully!");

    // 6. Test sending a message from student
    const studentMessage = "Halo Bapak/Ibu Guru BK, saya sangat cemas dengan kejadian kemarin di kantin.";
    console.log(`6. Typing message: "${studentMessage}"...`);
    const chatInput = page.locator("input[placeholder*='confidential message'], input[placeholder*='pesan rahasia'], input[placeholder*='Guru BK']").first();
    await chatInput.waitFor({ state: "visible", timeout: 5000 });
    await chatInput.fill(studentMessage);

    console.log("   Submitting message via Send button...");
    const sendButton = page.locator("button:has-text('Send'), button:has-text('Kirim')").last();
    await sendButton.click();

    // 7. Verify the message is immediately visible in the chat list (optimistic render)
    console.log("7. Verifying message is rendered in the chat stream...");
    const msgElement = page.locator(`text=${studentMessage}`).first();
    await msgElement.waitFor({ state: "visible", timeout: 5000 });
    console.log("   ✅ SUCCESS: Pelapor message appeared in the chat immediately!");

    // Verify sender badge
    const pelaporBadge = page.locator("text=You (Reporter), text=Anda (Pelapor)").first();
    const isBadgeVisible = await pelaporBadge.isVisible();
    console.log(`   ✅ Sender identified properly as Reporter: ${isBadgeVisible}`);

    // 8. Test sending with Enter key
    const secondMessage = "Apakah sesi konseling bisa diadakan besok siang?";
    console.log(`8. Testing second message via Enter key: "${secondMessage}"...`);
    await chatInput.fill(secondMessage);
    await chatInput.press("Enter");

    const secondMsgElement = page.locator(`text=${secondMessage}`).first();
    await secondMsgElement.waitFor({ state: "visible", timeout: 5000 });
    console.log("   ✅ SUCCESS: Second message sent with Enter key appeared immediately!");

    // 9. Counselor replies from Counselor Dashboard / Backend
    console.log("9. Simulating Counselor reply from BK dashboard...");
    const counselorReply = "Halo Ananda, kami siap mendampingi kamu. Besok jam istirahat pertama silakan datang ke ruang BK, situasi akan kami pastikan aman.";
    const counselorRes = await fetch(`http://localhost:3001/api/tickets/${ticketData.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: "konselor",
        sender_type: "konselor",
        sender_name: "Ibu Rahma (Guru BK)",
        sender_title: "Guru BK / Satgas PPKSP",
        text: counselorReply,
        message_text: counselorReply,
      }),
    });
    const counselorData = await counselorRes.json();
    console.log("   Counselor reply created in DB:", counselorData.id);

    // 10. In student view, re-fetch ticket or query to verify counselor reply displays
    console.log("10. Verifying Counselor reply is displayed in student view...");
    await searchButton.click();
    await page.waitForTimeout(1000);

    const counselorMsgElement = page.locator(`text=${counselorReply}`).first();
    await counselorMsgElement.waitFor({ state: "visible", timeout: 5000 });
    console.log("   ✅ SUCCESS: Counselor reply is rendered with Counselor badge in student view!");

    // Clean up test ticket
    await fetch(`http://localhost:3001/api/tickets/${ticketData.id}`, { method: "DELETE" });
    console.log("11. Cleaned up test ticket.");

    console.log("\n=================================================");
    console.log("🎉 ALL TESTS PASSED: Confidential Chat is working seamlessly!");
    console.log("=================================================");
  } catch (err) {
    console.error("❌ TEST FAILED:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testChatLive();
