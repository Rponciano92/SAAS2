import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Video, 
  FileText, 
  BarChart3, 
  FileCheck, 
  TrendingUp,
  ArrowLeft,
  Upload,
  Clock,
  Users,
  Download,
  Bell,
  Zap,
  Eye,
  Calendar,
  Target,
  DollarSign
} from 'lucide-react';
import { getCompanyById } from '@/data/mockCompanies';
import { EmpresaDetalhes } from '@/types/company';

interface ContractedFunction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export default function ClientDashboard() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<EmpresaDetalhes | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  React.useEffect(() => {
    if (companyId) {
      const companyData = getCompanyById(companyId);
      if (companyData) {
        setCompany(companyData);
      }
    }
  }, [companyId]);

  if (!company) {
    return (
      <div className="min-h-screen marble-background flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-[#003B6D] mb-4">Cliente não encontrado</h2>
          <button 
            onClick={() => navigate('/empresas')}
            className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Voltar para Lista de Clientes
          </button>
        </div>
      </div>
    );
  }

  const contractedFunctions: ContractedFunction[] = [
    {
      id: 'chat',
      title: 'Chat Inteligente',
      description: 'Assistente IA personalizado com upload de documentos e histórico completo',
      icon: <MessageSquare size={32} className="text-[#0A74DA]" />,
      features: [
        'Assistente IA especializado na empresa',
        'Upload e análise de documentos',
        'Histórico completo de conversas',
        'Respostas contextualizadas',
        'Integração com base de conhecimento'
      ],
      color: 'from-[#0A74DA]/20 to-[#0A74DA]/5 border-[#0A74DA]/30',
      isActive: company.necessidades.includes('chat'),
      onClick: () => navigate(`/empresas/${company.id}?tab=chat`)
    },
    {
      id: 'reunioes',
      title: 'Resumo de Reuniões',
      description: 'Gravação automática, transcrição inteligente e extração de pontos-chave',
      icon: <Video size={32} className="text-[#28A745]" />,
      features: [
        'Gravação automática de reuniões',
        'Transcrição em tempo real',
        'Identificação de pontos-chave',
        'Extração automática de ações',
        'Resumo executivo gerado por IA'
      ],
      color: 'from-[#28A745]/20 to-[#28A745]/5 border-[#28A745]/30',
      isActive: company.necessidades.includes('reunioes'),
      onClick: () => navigate(`/empresas/${company.id}?tab=reunioes`)
    },
    {
      id: 'relatorios',
      title: 'Relatórios Executivos',
      description: 'Geração automática de relatórios com insights, gráficos e exportação',
      icon: <FileText size={32} className="text-[#FFA500]" />,
      features: [
        'Geração automática de relatórios',
        'Insights estratégicos por IA',
        'Gráficos e visualizações',
        'Múltiplos formatos de export',
        'Templates personalizáveis'
      ],
      color: 'from-[#FFA500]/20 to-[#FFA500]/5 border-[#FFA500]/30',
      isActive: company.necessidades.includes('relatorios'),
      onClick: () => navigate(`/empresas/${company.id}?tab=relatorios`)
    },
    {
      id: 'kpis',
      title: 'Monitoramento de KPIs',
      description: 'Dashboard em tempo real com alertas e métricas personalizadas',
      icon: <BarChart3 size={32} className="text-[#B8860B]" />,
      features: [
        'Dashboard em tempo real',
        'Alertas automáticos',
        'Métricas personalizadas',
        'Comparações históricas',
        'Projeções e tendências'
      ],
      color: 'from-[#B8860B]/20 to-[#B8860B]/5 border-[#B8860B]/30',
      isActive: company.necessidades.includes('kpis'),
      onClick: () => navigate(`/empresas/${company.id}?tab=kpis`)
    },
    {
      id: 'contratos',
      title: 'Gestão de Contratos',
      description: 'Templates inteligentes, revisão automática e assinatura digital',
      icon: <FileCheck size={32} className="text-[#8B5CF6]" />,
      features: [
        'Templates inteligentes',
        'Revisão automática por IA',
        'Assinatura digital integrada',
        'Versionamento de documentos',
        'Alertas de vencimento'
      ],
      color: 'from-[#8B5CF6]/20 to-[#8B5CF6]/5 border-[#8B5CF6]/30',
      isActive: company.necessidades.includes('contratos'),
      onClick: () => navigate(`/empresas/${company.id}?tab=contratos`)
    },
    {
      id: 'analises',
      title: 'Análises Preditivas',
      description: 'Previsões de vendas, churn, cenários futuros e detecção de anomalias',
      icon: <TrendingUp size={32} className="text-[#EF4444]" />,
      features: [
        'Previsões de vendas e receita',
        'Análise de churn de clientes',
        'Simulação de cenários',
        'Detecção de anomalias',
        'Recomendações estratégicas'
      ],
      color: 'from-[#EF4444]/20 to-[#EF4444]/5 border-[#EF4444]/30',
      isActive: company.necessidades.includes('analises'),
      onClick: () => navigate(`/empresas/${company.id}?tab=analises`)
    }
  ];

  const activeFunctions = contractedFunctions.filter(func => func.isActive);
  const inactiveFunctions = contractedFunctions.filter(func => !func.isActive);

  return (
    <div className="min-h-screen marble-background">
      {/* Header */}
      <header className="bg-[#003B6D] text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/empresas')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{company.avatar}</div>
              <div>
                <h1 className="text-2xl font-bold">{company.nome}</h1>
                <p className="text-blue-100">{company.setor} • {company.tamanho}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{activeFunctions.length}</div>
              <div className="text-sm text-blue-100">Funções Ativas</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{company.estatisticas.reunioesRealizadas}</div>
              <div className="text-sm text-blue-100">Reuniões</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{company.estatisticas.relatoriosGerados}</div>
              <div className="text-sm text-blue-100">Relatórios</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-xl font-bold">{company.estatisticas.horasEconomizadas}h</div>
              <div className="text-sm text-blue-100">Economizadas</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Funções Contratadas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#003B6D] mb-6 flex items-center space-x-3">
            <Zap className="text-[#FFA500]" size={28} />
            <span>🚀 Funções Contratadas</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeFunctions.map((func) => (
              <div
                key={func.id}
                className={`
                  glass-card p-6 cursor-pointer transition-all duration-300
                  hover:transform hover:scale-105 hover:shadow-2xl
                  bg-gradient-to-br ${func.color}
                  border-2 hover:border-opacity-60
                `}
                onClick={func.onClick}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    {func.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#003B6D] text-lg">{func.title}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#28A745] rounded-full animate-pulse"></div>
                      <span className="text-xs text-[#28A745] font-medium">ATIVO</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{func.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#003B6D] text-sm">✨ Recursos:</h4>
                  <ul className="space-y-1">
                    {func.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start space-x-2">
                        <span className="text-[#28A745] mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {func.features.length > 3 && (
                      <li className="text-xs text-gray-500 italic">
                        +{func.features.length - 3} recursos adicionais
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20">
                  <button className="w-full bg-white/20 hover:bg-white/30 text-[#003B6D] py-2 rounded-lg font-medium transition-colors text-sm">
                    Acessar Função →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funções Disponíveis para Upgrade */}
        {inactiveFunctions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#003B6D] mb-6 flex items-center space-x-3">
              <Target className="text-[#B8860B]" size={28} />
              <span>⭐ Funções Disponíveis para Upgrade</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inactiveFunctions.map((func) => (
                <div
                  key={func.id}
                  className={`
                    glass-card p-6 transition-all duration-300
                    hover:transform hover:scale-102 hover:shadow-lg
                    bg-gradient-to-br ${func.color}
                    border-2 border-dashed opacity-75 hover:opacity-100
                  `}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-white/10 rounded-xl opacity-60">
                      {func.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#003B6D] text-lg">{func.title}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-500 font-medium">DISPONÍVEL</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{func.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#003B6D] text-sm">✨ Recursos:</h4>
                    <ul className="space-y-1">
                      {func.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-xs text-gray-500 flex items-start space-x-2">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <button className="w-full bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm">
                      Contratar Função
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 glass-card p-6">
          <h3 className="font-bold text-[#003B6D] mb-4 flex items-center space-x-2">
            <BarChart3 className="text-[#0A74DA]" size={20} />
            <span>📊 Resumo de Atividades</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 glass-card-subtle rounded-lg">
              <div className="text-2xl font-bold text-[#0A74DA] mb-1">
                {company.estatisticas.totalContratos}
              </div>
              <div className="text-xs text-gray-600">Contratos Ativos</div>
            </div>
            
            <div className="text-center p-3 glass-card-subtle rounded-lg">
              <div className="text-2xl font-bold text-[#28A745] mb-1">
                {company.estatisticas.reunioesRealizadas}
              </div>
              <div className="text-xs text-gray-600">Reuniões Realizadas</div>
            </div>
            
            <div className="text-center p-3 glass-card-subtle rounded-lg">
              <div className="text-2xl font-bold text-[#FFA500] mb-1">
                {company.estatisticas.relatoriosGerados}
              </div>
              <div className="text-xs text-gray-600">Relatórios Gerados</div>
            </div>
            
            <div className="text-center p-3 glass-card-subtle rounded-lg">
              <div className="text-2xl font-bold text-[#B8860B] mb-1">
                {company.estatisticas.kpisMonitorados}
              </div>
              <div className="text-xs text-gray-600">KPIs Monitorados</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 glass-card p-6">
          <h3 className="font-bold text-[#003B6D] mb-4 flex items-center space-x-2">
            <Clock className="text-[#0A74DA]" size={20} />
            <span>🕒 Atividade Recente</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 glass-card-subtle rounded-lg">
              <div className="w-2 h-2 bg-[#28A745] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#003B6D]">Relatório executivo gerado</p>
                <p className="text-xs text-gray-600">Há 2 horas</p>
              </div>
              <Eye size={16} className="text-[#0A74DA] cursor-pointer hover:text-[#003B6D]" />
            </div>
            
            <div className="flex items-center space-x-3 p-3 glass-card-subtle rounded-lg">
              <div className="w-2 h-2 bg-[#0A74DA] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#003B6D]">Reunião transcrita e resumida</p>
                <p className="text-xs text-gray-600">Ontem às 14:30</p>
              </div>
              <Eye size={16} className="text-[#0A74DA] cursor-pointer hover:text-[#003B6D]" />
            </div>
            
            <div className="flex items-center space-x-3 p-3 glass-card-subtle rounded-lg">
              <div className="w-2 h-2 bg-[#FFA500] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#003B6D]">Novo KPI configurado</p>
                <p className="text-xs text-gray-600">2 dias atrás</p>
              </div>
              <Eye size={16} className="text-[#0A74DA] cursor-pointer hover:text-[#003B6D]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}