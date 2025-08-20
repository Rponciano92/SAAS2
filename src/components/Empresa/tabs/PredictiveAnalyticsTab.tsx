import React, { useState } from 'react';
import { EmpresaDetalhes } from '@/types/company';
import { TrendingUp, BarChart3, DollarSign, Users, Target, Calendar, ArrowRight, ArrowUp, ArrowDown, Zap, Settings, Download, Eye, Plus } from 'lucide-react';

interface PredictiveModel {
  id: string;
  nome: string;
  tipo: 'receita' | 'churn' | 'mercado' | 'recursos' | 'tendencias';
  dataCriacao: string;
  confianca: number;
  horizonte: string;
  status: 'ativo' | 'treinando' | 'desativado';
  previsoes?: {
    cenarioOtimista: string;
    cenarioBase: string;
    cenarioPessimista: string;
  };
  insights?: string[];
}

interface PredictiveAnalyticsTabProps {
  company: EmpresaDetalhes;
}

export default function PredictiveAnalyticsTab({ company }: PredictiveAnalyticsTabProps) {
  const [activeModel, setActiveModel] = useState<string | null>(null);
  
  // Mock predictive models data
  const mockModels: PredictiveModel[] = [
    {
      id: '1',
      nome: 'Previsão de Receita',
      tipo: 'receita',
      dataCriacao: '2025-01-10',
      confianca: 87,
      horizonte: '12 meses',
      status: 'ativo',
      previsoes: {
        cenarioOtimista: 'R$ 18.5M',
        cenarioBase: 'R$ 15.2M',
        cenarioPessimista: 'R$ 12.8M'
      },
      insights: [
        'Crescimento projetado de 23% no cenário base',
        'Maior crescimento esperado no segmento de produtos premium',
        'Sazonalidade significativa no Q4'
      ]
    },
    {
      id: '2',
      nome: 'Análise de Churn',
      tipo: 'churn',
      dataCriacao: '2025-01-05',
      confianca: 92,
      horizonte: '6 meses',
      status: 'ativo',
      previsoes: {
        cenarioOtimista: '2.8%',
        cenarioBase: '3.5%',
        cenarioPessimista: '4.2%'
      },
      insights: [
        'Churn concentrado em clientes com menos de 3 meses',
        'Principais motivos: onboarding complexo e falta de suporte',
        'Oportunidade de redução de 30% com melhorias no onboarding'
      ]
    },
    {
      id: '3',
      nome: 'Análise de Mercado',
      tipo: 'mercado',
      dataCriacao: '2024-12-20',
      confianca: 78,
      horizonte: '24 meses',
      status: 'ativo',
      previsoes: {
        cenarioOtimista: '25% market share',
        cenarioBase: '18% market share',
        cenarioPessimista: '12% market share'
      },
      insights: [
        'Crescimento acelerado no segmento de PMEs',
        'Novos concorrentes entrando no mercado em Q2 2025',
        'Oportunidade de expansão internacional na América Latina'
      ]
    },
    {
      id: '4',
      nome: 'Otimização de Recursos',
      tipo: 'recursos',
      dataCriacao: '2024-12-15',
      confianca: 85,
      horizonte: '6 meses',
      status: 'ativo',
      previsoes: {
        cenarioOtimista: '25% economia',
        cenarioBase: '18% economia',
        cenarioPessimista: '10% economia'
      },
      insights: [
        'Maior potencial de otimização na infraestrutura de TI',
        'Automação pode reduzir custos operacionais em até 22%',
        'Recomendação de revisão de contratos com fornecedores'
      ]
    }
  ];
  
  const getModelIcon = (tipo: string) => {
    switch (tipo) {
      case 'receita': return <DollarSign size={20} className="text-[#28A745]" />;
      case 'churn': return <Users size={20} className="text-[#EF4444]" />;
      case 'mercado': return <Target size={20} className="text-[#0A74DA]" />;
      case 'recursos': return <BarChart3 size={20} className="text-[#FFA500]" />;
      case 'tendencias': return <TrendingUp size={20} className="text-[#B8860B]" />;
      default: return <BarChart3 size={20} className="text-[#0A74DA]" />;
    }
  };
  
  const getModelColor = (tipo: string) => {
    switch (tipo) {
      case 'receita': return 'text-[#28A745] bg-[#28A745]/10';
      case 'churn': return 'text-[#EF4444] bg-[#EF4444]/10';
      case 'mercado': return 'text-[#0A74DA] bg-[#0A74DA]/10';
      case 'recursos': return 'text-[#FFA500] bg-[#FFA500]/10';
      case 'tendencias': return 'text-[#B8860B] bg-[#B8860B]/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-[#28A745] bg-[#28A745]/10';
      case 'treinando': return 'text-[#FFA500] bg-[#FFA500]/10';
      case 'desativado': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };
  
  const getConfidenceColor = (confianca: number) => {
    if (confianca >= 90) return 'text-[#28A745]';
    if (confianca >= 70) return 'text-[#FFA500]';
    return 'text-[#EF4444]';
  };
  
  const selectedModel = mockModels.find(model => model.id === activeModel) || mockModels[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title flex items-center space-x-3">
          <TrendingUp className="text-[#0A74DA]" size={24} />
          <span>🔮 Análises Preditivas</span>
        </h3>
        
        <button className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2">
          <Plus size={18} />
          <span>Novo Modelo</span>
        </button>
      </div>
      
      {/* Models Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {mockModels.map(model => (
          <div
            key={model.id}
            className={`glass-card p-4 cursor-pointer transition-all ${
              activeModel === model.id ? 'ring-2 ring-[#0A74DA] transform scale-[1.02]' : ''
            }`}
            onClick={() => setActiveModel(model.id)}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${getModelColor(model.tipo).replace('text-', 'bg-').replace('/10', '/20')}`}>
                {getModelIcon(model.tipo)}
              </div>
              <div>
                <h4 className="font-semibold text-[#003B6D] text-sm">{model.nome}</h4>
                <p className="text-xs text-gray-600">{model.horizonte}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(model.status)}`}>
                {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
              </span>
              <span className={`text-xs font-medium ${getConfidenceColor(model.confianca)}`}>
                {model.confianca}% confiança
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Selected Model Details */}
      {selectedModel && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${getModelColor(selectedModel.tipo).replace('text-', 'bg-').replace('/10', '/20')}`}>
                {getModelIcon(selectedModel.tipo)}
              </div>
              <div>
                <h3 className="font-bold text-[#003B6D] text-xl">{selectedModel.nome}</h3>
                <p className="text-gray-600">
                  Criado em {new Date(selectedModel.dataCriacao).toLocaleDateString()} • 
                  Horizonte: {selectedModel.horizonte}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="px-3 py-1.5 bg-white/10 text-[#003B6D] rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center space-x-1">
                <Settings size={14} />
                <span>Configurar</span>
              </button>
              <button className="px-3 py-1.5 bg-white/10 text-[#003B6D] rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center space-x-1">
                <Download size={14} />
                <span>Exportar</span>
              </button>
              <button className="px-3 py-1.5 bg-white/10 text-[#003B6D] rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center space-x-1">
                <Eye size={14} />
                <span>Relatório Completo</span>
              </button>
            </div>
          </div>
          
          {/* Prediction Scenarios */}
          {selectedModel.previsoes && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="glass-card-subtle p-4 border-l-4 border-[#EF4444]">
                <h5 className="font-semibold text-[#003B6D] mb-2">Cenário Pessimista</h5>
                <p className="text-2xl font-bold text-[#EF4444]">{selectedModel.previsoes.cenarioPessimista}</p>
                <p className="text-xs text-gray-600 mt-1">Probabilidade: 20%</p>
              </div>
              
              <div className="glass-card-subtle p-4 border-l-4 border-[#FFA500]">
                <h5 className="font-semibold text-[#003B6D] mb-2">Cenário Base</h5>
                <p className="text-2xl font-bold text-[#FFA500]">{selectedModel.previsoes.cenarioBase}</p>
                <p className="text-xs text-gray-600 mt-1">Probabilidade: 60%</p>
              </div>
              
              <div className="glass-card-subtle p-4 border-l-4 border-[#28A745]">
                <h5 className="font-semibold text-[#003B6D] mb-2">Cenário Otimista</h5>
                <p className="text-2xl font-bold text-[#28A745]">{selectedModel.previsoes.cenarioOtimista}</p>
                <p className="text-xs text-gray-600 mt-1">Probabilidade: 20%</p>
              </div>
            </div>
          )}
          
          {/* Insights and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card-subtle p-4">
              <h5 className="font-semibold text-[#003B6D] mb-3 flex items-center space-x-2">
                <Zap size={16} className="text-[#0A74DA]" />
                <span>Insights Principais</span>
              </h5>
              
              {selectedModel.insights && (
                <ul className="space-y-2">
                  {selectedModel.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <span className="text-[#28A745] mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="glass-card-subtle p-4">
              <h5 className="font-semibold text-[#003B6D] mb-3 flex items-center space-x-2">
                <Target size={16} className="text-[#0A74DA]" />
                <span>Recomendações Estratégicas</span>
              </h5>
              
              <ul className="space-y-2">
                <li className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-[#0A74DA] mt-1">→</span>
                  <span>Investir em estratégias de retenção para reduzir churn nos primeiros 3 meses</span>
                </li>
                <li className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-[#0A74DA] mt-1">→</span>
                  <span>Preparar infraestrutura para escalar com o crescimento projetado</span>
                </li>
                <li className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-[#0A74DA] mt-1">→</span>
                  <span>Explorar oportunidades de expansão na América Latina no Q3 2025</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Prediction Chart - Placeholder */}
          <div className="mt-6 p-4 glass-card-subtle">
            <h5 className="font-semibold text-[#003B6D] mb-3">Projeção Temporal</h5>
            <div className="h-64 bg-white/10 rounded-lg p-4 flex items-end justify-between">
              {/* This would be a real chart in a production app */}
              <div className="flex items-end space-x-2 w-full h-full">
                {Array.from({ length: 12 }).map((_, i) => {
                  const baseHeight = 30 + Math.random() * 40;
                  const optimisticHeight = baseHeight + 10 + Math.random() * 10;
                  const pessimisticHeight = baseHeight - 10 - Math.random() * 10;
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                      <div className="w-full flex justify-center items-end space-x-1">
                        <div 
                          className="w-1 bg-[#EF4444]/30 rounded-t"
                          style={{ height: `${pessimisticHeight}%` }}
                        ></div>
                        <div 
                          className="w-2 bg-[#FFA500]/50 rounded-t"
                          style={{ height: `${baseHeight}%` }}
                        ></div>
                        <div 
                          className="w-1 bg-[#28A745]/30 rounded-t"
                          style={{ height: `${optimisticHeight}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(2025, i).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center space-x-6 mt-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#28A745]/30 rounded"></div>
                <span>Otimista</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FFA500]/50 rounded"></div>
                <span>Base</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#EF4444]/30 rounded"></div>
                <span>Pessimista</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Explanation Section */}
      <div className="glass-card p-6 border-[#0A74DA]/30 bg-[#0A74DA]/5">
        <h4 className="font-bold text-[#003B6D] mb-4 flex items-center space-x-2">
          <Zap size={20} className="text-[#0A74DA]" />
          <span>💡 Como funcionam as Análises Preditivas</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A74DA]/20 text-[#0A74DA] font-bold">1</div>
            <div>
              <p className="font-medium text-[#003B6D] mb-1">Coleta de Dados</p>
              <p className="text-gray-700">Nossos modelos analisam dados históricos da {company.nome} e do mercado.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A74DA]/20 text-[#0A74DA] font-bold">2</div>
            <div>
              <p className="font-medium text-[#003B6D] mb-1">Modelagem Avançada</p>
              <p className="text-gray-700">Algoritmos de machine learning identificam padrões e tendências.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A74DA]/20 text-[#0A74DA] font-bold">3</div>
            <div>
              <p className="font-medium text-[#003B6D] mb-1">Cenários Múltiplos</p>
              <p className="text-gray-700">Simulações de diferentes cenários para planejamento estratégico.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}