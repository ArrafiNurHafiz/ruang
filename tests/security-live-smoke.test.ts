import https from "node:https";
import assert from "node:assert/strict";

interface RequestResult {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
}

function request(
  options: https.RequestOptions,
  data?: string,
): Promise<RequestResult> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () =>
        resolve({
          status: res.statusCode || 0,
          headers: res.headers,
          body,
        }),
      );
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

const TARGET_HOST = process.env.TEST_HOST || "ruang.rapsdev.web.id";

let passed = 0;
let failed = 0;

async function check(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Reason: ${err.message}`);
    failed++;
  }
}

async function runLiveSmokeTests() {
  console.log("=================================================");
  console.log(`🌐 PRODUCTION SECURITY SMOKE TEST: https://${TARGET_HOST}`);
  console.log("=================================================\n");

  // 1. UNAUTHENTICATED PRIVATE ENDPOINT BOUNDARIES (MUST BE 401)
  console.log(
    "🔒 [CHECK 1] Unauthenticated Private Access Guards (Must return 401)",
  );

  const privateEndpoints = [
    "/api/tickets",
    "/api/users",
    "/api/audit-logs",
    "/api/interventions",
    "/api/tokens?schoolId=default-school",
  ];

  for (const ep of privateEndpoints) {
    await check(
      `GET ${ep} without Authorization header returns 401`,
      async () => {
        const res = await request({
          hostname: TARGET_HOST,
          path: ep,
          method: "GET",
        });
        assert.equal(
          res.status,
          401,
          `Expected 401 Unauthorized for ${ep}, got ${res.status}`,
        );
        assert.doesNotMatch(
          res.body,
          /password_hash|recovery_code/i,
          `Sensitive credentials leaked in error response on ${ep}`,
        );
      },
    );
  }

  // 2. INVALID / TAMPERED TOKEN GUARDS
  console.log("\n🔒 [CHECK 2] Invalid & Tampered Token Handling");
  await check(
    "Tampered Bearer token signature is rejected with 401",
    async () => {
      const res = await request({
        hostname: TARGET_HOST,
        path: "/api/tickets",
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.invalid_signature",
        },
      });
      assert.equal(res.status, 401);
    },
  );

  // 3. PUBLIC TICKET ACCESS BOUNDARY
  console.log("\n🔒 [CHECK 3] Public Ticket Verification Gate");
  await check(
    "POST /api/tickets/verify-access without recoveryCode returns 400",
    async () => {
      const res = await request(
        {
          hostname: TARGET_HOST,
          path: "/api/tickets/verify-access",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        JSON.stringify({}),
      );
      assert.equal(res.status, 400);
    },
  );

  await check(
    "POST /api/tickets/verify-access with non-existent code returns 404",
    async () => {
      const res = await request(
        {
          hostname: TARGET_HOST,
          path: "/api/tickets/verify-access",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        JSON.stringify({ recoveryCode: "non-existent-random-code-8888" }),
      );
      assert.equal(res.status, 404);
    },
  );

  // 4. DIRECT IDOR PROBE PROTECTION
  console.log("\n🔒 [CHECK 4] Direct IDOR Probe Protection");
  await check(
    "Direct ticket UUID access without auth returns 401",
    async () => {
      const res = await request({
        hostname: TARGET_HOST,
        path: "/api/tickets/b0000000-0000-0000-0000-000000000001",
        method: "GET",
      });
      assert.equal(res.status, 401);
    },
  );

  // SUMMARY
  console.log("\n=================================================");
  console.log(`📊 LIVE SMOKE RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("=================================================");
  if (failed > 0) {
    process.exit(1);
  }
}

runLiveSmokeTests().catch((err) => {
  console.error("Live test suite crashed:", err);
  process.exit(1);
});
