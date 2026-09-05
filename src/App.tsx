import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Send,
  KeyRound,
  Monitor,
  Search,
  HelpCircle,
  BookOpen,
  PhoneCall,
  LogOut,
  EyeOff,
  AlertTriangle,
  Lock,
  HeartHandshake,
  Home,
  Users,
  Building2,
  UserCheck,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { EmergencyBanner } from "./components/EmergencyBanner";
import { EmergencyModal } from "./components/EmergencyModal";
import { DisguiseOverlay } from "./components/DisguiseOverlay";
import { KioskSessionBar } from "./components/KioskSessionBar";
import { AnonymousReportForm } from "./components/AnonymousReportForm";
import { TokenActivation } from "./components/TokenActivation";
import { KioskMode } from "./components/KioskMode";
import { TicketStatusAndChat } from "./components/TicketStatusAndChat";
import { AdminCounselorDashboard } from "./components/AdminCounselorDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { DinasPendidikanDashboard } from "./components/DinasPendidikanDashboard";
import { DinasPerlindunganDashboard } from "./components/DinasPerlindunganDashboard";
import { RoleSwitcherModal } from "./components/RoleSwitcherModal";
import { DesktopLandingHero } from "./components/DesktopLandingHero";
import { AboutSection } from "./components/AboutSection";
import { HelpCenter } from "./components/HelpCenter";
import { NewsSection } from "./components/NewsSection";
import { ContactPage } from "./components/ContactPage";
import { TransparencyPage } from "./components/TransparencyPage";
import { StudentAccessGateModal } from "./components/StudentAccessGateModal";
import { UnifiedLoginPage } from "./components/UnifiedLoginPage";

import {
  ReportTicket,
  SchoolToken,
  CounselorUser,
  ReportStatus,
  AppUserRole,
  UserAccount,
  AuditLog,
  SchoolRegionalData,
  ProtectionIntervention,
  StudentSession,
  SchoolProfile,
} from "./types";

const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  schoolName: "SMA Negeri 1 Jakarta",
  npsn: "20100123",
  district: "Jakarta Pusat",
  province: "DKI Jakarta",
  address: "Jl. Menteng Raya No. 1, Jakarta Pusat",
  phone: "(021) 3900001",
  email: "info@sman1jakarta.sch.id",
  website: "https://sman1jakarta.sch.id",
  principalName: "Dr. H. Surya Wijaya, M.Pd",
  principalNip: "196801011992031005",
  satgasLeaderName: "Dra. Hj. Aminah Sucipto, M.M",
  satgasLeaderNip: "197205151997032001",
  counselorCoordinatorName: "Sri Wahyuni, S.Pd., M.Pd",
  counselorCoordinatorNip: "198003102005012003",
  hotlineNumber: "119",
  emergencyPin: "081234567890",
  satgasSkNumber: "421.3/1234/SK/2024",
  satgasSkDate: "2024-08-17",
  updatedAt: new Date().toISOString(),
};
import { MOCK_REGIONAL_SCHOOLS, MOCK_COUNSELOR } from "./data/mockData";
import { api } from "./lib/api";
import { supabase, isSupabaseEnabled } from "./lib/supabase";

const SCHOOL_ID = "default-school";

export default function App() {
  // 5 User Roles State Management
  const [activeRole, setActiveRole] = useState<AppUserRole>("siswa");
  const [currentUserAccount, setCurrentUserAccount] =
    useState<UserAccount | null>(null);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState<boolean>(false);

  // Student Access Token & Anti-Infiltrator Session
  const [tokensList, setTokensList] = useState<SchoolToken[]>([]);
  const [studentSession, setStudentSession] = useState<StudentSession | null>(
    null,
  );
  const [isStudentGateModalOpen, setIsStudentGateModalOpen] =
    useState<boolean>(false);

  // Loading state for data
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Navigation
  const [currentTab, setCurrentTab] = useState<string>("beranda");
  const [activeChatTicketId, setActiveChatTicketId] = useState<string>("");

  // Modals & Overlays
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] =
    useState<boolean>(false);
  const [isDisguiseActive, setIsDisguiseActive] = useState<boolean>(false);

  // Kiosk Mode State
  const [isKioskActive, setIsKioskActive] = useState<boolean>(false);
  const [kioskSecondsLeft, setKioskSecondsLeft] = useState<number>(180);
  const kioskTimerRef = useRef<any>(null);

  // Data Stores
  const [tickets, setTickets] = useState<ReportTicket[]>([]);
  const [activatedTokens, setActivatedTokens] = useState<SchoolToken[]>([]);
  const [loggedCounselor, setLoggedCounselor] = useState<CounselorUser | null>(
    null,
  );
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [regionalSchools, setRegionalSchools] = useState<SchoolRegionalData[]>(
    [],
  );
  const [interventions, setInterventions] = useState<ProtectionIntervention[]>(
    [],
  );
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(
    DEFAULT_SCHOOL_PROFILE,
  );

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const results = await Promise.allSettled([
          api.getAllTickets(),
          api.getTokensBySchool(SCHOOL_ID),
          api.getUsers(),
          api.getAuditLogs(),
          api.getRegionalSchools(),
          api.getInterventions(),
        ]);

        const get = <T,>(r: PromiseSettledResult<T>, fallback: T): T =>
          r.status === "fulfilled" ? r.value : fallback;

        setTickets(get(results[0], []));
        setTokensList(get(results[1], []));
        setUsersList(get(results[2], []));
        setAuditLogs(get(results[3], []));
        setRegionalSchools(get(results[4], []));
        setInterventions(get(results[5], []));

        const usersData = get(results[2], []);
        if (!currentUserAccount && usersData.length > 0) {
          setCurrentUserAccount(usersData[0]);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Real-time subscription for ticket_messages
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("ticket-messages-rt")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ticket_messages" },
        (payload) => {
          const m = payload.new as any;
          const formattedMsg = {
            id: m.id,
            sender: m.sender_type,
            senderTitle: m.sender_title,
            text: m.message_text,
            timestamp: new Date(m.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isEncrypted: m.is_encrypted ?? true,
          };
          setTickets((prev) =>
            prev.map((t) => {
              if (t.id === m.ticket_id) {
                const exists = (t.messages ?? []).some(
                  (msg) => msg.id === m.id,
                );
                if (exists) return t;
                return {
                  ...t,
                  messages: [...(t.messages ?? []), formattedMsg],
                };
              }
              return t;
            }),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tickets" },
        (payload) => {
          const updated = payload.new as any;
          setTickets((prev) =>
            prev.map((t) => {
              if (t.id === updated.id) {
                return {
                  ...t,
                  status: updated.status,
                  updatedAt: updated.updated_at,
                };
              }
              return t;
            }),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Polling fallback: refresh tickets every 8 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fresh = await api.getAllTickets();
        setTickets((prev) => {
          const prevIds = new Set(prev.map((t) => t.id));
          const newOnes = fresh.filter((t) => !prevIds.has(t.id));
          return [
            ...newOnes,
            ...prev.map((t) => {
              const updated = fresh.find((f) => f.id === t.id);
              return updated || t;
            }),
          ];
        });
      } catch {}
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // ESC Shortcut Listener for Quick Exit / Disguise toggle
  const lastEscPressRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const now = Date.now();
        // If pressed twice within 600ms, trigger quick exit
        if (now - lastEscPressRef.current < 600) {
          handleQuickExit();
        } else {
          lastEscPressRef.current = now;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Kiosk Inactivity Watchdog (3 minutes = 180s)
  useEffect(() => {
    if (isKioskActive) {
      kioskTimerRef.current = setInterval(() => {
        setKioskSecondsLeft((prev) => {
          if (prev <= 1) {
            handleEndKioskSession();
            return 180;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (kioskTimerRef.current) clearInterval(kioskTimerRef.current);
      setKioskSecondsLeft(180);
    }

    return () => {
      if (kioskTimerRef.current) clearInterval(kioskTimerRef.current);
    };
  }, [isKioskActive]);

  // Reset Kiosk Timer on user interaction
  const resetKioskTimer = () => {
    setKioskSecondsLeft(180);
  };

  const handleStartKioskSession = (sessionCode: string) => {
    setIsKioskActive(true);
    setKioskSecondsLeft(180);
    setCurrentTab("lapor");
  };

  const handleEndKioskSession = () => {
    setIsKioskActive(false);
    setKioskSecondsLeft(180);
    if (kioskTimerRef.current) clearInterval(kioskTimerRef.current);
    setCurrentTab("kios");
  };

  // Quick Exit Implementation (Instant wipe & redirect to Google)
  const handleQuickExit = () => {
    setIsKioskActive(false);
    setIsEmergencyModalOpen(false);
    setIsDisguiseActive(false);

    try {
      sessionStorage.clear();
      window.location.replace("https://www.google.com/search?q=cuaca+hari+ini");
    } catch (e) {
      window.location.href = "https://www.google.com";
    }
  };

  // Switch Role Handler
  const handleSelectRole = (role: AppUserRole) => {
    setActiveRole(role);
    const matchedUser = usersList.find((u) => u.role === role) || null;
    setCurrentUserAccount(matchedUser);

    if (role === "siswa") {
      setCurrentTab("beranda");
    } else if (role === "guru") {
      setCurrentTab("admin");
      if (!loggedCounselor) setLoggedCounselor(MOCK_COUNSELOR);
    } else if (role === "admin") {
      setCurrentTab("admin-system");
    } else if (role === "dinas-pendidikan") {
      setCurrentTab("disdik");
    } else if (role === "dinas-perlindungan") {
      setCurrentTab("dinas-pppa");
    }
  };

  // Handlers for Ticket Actions
  const handleReportSubmitted = async (newTicket: ReportTicket) => {
    try {
      const created = await api.createTicket({
        category: newTicket.category,
        reporterRole: newTicket.reporterRole,
        location: newTicket.location,
        incidentDate: newTicket.incidentDate,
        urgency: newTicket.urgency,
        story: newTicket.story,
        redactedStory: newTicket.redactedStory,
        detectedPII: newTicket.detectedPII,
        schoolId: SCHOOL_ID,
        isKiosk: newTicket.isKioskSubmission,
      });
      setTickets((prev) => [created, ...prev]);

      // Update audit logs from backend
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);

      return created;
    } catch (err) {
      console.error("Failed to submit report:", err);
      // Fallback to local state if server fails (not ideal for "Production Ready" but good for resilience)
      setTickets((prev) => [newTicket, ...prev]);
    }
  };

  const handleNavigateToChat = (ticketId: string) => {
    setActiveChatTicketId(ticketId);
    setCurrentTab("status");
  };

  const handleSendMessage = async (ticketId: string, messageText: string) => {
    try {
      const newMessage = await api.sendMessage(ticketId, {
        sender: "pelapor",
        text: messageText,
        isEncrypted: true,
      });

      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            const formattedMsg = {
              id: newMessage.id,
              sender: "pelapor" as const,
              text: newMessage.message_text,
              timestamp: new Date(newMessage.created_at).toLocaleTimeString(
                "id-ID",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              ),
              isEncrypted: true,
            };
            return {
              ...t,
              messages: [...(t.messages ?? []), formattedMsg],
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        }),
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleCounselorReply = async (ticketId: string, text: string) => {
    try {
      const newMessage = await api.sendMessage(ticketId, {
        sender: "counselor",
        senderTitle: loggedCounselor?.name || "Guru BK",
        text,
        isEncrypted: true,
      });

      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            const formattedMsg = {
              id: newMessage.id,
              sender: "counselor" as const,
              senderTitle: newMessage.sender_title,
              text: newMessage.message_text,
              timestamp: new Date(newMessage.created_at).toLocaleTimeString(
                "id-ID",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              ),
              isEncrypted: true,
            };
            return {
              ...t,
              messages: [...(t.messages ?? []), formattedMsg],
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        }),
      );
    } catch (err) {
      console.error("Failed to send counselor reply:", err);
    }
  };

  const handleUpdateTicketStatus = async (
    ticketId: string,
    status: ReportStatus,
    actionSummary?: string,
  ) => {
    try {
      await api.updateTicketStatus(ticketId, status, actionSummary);

      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status,
              actionSummary: actionSummary || t.actionSummary,
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        }),
      );

      // Refresh audit logs
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleAddCounselorNote = async (ticketId: string, note: string) => {
    try {
      await api.addCounselorNote(ticketId, note);
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              counselorNotes: [...(t.counselorNotes || []), note],
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        }),
      );
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const handleTokenActivated = (token: SchoolToken) => {
    setActivatedTokens((prev) => [token, ...prev]);
  };

  const handleStudentTokenVerified = (token: SchoolToken) => {
    const session: StudentSession = {
      tokenCode: token.tokenCode,
      schoolName: token.schoolName,
      studentLevel: token.studentLevel,
      authenticatedAt: new Date().toISOString(),
      expiresAt: token.expiresAt,
    };
    setStudentSession(session);

    // Mark token as used / activated
    setTokensList((prev) =>
      prev.map((t) => {
        if (t.tokenCode === token.tokenCode) {
          return {
            ...t,
            isActivated: true,
            status: "Digunakan",
            usageCount: (t.usageCount || 0) + 1,
            lastUsedAt: new Date().toISOString(),
          };
        }
        return t;
      }),
    );
  };

  const handleGenerateBatchTokens = async (
    count: number,
    prefix: string,
    studentLevel?: string,
    notes?: string,
  ) => {
    try {
      const newTokens = await api.generateTokens(
        count,
        prefix,
        studentLevel || "Semua Kelas",
        notes || "Dibuat oleh Admin",
        SCHOOL_ID,
      );
      setTokensList((prev) => [...newTokens, ...prev]);

      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error("Failed to generate tokens:", err);
    }
  };

  const handleToggleTokenStatus = async (tokenCode: string) => {
    const token = tokensList.find((t) => t.tokenCode === tokenCode);
    if (!token) return;
    const nextStatus = token.status === "Aktif" ? "Kedaluwarsa" : "Aktif";
    try {
      await fetch(`/api/tokens/${tokenCode}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error("Failed to toggle token status:", err);
    }
    setTokensList((prev) =>
      prev.map((t) => {
        if (t.tokenCode === tokenCode) {
          return { ...t, status: nextStatus };
        }
        return t;
      }),
    );
  };

  const handleDeleteToken = async (tokenCode: string) => {
    try {
      await fetch(`/api/tokens/${tokenCode}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete token:", err);
    }
    setTokensList((prev) => prev.filter((t) => t.tokenCode !== tokenCode));
  };

  // Escalation Handler from Counselor to Dinas / UPTD PPA
  const handleEscalateTicket = async (
    ticketId: string,
    target: string,
    reason: string,
  ) => {
    const targetTicket = tickets.find((t) => t.id === ticketId);
    if (!targetTicket || !target || !reason) return;

    try {
      // 1. Create intervention if needed
      if (
        typeof target === "string" &&
        (target.includes("Perlindungan") || target === "Keduanya")
      ) {
        const newIntervention: Partial<ProtectionIntervention> = {
          ticketId: targetTicket.id,
          victimAlias: `Ananda (Korban #${targetTicket.id})`,
          schoolOrigin: "SMA Negeri 1 Jakarta",
          category: targetTicket.category,
          urgency: targetTicket.urgency,
          stage: "Asesmen Awal",
          shelterRequired: targetTicket.urgency.includes("Kritis"),
          assignedPsychologist: "Dr. Maria Ulfah, M.Psi., Psikolog",
          assignedLegalAid: "LBH Advokat Ramah Anak",
          notes: [
            `Dirujuk oleh Guru BK Satgas PPKSP. Alasan: ${reason}`,
            "Jadwal asesmen awal psikologi anak dalam 24 jam.",
          ],
        };
        const created = await api.createIntervention(newIntervention);
        setInterventions((prev) => [created, ...prev]);
      }

      // 2. Add system reply in the ticket
      const timestamp = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const systemMsgText = `[PROTOKOL PERLINDUNGAN]: Kasus ini telah resmi dieskalasi ke ${target}. Tim ahli dan pendamping telah ditugaskan untuk menjamin keselamatan Anda.`;

      const newMessage = await api.sendMessage(ticketId, {
        sender: "system",
        text: systemMsgText,
        isEncrypted: true,
      });

      await api.updateTicketStatus(ticketId, "tindakan");

      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status: "tindakan",
              messages: [
                ...(t.messages ?? []),
                {
                  id: newMessage.id,
                  sender: "system" as const,
                  text: systemMsgText,
                  timestamp,
                  isEncrypted: true,
                },
              ],
            };
          }
          return t;
        }),
      );

      // 3. Refresh audit logs
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error("Failed to escalate ticket:", err);
    }
  };

  // Intervention handlers for Dinas Perlindungan
  const handleUpdateInterventionStage = async (
    id: string,
    stage: ProtectionIntervention["stage"],
    note?: string,
  ) => {
    try {
      const existing = interventions.find((i) => i.id === id);
      if (!existing) return;

      const updatedNotes = note ? [...existing.notes, note] : existing.notes;
      const updated = await api.updateIntervention(id, {
        stage,
        notes: updatedNotes,
      });

      setInterventions((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return updated;
          }
          return item;
        }),
      );
    } catch (err) {
      console.error("Failed to update intervention:", err);
    }
  };

  const handleAssignExpert = async (
    id: string,
    psychologist?: string,
    legalAid?: string,
  ) => {
    try {
      const updated = await api.updateIntervention(id, {
        assignedPsychologist: psychologist,
        assignedLegalAid: legalAid,
      });

      setInterventions((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return updated;
          }
          return item;
        }),
      );
    } catch (err) {
      console.error("Failed to assign expert:", err);
    }
  };

  // Admin user management handlers
  const handleCreateUser = async (newUser: Partial<UserAccount>) => {
    try {
      const created = await api.createUser(newUser);
      setUsersList((prev) => [created, ...prev]);
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    const user = usersList.find((u) => u.id === userId);
    if (!user) return;
    const nextStatus = user.status === "Aktif" ? "Non-Aktif" : "Aktif";
    try {
      await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    }
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, status: nextStatus };
        }
        return u;
      }),
    );
  };

  const handleFactoryReset = async () => {
    try {
      await api.factoryReset();
      window.location.reload();
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  };

  const handleUpdateSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfile({ ...profile, updatedAt: new Date().toISOString() });
  };

  const handleExportBackup = () => {
    try {
      const payload = {
        schoolProfile,
        tickets,
        tokensList,
        activatedTokens,
        usersList,
        auditLogs,
        regionalSchools,
        interventions,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tameng-backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export backup:", err);
    }
  };

  const handleImportBackup = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.schoolProfile) setSchoolProfile(parsed.schoolProfile);
      if (Array.isArray(parsed.tickets)) setTickets(parsed.tickets);
      if (Array.isArray(parsed.tokensList)) setTokensList(parsed.tokensList);
      if (Array.isArray(parsed.usersList)) setUsersList(parsed.usersList);
      if (Array.isArray(parsed.auditLogs)) setAuditLogs(parsed.auditLogs);
      if (Array.isArray(parsed.regionalSchools))
        setRegionalSchools(parsed.regionalSchools);
      if (Array.isArray(parsed.interventions))
        setInterventions(parsed.interventions);
    } catch (err) {
      console.error("Failed to import backup:", err);
    }
  };

  const handleFactoryResetWithProfile = async (_profile: SchoolProfile) => {
    await handleFactoryReset();
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Emergency Hotline Banner */}
      <EmergencyBanner onOpenModal={() => setIsEmergencyModalOpen(true)} />

      {/* Main App Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onQuickExit={handleQuickExit}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onToggleDisguise={() => setIsDisguiseActive(true)}
        isKioskActive={isKioskActive}
        loggedCounselor={loggedCounselor}
        onCounselorLogout={() => setLoggedCounselor(null)}
        studentSession={studentSession}
        onOpenStudentGate={() => setIsStudentGateModalOpen(true)}
      />

      {/* Kiosk Mode 3-minute Countdown & Action Bar */}
      {isKioskActive && (
        <KioskSessionBar
          secondsLeft={kioskSecondsLeft}
          onResetTimer={resetKioskTimer}
          onEndKioskSession={handleEndKioskSession}
        />
      )}

      {/* Main Content Areas for All 5 Roles */}
      <main className="flex-1 bg-gradient-to-b from-white via-slate-50 to-slate-50">
        {/* ROLE 1: SISWA / PELAPOR ANONIM VIEWS */}
        {currentTab === "beranda" && (
          <DesktopLandingHero
            onNavigateToReport={() => setCurrentTab("lapor")}
            onNavigateToStatus={() => setCurrentTab("status")}
            onNavigateToHowItWorks={() => setCurrentTab("cara-kerja")}
            onNavigateToHelp={() => setCurrentTab("bantuan")}
            onNavigateToAbout={() => setCurrentTab("tentang")}
            onNavigateToContact={() => setCurrentTab("kontak")}
            onNavigateToLogin={() => setCurrentTab("admin")}
            studentSession={studentSession}
            onOpenTokenGate={() => setIsStudentGateModalOpen(true)}
          />
        )}

        {currentTab === "tentang" && (
          <AboutSection
            onNavigateToReport={() => setCurrentTab("lapor")}
            onNavigateToHowItWorks={() => setCurrentTab("cara-kerja")}
            onNavigateToHelp={() => setCurrentTab("bantuan")}
          />
        )}

        {currentTab === "cara-kerja" && (
          <TransparencyPage
            onNavigateToReport={() => setCurrentTab("lapor")}
            onNavigateToHelp={() => setCurrentTab("bantuan")}
          />
        )}

        {currentTab === "lapor" && (
          <AnonymousReportForm
            onReportSubmitted={handleReportSubmitted}
            onNavigateToChat={handleNavigateToChat}
            isKioskMode={isKioskActive}
            studentSession={studentSession}
            tokens={tokensList}
            onVerifyStudentToken={handleStudentTokenVerified}
            onOpenTokenGate={() => setIsStudentGateModalOpen(true)}
            onLogoutStudentSession={() => setStudentSession(null)}
          />
        )}

        {currentTab === "aktivasi" && (
          <TokenActivation
            onTokenActivated={(tok) => {
              handleTokenActivated(tok);
              handleStudentTokenVerified(tok);
            }}
            onNavigateToReport={() => setCurrentTab("lapor")}
          />
        )}

        {currentTab === "kios" && (
          <KioskMode
            onStartKioskSession={handleStartKioskSession}
            isKioskActive={isKioskActive}
            onEndKioskSession={handleEndKioskSession}
            onNavigateToReport={() => setCurrentTab("lapor")}
            onNavigateToStatus={() => setCurrentTab("status")}
          />
        )}

        {currentTab === "status" && (
          <TicketStatusAndChat
            tickets={tickets}
            initialTicketId={activeChatTicketId}
            onSendMessage={handleSendMessage}
          />
        )}

        {/* ROLE 2: GURU BK & SATGAS PPKSP VIEW */}
        {currentTab === "admin" && (
          <AdminCounselorDashboard
            tickets={tickets}
            loggedCounselor={loggedCounselor}
            onLogin={(user) => {
              setLoggedCounselor(user);
              setActiveRole("guru");
            }}
            onLogout={() => {
              setLoggedCounselor(null);
              handleSelectRole("siswa");
            }}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onAddCounselorNote={handleAddCounselorNote}
            onCounselorReply={handleCounselorReply}
            onEscalateTicket={handleEscalateTicket}
            onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
            schoolProfile={schoolProfile}
          />
        )}

        {/* ROLE 3: ADMIN SEKOLAH & SISTEM VIEW */}
        {currentTab === "admin-system" && (
          <AdminDashboard
            tokens={tokensList}
            onGenerateBatchTokens={handleGenerateBatchTokens}
            onToggleTokenStatus={handleToggleTokenStatus}
            onDeleteToken={handleDeleteToken}
            users={usersList}
            auditLogs={auditLogs}
            onCreateUser={handleCreateUser}
            onToggleUserStatus={handleToggleUserStatus}
            onFactoryReset={handleFactoryResetWithProfile}
            onLogout={() => handleSelectRole("siswa")}
            skipLogin={activeRole === "admin"}
            schoolProfile={schoolProfile}
            onUpdateSchoolProfile={handleUpdateSchoolProfile}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}

        {/* ROLE 4: DINAS PENDIDIKAN WILAYAH VIEW */}
        {currentTab === "disdik" && (
          <DinasPendidikanDashboard
            regionalSchools={regionalSchools}
            tickets={tickets}
            onLogout={() => handleSelectRole("siswa")}
            skipLogin={activeRole === "dinas-pendidikan"}
          />
        )}

        {/* ROLE 5: DINAS PERLINDUNGAN (UPTD PPA) VIEW */}
        {currentTab === "dinas-pppa" && (
          <DinasPerlindunganDashboard
            interventions={interventions}
            onUpdateInterventionStage={handleUpdateInterventionStage}
            onAssignExpert={handleAssignExpert}
            onLogout={() => handleSelectRole("siswa")}
            skipLogin={activeRole === "dinas-perlindungan"}
          />
        )}

        {/* UNIFIED LOGIN PAGE */}
        {currentTab === "login" && (
          <UnifiedLoginPage
            onLogin={(role, counselor) => {
              setActiveRole(role);
              if (counselor) setLoggedCounselor(counselor);
              const matchedUser =
                usersList.find((u) => u.role === role) || null;
              setCurrentUserAccount(matchedUser);
              const roleTabMap: Record<string, string> = {
                guru: "admin",
                admin: "admin-system",
                "dinas-pendidikan": "disdik",
                "dinas-perlindungan": "dinas-pppa",
              };
              setCurrentTab(roleTabMap[role] || "beranda");
            }}
          />
        )}

        {/* General Public Pages */}
        {currentTab === "berita" && (
          <NewsSection onNavigateToReport={() => setCurrentTab("lapor")} />
        )}

        {currentTab === "bantuan" && (
          <HelpCenter
            onNavigateToContact={() => setCurrentTab("kontak")}
            onNavigateToReport={() => setCurrentTab("lapor")}
          />
        )}

        {currentTab === "keterbukaan" && (
          <TransparencyPage
            onNavigateToReport={() => setCurrentTab("lapor")}
            onNavigateToHelp={() => setCurrentTab("bantuan")}
          />
        )}

        {currentTab === "kontak" && <ContactPage />}
      </main>

      {/* Floating Emergency Escape Quick Action for Mobile/Bottom */}
      <div className="fixed bottom-20 sm:bottom-5 right-4 sm:right-5 z-40 flex flex-col gap-2">
        <button
          onClick={handleQuickExit}
          title="Keluar Cepat: Bersihkan jejak seketika (ESC 2x)"
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 border border-red-500/50 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">KELUAR CEPAT</span>
          <span className="xs:hidden">KELUAR</span>
          <kbd className="text-[10px] bg-red-800 text-red-100 px-1 py-0.5 rounded font-mono hidden sm:inline">
            ESC
          </kbd>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: "beranda", label: "Beranda", icon: Home },
          { id: "lapor", label: "Lapor", icon: Send },
          { id: "status", label: "Status", icon: Search },
          { id: "bantuan", label: "Bantuan", icon: HelpCircle },
          { id: "kios", label: "Kios", icon: Monitor },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-blue-600 font-extrabold scale-105"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`}
              />
              <span className="text-[10px] tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 mb-14 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-medium text-slate-500">TAMENG</span>
            <span>— Ruang Aman Pelaporan & Konseling Siswa</span>
          </div>
          <span>
            Platform ini dihibahkan untuk satuan pendidikan Indonesia.
          </span>
        </div>
      </footer>

      {/* 5 User Roles Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        activeRole={activeRole}
        onSelectRole={handleSelectRole}
      />

      {/* Emergency Modal Pop-up */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onQuickExit={handleQuickExit}
      />

      {/* Camouflage / Disguise Overlay (Mode Samaran) */}
      <DisguiseOverlay
        isActive={isDisguiseActive}
        onExitDisguise={() => setIsDisguiseActive(false)}
      />

      {/* Student Access Gate Modal (Anti-Infiltrator Token Authentication) */}
      <StudentAccessGateModal
        isOpen={isStudentGateModalOpen}
        onClose={() => setIsStudentGateModalOpen(false)}
        tokens={tokensList}
        onVerifyAndLogin={(token) => {
          const session: StudentSession = {
            tokenCode: token.tokenCode,
            schoolName: token.schoolName || "SMA Negeri 1 Jakarta",
            studentLevel: token.studentLevel,
            authenticatedAt: new Date().toISOString(),
            expiresAt: token.expiresAt,
          };
          setStudentSession(session);
          setIsStudentGateModalOpen(false);
          setCurrentTab("lapor");
        }}
        onNavigateToReport={() => {
          setIsStudentGateModalOpen(false);
          setCurrentTab("lapor");
        }}
      />
    </div>
  );
}
