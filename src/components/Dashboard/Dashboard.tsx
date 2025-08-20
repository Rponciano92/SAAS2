import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Users, TrendingUp, Database, Plus, Building2, Calendar, BarChart3, Clock } from 'lucide-react';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

// Mock data integrado
const mockMetrics = {
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
    progresso: 92,
    proximaReuniao: "2025-01-22 15:30",
    necessidades: ["contratos", "preditivo", "relatorios", "kpis", "estrategia"],
  },
];

// Mock data for calendar events
const calendarEvents = [
  { id: 1, date: '2025-06-02', title: 'Reunião Estratégica', client: 'TechStart', type: 'reuniao' },
  { id: 2, date: '2025-06-05', title: 'Análise Financeira', client: 'RetailMax', type: 'analise' },
  { id: 3, date: '2025-06-06', title: 'Call Semanal', client: 'FinTech', type: 'call' },
  { id: 4, date: '2025-06-11', title: 'Apresentação Resultados', client: 'TechStart', type: 'reuniao' },
  { id: 5, date: '2025-06-12', title: 'Revisão Operacional', client: 'InnovaCorp', type: 'analise' },
  { id: 6, date: '2025-06-17', title: 'Planejamento Q3', client: 'RetailMax', type: 'reuniao' },
  { id: 7, date: '2025-06-18', title: 'Due Diligence', client: 'FinTech', type: 'analise' },
  { id: 8, date: '2025-06-19', title: 'Workshop Inovação', client: 'TechStart', type: 'reuniao' },
  { id: 9, date: '2025-06-20', title: 'Call Mensal', client: 'InnovaCorp', type: 'call' },
  { id: 10, date: '2025-06-24', title: 'Análise de Mercado', client: 'RetailMax', type: 'analise' },
  { id: 11, date: '2025-06-25', title: 'Reunião Stakeholders', client: 'FinTech', type: 'reuniao' },
  { id: 12, date: '2025-06-26', title: 'Revisão Estratégica', client: 'TechStart', type: 'reuniao' },
  { id: 13, date: '2025-06-30', title: 'Planejamento Julho', client: 'Todos', type: 'reuniao' },
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

export default function Dashboard({ onNavigate }: DashboardProps) {
  const navigate = useNavigate();
  const [agendaView, setAgendaView] = useState<'hoje' | 'completa'>('hoje');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 15)); // June 2025
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Function to get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('pt-BR', { month: 'long' });
  };

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Function to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Function to get events for a specific day
  const getEventsForDay = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(event => event.date === dateStr);
  };

  // Function to render calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Create array for days of week
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Create array for calendar days
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }
    
    // Calculate total cells needed (multiple of 7)
    const totalCells = Math.ceil(calendarDays.length / 7) * 7;
    
    // Add empty cells for days after the last day of the month
    while (calendarDays.length < totalCells) {
      calendarDays.push(null);
    }
    
    // Split into weeks
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    
    return (
      <div className="space-y-4">
        {/* Calendar Header with Month/Year and Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#003B6D] capitalize">
            {getMonthName(currentDate)} {currentDate.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors glass-button"
            >
              <ChevronLeft size={16} className="text-[#003B6D]" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors glass-button"
            >
              <ChevronRight size={16} className="text-[#003B6D]" />
            </button>
          </div>
        </div>
        
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map(day => (
            <div key={day} className="text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-16 opacity-30" />;
            }
            
            const dateEvents = getEventsForDay(year, month, day);
            const isToday = day === 15; // Assuming today is the 15th for demo
            const hasEvents = dateEvents.length > 0;
            
            return (
              <div
                key={`day-${day}`}
                className={`
                  h-16 p-1 rounded-lg transition-all duration-200 relative
                  ${isToday ? 'bg-[#0A74DA] text-white' : 'hover:bg-white/15'}
                  ${hoveredDay === day ? 'transform scale-105 shadow-lg bg-white/15' : ''}
                  ${hasEvents ? 'cursor-pointer' : ''}
                `}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="text-sm font-medium mb-1 p-1">
                  {day}
                </div>
                
                {/* Event Indicators */}
                <div className="space-y-1">
                  {dateEvents.slice(0, 2).map((event, idx) => (
                    <div 
                      key={`event-${event.id}`} 
                      className={`
                        text-xs p-0.5 rounded-sm overflow-hidden whitespace-nowrap text-ellipsis
                        ${event.type === 'reuniao' ? 'bg-[#0A74DA]/20 text-[#0A74DA]' : ''}
                        ${event.type === 'call' ? 'bg-[#28A745]/20 text-[#28A745]' : ''}
                        ${event.type === 'analise' ? 'bg-[#FFA500]/20 text-[#FFA500]' : ''}
                      `}
                      title={`${event.title} - ${event.client}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  
                  {dateEvents.length > 2 && (
                    <div className="text-xs text-center text-gray-500">
                      +{dateEvents.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 pt-4 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#0A74DA] rounded"></div>
            <span className="text-sm text-gray-600">Reuniões</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#28A745] rounded"></div>
            <span className="text-sm text-gray-600">Calls</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#FFA500] rounded"></div>
            <span className="text-sm text-gray-600">Análises</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header com boas-vindas */}
      <div className="glass-card-strong p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="page-title">Bem-vindo, João Silva</h1>
            <p className="body-text">
              Desbloqueie o potencial máximo da sua consultoria com a inteligência
              artificial que realmente entrega resultados.
            </p>
          </div>
          <Button 
            variant="cta" 
            onClick={() => navigate('/empresas/nova')} 
            className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Cliente</span>
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="hover-lift">
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

        <Card className="hover-lift">
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

        <Card className="hover-lift">
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

      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda */}
        <div className="lg:col-span-1">
          <Card className="glass-card h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="mb-0">Agenda Inteligente</CardTitle>
                <div className="flex glass-card-subtle rounded-xl p-1 z-10">
                  <button
                    onClick={() => setAgendaView('hoje')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all glass-button ${
                      agendaView === 'hoje' 
                        ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg transform scale-105' 
                        : 'text-[#003B6D] hover:bg-white/20 hover:text-[#0A74DA]'
                    }`}
                  >
                    Hoje
                  </button>
                  <button
                    onClick={() => setAgendaView('completa')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all glass-button ${
                      agendaView === 'completa' 
                        ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg transform scale-105' 
                        : 'text-[#003B6D] hover:bg-white/20 hover:text-[#0A74DA]'
                    }`}
                  >
                    Completa
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {agendaView === 'hoje' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-cinza-medio bg-white/50 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-azul-escuro">
                          14:00 - Estratégia de Crescimento Q1
                        </p>
                        <p className="text-sm text-cinza-medio">
                          TechStart Inovação
                        </p>
                      </div>
                      <Badge variant="success">90 min</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default">
                        Preparar
                      </Button>
                      <Button size="sm" variant="outline">
                        Insights
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                renderCalendar()
              )}
            </CardContent>
          </Card>
        </div>

        {/* Empresas Clientes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="section-title mb-0">Clientes</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('empresas')}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEmpresas.map((empresa) => (
                  <div
                    key={empresa.id}
                    className="p-4 rounded-lg border border-cinza-medio bg-white/50 hover:shadow-md transition-shadow interactive"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="card-title mb-1">{empresa.nome}</h4>
                        <p className="text-sm text-cinza-medio">{empresa.setor}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`status-indicator ${empresa.status === 'ativo' ? 'status-ativo' : 'status-pendente'}`} />
                        <span className="text-xs font-medium capitalize">
                          {empresa.status}
                        </span>
                      </div>
                    </div>


                    <div className="mb-3">
                      <span className="text-sm text-cinza-medio">Análise: </span>
                      <span className="font-semibold text-azul-escuro">
                        {empresa.progresso}%
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-cinza-medio mb-1">Necessidades:</p>
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

                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(`/empresas/${empresa.id}/dashboard`)}
                      >
                        Ver
                      </Button>
                      <Button size="sm" variant="default" className="flex-1">
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
      <Card>
        <CardHeader>
          <CardTitle className="mb-0">Insights Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
              <AlertTriangle className="w-5 h-5 text-verde-sucesso" />
              <div className="flex-1">
                <p className="body-text">Análise TechStart aprovada</p>
                <p className="text-sm text-dourado-premium font-semibold">
                  +50 pontos conquistados
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-laranja-cta" />
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
              <Users className="w-5 h-5 text-laranja-cta" />
              <div className="flex-1">
                <p className="body-text">Relatório VarejoMax em validação</p>
              </div>
              <TrendingUp className="w-4 h-4 text-laranja-cta" />
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
              <Database className="w-5 h-5 text-dourado-premium" />
              <div className="flex-1">
                <p className="body-text">Novo badge: "Especialista" conquistado!</p>
              </div>
              <TrendingUp className="w-4 h-4 text-laranja-cta" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <QuickActions onNavigate={onNavigate} />
      </div>
    </div>
  );
}