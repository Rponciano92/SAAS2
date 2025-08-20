import React, { useState } from 'react';
import { EmpresaDetalhes } from '@/types/company';
import { FileText, Plus, Download, Eye, Calendar, BarChart3, Filter, Search, ArrowUp, ArrowDown, Clock } from 'lucide-react';

interface Report {
  id: string;
  titulo: string;
  tipo: 'financeiro' | 'operacional' | 'estrategico' | 'mercado';
  dataCriacao: string;
  autor: string;
  tamanho: string;
  formato: 'pdf' | 'xlsx' | 'pptx';
  visualizacoes: number;
  insights?: string[];
}

interface ReportsTabProps {
  company: EmpresaDetalhes;
}

export default function ReportsTab({ company }: ReportsTabProps) {
  const [activeView, setActiveView] = useState<'lista' | 'novo'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [sortBy, setSortBy] = useState<'data' | 'visualizacoes'>('data');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Mock reports data
  const mockReports: Report[] = [
    {
      id: '1',
      titulo: 'Análise Financeira Q4 2024',
      tipo: 'financeiro',
      dataCriacao: '2025-01-10',
      autor: 'IA Aether',
      tamanho: '2.4 MB',
      formato: 'pdf',
      visualizacoes: 15,
      insights: [
        'Crescimento de receita de 23% em relação ao Q3',
        'Redução de custos operacionais em 12%',
        'Aumento da margem de lucro para 32%'
      ]
    },
    {
      id: '2',
      titulo: 'Análise de Mercado - Setor Tech',
      tipo: 'mercado',
      dataCriacao: '2025-01-05',
      autor: 'IA Aether',
      tamanho: '3.8 MB',
      formato: 'pptx',
      visualizacoes: 27,
      insights: [
        'Crescimento do setor de 18% ao ano',
        'Principais concorrentes expandindo para novos mercados',
        'Oportunidade de diferenciação em soluções de IA'
      ]
    },
    {
      id: '3',
      titulo: 'Planejamento Estratégico 2025',
      tipo: 'estrategico',
      dataCriacao: '2024-12-20',
      autor: 'IA Aether + João Silva',
      tamanho: '5.2 MB',
      formato: 'pdf',
      visualizacoes: 42,
      insights: [
        'Foco em expansão internacional para América Latina',
        'Desenvolvimento de 3 novos produtos até Q3',
        'Investimento em marketing digital para aumentar base de clientes'
      ]
    },
    {
      id: '4',
      titulo: 'Eficiência Operacional - Análise',
      tipo: 'operacional',
      dataCriacao: '2024-12-15',
      autor: 'IA Aether',
      tamanho: '1.8 MB',
      formato: 'xlsx',
      visualizacoes: 18,
      insights: [
        'Gargalos identificados no processo de onboarding',
        'Oportunidade de automação em 5 processos-chave',
        'Economia potencial de 120 horas/mês'
      ]
    }
  ];
  
  // Sort and filter reports
  const sortedAndFilteredReports = [...mockReports]
    .filter(report => {
      const matchesSearch = report.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = filterTipo === 'todos' || report.tipo === filterTipo;
      return matchesSearch && matchesTipo;
    })
    .sort((a, b) => {
      if (sortBy === 'data') {
        return sortOrder === 'asc' 
          ? new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime()
          : new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.visualizacoes - b.visualizacoes
          : b.visualizacoes - a.visualizacoes;
      }
    });
  
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'financeiro': return 'text-[#28A745] bg-[#28A745]/10';
      case 'operacional': return 'text-[#0A74DA] bg-[#0A74DA]/10';
      case 'estrategico': return 'text-[#B8860B] bg-[#B8860B]/10';
      case 'mercado': return 'text-[#FFA500] bg-[#FFA500]/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };
  
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'financeiro': return '💰';
      case 'operacional': return '⚙️';
      case 'estrategico': return '🎯';
      case 'mercado': return '📈';
      default: return '📄';
    }
  };
  
  const getFormatoIcon = (formato: string) => {
    switch (formato) {
      case 'pdf': return '📕';
      case 'xlsx': return '📗';
      case 'pptx': return '📙';
      default: return '📄';
    }
  };
  
  // Form state for new report
  const [newReport, setNewReport] = useState({
    titulo: '',
    tipo: 'financeiro',
    periodo: '',
    metricas: [] as string[],
    formato: 'pdf'
  });
  
  const handleInputChange = (field: string, value: any) => {
    setNewReport(prev => ({ ...prev, [field]: value }));
  };
  
  const handleMetricaToggle = (metrica: string) => {
    setNewReport(prev => {
      const metricas = [...prev.metricas];
      if (metricas.includes(metrica)) {
        return { ...prev, metricas: metricas.filter(m => m !== metrica) };
      } else {
        return { ...prev, metricas: [...metricas, metrica] };
      }
    });
  };
  
  const handleGenerateReport = () => {
    // In a real app, this would call the AI API to generate the report
    alert('Relatório gerado com sucesso! Em um ambiente real, a IA geraria o relatório baseado nos parâmetros fornecidos.');
    setActiveView('lista');
  };
  
  // Available metrics based on report type
  const getAvailableMetrics = (tipo: string) => {
    switch (tipo) {
      case 'financeiro':
        return ['Receita', 'Despesas', 'Lucro', 'Fluxo de Caixa', 'ROI', 'Margem de Lucro', 'CAC', 'LTV'];
      case 'operacional':
        return ['Produtividade', 'Tempo de Ciclo', 'Taxa de Erro', 'Utilização de Recursos', 'Tempo de Resposta', 'SLA'];
      case 'estrategico':
        return ['Market Share', 'Crescimento', 'Posicionamento', 'Análise SWOT', 'Roadmap de Produto', 'Benchmarking'];
      case 'mercado':
        return ['Tamanho de Mercado', 'Tendências', 'Concorrentes', 'Comportamento do Cliente', 'Oportunidades', 'Ameaças'];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {activeView === 'lista' ? (
        <>
          {/* Header with actions */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title flex items-center space-x-3">
              <FileText className="text-[#0A74DA]" size={24} />
              <span>📊 Relatórios Executivos</span>
            </h3>
            
            <button
              onClick={() => setActiveView('novo')}
              className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Novo Relatório</span>
            </button>
          </div>
          
          {/* Filters and Sorting */}
          <div className="glass-card p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar relatórios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-10 pr-4 py-2 w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-600" />
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="glass-input px-3 py-2"
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="operacional">Operacional</option>
                  <option value="estrategico">Estratégico</option>
                  <option value="mercado">Mercado</option>
                </select>
                
                <button
                  onClick={() => {
                    if (sortBy === 'data') {
                      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('data');
                      setSortOrder('desc');
                    }
                  }}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                    sortBy === 'data' ? 'bg-[#0A74DA]/10 text-[#0A74DA]' : 'bg-white/10 text-gray-600 hover:bg-white/20'
                  }`}
                >
                  <Calendar size={14} />
                  <span>Data</span>
                  {sortBy === 'data' && (
                    sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
                
                <button
                  onClick={() => {
                    if (sortBy === 'visualizacoes') {
                      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('visualizacoes');
                      setSortOrder('desc');
                    }
                  }}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                    sortBy === 'visualizacoes' ? 'bg-[#0A74DA]/10 text-[#0A74DA]' : 'bg-white/10 text-gray-600 hover:bg-white/20'
                  }`}
                >
                  <Eye size={14} />
                  <span>Visualizações</span>
                  {sortBy === 'visualizacoes' && (
                    sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedAndFilteredReports.map(report => (
              <div key={report.id} className="glass-card p-6 hover:transform hover:scale-102 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getTipoIcon(report.tipo)}</div>
                    <div>
                      <h4 className="font-bold text-[#003B6D] text-lg">{report.titulo}</h4>
                      <p className="text-gray-600 text-sm">
                        {new Date(report.dataCriacao).toLocaleDateString()} • {report.autor}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(report.tipo)}`}>
                    {report.tipo.charAt(0).toUpperCase() + report.tipo.slice(1)}
                  </span>
                </div>
                
                {report.insights && report.insights.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-[#003B6D] mb-2">💡 Principais Insights</h5>
                    <ul className="space-y-1">
                      {report.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-[#28A745] mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <span className="text-lg">{getFormatoIcon(report.formato)}</span>
                      <span>{report.formato.toUpperCase()}</span>
                    </span>
                    <span>{report.tamanho}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span>{report.visualizacoes}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button className="px-3 py-1.5 bg-white/10 text-[#003B6D] rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center space-x-1">
                    <Eye size={14} />
                    <span>Visualizar</span>
                  </button>
                  <button className="px-3 py-1.5 bg-white/10 text-[#003B6D] rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center space-x-1">
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {sortedAndFilteredReports.length === 0 && (
            <div className="glass-card p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-[#003B6D] mb-2">Nenhum relatório encontrado</h3>
              <p className="text-gray-600 mb-6">Tente ajustar os filtros ou gere um novo relatório</p>
              <button 
                onClick={() => setActiveView('novo')}
                className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                + Novo Relatório
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* New Report Form */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title flex items-center space-x-3">
              <Plus className="text-[#28A745]" size={24} />
              <span>📊 Novo Relatório Executivo</span>
            </h3>
            
            <button
              onClick={() => setActiveView('lista')}
              className="px-4 py-2 bg-white/10 text-[#003B6D] rounded-xl hover:bg-white/20 transition-colors"
            >
              Voltar para Lista
            </button>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <p className="text-gray-600 mb-6">
              Gere um relatório executivo personalizado para {company.nome}. Nossa IA analisará os dados selecionados
              e criará um documento profissional com insights estratégicos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Título do Relatório *
                </label>
                <input
                  type="text"
                  value={newReport.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  placeholder="Ex: Análise Financeira Q1 2025"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Tipo de Relatório *
                </label>
                <select
                  value={newReport.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                >
                  <option value="financeiro">💰 Financeiro</option>
                  <option value="operacional">⚙️ Operacional</option>
                  <option value="estrategico">🎯 Estratégico</option>
                  <option value="mercado">📈 Mercado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Período de Análise *
                </label>
                <select
                  value={newReport.periodo}
                  onChange={(e) => handleInputChange('periodo', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                >
                  <option value="">Selecione um período</option>
                  <option value="ultimo_mes">Último Mês</option>
                  <option value="ultimo_trimestre">Último Trimestre</option>
                  <option value="ultimo_semestre">Último Semestre</option>
                  <option value="ultimo_ano">Último Ano</option>
                  <option value="personalizado">Período Personalizado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Formato de Saída *
                </label>
                <select
                  value={newReport.formato}
                  onChange={(e) => handleInputChange('formato', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                >
                  <option value="pdf">📕 PDF</option>
                  <option value="xlsx">📗 Excel</option>
                  <option value="pptx">📙 PowerPoint</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                Métricas e KPIs a Incluir *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getAvailableMetrics(newReport.tipo).map((metrica, index) => (
                  <div 
                    key={index}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${newReport.metricas.includes(metrica)
                        ? 'border-[#0A74DA] bg-[#0A74DA]/10'
                        : 'border-white/20 hover:border-[#0A74DA]/50'
                      }
                    `}
                    onClick={() => handleMetricaToggle(metrica)}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newReport.metricas.includes(metrica)}
                        onChange={() => {}}
                        className="rounded"
                      />
                      <span className="text-sm">{metrica}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleGenerateReport}
                className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <BarChart3 size={18} />
                <span>Gerar Relatório com IA</span>
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6 border-[#0A74DA]/30 bg-[#0A74DA]/5">
            <h4 className="font-bold text-[#003B6D] mb-4">💡 Recursos dos Relatórios Executivos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start space-x-3">
                <BarChart3 size={18} className="text-[#0A74DA] mt-1" />
                <div>
                  <p className="font-medium text-[#003B6D] mb-1">Visualizações Inteligentes</p>
                  <p className="text-gray-700">Gráficos e tabelas gerados automaticamente para facilitar a compreensão</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Zap size={18} className="text-[#0A74DA] mt-1" />
                <div>
                  <p className="font-medium text-[#003B6D] mb-1">Insights Estratégicos</p>
                  <p className="text-gray-700">Análises e recomendações baseadas em dados históricos e tendências</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Download size={18} className="text-[#0A74DA] mt-1" />
                <div>
                  <p className="font-medium text-[#003B6D] mb-1">Múltiplos Formatos</p>
                  <p className="text-gray-700">Exporte para PDF, Excel ou PowerPoint conforme sua necessidade</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-[#0A74DA] mt-1" />
                <div>
                  <p className="font-medium text-[#003B6D] mb-1">Agendamento Automático</p>
                  <p className="text-gray-700">Configure relatórios periódicos para serem gerados automaticamente</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}