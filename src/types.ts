export type ReportCategory =
  | "Perundungan / Bullying"
  | "Pelecehan Seksual"
  | "Kekerasan Fisik"
  | "Pemerasan / Pungli"
  | "Cyberbullying / Teror Online"
  | "Kesehatan Mental / Krisis Diri"
  | "Lainnya";

export type ReportUrgency =
  "Rendah" | "Sedang" | "Tinggi" | "Kritis (Darurat Segera)";

export type ReportStatus = "diterima" | "ditinjau" | "tindakan" | "ditutup";

export type ReporterRole =
  "Siswa (Korban)" | "Siswa (Saksi Mata)" | "Teman / Kerabat" | "Anonim Penuh";

export interface AttachmentItem {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  isAudio?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "pelapor" | "counselor" | "system";
  senderTitle?: string;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
  attachment?: AttachmentItem;
}

export interface ReportTicket {
  id: string; // e.g. TMG-2025-78A1
  category: ReportCategory;
  reporterRole: ReporterRole;
  location: string;
  incidentDate: string;
  urgency: ReportUrgency;
  story: string;
  redactedStory: string;
  detectedPII: string[];
  attachments: AttachmentItem[];
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  hashZKP: string; // Zero-knowledge proof hash
  recoveryCode: string;
  messages: ChatMessage[];
  counselorNotes?: string[];
  assignedCounselor?: string;
  actionSummary?: string;
  isKioskSubmission?: boolean;
  schoolName?: string;
  verifiedSchoolToken?: string;
  studentBatch?: string;
  isEscalatedToDinas?: boolean;
  escalatedTo?:
    "Dinas Pendidikan" | "Dinas Perlindungan (UPTD PPA)" | "Keduanya";
  escalationReason?: string;
  protectionStage?:
    | "Asesmen Awal"
    | "Perlindungan & Safehouse"
    | "Pemulihan Psikologis"
    | "Pendampingan Hukum"
    | "Selesai";
  assignedExpert?: string;
}

export type AppUserRole =
  "siswa" | "guru" | "admin" | "dinas-pendidikan" | "dinas-perlindungan";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;
  roleTitle: string;
  organization: string;
  identifier: string; // NIP, NIK, or Admin ID
  avatar?: string;
  permissions?: string[];
}

export interface SchoolToken {
  tokenCode: string;
  schoolName: string;
  studentLevel: string;
  batchId?: string;
  isActivated: boolean;
  isUsedForReport?: boolean;
  pinHash?: string;
  recoveryKey?: string;
  createdAt?: string;
  expiresAt?: string;
  activatedAt?: string;
  lastUsedAt?: string;
  usageCount?: number;
  maxUsage?: number;
  status?: "Tersedia" | "Aktif" | "Digunakan" | "Kedaluwarsa";
  notes?: string;
}

export interface StudentSession {
  tokenCode: string;
  schoolName: string;
  studentLevel: string;
  batchId?: string;
  authenticatedAt: string;
  expiresAt?: string;
  isVerified?: boolean;
}

export interface CounselorUser {
  id: string;
  name: string;
  email: string;
  role: "Guru Bimbingan Konseling (BK)" | "Satgas PPKSP" | "Kepala Sekolah";
  nip: string;
  avatar: string;
  schoolName?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorRole: string;
  actorName: string;
  details: string;
  zkpProofStatus: "Tervalidasi" | "Anonymized" | "Scrubbed";
}

export interface SchoolRegionalData {
  id: string;
  schoolName: string;
  district: string;
  level: "SMP" | "SMA" | "SMK";
  activeSatgasCount: number;
  totalReports: number;
  resolvedReports: number;
  avgResponseHours: number;
  complianceStatus:
    "Patuh (A)" | "Cukup (B)" | "Perlu Perhatian (C)" | "Kritis (D)";
  principalName: string;
  lastActive: string;
}

export interface ProtectionIntervention {
  id: string;
  ticketId: string;
  victimAlias: string;
  schoolOrigin: string;
  category: string;
  urgency: string;
  assignedPsychologist?: string;
  assignedLegalAid?: string;
  stage:
    | "Asesmen Awal"
    | "Perlindungan & Safehouse"
    | "Pemulihan Psikologis"
    | "Pendampingan Hukum"
    | "Selesai";
  shelterRequired: boolean;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category:
    | "Regulasi & PPKSP"
    | "Edukasi Anti-Bullying"
    | "Kesehatan Mental"
    | "Keamanan Digital"
    | "Info Sekolah";
  publishedAt: string;
  author: string;
  authorRole: string;
  readTime: string;
  imageUrl?: string;
  illustrationType?: "ppksp" | "cyber" | "upstander" | "mental" | "zkp";
  excerpt: string;
  content: string[];
  tags: string[];
  isFeatured?: boolean;
}

export interface HelpArticle {
  id: string;
  title: string;
  category:
    | "Cara Melapor"
    | "Privasi & Keamanan"
    | "Tracking Tiket"
    | "Akun & Token"
    | "Kebijakan Sekolah";
  readTime: string;
  excerpt: string;
  content: string[];
  iconName: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  timestamp: string;
  status: "Baru" | "Dibaca" | "Dibalas";
}

export interface SchoolProfile {
  schoolName: string;
  npsn: string;
  district: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  principalNip: string;
  satgasLeaderName: string;
  satgasLeaderNip: string;
  counselorCoordinatorName: string;
  counselorCoordinatorNip: string;
  hotlineNumber: string;
  emergencyPin: string;
  satgasSkNumber: string;
  satgasSkDate: string;
  updatedAt: string;
}

export interface DatabaseBackupPayload {
  version: string;
  exportedAt: string;
  schoolProfile: SchoolProfile;
  tickets: ReportTicket[];
  tokens: SchoolToken[];
  users: UserAccount[];
  auditLogs: AuditLog[];
  interventions: ProtectionIntervention[];
}
