import { Badge, Level, Challenge, Reward } from '../types/gamification';

export const LEVELS: Level[] = [
  { level: 1, name: "Iniciante", pointsRequired: 0, color: "#E0E0E0" },
  { level: 2, name: "Aprendiz", pointsRequired: 1000, color: "#28A745" },
  { level: 3, name: "Consultor", pointsRequired: 3000, color: "#0A74DA" },
  { level: 4, name: "Especialista", pointsRequired: 7000, color: "#FFA500" },
  { level: 5, name: "Expert", pointsRequired: 15000, color: "#B8860B" },
  { level: 6, name: "Master", pointsRequired: 30000, color: "#8B4513" },
  { level: 7, name: "Guru", pointsRequired: 60000, color: "#4B0082" },
  { level: 8, name: "Lenda", pointsRequired: 120000, color: "#FF1493" }
];

export const BADGES: Badge[] = [
  // Badges de Contribuição de Conhecimento
  {
    id: "mentor-supremo",
    name: "Mentor Supremo",
    description: "50 contribuições validadas",
    icon: "🏆",
    category: "knowledge",
    rarity: "legendary"
  },
  {
    id: "biblioteca-viva",
    name: "Biblioteca Viva",
    description: "25 arquivos validados",
    icon: "📚",
    category: "knowledge",
    rarity: "epic"
  },
  {
    id: "professor-ia",
    name: "Professor IA",
    description: "100 ensinamentos validados",
    icon: "🧠",
    category: "knowledge",
    rarity: "legendary"
  },
  {
    id: "validador-ouro",
    name: "Validador Ouro",
    description: "15 contribuições validadas consecutivas",
    icon: "✅",
    category: "knowledge",
    rarity: "epic"
  },
  {
    id: "guru-conhecimento",
    name: "Guru do Conhecimento",
    description: "Top 1 em contribuições validadas mensais",
    icon: "👑",
    category: "knowledge",
    rarity: "legendary"
  },
  {
    id: "sabio-aether",
    name: "Sábio Aether",
    description: "2000 pontos só de contribuições validadas",
    icon: "🔮",
    category: "knowledge",
    rarity: "epic"
  },
  {
    id: "mestre-dos-mestres",
    name: "Mestre dos Mestres",
    description: "Todas as badges de conhecimento + 95% taxa aprovação",
    icon: "⭐",
    category: "knowledge",
    rarity: "legendary"
  },

  // Badges de Produtividade
  {
    id: "foguete",
    name: "Foguete",
    description: "Primeira empresa cadastrada",
    icon: "🚀",
    category: "productivity",
    rarity: "common"
  },
  {
    id: "raio",
    name: "Raio",
    description: "10 análises de IA em um dia",
    icon: "⚡",
    category: "productivity",
    rarity: "rare"
  },
  {
    id: "precisao",
    name: "Precisão",
    description: "5 metas alcançadas consecutivas",
    icon: "🎯",
    category: "productivity",
    rarity: "rare"
  },
  {
    id: "crescimento",
    name: "Crescimento",
    description: "Aumento de 50% na produtividade",
    icon: "📈",
    category: "productivity",
    rarity: "epic"
  },
  {
    id: "streak",
    name: "Streak",
    description: "30 dias consecutivos de uso",
    icon: "🔥",
    category: "productivity",
    rarity: "epic"
  },
  {
    id: "profissional",
    name: "Profissional",
    description: "100 contratos gerados",
    icon: "📝",
    category: "productivity",
    rarity: "epic"
  },
  {
    id: "campeao",
    name: "Campeão",
    description: "Top 10 do ranking mensal",
    icon: "🏅",
    category: "productivity",
    rarity: "rare"
  },

  // Badges de Expertise
  {
    id: "analista",
    name: "Analista",
    description: "100 relatórios executivos",
    icon: "📊",
    category: "expertise",
    rarity: "rare"
  },
  {
    id: "comunicador",
    name: "Comunicador",
    description: "200 reuniões realizadas",
    icon: "🎙️",
    category: "expertise",
    rarity: "epic"
  },
  {
    id: "visionario",
    name: "Visionário",
    description: "50 análises preditivas",
    icon: "🔮",
    category: "expertise",
    rarity: "epic"
  },
  {
    id: "organizador",
    name: "Organizador",
    description: "500 KPIs monitorados",
    icon: "📋",
    category: "expertise",
    rarity: "epic"
  },
  {
    id: "inovador",
    name: "Inovador",
    description: "Primeira funcionalidade beta testada",
    icon: "💡",
    category: "expertise",
    rarity: "rare"
  },
  {
    id: "veterano",
    name: "Veterano",
    description: "Usuário desde o beta",
    icon: "🏛️",
    category: "expertise",
    rarity: "rare"
  },

  // Badges Especiais
  {
    id: "workspace-winner",
    name: "Workspace Winner",
    description: "Ganhou Google Workspace",
    icon: "🏆",
    category: "special",
    rarity: "legendary"
  },
  {
    id: "primeiro-lugar",
    name: "Primeiro Lugar",
    description: "#1 no ranking mensal",
    icon: "🥇",
    category: "special",
    rarity: "legendary"
  },
  {
    id: "aniversario",
    name: "Aniversário",
    description: "1 ano usando Aether AI",
    icon: "🎂",
    category: "special",
    rarity: "epic"
  },
  {
    id: "embaixador",
    name: "Embaixador",
    description: "10 indicações bem-sucedidas",
    icon: "🌟",
    category: "special",
    rarity: "legendary"
  },
  {
    id: "hall-da-fama",
    name: "Hall da Fama",
    description: "Top 1% histórico",
    icon: "🏛️",
    category: "special",
    rarity: "legendary"
  },
  {
    id: "estrela",
    name: "Estrela",
    description: "Avaliação 5 estrelas por 6 meses",
    icon: "⭐",
    category: "special",
    rarity: "epic"
  }
];

export const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: "semana-produtividade",
    name: "Semana da Produtividade",
    description: "Aumente sua produtividade gerando relatórios executivos",
    objective: "Gere 5 relatórios executivos",
    reward: {
      points: 500,
      badge: "analista"
    },
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2025, 0, 22),
    maxProgress: 5,
    status: "active"
  },
  {
    id: "mestre-reunioes",
    name: "Mestre das Reuniões",
    description: "Realize reuniões com resumo automático da IA",
    objective: "Realize 10 reuniões com resumo IA",
    reward: {
      points: 750,
      badge: "comunicador"
    },
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2025, 0, 22),
    maxProgress: 10,
    status: "active"
  },
  {
    id: "guru-ia",
    name: "Guru da IA",
    description: "Contribua com ensinamentos para melhorar a IA",
    objective: "Faça 3 ensinamentos para IA",
    reward: {
      points: 1000,
      badge: "professor-ia"
    },
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2025, 0, 22),
    maxProgress: 3,
    status: "active"
  }
];

export const REWARDS: Reward[] = [
  {
    id: "google-workspace",
    name: "Google Workspace Business Standard",
    description: "6 meses gratuitos de Google Workspace Business Standard",
    requirementType: "special",
    requirementValue: "monthly-goal",
    category: "digital",
    image: "google-workspace.png",
    available: true
  },
  {
    id: "desconto-mensalidade",
    name: "Desconto 10% próxima mensalidade",
    description: "Desconto de 10% na próxima mensalidade do Aether AI",
    pointsCost: 2000,
    requirementType: "points",
    requirementValue: 2000,
    category: "discount",
    available: true
  },
  {
    id: "template-premium",
    name: "Template Premium de Contrato",
    description: "Template exclusivo para contratos de consultoria",
    pointsCost: 5000,
    requirementType: "points",
    requirementValue: 5000,
    category: "digital",
    available: true
  },
  {
    id: "acesso-antecipado",
    name: "Acesso Antecipado",
    description: "Acesso antecipado a novas funcionalidades",
    pointsCost: 10000,
    requirementType: "points",
    requirementValue: 10000,
    category: "feature",
    available: true
  },
  {
    id: "certificacao",
    name: "Certificação Oficial Aether AI",
    description: "Certificação oficial como especialista Aether AI",
    pointsCost: 20000,
    requirementType: "points",
    requirementValue: 20000,
    category: "recognition",
    available: true
  },
  {
    id: "programa-beta",
    name: "Programa Beta Exclusivo",
    description: "Participação em programa beta exclusivo",
    pointsCost: 40000,
    requirementType: "points",
    requirementValue: 40000,
    category: "feature",
    available: true
  },
  {
    id: "ia-premium",
    name: "Acesso a IA Premium",
    description: "Acesso a IA Premium por 1 semana",
    requirementType: "contribution",
    requirementValue: "3",
    category: "feature",
    available: true
  },
  {
    id: "template-metodologia",
    name: "Template Exclusivo de Metodologia",
    description: "Template exclusivo para metodologias de consultoria",
    requirementType: "contribution",
    requirementValue: "8",
    category: "digital",
    available: true
  },
  {
    id: "consultoria-especialista",
    name: "Consultoria 1:1 com Especialista",
    description: "1 hora de consultoria com especialista Aether AI",
    requirementType: "contribution",
    requirementValue: "15",
    category: "recognition",
    available: true
  },
  {
    id: "licenca-vitalicia",
    name: "Licença Vitalícia com 70% Desconto",
    description: "Licença vitalícia do Aether AI com 70% de desconto",
    requirementType: "contribution",
    requirementValue: "50",
    category: "discount",
    available: true
  }
];

export const POINTS_SYSTEM = {
  // CONTRIBUIÇÕES DE CONHECIMENTO (APÓS VALIDAÇÃO OBRIGATÓRIA)
  contribuirConhecimento: 0,              // 0 pts iniciais, aguarda validação
  ensinamentoIA: 0,                       // 0 pts iniciais, aguarda validação
  arquivoEspecializado: 0,                // 0 pts iniciais, aguarda validação
  metodologiaCompartilhada: 0,            // 0 pts iniciais, aguarda validação
  caseSuccessContribuido: 0,              // 0 pts iniciais, aguarda validação
  feedbackQualidadeIA: 0,                 // 0 pts iniciais, aguarda validação
  
  // APÓS VALIDAÇÃO DO ESPECIALISTA:
  validacaoAprovada: {
    contribuirConhecimento: 300,          // +300 pts após aprovação
    ensinamentoIA: 250,                   // +250 pts após aprovação
    arquivoEspecializado: 200,            // +200 pts após aprovação
    metodologiaCompartilhada: 280,        // +280 pts após aprovação
    caseSuccessContribuido: 260,          // +260 pts após aprovação
    feedbackQualidadeIA: 150,             // +150 pts após aprovação
    bonusQualidade: 100                   // Bônus extra por alta qualidade
  },
  
  // PENALIDADES POR REJEIÇÃO:
  validacaoRejeitada: {
    pontosPenalidade: -50,                // Penalidade por conteúdo inadequado
    tentativaParticipacao: 25             // Pontos mínimos por tentar
  },
  
  // Uso de IA (Pontuação Imediata - Menor)
  chatComIA: 10,
  contratoGerado: 25,
  relatorioExecutivo: 30,
  analisePredicativa: 35,
  
  // Reuniões e Produtividade (Pontuação Imediata - Menor)
  reuniaoAgendada: 15,
  reuniaoRealizada: 25,
  resumoReuniao: 20,
  
  // KPIs e Monitoramento (Pontuação Imediata - Menor)
  kpiConfigurado: 20,
  metaAlcancada: 75,
  alertaResolvido: 15,
  
  // Ações Básicas (Pontuação Imediata - Mínima)
  loginDiario: 5,
  empresaCadastrada: 30,
  perfilCompleto: 20,
  
  // Engajamento Social (Pontuação Imediata - Menor)
  avaliacaoPositiva: 20,
  indicacaoAmigo: 150,
  compartilhamentoSucesso: 35
};

export const MONTHLY_GOAL_CRITERIA = {
  pontosMinimos: 4000,
  contribuicoesValidadas: 10,
  empresasAtivas: 8,
  relatoriosGerados: 15,
  reunioesRealizadas: 20,
  kpisMonitorados: 25,
  diasAtivos: 28,
  taxaAprovacao: 80
};

export const MONTHLY_GOAL_REWARD = {
  nome: "Google Workspace Business Standard",
  valor: "R$ 187,20 total (6 meses)",
  duracao: "6 MESES GRATUITOS",
  beneficios: [
    "Gmail profissional por 6 meses",
    "Google Drive 2TB por 6 meses", 
    "Google Meet avançado por 6 meses",
    "Google Docs, Sheets, Slides por 6 meses",
    "Calendário integrado por 6 meses",
    "Segurança empresarial por 6 meses",
    "Suporte prioritário Google"
  ]
};

// Mock data for user gamification
export const MOCK_USER_GAMIFICATION = {
  userId: "user123",
  currentLevel: 4,
  totalPoints: 8450,
  monthlyPoints: 2450,
  weeklyPoints: 750,
  badges: [
    {
      id: "foguete",
      name: "Foguete",
      description: "Primeira empresa cadastrada",
      icon: "🚀",
      category: "productivity",
      rarity: "common",
      earnedAt: new Date(2025, 0, 15)
    },
    {
      id: "raio",
      name: "Raio",
      description: "10 análises de IA em um dia",
      icon: "⚡",
      category: "productivity",
      rarity: "rare",
      earnedAt: new Date(2025, 0, 13)
    },
    {
      id: "precisao",
      name: "Precisão",
      description: "5 metas alcançadas consecutivas",
      icon: "🎯",
      category: "productivity",
      rarity: "rare",
      earnedAt: new Date(2025, 0, 10)
    }
  ],
  streaks: {
    daily: 15,
    productive: 8,
    goals: 5,
    contributions: 3
  },
  monthlyGoal: {
    id: "goal-jan-2025",
    userId: "user123",
    month: 1,
    year: 2025,
    status: "in_progress",
    criteria: {
      minPoints: 4000,
      validatedContributions: 10,
      activeCompanies: 8,
      reportsGenerated: 15,
      meetingsHeld: 20,
      kpisMonitored: 25,
      activeDays: 28,
      approvalRate: 80
    },
    progress: {
      currentPoints: 2450,
      validatedContributions: 7,
      activeCompanies: 7,
      reportsGenerated: 8,
      meetingsHeld: 12,
      kpisMonitored: 18,
      activeDays: 15,
      approvalRate: 85
    },
    reward: {
      name: "Google Workspace Business Standard",
      description: "6 meses gratuitos de Google Workspace Business Standard",
      value: "R$ 187,20 total (6 meses)",
      duration: "6 MESES GRATUITOS"
    }
  },
  ranking: {
    monthly: 3,
    allTime: 15,
    contributions: 5
  },
  stats: {
    contributionsTotal: 12,
    contributionsApproved: 10,
    contributionsRejected: 2,
    approvalRate: 83,
    companiesActive: 7,
    reportsGenerated: 8,
    meetingsHeld: 12,
    kpisMonitored: 18,
    activeDaysMonth: 15
  }
};

export const MOCK_RANKING = [
  {
    userId: "user456",
    name: "Ana Costa",
    avatar: "👩‍💼",
    level: 5,
    points: 12450,
    badges: 15,
    position: 1
  },
  {
    userId: "user789",
    name: "João Silva",
    avatar: "👨‍💼",
    level: 5,
    points: 11200,
    badges: 12,
    position: 2
  },
  {
    userId: "user123",
    name: "Carlos Silva",
    avatar: "👨‍💻",
    level: 4,
    points: 8450,
    badges: 8,
    position: 3,
    isCurrentUser: true
  },
  {
    userId: "user101",
    name: "Mariana Oliveira",
    avatar: "👩‍💻",
    level: 4,
    points: 7800,
    badges: 9,
    position: 4
  },
  {
    userId: "user202",
    name: "Pedro Santos",
    avatar: "👨‍🚀",
    level: 3,
    points: 6500,
    badges: 7,
    position: 5
  }
];

export const MOCK_CONTRIBUTIONS = [
  {
    id: "contrib1",
    userId: "user123",
    title: "Metodologia Análise Financeira Premium",
    type: "methodology",
    status: "approved",
    submittedAt: new Date(2025, 0, 10),
    validatedAt: new Date(2025, 0, 11),
    validator: "Dr. Carlos Mendes",
    points: 280,
    potentialPoints: 280,
    feedback: "Excelente contribuição! Metodologia será integrada à base principal",
    quality: "excellent"
  },
  {
    id: "contrib2",
    userId: "user123",
    title: "Estratégia de Crescimento para Startups Tech",
    type: "knowledge",
    status: "pending",
    submittedAt: new Date(2025, 0, 12),
    points: 0,
    potentialPoints: 300
  },
  {
    id: "contrib3",
    userId: "user123",
    title: "Correção Análise TechStart - Projeções",
    type: "feedback",
    status: "approved",
    submittedAt: new Date(2025, 0, 14),
    validatedAt: new Date(2025, 0, 15),
    validator: "Dra. Ana Silva",
    points: 150,
    potentialPoints: 150,
    feedback: "Feedback preciso que melhorou significativamente o modelo",
    quality: "good"
  },
  {
    id: "contrib4",
    userId: "user123",
    title: "Processo Operacional Genérico",
    type: "file",
    status: "rejected",
    submittedAt: new Date(2025, 0, 8),
    validatedAt: new Date(2025, 0, 9),
    validator: "Dr. Roberto Lima",
    points: 25,
    potentialPoints: 200,
    feedback: "Conteúdo muito genérico. Precisa ser mais específico para consultoria",
    quality: "unsatisfactory"
  }
];

export const MOCK_POINTS_HISTORY = [
  {
    id: "points1",
    userId: "user123",
    amount: 280,
    reason: "Metodologia Análise Financeira Premium aprovada",
    category: "contribution",
    timestamp: new Date(2025, 0, 11),
    relatedEntityId: "contrib1",
    relatedEntityType: "contribution"
  },
  {
    id: "points2",
    userId: "user123",
    amount: 150,
    reason: "Correção Análise TechStart aprovada",
    category: "contribution",
    timestamp: new Date(2025, 0, 15),
    relatedEntityId: "contrib3",
    relatedEntityType: "contribution"
  },
  {
    id: "points3",
    userId: "user123",
    amount: 25,
    reason: "Tentativa de contribuição (rejeitada)",
    category: "contribution",
    timestamp: new Date(2025, 0, 9),
    relatedEntityId: "contrib4",
    relatedEntityType: "contribution"
  },
  {
    id: "points4",
    userId: "user123",
    amount: 30,
    reason: "Empresa cadastrada: TechStart Inovação",
    category: "activity",
    timestamp: new Date(2025, 0, 5),
    relatedEntityId: "company1",
    relatedEntityType: "company"
  },
  {
    id: "points5",
    userId: "user123",
    amount: 75,
    reason: "Meta alcançada: Crescimento 15%",
    category: "achievement",
    timestamp: new Date(2025, 0, 8),
    relatedEntityId: "goal1",
    relatedEntityType: "goal"
  },
  {
    id: "points6",
    userId: "user123",
    amount: 500,
    reason: "Desafio completado: Semana da Produtividade",
    category: "achievement",
    timestamp: new Date(2025, 0, 7),
    relatedEntityId: "challenge1",
    relatedEntityType: "challenge"
  }
];