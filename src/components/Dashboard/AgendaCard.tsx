import React, { useState } from 'react';
import { Calendar, Clock, Video, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  type: 'reuniao' | 'analise' | 'call';
  duration: string;
  client?: string;
  date: string; // Formato: YYYY-MM-DD
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  events: AgendaItem[];
  isToday: boolean;
}

const hojeData: AgendaItem[] = [
  {
    id: '1',
    time: '10:00',
    title: 'Planejamento Q1',
    type: 'reuniao',
    duration: '1h30min',
    client: 'TechStart',
    date: '2025-01-15'
  },
  {
    id: '2', 
    time: '14:00',
    title: 'Call InnovaCorp',
    type: 'call',
    duration: '45min',
    client: 'InnovaCorp',
    date: '2025-01-15'
  },
  {
    id: '3',
    time: '16:30', 
    title: 'Análise PendCo',
    type: 'analise',
    duration: '1h',
    client: 'PendCo',
    date: '2025-01-15'
  }
];

const eventosCompletos: AgendaItem[] = [
  ...hojeData,
  // Eventos espalhados pelo mês
  {
    id: '4',
    time: '09:00',
    title: 'Revisão Estratégica',
    type: 'reuniao',
    duration: '2h',
    client: 'RetailMax',
    date: '2025-01-16'
  },
  {
    id: '5',
    time: '15:00', 
    title: 'Análise Financeira',
    type: 'analise',
    duration: '1h30min',
    client: 'FinTech Solutions',
    date: '2025-01-16'
  },
  {
    id: '6',
    time: '11:00',
    title: 'Workshop Inovação',
    type: 'reuniao',
    duration: '3h',
    client: 'StartupHub',
    date: '2025-01-18'
  },
  {
    id: '7',
    time: '14:30',
    title: 'Call Mensal - Status',
    type: 'call',
    duration: '30min',
    client: 'TechStart',
    date: '2025-01-20'
  },
  {
    id: '8',
    time: '10:30',
    title: 'Análise Operacional',
    type: 'analise',
    duration: '2h',
    client: 'LogiCorp',
    date: '2025-01-22'
  },
  {
    id: '9',
    time: '16:00',
    title: 'Apresentação Resultados',
    type: 'reuniao',
    duration: '1h',
    client: 'RetailMax',
    date: '2025-01-24'
  },
  {
    id: '10',
    time: '09:30',
    title: 'Due Diligence',
    type: 'analise',
    duration: '4h',
    client: 'InvestCorp',
    date: '2025-01-27'
  },
  {
    id: '11',
    time: '13:00',
    title: 'Call Semanal',
    type: 'call',
    duration: '45min',
    client: 'FinTech Solutions',
    date: '2025-01-29'
  },
  {
    id: '12',
    time: '15:30',
    title: 'Planejamento Fevereiro',
    type: 'reuniao',
    duration: '2h',
    client: 'Todos os Clientes',
    date: '2025-01-31'
  }
];

const agendaData = {
  hoje: hojeData,
  completa: eventosCompletos
};

export default function AgendaCard() {
  const [activeView, setActiveView] = useState<'hoje' | 'completa'>('hoje');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 15)); // Janeiro 2025, dia 15 (hoje)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reuniao': return <Video size={16} className="text-[#0A74DA]" />;
      case 'call': return <Video size={16} className="text-[#28A745]" />;
      case 'analise': return <FileText size={16} className="text-[#FFA500]" />;
      default: return <Calendar size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reuniao': return 'border-l-[#0A74DA] bg-[#0A74DA]/5';
      case 'call': return 'border-l-[#28A745] bg-[#28A745]/5';
      case 'analise': return 'border-l-[#FFA500] bg-[#FFA500]/5';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date(2025, 0, 15); // 15 de janeiro como "hoje"
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const currentDateIter = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDateIter.toISOString().split('T')[0];
      const dayEvents = eventosCompletos.filter(event => event.date === dateStr);
      
      days.push({
        date: currentDateIter.getDate(),
        isCurrentMonth: currentDateIter.getMonth() === month,
        events: dayEvents,
        isToday: currentDateIter.toDateString() === today.toDateString()
      });
      
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }
    
    return days;
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarView = () => {
    const calendarDays = generateCalendarDays();
    
    return (
      <div className="space-y-4">
        {/* Header do Calendário */}
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-[#003B6D]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors glass-button"
            >
              <ChevronLeft size={16} className="text-[#003B6D]" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors glass-button"
            >
              <ChevronRight size={16} className="text-[#003B6D]" />
            </button>
          </div>
        </div>

        {/* Dias da Semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Grid do Calendário */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                min-h-[80px] p-2 glass-card-subtle rounded-lg transition-all hover:bg-white/15
                ${day.isCurrentMonth ? 'opacity-100' : 'opacity-50'}
                ${day.isToday ? 'ring-2 ring-[#0A74DA] bg-[#0A74DA]/15 glass-glow' : ''}
              `}
            >
              <div className={`
                text-sm font-medium mb-1
                ${day.isToday ? 'text-[#0A74DA]' : 'text-[#003B6D]'}
              `}>
                {day.date}
              </div>
              
              {/* Eventos do Dia */}
              <div className="space-y-1">
                {day.events.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`
                      text-xs p-1 rounded border-l-2 truncate
                      ${event.type === 'reuniao' ? 'border-l-[#0A74DA] bg-[#0A74DA]/10 text-[#0A74DA]' : ''}
                      ${event.type === 'call' ? 'border-l-[#28A745] bg-[#28A745]/10 text-[#28A745]' : ''}
                      ${event.type === 'analise' ? 'border-l-[#FFA500] bg-[#FFA500]/10 text-[#FFA500]' : ''}
                    `}
                    title={`${event.time} - ${event.title} (${event.client})`}
                  >
                    {event.time} {event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{day.events.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legenda */}
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
    <div className="glass-card p-6 glass-glow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-xl">
            <Calendar size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#003B6D]">Agenda</h3>
        </div>
        
        <div className="flex glass-card-subtle rounded-xl p-1">
          <button
            onClick={() => setActiveView('hoje')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all glass-button ${
              activeView === 'hoje' 
                ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg transform scale-105' 
                : 'text-[#003B6D] hover:bg-white/20 hover:text-[#0A74DA]'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setActiveView('completa')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all glass-button ${
              activeView === 'completa' 
                ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg transform scale-105' 
                : 'text-[#003B6D] hover:bg-white/20 hover:text-[#0A74DA]'
            }`}
          >
            Completa
          </button>
        </div>
      </div>

      {activeView === 'hoje' ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {agendaData.hoje.map((item) => (
            <div
              key={item.id}
              className={`
                border-l-4 ${getTypeColor(item.type)} 
                p-4 rounded-r-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(item.type)}
                  <div>
                    <h4 className="font-semibold text-[#003B6D]">{item.title}</h4>
                    {item.client && (
                      <p className="text-sm text-gray-600">{item.client}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-[#003B6D] font-medium">
                    <Clock size={14} />
                    <span>{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        renderCalendarView()
      )}
    </div>
  );
}