import { EmpresaDetalhes } from '../types/company';

export const mockCompanies: EmpresaDetalhes[] = [
  {
    id: '1',
    nome: 'TechStart Inovação',
    setor: 'Tecnologia',
    tamanho: 'Startup',
    avatar: '🚀',
    faturamento: 'R$ 2-5 milhões/ano',
    website: 'www.techstart.com.br',
    status: 'ativo',
    progresso: 85,
    proximaReuniao: '2025-01-20 14:00',
    ultimaInteracao: '2025-01-15',
    valorContrato: 'R$ 25.000/mês',
    necessidades: ['chat', 'analises', 'relatorios', 'kpis'],
    stakeholders: [
      { id: '1', nome: 'João Silva', cargo: 'CEO', email: 'joao@techstart.com.br', telefone: '(11) 99999-1111' },
      { id: '2', nome: 'Maria Santos', cargo: 'CTO', email: 'maria@techstart.com.br', telefone: '(11) 99999-2222' },
      { id: '3', nome: 'Pedro Costa', cargo: 'CFO', email: 'pedro@techstart.com.br', telefone: '(11) 99999-3333' }
    ],
    configuracaoIA: {
      personalidade: 'Consultivo e Estratégico',
      foco: ['Crescimento Acelerado', 'Captação de Investimentos', 'Otimização de Processos'],
      restricoes: ['Evitar linguagem muito técnica', 'Focar em soluções práticas']
    },
    estatisticas: {
      reunioesRealizadas: 12,
      relatoriosGerados: 8,
      kpisMonitorados: 15,
      horasEconomizadas: 47,
      pesquisasRealizadas: 3,
      documentosGerados: 5
    },
    roi: '+127%',
    descricao: 'Startup de tecnologia focada em soluções SaaS para o mercado B2B, com crescimento acelerado e recente captação de investimento série A.',
    desafios: 'Escalabilidade da infraestrutura, retenção de talentos e expansão para novos mercados.',
    objetivos: 'Triplicar base de clientes em 18 meses, lançar 2 novos produtos e preparar para rodada série B.'
  },
  {
    id: '2',
    nome: 'RetailMax Varejo',
    setor: 'Varejo',
    tamanho: 'Média',
    avatar: '🛍️',
    faturamento: 'R$ 50-100 milhões/ano',
    website: 'www.retailmax.com.br',
    status: 'ativo',
    progresso: 65,
    proximaReuniao: '2025-01-18 10:00',
    ultimaInteracao: '2025-01-14',
    valorContrato: 'R$ 35.000/mês',
    necessidades: ['kpis', 'relatorios', 'reunioes'],
    stakeholders: [
      { id: '1', nome: 'Ana Costa', cargo: 'Diretora Comercial', email: 'ana@retailmax.com.br', telefone: '(11) 98888-1111' },
      { id: '2', nome: 'Carlos Lima', cargo: 'Gerente de Operações', email: 'carlos@retailmax.com.br', telefone: '(11) 98888-2222' }
    ],
    configuracaoIA: {
      personalidade: 'Direto e Objetivo',
      foco: ['Otimização de Estoque', 'Expansão de Lojas Físicas', 'Integração Omnichannel'],
      restricoes: ['Manter foco em resultados mensuráveis', 'Priorizar exemplos do setor de varejo']
    },
    estatisticas: {
      reunioesRealizadas: 24,
      relatoriosGerados: 15,
      kpisMonitorados: 22,
      horasEconomizadas: 78,
      pesquisasRealizadas: 2,
      documentosGerados: 8
    },
    roi: '+89%',
    descricao: 'Rede de varejo com 25 lojas físicas e e-commerce em expansão, focada em produtos para casa e decoração.',
    desafios: 'Integração entre canais físicos e digitais, otimização de estoque e logística de última milha.',
    objetivos: 'Aumentar conversão online em 40%, reduzir custos operacionais em 15% e abrir 10 novas lojas.'
  },
  {
    id: '3',
    nome: 'InnovaCorp Solutions',
    setor: 'Serviços',
    tamanho: 'Grande',
    avatar: '🔧',
    faturamento: 'Acima de R$ 100 milhões',
    website: 'www.innovacorp.com.br',
    status: 'pendente',
    progresso: 45,
    ultimaInteracao: '2025-01-10',
    necessidades: ['analises', 'chat', 'reunioes'],
    stakeholders: [
      { id: '1', nome: 'Roberto Lima', cargo: 'Diretor Industrial', email: 'roberto@innovacorp.com.br', telefone: '(11) 97777-1111' },
      { id: '2', nome: 'Carla Mendes', cargo: 'Gerente de Qualidade', email: 'carla@innovacorp.com.br', telefone: '(11) 97777-2222' }
    ],
    configuracaoIA: {
      personalidade: 'Formal e Técnico',
      foco: ['Eficiência Operacional', 'Gestão de Qualidade', 'Redução de Custos'],
      restricoes: ['Utilizar terminologia técnica do setor', 'Focar em normas ISO']
    },
    estatisticas: {
      reunioesRealizadas: 8,
      relatoriosGerados: 6,
      kpisMonitorados: 18,
      horasEconomizadas: 32,
      pesquisasRealizadas: 1,
      documentosGerados: 3
    },
    roi: '+156%',
    descricao: 'Empresa de consultoria industrial especializada em otimização de processos e implementação de sistemas de gestão da qualidade.',
    desafios: 'Digitalização de processos tradicionais, capacitação da equipe em novas tecnologias e expansão internacional.',
    objetivos: 'Implementar transformação digital completa, aumentar carteira de clientes em 30% e expandir para América Latina.'
  },
  {
    id: '4',
    nome: 'FinTech Solutions',
    setor: 'Financeiro',
    tamanho: 'Pequena',
    avatar: '💰',
    faturamento: 'R$ 5-20 milhões/ano',
    website: 'www.fintechsolutions.com.br',
    status: 'ativo',
    progresso: 85,
    proximaReuniao: '2025-01-25 16:00',
    ultimaInteracao: '2025-01-13',
    valorContrato: 'R$ 18.000/mês',
    necessidades: ['analises', 'kpis', 'relatorios', 'chat'],
    stakeholders: [
      { id: '1', nome: 'Marcos Oliveira', cargo: 'CEO', email: 'marcos@fintech.com.br', telefone: '(11) 96666-1111' },
      { id: '2', nome: 'Juliana Ferreira', cargo: 'CRO', email: 'juliana@fintech.com.br', telefone: '(11) 96666-2222' }
    ],
    configuracaoIA: {
      personalidade: 'Analítico e Estratégico',
      foco: ['Análise de Risco', 'Crescimento de Usuários', 'Compliance Regulatório'],
      restricoes: ['Manter conformidade com LGPD e regulações financeiras', 'Priorizar segurança de dados']
    },
    estatisticas: {
      reunioesRealizadas: 18,
      relatoriosGerados: 22,
      kpisMonitorados: 28,
      horasEconomizadas: 65,
      pesquisasRealizadas: 4,
      documentosGerados: 12
    },
    roi: '+203%',
    descricao: 'Fintech especializada em soluções de crédito para pequenas empresas, utilizando algoritmos proprietários de análise de risco.',
    desafios: 'Escalabilidade da plataforma, redução da taxa de inadimplência e adaptação às novas regulações do Banco Central.',
    objetivos: 'Dobrar volume de crédito concedido, reduzir taxa de inadimplência em 30% e lançar novo produto de antecipação de recebíveis.'
  },
  {
    id: '5',
    nome: 'HealthCare Plus',
    setor: 'Saúde',
    tamanho: 'Média',
    avatar: '🏥',
    faturamento: 'R$ 20-100 milhões/ano',
    website: 'www.healthcareplus.com.br',
    status: 'concluido',
    progresso: 100,
    ultimaInteracao: '2024-12-20',
    valorContrato: 'R$ 30.000/mês',
    necessidades: ['reunioes', 'relatorios', 'chat', 'kpis'],
    stakeholders: [
      { id: '1', nome: 'Dra. Fernanda Santos', cargo: 'Diretora Médica', email: 'fernanda@healthcare.com.br', telefone: '(11) 95555-1111' },
      { id: '2', nome: 'Ricardo Gomes', cargo: 'Diretor Administrativo', email: 'ricardo@healthcare.com.br', telefone: '(11) 95555-2222' }
    ],
    configuracaoIA: {
      personalidade: 'Colaborativo e Acessível',
      foco: ['Experiência do Paciente', 'Eficiência Clínica', 'Gestão de Custos'],
      restricoes: ['Garantir conformidade com normas de saúde', 'Priorizar confidencialidade de dados de pacientes']
    },
    estatisticas: {
      reunioesRealizadas: 32,
      relatoriosGerados: 18,
      kpisMonitorados: 24,
      horasEconomizadas: 92,
      pesquisasRealizadas: 1,
      documentosGerados: 6
    },
    roi: '+145%',
    descricao: 'Rede de clínicas médicas especializadas em atendimento primário, com foco em experiência do paciente e tecnologia.',
    desafios: 'Expansão para novas regiões, integração de sistemas legados e implementação de telemedicina.',
    objetivos: 'Abrir 5 novas unidades, implementar sistema de prontuário eletrônico unificado e reduzir tempo de espera em 50%.'
  }
];

export const getCompanyById = (id: string): EmpresaDetalhes | undefined => {
  return mockCompanies.find(company => company.id === id);
};

export const getNecessidadeLabel = (necessidade: CompanyNecessidade): string => {
  const labels: Record<CompanyNecessidade, string> = {
    chat: 'Chat com IA',
    reunioes: 'Reuniões Inteligentes',
    relatorios: 'Relatórios Executivos',
    kpis: 'Monitoramento de KPIs',
    analises: 'Análises Preditivas'
  };
  
  return labels[necessidade] || necessidade;
};

export const getNecessidadeIcon = (necessidade: CompanyNecessidade): string => {
  const icons: Record<CompanyNecessidade, string> = {
    chat: '🤖',
    reunioes: '🎥',
    relatorios: '📊',
    kpis: '📈',
    analises: '🔮'
  };
  
  return icons[necessidade] || '📋';
};

export const getNecessidadeDescription = (necessidade: CompanyNecessidade): string => {
  const descriptions: Record<CompanyNecessidade, string> = {
    chat: 'Chat inteligente com IA especializada na empresa',
    reunioes: 'Gravação e resumo de reuniões com integração Google Meet',
    relatorios: 'Relatórios executivos gerados por IA',
    kpis: 'Monitoramento de KPIs em tempo real',
    analises: 'Análises preditivas para tomada de decisão estratégica'
  };
  
  return descriptions[necessidade] || '';
};