import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Plus,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  BarChart3,
  Calendar,
  Eye,
  Edit,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data conforme especificações do manual
const mockPortfolioStats = {
  totalEmpresas: 8,
  receitaMensal: "R$ 45K",
  crescimento: "+23%",
  setores: {
    tecnologia: 3,
    varejo: 2,
    industria: 3,
  },
};

const mockEmpresas = [
  {
    id: 1,
    nome: "TechStart Inovação",
    cnpj: "12.345.678/0001-90",
    setor: "Tecnologia",
    tamanho: "Startup (10-50 funcionários)",
    faturamento: "R$ 2-5 milhões/ano",
    website: "www.techstart.com.br",
    status: "ativo",
    roi: "+127%",
    progresso: 85,
    proximaReuniao: "2025-01-20 14:00",
    ultimaInteracao: "2025-01-15",
    valorContrato: "R$ 25.000/mês",
    necessidades: ["chat", "preditivo", "relatorios", "estrategia"],
    stakeholders: [
      { nome: "João Silva", cargo: "CEO", email: "joao@techstart.com.br" },
      { nome: "Maria Santos", cargo: "CTO", email: "maria@techstart.com.br" },
    ],
  },
  {
    id: 2,
    nome: "VarejoMax Distribuidora",
    cnpj: "98.765.432/0001-10",
    setor: "Varejo",
    tamanho: "Média (51-200 funcionários)",
    faturamento: "R$ 50-100 milhões/ano",
    website: "www.varejomax.com.br",
    status: "pendente",
    progresso: 65,
    proximaReuniao: "2025-01-18 10:00",
    ultimaInteracao: "2025-01-12",
    valorContrato: "R$ 18.000/mês",
    necessidades: ["reunioes", "chat", "preditivo", "kpis"],
    stakeholders: [
      {
        nome: "Ana Costa",
        cargo: "Diretora Comercial",
        email: "ana@varejomax.com.br",
      },
    ],
  },
  {
    id: 3,
    nome: "IndústriaX Manufatura",
    cnpj: "11.222.333/0001-44",
    setor: "Indústria",
    tamanho: "Grande (201-1000 funcionários)",
    faturamento: "R$ 200-500 milhões/ano",
    website: "www.industriax.com.br",
    status: "ativo",
    roi: "+89%",
    progresso: 92,
    proximaReuniao: "2025-01-22 15:30",
    ultimaInteracao: "2025-01-14",
    valorContrato: "R$ 45.000/mês",
    necessidades: [
      "contratos",
      "preditivo",
      "relatorios",
      "kpis",
      "estrategia",
    ],
    stakeholders: [
      {
        nome: "Roberto Lima",
        cargo: "Diretor Industrial",
        email: "roberto@industriax.com.br",
      },
      {
        nome: "Carla Mendes",
        cargo: "Gerente de Qualidade",
        email: "carla@industriax.com.br",
      },
    ],
  },
];

const getNecessidadeIcon = (necessidade: string) => {
  const icons: Record<string, string> = {
    contratos: "📝",
    reunioes: "📅",
    chat: "💬",
    preditivo: "📊",
    relatorios: "📋",
    kpis: "📈",
    estrategia: "🎯",
    mercado: "🔍",
  };
  return icons[necessidade] || "📋";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativo":
      return "bg-verde-sucesso";
    case "pendente":
      return "bg-laranja-cta";
    case "analise":
      return "bg-azul-escuro";
    default:
      return "bg-cinza-medio";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "ativo":
      return "Ativo";
    case "pendente":
      return "Pendente";
    case "analise":
      return "Em Análise";
    default:
      return "Inativo";
  }
};

export default function CompaniesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSetor, setSelectedSetor] = useState("todos");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  const filteredEmpresas = mockEmpresas.filter((empresa) => {
    const matchesSearch = empresa.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSetor =
      selectedSetor === "todos" || empresa.setor === selectedSetor;
    const matchesStatus =
      selectedStatus === "todos" || empresa.status === selectedStatus;

    return matchesSearch && matchesSetor && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Empresas Clientes</h1>
          <p className="body-text text-gray-600">
            Gerencie seu portfólio de clientes com visão estratégica e insights
            de IA.
          </p>
        </div>
        <Link to="/empresas/nova">
          <Button className="btn-cta">
            <Plus className="w-4 h-4" />
            Cadastrar Empresa
          </Button>
        </Link>
      </div>

      {/* Estatísticas do Portfólio */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="section-title">
            Estatísticas do Portfólio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-azul-escuro" />
              <div>
                <p className="text-2xl font-bold text-azul-escuro">
                  {mockPortfolioStats.totalEmpresas}
                </p>
                <p className="caption-text">Empresas</p>
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
                <div className="flex gap-2 text-sm">
                  <span>💻 {mockPortfolioStats.setores.tecnologia}</span>
                  <span>🛒 {mockPortfolioStats.setores.varejo}</span>
                  <span>🏭 {mockPortfolioStats.setores.industria}</span>
                </div>
                <p className="caption-text">Por Setor</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cinza-medio w-4 h-4" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedSetor} onValueChange={setSelectedSetor}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Setores</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Varejo">Varejo</SelectItem>
                  <SelectItem value="Indústria">Indústria</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="analise">Em Análise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Empresas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmpresas.map((empresa) => (
          <Card
            key={empresa.id}
            className="glass-card hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="card-title">{empresa.nome}</CardTitle>
                  <p className="text-sm text-cinza-medio">{empresa.setor}</p>
                  <p className="text-xs text-cinza-medio">{empresa.tamanho}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(empresa.status)}`}
                  />
                  <Badge variant="secondary" className="text-xs">
                    {getStatusText(empresa.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4">
                {empresa.roi && (
                  <div>
                    <p className="caption-text">ROI</p>
                    <p className="font-semibold text-verde-sucesso">
                      {empresa.roi}
                    </p>
                  </div>
                )}
                <div>
                  <p className="caption-text">Progresso</p>
                  <p className="font-semibold text-azul-escuro">
                    {empresa.progresso}%
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="caption-text">Valor do Contrato</p>
                  <p className="font-semibold text-azul-escuro">
                    {empresa.valorContrato}
                  </p>
                </div>
              </div>

              {/* Necessidades */}
              <div>
                <p className="caption-text mb-2">Necessidades</p>
                <div className="flex flex-wrap gap-1">
                  {empresa.necessidades.slice(0, 6).map((necessidade) => (
                    <span
                      key={necessidade}
                      className="text-sm"
                      title={necessidade}
                    >
                      {getNecessidadeIcon(necessidade)}
                    </span>
                  ))}
                  {empresa.necessidades.length > 6 && (
                    <span className="text-xs text-cinza-medio bg-cinza-claro px-2 py-1 rounded">
                      +{empresa.necessidades.length - 6}
                    </span>
                  )}
                </div>
              </div>

              {/* Stakeholders */}
              <div>
                <p className="caption-text mb-2">Stakeholders</p>
                <div className="space-y-1">
                  {empresa.stakeholders
                    .slice(0, 2)
                    .map((stakeholder, index) => (
                      <div key={index} className="text-xs">
                        <span className="font-medium">{stakeholder.nome}</span>
                        <span className="text-cinza-medio">
                          {" "}
                          - {stakeholder.cargo}
                        </span>
                      </div>
                    ))}
                  {empresa.stakeholders.length > 2 && (
                    <p className="text-xs text-cinza-medio">
                      +{empresa.stakeholders.length - 2} mais
                    </p>
                  )}
                </div>
              </div>

              {/* Próxima Reunião */}
              {empresa.proximaReuniao && (
                <div className="bg-azul-escuro/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-azul-escuro" />
                    <p className="text-sm font-medium">Próxima Reunião</p>
                  </div>
                  <p className="text-sm text-azul-escuro">
                    {new Date(empresa.proximaReuniao).toLocaleString("pt-BR")}
                  </p>
                </div>
              )}

              {/* Última Interação */}
              <div className="flex items-center gap-2 text-xs text-cinza-medio">
                <Clock className="w-3 h-3" />
                <span>
                  Última interação:{" "}
                  {new Date(empresa.ultimaInteracao).toLocaleDateString(
                    "pt-BR",
                  )}
                </span>
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
                <Button size="sm" className="btn-primary flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vazio */}
      {filteredEmpresas.length === 0 && (
        <Card className="glass-card">
          <CardContent className="text-center py-12">
            <Building2 className="w-16 h-16 text-cinza-medio mx-auto mb-4" />
            <h3 className="card-title mb-2">Nenhuma empresa encontrada</h3>
            <p className="body-text text-cinza-medio mb-6">
              Nenhuma empresa corresponde aos filtros selecionados.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedSetor("todos");
                setSelectedStatus("todos");
              }}
            >
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Legenda */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Legenda:</span>
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
              <span>📈</span>
              <span>Preditivo</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📋</span>
              <span>Relatórios</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>KPIs</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span>Estratégia</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
