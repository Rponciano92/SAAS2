import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Filter, Plus, Calendar, BarChart3, MessageSquare, Eye, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useCompanies } from '@/hooks/useSupabase';
import type { Database } from '@/lib/supabase';

type Company = Database['public']['Tables']['companies']['Row'];

interface Empresa {
  id: string;
  nome: string;
  setor: string;
  tamanho: string;
  faturamento: string;
  status: 'ativo' | 'pausado' | 'concluido';
  proximaReuniao?: string;
  ultimaInteracao: string;
  necessidades: string[];
  progresso: number;
  stakeholders: number;
  avatar: string;
}

const mockEmpresas: Empresa[] = [
  {
    id: '1',
    nome: 'TechStart Inovação',
    setor: 'Tecnologia',
    tamanho: 'Startup',
    faturamento: 'R$ 2-5 milhões',
    status: 'ativo',
    proximaReuniao: '2025-01-20 14:00',
    ultimaInteracao: '2025-01-15',
    necessidades: ['chat', 'analises', 'relatorios'],
    progresso: 75,
    stakeholders: 3,
    avatar: '🚀'
  },
  {
    id: '2',
    nome: 'RetailMax Varejo',
    setor: 'Varejo',
    tamanho: 'Média',
    faturamento: 'R$ 20-100 milhões',
    status: 'ativo',
    proximaReuniao: '2025-01-22 10:00',
    ultimaInteracao: '2025-01-14',
    necessidades: ['kpis', 'relatorios', 'reunioes'],
    progresso: 60,
    stakeholders: 5,
    avatar: '🛍️'
  },
  {
    id: '3',
    nome: 'InnovaCorp Solutions',
    setor: 'Serviços',
    tamanho: 'Grande',
    faturamento: 'Acima de R$ 100 milhões',
    status: 'pausado',
    ultimaInteracao: '2025-01-10',
    necessidades: ['contratos', 'analises', 'chat'],
    progresso: 45,
    stakeholders: 8,
    avatar: '🔧'
  },
  {
    id: '4',
    nome: 'FinTech Solutions',
    setor: 'Financeiro',
    tamanho: 'Pequena',
    faturamento: 'R$ 5-20 milhões',
    status: 'ativo',
    proximaReuniao: '2025-01-25 16:00',
    ultimaInteracao: '2025-01-13',
    necessidades: ['analises', 'kpis', 'relatorios'],
    progresso: 85,
    stakeholders: 4,
    avatar: '💰'
  },
  {
    id: '5',
    nome: 'HealthCare Plus',
    setor: 'Saúde',
    tamanho: 'Média',
    faturamento: 'R$ 20-100 milhões',
    status: 'concluido',
    ultimaInteracao: '2024-12-20',
    necessidades: ['reunioes', 'relatorios', 'chat'],
    progresso: 100,
    stakeholders: 6,
    avatar: '🏥'
  }
];

const setores = ['Todos', 'Tecnologia', 'Varejo', 'Serviços', 'Financeiro', 'Saúde', 'Indústria', 'Educação'];
const tamanhos = ['Todos', 'Startup', 'Pequena', 'Média', 'Grande'];
const statusOptions = ['Todos', 'ativo', 'pausado', 'concluido'];

const mockPortfolioStats = {
  totalEmpresas: 12,
  receitaMensal: "R$ 145k",
  crescimento: "+34%",
  setores: {
    tecnologia: 4,
    varejo: 3,
    industria: 2
  }
};

export default function GestaoEmpresas() {
  const { companies, loading, error } = useCompanies();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroSetor, setFiltroSetor] = useState('Todos');
  const [filtroTamanho, setFiltroTamanho] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Convert Supabase companies to the expected format
  const empresas: Empresa[] = companies.map(company => ({
    id: company.id,
    nome: company.nome,
    setor: company.setor,
    tamanho: company.tamanho,
    faturamento: company.faturamento,
    status: company.status as 'ativo' | 'pausado' | 'concluido',
    proximaReuniao: undefined, // This would come from a meetings table
    ultimaInteracao: company.updated_at,
    valorContrato: undefined, // This would come from a contracts table
    necessidades: company.necessidades,
    progresso: company.progresso,
    stakeholders: 0, // This would be calculated from stakeholders table
    avatar: getAvatarForSetor(company.setor)
  }));

  const empresasFiltradas = empresas.filter(empresa => {
    const matchSearch = empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       empresa.setor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSetor = filtroSetor === 'Todos' || empresa.setor === filtroSetor;
    const matchTamanho = filtroTamanho === 'Todos' || empresa.tamanho === filtroTamanho;
    const matchStatus = filtroStatus === 'Todos' || empresa.status === filtroStatus;
    
    return matchSearch && matchSetor && matchTamanho && matchStatus;
  });

  function getAvatarForSetor(setor: string): string {
    const avatars: Record<string, string> = {
      'Tecnologia': '🚀',
      'Varejo': '🛍️',
      'Indústria': '🔧',
      'Serviços': '⚙️',
      'Saúde': '🏥',
      'Educação': '🎓',
      'Financeiro': '💰',
      'Agronegócio': '🌾',
      'Construção': '🏗️'
    };
    return avatars[setor] || '🏢';
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-[#28A745] bg-[#28A745]/10';
      case 'pausado': return 'text-[#FFA500] bg-[#FFA500]/10';
      case 'concluido': return 'text-[#0A74DA] bg-[#0A74DA]/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo': return '🟢 Ativo';
      case 'pausado': return '🟡 Pausado';
      case 'concluido': return '🔵 Concluído';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="glass-card-strong p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <Building2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="card-title mb-2 text-red-600">Erro ao carregar empresas</h3>
            <p className="body-text text-red-500 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderEmpresaCard = (empresa: Empresa) => (
    <div 
      key={empresa.id} 
      className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/empresas/${empresa.id}/dashboard`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{empresa.avatar}</div>
          <div>
            <h3 className="font-bold text-[#003B6D] text-lg">{empresa.nome}</h3>
            <p className="text-gray-600 text-sm">{empresa.setor} • {empresa.tamanho}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(empresa.status)}`}>
          {getStatusLabel(empresa.status)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">💰 Faturamento:</span>
          <span className="font-medium text-[#003B6D]">{empresa.faturamento}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">👥 Stakeholders:</span>
          <span className="font-medium text-[#003B6D]">{empresa.stakeholders}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progresso do Projeto</span>
          <span className="font-medium text-[#003B6D]">{empresa.progresso}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#0A74DA] to-[#28A745] h-2 rounded-full transition-all duration-500"
            style={{ width: `${empresa.progresso}%` }}
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-2">Funcionalidades Ativas:</p>
        <div className="flex flex-wrap gap-1">
          {empresa.necessidades.slice(0, 3).map(necessidade => (
            <span key={necessidade} className="px-2 py-1 bg-[#0A74DA]/10 text-[#0A74DA] rounded text-xs">
              {necessidade}
            </span>
          ))}
          {empresa.necessidades.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{empresa.necessidades.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/20">
        <div className="text-xs text-gray-500">
          <Clock size={12} className="inline mr-1" />
          {empresa.proximaReuniao ? `Próxima: ${new Date(empresa.proximaReuniao).toLocaleDateString()}` : `Última: ${new Date(empresa.ultimaInteracao).toLocaleDateString()}`}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate(`/empresas/${empresa.id}`)}
            className="p-2 hover:bg-[#0A74DA]/10 rounded-lg transition-colors" 
            title="Ver Detalhes"
          >
            <Eye size={16} className="text-[#0A74DA]" />
          </button>
          <button className="p-2 hover:bg-[#28A745]/10 rounded-lg transition-colors" title="Agendar Reunião">
            <Calendar size={16} className="text-[#28A745]" />
          </button>
          <button className="p-2 hover:bg-[#FFA500]/10 rounded-lg transition-colors" title="Gerar Análise">
            <BarChart3 size={16} className="text-[#FFA500]" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmpresaList = (empresa: Empresa) => (
    <div key={empresa.id} className="glass-card p-4 hover:bg-white/15 transition-all cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl">{empresa.avatar}</div>
          <div>
            <h3 className="font-bold text-[#003B6D]">{empresa.nome}</h3>
            <p className="text-gray-600 text-sm">{empresa.setor} • {empresa.tamanho}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-xs text-gray-600">Progresso</p>
            <div className="text-2xl font-bold text-[#0A74DA] mb-1">{empresas.length}</div>
            <p className="font-medium text-[#003B6D]">{empresa.progresso}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(empresa.status)}`}>
              {getStatusLabel(empresa.status)}
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              className="p-2 hover:bg-[#0A74DA]/10 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/empresas/${empresa.id}`);
              }}
            >
              <Eye size={16} className="text-[#0A74DA]" />
            </button>
            <button 
              className="p-2 hover:bg-[#28A745]/10 rounded-lg transition-colors" 
              title="Agendar Reunião"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar size={16} className="text-[#28A745]" />
            </button>
            <button 
              className="p-2 hover:bg-[#FFA500]/10 rounded-lg transition-colors" 
              title="Gerar Análise"
              onClick={(e) => e.stopPropagation()}
            >
              <BarChart3 size={16} className="text-[#FFA500]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="glass-card-strong">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-xl shadow-lg">
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="page-title">Clientes</h1>
                <p className="body-text">Gerencie seu portfólio de clientes com visão estratégica e insights de IA.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="cta"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'cadastrar-empresa' }))}
              >
                <Plus size={20} />
                <span>Novo Cliente</span>
              </Button>
              
              <Button variant="glass">
                Relatório Geral
              </Button>
            </div>
          </div>

          {/* Estatísticas do Portfólio */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-azul-escuro" />
              <div>
                <p className="text-2xl font-bold text-azul-escuro">
                  {mockPortfolioStats.totalEmpresas}
                </p>
                <p className="caption-text">Clientes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-verde-sucesso" />
              <div>
                <p className="text-2xl font-bold text-azul-escuro">
                  {mockPortfolioStats.receitaMensal}
                </p>
                <p className="caption-text">Receita/mês</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-dourado-premium" />
              <div>
                <p className="text-2xl font-bold text-azul-escuro">
                  {mockPortfolioStats.crescimento}
                </p>
                <p className="caption-text">Crescimento</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-laranja-cta" />
              <div>
                <button 
                  onClick={() => navigate(`/empresas/${empresas[0]?.id}/dashboard`)}
                  className="p-2 hover:bg-[#28A745]/10 rounded-lg transition-colors" 
                  title="Dashboard Cliente"
                >
                  <BarChart3 size={16} className="text-[#28A745]" />
                </button>
                <div className="flex gap-2 text-sm">
                  <span>💻 {mockPortfolioStats.setores.tecnologia}</span>
                  <span>🛒 {mockPortfolioStats.setores.varejo}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-600" />
                <select
                  value={filtroSetor}
                  onChange={(e) => setFiltroSetor(e.target.value)}
                  className="glass-input px-3 py-2 text-sm"
                >
                  {setores.map(setor => (
                    <option key={setor} value={setor}>{setor}</option>
                  ))}
                </select>
                
                <select
                  value={filtroTamanho}
                  onChange={(e) => setFiltroTamanho(e.target.value)}
                  className="glass-input px-3 py-2 text-sm"
                >
                  {tamanhos.map(tamanho => (
                    <option key={tamanho} value={tamanho}>{tamanho}</option>
                  ))}
                </select>
                
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="glass-input px-3 py-2 text-sm"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#0A74DA] text-white' : 'text-[#003B6D] hover:bg-white/20'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#0A74DA] text-white' : 'text-[#003B6D] hover:bg-white/20'
                }`}
              >
                <div className="w-4 h-4 flex flex-col space-y-1">
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Empresas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="section-title">
            📊 Clientes ({empresasFiltradas.length})
          </h3>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {empresasFiltradas.map(renderEmpresaCard)}
          </div>
        ) : (
          <div className="space-y-3">
            {empresasFiltradas.map(renderEmpresaList)}
          </div>
        )}

        {empresasFiltradas.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="w-16 h-16 text-cinza-medio mx-auto mb-4" />
              <h3 className="card-title mb-2">Nenhum cliente encontrado</h3>
              <p className="body-text text-cinza-medio mb-6">
                Nenhum cliente corresponde aos filtros selecionados.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFiltroSetor("Todos");
                  setFiltroTamanho("Todos");
                  setFiltroStatus("Todos");
                }}
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}