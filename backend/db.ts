import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("🚨 ERRO CRÍTICO: A variável SUPABASE_URL não foi encontrada. Verifique o seu .env ou painel do Vercel!");
}

if (!supabaseKey) {
  throw new Error("🚨 ERRO CRÍTICO: A variável SUPABASE_SERVICE_ROLE_KEY não foi encontrada. Verifique o seu .env ou painel do Vercel!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  university: string;
  course: string;
  degree: string;
  scholarshipType: string;
  residencyStatus: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  arrivalDate: string;
  gender: string;
  passportNumber: string;
  passportExpiry: string;
  residenceCardNumber: string;
  residenceCardExpiry: string;
  consularCardNumber: string;
  consularCardExpiry: string;
}

export interface SupportTicket {
  id: string;
  category: string;
  description: string;
  studentName: string;
  email: string;
  status: 'Pendente' | 'Em Resolução' | 'Resolvido';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  attachment_url?: string | null;
  attachment_name?: string | null;
}

class Database {
  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  }

  async addStudent(studentData: Omit<Student, 'id' | 'residencyStatus'>): Promise<Student> {
    const payload = {
      ...studentData,
      residencyStatus: "Validado"
    };
    const { data, error } = await supabase.from('students').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getTickets(): Promise<SupportTicket[]> {
    const { data, error } = await supabase.from('support_tickets').select('*').order('createdAt', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async addTicket(ticketData: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>): Promise<SupportTicket> {
    const payload = {
      ...ticketData,
      status: "Pendente"
    };
    const { data, error } = await supabase.from('support_tickets').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateTicketStatus(id: string, status: 'Pendente' | 'Em Resolução' | 'Resolvido'): Promise<SupportTicket | null> {
    const { data, error } = await supabase.from('support_tickets').update({ status }).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async updateStudent(id: string, studentData: Partial<Omit<Student, 'id'>>): Promise<Student | null> {
    const { data, error } = await supabase.from('students').update(studentData).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async addAnnouncement(announcementData: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> {
    const { data, error } = await supabase.from('announcements').insert([announcementData]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }

  async getAdminPassword(): Promise<string> {
    try {
      const { data, error } = await supabase.from('admin_settings').select('value').eq('id', 'password').maybeSingle();
      if (error || !data) {
        return process.env.ADMIN_PASSWORD || "asegbm2026";
      }
      return data.value;
    } catch {
      return process.env.ADMIN_PASSWORD || "asegbm2026";
    }
  }

  async setAdminPassword(newPassword: string): Promise<void> {
    const { error } = await supabase.from('admin_settings').upsert({ id: 'password', value: newPassword });
    if (error) throw new Error(error.message);
  }

  async ping(): Promise<boolean> {
    const { data, error } = await supabase.from('support_tickets').select('id').limit(1);
    if (error) throw new Error(error.message);
    return true;
  }
}

export const db = new Database();
