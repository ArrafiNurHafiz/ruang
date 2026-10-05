import assert from "node:assert/strict";

const BASE_URL = "https://ruang.rapsdev.web.id";
const API_URL = `${BASE_URL}/api`;

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

function pass(name, detail = "") {
  console.log(`  ✅ [PASS] ${name} ${detail ? "(" + detail + ")" : ""}`);
  results.passed.push({ name, detail });
}

function fail(name, error) {
  console.error(`  ❌ [FAIL] ${name}: ${error}`);
  results.failed.push({ name, error });
}

function warn(name, note) {
  console.warn(`  ⚠️ [WARN] ${name}: ${note}`);
  results.warnings.push({ name, note });
}

async function runAudit() {
  console.log("=======================================================");
  console.log("🔍 AUDIT MENYELURUH BACKEND API: " + API_URL);
  console.log("=======================================================\n");

  // 1. Health & Public GETs
  console.log("📌 1. Pengujian Endpoint Publik");

  try {
    const res = await fetch(`${API_URL}/dashboard/stats`);
    if (res.status === 200) {
      const data = await res.json();
      pass("/api/dashboard/stats", JSON.stringify(data));
    } else {
      fail("/api/dashboard/stats", `Status ${res.status}`);
    }
  } catch (e) {
    fail("/api/dashboard/stats", e.message);
  }

  try {
    const res = await fetch(`${API_URL}/news`);
    if (res.status === 200) {
      const data = await res.json();
      if (data.length === 0) {
        warn("/api/news", "Tabel kosong di database live, fallback ke mock");
      } else {
        pass("/api/news", `${data.length} artikel`);
      }
    } else {
      fail("/api/news", `Status ${res.status}`);
    }
  } catch (e) {
    fail("/api/news", e.message);
  }

  try {
    const res = await fetch(`${API_URL}/regional-schools`);
    if (res.status === 200) {
      const data = await res.json();
      pass("/api/regional-schools", `${data.length} sekolah`);
    } else {
      fail("/api/regional-schools", `Status ${res.status}`);
    }
  } catch (e) {
    fail("/api/regional-schools", e.message);
  }

  try {
    const res = await fetch(`${API_URL}/help-articles`);
    if (res.status === 200) {
      const data = await res.json();
      if (data.length === 0) {
        warn("/api/help-articles", "Tabel kosong di database live");
      } else {
        pass("/api/help-articles", `${data.length} artikel`);
      }
    } else {
      fail("/api/help-articles", `Status ${res.status}`);
    }
  } catch (e) {
    fail("/api/help-articles", e.message);
  }

  try {
    const res = await fetch(`${API_URL}/faqs`);
    if (res.status === 200) {
      const data = await res.json();
      if (data.length === 0) {
        warn("/api/faqs", "Tabel kosong di database live");
      } else {
        pass("/api/faqs", `${data.length} FAQ`);
      }
    } else {
      fail("/api/faqs", `Status ${res.status}`);
    }
  } catch (e) {
    fail("/api/faqs", e.message);
  }

  try {
    const res = await fetch(`${API_URL}/school-profile`);
    if (res.status === 200) {
      const data = await res.json();
      pass("/api/school-profile", data.schoolName || "OK");
    } else {
      fail("/api/school-profile", `Status ${res.status}`);
    }
  } catch (e) {
    fail("/api/school-profile", e.message);
  }

  // 2. Authentication
  console.log("\n📌 2. Pengujian Login Multi-Role");
  const roles = [
    { email: "arrafinur1@gmail.com", role: "admin", name: "Admin Sistem" },
    { email: "arrafinur2@gmail.com", role: "guru", name: "Guru BK" },
    { email: "arrafinur3@gmail.com", role: "dinas-pendidikan", name: "Dinas Pendidikan" },
    { email: "arrafinur4@gmail.com", role: "dinas-perlindungan", name: "UPTD PPA" },
  ];

  const tokens = {};

  for (const r of roles) {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: r.email, password: "wrongpassword" }),
      });
      if (res.status === 401) {
        pass(`Login ${r.name} tolak password salah (401)`);
      } else {
        fail(`Login ${r.name} password salah`, `Status ${res.status}`);
      }
    } catch (e) {
      fail(`Login ${r.name} password salah`, e.message);
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: r.email, password: "11223344" }),
      });
      if (res.status === 200) {
        const body = await res.json();
        if (body.token && body.user) {
          pass(`Login ${r.name} sukses (200)`, `Role: ${body.user.role}`);
          tokens[r.role] = body.token;
        } else {
          fail(`Login ${r.name} payload tidak lengkap`, JSON.stringify(body));
        }
      } else {
        fail(`Login ${r.name}`, `Status ${res.status}`);
      }
    } catch (e) {
      fail(`Login ${r.name}`, e.message);
    }
  }

  // 3. Authenticated Endpoints
  console.log("\n📌 3. Pengujian Endpoint Terproteksi Token");
  if (tokens["guru"]) {
    try {
      const res = await fetch(`${API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${tokens["guru"]}` },
      });
      if (res.status === 200) {
        const data = await res.json();
        pass("GET /api/tickets (Guru BK)", `${data.length} tiket ditemukan`);
      } else {
        fail("GET /api/tickets (Guru BK)", `Status ${res.status}`);
      }
    } catch (e) {
      fail("GET /api/tickets (Guru BK)", e.message);
    }
  }

  if (tokens["admin"]) {
    try {
      const res = await fetch(`${API_URL}/tokens`, {
        headers: { Authorization: `Bearer ${tokens["admin"]}` },
      });
      if (res.status === 200) {
        const data = await res.json();
        pass("GET /api/tokens (Admin)", `${data.length} token ditemukan`);
      } else {
        fail("GET /api/tokens (Admin)", `Status ${res.status}`);
      }
    } catch (e) {
      fail("GET /api/tokens (Admin)", e.message);
    }

    try {
      const res = await fetch(`${API_URL}/audit-logs`, {
        headers: { Authorization: `Bearer ${tokens["admin"]}` },
      });
      if (res.status === 200) {
        const data = await res.json();
        pass("GET /api/audit-logs (Admin)", `${data.length} log ditemukan`);
      } else {
        fail("GET /api/audit-logs (Admin)", `Status ${res.status}`);
      }
    } catch (e) {
      fail("GET /api/audit-logs (Admin)", e.message);
    }

    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${tokens["admin"]}` },
      });
      if (res.status === 200) {
        const data = await res.json();
        pass("GET /api/users (Admin)", `${data.length} user terdaftar`);
      } else {
        fail("GET /api/users (Admin)", `Status ${res.status}`);
      }
    } catch (e) {
      fail("GET /api/users (Admin)", e.message);
    }
  }

  if (tokens["dinas-perlindungan"]) {
    try {
      const res = await fetch(`${API_URL}/interventions`, {
        headers: { Authorization: `Bearer ${tokens["dinas-perlindungan"]}` },
      });
      if (res.status === 200) {
        const data = await res.json();
        pass("GET /api/interventions (UPTD PPA)", `${data.length} intervensi ditemukan`);
      } else {
        fail("GET /api/interventions (UPTD PPA)", `Status ${res.status}`);
      }
    } catch (e) {
      fail("GET /api/interventions (UPTD PPA)", e.message);
    }
  }

  console.log("\n=======================================================");
  console.log(`📊 RINGKASAN AUDIT: ${results.passed.length} PASS | ${results.failed.length} FAIL | ${results.warnings.length} WARN`);
  console.log("=======================================================");
}

runAudit();
