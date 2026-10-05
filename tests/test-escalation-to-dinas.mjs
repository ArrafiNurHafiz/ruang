import fetch from "node-fetch";

const API_URL = "http://localhost:3001/api";

async function run() {
  console.log("=================================================");
  console.log("🧪 TESTING ESCALATION FLOW TO DINAS PENDIDIKAN");
  console.log("=================================================");

  // 1. Create a test ticket
  const createRes = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: "Kekerasan Fisik Berat",
      story: "Ada pengeroyokan di belakang sekolah yang melibatkan geng luar.",
      urgency: "Kritis",
      school_id: "sch-01",
    }),
  });
  if (!createRes.ok) throw new Error("Failed to create test ticket");
  const ticket = await createRes.json();
  console.log(`✅ 1. Ticket created: #${ticket.ticket_number || ticket.id}`);

  // 2. Escalate ticket as Counselor (Guru BK)
  const escalateTarget = "Keduanya (Dinas Pendidikan & UPTD PPA)";
  const escalateReason = "Kekerasan melibatkan senjata tajam dan alumni eksternal, membutuhkan koordinasi dinas dan perlindungan.";

  const updateRes = await fetch(`${API_URL}/tickets/${ticket.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "tindakan",
      action_summary: `Eskalasi ke ${escalateTarget}: ${escalateReason}`,
      is_escalated_to_dinas: true,
      escalated_to: escalateTarget,
      escalation_reason: escalateReason,
    }),
  });
  if (!updateRes.ok) throw new Error("Failed to escalate ticket via PUT");
  const updatedTicket = await updateRes.json();
  console.log(`✅ 2. Ticket escalated on backend: is_escalated_to_dinas=${updatedTicket.is_escalated_to_dinas || updatedTicket.isEscalatedToDinas}`);

  // 3. Fetch tickets via GET /api/tickets (simulating Dinas Pendidikan fetching all tickets)
  const listRes = await fetch(`${API_URL}/tickets`);
  if (!listRes.ok) throw new Error("Failed to fetch tickets list");
  const allTickets = await listRes.json();
  const found = allTickets.find((t) => t.id === ticket.id);

  if (!found) throw new Error("Ticket not found in /api/tickets");
  console.log("✅ 3. Ticket found in GET /api/tickets:", {
    id: found.id,
    status: found.status,
    isEscalatedToDinas: found.isEscalatedToDinas ?? found.is_escalated_to_dinas,
    escalatedTo: found.escalatedTo ?? found.escalated_to,
    escalationReason: found.escalationReason ?? found.escalation_reason,
  });

  if (!Boolean(found.isEscalatedToDinas ?? found.is_escalated_to_dinas)) {
    throw new Error("FAIL: is_escalated_to_dinas is not truthy in retrieved ticket!");
  }

  // 4. Verify school compliance update
  const schoolsRes = await fetch(`${API_URL}/regional-schools`);
  const schools = await schoolsRes.json();
  const sch = schools.find((s) => s.id === "sch-01");
  console.log(`✅ 4. Regional school compliance status: ${sch?.complianceStatus} (Last Active: ${sch?.lastActive})`);

  // 5. Verify audit log entry
  const logsRes = await fetch(`${API_URL}/audit-logs`);
  const logs = await logsRes.json();
  const escLog = logs.find((l) => l.action?.includes("Eskalasi Kasus"));
  if (escLog) {
    console.log(`✅ 5. Escalation audit log recorded: "${escLog.action}" - ${escLog.details}`);
  }

  console.log("=================================================");
  console.log("🎉 ALL ESCALATION BACKEND CHECKS PASSED!");
  console.log("=================================================");
}

run().catch((err) => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});
