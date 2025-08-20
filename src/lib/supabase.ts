import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: ReturnType<typeof createClient>

// Validação básica
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não encontradas. Usando valores padrão.')
  // Use valores padrão para evitar crash
  const defaultUrl = 'https://placeholder.supabase.co'
  const defaultKey = 'placeholder-key'
  
  supabase = createClient(defaultUrl, defaultKey)
} else {
  // Verificar se ainda estão com valores placeholder
  if (supabaseUrl.includes('your-project-id') || supabaseUrl === 'your_supabase_project_url') {
    console.warn('⚠️ URL do Supabase ainda está com valor placeholder.')
  }
  
  if (supabaseAnonKey.includes('your_supabase_anon_key') || supabaseAnonKey === 'your_supabase_anon_key_here') {
    console.warn('⚠️ Chave do Supabase ainda está com valor placeholder.')
  }
  
  // Validar formato da URL
  try {
    new URL(supabaseUrl)
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn(`⚠️ URL do Supabase inválida: "${supabaseUrl}". Deve ser algo como: https://seu-projeto-id.supabase.co`)
    // Use valores padrão para evitar crash
    const defaultUrl = 'https://placeholder.supabase.co'
    const defaultKey = 'placeholder-key'
    supabase = createClient(defaultUrl, defaultKey)
  }
}

// Types for database tables
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          nome: string
          cnpj: string
          setor: string
          tamanho: string
          faturamento: string
          website: string | null
          telefone_contato: string
          email_contato: string
          cargo_contato: string
          desafios: string
          objetivos: string
          mercado_atuacao: string | null
          necessidades: string[]
          status: 'ativo' | 'pausado' | 'concluido'
          progresso: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          cnpj: string
          setor: string
          tamanho: string
          faturamento: string
          website?: string | null
          telefone_contato: string
          email_contato: string
          cargo_contato: string
          desafios: string
          objetivos: string
          mercado_atuacao?: string | null
          necessidades: string[]
          status?: 'ativo' | 'pausado' | 'concluido'
          progresso?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string
          setor?: string
          tamanho?: string
          faturamento?: string
          website?: string | null
          telefone_contato?: string
          email_contato?: string
          cargo_contato?: string
          desafios?: string
          objetivos?: string
          mercado_atuacao?: string | null
          necessidades?: string[]
          status?: 'ativo' | 'pausado' | 'concluido'
          progresso?: number
          created_at?: string
          updated_at?: string
        }
      }
      stakeholders: {
        Row: {
          id: string
          company_id: string
          nome: string
          cargo: string
          email: string
          funcao: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          nome: string
          cargo: string
          email: string
          funcao: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          nome?: string
          cargo?: string
          email?: string
          funcao?: string
          created_at?: string
        }
      }
      user_gamification: {
        Row: {
          id: string
          user_id: string
          current_level: number
          total_points: number
          monthly_points: number
          weekly_points: number
          badges: any[]
          streaks: any
          ranking: any
          stats: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_level?: number
          total_points?: number
          monthly_points?: number
          weekly_points?: number
          badges?: any[]
          streaks?: any
          ranking?: any
          stats?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_level?: number
          total_points?: number
          monthly_points?: number
          weekly_points?: number
          badges?: any[]
          streaks?: any
          ranking?: any
          stats?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export { supabase }