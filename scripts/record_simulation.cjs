const puppeteer = require("/home/arrafi/.npm/_npx/a779493e568f0a62/node_modules/puppeteer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const http = require("http");

// Helper untuk mengambil tiket terbaru langsung dari API lokal
function getLatestTicketFromAPI() {
  return new Promise((resolve) => {
    http.get("http://localhost:3001/api/tickets", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const tickets = JSON.parse(data);
          if (Array.isArray(tickets) && tickets.length > 0) {
            const sorted = tickets.sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            resolve(sorted[0].ticket_number || sorted[0].id || "");
          } else {
            resolve("");
          }
        } catch {
          resolve("");
        }
      });
    }).on("error", () => resolve(""));
  });
}

async function recordGrandMultiRoleSimulation() {
  const artifactDir = "/home/arrafi/.gemini/antigravity-ide/brain/cb95dc8b-674a-4eb9-9ad3-8325b67e4e6c";
  const outputMp4Workspace = path.resolve(__dirname, "../simulasi_laporan_ruang_aman.mp4");
  const outputMp4Artifact = path.join(artifactDir, "simulasi_laporan_ruang_aman.mp4");

  console.log("🎥 [RUANG AMAN - COMPLETE TUTORIAL & DEMO] Memulai Perekaman Video Demonstrasi Komprehensif...");
  console.log(`📁 Target Output: ${outputMp4Workspace}`);

  const ffmpeg = spawn("ffmpeg", [
    "-y",
    "-f", "image2pipe",
    "-vcodec", "mjpeg",
    "-framerate", "25",
    "-i", "-",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "medium",
    "-crf", "18",
    "-movflags", "+faststart",
    outputMp4Workspace,
  ]);

  ffmpeg.stderr.on("data", (data) => {
    const msg = data.toString();
    if (msg.includes("Error")) console.error("[FFmpeg Error]:", msg);
  });

  ffmpeg.on("close", (code) => {
    console.log(`🎬 FFmpeg selesai dengan status kode: ${code}`);
    try {
      if (fs.existsSync(outputMp4Workspace)) {
        fs.copyFileSync(outputMp4Workspace, outputMp4Artifact);
        console.log(`✅ Salinan video lengkap tersimpan di Artifact Directory: ${outputMp4Artifact}`);
      }
    } catch (e) {
      console.warn("Gagal menyalin ke artifact dir:", e.message);
    }
  });

  const browser = await puppeteer.launch({
    executablePath: "/home/arrafi/.cache/puppeteer/chrome/linux-148.0.7778.97/chrome-linux64/chrome",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1440,900",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Start CDP Screencast
  const client = await page.target().createCDPSession();
  await client.send("Page.startScreencast", {
    format: "jpeg",
    quality: 95,
    everyNthFrame: 1,
  });

  client.on("Page.screencastFrame", async ({ data, sessionId }) => {
    try {
      if (!ffmpeg.stdin.destroyed) {
        ffmpeg.stdin.write(Buffer.from(data, "base64"));
      }
      await client.send("Page.screencastFrameAck", { sessionId });
    } catch (err) {}
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Helper: Banner Tahapan di Layar (Visual Guide untuk Audiens/Juri)
  async function showStageBanner(role, stepNumber, title, subtitle, durationMs = 3500) {
    await page.evaluate((r, s, t, sub) => {
      let el = document.getElementById("demo-stage-banner");
      if (!el) {
        el = document.createElement("div");
        el.id = "demo-stage-banner";
        el.style.position = "fixed";
        el.style.top = "16px";
        el.style.left = "50%";
        el.style.transform = "translateX(-50%)";
        el.style.zIndex = "9999999";
        el.style.pointerEvents = "none";
        el.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
        document.body.appendChild(el);
      }
      el.innerHTML = `
        <div style="
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: #fff;
          padding: 9px 22px;
          border-radius: 9999px;
          box-shadow: 0 14px 36px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: system-ui, -apple-system, sans-serif;
          animation: fadeInDown 0.35s ease-out;
        ">
          <span style="
            background: linear-gradient(135deg, #2563eb, #4f46e5);
            color: #fff;
            font-size: 11px;
            font-weight: 800;
            padding: 5px 13px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            box-shadow: 0 2px 10px rgba(37, 99, 235, 0.45);
          ">${r} • TAHAP ${s}</span>
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 13px; font-weight: 700; color: #f8fafc; line-height: 1.3;">${t}</span>
            <span style="font-size: 11px; color: #94a3b8; font-weight: 500; line-height: 1.2;">${sub}</span>
          </div>
        </div>
      `;
      el.style.opacity = "1";
    }, role, stepNumber, title, subtitle);
    await sleep(durationMs);
  }

  // Helper: Smooth Scroll
  async function smoothScroll(distance, durationMs = 1500) {
    await page.evaluate(async (dist, dur) => {
      const start = window.scrollY;
      const startTime = performance.now();
      await new Promise((resolve) => {
        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / dur, 1);
          const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
          window.scrollTo(0, start + dist * ease);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }, distance, durationMs);
    await sleep(600);
  }

  let generatedTicketId = "";

  try {
    // =========================================================================
    // INTRO: BERANDA RESMI RUANG AMAN
    // =========================================================================
    console.log("\n=======================================================");
    console.log("🌟 INTRO: PLATFORM RUANG AMAN & PRINSIP PRIVASI 100% ANONIM");
    console.log("=======================================================");

    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
    await sleep(2500);

    await showStageBanner(
      "EKOSISTEM RUANG AMAN",
      "INTRO",
      "Platform PPKSP Satuan Pendidikan Nasional",
      "Sistem Pelaporan Kekerasan 100% Anonim, Terenkripsi & Terintegrasi Multi-Peran",
      4000
    );
    await smoothScroll(450, 1600);
    await sleep(2000);
    await smoothScroll(-450, 1400);
    await sleep(1800);

    // =========================================================================
    // SCENE 1: ADMIN SISTEM & PUSAT KENDALI (KELOLA AKUN PETUGAS & AUDIT LOG)
    // =========================================================================
    console.log("\n=======================================================");
    console.log("🌟 SCENE 1: ADMIN SISTEM - MANAJEMEN PENGGUNA & AUDIT LOG KRIPTOGRAFIS");
    console.log("=======================================================");

    // Switch to Admin System Role
    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("admin");
      }
    });
    await sleep(2500);

    await showStageBanner(
      "ADMIN SISTEM",
      "1 / 6",
      "Manajemen Pengguna & Pusat Kendali Satgas",
      "Admin mendaftarkan petugas Satgas PPKSP / Guru BK dan memantau log audit",
      3800
    );

    console.log("👉 Admin: Membuka Modal Tambah Pengguna Baru...");
    await page.evaluate(() => {
      const addBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Tambah Pengguna") || b.textContent?.includes("Buat Akun")
      );
      if (addBtn) addBtn.click();
    });
    await sleep(2000);

    // Isi Form Pembuatan Akun Baru dengan pengetikan terarah
    console.log("👉 Admin: Mengisi Data Guru BK Baru...");
    const nameInput = await page.$("input[placeholder*='Nama Lengkap'], input[placeholder*='nama']");
    if (nameInput) {
      await nameInput.click();
      await page.keyboard.type("Dra. Siti Aminah, M.Pd", { delay: 45 });
      await sleep(600);
    }

    const emailInput = await page.$("input[placeholder*='email'], input[type='email']");
    if (emailInput) {
      await emailInput.click();
      await page.keyboard.type("siti.aminah@sman1jkt.sch.id", { delay: 40 });
      await sleep(600);
    }

    const nipInput = await page.$("input[placeholder*='NIP'], input[placeholder*='NUPTK']");
    if (nipInput) {
      await nipInput.click();
      await page.keyboard.type("19830514 200801 2 007", { delay: 40 });
      await sleep(600);
    }

    const schoolInput = await page.$("input[placeholder*='SMA Negeri'], input[placeholder*='Instansi']");
    if (schoolInput) {
      await schoolInput.click();
      await page.keyboard.type("SMA Negeri 1 Jakarta", { delay: 40 });
      await sleep(800);
    }

    // Submit Pembuatan Akun
    console.log("👉 Admin: Menyimpan Akun Baru...");
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Simpan Pengguna") || b.textContent?.includes("Tambah Petugas")
      );
      if (submitBtn) submitBtn.click();
    });
    await sleep(3000);

    // Buka Tab Log Audit Kriptografis ZKP
    console.log("👉 Admin: Meninjau Log Audit Kriptografis ZKP...");
    await showStageBanner(
      "ADMIN SISTEM",
      "1 / 6",
      "Log Audit Kriptografis & Integritas Data",
      "Semua aktivitas tercatat secara immutable tanpa menyimpan data pribadi",
      3500
    );

    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Log Audit") || b.textContent?.includes("Audit")
      );
      if (tab) tab.click();
    });
    await sleep(2200);
    await smoothScroll(350, 1400);
    await sleep(2000);
    await smoothScroll(-350, 1200);
    await sleep(1800);

    // =========================================================================
    // SCENE 2: GURU BK / SATGAS SEKOLAH (GENERATE TOKEN MASSAL KELAS X)
    // =========================================================================
    console.log("\n=======================================================");
    console.log("🌟 SCENE 2: GURU BK - PEMBAGIAN KODE AKSES SISWA SECARA ANONIM");
    console.log("=======================================================");

    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("guru");
      }
    });
    await sleep(2500);

    await showStageBanner(
      "GURU BK / SATGAS",
      "2 / 6",
      "Generate Batch Kode Akses Siswa",
      "Slip dibagikan acak ke siswa tanpa mencatat nama atau nomor absen siswa",
      3800
    );

    // Buka Tab Kode Akses Siswa
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Kode Akses Siswa") || b.textContent?.includes("Token")
      );
      if (tab) tab.click();
    });
    await sleep(2200);

    console.log("👉 Guru BK: Generate Batch Token Baru untuk Kelas X...");
    await smoothScroll(250, 1000);
    await sleep(1200);

    // Generate Token
    await page.evaluate(() => {
      const genBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Buat Batch Token") || b.textContent?.includes("Generate")
      );
      if (genBtn) genBtn.click();
    });
    await sleep(3000);

    // Buka Modal Cetak Slip Fisik
    console.log("👉 Guru BK: Membuka Pratinjau Cetak Slip Fisik...");
    await page.evaluate(() => {
      const printBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Cetak Slip Fisik") || b.textContent?.includes("Cetak")
      );
      if (printBtn) printBtn.click();
    });
    await sleep(3500);

    // Tutup Modal Cetak
    await page.evaluate(() => {
      const closeBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Tutup") || b.querySelector("svg.lucide-x")
      );
      if (closeBtn) closeBtn.click();
    });
    await sleep(1800);

    // =========================================================================
    // SCENE 3: SISWA (VERIFIKASI 2 LANGKAH & PEMBUATAN LAPORAN ANONIM)
    // =========================================================================
    console.log("\n=======================================================");
    console.log("🌟 SCENE 3: SISWA - VERIFIKASI 2 LANGKAH & PELAPORAN 100% ANONIM");
    console.log("=======================================================");

    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("siswa");
      }
    });
    await sleep(2200);

    await showStageBanner(
      "SISWA (PELAPOR)",
      "3 / 6",
      "Pelaporan 100% Anonim & Verifikasi 2-Langkah",
      "Siswa tidak perlu daftar akun/email. Cukup kode acak + sandi pribadi buatan sendiri",
      4000
    );

    // Beranda & CTA Lapor
    await page.evaluate(() => {
      const cta = Array.from(document.querySelectorAll("button, a")).find(
        (b) => b.textContent?.includes("Buat Laporan") || b.textContent?.includes("Lapor Sekarang")
      );
      if (cta) cta.click();
    });
    await sleep(2500);

    // 3.1 Langkah 1: Kode Akses Sekolah
    console.log("👉 Siswa: Memasukkan Kode Akses Sekolah (Langkah 1)...");
    const tokenField = await page.$("input[placeholder*='SCH-']");
    if (tokenField) {
      await tokenField.click();
      await page.keyboard.type("SCH-X1-8831", { delay: 65 });
      await sleep(1000);

      await page.evaluate(() => {
        const verifyBtn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.includes("Verifikasi") || b.textContent?.includes("Lanjut Verifikasi")
        );
        if (verifyBtn) verifyBtn.click();
      });
      await sleep(2800);
    }

    // 3.2 Langkah 2: Buat Sandi Pribadi Pelajar
    console.log("👉 Siswa: Membuat Sandi Pribadi Pelajar (Langkah 2)...");
    await showStageBanner(
      "SISWA (PELAPOR)",
      "3 / 6",
      "Langkah 2: Sandi Pribadi Pelajar (Anti-Intip)",
      "Mencegah orang lain yang memungut slip melihat laporan siswa",
      3500
    );

    const pwdInputs = await page.$$("input[type='password'], input[placeholder*='sandi'], input[placeholder*='Sandi']");
    if (pwdInputs.length >= 2) {
      await pwdInputs[0].click();
      await page.keyboard.type("siswa2026", { delay: 60 });
      await sleep(600);

      await pwdInputs[1].click();
      await page.keyboard.type("siswa2026", { delay: 60 });
      await sleep(1000);

      await page.evaluate(() => {
        const saveBtn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.includes("Simpan Sandi") || b.textContent?.includes("Buka Formulir")
        );
        if (saveBtn) saveBtn.click();
      });
      await sleep(3500);
    }

    // 3.3 Formulir Laporan: Kategori, Peran, & Kronologi
    console.log("👉 Siswa: Mengisi Kategori & Peran...");
    await showStageBanner(
      "SISWA (PELAPOR)",
      "3 / 6",
      "Pengisian Laporan & AI PII Stripper",
      "Sistem otomatis menyamarkan nama dan nomor kontak demi melindungi identitas",
      3800
    );

    // Pilih Kategori Perundungan
    await page.evaluate(() => {
      const catBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Perundungan") || b.textContent?.includes("Bullying")
      );
      if (catBtn) catBtn.click();
    });
    await sleep(900);

    // Pilih Peran Siswa Korban
    await page.evaluate(() => {
      const roleBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Siswa (Korban)") || b.textContent?.includes("Korban")
      );
      if (roleBtn) roleBtn.click();
    });
    await sleep(900);

    // Ketik Kronologi dengan data personal PII
    const textarea = await page.$("textarea");
    if (textarea) {
      await textarea.click();
      const rawStory =
        "Saya atas nama Budi Santoso dari kelas X-1 mengalami pemalakan dan ancaman fisik oleh sekelompok siswa senior di area kantin belakang dekat koperasi. Hubungi saya di 081234567890 jika ada tindak lanjut.";
      for (const char of rawStory) {
        await page.keyboard.type(char, { delay: 30 });
      }
      await sleep(1600);

      // Demonstrasikan 1-klik sensor PII
      console.log("👉 Siswa: Menekan Tombol AI PII Stripper untuk sensor otomatis...");
      await page.evaluate(() => {
        const redactBtn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.includes("Samarkan") || b.textContent?.includes("Sensor") || b.textContent?.includes("Bersihkan PII")
        );
        if (redactBtn) redactBtn.click();
      });
      await sleep(2500);
    }

    // Detail Tambahan & Urgensi
    await page.evaluate(() => {
      const toggleDetailsBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Detail Tambahan") || b.textContent?.includes("Lokasi & Waktu")
      );
      if (toggleDetailsBtn) toggleDetailsBtn.click();
    });
    await sleep(900);

    const locationInput = await page.$("input[placeholder*='kantin'], input[placeholder*='lokasi'], input[placeholder*='Lokasi']");
    if (locationInput) {
      await locationInput.type("Area Kantin Belakang Dekat Koperasi", { delay: 35 });
      await sleep(800);
    }

    // Urgensi Tinggi
    await page.evaluate(() => {
      const highUrgency = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Tinggi") || b.textContent?.includes("Mendesak")
      );
      if (highUrgency) highUrgency.click();
    });
    await sleep(900);

    // Lanjut ke Langkah 2 Verifikasi PIN
    await page.evaluate(() => {
      const nextBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Lanjut ke Verifikasi") || b.textContent?.includes("Langkah Berikutnya")
      );
      if (nextBtn) nextBtn.click();
    });
    await sleep(2200);

    // PIN Rahasia 4-digit
    console.log("👉 Siswa: Memasukkan PIN Rahasia Pemulihan 7890...");
    const pinField = await page.$("input[placeholder*='PIN'], input[type='password'], input[maxlength='6']");
    if (pinField) {
      await pinField.click();
      await page.keyboard.type("7890", { delay: 120 });
      await sleep(1000);
    }

    // Checkbox Persetujuan
    await page.evaluate(() => {
      const chk = document.querySelector("input[type='checkbox']");
      if (chk && !chk.checked) chk.click();
    });
    await sleep(1200);

    console.log("👉 Siswa: Mengirim Laporan Terenkripsi ZKP...");
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Kirim Laporan Terenkripsi") || b.textContent?.includes("Kirim Laporan")
      );
      if (submitBtn) submitBtn.click();
    });
    await sleep(4500);

    // Dapatkan Nomor Tiket yang baru saja terbit
    generatedTicketId = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll("*")).find((e) => e.textContent?.startsWith("TMG-202"));
      return el ? el.textContent.trim() : "";
    });
    if (!generatedTicketId) {
      generatedTicketId = await getLatestTicketFromAPI();
    }
    console.log(`🎫 Tiket Baru Terbit: ${generatedTicketId}`);

    await showStageBanner(
      "SISWA (PELAPOR)",
      "3 / 6",
      "Laporan Berhasil Terkirim • Tiket Terbit",
      "Siswa mengunduh bukti tiket & kode pemulihan unik untuk memantau kasus",
      3500
    );

    // Salin dan Unduh Bukti
    await page.evaluate(() => {
      const copyBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Salin Nomor") || b.textContent?.includes("Salin")
      );
      if (copyBtn) copyBtn.click();
    });
    await sleep(1500);

    await page.evaluate(() => {
      const dlBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Unduh") || b.textContent?.includes("Download")
      );
      if (dlBtn) dlBtn.click();
    });
    await sleep(2500);

    // =========================================================================
    // SCENE 4: GURU BK / SATGAS SEKOLAH (TRIAGE, CATATAN, CHAT, & PENANGANAN)
    // =========================================================================
    console.log("\n=======================================================");
    console.log("🌟 SCENE 4: GURU BK - TRIAGE KASUS, BALAS CHAT & UNGGAH BAP");
    console.log("=======================================================");

    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("guru");
      }
    });
    await sleep(2500);

    await showStageBanner(
      "GURU BK / SATGAS",
      "4 / 6",
      "Triage Laporan & Chat Rahasia 2-Arah",
      "Guru BK merespons laporan tanpa pernah mengetahui nama pelapor",
      3800
    );

    console.log("👉 Guru BK: Membuka Laporan Siswa yang Baru Masuk...");
    // Klik tiket pertama di tabel triage
    await page.evaluate(() => {
      const firstRow = document.querySelector("tr.cursor-pointer, tbody tr");
      if (firstRow) firstRow.click();
    });
    await sleep(2500);

    await smoothScroll(350, 1200);
    await sleep(1800);

    console.log("👉 Guru BK: Mengubah Status ke 'Ditinjau'...");
    await page.evaluate(() => {
      const statusBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Tandai Ditinjau") || b.textContent?.includes("Ditinjau")
      );
      if (statusBtn) statusBtn.click();
    });
    await sleep(2000);

    // Tambah Catatan Rahasia Satgas
    console.log("👉 Guru BK: Menulis Catatan Rahasia Internal Satgas...");
    const noteTextarea = await page.$("textarea[placeholder*='catatan'], textarea[placeholder*='Catatan']");
    if (noteTextarea) {
      await noteTextarea.click();
      const counselorNote =
        "Kasus perundungan kantin belakang. CCTV telah diamankan dan jadwal pemanggilan terduga pelaku telah disiapkan.";
      for (const char of counselorNote) {
        await page.keyboard.type(char, { delay: 25 });
      }
      await sleep(1000);

      await page.evaluate(() => {
        const saveNoteBtn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.includes("Simpan Catatan") || b.textContent?.includes("Catatan")
        );
        if (saveNoteBtn) saveNoteBtn.click();
      });
      await sleep(2500);
    }

    console.log("👉 Guru BK: Mengirim Pesan Pendampingan Aman di Chat Rahasia 2-Arah...");
    const counselorChatInput = await page.$(
      "input[placeholder*='Ketik balasan'], textarea[placeholder*='balasan'], input[placeholder*='pesan']"
    );
    if (counselorChatInput) {
      await counselorChatInput.click();
      const counselorReply =
        "Halo ananda, laporanmu sudah kami terima secara aman dan rahasia. Kamu berada di bawah perlindungan penuh Satgas PPKSP. Besok sepulang sekolah silakan mampir ke ruang konseling.";
      for (const char of counselorReply) {
        await page.keyboard.type(char, { delay: 25 });
      }
      await sleep(1200);

      await page.evaluate(() => {
        const sendBtn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.includes("Kirim") || b.querySelector("svg.lucide-send")
        );
        if (sendBtn) sendBtn.click();
      });
      await sleep(2500);
    }

    console.log("👉 Guru BK: Mengunggah Bukti Penanganan & Beralih Status ke 'Menunggu Konfirmasi Siswa'...");
    await showStageBanner(
      "GURU BK / SATGAS",
      "4 / 6",
      "Tindakan Penanganan & Berita Acara (BAP)",
      "Sekolah mengunggah bukti mediasi dan menyiapkan BAP resmi PPKSP",
      3500
    );

    await page.evaluate(() => {
      const actionBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Tindakan") || b.textContent?.includes("Kirim Bukti") || b.textContent?.includes("Selesaikan")
      );
      if (actionBtn) actionBtn.click();
    });
    await sleep(2800);

    // Buka Preview Cetak BAP Resmi
    console.log("👉 Guru BK: Membuka Pratinjau Berita Acara Pemeriksaan (BAP) Resmi PPKSP...");
    await page.evaluate(() => {
      const bapBtn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Cetak BAP") || b.textContent?.includes("Berita Acara")
      );
      if (bapBtn) bapBtn.click();
    });
    await sleep(3800);

    // Tutup BAP Modal
    await page.evaluate(() => {
      const closeBap = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.includes("Tutup") || b.querySelector("svg.lucide-x")
      );
      if (closeBap) closeBap.click();
    });
    await sleep(2000);

    // =========================================================================
    // SCENE 5: SISWA (MEMBACA RESPON GURU BK & KONFIRMASI PENYELESAIAN)
    // =========================================================================
    console.log("\n=======================================================");
    console.log("🌟 SCENE 5: SISWA - MEMBACA RESPON GURU BK & TUTUP KASUS RESMI");
    console.log("=======================================================");

    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("siswa");
      }
    });
    await sleep(2200);

    await showStageBanner(
      "SISWA (PELAPOR)",
      "5 / 6",
      "Pantau Tiket & Hak Penutupan Kasus",
      "Kasus hanya sah selesai jika siswa mengonfirmasi bahwa masalah benar tuntas",
      3800
    );

    // Buka menu Pantau Tiket
    await page.evaluate(() => {
      const trackNav = Array.from(document.querySelectorAll("button, a")).find(
        (b) => b.textContent?.includes("Pantau Status") || b.textContent?.includes("Pantau Tiket") || b.textContent?.includes("Cek Status")
      );
      if (trackNav) trackNav.click();
    });
    await sleep(2500);

    if (generatedTicketId) {
      const trackInput = await page.$("input[placeholder*='TMG-']");
      if (trackInput) {
        await trackInput.click();
        await page.keyboard.type(generatedTicketId, { delay: 45 });
        await sleep(800);
        await page.evaluate(() => {
          const searchBtn = Array.from(document.querySelectorAll("button")).find(
            (b) => b.textContent?.includes("Cari") || b.textContent?.includes("Periksa")
          );
          if (searchBtn) searchBtn.click();
        });
        await sleep(3000);
      }
    }

    console.log("👉 Siswa: Mengetik Balasan Terima Kasih ke Guru BK...");
    await smoothScroll(350, 1100);
    await sleep(1500);

    const studentChatInput = await page.$(
      "input[placeholder*='Pesan'], textarea[placeholder*='pesan'], input[placeholder*='Balas']"
    );
    if (studentChatInput) {
      await studentChatInput.click();
      const studentMsg =
        "Terima kasih banyak Ibu Guru BK dan Satgas, sekarang saya merasa sangat aman dan masalahnya sudah terselesaikan dengan baik.";
      for (const char of studentMsg) {
        await page.keyboard.type(char, { delay: 25 });
      }
      await sleep(1000);

      await page.evaluate(() => {
        const sendBtn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.includes("Kirim") || b.querySelector("svg.lucide-send")
        );
        if (sendBtn) sendBtn.click();
      });
      await sleep(2800);
    }

    console.log("👉 Siswa: Menekan Tombol Konfirmasi Selesai (Tutup Kasus di Tangan Siswa)...");
    await page.evaluate(() => {
      const confirmCloseBtn = Array.from(document.querySelectorAll("button")).find(
        (b) =>
          b.textContent?.includes("Konfirmasi Selesai") ||
          b.textContent?.includes("Tutup Laporan") ||
          b.textContent?.includes("Masalah Tuntas")
      );
      if (confirmCloseBtn) confirmCloseBtn.click();
    });
    await sleep(3500);
    await smoothScroll(-350, 1100);
    await sleep(2200);

    // =========================================================================
    // SCENE 6: DINAS PENDIDIKAN & UPTD PPA (MONITORING NASIONAL & INTERVENSI)
    // =========================================================================
    console.log("\n=======================================================");
    console.log("🌟 SCENE 6: DINAS PENDIDIKAN & UPTD PPA - PENGAWASAN & INTERVENSI");
    console.log("=======================================================");

    // 6.1 Dinas Pendidikan
    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("dinas-pendidikan");
      }
    });
    await sleep(2500);

    await showStageBanner(
      "DINAS PENDIDIKAN",
      "6 / 6",
      "Pengawasan Indeks Kerawanan & Kepatuhan Satuan Pendidikan",
      "Dinas memantau kecepatan respon sekolah dan kepatuhan SOP PPKSP Kemendikbud",
      4000
    );

    console.log("👉 Dinas Pendidikan: Memantau Indeks Kerawanan & Kepatuhan Satuan Pendidikan...");
    await smoothScroll(450, 1400);
    await sleep(2800);
    await smoothScroll(-450, 1200);
    await sleep(2000);

    // 6.2 Dinas Perlindungan (UPTD PPA)
    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("dinas-perlindungan");
      }
    });
    await sleep(2500);

    await showStageBanner(
      "UPTD PPA (DINAS PERLINDUNGAN)",
      "6 / 6",
      "Rujukan Kasus Kritis & Layanan Rumah Aman Terpadu",
      "Dukungan pendampingan psikologis dan perlindungan fisik terintegrasi",
      4000
    );

    console.log("👉 UPTD PPA: Meninjau Rujukan Kasus Kritis, Disposisi Psikolog & Rumah Aman...");
    await smoothScroll(450, 1400);
    await sleep(2800);
    await smoothScroll(-450, 1200);
    await sleep(2000);

    // =========================================================================
    // FINALE: KEMBALI KE BERANDA RESMI RUANG AMAN
    // =========================================================================
    await page.evaluate(() => {
      if (typeof window.__switchRole === "function") {
        window.__switchRole("siswa");
      }
    });
    await sleep(2000);

    await page.evaluate(() => {
      const brandBtn = document.getElementById("brand-logo-button");
      if (brandBtn) brandBtn.click();
    });
    await sleep(2000);

    await showStageBanner(
      "RUANG AMAN",
      "SELESAI",
      "Platform Perlindungan & Penanganan Kekerasan PPKSP",
      "Aman • Anonim • Terverifikasi Kriptografis • Berkeadilan",
      5000
    );
    await sleep(3000);

    console.log("🎉 SELURUH SKENARIO 6 TAHAP SELESAI DIREKAM DENGAN SANGAT JELAS & SEMPURNA!");
  } catch (err) {
    console.error("❌ Kesalahan saat merekam grand simulation:", err);
  } finally {
    console.log("🛑 Menutup perekam dan mengompilasi video MP4...");
    try {
      await client.send("Page.stopScreencast");
    } catch {}
    await browser.close();
    ffmpeg.stdin.end();

    await new Promise((resolve) => {
      ffmpeg.on("close", resolve);
      setTimeout(resolve, 10000);
    });
  }
}

recordGrandMultiRoleSimulation().catch(console.error);
