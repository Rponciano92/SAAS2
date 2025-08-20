import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Company = Database['public']['Tables']['companies']['Row']
type CompanyInsert = Database['public']['Tables']['companies']['Insert']
type CompanyUpdate = Database['public']['Tables']['companies']['Update']

export class CompanyService {
  static async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar empresas: ${error.message}`)
    return data || []
  }

  static async getById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new Error(`Erro ao buscar empresa: ${error.message}`)
    }
    return data
  }

  static async create(company: CompanyInsert): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        ...company,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(`Erro ao criar empresa: ${error.message}`)
    return data
  }

  static async update(id: string, updates: CompanyUpdate): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Erro ao atualizar empresa: ${error.message}`)
    return data
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Erro ao deletar empresa: ${error.message}`)
  }

  static async getBySetor(setor: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('setor', setor)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar empresas por setor: ${error.message}`)
    return data || []
  }

  static async getByStatus(status: 'ativo' | 'pausado' | 'concluido'): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar empresas por status: ${error.message}`)
    return data || []
  }

  static async search(searchTerm: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`nome.ilike.%${searchTerm}%,setor.ilike.%${searchTerm}%,email_contato.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar empresas: ${error.message}`)
    return data || []
  }
}

export class StakeholderService {
  static async getByCompanyId(companyId: string) {
    const { data, error } = await supabase
      .from('stakeholders')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Erro ao buscar stakeholders: ${error.message}`)
    return data || []
  }

  static async create(stakeholder: Database['public']['Tables']['stakeholders']['Insert']) {
    const { data, error } = await supabase
      .from('stakeholders')
      .insert({
        ...stakeholder,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(`Erro ao criar stakeholder: ${error.message}`)
    return data
  }

  static async createMultiple(stakeholders: Database['public']['Tables']['stakeholders']['Insert'][]) {
    const { data, error } = await supabase
      .from('stakeholders')
      .insert(stakeholders.map(s => ({
        ...s,
        created_at: new Date().toISOString()
      })))
      .select()

    if (error) throw new Error(`Erro ao criar stakeholders: ${error.message}`)
    return data || []
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('stakeholders')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Erro ao deletar stakeholder: ${error.message}`)
  }
}