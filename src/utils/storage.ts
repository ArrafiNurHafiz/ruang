import {
  ReportTicket,
  SchoolToken,
  SchoolProfile,
  UserAccount,
  AuditLog,
  ProtectionIntervention,
  DatabaseBackupPayload,
} from "../types";
import {
  INITIAL_TICKETS,
  MOCK_SCHOOL_TOKENS,
  MOCK_USERS,
  INITIAL_AUDIT_LOGS,
  MOCK_PROTECTION_INTERVENTIONS,
} from "../data/mockData";

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  schoolName: "SMA Negeri 1 Jakarta",
  npsn: "20100192",
  district: "Sawah Besar, Jakarta Pusat",
  province: "DKI Jakarta",
  address: "Jl. Budi Utomo No. 7, Pasar Baru, Sawah Besar, Jakarta Pusat 10710",
  phone: "(021) 3865001",
  email: "satgas.ppksp@sman1jakarta.sch.id",
  website: "https://sman1jakarta.sch.id",
  principalName: "Drs. H. Mulyadi, M.M",
  principalNip: "19680315 199303 1 004",
  satgasLeaderName: "Ahmad Fauzi, S.Pd",
  satgasLeaderNip: "19840719 200902 1 003",
  counselorCoordinatorName: "Dra. Hj. Nurjanah, M.Pd",
  counselorCoordinatorNip: "19780412 200501 2 003",
  hotlineNumber: "0821-9988-7711",
  emergencyPin: "9911",
  satgasSkNumber: "SK-PPKSP/046/SMAN1/2024",
  satgasSkDate: "15 Januari 2024",
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEYS = {
  PROFILE: "tameng_school_profile",
  TICKETS: "tameng_tickets",
  TOKENS: "tameng_tokens",
  USERS: "tameng_users",
  AUDIT_LOGS: "tameng_audit_logs",
  INTERVENTIONS: "tameng_interventions",
};

// Safe JSON parse helper
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`[TAMENG Storage] Error parsing key ${key}:`, err);
    return fallback;
  }
}

// Safe JSON save helper
function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[TAMENG Storage] Error saving key ${key}:`, err);
  }
}

export const StorageEngine = {
  getSchoolProfile(): SchoolProfile {
    return safeGet<SchoolProfile>(STORAGE_KEYS.PROFILE, DEFAULT_SCHOOL_PROFILE);
  },
  saveSchoolProfile(profile: SchoolProfile): void {
    safeSet(STORAGE_KEYS.PROFILE, profile);
  },

  getTickets(): ReportTicket[] {
    return safeGet<ReportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
  },
  saveTickets(tickets: ReportTicket[]): void {
    safeSet(STORAGE_KEYS.TICKETS, tickets);
  },

  getTokens(): SchoolToken[] {
    return safeGet<SchoolToken[]>(STORAGE_KEYS.TOKENS, MOCK_SCHOOL_TOKENS);
  },
  saveTokens(tokens: SchoolToken[]): void {
    safeSet(STORAGE_KEYS.TOKENS, tokens);
  },

  getUsers(): UserAccount[] {
    const defaultUserAccounts: UserAccount[] = Object.values(MOCK_USERS);
    return safeGet<UserAccount[]>(STORAGE_KEYS.USERS, defaultUserAccounts);
  },
  saveUsers(users: UserAccount[]): void {
    safeSet(STORAGE_KEYS.USERS, users);
  },

  getAuditLogs(): AuditLog[] {
    return safeGet<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  saveAuditLogs(logs: AuditLog[]): void {
    safeSet(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  getInterventions(): ProtectionIntervention[] {
    return safeGet<ProtectionIntervention[]>(
      STORAGE_KEYS.INTERVENTIONS,
      MOCK_PROTECTION_INTERVENTIONS,
    );
  },
  saveInterventions(interventions: ProtectionIntervention[]): void {
    safeSet(STORAGE_KEYS.INTERVENTIONS, interventions);
  },

  // Export full database to JSON file
  exportBackup(
    profile: SchoolProfile,
    tickets: ReportTicket[],
    tokens: SchoolToken[],
    users: UserAccount[],
    auditLogs: AuditLog[],
    interventions: ProtectionIntervention[],
  ): void {
    const payload: DatabaseBackupPayload = {
      version: "TAMENG-v2.5-PROD",
      exportedAt: new Date().toISOString(),
      schoolProfile: profile,
      tickets,
      tokens,
      users,
      auditLogs,
      interventions,
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(payload, null, 2));
    const cleanSchoolName = profile.schoolName.replace(/[^a-zA-Z0-9]/g, "_");
    const dateStr = new Date().toISOString().split("T")[0];
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `BACKUP_DATABASE_${cleanSchoolName}_${dateStr}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // Parse imported JSON
  parseBackupFile(jsonString: string): DatabaseBackupPayload {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.schoolProfile) {
      throw new Error(
        "Format file cadangan tidak valid (Metadata profil sekolah hilang).",
      );
    }
    return {
      version: parsed.version || "TAMENG-v2.5-PROD",
      exportedAt: parsed.exportedAt || new Date().toISOString(),
      schoolProfile: { ...DEFAULT_SCHOOL_PROFILE, ...parsed.schoolProfile },
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
      tokens: Array.isArray(parsed.tokens) ? parsed.tokens : [],
      users: Array.isArray(parsed.users)
        ? parsed.users
        : Object.values(MOCK_USERS),
      auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
      interventions: Array.isArray(parsed.interventions)
        ? parsed.interventions
        : [],
    };
  },

  // Factory reset to clean slate (zero reports, pristine state for school donation)
  createFreshSchoolDatabase(customProfile: SchoolProfile): {
    profile: SchoolProfile;
    tickets: ReportTicket[];
    tokens: SchoolToken[];
    users: UserAccount[];
    auditLogs: AuditLog[];
    interventions: ProtectionIntervention[];
  } {
    const cleanDate = new Date().toISOString().split("T")[0];

    // Generate initial clean starter tokens for classes X, XI, XII
    const freshTokens: SchoolToken[] = [];
    const classes = ["X-1", "X-2", "XI-1", "XI-2", "XII-1", "XII-2"];
    classes.forEach((cls) => {
      for (let i = 1; i <= 5; i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        freshTokens.push({
          tokenCode: `SCH-${cls}-${rand}`,
          schoolName: customProfile.schoolName,
          studentLevel: `Kelas ${cls}`,
          batchId: `BATCH-AWAL-${cls}`,
          createdAt: cleanDate,
          expiresAt: "2026-12-31",
          isActivated: false,
          status: "Tersedia",
          usageCount: 0,
          notes: `Batch Perdana Siap Distribusi Kelas ${cls}`,
        });
      }
    });

    const cleanUsers: UserAccount[] = [
      {
        id: "usr-admin-01",
        name: customProfile.principalName || "Administrator Satgas",
        email: customProfile.email || "admin.satgas@sekolah.sch.id",
        role: "admin",
        roleTitle: "Administrator Satgas PPKSP & IT",
        organization: customProfile.schoolName,
        identifier: "ADM-RESMI-001",
        permissions: [
          "Manajemen Token",
          "Kelola Petugas BK",
          "Audit Log",
          "Konfigurasi Sistem",
          "Backup & Restore",
        ],
      },
      {
        id: "usr-guru-01",
        name:
          customProfile.counselorCoordinatorName || "Dra. Hj. Nurjanah, M.Pd",
        email: "guru.bk@sekolah.sch.id",
        role: "guru",
        roleTitle: "Koordinator Guru BK & Konselor Satgas",
        organization: customProfile.schoolName,
        identifier: `NIP: ${customProfile.counselorCoordinatorNip || "19780412 200501 2 003"}`,
        permissions: [
          "Triage Laporan",
          "Chat Siswa",
          "Catatan Rahasia",
          "Eskalasi Kasus",
          "Cetak BAP Resmi",
        ],
      },
    ];

    const cleanAuditLogs: AuditLog[] = [
      {
        id: `LOG-${Date.now()}`,
        timestamp:
          new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB",
        action: "Inisialisasi Sistem Baru (Go-Live Hibah Sekolah)",
        actorRole: "Admin Satgas",
        actorName: customProfile.principalName,
        details: `Sistem TAMENG resmi diinisialisasi untuk satuan pendidikan ${customProfile.schoolName} (NPSN: ${customProfile.npsn}).`,
        zkpProofStatus: "Tervalidasi",
      },
    ];

    return {
      profile: customProfile,
      tickets: [], // Zero reports (clean)
      tokens: freshTokens,
      users: cleanUsers,
      auditLogs: cleanAuditLogs,
      interventions: [],
    };
  },
};
