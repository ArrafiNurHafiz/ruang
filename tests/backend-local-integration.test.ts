import assert from "node:assert/strict";

const BASE_URL = "http://localhost:3001/api";

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

async function run() {
  console.log("=================================================");
  console.log("🧪 TAMENG LOCAL BACKEND INTEGRATION TEST SUITE");
  console.log("=================================================\n");

  let createdTicket: any = null;
  let sampleRecoveryCode = `aman-tameng-test-${Date.now()}`;
  let sampleTokenCode = "";
  let authToken = "";

  // 1. STATS & PUBLIC GET ENDPOINTS
  console.log("📦 [GROUP 1] Public Info Endpoints");
  await test("GET /dashboard/stats returns valid metrics object", async () => {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok("totalTickets" in data);
    assert.ok("pendingTickets" in data);
    assert.ok("resolvedTickets" in data);
  });

  await test("GET /news returns article list", async () => {
    const res = await fetch(`${BASE_URL}/news`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
  });

  await test("GET /regional-schools returns list of schools", async () => {
    const res = await fetch(`${BASE_URL}/regional-schools`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });

  // 2. AUTHENTICATION & LOGIN
  console.log("\n📦 [GROUP 2] Authentication & Role Access");
  await test("POST /login with valid Counselor credentials succeeds", async () => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "guru.bk@sekolah.sch.id",
        password: "password123",
        role: "guru",
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.token);
    assert.equal(data.user.role, "guru");
    authToken = data.token;
  });

  await test("POST /login with wrong password is rejected with 401", async () => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "guru.bk@sekolah.sch.id",
        password: "wrong-password",
        role: "guru",
      }),
    });
    assert.equal(res.status, 401);
  });

  // 3. TOKENS LIFECYCLE
  console.log("\n📦 [GROUP 3] Token Access Lifecycle");
  await test("POST /tokens/batch creates school tokens", async () => {
    const res = await fetch(`${BASE_URL}/tokens/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        count: 2,
        prefix: "TEST-SMAN1",
        studentLevel: "Kelas 10",
        notes: "Automated Integration Test",
        schoolId: "default-school",
      }),
    });
    assert.equal(res.status, 201);
    const tokens = await res.json();
    assert.equal(tokens.length, 2);
    sampleTokenCode = tokens[0].token_code;
    assert.ok(sampleTokenCode.startsWith("TEST-SMAN1"));
  });

  await test("POST /tokens/verify validates existing token", async () => {
    const res = await fetch(`${BASE_URL}/tokens/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenCode: sampleTokenCode }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.token_code, sampleTokenCode);
  });

  // 4. TICKETS & CHAT WORKFLOW
  console.log("\n📦 [GROUP 4] Incident Ticket & 2-Way Chat Workflow");
  await test("POST /tickets creates a new anonymous report", async () => {
    const res = await fetch(`${BASE_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticket_number: `TMG-2026-T${Math.floor(1000 + Math.random() * 9000)}`,
        category: "Perundungan / Bullying",
        reporterRole: "Siswa (Korban)",
        location: "Kantin Sekolah",
        incidentDate: "2026-09-10",
        urgency: "Tinggi",
        story: "Ada siswa mengejek dan memalak uang di kantin",
        redactedStory: "Ada siswa mengejek dan memalak uang di kantin",
        detectedPII: [],
        recovery_code: sampleRecoveryCode,
        school_id: "default-school",
        is_kiosk: false,
      }),
    });
    assert.equal(res.status, 201);
    createdTicket = await res.json();
    assert.ok(createdTicket.id);
    assert.equal(createdTicket.status, "diterima");
    assert.ok(createdTicket.messages.length >= 1); // System message inserted
  });

  await test("GET /tickets/:recoveryCode retrieves ticket by secret code", async () => {
    const res = await fetch(`${BASE_URL}/tickets/${sampleRecoveryCode}`);
    assert.equal(res.status, 200);
    const ticket = await res.json();
    assert.equal(ticket.id, createdTicket.id);
  });

  await test("POST /tickets/:id/messages adds a chat message from reporter", async () => {
    const res = await fetch(`${BASE_URL}/tickets/${createdTicket.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_type: "pelapor",
        message_text: "Halo Bu Guru BK, saya sangat takut datang ke kantin.",
        is_encrypted: true,
      }),
    });
    assert.equal(res.status, 201);
    const msg = await res.json();
    assert.equal(msg.sender_type, "pelapor");
  });

  await test("POST /tickets/:id/messages adds a reply from counselor", async () => {
    const res = await fetch(`${BASE_URL}/tickets/${createdTicket.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_type: "counselor",
        sender_title: "Guru BK",
        message_text: "Jangan khawatir Nak, laporanmu aman bersama kami. Kami akan dampingi.",
        is_encrypted: true,
      }),
    });
    assert.equal(res.status, 201);
    const msg = await res.json();
    assert.equal(msg.sender_type, "counselor");
  });

  await test("POST /tickets/:id/notes saves counselor internal note", async () => {
    const res = await fetch(`${BASE_URL}/tickets/${createdTicket.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note: "Koordinasi dengan satpam pengawas area kantin saat jam istirahat.",
      }),
    });
    assert.equal(res.status, 201);
  });

  await test("PUT /tickets/:id updates status to 'ditinjau' and 'tindakan'", async () => {
    const res = await fetch(`${BASE_URL}/tickets/${createdTicket.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "tindakan",
        actionSummary: "Pemanggilan pelaku dan mediasi tertutup oleh Satgas PPKSP",
      }),
    });
    assert.equal(res.status, 200);
    const updated = await res.json();
    assert.equal(updated.status, "tindakan");
  });

  // 5. AUDIT LOGS & INTERVENTIONS
  console.log("\n📦 [GROUP 5] Audit Logs & Protection Interventions");
  await test("GET /audit-logs returns updated logs with new incident entry", async () => {
    const res = await fetch(`${BASE_URL}/audit-logs`);
    assert.equal(res.status, 200);
    const logs = await res.json();
    assert.ok(Array.isArray(logs));
    assert.ok(logs.length > 0);
  });

  await test("POST & PUT /interventions handles UPTD PPA workflow", async () => {
    const createRes = await fetch(`${BASE_URL}/interventions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: createdTicket.id,
        victimAlias: "Ananda Bunga (Samaran)",
        schoolOrigin: "SMA Negeri 1 Jakarta",
        category: "Perundungan Berat",
        urgency: "Tinggi",
        stage: "Asesmen Awal",
        shelterRequired: false,
      }),
    });
    assert.equal(createRes.status, 201);
    const intervention = await createRes.json();
    assert.ok(intervention.id);

    const updateRes = await fetch(`${BASE_URL}/interventions/${intervention.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stage: "Pemulihan Psikologis",
        assignedPsychologist: "Dra. Anita Kartika, M.Psi",
      }),
    });
    assert.equal(updateRes.status, 200);
    const updated = await updateRes.json();
    assert.equal(updated.stage, "Pemulihan Psikologis");
    assert.equal(updated.assignedPsychologist, "Dra. Anita Kartika, M.Psi");
  });

  // 6. CONTACT & HELP
  console.log("\n📦 [GROUP 6] Support & Config");
  await test("POST /contact receives community inquiry", async () => {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ibu Ratna",
        email: "ratna@gmail.com",
        subject: "Konsultasi PPKSP",
        category: "Pertanyaan Satgas",
        message: "Bagaimana cara sekolah kami bermitra dengan TAMENG?",
      }),
    });
    assert.equal(res.status, 201);
  });

  await test("GET /config returns system config", async () => {
    const res = await fetch(`${BASE_URL}/config`);
    assert.equal(res.status, 200);
    const cfg = await res.json();
    assert.ok("kioskTimeout" in cfg);
  });

  console.log("\n=================================================");
  console.log(`📊 INTEGRATION RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error("Runner crash:", err);
  process.exit(1);
});
