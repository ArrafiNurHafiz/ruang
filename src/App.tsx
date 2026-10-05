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
import {
  MOCK_REGIONAL_SCHOOLS,
  MOCK_COUNSELOR,
  MOCK_USERS,
  INITIAL_TOKENS,
} from "./data/mockData";
import { api, getAuthToken, setAuthToken } from "./lib/api";
import { supabase, isSupabaseEnabled } from "./lib/supabase";
import { StorageEngine } from "./utils/storage";
import { useLanguage } from "./lib/i18n";

const SCHOOL_ID = "default-school";

export default function App() {
  const { t } = useLanguage();
  // 5 User Roles State Management
  const [activeRole, setActiveRole] = useState<AppUserRole>("siswa");
  const [currentUserAccount, setCurrentUserAccount] =
    useState<UserAccount | null>(null);

  // Student Access Token & Anti-Infiltrator Session
  const [tokensList, setTokensList] = useState<SchoolToken[]>(() =>
    StorageEngine.getTokens(),
  );
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
  const [tickets, setTickets] = useState<ReportTicket[]>(() => {
    return StorageEngine.getTickets();
  });
  const [activatedTokens, setActivatedTokens] = useState<SchoolToken[]>([]);
  const [loggedCounselor, setLoggedCounselor] = useState<CounselorUser | null>(
    null,
  );
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    return StorageEngine.getAuditLogs();
  });
  const [regionalSchools, setRegionalSchools] = useState<SchoolRegionalData[]>(
    [],
  );
  const [interventions, setInterventions] = useState<ProtectionIntervention[]>(
    () => {
      return StorageEngine.getInterventions();
    },
  );
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    return StorageEngine.getSchoolProfile();
  });

  // Load data on mount (Only public data for unauthenticated guests)
  useEffect(() => {
    const loadPublicData = async () => {
      setIsLoadingData(true);
      try {
        const [schoolsRes, profileRes] = await Promise.allSettled([
          api.getRegionalSchools(),
          api.getSchoolProfile(),
        ]);

        if (schoolsRes.status === "fulfilled" && schoolsRes.value) {
          setRegionalSchools(schoolsRes.value);
        }

        if (profileRes.status === "fulfilled" && profileRes.value && profileRes.value.schoolName) {
          setSchoolProfile(profileRes.value);
          StorageEngine.saveSchoolProfile(profileRes.value);
        }

        // Only load protected staff data if an auth token is present
        const token = getAuthToken();
        if (token) {
          const staffResults = await Promise.allSettled([
            api.getAllTickets(),
            api.getTokensBySchool(SCHOOL_ID),
            api.getUsers(),
            api.getAuditLogs(),
            api.getInterventions(),
          ]);

          const get = <T,>(r: PromiseSettledResult<T>, fallback: T): T =>
            r.status === "fulfilled" ? r.value : fallback;

          const fetchedTickets = get<ReportTicket[]>(staffResults[0], []);
          if (fetchedTickets && fetchedTickets.length > 0) {
            setTickets(fetchedTickets);
            StorageEngine.saveTickets(fetchedTickets);
          }

          const fetchedTokens = get<SchoolToken[]>(staffResults[1], []);
          if (fetchedTokens && fetchedTokens.length > 0) {
            setTokensList(fetchedTokens);
            StorageEngine.saveTokens(fetchedTokens);
          }

          const usersData = get<UserAccount[]>(staffResults[2], []);
          if (usersData && usersData.length > 0) {
            setUsersList(usersData);
          }

          const fetchedLogs = get<AuditLog[]>(staffResults[3], []);
          if (fetchedLogs && fetchedLogs.length > 0) {
            setAuditLogs(fetchedLogs);
            StorageEngine.saveAuditLogs(fetchedLogs);
          }

          const fetchedInterventions = get<ProtectionIntervention[]>(staffResults[4], []);
          if (fetchedInterventions && fetchedInterventions.length > 0) {
            setInterventions(fetchedInterventions);
            StorageEngine.saveInterventions(fetchedInterventions);
          }
        }
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadPublicData();
  }, []);

  // Real-time subscription for ticket_messages (only if Supabase is explicitly configured)
  useEffect(() => {
    if (!supabase || !isSupabaseEnabled) return;
    try {
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
            setTickets((prev) => {
              const next = prev.map((t) => {
                if (t.id === m.ticket_id) {
                  const exists = (t.messages ?? []).some((msg) => msg.id === m.id);
                  if (exists) return t;
                  return {
                    ...t,
                    messages: [...(t.messages ?? []), formattedMsg],
                  };
                }
                return t;
              });
              StorageEngine.saveTickets(next);
              return next;
            });
          },
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "tickets" },
          (payload) => {
            const updated = payload.new as any;
            setTickets((prev) => {
              const next = prev.map((t) => {
                if (t.id === updated.id) {
                  return {
                    ...t,
                    status: updated.status,
                    updatedAt: updated.updated_at,
                  };
                }
                return t;
              });
              StorageEngine.saveTickets(next);
              return next;
            });
          },
        )
        .subscribe();

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch {}
      };
    } catch (e) {
      console.warn("Supabase realtime subscription skipped:", e);
    }
  }, []);

  // Multi-Entity Background Synchronization Engine (Role-Aware)
  const syncAllData = async () => {
    try {
      const hasAuth = Boolean(getAuthToken());

      // Public endpoints always synced
      const publicPromises: Promise<any>[] = [
        api.getRegionalSchools(),
        api.getSchoolProfile(),
      ];

      // Staff endpoints only synced if authenticated
      if (hasAuth && (activeRole === "guru" || activeRole === "admin")) {
        publicPromises.push(api.getAllTickets());
        publicPromises.push(api.getAuditLogs());
        publicPromises.push(api.getTokensBySchool(SCHOOL_ID));
      }
      if (hasAuth && activeRole === "dinas-perlindungan") {
        publicPromises.push(api.getInterventions());
      }

      const results = await Promise.allSettled(publicPromises);

      const get = <T,>(r: PromiseSettledResult<T>, fallback: T): T =>
        r && r.status === "fulfilled" ? r.value : fallback;

      const freshSchools = get<SchoolRegionalData[] | null>(results[0], null);
      if (freshSchools && Array.isArray(freshSchools) && freshSchools.length > 0) {
        setRegionalSchools(freshSchools);
      }

      const freshProfile = get<SchoolProfile | null>(results[1], null);
      if (freshProfile && freshProfile.schoolName) {
        setSchoolProfile((prev) => {
          if (prev.updatedAt !== freshProfile.updatedAt) {
            StorageEngine.saveSchoolProfile(freshProfile);
            return freshProfile;
          }
          return prev;
        });
      }

      if (hasAuth && results.length > 2) {
        const freshTickets = get<ReportTicket[] | null>(results[2], null);
        if (freshTickets && Array.isArray(freshTickets)) {
          setTickets((prev) => {
            const prevMap = new Map<string, ReportTicket>(prev.map((t) => [t.id, t]));
            let hasDiff = freshTickets.length !== prev.length;
            const merged = freshTickets.map((ft) => {
              const existing = prevMap.get(ft.id);
              if (!existing) {
                hasDiff = true;
                return ft;
              }
              if (
                existing.status !== ft.status ||
                existing.updatedAt !== ft.updatedAt ||
                (existing.messages?.length || 0) !== (ft.messages?.length || 0) ||
                existing.isEscalatedToDinas !== ft.isEscalatedToDinas ||
                Boolean(existing.resolutionEvidence) !== Boolean(ft.resolutionEvidence)
              ) {
                hasDiff = true;
                return { ...existing, ...ft };
              }
              return existing;
            });
            if (hasDiff) {
              StorageEngine.saveTickets(merged);
              return merged;
            }
            return prev;
          });
        }

        const freshLogs = get<AuditLog[] | null>(results[3], null);
        if (freshLogs && Array.isArray(freshLogs) && freshLogs.length > 0) {
          setAuditLogs((prev) => {
            if (freshLogs.length !== prev.length) {
              StorageEngine.saveAuditLogs(freshLogs);
              return freshLogs;
            }
            return prev;
          });
        }

        if (results.length > 4) {
          const freshTokens = get<SchoolToken[] | null>(results[4], null);
          if (freshTokens && Array.isArray(freshTokens) && freshTokens.length > 0) {
            setTokensList((prev) => {
              const hasDiff =
                freshTokens.length !== prev.length ||
                (freshTokens[0] && prev[0] && (freshTokens[0].tokenCode || (freshTokens[0] as any).token_code) !== (prev[0].tokenCode || (prev[0] as any).token_code));
              if (hasDiff) {
                StorageEngine.saveTokens(freshTokens);
                return freshTokens;
              }
              return prev;
            });
          }
        }
      }
    } catch {
      // background sync fail-safe
    }
  };

  useEffect(() => {
    const interval = setInterval(syncAllData, 12000);
    const handleFocus = () => {
      syncAllData();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [activeRole]);

  // Cross-Tab & Cross-Window Instant Sync via Storage Events
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === "ruangaman_school_profile" || e.key === "tameng_school_profile") {
          const parsed = JSON.parse(e.newValue);
          setSchoolProfile(parsed);
        } else if (e.key === "ruangaman_tickets" || e.key === "tameng_tickets") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setTickets(parsed);
        } else if (e.key === "ruangaman_audit_logs" || e.key === "tameng_audit_logs") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setAuditLogs(parsed);
        } else if (e.key === "ruangaman_interventions" || e.key === "tameng_interventions") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setInterventions(parsed);
        } else if (e.key === "ruangaman_tokens" || e.key === "tameng_tokens") {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setTokensList(parsed);
        }
      } catch (err) {
        console.error("Storage event parse error:", err);
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  // ESC Shortcut Listener for Camouflage Mode toggle (< 500ms double ESC)
  const lastEscPressRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // If disguise is currently active, one ESC press exits disguise
        if (isDisguiseActive) {
          setIsDisguiseActive(false);
          return;
        }

        const now = Date.now();
        // If pressed twice within 500ms, toggle camouflage mode
        if (now - lastEscPressRef.current < 500) {
          setIsDisguiseActive(true);
          lastEscPressRef.current = 0;
        } else {
          lastEscPressRef.current = now;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDisguiseActive]);

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
    const matchedUser =
      usersList.find((u) => u.role === role) ||
      (MOCK_USERS[role] as any) ||
      null;
    setCurrentUserAccount(matchedUser);

    if (role === "siswa") {
      setCurrentTab("beranda");
      setLoggedCounselor(null);
    } else if (role === "guru") {
      setCurrentTab("admin");
      setLoggedCounselor(MOCK_COUNSELOR);
    } else if (role === "admin") {
      setCurrentTab("admin-system");
    } else if (role === "dinas-pendidikan") {
      setCurrentTab("disdik");
    } else if (role === "dinas-perlindungan") {
      setCurrentTab("dinas-pppa");
    }
  };

  useEffect(() => {
    (window as any).__switchRole = handleSelectRole;
    (window as any).__setTab = setCurrentTab;
    (window as any).__handleNavigateToChat = handleNavigateToChat;
    (window as any).__toggleDisguise = (active: boolean) => setIsDisguiseActive(active);
  }, [handleSelectRole]);

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
        secretPin: newTicket.secretPin,
      });
      const nextTickets = [created, ...tickets];
      setTickets(nextTickets);
      StorageEngine.saveTickets(nextTickets);

      setRegionalSchools((prev) =>
        prev.map((s) => (s.id === "sch-01" ? { ...s, totalReports: (s.totalReports || 0) + 1 } : s)),
      );

      // Update audit logs from backend if staff token is present
      if (getAuthToken()) {
        try {
          const logs = await api.getAuditLogs();
          setAuditLogs(logs);
          StorageEngine.saveAuditLogs(logs);
        } catch {}
      }

      return created;
    } catch (err) {
      console.error("Failed to submit report:", err);
      const nextTickets = [newTicket, ...tickets];
      setTickets(nextTickets);
      StorageEngine.saveTickets(nextTickets);
      return newTicket;
    }
  };

  const handleNavigateToChat = (ticketId: string) => {
    setActiveChatTicketId(ticketId);
    setCurrentTab("status");
  };

  const handleSendMessage = async (ticketId: string, messageText: string) => {
    const formattedMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: "pelapor" as const,
      text: messageText,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isEncrypted: true,
    };

    // 1. Optimistic update into tickets state & storage
    setTickets((prev) => {
      const exists = prev.some((t) => t.id === ticketId);
      if (exists) {
        const next = prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              messages: [...(t.messages ?? []), formattedMsg],
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        });
        StorageEngine.saveTickets(next);
        return next;
      }
      return prev;
    });

    try {
      // 2. Call API
      const newMessage = await api.sendMessage(ticketId, {
        sender: "pelapor",
        text: messageText,
        isEncrypted: true,
      });

      // 3. Reconcile with server response
      if (newMessage && newMessage.id) {
        setTickets((prev) => {
          const exists = prev.some((t) => t.id === ticketId);
          if (exists) {
            const next = prev.map((t) => {
              if (t.id === ticketId) {
                const msgs = (t.messages ?? []).map((m) =>
                  m.id === formattedMsg.id
                    ? {
                        ...m,
                        id: newMessage.id,
                        text: newMessage.text || newMessage.message_text || m.text,
                      }
                    : m,
                );
                return { ...t, messages: msgs };
              }
              return t;
            });
            StorageEngine.saveTickets(next);
            return next;
          }
          return prev;
        });
      }
      return newMessage;
    } catch (err) {
      console.error("Failed to send message to server:", err);
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

      setTickets((prev) => {
        const next = prev.map((t) => {
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
        });
        StorageEngine.saveTickets(next);
        return next;
      });
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

      setTickets((prev) => {
        const next = prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status,
              actionSummary: actionSummary || t.actionSummary,
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        });
        StorageEngine.saveTickets(next);
        return next;
      });

      if (status === "ditutup") {
        setRegionalSchools((prev) =>
          prev.map((s) => (s.id === "sch-01" ? { ...s, resolvedReports: (s.resolvedReports || 0) + 1 } : s)),
        );
      }

      // Refresh audit logs
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
      StorageEngine.saveAuditLogs(logs);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSubmitResolutionEvidence = async (
    ticketId: string,
    evidence: {
      type: string;
      description: string;
      fileUrl?: string;
      submittedBy?: string;
    },
  ) => {
    try {
      const updated = await api.submitResolutionEvidence(ticketId, evidence);
      setTickets((prev) => {
        const next = prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                ...updated,
                status: "menunggu_siswa" as const,
                resolutionEvidence: updated.resolutionEvidence || updated.resolution_evidence,
                updatedAt: new Date().toISOString(),
              }
            : t,
        );
        StorageEngine.saveTickets(next);
        return next;
      });
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
      StorageEngine.saveAuditLogs(logs);
    } catch (err) {
      console.error("Failed to submit resolution evidence:", err);
      throw err;
    }
  };

  const handleAddCounselorNote = async (ticketId: string, note: string) => {
    try {
      await api.addCounselorNote(ticketId, note);
      setTickets((prev) => {
        const next = prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              counselorNotes: [...(t.counselorNotes || []), note],
              updatedAt: new Date().toISOString(),
            };
          }
          return t;
        });
        StorageEngine.saveTickets(next);
        return next;
      });
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  const handleTokenActivated = (token: SchoolToken) => {
    setActivatedTokens((prev) => [token, ...prev]);
  };

  const handleStudentTokenVerified = (
    token: SchoolToken,
    method: "token" | "sandi" = "token",
  ) => {
    const session: StudentSession = {
      tokenCode: token.tokenCode,
      schoolName: token.schoolName || "SMA Negeri 1 Jakarta",
      studentLevel: token.studentLevel || "Kelas X",
      authenticatedAt: new Date().toISOString(),
      expiresAt: token.expiresAt,
      isVerified: true,
      verificationMethod: method,
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
    let generated: SchoolToken[] = [];
    try {
      generated = await api.generateTokens(
        count,
        prefix,
        studentLevel || "Semua Kelas",
        notes || "Dibuat oleh Guru BK / Admin Sekolah",
        SCHOOL_ID,
      );
    } catch (apiErr) {
      console.warn(
        "Backend token generation failed or offline. Generating client-side tokens:",
        apiErr,
      );
      const batchId = `BATCH-${Date.now()}`;
      for (let i = 0; i < count; i++) {
        const randHex = Math.random().toString(36).substring(2, 6).toUpperCase();
        const randNum = Math.floor(1000 + Math.random() * 9000);
        generated.push({
          tokenCode: `${prefix}-${randHex}-${randNum}`,
          schoolName: schoolProfile?.schoolName || "SMA Negeri 1 Jakarta",
          studentLevel: studentLevel || "Semua Kelas",
          batchId,
          isActivated: false,
          isUsedForReport: false,
          status: "Tersedia",
          notes: notes || "Dibuat oleh Guru BK / Admin Sekolah",
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (generated && generated.length > 0) {
      setTokensList((prev) => {
        const next = [...generated, ...prev];
        StorageEngine.saveTokens(next);
        return next;
      });

      try {
        const logs = await api.getAuditLogs();
        if (logs && logs.length > 0) {
          setAuditLogs(logs);
          StorageEngine.saveAuditLogs(logs);
        }
      } catch {}
    }

    return generated;
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
      console.error("Failed to toggle token status on server:", err);
    }
    setTokensList((prev) => {
      const next = prev.map((t) =>
        t.tokenCode === tokenCode ? { ...t, status: nextStatus } : t,
      );
      StorageEngine.saveTokens(next);
      return next;
    });
  };

  const handleDeleteToken = async (tokenCode: string) => {
    try {
      await fetch(`/api/tokens/${tokenCode}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete token on server:", err);
    }
    setTokensList((prev) => {
      const next = prev.filter(
        (t) => t.tokenCode !== tokenCode && (t as any).id !== tokenCode,
      );
      StorageEngine.saveTokens(next);
      return next;
    });
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
          schoolOrigin: schoolProfile.schoolName || "SMA Negeri 1 Jakarta",
          category: targetTicket.category,
          urgency: targetTicket.urgency,
          stage: "Asesmen Awal",
          shelterRequired: (targetTicket.urgency || "").includes("Kritis"),
          assignedPsychologist: "Dr. Maria Ulfah, M.Psi., Psikolog",
          assignedLegalAid: "LBH Advokat Ramah Anak",
          notes: [
            `Dirujuk oleh Guru BK Satgas PPKSP. Alasan: ${reason}`,
            "Jadwal asesmen awal psikologi anak dalam 24 jam.",
          ],
        };
        const created = await api.createIntervention(newIntervention);
        setInterventions((prev) => {
          const next = [created, ...prev];
          StorageEngine.saveInterventions(next);
          return next;
        });
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

      setTickets((prev) => {
        const next = prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status: "tindakan" as const,
              isEscalatedToDinas: true,
              is_escalated_to_dinas: true,
              escalatedTo: target as any,
              escalated_to: target as any,
              escalationReason: reason,
              escalation_reason: reason,
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
        });
        StorageEngine.saveTickets(next);
        return next;
      });

      // 3. Refresh audit logs
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
      StorageEngine.saveAuditLogs(logs);
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

  const handleUpdateSchoolProfile = async (profile: SchoolProfile) => {
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    setSchoolProfile(updated);
    StorageEngine.saveSchoolProfile(updated);
    try {
      await api.updateSchoolProfile(updated);
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
      StorageEngine.saveAuditLogs(logs);
    } catch (err) {
      console.error("Failed to update school profile on server:", err);
    }
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
      link.download = `ruangaman-backup-${Date.now()}.json`;
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
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
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
        activeRole={activeRole}
        onLogoutRole={() => handleSelectRole("siswa")}
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
      <main className="flex-1 bg-background">
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
            regionalSchools={regionalSchools}
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
            onTicketUpdated={(updated) => {
              setTickets((prev) => {
                const exists = prev.some((t) => t.id === updated.id);
                const next = exists
                  ? prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
                  : [updated, ...prev];
                StorageEngine.saveTickets(next);
                return next;
              });

              if (updated.status === "ditutup") {
                setRegionalSchools((prev) =>
                  prev.map((s) => (s.id === "sch-01" ? { ...s, resolvedReports: (s.resolvedReports || 0) + 1 } : s)),
                );
              }
              if (updated.isEscalatedToDinas) {
                const newIntervention: Partial<ProtectionIntervention> = {
                  ticketId: updated.id,
                  victimAlias: `Ananda (Korban #${updated.id})`,
                  schoolOrigin: schoolProfile.schoolName || "SMA Negeri 1 Jakarta",
                  category: updated.category,
                  urgency: updated.urgency,
                  stage: "Asesmen Awal",
                  shelterRequired: (updated.urgency || "").includes("Kritis"),
                  assignedPsychologist: "Dr. Maria Ulfah, M.Psi., Psikolog",
                  assignedLegalAid: "LBH Advokat Ramah Anak",
                  notes: [
                    `Eskalasi oleh Siswa Pelapor. Alasan: ${updated.escalationReason || "Penanganan belum tuntas"}`,
                    "Pemberian perlindungan & supervisi khusus UPTD PPA.",
                  ],
                };
                api.createIntervention(newIntervention).then((created) => {
                  setInterventions((prev) => {
                    const next = [created, ...prev];
                    StorageEngine.saveInterventions(next);
                    return next;
                  });
                }).catch(() => {});
              }
              api.getAuditLogs().then((logs) => {
                setAuditLogs(logs);
                StorageEngine.saveAuditLogs(logs);
              }).catch(() => {});
            }}
          />
        )}

        {/* ROLE 2: GURU BK & SATGAS PPKSP (ADMIN SEKOLAH) VIEW */}
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
            onSubmitResolutionEvidence={handleSubmitResolutionEvidence}
            schoolProfile={schoolProfile}
            onUpdateSchoolProfile={handleUpdateSchoolProfile}
            tokens={tokensList}
            onGenerateBatchTokens={handleGenerateBatchTokens}
            onToggleTokenStatus={handleToggleTokenStatus}
            onDeleteToken={handleDeleteToken}
          />
        )}

        {/* ROLE 3: ADMIN SISTEM (SYSTEM ADMINISTRATOR) VIEW */}
        {currentTab === "admin-system" && (
          <AdminDashboard
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
            regionalSchools={regionalSchools}
          />
        )}

        {/* ROLE 4: DINAS PENDIDIKAN WILAYAH VIEW */}
        {currentTab === "disdik" && (
          <DinasPendidikanDashboard
            regionalSchools={regionalSchools}
            tickets={tickets}
            onLogout={() => handleSelectRole("siswa")}
            skipLogin={activeRole === "dinas-pendidikan"}
            onSupervisionSent={async (schoolId, message, officerName) => {
              const logs = await api.getAuditLogs().catch(() => []);
              if (logs.length) {
                setAuditLogs(logs);
                StorageEngine.saveAuditLogs(logs);
              }
              setRegionalSchools((prev) =>
                prev.map((s) => (s.id === schoolId ? { ...s, lastActive: "Baru saja disupervisi" } : s)),
              );
            }}
          />
        )}

        {/* ROLE 5: DINAS PERLINDUNGAN (UPTD PPA) VIEW */}
        {currentTab === "dinas-pppa" && (
          <DinasPerlindunganDashboard
            interventions={interventions}
            tickets={tickets}
            onUpdateInterventionStage={handleUpdateInterventionStage}
            onAssignExpert={handleAssignExpert}
            onLogout={() => handleSelectRole("siswa")}
            skipLogin={activeRole === "dinas-perlindungan"}
          />
        )}

        {/* UNIFIED LOGIN PAGE */}
        {currentTab === "login" && (
          <UnifiedLoginPage
            onLogin={(role, counselor, userAccount) => {
              setActiveRole(role);
              if (counselor) setLoggedCounselor(counselor);
              if (userAccount) {
                setCurrentUserAccount(userAccount);
              } else {
                const matchedUser =
                  usersList.find((u) => u.role === role) || null;
                setCurrentUserAccount(matchedUser);
              }
              const roleTabMap: Record<string, string> = {
                guru: "admin",
                admin: "admin-system",
                "dinas-pendidikan": "disdik",
                "dinas-perlindungan": "dinas-pppa",
              };
              setCurrentTab(roleTabMap[role] || "beranda");
              // Trigger sync with newly acquired credentials
              setTimeout(() => syncAllData(), 100);
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

      {/* Floating Emergency Escape Quick Action for Student/Victim Panic Escape */}
      {activeRole === "siswa" && (
        <div className="fixed bottom-16 sm:bottom-4 right-3 sm:right-4 z-40">
          <button
            onClick={handleQuickExit}
            title={t("app.quickExitTitle")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-rose-600 text-white font-medium text-xs shadow-lg backdrop-blur-xs transition-all hover:scale-105 active:scale-95 border border-white/10 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xs:inline">{t("app.quickExit")}</span>
            <kbd className="text-[9px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded font-mono hidden sm:inline">
              ESC
            </kbd>
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-md">
        {[
          { id: "beranda", label: t("nav.home"), icon: Home },
          { id: "lapor", label: t("nav.report"), icon: Send },
          { id: "status", label: t("nav.status"), icon: Search },
          { id: "bantuan", label: t("nav.help"), icon: HelpCircle },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
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
      <footer className="site-footer mb-14 sm:mb-0 border-t border-border bg-card">
        <div
          onClick={() => setCurrentTab("beranda")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <span className="brand-mark">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </span>
          <span className="leading-tight text-left">
            <strong className="block text-[16px] text-ink font-bold">
              {t("brand.name")}
            </strong>
            <small className="text-[11px] text-muted-foreground">
              {t("footer.subtitle")}
            </small>
          </span>
        </div>

        <nav aria-label="Footer Navigasi">
          <button
            type="button"
            onClick={() => setCurrentTab("beranda")}
            className="hover:text-primary transition cursor-pointer text-xs font-semibold"
          >
            {t("nav.home")}
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab("tentang")}
            className="hover:text-primary transition cursor-pointer text-xs font-semibold"
          >
            {t("nav.about")}
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab("cara-kerja")}
            className="hover:text-primary transition cursor-pointer text-xs font-semibold"
          >
            {t("nav.howItWorks")}
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab("bantuan")}
            className="hover:text-primary transition cursor-pointer text-xs font-semibold"
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab("kontak")}
            className="hover:text-primary transition cursor-pointer text-xs font-semibold"
          >
            {t("nav.contact")}
          </button>
        </nav>

        <p>
          {t("footer.nationalPlatform")}
          <br />
          {t("footer.regulation")}
        </p>
      </footer>

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
        onVerifyAndLogin={(token, method: "token" | "sandi" = "token") => {
          handleStudentTokenVerified(token, method);
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
