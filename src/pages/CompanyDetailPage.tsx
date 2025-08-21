import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNecessidadeIcon, getNecessidadeLabel } from '@/data/mockCompanies';
import { CompanyNecessidade, EmpresaDetalhes } from '@/types/company';
import CompanyHeader from '@/components/Empresa/CompanyHeader';
import ChatTab from '@/components/Empresa/tabs/ChatTab';
import MeetingsTab from '@/components/Empresa/tabs/MeetingsTab';
import ReportsTab from '@/components/Empresa/tabs/ReportsTab';
import KPIsTab from '@/components/Empresa/tabs/KPIsTab';
import PredictiveAnalyticsTab from '@/components/Empresa/tabs/PredictiveAnalyticsTab';
import { useCompanies } from '@/hooks/useSupabase';
import { CompanyResearchService, CompanyResearchData } from '@/services/companyResearchService';
import { DocumentGeneratorService } from '@/services/documentGeneratorService';

export default function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { companies, loading } = useCompanies();
  const [company, setCompany] = useState<EmpresaDetalhes | null>(null);
  const [activeTab, setActiveTab] = useState<CompanyNecessidade>('chat');
  const [researchData, setResearchData] = useState<CompanyResearchData | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  
  useEffect(() => {
    if (companyId) {
      const companyData = companies.find(c => c.id === companyId);
      if (companyData) {
        // Convert Supabase data to EmpresaDetalhes format
        const empresaDetalhes: EmpresaDetalhes = {
          id: companyData.id,
          nome: companyData.nome,
          setor: companyData.setor,
          tamanho: companyData.tamanho as any,
          avatar: getAvatarForSetor(companyData.setor),
          faturamento: companyData.faturamento,
          website: companyData.website || undefined,
          status: companyData.status as any,
          progresso: companyData.progresso,
          proximaReuniao: undefined,
          ultimaInteracao: companyData.updated_at,
          valorContrato: undefined,
          necessidades: companyData.necessidades as CompanyNecessidade[],
          stakeholders: [], // Would be loaded separately
          configuracaoIA: {
            personalidade: 'Consultivo e Estratégico',
            foco: ['Crescimento', 'Estratégia'],
            restricoes: []
          },
          estatisticas: {
            totalContratos: 0,
            reunioesRealizadas: 0,
            relatoriosGerados: 0,
            kpisMonitorados: 0,
            horasEconomizadas: 0
          },
          descricao: companyData.desafios,
          desafios: companyData.desafios,
          objetivos: companyData.objetivos
        };
        
        setCompany(empresaDetalhes);
        
        // Set the first available necessity as the active tab
        if (empresaDetalhes.necessidades.length > 0) {
          setActiveTab(empresaDetalhes.necessidades[0]);
        }
      }
    }
  }, [companyId, companies]);
  
  const handleResearchCompany = async () => {
    if (!company) return;
    
    try {
      setIsResearching(true);
      console.log('🔍 Iniciando pesquisa automática para:', company.nome);
      
      const research = await CompanyResearchService.researchCompany(company.nome, company.id);
      setResearchData(research);
      
      // Gerar documento PDF automaticamente
      const documentService = new DocumentGeneratorService();
      const document = await documentService.generateCompanyReport(company.nome, research);
      
      // Trigger download
      const url = URL.createObjectURL(document);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${company.nome.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('✅ Pesquisa concluída! Relatório PDF baixado automaticamente.');
      
    } catch (error) {
      console.error('❌ Erro na pesquisa:', error);
      alert('❌ Erro na pesquisa automática. Tente novamente.');
    } finally {
      setIsResearching(false);
    }
  };
  
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
      
      {/* Botão de Pesquisa Automática */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#003B6D]">🔍 Pesquisa Automática</h3>
            <p className="text-sm text-gray-600">Buscar informações atualizadas da empresa na internet</p>
          </div>
          <button
            onClick={handleResearchCompany}
            disabled={isResearching}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
              isResearching 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'glass-button text-white hover:shadow-lg'
            }`}
          >
            {isResearching ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Pesquisando...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Pesquisar e Gerar Relatório</span>
              </>
            )}
          </button>
        </div>
      </div>
      
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