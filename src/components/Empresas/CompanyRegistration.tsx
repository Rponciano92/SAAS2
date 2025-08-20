import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Building2,
  Users,
  Brain,
  History,
} from "lucide-react";
import { Link } from "react-router-dom";

interface FormData {
  // Dados Básicos
  nome: string;
  cnpj: string;
  setor: string;
  tamanho: string;
  faturamento: string;
  website: string;

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

const necessidadesOptions = [
  {
    id: "contratos",
    label: "Criação e gestão de contratos",
    icon: "📝",
    description: "Automatização de contratos legais",
  },
  {
    id: "reunioes",
    label: "Gravação e resumo de reuniões",
    icon: "📅",
    description: "Google Meet integrado com IA",
  },
  {
    id: "chat",
    label: "Chat com insights estratégicos",
    icon: "💬",
    description: "Assistente IA 24/7 especializado",
  },
  {
    id: "preditivas",
    label: "Análises preditivas",
    icon: "📊",
    description: "Projeções e tendências de mercado",
  },
  {
    id: "relatorios",
    label: "Relatórios executivos",
    icon: "📋",
    description: "Relatórios automáticos personalizados",
  },
  {
    id: "kpis",
    label: "Monitoramento de KPIs",
    icon: "📈",
    description: "Dashboard de métricas estratégicas",
  },
];

const setorOptions = [
  "Tecnologia",
  "Varejo",
  "Indústria",
  "Serviços",
  "Saúde",
  "Educação",
  "Financeiro",
  "Agronegócio",
  "Construção",
  "Outro",
];

const tamanhoOptions = [
  "Startup (1-10 funcionários)",
  "Pequena (11-50 funcionários)",
  "Média (51-200 funcionários)",
  "Grande (201-1000 funcionários)",
  "Corporação (1000+ funcionários)",
];

const faturamentoOptions = [
  "Até R$ 360 mil",
  "R$ 360 mil - R$ 4,8 mi",
  "R$ 4,8 mi - R$ 300 mi",
  "R$ 300 mi - R$ 1 bi",
  "Acima de R$ 1 bi",
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

export default function CompanyRegistration() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cnpj: "",
    setor: "",
    tamanho: "",
    faturamento: "",
    website: "",
    desafios: "",
    objetivos: "",
    mercadoAtuacao: "",
    necessidades: [],
    stakeholders: [{ nome: "", cargo: "", email: "", funcao: "" }],
    historico: {
      projetosAnteriores: "",
      resultadosObtidos: "",
      experienciaConsultoria: "",
    },
    configuracaoIA: {
      foco: "",
      tom: "",
      prioridades: [],
      personalidade: "",
    },
  });

  const sections = [
    { title: "Dados Básicos", icon: Building2 },
    { title: "Contexto de Negócio", icon: Building2 },
    { title: "Necessidades", icon: Checkbox },
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
    console.log("Dados do formulário:", formData);
    // Aqui seria implementada a lógica de salvamento
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

  const renderDadosBasicos = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da Empresa *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => handleInputChange("nome", e.target.value)}
            placeholder="Ex: TechStart Solutions"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) => handleInputChange("cnpj", e.target.value)}
            placeholder="00.000.000/0001-00"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="setor">Setor *</Label>
          <Select
            value={formData.setor}
            onValueChange={(value) => handleInputChange("setor", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o setor" />
            </SelectTrigger>
            <SelectContent>
              {setorOptions.map((setor) => (
                <SelectItem key={setor} value={setor}>
                  {setor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tamanho">Tamanho da Empresa *</Label>
          <Select
            value={formData.tamanho}
            onValueChange={(value) => handleInputChange("tamanho", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o porte" />
            </SelectTrigger>
            <SelectContent>
              {tamanhoOptions.map((tamanho) => (
                <SelectItem key={tamanho} value={tamanho}>
                  {tamanho}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="faturamento">Faturamento Anual</Label>
          <Select
            value={formData.faturamento}
            onValueChange={(value) => handleInputChange("faturamento", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a faixa" />
            </SelectTrigger>
            <SelectContent>
              {faturamentoOptions.map((faturamento) => (
                <SelectItem key={faturamento} value={faturamento}>
                  {faturamento}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={formData.website}
          onChange={(e) => handleInputChange("website", e.target.value)}
          placeholder="https://www.empresa.com.br"
        />
      </div>
    </div>
  );

  const renderContextoNegocio = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="desafios">Principais Desafios *</Label>
        <Textarea
          id="desafios"
          value={formData.desafios}
          onChange={(e) => handleInputChange("desafios", e.target.value)}
          placeholder="Descreva os principais desafios que a empresa enfrenta atualmente..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="objetivos">Objetivos Estratégicos *</Label>
        <Textarea
          id="objetivos"
          value={formData.objetivos}
          onChange={(e) => handleInputChange("objetivos", e.target.value)}
          placeholder="Quais são os principais objetivos para os próximos 12-24 meses?"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mercadoAtuacao">Mercado de Atuação</Label>
        <Textarea
          id="mercadoAtuacao"
          value={formData.mercadoAtuacao}
          onChange={(e) => handleInputChange("mercadoAtuacao", e.target.value)}
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
          <Card
            key={necessidade.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              formData.necessidades.includes(necessidade.id)
                ? "border-azul-escuro bg-azul-escuro/5"
                : "border-cinza-medio hover:border-azul-escuro/50"
            }`}
            onClick={() => handleNecessidadeToggle(necessidade.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{necessidade.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={formData.necessidades.includes(necessidade.id)}
                      onChange={() => handleNecessidadeToggle(necessidade.id)}
                    />
                    <h3 className="font-semibold">{necessidade.label}</h3>
                  </div>
                  <p className="caption-text text-gray-600">
                    {necessidade.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addStakeholder}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Contato
        </Button>
      </div>

      <div className="space-y-4">
        {formData.stakeholders.map((stakeholder, index) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`nome-${index}`}>Nome *</Label>
                <Input
                  id={`nome-${index}`}
                  value={stakeholder.nome}
                  onChange={(e) =>
                    updateStakeholder(index, "nome", e.target.value)
                  }
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`cargo-${index}`}>Cargo *</Label>
                <Input
                  id={`cargo-${index}`}
                  value={stakeholder.cargo}
                  onChange={(e) =>
                    updateStakeholder(index, "cargo", e.target.value)
                  }
                  placeholder="Cargo/Posição"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`funcao-${index}`}>Função no Projeto</Label>
                <Select
                  value={stakeholder.funcao}
                  onValueChange={(value) =>
                    updateStakeholder(index, "funcao", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcaoOptions.map((funcao) => (
                      <SelectItem key={funcao} value={funcao}>
                        {funcao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`email-${index}`}>E-mail</Label>
                <div className="flex gap-2">
                  <Input
                    id={`email-${index}`}
                    type="email"
                    value={stakeholder.email}
                    onChange={(e) =>
                      updateStakeholder(index, "email", e.target.value)
                    }
                    placeholder="email@empresa.com"
                    className="flex-1"
                  />
                  {formData.stakeholders.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStakeholder(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHistorico = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projetosAnteriores">
          Projetos de Consultoria Anteriores
        </Label>
        <Textarea
          id="projetosAnteriores"
          value={formData.historico.projetosAnteriores}
          onChange={(e) =>
            handleInputChange("projetosAnteriores", e.target.value, "historico")
          }
          placeholder="Descreva projetos de consultoria que a empresa já realizou ou participou..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resultadosObtidos">Resultados e Impactos Obtidos</Label>
        <Textarea
          id="resultadosObtidos"
          value={formData.historico.resultadosObtidos}
          onChange={(e) =>
            handleInputChange("resultadosObtidos", e.target.value, "historico")
          }
          placeholder="Quais foram os principais resultados, métricas de sucesso ou impactos gerados?"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienciaConsultoria">
          Experiência com Consultoria
        </Label>
        <Textarea
          id="experienciaConsultoria"
          value={formData.historico.experienciaConsultoria}
          onChange={(e) =>
            handleInputChange(
              "experienciaConsultoria",
              e.target.value,
              "historico",
            )
          }
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
          <Label htmlFor="foco">Área de Foco Principal</Label>
          <Select
            value={formData.configuracaoIA.foco}
            onValueChange={(value) =>
              handleInputChange("foco", value, "configuracaoIA")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o foco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="estrategia">Estratégia Empresarial</SelectItem>
              <SelectItem value="operacoes">Operações e Processos</SelectItem>
              <SelectItem value="financeiro">Gestão Financeira</SelectItem>
              <SelectItem value="marketing">Marketing e Vendas</SelectItem>
              <SelectItem value="tecnologia">Transformação Digital</SelectItem>
              <SelectItem value="pessoas">Gestão de Pessoas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tom">Tom de Comunicação</Label>
          <Select
            value={formData.configuracaoIA.tom}
            onValueChange={(value) =>
              handleInputChange("tom", value, "configuracaoIA")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal e Técnico</SelectItem>
              <SelectItem value="colaborativo">
                Colaborativo e Acessível
              </SelectItem>
              <SelectItem value="consultivo">
                Consultivo e Estratégico
              </SelectItem>
              <SelectItem value="direto">Direto e Objetivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalidade">Personalidade do Assistente</Label>
        <Textarea
          id="personalidade"
          value={formData.configuracaoIA.personalidade}
          onChange={(e) =>
            handleInputChange("personalidade", e.target.value, "configuracaoIA")
          }
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
      <div className="flex items-center gap-4">
        <Link to="/empresas">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="page-title">Cadastro de Empresa Cliente</h1>
          <p className="body-text text-gray-600">
            Formulário inteligente para cadastrar empresas e identificar
            necessidades específicas
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                index === currentSection
                  ? "bg-azul-escuro text-white"
                  : index < currentSection
                    ? "bg-verde-sucesso text-white"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden md:block">
                {section.title}
              </span>
              <span className="text-sm font-medium md:hidden">{index + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(sections[currentSection].icon, {
                className: "w-5 h-5",
              })}
              {sections[currentSection].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderCurrentSection()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevSection}
            disabled={currentSection === 0}
          >
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentSection === sections.length - 1 ? (
              <Button type="submit" className="btn-aether">
                Cadastrar Empresa
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextSection}
                className="btn-aether"
              >
                Próximo
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
