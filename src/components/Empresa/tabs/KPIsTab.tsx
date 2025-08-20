import React, { useState } from 'react';
import { EmpresaDetalhes } from '@/types/company';
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingCart, Clock, Bell, Plus, Settings, ArrowUp, ArrowDown, Zap } from 'lucide-react';

interface KPI {
  id: string;
  nome: string;
  valor: string;
  meta: string;
  tendencia: 'up' | 'down' | 'stable';
  variacao: string;
  periodo: string;
  categoria: 'financeiro' | 'operacional' | 'marketing' | 'vendas' | 'rh';
  alerta?: {
    tipo: 'success' | 'warning' | 'danger';
    mensagem: string;
  };
}

interface KPIsTabProps {
  company: EmpresaDetalhes;
}

export default function KPIsTab({ company }: KPIsTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  
  // Mock KPIs data
  const mockKPIs: KPI[] = [
    {
      id: '1',
      nome: 'Receita Mensal',
      valor: 'R$ 1.250.000',
      meta: 'R$ 1.000.000',
      tendencia: 'up',
      variacao: '+25%',
      periodo: 'Jan 2025',
      categoria: 'financeiro',
      alerta: {
        tipo: 'success',
        mensagem: 'Meta superada em 25%'
      }
    },
    {
      id: '2',
      nome: 'CAC (Custo de Aquisição)',
      valor: 'R$ 850',
      meta: 'R$ 1.000',
      tendencia: 'down',
      variacao: '-15%',
      periodo: 'Jan 2025',
      categoria: 'marketing',
      alerta: {
        tipo: 'success',
        mensagem: 'Abaixo da meta (melhor)'
      }
    },
    {
      id: '3',
      nome: 'Churn Rate',
      valor: '3.2%',
      meta: '5%',
      tendencia: 'down',
      variacao: '-1.8pp',
      periodo: 'Jan 2025',
      categoria: 'vendas',
      alerta: {
        tipo: 'success',
        mensagem: 'Abaixo da meta (melhor)'
      }
    },
    {
      id: '4',
      nome: 'Tempo Médio de Resposta',
      valor: '4.5h',
      meta: '3h',
      tendencia: 'up',
      variacao: '+1.5h',
      periodo: 'Jan 2025',
      categoria: 'operacional',
      alerta: {
        tipo: 'danger',
        mensagem: 'Acima da meta (pior)'
      }
    },
    {
      id: '5',
      nome: 'NPS (Net Promoter Score)',
      valor: '72',
      meta: '70',
      tendencia: 'up',
      variacao: '+5',
      periodo: 'Jan 2025',
      categoria: 'vendas',
      alerta: {
        tipo: 'success',
        mensagem: 'Meta atingida'
      }
    },
    {
      id: '6',
      nome: 'Margem de Lucro',
      valor: '32%',
      meta: '30%',
      tendencia: 'up',
      variacao: '+2pp',
      periodo: 'Jan 2025',
      categoria: 'financeiro',
      alerta: {
        tipo: 'success',
        mensagem: 'Meta superada'
      }
    },
    {
      id: '7',
      nome: 'Rotatividade de Funcionários',
      valor: '8%',
      meta: '10%',
      tendencia: 'down',
      variacao: '-2pp',
      periodo: 'Jan 2025',
      categoria: 'rh',
      alerta: {
        tipo: 'success',
        mensagem: 'Abaixo da meta (melhor)'
      }
    },
    {
      id: '8',
      nome: 'Conversão de Leads',
      valor: '18%',
      meta: '20%',
      tendencia: 'down',
      variacao: '-2pp',
      periodo: 'Jan 2025',
      categoria: 'marketing',
      alerta: {
        tipo: 'warning',
        mensagem: 'Abaixo da meta'
      }
    }
  ];
  
  const filteredKPIs = activeCategory === 'todos' 
    ? mockKPIs 
    : mockKPIs.filter(kpi => kpi.categoria === activeCategory);
  
  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'financeiro': return <DollarSign size={16} />;
      case 'operacional': return <Clock size={16} />;
      case 'marketing': return <TrendingUp size={16} />;
      case 'vendas': return <ShoppingCart size={16} />;
      case 'rh': return <Users size={16} />;
      default: return <BarChart3 size={16} />;
    }
  };
  
  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'financeiro': return 'text-[#28A745]';
      case 'operacional': return 'text-[#0A74DA]';
      case 'marketing': return 'text-[#FFA500]';
      case 'vendas': return 'text-[#B8860B]';
      case 'rh': return 'text-[#8B5CF6]';
      default: return 'text-gray-500';
    }
  };
  
  const getAlertColor = (tipo: string) => {
    switch (tipo) {
      case 'success': return 'text-[#28A745] bg-[#28A745]/10';
      case 'warning': return 'text-[#FFA500] bg-[#FFA500]/10';
      case 'danger': return 'text-[#EF4444] bg-[#EF4444]/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };
  
  const getTrendIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'up': return <ArrowUp size={16} className="text-[#28A745]" />;
      case 'down': return <ArrowDown size={16} className="text-[#EF4444]" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title flex items-center space-x-3">
          <BarChart3 className="text-[#0A74DA]" size={24} />
          <span>📈 Monitoramento de KPIs</span>
        </h3>
        
        <div className="flex space-x-3">
          <button className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2">
            <Bell size={18} />
            <span>Configurar Alertas</span>
          </button>
          <button className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2">
            <Plus size={18} />
            <span>Adicionar KPI</span>
          </button>
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('todos')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeCategory === 'todos' 
              ? 'bg-[#0A74DA] text-white' 
              : 'bg-white/10 text-[#003B6D] hover:bg-white/20'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveCategory('financeiro')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            activeCategory === 'financeiro' 
              ? 'bg-[#28A745] text-white' 
              : 'bg-white/10 text-[#003B6D] hover:bg-white/20'
          }`}
        >
          <DollarSign size={16} />
          <span>Financeiro</span>
        </button>
        <button
          onClick={() => setActiveCategory('operacional')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            activeCategory === 'operacional' 
              ? 'bg-[#0A74DA] text-white' 
              : 'bg-white/10 text-[#003B6D] hover:bg-white/20'
          }`}
        >
          <Clock size={16} />
          <span>Operacional</span>
        </button>
        <button
          onClick={() => setActiveCategory('marketing')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            activeCategory === 'marketing' 
              ? 'bg-[#FFA500] text-white' 
              : 'bg-white/10 text-[#003B6D] hover:bg-white/20'
          }`}
        >
          <TrendingUp size={16} />
          <span>Marketing</span>
        </button>
        <button
          onClick={() => setActiveCategory('vendas')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            activeCategory === 'vendas' 
              ? 'bg-[#B8860B] text-white' 
              : 'bg-white/10 text-[#003B6D] hover:bg-white/20'
          }`}
        >
          <ShoppingCart size={16} />
          <span>Vendas</span>
        </button>
        <button
          onClick={() => setActiveCategory('rh')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            activeCategory === 'rh' 
              ? 'bg-[#8B5CF6] text-white' 
              : 'bg-white/10 text-[#003B6D] hover:bg-white/20'
          }`}
        >
          <Users size={16} />
          <span>RH</span>
        </button>
      </div>
      
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKPIs.map(kpi => (
          <div key={kpi.id} className="glass-card p-6 hover:transform hover:scale-102 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${getCategoryColor(kpi.categoria)} bg-white/10`}>
                  {getCategoryIcon(kpi.categoria)}
                </div>
                <div>
                  <h4 className="font-bold text-[#003B6D]">{kpi.nome}</h4>
                  <p className="text-gray-600 text-xs">{kpi.periodo}</p>
                </div>
              </div>
              
              <button className="text-gray-400 hover:text-[#0A74DA] transition-colors">
                <Settings size={16} />
              </button>
            </div>
            
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-[#003B6D]">{kpi.valor}</p>
                <p className="text-sm text-gray-600">Meta: {kpi.meta}</p>
              </div>
              
              <div className="flex items-center space-x-1">
                {getTrendIcon(kpi.tendencia)}
                <span className={`font-medium ${
                  (kpi.tendencia === 'up' && kpi.categoria !== 'marketing' && kpi.nome !== 'CAC' && !kpi.nome.includes('Tempo') && !kpi.nome.includes('Rotatividade')) || 
                  (kpi.tendencia === 'down' && (kpi.categoria === 'marketing' || kpi.nome === 'CAC' || kpi.nome.includes('Tempo') || kpi.nome.includes('Rotatividade')))
                    ? 'text-[#28A745]' 
                    : (kpi.tendencia === 'down' && kpi.categoria !== 'marketing' && kpi.nome !== 'CAC' && !kpi.nome.includes('Tempo') && !kpi.nome.includes('Rotatividade')) || 
                      (kpi.tendencia === 'up' && (kpi.categoria === 'marketing' || kpi.nome === 'CAC' || kpi.nome.includes('Tempo') || kpi.nome.includes('Rotatividade')))
                      ? 'text-[#EF4444]'
                      : 'text-gray-600'
                }`}>
                  {kpi.variacao}
                </span>
              </div>
            </div>
            
            {kpi.alerta && (
              <div className={`p-2 rounded-lg ${getAlertColor(kpi.alerta.tipo)} text-sm`}>
                {kpi.alerta.mensagem}
              </div>
            )}
            
            {/* Placeholder for chart - in a real app, this would be a real chart */}
            <div className="mt-4 h-16 bg-white/10 rounded-lg overflow-hidden">
              <div className="h-full w-full flex items-end">
                <div className="h-30% w-1/7 bg-[#0A74DA]/20"></div>
                <div className="h-45% w-1/7 bg-[#0A74DA]/30"></div>
                <div className="h-60% w-1/7 bg-[#0A74DA]/40"></div>
                <div className="h-40% w-1/7 bg-[#0A74DA]/50"></div>
                <div className="h-70% w-1/7 bg-[#0A74DA]/60"></div>
                <div className="h-80% w-1/7 bg-[#0A74DA]/70"></div>
                <div className="h-90% w-1/7 bg-[#0A74DA]/80"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredKPIs.length === 0 && (
        <div className="glass-card p-12 text-center">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-[#003B6D] mb-2">Nenhum KPI encontrado</h3>
          <p className="text-gray-600 mb-6">Não há KPIs na categoria selecionada</p>
          <button 
            onClick={() => setActiveCategory('todos')}
            className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Ver Todos os KPIs
          </button>
        </div>
      )}
      
      {/* Insights Section */}
      <div className="glass-card p-6 border-[#0A74DA]/30 bg-[#0A74DA]/5">
        <h4 className="font-bold text-[#003B6D] mb-4 flex items-center space-x-2">
          <Zap size={20} className="text-[#0A74DA]" />
          <span>💡 Insights Automáticos</span>
        </h4>
        
        <div className="space-y-4">
          <div className="glass-card-subtle p-4">
            <h5 className="font-semibold text-[#003B6D] mb-2">Tendências Principais</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-[#28A745] mt-1">•</span>
                <span>A receita mensal está consistentemente acima da meta nos últimos 3 meses, indicando forte crescimento.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#28A745] mt-1">•</span>
                <span>O CAC reduziu 15% em relação ao mês anterior, melhorando a eficiência de aquisição.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#EF4444] mt-1">•</span>
                <span>O tempo médio de resposta aumentou, sugerindo possíveis gargalos operacionais.</span>
              </li>
            </ul>
          </div>
          
          <div className="glass-card-subtle p-4">
            <h5 className="font-semibold text-[#003B6D] mb-2">Recomendações da IA</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-[#0A74DA] mt-1">→</span>
                <span>Investigar causas do aumento no tempo de resposta e implementar melhorias no processo.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#0A74DA] mt-1">→</span>
                <span>Documentar e replicar estratégias de marketing que reduziram o CAC.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#0A74DA] mt-1">→</span>
                <span>Considerar expansão de capacidade para sustentar o crescimento de receita.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}