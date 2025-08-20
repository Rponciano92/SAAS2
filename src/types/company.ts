export type CompanySize = 'Startup' | 'Pequena' | 'Média' | 'Grande' | 'Corporação';
export type CompanyStatus = 'ativo' | 'pendente' | 'concluido';
export type CompanyNecessidade = 'chat' | 'contratos' | 'reunioes' | 'relatorios' | 'kpis' | 'analises';

export interface Stakeholder {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone?: string;
}

export interface EmpresaDetalhes {
  id: string;
  nome: string;
  setor: string;
  tamanho: CompanySize;
  avatar: string;
  faturamento: string;
  website?: string;
  status: CompanyStatus;
  progresso: number;
  proximaReuniao?: string;
  ultimaInteracao: string;
  valorContrato?: string;
  necessidades: CompanyNecessidade[];
  stakeholders: Stakeholder[];
  configuracaoIA: {
    personalidade: string;
    foco: string[];
    restricoes: string[];
  };
  estatisticas: {
    totalContratos: number;
    reunioesRealizadas: number;
    relatoriosGerados: number;
    kpisMonitorados: number;
    horasEconomizadas: number;
  };
  descricao?: string;
  desafios?: string;
  objetivos?: string;
}