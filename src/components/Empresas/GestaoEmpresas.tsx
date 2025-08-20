import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search, Filter, Eye, Edit, Trash2, AlertTriangle, TrendingUp, DollarSign, BarChart3, Calendar, Clock } from 'lucide-react';
import { useCompanies } from '@/hooks/useSupabase';
import { CompanyService } from '@/services/companyService';

export default function GestaoEmpresas() {
  const navigate = useNavigate();
  const { companies, loading, refetch } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetor, setSelectedSetor] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const setorOptions = ['Tecnologia', 'Varejo', 'Indústria', 'Serviços', 'Saúde', 'Educação', 'Financeiro', 'Agronegócio', 'Construção'];

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSetor = selectedSetor === 'todos' || company.setor === selectedSetor;
    const matchesStatus = selectedStatus === 'todos' || company.status === selectedStatus;
    return matchesSearch && matchesSetor && matchesStatus;
  });

  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    const confirmed = window.confirm(
      `⚠️ ATENÇÃO: Esta ação é irreversível!\n\n` +
      `Tem certeza que deseja excluir "${companyName}"?\n\n` +
      `Todos os dados serão perdidos:\n` +
      `• Informações da empresa\n` +
      `• Stakeholders cadastrados\n` +
      `• Histórico de interações\n` +
      `• Configurações de IA\n\n` +
      `Digite "EXCLUIR" para confirmar:`
    );

    if (!confirmed) return;

    // Segunda confirmação mais rigorosa
    const finalConfirmation = window.prompt(
      `🚨 CONFIRMAÇÃO FINAL\n\n` +
      `Para excluir "${companyName}" permanentemente, digite: EXCLUIR`
    );

    if (finalConfirmation !== 'EXCLUIR') {
      alert('❌ Exclusão cancelada. Texto de confirmação incorreto.');
      return;
    }

    try {
      setDeletingId(companyId);
      
      await CompanyService.delete(companyId);
      
      alert(`✅ Cliente "${companyName}" excluído com sucesso!`);
      
      // Recarregar lista
      await refetch();
      
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      alert(`❌ Erro ao excluir cliente: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-[#28A745]';
      case 'pausado': return 'bg-[#FFA500]';
      case 'concluido': return 'bg-[#0A74DA]';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'pausado': return 'Pausado';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  const getAvatarForSetor = (setor: string): string => {
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
  };

  const getNecessidadeIcon = (necessidade: string) => {
    const icons: Record<string, string> = {
      contratos: "📝",
      reunioes: "📅",
      chat: "💬",
      analises: "📊",
      relatorios: "📋",
      kpis: "📈"
    };
    return icons[necessidade] || "📋";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-[#0A74DA] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-xl shadow-lg">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="page-title">🏢 Clientes</h1>
              <p className="text-gray-600">Gerencie seu portfólio de clientes com visão estratégica</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/empresas/nova')}
            className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Cadastrar Cliente</span>
          </button>
        </div>

        {/* Estatísticas do Portfólio */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#0A74DA] mb-1">{companies.length}</div>
            <div className="text-sm text-gray-600">Total de Clientes</div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#28A745] mb-1">{companies.filter(c => c.status === 'ativo').length}</div>
            <div className="text-sm text-gray-600">Ativos</div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#FFA500] mb-1">{companies.filter(c => c.status === 'pausado').length}</div>
            <div className="text-sm text-gray-600">Pausados</div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#B8860B] mb-1">{companies.filter(c => c.status === 'concluido').length}</div>
            <div className="text-sm text-gray-600">Concluídos</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-10 pr-4 py-3 w-full text-[#003B6D] rounded-xl"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-600" />
              <select
                value={selectedSetor}
                onChange={(e) => setSelectedSetor(e.target.value)}
                className="glass-input px-3 py-2 text-[#003B6D] rounded-lg"
              >
                <option value="todos">Todos Setores</option>
                {setorOptions.map(setor => (
                  <option key={setor} value={setor}>{setor}</option>
                ))}
              </select>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="glass-input px-3 py-2 text-[#003B6D] rounded-lg"
            >
              <option value="todos">Todos Status</option>
              <option value="ativo">Ativo</option>
              <option value="pausado">Pausado</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="glass-card p-6 hover:transform hover:scale-102 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{getAvatarForSetor(company.setor)}</div>
                <div>
                  <h3 className="font-bold text-[#003B6D] text-lg">{company.nome}</h3>
                  <p className="text-gray-600 text-sm">{company.setor}</p>
                  <p className="text-gray-500 text-xs">{company.tamanho}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(company.status)}`}></div>
                <span className="text-xs font-medium">{getStatusLabel(company.status)}</span>
              </div>
            </div>

            {/* Informações do Cliente */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Faturamento</p>
                <p className="font-semibold text-[#003B6D] text-sm">{company.faturamento}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Progresso</p>
                <p className="font-semibold text-[#003B6D] text-sm">{company.progresso}%</p>
              </div>
            </div>

            {/* Necessidades */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Funcionalidades Ativas:</p>
              <div className="flex flex-wrap gap-1">
                {company.necessidades.slice(0, 6).map((necessidade) => (
                  <span
                    key={necessidade}
                    className="text-lg"
                    title={necessidade}
                  >
                    {getNecessidadeIcon(necessidade)}
                  </span>
                ))}
                {company.necessidades.length > 6 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    +{company.necessidades.length - 6}
                  </span>
                )}
              </div>
            </div>

            {/* Data de Atualização */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Clock size={12} />
              <span>Última atualização: {new Date(company.updated_at).toLocaleDateString('pt-BR')}</span>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/empresas/${company.id}`)}
                className="flex-1 px-3 py-2 bg-white/10 text-[#003B6D] rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center justify-center space-x-1"
              >
                <Eye size={14} />
                <span>Ver Detalhes</span>
              </button>
              
              <button
                onClick={() => navigate(`/empresas/${company.id}/edit`)}
                className="flex-1 px-3 py-2 glass-button text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center justify-center space-x-1"
              >
                <Edit size={14} />
                <span>Editar</span>
              </button>
              
              <button
                onClick={() => handleDeleteCompany(company.id, company.nome)}
                disabled={deletingId === company.id}
                className={`px-3 py-2 rounded-lg transition-all text-sm flex items-center justify-center ${
                  deletingId === company.id
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#EF4444] text-white hover:bg-[#EF4444]/80 hover:shadow-lg'
                }`}
                title="Excluir cliente"
              >
                {deletingId === company.id ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vazio */}
      {filteredCompanies.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-[#003B6D] mb-2">
            {companies.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {companies.length === 0 
              ? 'Comece cadastrando seu primeiro cliente para usar todas as funcionalidades do Aether AI.'
              : 'Nenhum cliente corresponde aos filtros selecionados.'
            }
          </p>
          {companies.length === 0 ? (
            <button
              onClick={() => navigate('/empresas/nova')}
              className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              + Cadastrar Primeiro Cliente
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSetor('todos');
                setSelectedStatus('todos');
              }}
              className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      )}

      {/* Legenda */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#003B6D]">Legenda:</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💬</span>
            <span>Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📊</span>
            <span>Análises</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span>Contratos</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>Reuniões</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span>Relatórios</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📈</span>
            <span>KPIs</span>
          </div>
        </div>
      </div>
    </div>
  );

  async function handleDeleteCompany(companyId: string, companyName: string) {
    const confirmed = window.confirm(
      `⚠️ ATENÇÃO: Esta ação é irreversível!\n\n` +
      `Tem certeza que deseja excluir "${companyName}"?\n\n` +
      `Todos os dados serão perdidos:\n` +
      `• Informações da empresa\n` +
      `• Stakeholders cadastrados\n` +
      `• Histórico de interações\n` +
      `• Configurações de IA\n\n` +
      `Clique OK para confirmar a exclusão.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(companyId);
      
      await CompanyService.delete(companyId);
      
      alert(`✅ Cliente "${companyName}" excluído com sucesso!`);
      
      // Recarregar lista
      await refetch();
      
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      alert(`❌ Erro ao excluir cliente: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setDeletingId(null);
    }
  }
}