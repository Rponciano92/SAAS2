import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Clock,
  BarChart3,
  Calendar,
  Building2,
  Plus,
  CheckCircle,
  AlertCircle,
  Eye,
  Trophy,
  Target,
  Zap,
} from "lucide-react";

// Mock data conforme especificações
const mockMetrics = {
  roiMensal: "1.767%",
  horasEconomizadas: 47,
  analisesGeradas: 23,
  reunioesRealizadas: 16,
  clientesAtivos: 8,
  receitaMensal: "R$ 88.000",
  crescimentoMensal: "+23%",
  satisfacaoClientes: "4.8/5.0",
};

const mockEmpresas = [
  {
    id: 1,
    nome: "TechStart Inovação",
    setor: "Tecnologia",
    status: "ativo",
    roi: "+127%",
    progresso: 85,
    proximaReuniao: "2025-01-20 14:00",
    necessidades: ["chat", "preditivo", "relatorios", "estrategia"],
  },
  {
    id: 2,
    nome: "VarejoMax Distribuidora",
    setor: "Varejo",
    status: "pendente",
    progresso: 65,
    proximaReuniao: "2025-01-18 10:00",
    necessidades: ["reunioes", "chat", "preditivo", "kpis"],
  },
  {
    id: 3,
    nome: "IndústriaX Manufatura",
    setor: "Indústria",
    status: "ativo",
    roi: "+89%",
    progresso: 92,
    proximaReuniao: "2025-01-22 15:30",
    necessidades: [
      "contratos",
      "preditivo",
      "relatorios",
      "kpis",
      "estrategia",
    ],
  },
];

const mockReunioesHoje = [
  {
    id: 1,
    empresa: "TechStart Inovação",
    titulo: "Estratégia de Crescimento Q1",
    horario: "14:00",
    duracao: "90 min",
    preparacao: {
      concluida: true,
      insightsGerados: 12,
      materiaisPreparados: 5,
    },
  },
];

const mockInsights = [
  {
    id: 1,
    tipo: "aprovado",
    titulo: "Análise TechStart aprovada",
    pontos: 50,
    icon: CheckCircle,
    color: "text-verde-sucesso",
  },
  {
    id: 2,
    tipo: "validacao",
    titulo: "Relatório VarejoMax em validação",
    icon: AlertCircle,
    color: "text-laranja-cta",
  },
  {
    id: 3,
    tipo: "badge",
    titulo: 'Novo badge: "Especialista" conquistado!',
    icon: Trophy,
    color: "text-dourado-premium",
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

export default function Dashboard() {
  const [agendaView, setAgendaView] = useState<"hoje" | "completa">("hoje");

  return (
    <div className="space-y-6">
      {/* Header com boas-vindas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Bem-vindo, Carlos Silva</h1>
          <p className="body-text text-cinza-medio">
            Desbloqueie o potencial máximo da sua consultoria com a inteligência
            artificial que realmente entrega resultados.
          </p>
        </div>
        <Link to="/empresas/nova">
          <Button className="btn-cta">
            <Plus className="w-4 h-4" />
            Cadastrar Nova Empresa
          </Button>
        </Link>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="caption-text">ROI Mensal</p>
                <p className="text-2xl font-bold text-azul-escuro font-aether-primary">
                  {mockMetrics.roiMensal}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-verde-sucesso" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="caption-text">Horas Economizadas</p>
                <p className="text-2xl font-bold text-azul-escuro font-aether-primary">
                  {mockMetrics.horasEconomizadas}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-azul-escuro" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="caption-text">Análises</p>
                <p className="text-2xl font-bold text-azul-escuro font-aether-primary">
                  {mockMetrics.analisesGeradas}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-laranja-cta" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="caption-text">Reuniões</p>
                <p className="text-2xl font-bold text-azul-escuro font-aether-primary">
                  {mockMetrics.reunioesRealizadas}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-dourado-premium" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layout Principal com duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Agenda */}
        <div className="lg:col-span-1">
          <Card className="glass-card h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="section-title mb-0">
                  Agenda Inteligente
                </CardTitle>
                <Tabs
                  value={agendaView}
                  onValueChange={(v) => setAgendaView(v as "hoje" | "completa")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="hoje">Hoje</TabsTrigger>
                    <TabsTrigger value="completa">Completa</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {agendaView === "hoje" ? (
                <div className="space-y-4">
                  {mockReunioesHoje.map((reuniao) => (
                    <div
                      key={reuniao.id}
                      className="p-4 rounded-lg border border-cinza-medio bg-white/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-azul-escuro">
                            {reuniao.horario} - {reuniao.titulo}
                          </p>
                          <p className="text-sm text-cinza-medio">
                            {reuniao.empresa}
                          </p>
                        </div>
                        <Badge className="bg-verde-sucesso text-white">
                          {reuniao.duracao}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="btn-primary">
                          <Target className="w-4 h-4" />
                          Preparar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                          Insights
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-cinza-medio mx-auto mb-4" />
                  <p className="body-text">Visão completa da agenda em breve</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Empresas Clientes */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="section-title mb-0">
                  Empresas Clientes
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Building2 className="w-4 h-4" />
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEmpresas.map((empresa) => (
                  <div
                    key={empresa.id}
                    className="p-4 rounded-lg border border-cinza-medio bg-white/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="card-title mb-1">{empresa.nome}</h4>
                        <p className="text-sm text-cinza-medio">
                          {empresa.setor}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(empresa.status)}`}
                        />
                        <span className="text-xs font-medium capitalize">
                          {empresa.status}
                        </span>
                      </div>
                    </div>

                    {empresa.roi && (
                      <div className="mb-3">
                        <span className="text-sm text-cinza-medio">ROI: </span>
                        <span className="font-semibold text-verde-sucesso">
                          {empresa.roi}
                        </span>
                      </div>
                    )}

                    <div className="mb-3">
                      <span className="text-sm text-cinza-medio">
                        Análise:{" "}
                      </span>
                      <span className="font-semibold text-azul-escuro">
                        {empresa.progresso}%
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-cinza-medio mb-1">
                        Necessidades:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {empresa.necessidades.slice(0, 4).map((necessidade) => (
                          <span
                            key={necessidade}
                            className="text-sm"
                            title={necessidade}
                          >
                            {getNecessidadeIcon(necessidade)}
                          </span>
                        ))}
                        {empresa.necessidades.length > 4 && (
                          <span className="text-xs text-cinza-medio">
                            +{empresa.necessidades.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Ver
                      </Button>
                      <Button size="sm" className="btn-primary flex-1">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Insights Recentes */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="section-title mb-0">
            Insights Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockInsights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={insight.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/50"
                >
                  <IconComponent className={`w-5 h-5 ${insight.color}`} />
                  <div className="flex-1">
                    <p className="body-text">{insight.titulo}</p>
                    {insight.pontos && (
                      <p className="text-sm text-dourado-premium font-semibold">
                        +{insight.pontos} pontos conquistados
                      </p>
                    )}
                  </div>
                  <Zap className="w-4 h-4 text-laranja-cta" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
