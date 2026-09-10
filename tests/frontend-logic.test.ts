import assert from "node:assert/strict";
import {
  generateTicketId,
  generateRecoveryKey,
  generateZKPHash,
  detectPII,
  autoRedactText,
  formatBytes,
} from "../src/utils/crypto";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res
        .then(() => {
          console.log(`  ✅ PASS: ${name}`);
          passed++;
        })
        .catch((err) => {
          console.error(`  ❌ FAIL: ${name}`);
          console.error(`     Error: ${err.message}`);
          failed++;
        });
    }
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
  console.log("🧪 TAMENG FRONTEND LOGIC & CRYPTO UNIT TESTS");
  console.log("=================================================\n");

  console.log("📦 [SUITE 1] Ticket & Key Generation");
  test("generateTicketId produces valid TMG-YYYY-XXXX pattern", () => {
    const ticketId = generateTicketId();
    const currentYear = new Date().getFullYear();
    const regex = new RegExp(`^TMG-${currentYear}-[A-Z0-9]{4}$`);
    assert.match(ticketId, regex);
  });

  test("generateRecoveryKey produces word-word-word-word-XXXX pattern", () => {
    const key = generateRecoveryKey();
    const parts = key.split("-");
    assert.equal(parts.length, 5);
    const suffix = parseInt(parts[4], 10);
    assert.ok(suffix >= 1000 && suffix <= 9999);
  });

  console.log("\n📦 [SUITE 2] ZKP Cryptographic Integrity Hash");
  await test("generateZKPHash produces integrity-sha256 digest", async () => {
    const hash = await generateZKPHash("Cerita kekerasan siswa", 1700000000);
    assert.ok(hash.startsWith("integrity-sha256:0x"));
    assert.ok(hash.length > 25);
  });

  console.log("\n📦 [SUITE 3] PII Detection Engine");
  test("detectPII catches phone numbers, classes, NISN, and names", () => {
    const input = "Nama saya Budi Santoso dari kelas XII IPA 2 no hp 081234567890 NISN 0012345678";
    const entities = detectPII(input);

    const types = entities.map((e) => e.type);
    assert.ok(types.includes("Kelas / Rombel"), "Should detect class");
    assert.ok(types.includes("Nomor Kontak"), "Should detect phone");
    assert.ok(types.includes("NISN / Angka Pengenal"), "Should detect NISN");
    assert.ok(types.includes("Nama / Identitas"), "Should detect name");
  });

  test("autoRedactText masks sensitive information without offset breakage", () => {
    const input = "Nama saya Budi Santoso dari kelas XII IPA 2 no hp 081234567890 NISN 0012345678";
    const entities = detectPII(input);
    const redacted = autoRedactText(input, entities);

    assert.ok(!redacted.includes("081234567890"), "Phone must be hidden");
    assert.ok(!redacted.includes("0012345678"), "NISN must be hidden");
    assert.ok(redacted.includes("[NOMOR-KONTAK-DIRAHASIAKAN]"));
    assert.ok(redacted.includes("[NISN-DIRAHASIAKAN]"));
    assert.ok(redacted.includes("[KELAS-DIRAHAASIAKAN]"));
  });

  console.log("\n📦 [SUITE 4] Utility Formatting");
  test("formatBytes converts sizes properly", () => {
    assert.equal(formatBytes(0), "0 Bytes");
    assert.equal(formatBytes(1024), "1 KB");
    assert.equal(formatBytes(1048576), "1 MB");
  });

  console.log("\n=================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
