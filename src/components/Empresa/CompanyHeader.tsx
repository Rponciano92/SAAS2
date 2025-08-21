import React from 'react';
import { EmpresaDetalhes } from '@/types/company';
import { Edit, Settings, Download, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompanyHeaderProps {
  company: EmpresaDetalhes;
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-[#28A745]';
      case 'pendente': return 'bg-[#FFA500]';
      case 'concluido': return 'bg-[#0A74DA]';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo': return 'Online';
      case 'pendente': return 'Pendente';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div className="glass-card-strong p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => navigate('/empresas')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[#003B6D]"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex items-center space-x-6">
          <div className="text-5xl">{company.avatar}</div>
          <div>
            <h1 className="page-title mb-1">{company.nome}</h1>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">{company.setor} • {company.tamanho}</p>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(company.status)}`}></div>
                <span className="text-sm font-medium">{getStatusLabel(company.status)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-auto flex space-x-3">
          <button className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2">
            <Edit size={18} />
            <span>Editar</span>
          </button>
          <button className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2">
            <Settings size={18} />
            <span>Configurar IA</span>
          </button>
          <button className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2">
            <Download size={18} />
            <span>Exportar Dados</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
        {company.roi && (
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#28A745] mb-1">{company.roi}</div>
            <div className="text-sm text-gray-600">ROI</div>
          </div>
        )}
        
        <div className="glass-card-subtle p-4 text-center">
          <div className="text-2xl font-bold text-[#0A74DA] mb-1">{company.estatisticas.pesquisasRealizadas}</div>
          <div className="text-sm text-gray-600">Pesquisas</div>
        </div>
        
        <div className="glass-card-subtle p-4 text-center">
          <div className="text-2xl font-bold text-[#0A74DA] mb-1">{company.estatisticas.reunioesRealizadas}</div>
          <div className="text-sm text-gray-600">Reuniões</div>
        </div>
        
        <div className="glass-card-subtle p-4 text-center">
          <div className="text-2xl font-bold text-[#0A74DA] mb-1">{company.estatisticas.documentosGerados}</div>
          <div className="text-sm text-gray-600">Documentos</div>
        </div>
        
        <div className="glass-card-subtle p-4 text-center">
          <div className="text-2xl font-bold text-[#0A74DA] mb-1">{company.estatisticas.relatoriosGerados}</div>
          <div className="text-sm text-gray-600">Relatórios</div>
        </div>
        
        <div className="glass-card-subtle p-4 text-center">
          <div className="text-2xl font-bold text-[#FFA500] mb-1">{company.estatisticas.horasEconomizadas}h</div>
          <div className="text-sm text-gray-600">Economizadas</div>
        </div>
      </div>
    </div>
  );
}