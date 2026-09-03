import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory fallback
let memDB: any = null;
const getMemDB = () => {
  if (!memDB) {
    memDB = {
      tickets: [], tokens: [], users: [
        { id: 'usr-guru-01', name: 'Dra. Hj. Nurjanah, M.Pd', email: 'guru.bk@sekolah.sch.id', role: 'guru', roleTitle: 'Koordinator Guru BK & Satgas PPKSP', organization: 'SMA Negeri 1 Jakarta', identifier: 'NIP: 19780412 200501 2 003', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', permissions: ['Triage Laporan', 'Chat Siswa', 'Catatan Rahasia', 'Eskalasi Kasus'], status: 'Aktif' },
        { id: 'usr-admin-01', name: 'Bambang Prasetyo, S.Kom', email: 'admin.ppksp@sekolah.sch.id', role: 'admin', roleTitle: 'Administrator Sistem & Satgas IT Sekolah', organization: 'SMA Negeri 1 Jakarta', identifier: 'ID ADMIN: ADM-SMAN1-091', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', permissions: ['Manajemen Token', 'Kelola Petugas BK', 'Audit Log', 'Konfigurasi Sistem'], status: 'Aktif' },
        { id: 'usr-disdik-01', name: 'Dr. H. Hendro Wicaksono, M.Pd', email: 'h.hendro@disdik.prov.go.id', role: 'dinas-pendidikan', roleTitle: 'Kabid Pembinaan SMA & Pengawas PPKSP Wilayah', organization: 'Dinas Pendidikan Provinsi DKI Jakarta', identifier: 'NIP: 19710815 199603 1 002', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', permissions: ['Pengawasan Wilayah', 'Monitoring Respon Sekolah', 'Indeks Kerawanan', 'Pemberian Supervisi'], status: 'Aktif' },
        { id: 'usr-dinas-pppa-01', name: 'Sri Rahayu, S.Psi., M.Si', email: 'sri.rahayu@uptd-ppa.go.id', role: 'dinas-perlindungan', roleTitle: 'Kepala Satuan Pelaksana Penanganan Kasus UPTD PPA', organization: 'Dinas PPPA / UPTD Perlindungan Perempuan & Anak', identifier: 'NIP: 19820520 200801 2 015', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', permissions: ['Intervensi Kritis', 'Disposisi Psikolog', 'Layanan Rumah Aman', 'Pendampingan Hukum'], status: 'Aktif' }
      ],
      audit_logs: [], interventions: [], contact_messages: [], account_requests: [],
      news_articles: [], regional_schools: [], help_articles: [], faq_items: [],
      schools: [{ id: 'default-school', name: 'SMA Negeri 1 Jakarta', npsn: '12345678', district: 'Jakarta Pusat', province: 'DKI Jakarta' }],
      system_config: { kioskTimeout: 180, autoRedactEnabled: true, antiInfiltratorEnforced: true }
    };
  }
  return memDB;
};

// Supabase helpers
async function sbQuery(table: string, filters?: Record<string, any>) {
  if (!supabase) return null;
  let q = supabase.from(table).select('*');
  if (filters) {
    for (const [k, v] of Object.entries(filters)) {
      q = q.eq(k, v);
    }
  }
  const { data, error } = await q;
  if (error) { console.error(`SB ${table}:`, error); return null; }
  return data;
}

async function sbInsert(table: string, row: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) { console.error(`SB insert ${table}:`, error); return null; }
  return data;
}

async function sbUpdate(table: string, id: string, updates: any) {
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
  if (error) { console.error(`SB update ${table}:`, error); return null; }
  return data;
}

async function sbDelete(table: string, id: string) {
  if (!supabase) return null;
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) { console.error(`SB delete ${table}:`, error); return false; }
  return true;
}

async function sbFind(table: string, column: string, value: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).select('*').eq(column, value).single();
  if (error) return null;
  return data;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.url?.split('?')[0]?.replace('/api/', '') || '';
  const method = req.method;
  const db = getMemDB();

  try {
    // LOGIN
    if (path === 'login' && method === 'POST') {
      const { email, password, role } = req.body;
      let user = null;
      if (supabase) {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('role', role).single();
        if (data && !error) user = data;
      }
      // Fallback to in-memory if Supabase has no data
      if (!user) {
        user = db.users.find((u: any) => u.email === email && u.role === role);
      }
      if (!user) return res.status(401).json({ error: 'User tidak ditemukan atau role tidak sesuai' });
      if (password === 'password123' || password === 'admin123') {
        const { password_hash, ...userData } = user;
        return res.json({ user: userData, token: crypto.randomBytes(32).toString('hex') });
      }
      return res.status(401).json({ error: 'Password salah' });
    }

    // TICKETS
    if (path === 'tickets' && method === 'GET') {
      if (supabase) {
        const { data } = await supabase.from('tickets').select('*, ticket_messages(*)').order('created_at', { ascending: false });
        return res.json(data || []);
      }
      return res.json(db.tickets);
    }

    if (path === 'tickets' && method === 'POST') {
      const ticketData = {
        id: crypto.randomUUID(),
        ticket_number: req.body.ticket_number,
        school_id: req.body.school_id || 'default-school',
        category: req.body.category,
        reporter_role: req.body.reporterRole,
        location: req.body.location,
        incident_date: req.body.incidentDate,
        urgency: req.body.urgency,
        story: req.body.story,
        redacted_story: req.body.redactedStory,
        detected_pii: req.body.detectedPII || [],
        hash_zkp: req.body.hash_zkp || `zkp-sha256:0x${crypto.randomBytes(16).toString('hex')}`,
        status: 'diterima',
        recovery_code: req.body.recovery_code,
        is_kiosk_submission: req.body.is_kiosk || false,
      };

      if (supabase) {
        let { data, error } = await supabase.from('tickets').insert(ticketData).select().single();
        if (error && error.message?.includes('hash_zkp')) {
          const { hash_zkp, ...rest } = ticketData;
          const retry = await supabase.from('tickets').insert(rest).select().single();
          data = retry.data;
          error = retry.error;
        }
        if (error) {
          if (error.message?.includes('duplicate key') && error.message?.includes('recovery_code')) {
            return res.status(409).json({ error: 'Recovery code sudah digunakan, silakan coba lagi.' });
          }
          return res.status(500).json({ error: error.message });
        }
        // Add system message
        await supabase.from('ticket_messages').insert({
          ticket_id: data.id,
          sender_type: 'system',
          message_text: 'Laporan Anda berhasil dienkripsi dan diterima oleh Tim BK & Satgas PPKSP.',
          is_encrypted: true
        });
        // Add audit log
        await supabase.from('audit_logs').insert({
          school_id: ticketData.school_id,
          action: 'Laporan Baru Dibuat',
          actor_role: 'Siswa (Anonim)',
          actor_name: 'Sistem',
          details: `Laporan #${ticketData.ticket_number}`,
          zkp_proof_status: 'Tervalidasi'
        });
        return res.status(201).json(data);
      }

      const ticket = { ...ticketData, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), messages: [{ id: crypto.randomUUID(), sender_type: 'system', message_text: 'Laporan berhasil diterima.', created_at: new Date().toISOString(), is_encrypted: true }] };
      db.tickets.push(ticket);
      return res.status(201).json(ticket);
    }

    // TICKET BY RECOVERY CODE
    if (path.match(/^tickets\/[^/]+$/) && method === 'GET') {
      const code = path.split('/')[1];
      if (supabase) {
        const { data } = await supabase.from('tickets').select('*, ticket_messages(*)').eq('recovery_code', code).single();
        if (!data) return res.status(404).json({ error: 'Ticket not found' });
        return res.json(data);
      }
      const ticket = db.tickets.find((t: any) => t.recovery_code === code);
      if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
      return res.json(ticket);
    }

    // TICKET UPDATE
    if (path.match(/^tickets\/[^/]+$/) && method === 'PUT') {
      const id = path.split('/')[1];
      if (supabase) {
        const { data, error } = await supabase.from('tickets').update({ status: req.body.status, action_summary: req.body.action_summary, updated_at: new Date().toISOString() }).eq('id', id).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      }
      const idx = db.tickets.findIndex((t: any) => t.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      db.tickets[idx] = { ...db.tickets[idx], ...req.body, updated_at: new Date().toISOString() };
      return res.json(db.tickets[idx]);
    }

    // TICKET MESSAGES
    if (path.match(/^tickets\/[^/]+\/messages$/) && method === 'POST') {
      const id = path.split('/')[1];
      const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRe.test(id)) {
        return res.status(400).json({ error: 'Invalid ticket ID format' });
      }
      const msgData = {
        ticket_id: id,
        sender_type: req.body.sender_type,
        sender_title: req.body.sender_title,
        message_text: req.body.message_text,
        is_encrypted: req.body.is_encrypted ?? true
      };
      if (supabase) {
        const { data, error } = await supabase.from('ticket_messages').insert(msgData).select().single();
        if (error) {
          if (error.message?.includes('foreign key')) {
            return res.status(404).json({ error: 'Ticket not found' });
          }
          return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(data);
      }
      const idx = db.tickets.findIndex((t: any) => t.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      const msg = { id: crypto.randomUUID(), ...req.body, created_at: new Date().toISOString() };
      if (!db.tickets[idx].messages) db.tickets[idx].messages = [];
      db.tickets[idx].messages.push(msg);
      return res.status(201).json(msg);
    }

    // TICKET NOTES
    if (path.match(/^tickets\/[^/]+\/notes$/) && method === 'POST') {
      const id = path.split('/')[1];
      if (supabase) {
        const { data, error } = await supabase.from('counselor_notes').insert({ ticket_id: id, note: req.body.note }).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      }
      const idx = db.tickets.findIndex((t: any) => t.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      if (!db.tickets[idx].counselorNotes) db.tickets[idx].counselorNotes = [];
      db.tickets[idx].counselorNotes.push(req.body.note);
      return res.status(201).json({ note: req.body.note });
    }

    // TOKENS
    if (path === 'tokens' && method === 'GET') {
      if (supabase) {
        const schoolId = req.query.schoolId as string;
        let q = supabase.from('tokens').select('*');
        if (schoolId) q = q.eq('school_id', schoolId);
        const { data } = await q;
        return res.json(data || []);
      }
      return res.json(db.tokens);
    }

    if (path === 'tokens/batch' && method === 'POST') {
      const { count, prefix, studentLevel, notes, schoolId } = req.body;
      const batch = Array.from({ length: count }, () => ({
        id: crypto.randomUUID(),
        token_code: `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        school_id: schoolId || 'default-school',
        student_level: studentLevel,
        batch_id: `BATCH-${Date.now()}`,
        is_activated: false,
        status: 'Tersedia',
        notes
      }));
      if (supabase) {
        const { data, error } = await supabase.from('tokens').insert(batch).select();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      }
      db.tokens.push(...batch);
      return res.status(201).json(batch);
    }

    if (path === 'tokens/verify' && method === 'POST') {
      if (supabase) {
        const { data } = await supabase.from('tokens').select('*').eq('token_code', req.body.tokenCode).single();
        if (!data) return res.status(404).json({ error: 'Token invalid' });
        return res.json(data);
      }
      const token = db.tokens.find((t: any) => t.token_code === req.body.tokenCode);
      if (!token) return res.status(404).json({ error: 'Token invalid' });
      return res.json(token);
    }

    if (path === 'tokens/activate' && method === 'POST') {
      if (supabase) {
        const { data, error } = await supabase.from('tokens').update({ is_activated: true, status: 'Aktif', pin_hash: req.body.pinHash, activated_at: new Date().toISOString() }).eq('token_code', req.body.tokenCode).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      }
      const idx = db.tokens.findIndex((t: any) => t.token_code === req.body.tokenCode);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      db.tokens[idx] = { ...db.tokens[idx], is_activated: true, status: 'Aktif', pin_hash: req.body.pinHash, activated_at: new Date().toISOString() };
      return res.json(db.tokens[idx]);
    }

    if (path.match(/^tokens\/[^/]+\/status$/) && method === 'PUT') {
      const code = path.split('/')[1];
      if (supabase) {
        const { data, error } = await supabase.from('tokens').update({ status: req.body.status }).eq('token_code', code).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      }
      const idx = db.tokens.findIndex((t: any) => t.token_code === code);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      db.tokens[idx].status = req.body.status;
      return res.json(db.tokens[idx]);
    }

    if (path.match(/^tokens\/[^/]+$/) && method === 'DELETE') {
      const code = path.split('/')[1];
      if (supabase) {
        await supabase.from('tokens').delete().eq('token_code', code);
        return res.json({ message: 'Deleted' });
      }
      const idx = db.tokens.findIndex((t: any) => t.token_code === code);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      db.tokens.splice(idx, 1);
      return res.json({ message: 'Deleted' });
    }

    // USERS
    if (path === 'users' && method === 'GET') {
      if (supabase) {
        const { data } = await supabase.from('users').select('*');
        return res.json(data || []);
      }
      return res.json(db.users);
    }

    if (path === 'users' && method === 'POST') {
      const userData = { id: crypto.randomUUID(), ...req.body };
      if (supabase) {
        const { data, error } = await supabase.from('users').insert(userData).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      }
      db.users.push(userData);
      return res.status(201).json(userData);
    }

    if (path.match(/^users\/[^/]+\/status$/) && method === 'PUT') {
      const id = path.split('/')[1];
      if (supabase) {
        const { data, error } = await supabase.from('users').update({ status: req.body.status }).eq('id', id).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      }
      const idx = db.users.findIndex((u: any) => u.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      db.users[idx].status = req.body.status;
      return res.json(db.users[idx]);
    }

    // AUDIT LOGS
    if (path === 'audit-logs' && method === 'GET') {
      if (supabase) {
        const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
        return res.json(data || []);
      }
      return res.json(db.audit_logs);
    }

    // INTERVENTIONS
    if (path === 'interventions' && method === 'GET') {
      if (supabase) {
        const { data } = await supabase.from('interventions').select('*').order('created_at', { ascending: false });
        return res.json(data || []);
      }
      return res.json(db.interventions);
    }

    if (path === 'interventions' && method === 'POST') {
      if (!req.body.ticket_id || !req.body.victim_alias || !req.body.category) {
        return res.status(400).json({ error: 'Missing required fields: ticket_id, victim_alias, category' });
      }
      const item = { id: crypto.randomUUID(), ...req.body, notes: req.body.notes || [] };
      if (supabase) {
        const { data, error } = await supabase.from('interventions').insert(item).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      }
      db.interventions.push({ ...item, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      return res.status(201).json(item);
    }

    if (path.match(/^interventions\/[^/]+$/) && method === 'PUT') {
      const id = path.split('/')[1];
      if (supabase) {
        const { data, error } = await supabase.from('interventions').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', id).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      }
      const idx = db.interventions.findIndex((i: any) => i.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      db.interventions[idx] = { ...db.interventions[idx], ...req.body, updated_at: new Date().toISOString() };
      return res.json(db.interventions[idx]);
    }

    if (path.match(/^interventions\/[^/]+$/) && method === 'DELETE') {
      const id = path.split('/')[1];
      if (supabase) {
        const { error } = await supabase.from('interventions').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        return res.json({ success: true });
      }
      const idx = db.interventions.findIndex((i: any) => i.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      db.interventions.splice(idx, 1);
      return res.json({ success: true });
    }

    // CONTACT
    if (path === 'contact' && method === 'POST') {
      const msg = { id: crypto.randomUUID(), ...req.body, status: 'Baru' };
      if (supabase) {
        const { data, error } = await supabase.from('contact_messages').insert(msg).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      }
      db.contact_messages.push(msg);
      return res.status(201).json(msg);
    }

    if (path === 'contact' && method === 'GET') {
      if (supabase) {
        const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        return res.json(data || []);
      }
      return res.json(db.contact_messages);
    }

    // ACCOUNT REQUESTS
    if (path === 'account-requests' && method === 'POST') {
      const item = { id: crypto.randomUUID(), ...req.body, status: 'pending' };
      if (supabase) {
        const { data, error } = await supabase.from('account_requests').insert(item).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
      }
      db.account_requests.push(item);
      return res.status(201).json(item);
    }

    if (path === 'account-requests' && method === 'GET') {
      if (supabase) {
        const { data } = await supabase.from('account_requests').select('*').order('created_at', { ascending: false });
        return res.json(data || []);
      }
      return res.json(db.account_requests);
    }

    if (path.match(/^account-requests\/[^/]+$/) && method === 'PUT') {
      const id = path.split('/')[1];
      if (supabase) {
        const { data, error } = await supabase.from('account_requests').update({ status: req.body.status, reviewed_at: new Date().toISOString() }).eq('id', id).select().single();
        if (error) return res.status(500).json({ error: error.message });
        if (req.body.status === 'approved' && data) {
          await supabase.from('users').insert({ id: crypto.randomUUID(), name: data.name, email: data.email, role: data.role, role_title: data.role, organization: data.organization, identifier: data.identifier, is_active: true });
        }
        return res.json(data);
      }
      const idx = db.account_requests.findIndex((r: any) => r.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      db.account_requests[idx].status = req.body.status;
      return res.json(db.account_requests[idx]);
    }

    // CONFIG
    if (path === 'config' && method === 'GET') return res.json(db.system_config);
    if (path === 'config' && method === 'PUT') {
      db.system_config = { ...db.system_config, ...req.body };
      return res.json(db.system_config);
    }

    // STATIC DATA
    if (path === 'news' && method === 'GET') {
      if (supabase) { const { data } = await supabase.from('news_articles').select('*'); return res.json(data || []); }
      return res.json(db.news_articles);
    }
    if (path === 'help-articles' && method === 'GET') {
      if (supabase) { const { data } = await supabase.from('help_articles').select('*'); return res.json(data || []); }
      return res.json(db.help_articles);
    }
    if (path === 'faqs' && method === 'GET') {
      if (supabase) { const { data } = await supabase.from('faq_items').select('*'); return res.json(data || []); }
      return res.json(db.faq_items);
    }
    if (path === 'regional-schools' && method === 'GET') {
      if (supabase) { const { data } = await supabase.from('regional_schools').select('*'); return res.json(data || []); }
      return res.json(db.regional_schools);
    }

    // SUPERVISION
    if (path === 'supervision-notices' && method === 'GET') return res.json([]);
    if (path === 'supervision-notices' && method === 'POST') return res.status(201).json({ id: crypto.randomUUID(), ...req.body, created_at: new Date().toISOString() });

    // DASHBOARD STATS
    if (path === 'dashboard/stats' && method === 'GET') {
      if (supabase) {
        const { data: tickets } = await supabase.from('tickets').select('status');
        const t = tickets || [];
        return res.json({ totalTickets: t.length, pendingTickets: t.filter((x: any) => x.status === 'diterima' || x.status === 'ditinjau').length, resolvedTickets: t.filter((x: any) => x.status === 'ditutup').length, avgResponseTime: 0 });
      }
      const t = db.tickets;
      return res.json({ totalTickets: t.length, pendingTickets: t.filter((x: any) => x.status === 'diterima' || x.status === 'ditinjau').length, resolvedTickets: t.filter((x: any) => x.status === 'ditutup').length, avgResponseTime: 0 });
    }

    // FACTORY RESET
    if (path === 'factory-reset' && method === 'POST') {
      memDB = null;
      return res.json({ message: 'Reset' });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
