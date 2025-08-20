import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyById, getNecessidadeIcon, getNecessidadeLabel } from '@/data/mockCompanies';
import { CompanyNecessidade, EmpresaDetalhes } from '@/types/company';
import CompanyHeader from '@/components/Empresa/CompanyHeader';
import ChatTab from '@/components/Empresa/tabs/ChatTab';
import ContractsTab from '@/components/Empresa/tabs/ContractsTab';
import MeetingsTab from '@/components/Empresa/tabs/MeetingsTab';
import ReportsTab from '@/components/Empresa/tabs/ReportsTab';
import KPIsTab from '@/components/Empresa/tabs/KPIsTab';
import PredictiveAnalyticsTab from '@/components/Empresa/tabs/PredictiveAnalyticsTab';

export default function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<EmpresaDetalhes | null>(null);
  const [activeTab, setActiveTab] = useState<CompanyNecessidade>('chat');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (companyId) {
      const companyData = getCompanyById(companyId);
      if (companyData) {
        setCompany(companyData);
        
        // Set the first available necessity as the active tab
        if (companyData.necessidades.length > 0) {
          setActiveTab(companyData.necessidades[0]);
        }
      }
      setLoading(false);
    }
  }, [companyId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-[#0A74DA] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-[#003B6D] mb-4">Empresa não encontrada</h2>
        <p className="text-gray-600 mb-6">A empresa que você está procurando não existe ou foi removida.</p>
        <button 
          onClick={() => navigate('/empresas')}
          className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          Voltar para Lista de Empresas
        </button>
      </div>
    );
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatTab company={company} />;
      case 'contratos':
        return <ContractsTab company={company} />;
      case 'reunioes':
        return <MeetingsTab company={company} />;
      case 'relatorios':
        return <ReportsTab company={company} />;
      case 'kpis':
        return <KPIsTab company={company} />;
      case 'analises':
        return <PredictiveAnalyticsTab company={company} />;
      default:
        return <ChatTab company={company} />;
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="p-6 space-y-6">
      <CompanyHeader company={company} />
      
      {/* Tabs Navigation */}
      <div className="glass-card p-2">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {company.necessidades.map((necessidade) => (
            <button
              key={necessidade}
              onClick={() => setActiveTab(necessidade)}
              className={`
                flex-none flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all whitespace-nowrap
                ${activeTab === necessidade
                  ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg'
                  : 'text-[#003B6D] hover:bg-white/20'
                }
              `}
            >
              <span className="text-lg">{getNecessidadeIcon(necessidade)}</span>
              <span>{getNecessidadeLabel(necessidade)}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="glass-card p-6">
        {renderTabContent()}
      </div>
      </div>
    </div>
  );
}