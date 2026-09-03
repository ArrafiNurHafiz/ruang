import { 
  ReportTicket, 
  SchoolToken, 
  UserAccount, 
  AuditLog, 
  ProtectionIntervention,
  SchoolRegionalData
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 5000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
};

const generateTicketNumber = () => {
  const year = new Date().getFullYear();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TMG-${year}-${suffix}`;
};

const generateRecoveryCode = () => {
  const words = ['aman', 'benteng', 'suara', 'fajar', 'tegak', 'kristal', 'lindung', 'satria', 'cahaya', 'harmoni', 'merdeka', 'pandu'];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const w3 = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${w1}-${w2}-${w3}-${num}`;
};

const generateZKPHash = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `zkp-sha256:0x${hex}`;
};

export const api = {
  async createTicket(input: {
    category: string;
    reporterRole: string;
    location: string;
    incidentDate: string;
    urgency: ReportTicket["urgency"];
    story: string;
    redactedStory: string;
    detectedPII: string[];
    schoolId?: string;
    isKiosk?: boolean;
  }): Promise<ReportTicket> {
    const ticketNumber = generateTicketNumber();
    const recoveryCode = generateRecoveryCode();
    const hashZKP = generateZKPHash();
    
    const response = await fetchWithTimeout(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        ticket_number: ticketNumber,
        recovery_code: recoveryCode,
        hash_zkp: hashZKP,
        status: 'diterima',
        school_id: input.schoolId || 'default-school',
        is_kiosk_submission: input.isKiosk || false,
      })
    });
    
    if (!response.ok) throw new Error('Failed to create ticket');
    const data = await response.json();
    return {
      ...data,
      reporterRole: data.reporter_role,
      incidentDate: data.incident_date,
      redactedStory: data.redacted_story,
      detectedPII: data.detected_pii,
      recoveryCode: data.recovery_code,
      hashZKP: data.hash_zkp,
      isKioskSubmission: data.is_kiosk_submission,
      messages: (data.ticket_messages ?? data.messages ?? []).map((m: any) => ({
        id: m.id,
        sender: m.sender_type ?? m.sender,
        senderTitle: m.sender_title ?? m.senderTitle,
        text: m.message_text ?? m.text,
        timestamp: new Date(m.created_at ?? m.timestamp).toLocaleString('id-ID'),
        isEncrypted: m.is_encrypted ?? m.isEncrypted
      }))
    };
  },

  async getTicketByRecoveryCode(recoveryCode: string): Promise<ReportTicket> {
    const response = await fetchWithTimeout(`${API_URL}/tickets/${recoveryCode}`);
    if (!response.ok) throw new Error('Ticket not found');
    const data = await response.json();
    const rawMessages = data.ticket_messages ?? data.messages ?? [];
    return {
      ...data,
      reporterRole: data.reporter_role,
      incidentDate: data.incident_date,
      redactedStory: data.redacted_story,
      detectedPII: data.detected_pii,
      recoveryCode: data.recovery_code,
      hashZKP: data.hash_zkp,
      isKioskSubmission: data.is_kiosk_submission,
      messages: rawMessages.map((m: any) => ({
        id: m.id,
        sender: m.sender_type ?? m.sender,
        senderTitle: m.sender_title ?? m.senderTitle,
        text: m.message_text ?? m.text,
        timestamp: new Date(m.created_at ?? m.timestamp).toLocaleString('id-ID'),
        isEncrypted: m.is_encrypted ?? m.isEncrypted
      }))
    };
  },

  async sendMessage(ticketId: string, message: {
    sender: "pelapor" | "counselor" | "system";
    senderTitle?: string;
    text: string;
    isEncrypted?: boolean;
  }) {
    const response = await fetchWithTimeout(`${API_URL}/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_type: message.sender,
        sender_title: message.senderTitle,
        message_text: message.text,
        is_encrypted: message.isEncrypted ?? true
      })
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  async getAllTickets(): Promise<ReportTicket[]> {
    const response = await fetchWithTimeout(`${API_URL}/tickets`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((t: any) => {
      const rawMessages = t.ticket_messages ?? t.messages ?? [];
      return {
        ...t,
        reporterRole: t.reporter_role,
        incidentDate: t.incident_date,
        redactedStory: t.redacted_story,
        detectedPII: t.detected_pii,
        recoveryCode: t.recovery_code,
        hashZKP: t.hash_zkp,
        isKioskSubmission: t.is_kiosk_submission,
        messages: rawMessages.map((m: any) => ({
          id: m.id,
          sender: m.sender_type ?? m.sender,
          senderTitle: m.sender_title ?? m.senderTitle,
          text: m.message_text ?? m.text,
          timestamp: new Date(m.created_at ?? m.timestamp).toLocaleString('id-ID'),
          isEncrypted: m.is_encrypted ?? m.isEncrypted
        }))
      };
    });
  },

  async updateTicketStatus(ticketId: string, status: string, actionSummary?: string) {
    const response = await fetchWithTimeout(`${API_URL}/tickets/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, action_summary: actionSummary })
    });
    if (!response.ok) throw new Error('Failed to update ticket');
    return response.json();
  },

  async addCounselorNote(ticketId: string, note: string) {
    const response = await fetchWithTimeout(`${API_URL}/tickets/${ticketId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
    if (!response.ok) throw new Error('Failed to add note');
    return response.json();
  },

  async getTokensBySchool(schoolId: string): Promise<SchoolToken[]> {
    const response = await fetchWithTimeout(`${API_URL}/tokens?schoolId=${schoolId}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((t: any) => ({
      ...t,
      tokenCode: t.token_code,
      schoolName: 'SMA Negeri 1 Jakarta',
      studentLevel: t.student_level,
      batchId: t.batch_id,
      isActivated: t.is_activated,
      isUsedForReport: t.is_used_for_report,
      createdAt: t.created_at
    }));
  },

  async generateTokens(count: number, prefix: string, studentLevel: string, notes: string, schoolId: string): Promise<SchoolToken[]> {
    const response = await fetchWithTimeout(`${API_URL}/tokens/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count, prefix, studentLevel, notes, schoolId })
    });
    if (!response.ok) throw new Error('Failed to generate tokens');
    const data = await response.json();
    return data.map((t: any) => ({
      ...t,
      tokenCode: t.token_code,
      schoolName: 'SMA Negeri 1 Jakarta',
      studentLevel: t.student_level,
      batchId: t.batch_id,
      isActivated: t.is_activated,
      isUsedForReport: t.is_used_for_report,
      createdAt: t.created_at
    }));
  },

  async verifyToken(tokenCode: string): Promise<SchoolToken> {
    const response = await fetchWithTimeout(`${API_URL}/tokens/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenCode })
    });
    if (!response.ok) throw new Error('Invalid token');
    const data = await response.json();
    return {
      ...data,
      tokenCode: data.token_code,
      schoolName: 'SMA Negeri 1 Jakarta',
      studentLevel: data.student_level,
      batchId: data.batch_id,
      isActivated: data.is_activated,
      isUsedForReport: data.is_used_for_report,
      createdAt: data.created_at
    };
  },

  async activateToken(tokenCode: string, pinHash: string): Promise<SchoolToken> {
    const response = await fetchWithTimeout(`${API_URL}/tokens/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenCode, pinHash })
    });
    if (!response.ok) throw new Error('Failed to activate token');
    const data = await response.json();
    return {
      ...data,
      tokenCode: data.token_code,
      schoolName: 'SMA Negeri 1 Jakarta',
      studentLevel: data.student_level,
      batchId: data.batch_id,
      isActivated: data.is_activated,
      isUsedForReport: data.is_used_for_report,
      createdAt: data.created_at
    };
  },

  async getUsers(): Promise<UserAccount[]> {
    const response = await fetchWithTimeout(`${API_URL}/users`);
    if (!response.ok) return [];
    return response.json();
  },

  async login(credentials: { email: string; password?: string; role: string }) {
    const response = await fetchWithTimeout(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },

  async createUser(user: Partial<UserAccount>): Promise<UserAccount> {
    const payload = {
      id: (user as any).id,
      name: user.name,
      email: user.email,
      role: user.role,
      role_title: (user as any).roleTitle,
      organization: user.organization,
      identifier: user.identifier,
      avatar_url: user.avatar,
      permissions: user.permissions ?? [],
      is_active: (user as any).isActive,
      status: (user as any).status
    };
    const response = await fetchWithTimeout(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      let msg = 'Failed to create user';
      try {
        const err = await response.json();
        if (err?.error) msg = err.error;
      } catch {}
      throw new Error(msg);
    }
    const data = await response.json();
    return {
      ...data,
      roleTitle: data.role_title,
      avatar: data.avatar_url,
      isActive: data.is_active
    };
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const response = await fetchWithTimeout(`${API_URL}/audit-logs`);
    if (!response.ok) return [];
    return response.json();
  },

  async getInterventions(): Promise<ProtectionIntervention[]> {
    const response = await fetchWithTimeout(`${API_URL}/interventions`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((i: any) => ({
      ...i,
      ticketId: i.ticket_id,
      victimAlias: i.victim_alias,
      schoolOrigin: i.school_origin,
      shelterRequired: i.shelter_required,
      assignedPsychologist: i.assigned_psychologist,
      assignedLegalAid: i.assigned_legal_aid
    }));
  },

  async createIntervention(intervention: Partial<ProtectionIntervention>) {
    const payload: any = {
      id: (intervention as any).id,
      ticket_id: (intervention as any).ticketId,
      victim_alias: (intervention as any).victimAlias,
      school_origin: (intervention as any).schoolOrigin,
      category: intervention.category,
      urgency: intervention.urgency,
      stage: intervention.stage,
      shelter_required: (intervention as any).shelterRequired,
      assigned_psychologist: (intervention as any).assignedPsychologist,
      assigned_legal_aid: (intervention as any).assignedLegalAid,
      notes: intervention.notes ?? [],
      status: (intervention as any).status
    };
    const response = await fetchWithTimeout(`${API_URL}/interventions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      let msg = 'Failed to create intervention';
      try { const e = await response.json(); if (e?.error) msg = e.error; } catch {}
      throw new Error(msg);
    }
    const data = await response.json();
    return {
      ...data,
      ticketId: data.ticket_id,
      victimAlias: data.victim_alias,
      schoolOrigin: data.school_origin,
      shelterRequired: data.shelter_required,
      assignedPsychologist: data.assigned_psychologist,
      assignedLegalAid: data.assigned_legal_aid
    };
  },

  async updateIntervention(id: string, data: Partial<ProtectionIntervention>) {
    const payload: any = {};
    if ((data as any).ticketId !== undefined) payload.ticket_id = (data as any).ticketId;
    if ((data as any).victimAlias !== undefined) payload.victim_alias = (data as any).victimAlias;
    if ((data as any).schoolOrigin !== undefined) payload.school_origin = (data as any).schoolOrigin;
    if (data.category !== undefined) payload.category = data.category;
    if (data.urgency !== undefined) payload.urgency = data.urgency;
    if (data.stage !== undefined) payload.stage = data.stage;
    if ((data as any).shelterRequired !== undefined) payload.shelter_required = (data as any).shelterRequired;
    if ((data as any).assignedPsychologist !== undefined) payload.assigned_psychologist = (data as any).assignedPsychologist;
    if ((data as any).assignedLegalAid !== undefined) payload.assigned_legal_aid = (data as any).assignedLegalAid;
    if (data.notes !== undefined) payload.notes = data.notes;
    if ((data as any).status !== undefined) payload.status = (data as any).status;
    const response = await fetchWithTimeout(`${API_URL}/interventions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      let msg = 'Failed to update intervention';
      try { const e = await response.json(); if (e?.error) msg = e.error; } catch {}
      throw new Error(msg);
    }
    const result = await response.json();
    return {
      ...result,
      ticketId: result.ticket_id,
      victimAlias: result.victim_alias,
      schoolOrigin: result.school_origin,
      shelterRequired: result.shelter_required,
      assignedPsychologist: result.assigned_psychologist,
      assignedLegalAid: result.assigned_legal_aid
    };
  },

  async deleteIntervention(id: string) {
    const response = await fetchWithTimeout(`${API_URL}/interventions/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete intervention');
    return response.json();
  },

  async sendSupervisionNotice(notice: any) {
    const response = await fetchWithTimeout(`${API_URL}/supervision-notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notice)
    });
    if (!response.ok) throw new Error('Failed to send notice');
    return response.json();
  },

  async getDashboardStats() {
    const response = await fetchWithTimeout(`${API_URL}/dashboard/stats`);
    if (!response.ok) return { totalTickets: 0, pendingTickets: 0, resolvedTickets: 0, avgResponseTime: 0 };
    return response.json();
  },

  async getNewsArticles(): Promise<any[]> {
    const response = await fetchWithTimeout(`${API_URL}/news`);
    if (!response.ok) return [];
    return response.json();
  },

  async getRegionalSchools(): Promise<SchoolRegionalData[]> {
    const response = await fetchWithTimeout(`${API_URL}/regional-schools`);
    if (!response.ok) return [];
    return response.json();
  },

  async getHelpArticles(): Promise<any[]> {
    const response = await fetchWithTimeout(`${API_URL}/help-articles`);
    if (!response.ok) return [];
    return response.json();
  },

  async getFAQs(): Promise<any[]> {
    const response = await fetchWithTimeout(`${API_URL}/faqs`);
    if (!response.ok) return [];
    return response.json();
  },

  async factoryReset() {
    const response = await fetchWithTimeout(`${API_URL}/factory-reset`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to reset database');
    return response.json();
  }
};
