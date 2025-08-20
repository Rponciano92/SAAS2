import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Company = Database['public']['Tables']['companies']['Row']
type CompanyInsert = Database['public']['Tables']['companies']['Insert']
type CompanyUpdate = Database['public']['Tables']['companies']['Update']

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompanies(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  const createCompany = async (company: CompanyInsert) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert(company)
        .select()
        .single()

      if (error) throw error
      setCompanies(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa')
      throw err
    }
  }

  const updateCompany = async (id: string, updates: CompanyUpdate) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setCompanies(prev => prev.map(company => 
        company.id === id ? data : company
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar empresa')
      throw err
    }
  }

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCompanies(prev => prev.filter(company => company.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar empresa')
      throw err
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  return {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    refetch: fetchCompanies
  }
}

export function useStakeholders(companyId: string) {
  const [stakeholders, setStakeholders] = useState<Database['public']['Tables']['stakeholders']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStakeholders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('stakeholders')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setStakeholders(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar stakeholders')
    } finally {
      setLoading(false)
    }
  }

  const createStakeholder = async (stakeholder: Database['public']['Tables']['stakeholders']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('stakeholders')
        .insert(stakeholder)
        .select()
        .single()

      if (error) throw error
      setStakeholders(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar stakeholder')
      throw err
    }
  }

  useEffect(() => {
    if (companyId) {
      fetchStakeholders()
    }
  }, [companyId])

  return {
    stakeholders,
    loading,
    error,
    createStakeholder,
    refetch: fetchStakeholders
  }
}