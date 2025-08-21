import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, User, Save, Plus, Trash2, Brain, History, Users, FileText } from 'lucide-react';
import { DocumentGeneratorService } from '@/services/documentGeneratorService';
import ResearchConfirmationModal from '@/components/Modals/ResearchConfirmationModal';
import type { Database } from '@/lib/supabase';

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
    try {
      const companyName = formData.tipoCadastro === 'pj' ? formData.nomeEmpresa : formData.nomeCompleto;
      const cnpj = formData.tipoCadastro === 'pj' ? formData.cnpj : formData.cpf;
      
      const research = await CompanyResearchService.researchCompany(companyName, cnpj);
      setResearchData(research);
      
      // Gerar documento PDF automaticamente
      const documentService = new DocumentGeneratorService();
      const document = await documentService.generateCompanyReport(companyName, research);
      
      // Trigger download
      const url = URL.createObjectURL(document);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${companyName.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
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
      
      setShowResearchModal(false);
      
      alert('✅ Pesquisa concluída! Relatório PDF baixado automaticamente. Dados dos stakeholders foram preenchidos automaticamente.');
      navigate('/');
      
    } catch (error) {
      console.error('Erro na pesquisa automática:', error);
      alert('❌ Erro na pesquisa automática. Salvando dados básicos...');
      setShowResearchModal(false);
      navigate('/');
    } finally {
      setIsResearching(false);
    }
  };

  const handleSaveCompany = async () => {
    try {
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

      // Create company
      const company = await CompanyService.create(companyData);

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
        }
      }

      alert('Cliente cadastrado com sucesso!');
      
      // Verificar se é cliente grande e mostrar modal
      const companyName = formData.tipoCadastro === 'pj' ? formData.nomeEmpresa : formData.nomeCompleto;
      if (CompanyResearchService.isLargeClient(formData) && companyName.trim()) {
        setShowResearchModal(true);
        return; // Não navegar ainda, aguardar decisão do usuário
      }
      
      // Navegar para lista de empresas
      navigate('/empresas');
      
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
      alert('Erro ao cadastrar cliente. Tente novamente.');
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
          placeholder="Quais são os principais objetivos para os próximos 12-24 meses?"
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
          placeholder="Descreva o mercado onde a empresa atua, concorrentes, posicionamento..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderNecessidades = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="body-text text-gray-600">
          Selecione as áreas onde nossa IA pode elevar sua expertise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {necessidadesOptions.map((necessidade) => (
          <div
            key={necessidade.value}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md glass-card p-4 ${
              formData.necessidades.includes(necessidade.value)
                ? "border-azul-escuro bg-azul-escuro/5"
                : "border-cinza-medio hover:border-azul-escuro/50"
            }`}
            onClick={() => handleNecessidadeToggle(necessidade.value)}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{necessidade.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.necessidades.includes(necessidade.value)}
                    onChange={() => handleNecessidadeToggle(necessidade.value)}
                    className="rounded"
                  />
                  <h3 className="font-semibold">{necessidade.label}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStakeholders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="section-title">Contatos Principais</h3>
          <p className="body-text text-gray-600">
            Identifique os stakeholders chave para alinhamento estratégico
          </p>
        </div>
        <button
          type="button"
          onClick={addStakeholder}
          className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Adicionar Contato</span>
        </button>
      </div>

      <div className="space-y-4">
        {formData.stakeholders.map((stakeholder, index) => (
          <div key={index} className="glass-card p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={stakeholder.nome}
                  onChange={(e) =>
                    updateStakeholder(index, "nome", e.target.value)
                  }
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Cargo *
                </label>
                <input
                  type="text"
                  value={stakeholder.cargo}
                  onChange={(e) =>
                    updateStakeholder(index, "cargo", e.target.value)
                  }
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  placeholder="Cargo/Posição"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Função no Projeto
                </label>
                <select
                  value={stakeholder.funcao}
                  onChange={(e) =>
                    updateStakeholder(index, "funcao", e.target.value)
                  }
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                >
                  <option value="">Selecione</option>
                  {funcaoOptions.map((funcao) => (
                    <option key={funcao} value={funcao}>
                      {funcao}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  E-mail
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={stakeholder.email}
                    onChange={(e) =>
                      updateStakeholder(index, "email", e.target.value)
                    }
                    className="flex-1 glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                    placeholder="email@empresa.com"
                  />
                  {formData.stakeholders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStakeholder(index)}
                      className="px-3 py-2 bg-[#EF4444]/20 text-[#EF4444] rounded-xl hover:bg-[#EF4444]/30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistorico = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Projetos de Consultoria Anteriores
        </label>
        <textarea
          value={formData.historico.projetosAnteriores}
          onChange={(e) =>
            handleInputChange("projetosAnteriores", e.target.value, "historico")
          }
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Descreva projetos de consultoria que a empresa já realizou ou participou..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Resultados e Impactos Obtidos
        </label>
        <textarea
          value={formData.historico.resultadosObtidos}
          onChange={(e) =>
            handleInputChange("resultadosObtidos", e.target.value, "historico")
          }
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Quais foram os principais resultados, métricas de sucesso ou impactos gerados?"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Experiência com Consultoria
        </label>
        <textarea
          value={formData.historico.experienciaConsultoria}
          onChange={(e) =>
            handleInputChange(
              "experienciaConsultoria",
              e.target.value,
              "historico",
            )
          }
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Como a empresa vê o valor da consultoria? Expectativas e experiências passadas..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderConfiguracaoIA = () => (
    <div className="space-y-6">
      <div className="text-center mb-8 p-6 bg-gradient-to-r from-azul-escuro/5 to-dourado-premium/5 rounded-lg">
        <h3 className="section-title text-azul-escuro mb-2">
          Personalização do Assistente IA
        </h3>
        <p className="body-text text-gray-700 italic">
          "Nossa IA não substitui sua expertise, ela a eleva. Juntos, vamos
          redefinir o futuro da consultoria."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Área de Foco Principal
          </label>
          <select
            value={formData.configuracaoIA.foco}
            onChange={(e) =>
              handleInputChange("foco", e.target.value, "configuracaoIA")
            }
            className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
          >
            <option value="">Selecione o foco</option>
            <option value="estrategia">Estratégia Empresarial</option>
            <option value="operacoes">Operações e Processos</option>
            <option value="financeiro">Gestão Financeira</option>
            <option value="marketing">Marketing e Vendas</option>
            <option value="tecnologia">Transformação Digital</option>
            <option value="pessoas">Gestão de Pessoas</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Tom de Comunicação
          </label>
          <select
            value={formData.configuracaoIA.tom}
            onChange={(e) =>
              handleInputChange("tom", e.target.value, "configuracaoIA")
            }
            className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
          >
            <option value="">Selecione o tom</option>
            <option value="formal">Formal e Técnico</option>
            <option value="colaborativo">Colaborativo e Acessível</option>
            <option value="consultivo">Consultivo e Estratégico</option>
            <option value="direto">Direto e Objetivo</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Personalidade do Assistente
        </label>
        <textarea
          value={formData.configuracaoIA.personalidade}
          onChange={(e) =>
            handleInputChange("personalidade", e.target.value, "configuracaoIA")
          }
          className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          placeholder="Descreva como gostaria que o assistente IA se comportasse nas interações..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderDadosBasicos();
      case 1:
        return renderContextoNegocio();
      case 2:
        return renderNecessidades();
      case 3:
        return renderStakeholders();
      case 4:
        return renderHistorico();
      case 5:
        return renderConfiguracaoIA();
      default:
        return renderDadosBasicos();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/empresas')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[#003B6D]"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="page-title">Cadastro de Cliente</h1>
            <p className="text-gray-600">Formulário inteligente para cadastrar clientes e identificar necessidades específicas</p>
          </div>
        </div>
      </div>

      {/* Progress Tabs */}
      <div className="glass-card p-2">
        <div className="flex space-x-2 overflow-x-auto">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = index === currentSection;
            const isCompleted = index < currentSection;
            
            return (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`
                  flex-none flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg' 
                    : isCompleted
                      ? 'bg-gradient-to-r from-[#28A745] to-[#20C997] text-white'
                      : 'text-[#003B6D] hover:bg-white/20'
                  }
                `}
              >
                <Icon size={18} />
                <span className="text-sm">{section.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-6">
            {React.createElement(sections[currentSection].icon, {
              className: "w-6 h-6 text-[#0A74DA]",
            })}
            <h2 className="section-title">{sections[currentSection].title}</h2>
          </div>
          
          {renderCurrentSection()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={prevSection}
            disabled={currentSection === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentSection === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-[#003B6D] hover:bg-white/20'
            }`}
          >
            Anterior
          </button>

          <div className="flex gap-2">
            {currentSection === sections.length - 1 ? (
              <button
                type="button"
                onClick={handleSaveCompany}
                className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Save size={20} />
                <span>Cadastrar Cliente</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={nextSection}
                className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      </form>
      
      {/* Modal de Confirmação de Pesquisa */}
      <ResearchConfirmationModal
        isOpen={showResearchModal}
        onClose={() => setShowResearchModal(false)}
        onConfirm={handleAutoResearch}
        companyName={formData.tipoCadastro === 'pj' ? formData.nomeEmpresa : formData.nomeCompleto}
        isResearching={isResearching}
      />
    </div>
  );
}