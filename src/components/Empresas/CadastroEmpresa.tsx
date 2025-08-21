import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, User, Save, Plus, Trash2, Brain, History, Users, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DocumentGeneratorService } from '@/services/documentGeneratorService';
import ResearchConfirmationModal from '@/components/Modals/ResearchConfirmationModal';
import { CompanyService, StakeholderService } from '@/services/companyService';
import { CompanyResearchService } from '@/services/companyResearchService';
import type { Database } from '@/lib/supabase';

// Função para detectar se é empresa grande que merece pesquisa automática
const detectLargeCompany = (formData: any): boolean => {
  try {
    const nome = formData?.nomeEmpresa?.toLowerCase() || formData?.nomeCompleto?.toLowerCase() || '';
    const setor = formData?.setor?.toLowerCase() || '';
    const tamanho = formData?.tamanhoEmpresa?.toLowerCase() || formData?.tipoAtuacao?.toLowerCase() || '';
    const faturamento = formData?.faturamentoAnual?.toLowerCase() || formData?.rendaMensal?.toLowerCase() || '';
    
    // Indicadores de empresa grande por nome/setor
    const largeCompanyKeywords = [
      // Sufixos empresariais
      'sa', 's.a.', 'ltda', 'corp', 'corporation', 'inc', 'holding',
      
      // Setores de grande porte
      'banco', 'energia', 'petróleo', 'mineração', 'telecomunicações',
      'farmacêutica', 'automotiva', 'tecnologia', 'consultoria',
      'siderurgia', 'química', 'alimentícia', 'varejo',
      
      // Palavras-chave de tamanho
      'multinacional', 'internacional', 'global', 'grupo', 'conglomerado'
    ];
    
    // Verificar indicadores no nome ou setor
    const hasKeywords = largeCompanyKeywords.some(keyword => 
      nome.includes(keyword) || setor.includes(keyword)
    );
    
    // Verificar tamanho declarado
    const largeSize = ['grande', 'multinacional', 'corporação', '1000+', 'enterprise'];
    const isLargeBySize = largeSize.some(size => tamanho.includes(size));
    
    // Verificar faturamento alto
    const highRevenue = ['300 mi', '1 bi', 'acima', 'alto'];
    const hasHighRevenue = highRevenue.some(revenue => faturamento.includes(revenue));
    
    // Retornar true se encontrar qualquer indicador
    return hasKeywords || isLargeBySize || hasHighRevenue;
    
  } catch (error) {
    console.error('Erro na detecção de empresa grande:', error);
    return false; // Em caso de erro, não ativar pesquisa automática
  }
};

// Função para detectar se é empresa grande que merece pesquisa automática
const necessidadesOptions = [
  { value: 'chat', label: '💬 Chat Inteligente', icon: '💬' },
  { value: 'reunioes', label: '📅 Gestão de Reuniões', icon: '📅' },
  { value: 'relatorios', label: '📊 Relatórios Executivos', icon: '📊' },
  { value: 'kpis', label: '📈 Monitoramento de KPIs', icon: '📈' },
  { value: 'analytics', label: '🔍 Análises Preditivas', icon: '🔍' },
  { value: 'pesquisa', label: '🔍 Pesquisa Automática', icon: '🔍' }
];

interface FormData {
  // Tipo de cadastro
  tipoCadastro: 'pj' | 'pf';
  
  // Dados básicos PJ
  nomeEmpresa: string;
  cnpj: string;
  
  // Dados básicos PF
  nomeCompleto: string;
  cpf: string;
  
  // Campos comuns
  setor: string;
  tamanhoEmpresa: string; // Para PJ
  tipoAtuacao: string; // Para PF
  faturamentoAnual: string; // Para PJ
  rendaMensal: string; // Para PF
  website: string;
  telefoneContato: string;
  emailContato: string;
  cargoContato: string; // Para PJ
  areaAtuacao: string; // Para PF

  // Contexto de Negócio
  desafios: string;
  objetivos: string;
  mercadoAtuacao: string;

  // Necessidades
  necessidades: string[];

  // Stakeholders
  stakeholders: Array<{
    nome: string;
    cargo: string;
    email: string;
    funcao: string;
  }>;

  // Histórico
  historico: {
    projetosAnteriores: string;
    resultadosObtidos: string;
    experienciaConsultoria: string;
  };

  // Configurações IA
  configuracaoIA: {
    foco: string;
    tom: string;
    prioridades: string[];
    personalidade: string;
  };
}

const setorOptions = [
  'Tecnologia',
  'Varejo',
  'Indústria',
  'Serviços',
  'Saúde',
  'Educação',
  'Financeiro',
  'Agronegócio',
  'Construção',
  'Outro',
];

const tamanhoEmpresaOptions = [
  'Startup (1-10 funcionários)',
  'Pequena (11-50 funcionários)',
  'Média (51-200 funcionários)',
  'Grande (201-1000 funcionários)',
  'Corporação (1000+ funcionários)',
];

const tipoAtuacaoOptions = [
  'Consultor Independente',
  'Freelancer',
  'Profissional Liberal',
  'Empreendedor Individual',
  'Outro',
];

const faturamentoOptions = [
  'Até R$ 360 mil',
  'R$ 360 mil - R$ 4,8 mi',
  'R$ 4,8 mi - R$ 300 mi',
  'R$ 300 mi - R$ 1 bi',
  'Acima de R$ 1 bi',
];

const rendaOptions = [
  'Até R$ 5.000',
  'R$ 5.000 - R$ 15.000',
  'R$ 15.000 - R$ 30.000',
  'R$ 30.000 - R$ 50.000',
  'Acima de R$ 50.000',
];

const funcaoOptions = [
  "CEO/Presidente",
  "Diretor",
  "Gerente",
  "Coordenador",
  "Analista",
  "Consultor",
  "Outro",
];

export default function CadastroEmpresa() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchData, setResearchData] = useState<CompanyResearchData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    tipoCadastro: 'pj',
    nomeEmpresa: '',
    cnpj: '',
    nomeCompleto: '',
    cpf: '',
    setor: '',
    tamanhoEmpresa: '',
    tipoAtuacao: '',
    faturamentoAnual: '',
    rendaMensal: '',
    website: '',
    telefoneContato: '',
    emailContato: '',
    cargoContato: '',
    areaAtuacao: '',
    desafios: '',
    objetivos: '',
    mercadoAtuacao: '',
    necessidades: [],
    stakeholders: [{ nome: '', cargo: '', email: '', funcao: '' }],
    historico: {
      projetosAnteriores: '',
      resultadosObtidos: '',
      experienciaConsultoria: '',
    },
    configuracaoIA: {
      foco: '',
      tom: '',
      prioridades: [],
      personalidade: '',
    },
  });

  const sections = [
    { title: "Dados Básicos", icon: Building2 },
    { title: "Contexto de Negócio", icon: FileText },
    { title: "Necessidades", icon: Building2 },
    { title: "Stakeholders", icon: Users },
    { title: "Histórico", icon: History },
    { title: "Configurações IA", icon: Brain },
  ];

  const handleInputChange = (field: string, value: any, nested?: string) => {
    setFormData((prev) => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested as keyof FormData],
            [field]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleNecessidadeToggle = (necessidadeId: string) => {
    setFormData((prev) => ({
      ...prev,
      necessidades: prev.necessidades.includes(necessidadeId)
        ? prev.necessidades.filter((id) => id !== necessidadeId)
        : [...prev.necessidades, necessidadeId],
    }));
  };

  const addStakeholder = () => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: [
        ...prev.stakeholders,
        { nome: "", cargo: "", email: "", funcao: "" },
      ],
    }));
  };

  const removeStakeholder = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: prev.stakeholders.filter((_, i) => i !== index),
    }));
  };

  const updateStakeholder = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: prev.stakeholders.map((stakeholder, i) =>
        i === index ? { ...stakeholder, [field]: value } : stakeholder,
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Não fazer nada aqui - apenas prevenir submit padrão
  };

  const handleAutoResearch = async () => {
    setIsResearching(true);
    setShowResearchModal(false);
    
    try {
      const companyName = formData.tipoCadastro === 'pj' ? formData.nomeEmpresa : formData.nomeCompleto;
      const cnpj = formData.tipoCadastro === 'pj' ? formData.cnpj : formData.cpf;
      
      if (!companyName.trim()) {
        throw new Error('Nome da empresa é obrigatório para pesquisa');
      }
      
      const research = await CompanyResearchService.researchCompany(companyName, cnpj);
      setResearchData(research);
      
      // Gerar documento PDF automaticamente
      const documentService = new DocumentGeneratorService();
      const document = await documentService.generateCompanyReport(companyName, research);
      
      // Trigger download - verificar contexto do browser
      if (typeof window !== 'undefined' && window.document) {
        try {
          const url = URL.createObjectURL(document);
          const a = window.document.createElement('a');
          a.href = url;
          a.download = `relatorio-${companyName.replace(/\s+/g, '-')}.pdf`;
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (downloadError) {
          console.error('Erro no download:', downloadError);
          alert('PDF gerado com sucesso, mas houve problema no download automático.');
        }
      }
      
      // Completar dados do formulário com stakeholders pesquisados
      if (research.stakeholders.length > 0) {
        setFormData(prev => ({
          ...prev,
          stakeholders: research.stakeholders.map(s => ({
            nome: s.name,
            cargo: s.position,
            email: '',
            funcao: s.position
          }))
        }));
      }
      
      alert('✅ Pesquisa concluída! Relatório PDF baixado automaticamente. Dados dos stakeholders foram preenchidos automaticamente.');
      navigate('/');
      
    } catch (error) {
      console.error('Erro na pesquisa automática:', error);
      
      // Mostrar erro específico para o usuário
      if (error.message.includes('Rate limit') || error.message.includes('⏳')) {
        alert('⏳ Muitas pesquisas em pouco tempo. Os dados básicos foram salvos. Tente a pesquisa novamente em alguns minutos.');
      } else if (error.message.includes('API key') || error.message.includes('🔑')) {
        alert('🔑 Problema com a configuração da API. Os dados básicos foram salvos.');
      } else {
        alert(`❌ Erro na pesquisa automática: ${error.message}\n\nOs dados básicos foram salvos com sucesso.`);
      }
      
      // Navegar mesmo com erro na pesquisa
      navigate('/empresas');
    } finally {
      setIsResearching(false);
    }
  };

  const handleSaveCompany = async () => {
    try {
      console.log('💾 Iniciando salvamento da empresa...');
      
      // Prepare company data for Supabase
      const companyData: Database['public']['Tables']['companies']['Insert'] = {
        nome: formData.tipoCadastro === 'pj' ? formData.nomeEmpresa : formData.nomeCompleto,
        cnpj: formData.tipoCadastro === 'pj' ? formData.cnpj : formData.cpf,
        setor: formData.setor,
        tamanho: formData.tipoCadastro === 'pj' ? formData.tamanhoEmpresa : formData.tipoAtuacao,
        faturamento: formData.tipoCadastro === 'pj' ? formData.faturamentoAnual : formData.rendaMensal,
        website: formData.website || null,
        telefone_contato: formData.telefoneContato,
        email_contato: formData.emailContato,
        cargo_contato: formData.tipoCadastro === 'pj' ? formData.cargoContato : formData.areaAtuacao,
        desafios: formData.desafios,
        objetivos: formData.objetivos,
        mercado_atuacao: formData.mercadoAtuacao || null,
        necessidades: formData.necessidades,
        status: 'ativo',
        progresso: 0
      };

      console.log('📤 Dados preparados para Supabase:', companyData);

      // Create company
      const company = await CompanyService.create(companyData);
      console.log('✅ Empresa criada com sucesso:', company);

      // Create stakeholders if any
      if (formData.stakeholders.length > 0 && formData.stakeholders[0].nome) {
        const stakeholdersData = formData.stakeholders
          .filter(s => s.nome.trim() !== '')
          .map(stakeholder => ({
            company_id: company.id,
            nome: stakeholder.nome,
            cargo: stakeholder.cargo,
            email: stakeholder.email,
            funcao: stakeholder.funcao
          }));

        if (stakeholdersData.length > 0) {
          await StakeholderService.createMultiple(stakeholdersData);
          console.log('✅ Stakeholders criados com sucesso');
        }
      }

      console.log('🎉 Cadastro concluído com sucesso!');
      
      alert('✅ Cliente cadastrado com sucesso!');
      // Navegar para lista de empresas
      navigate('/empresas');
      
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
      
      // Mostrar erro específico
      if (error.message.includes('duplicate key')) {
        alert('❌ Erro: CNPJ/CPF já cadastrado no sistema.');
      } else if (error.message.includes('violates not-null')) {
        alert('❌ Erro: Campos obrigatórios não preenchidos.');
      } else {
        alert(`❌ Erro ao cadastrar cliente: ${error.message}`);
      }
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const renderDadosBasicos = () => (
    <div className="space-y-6">
      {/* Tipo de Cadastro */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#003B6D] mb-3">
          Tipo de Cadastro *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('tipoCadastro', 'pj')}
            className={`p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
              formData.tipoCadastro === 'pj'
                ? 'border-[#0A74DA] bg-[#0A74DA]/10'
                : 'border-gray-300 hover:border-[#0A74DA]/50'
            }`}
          >
            <Building2 size={24} className={formData.tipoCadastro === 'pj' ? 'text-[#0A74DA]' : 'text-gray-500'} />
            <div className="text-left">
              <p className="font-semibold text-[#003B6D]">Pessoa Jurídica</p>
              <p className="text-sm text-gray-600">Empresa, CNPJ</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleInputChange('tipoCadastro', 'pf')}
            className={`p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
              formData.tipoCadastro === 'pf'
                ? 'border-[#0A74DA] bg-[#0A74DA]/10'
                : 'border-gray-300 hover:border-[#0A74DA]/50'
            }`}
          >
            <User size={24} className={formData.tipoCadastro === 'pf' ? 'text-[#0A74DA]' : 'text-gray-500'} />
            <div className="text-left">
              <p className="font-semibold text-[#003B6D]">Pessoa Física</p>
              <p className="text-sm text-gray-600">Cliente independente</p>
            </div>
          </button>
        </div>
      </div>

      {/* Campos dinâmicos baseados no tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {formData.tipoCadastro === 'pj' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                Nome da Empresa *
              </label>
              <input
                type="text"
                value={formData.nomeEmpresa}
                onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                placeholder="Ex: TechStart Solutions"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                CNPJ *
              </label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                placeholder="00.000.000/0001-00"
                maxLength={18}
                required
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                placeholder="Ex: João Silva"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                CPF *
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>
          </>
        )}
      </div>

      {/* Campos comuns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Setor *
          </label>
          <select
            value={formData.setor}
            onChange={(e) => handleInputChange('setor', e.target.value)}
            className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            required
          >
            <option value="">Selecione o setor</option>
            {setorOptions.map((setor) => (
              <option key={setor} value={setor}>
                {setor}
              </option>
            ))}
          </select>
        </div>

        {formData.tipoCadastro === 'pj' ? (
          <div>
            <label className="block text-sm font-medium text-[#003B6D] mb-2">
              Tamanho da Empresa *
            </label>
            <select
              value={formData.tamanhoEmpresa}
              onChange={(e) => handleInputChange('tamanhoEmpresa', e.target.value)}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
              required
            >
              <option value="">Selecione o porte</option>
              {tamanhoEmpresaOptions.map((tamanho) => (
                <option key={tamanho} value={tamanho}>
                  {tamanho}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-[#003B6D] mb-2">
              Tipo de Atuação *
            </label>
            <select
              value={formData.tipoAtuacao}
              onChange={(e) => handleInputChange('tipoAtuacao', e.target.value)}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
              required
            >
              <option value="">Selecione o tipo</option>
              {tipoAtuacaoOptions.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.tipoCadastro === 'pj' ? (
          <div>
            <label className="block text-sm font-medium text-[#003B6D] mb-2">
              Faturamento Anual
            </label>
            <select
              value={formData.faturamentoAnual}
              onChange={(e) => handleInputChange('faturamentoAnual', e.target.value)}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            >
              <option value="">Selecione a faixa</option>
              {faturamentoOptions.map((faturamento) => (
                <option key={faturamento} value={faturamento}>
                  {faturamento}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-[#003B6D] mb-2">
              Renda Mensal
            </label>
            <select
              value={formData.rendaMensal}
              onChange={(e) => handleInputChange('rendaMensal', e.target.value)}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            >
              <option value="">Selecione a faixa</option>
              {rendaOptions.map((renda) => (
                <option key={renda} value={renda}>
                  {renda}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Website */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
          placeholder={formData.tipoCadastro === 'pj' ? 'https://www.empresa.com.br' : 'https://www.meusite.com.br'}
        />
      </div>

      {/* Campos de contato obrigatórios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Telefone de Contato *
          </label>
          <input
            type="tel"
            value={formData.telefoneContato}
            onChange={(e) => handleInputChange('telefoneContato', formatPhone(e.target.value))}
            className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            placeholder="(11) 99999-9999"
            maxLength={15}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            E-mail de Contato *
          </label>
          <input
            type="email"
            value={formData.emailContato}
            onChange={(e) => handleInputChange('emailContato', e.target.value)}
            className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            placeholder={formData.tipoCadastro === 'pj' ? 'contato@empresa.com.br' : 'seu@email.com'}
            required
          />
        </div>

        {formData.tipoCadastro === 'pj' ? (
          <div>
            <label className="block text-sm font-medium text-[#003B6D] mb-2">
              Cargo do Contato *
            </label>
            <input
              type="text"
              value={formData.cargoContato}
              onChange={(e) => handleInputChange('cargoContato', e.target.value)}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
              placeholder="CEO, Diretor, Gerente..."
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-[#003B6D] mb-2">
              Área de Atuação *
            </label>
            <input
              type="text"
              value={formData.areaAtuacao}
              onChange={(e) => handleInputChange('areaAtuacao', e.target.value)}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
              placeholder="Consultor, Analista, Especialista..."
              required
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderContextoNegocio = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Principais Desafios *
        </label>
        <textarea
          value={formData.desafios}
          onChange={(e) => handleInputChange('desafios', e.target.value)}
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Descreva os principais desafios que a empresa enfrenta atualmente..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Objetivos Estratégicos *
        </label>
        <textarea
          value={formData.objetivos}
          onChange={(e) => handleInputChange('objetivos', e.target.value)}
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Descreva os objetivos estratégicos da empresa..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Mercado de Atuação
        </label>
        <textarea
          value={formData.mercadoAtuacao}
          onChange={(e) => handleInputChange('mercadoAtuacao', e.target.value)}
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Descreva o mercado onde a empresa atua..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderNecessidades = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#003B6D] mb-4">
          Selecione as necessidades da empresa *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {necessidadesOptions.map((necessidade) => (
            <button
              key={necessidade.value}
              type="button"
              onClick={() => handleNecessidadeToggle(necessidade.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.necessidades.includes(necessidade.value)
                  ? 'border-[#0A74DA] bg-[#0A74DA]/10'
                  : 'border-gray-300 hover:border-[#0A74DA]/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{necessidade.icon}</span>
                <span className="font-medium text-[#003B6D]">
                  {necessidade.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStakeholders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-[#003B6D]">
          Stakeholders
        </label>
        <button
          type="button"
          onClick={addStakeholder}
          className="flex items-center space-x-2 px-4 py-2 bg-[#0A74DA] text-white rounded-lg hover:bg-[#0A74DA]/90 transition-colors"
        >
          <Plus size={16} />
          <span>Adicionar</span>
        </button>
      </div>

      {formData.stakeholders.map((stakeholder, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-[#003B6D]">
              Stakeholder {index + 1}
            </h4>
            {formData.stakeholders.length > 1 && (
              <button
                type="button"
                onClick={() => removeStakeholder(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                Nome
              </label>
              <input
                type="text"
                value={stakeholder.nome}
                onChange={(e) => updateStakeholder(index, 'nome', e.target.value)}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                placeholder="Nome do stakeholder"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                Cargo
              </label>
              <input
                type="text"
                value={stakeholder.cargo}
                onChange={(e) => updateStakeholder(index, 'cargo', e.target.value)}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                placeholder="Cargo na empresa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={stakeholder.email}
                onChange={(e) => updateStakeholder(index, 'email', e.target.value)}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                placeholder="email@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                Função
              </label>
              <select
                value={stakeholder.funcao}
                onChange={(e) => updateStakeholder(index, 'funcao', e.target.value)}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
              >
                <option value="">Selecione a função</option>
                {funcaoOptions.map((funcao) => (
                  <option key={funcao} value={funcao}>
                    {funcao}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHistorico = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Projetos Anteriores
        </label>
        <textarea
          value={formData.historico.projetosAnteriores}
          onChange={(e) => handleInputChange('projetosAnteriores', e.target.value, 'historico')}
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Descreva projetos similares já realizados..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Resultados Obtidos
        </label>
        <textarea
          value={formData.historico.resultadosObtidos}
          onChange={(e) => handleInputChange('resultadosObtidos', e.target.value, 'historico')}
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Descreva os resultados alcançados em projetos anteriores..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Experiência com Consultoria
        </label>
        <textarea
          value={formData.historico.experienciaConsultoria}
          onChange={(e) => handleInputChange('experienciaConsultoria', e.target.value, 'historico')}
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Descreva a experiência prévia com serviços de consultoria..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderConfiguracaoIA = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Foco Principal
          </label>
          <select
            value={formData.configuracaoIA.foco}
            onChange={(e) => handleInputChange('foco', e.target.value, 'configuracaoIA')}
            className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
          >
            <option value="">Selecione o foco</option>
            <option value="eficiencia">Eficiência Operacional</option>
            <option value="crescimento">Crescimento de Receita</option>
            <option value="inovacao">Inovação</option>
            <option value="custos">Redução de Custos</option>
            <option value="qualidade">Melhoria da Qualidade</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Tom de Comunicação
          </label>
          <select
            value={formData.configuracaoIA.tom}
            onChange={(e) => handleInputChange('tom', e.target.value, 'configuracaoIA')}
            className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
          >
            <option value="">Selecione o tom</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="tecnico">Técnico</option>
            <option value="executivo">Executivo</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Personalidade da IA
        </label>
        <textarea
          value={formData.configuracaoIA.personalidade}
          onChange={(e) => handleInputChange('personalidade', e.target.value, 'configuracaoIA')}
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Descreva como a IA deve se comportar nas interações..."
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F4FD] to-[#F0F9FF] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-[#003B6D]" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#003B6D]">
                Cadastro de Cliente
              </h1>
              <p className="text-[#0A74DA] mt-1">
                Preencha as informações do cliente
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 ${
                    index === currentSection
                      ? 'text-[#0A74DA]'
                      : index < currentSection
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium hidden md:block">
                    {section.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#0A74DA] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentSection + 1) / sections.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#003B6D] mb-2">
              {sections[currentSection].title}
            </h2>
            <p className="text-[#0A74DA]">
              Seção {currentSection + 1} de {sections.length}
            </p>
          </div>

          {/* Render current section */}
          {currentSection === 0 && renderDadosBasicos()}
          {currentSection === 1 && renderContextoNegocio()}
          {currentSection === 2 && renderNecessidades()}
          {currentSection === 3 && renderStakeholders()}
          {currentSection === 4 && renderHistorico()}
          {currentSection === 5 && renderConfiguracaoIA()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="px-6 py-3 border border-[#0A74DA] text-[#0A74DA] rounded-xl hover:bg-[#0A74DA]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <div className="flex space-x-4">
              {currentSection === sections.length - 1 ? (
                <button
                  type="button"
                  onClick={handleSaveCompany}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#0A74DA] text-white rounded-xl hover:bg-[#0A74DA]/90 transition-colors"
                >
                  <Save size={20} />
                  <span>Salvar Cliente</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextSection}
                  className="px-6 py-3 bg-[#0A74DA] text-white rounded-xl hover:bg-[#0A74DA]/90 transition-colors"
                >
                  Próximo
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Research Modal */}
      {showResearchModal && (
        <ResearchConfirmationModal
          isOpen={showResearchModal}
          onClose={() => {
            setShowResearchModal(false);
            navigate('/empresas');
          }}
          onConfirm={handleAutoResearch}
          isLoading={isResearching}
          isLoading={isResearching}
          companyName={formData.tipoCadastro === 'pj' ? formData.nomeEmpresa : formData.nomeCompleto}
        />
      )}
      
      {/* Loading Modal para Pesquisa */}
      {isResearching && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A74DA]"></div>
              <div>
                <h3 className="text-lg font-semibold text-[#003B6D]">
                  🔍 Pesquisando empresa...
                </h3>
                <p className="text-gray-600">
                  Coletando informações da internet. Isso pode levar alguns minutos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}