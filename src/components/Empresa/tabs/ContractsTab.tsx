import React, { useState } from 'react';
import { EmpresaDetalhes } from '@/types/company';
import { FileText, Plus, Download, Eye, Clock, CheckCircle, XCircle, Filter, Search, Calendar } from 'lucide-react';

interface Contract {
  id: string;
  titulo: string;
  tipo: string;
  status: 'ativo' | 'pendente' | 'finalizado';
  dataInicio: string;
  dataFim: string;
  valor: string;
  assinaturas: {
    empresa: boolean;
    cliente: boolean;
  };
}

interface ContractsTabProps {
  company: EmpresaDetalhes;
}

export default function ContractsTab({ company }: ContractsTabProps) {
  const [activeView, setActiveView] = useState<'lista' | 'novo'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  
  // Mock contracts data
  const mockContracts: Contract[] = [
    {
      id: '1',
      titulo: 'Consultoria Estratégica',
      tipo: 'Serviço Contínuo',
      status: 'ativo',
      dataInicio: '2025-01-01',
      dataFim: '2025-12-31',
      valor: 'R$ 25.000/mês',
      assinaturas: {
        empresa: true,
        cliente: true
      }
    },
    {
      id: '2',
      titulo: 'Análise de Mercado Q1',
      tipo: 'Projeto Pontual',
      status: 'pendente',
      dataInicio: '2025-02-01',
      dataFim: '2025-03-31',
      valor: 'R$ 45.000',
      assinaturas: {
        empresa: true,
        cliente: false
      }
    },
    {
      id: '3',
      titulo: 'Implementação de CRM',
      tipo: 'Projeto Pontual',
      status: 'finalizado',
      dataInicio: '2024-10-01',
      dataFim: '2024-12-31',
      valor: 'R$ 75.000',
      assinaturas: {
        empresa: true,
        cliente: true
      }
    }
  ];
  
  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = contract.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || contract.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-[#28A745] bg-[#28A745]/10';
      case 'pendente': return 'text-[#FFA500] bg-[#FFA500]/10';
      case 'finalizado': return 'text-[#0A74DA] bg-[#0A74DA]/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return <CheckCircle size={16} className="text-[#28A745]" />;
      case 'pendente': return <Clock size={16} className="text-[#FFA500]" />;
      case 'finalizado': return <CheckCircle size={16} className="text-[#0A74DA]" />;
      default: return null;
    }
  };
  
  // Form state for new contract
  const [newContract, setNewContract] = useState({
    titulo: '',
    tipo: 'Serviço Contínuo',
    dataInicio: '',
    dataFim: '',
    valor: '',
    descricao: ''
  });
  
  const handleInputChange = (field: string, value: string) => {
    setNewContract(prev => ({ ...prev, [field]: value }));
  };
  
  const handleGenerateContract = () => {
    // In a real app, this would call the AI API to generate the contract
    alert('Contrato gerado com sucesso! Em um ambiente real, a IA geraria o contrato baseado nos parâmetros fornecidos.');
    setActiveView('lista');
  };

  return (
    <div className="space-y-6">
      {activeView === 'lista' ? (
        <>
          {/* Header with actions */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title flex items-center space-x-3">
              <FileText className="text-[#0A74DA]" size={24} />
              <span>📄 Contratos</span>
            </h3>
            
            <button
              onClick={() => setActiveView('novo')}
              className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Novo Contrato com IA</span>
            </button>
          </div>
          
          {/* Filters */}
          <div className="glass-card p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar contratos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-10 pr-4 py-2 w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="glass-input px-3 py-2"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativos</option>
                  <option value="pendente">Pendentes</option>
                  <option value="finalizado">Finalizados</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Contracts List */}
          <div className="space-y-4">
            {filteredContracts.map(contract => (
              <div key={contract.id} className="glass-card p-6 hover:transform hover:scale-102 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-[#003B6D] text-lg flex items-center space-x-2">
                      <span>{contract.titulo}</span>
                      {getStatusIcon(contract.status)}
                    </h4>
                    <p className="text-gray-600 text-sm">{contract.tipo}</p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Período</p>
                    <p className="text-sm font-medium text-[#003B6D]">
                      {new Date(contract.dataInicio).toLocaleDateString()} a {new Date(contract.dataFim).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Valor</p>
                    <p className="text-sm font-medium text-[#003B6D]">{contract.valor}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500">Assinaturas</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`flex items-center ${contract.assinaturas.empresa ? 'text-[#28A745]' : 'text-gray-400'}`}>
                        {contract.assinaturas.empresa ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                        Empresa
                      </span>
                      <span className={`flex items-center ${contract.assinaturas.cliente ? 'text-[#28A745]' : 'text-gray-400'}`}>
                        {contract.assinaturas.cliente ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                        Cliente
                      </span>
                    </div>
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
            
            {filteredContracts.length === 0 && (
              <div className="glass-card p-12 text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-[#003B6D] mb-2">Nenhum contrato encontrado</h3>
                <p className="text-gray-600 mb-6">Tente ajustar os filtros ou crie um novo contrato</p>
                <button 
                  onClick={() => setActiveView('novo')}
                  className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  + Novo Contrato
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* New Contract Form */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title flex items-center space-x-3">
              <Plus className="text-[#28A745]" size={24} />
              <span>📄 Novo Contrato com IA</span>
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
              Preencha os dados básicos abaixo e nossa IA gerará automaticamente um contrato personalizado para {company.nome}, 
              considerando o setor de atuação e as especificidades da empresa.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Título do Contrato *
                </label>
                <input
                  type="text"
                  value={newContract.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  placeholder="Ex: Consultoria Estratégica"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Tipo de Contrato *
                </label>
                <select
                  value={newContract.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                >
                  <option value="Serviço Contínuo">Serviço Contínuo</option>
                  <option value="Projeto Pontual">Projeto Pontual</option>
                  <option value="Assinatura">Assinatura</option>
                  <option value="Parceria">Parceria</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Data de Início *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={newContract.dataInicio}
                    onChange={(e) => handleInputChange('dataInicio', e.target.value)}
                    className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Data de Término *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={newContract.dataFim}
                    onChange={(e) => handleInputChange('dataFim', e.target.value)}
                    className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Valor *
                </label>
                <input
                  type="text"
                  value={newContract.valor}
                  onChange={(e) => handleInputChange('valor', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  placeholder="Ex: R$ 25.000/mês ou R$ 75.000"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                Descrição do Serviço *
              </label>
              <textarea
                value={newContract.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
                rows={4}
                placeholder="Descreva o escopo do serviço, entregáveis, prazos e quaisquer condições especiais..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleGenerateContract}
                className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <FileText size={18} />
                <span>Gerar Contrato com IA</span>
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6 border-[#0A74DA]/30 bg-[#0A74DA]/5">
            <h4 className="font-bold text-[#003B6D] mb-4">💡 Como funciona a geração de contratos com IA</h4>
            <div className="space-y-4 text-sm">
              <p>
                <strong>1. Preencha os dados básicos:</strong> Forneça as informações essenciais como título, tipo, datas e valor.
              </p>
              <p>
                <strong>2. IA personalizada:</strong> Nossa IA analisa o perfil da {company.nome} e adapta o contrato ao setor {company.setor}.
              </p>
              <p>
                <strong>3. Geração inteligente:</strong> O sistema cria automaticamente cláusulas relevantes e personalizadas.
              </p>
              <p>
                <strong>4. Revisão humana:</strong> Você pode revisar e editar o contrato antes de finalizar.
              </p>
              <p>
                <strong>5. Assinatura digital:</strong> Envie para assinatura com apenas um clique.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}