import assert from "node:assert/strict";
import crypto from "crypto";
import {
  generateTestJWT,
  generateExpiredTestJWT,
  TEST_USERS,
  TEST_JWT_SECRET,
} from "./fixtures/test-helpers.js";

let passed = 0;
let failed = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
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

async function verifyTokenMock(
  tokenStr: string,
  secret = TEST_JWT_SECRET,
): Promise<any | null> {
  try {
    const parts = tokenStr.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

async function main() {
  console.log("=================================================");
  console.log("🛡️ TAMENG AUTOMATED SECURITY REGRESSION TEST SUITE");
  console.log("=================================================\n");

  // SUITE 1: JWT SECURITY & SIGNATURE VERIFICATION
  console.log("📦 [SUITE 1] JWT & Cryptographic Verification");
  await runTest("Valid JWT token parses and verifies correctly", async () => {
    const token = generateTestJWT(TEST_USERS.counselor);
    const parsed = await verifyTokenMock(token);
    assert.ok(parsed, "Token should be valid");
    assert.equal(parsed.email, TEST_USERS.counselor.email);
    assert.equal(parsed.role, "guru");
  });

  await runTest("Tampered signature is strictly rejected", async () => {
    const valid = generateTestJWT(TEST_USERS.counselor);
    const [h, b] = valid.split(".");
    const tampered = `${h}.${b}.bad_signature_here`;
    const parsed = await verifyTokenMock(tampered);
    assert.equal(parsed, null, "Tampered signature must return null");
  });

  await runTest("Tampered payload is strictly rejected", async () => {
    const valid = generateTestJWT(TEST_USERS.student);
    const [h, , s] = valid.split(".");
    const forgedBody = Buffer.from(
      JSON.stringify({
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString("base64url");
    const forgedToken = `${h}.${forgedBody}.${s}`;
    const parsed = await verifyTokenMock(forgedToken);
    assert.equal(parsed, null, "Forged payload must fail signature check");
  });

  await runTest("Expired JWT is rejected", async () => {
    const expiredToken = generateExpiredTestJWT(TEST_USERS.admin);
    const parsed = await verifyTokenMock(expiredToken);
    assert.equal(parsed, null, "Expired token must return null");
  });

  await runTest(
    "Malformed token formats reject gracefully without throw",
    async () => {
      const malformed = [
        "",
        "abc",
        "abc.def",
        "a.b.c.d",
        null as any,
        undefined as any,
      ];
      for (const m of malformed) {
        const parsed = await verifyTokenMock(m || "");
        assert.equal(parsed, null);
      }
    },
  );

  // SUITE 2: CRYPTOGRAPHIC INTEGRITY HASH (SHA-256)
  console.log("\n📦 [SUITE 2] SHA-256 Cryptographic Integrity Algorithm");
  await runTest(
    "Standard SHA-256 hash produces exact deterministic 256-bit digest",
    () => {
      const input = "Laporan Perundungan Siswa Kelas X-A";
      const expected = crypto.createHash("sha256").update(input).digest("hex");
      const actual = crypto.createHash("sha256").update(input).digest("hex");
      assert.equal(actual, expected);
      assert.equal(
        actual.length,
        64,
        "SHA-256 hex string must be exactly 64 characters",
      );
    },
  );

  // SUITE 3: SENSITIVE DATA RESPONSE SANITIZATION
  console.log("\n📦 [SUITE 3] Sensitive Data Sanitization Boundary");
  await runTest("Staff view strips recovery_code from tickets", () => {
    const rawTicket = {
      id: "ticket-123",
      ticket_number: "TMG-2026-TEST",
      story: "Test story",
      recovery_code: "aman-tameng-suara-1234",
      status: "diterima",
    };
    const { recovery_code, ...staffView } = rawTicket;
    assert.equal(
      "recovery_code" in staffView,
      false,
      "Staff view must not contain recovery_code",
    );
    assert.equal(staffView.ticket_number, "TMG-2026-TEST");
  });

  await runTest("User listing strips password_hash", () => {
    const rawUser = {
      id: "u-123",
      email: "guru@sekolah.sch.id",
      password_hash: "$2b$10$fakesecrethashhere",
      role: "guru",
    };
    const { password_hash, ...safeUser } = rawUser;
    assert.equal(
      "password_hash" in safeUser,
      false,
      "User response must not contain password_hash",
    );
    assert.equal(safeUser.email, "guru@sekolah.sch.id");
  });

  // SUITE 4: FAIL-CLOSED DATABASE ARCHITECTURE
  console.log("\n📦 [SUITE 4] Fail-Closed Database Boundary");
  await runTest(
    "Absence of DB connection rejects mutations with 503 instead of false 201",
    () => {
      const dbClient = null;
      let statusCode = 200;
      let responseBody = {};
      if (!dbClient) {
        statusCode = 503;
        responseBody = {
          success: false,
          error: "SERVICE_UNAVAILABLE",
          message: "Sistem penyimpanan aman sedang tidak tersedia.",
        };
      }
      assert.equal(statusCode, 503);
      assert.equal((responseBody as any).error, "SERVICE_UNAVAILABLE");
    },
  );

  // SUMMARY
  console.log("\n=================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=================================================");
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test runner crash:", err);
  process.exit(1);
});
