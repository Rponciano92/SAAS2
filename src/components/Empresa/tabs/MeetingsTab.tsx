import React, { useState } from 'react';
import { EmpresaDetalhes } from '@/types/company';
import { Calendar, Video, Clock, Users, FileText, Play, Pause, Square, Mic, MicOff, Plus, Download, CheckCircle, Search, Filter } from 'lucide-react';

interface Meeting {
  id: string;
  titulo: string;
  data: string;
  duracao: string;
  participantes: string[];
  status: 'agendada' | 'em_andamento' | 'concluida';
  link?: string;
  gravacao?: string;
  transcricao?: string;
  resumo?: string;
  acoesPendentes?: string[];
}

interface MeetingsTabProps {
  company: EmpresaDetalhes;
}

export default function MeetingsTab({ company }: MeetingsTabProps) {
  const [activeView, setActiveView] = useState<'lista' | 'nova' | 'andamento'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Mock meetings data
  const mockMeetings: Meeting[] = [
    {
      id: '1',
      titulo: 'Planejamento Estratégico Q1',
      data: '2025-01-20 14:00',
      duracao: '1h30min',
      participantes: ['João Silva (CEO)', 'Maria Santos (CTO)', 'Pedro Costa (CFO)'],
      status: 'agendada',
      link: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      titulo: 'Revisão de KPIs Mensais',
      data: '2025-01-15 10:00',
      duracao: '45min',
      participantes: ['Ana Costa (Diretora)', 'Carlos Lima (Gerente)'],
      status: 'concluida',
      gravacao: 'reuniao_kpis_15jan.mp4',
      transcricao: 'Transcrição completa da reunião...',
      resumo: 'A reunião abordou os principais KPIs do mês, com destaque para o crescimento de 15% nas vendas online. Foram discutidas estratégias para melhorar a conversão e reduzir o CAC.',
      acoesPendentes: [
        'Implementar novo dashboard de analytics',
        'Revisar estratégia de marketing digital',
        'Agendar reunião com equipe de vendas'
      ]
    },
    {
      id: '3',
      titulo: 'Alinhamento Semanal',
      data: '2025-01-18 09:00',
      duracao: '30min',
      participantes: ['Equipe de Consultoria', 'Roberto Silva (CEO)'],
      status: 'agendada',
      link: 'https://meet.google.com/jkl-mnop-qrs'
    }
  ];
  
  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || meeting.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'text-[#0A74DA] bg-[#0A74DA]/10';
      case 'em_andamento': return 'text-[#28A745] bg-[#28A745]/10';
      case 'concluida': return 'text-[#B8860B] bg-[#B8860B]/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendada': return '📅 Agendada';
      case 'em_andamento': return '🔴 Em Andamento';
      case 'concluida': return '✅ Concluída';
      default: return status;
    }
  };
  
  const startMeeting = (meeting: Meeting) => {
    setActiveMeeting(meeting);
    setActiveView('andamento');
    setIsRecording(true);
  };
  
  const endMeeting = () => {
    setActiveMeeting(null);
    setActiveView('lista');
    setIsRecording(false);
    setIsMuted(false);
  };
  
  // Form state for new meeting
  const [newMeeting, setNewMeeting] = useState({
    titulo: '',
    data: '',
    hora: '',
    duracao: '60',
    participantes: '',
    agenda: ''
  });
  
  const handleInputChange = (field: string, value: string) => {
    setNewMeeting(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCreateMeeting = () => {
    // In a real app, this would create the meeting and integrate with Google Meet
    alert('Reunião agendada com sucesso! Em um ambiente real, seria criado um evento no Google Calendar com link do Google Meet.');
    setActiveView('lista');
  };

  return (
    <div className="space-y-6">
      {activeView === 'lista' ? (
        <>
          {/* Header with actions */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title flex items-center space-x-3">
              <Calendar className="text-[#0A74DA]" size={24} />
              <span>🎥 Reuniões Inteligentes</span>
            </h3>
            
            <button
              onClick={() => setActiveView('nova')}
              className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Agendar Reunião</span>
            </button>
          </div>
          
          {/* Filters */}
          <div className="glass-card p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar reuniões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-10 pr-4 py-2 w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="glass-input px-3 py-2"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="agendada">Agendadas</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluida">Concluídas</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Meetings List */}
          <div className="space-y-4">
            {filteredMeetings.map(meeting => (
              <div key={meeting.id} className="glass-card p-6 hover:transform hover:scale-102 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-[#003B6D] text-lg">{meeting.titulo}</h4>
                    <p className="text-gray-600 text-sm">
                      {new Date(meeting.data).toLocaleString()} • {meeting.duracao}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {getStatusLabel(meeting.status)}
                    </span>
                    {meeting.status === 'agendada' && (
                      <button
                        onClick={() => startMeeting(meeting)}
                        className="px-4 py-2 bg-gradient-to-r from-[#28A745] to-[#20C997] text-white rounded-lg hover:shadow-lg transition-all text-sm"
                      >
                        🚀 Iniciar
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">👥 Participantes:</p>
                  <div className="flex flex-wrap gap-2">
                    {meeting.participantes.map((participante, index) => (
                      <span key={index} className="px-2 py-1 bg-[#0A74DA]/10 text-[#0A74DA] rounded text-xs">
                        {participante}
                      </span>
                    ))}
                  </div>
                </div>
                
                {meeting.resumo && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-[#003B6D] mb-2">📝 Resumo Executivo</h5>
                    <p className="text-sm text-gray-700">{meeting.resumo}</p>
                  </div>
                )}
                
                {meeting.acoesPendentes && meeting.acoesPendentes.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-[#003B6D] mb-2">✅ Ações Pendentes</h5>
                    <ul className="space-y-1">
                      {meeting.acoesPendentes.map((acao, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-[#FFA500] mt-1">→</span>
                          <span>{acao}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  {meeting.link && (
                    <a 
                      href={meeting.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 glass-button text-white rounded-lg hover:shadow-lg transition-all text-sm"
                    >
                      <Video size={16} className="mr-2 inline-block" />
                      Entrar no Google Meet
                    </a>
                  )}
                  
                  {meeting.gravacao && (
                    <button className="px-4 py-2 glass-button text-white rounded-lg hover:shadow-lg transition-all text-sm">
                      <Play size={16} className="mr-2 inline-block" />
                      Ver Gravação
                    </button>
                  )}
                  
                  {meeting.transcricao && (
                    <button className="px-4 py-2 glass-button text-white rounded-lg hover:shadow-lg transition-all text-sm">
                      <FileText size={16} className="mr-2 inline-block" />
                      Ver Transcrição
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredMeetings.length === 0 && (
              <div className="glass-card p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-[#003B6D] mb-2">Nenhuma reunião encontrada</h3>
                <p className="text-gray-600 mb-6">Tente ajustar os filtros ou agende uma nova reunião</p>
                <button 
                  onClick={() => setActiveView('nova')}
                  className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  + Agendar Reunião
                </button>
              </div>
            )}
          </div>
        </>
      ) : activeView === 'nova' ? (
        <>
          {/* New Meeting Form */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title flex items-center space-x-3">
              <Plus className="text-[#28A745]" size={24} />
              <span>🎥 Agendar Nova Reunião</span>
            </h3>
            
            <button
              onClick={() => setActiveView('lista')}
              className="px-4 py-2 bg-white/10 text-[#003B6D] rounded-xl hover:bg-white/20 transition-colors"
            >
              Voltar para Lista
            </button>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <p className="text-gray-600 mb-6">
              Agende uma nova reunião com {company.nome}. A reunião será automaticamente integrada com o Google Meet
              e terá recursos de gravação, transcrição e resumo por IA.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Título da Reunião *
                </label>
                <input
                  type="text"
                  value={newMeeting.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  placeholder="Ex: Planejamento Estratégico Q1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#003B6D] mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={newMeeting.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                    className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#003B6D] mb-2">
                    Hora *
                  </label>
                  <input
                    type="time"
                    value={newMeeting.hora}
                    onChange={(e) => handleInputChange('hora', e.target.value)}
                    className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Duração (minutos) *
                </label>
                <select
                  value={newMeeting.duracao}
                  onChange={(e) => handleInputChange('duracao', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                >
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 hora e 30 minutos</option>
                  <option value="120">2 horas</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Participantes *
                </label>
                <input
                  type="text"
                  value={newMeeting.participantes}
                  onChange={(e) => handleInputChange('participantes', e.target.value)}
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  placeholder="Emails separados por vírgula"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                Agenda da Reunião
              </label>
              <textarea
                value={newMeeting.agenda}
                onChange={(e) => handleInputChange('agenda', e.target.value)}
                className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
                rows={4}
                placeholder="Descreva os tópicos a serem abordados na reunião..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleCreateMeeting}
                className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Calendar size={18} />
                <span>Agendar com Google Meet</span>
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6 border-[#0A74DA]/30 bg-[#0A74DA]/5">
            <h4 className="font-bold text-[#003B6D] mb-4">💡 Recursos de Reuniões Inteligentes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start space-x-3">
                <Video size={18} className="text-[#0A74DA] mt-1" />
                <div>
                  <p className="font-medium text-[#003B6D] mb-1">Integração com Google Meet</p>
                  <p className="text-gray-700">Link gerado automaticamente e enviado para todos os participantes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FileText size={18} className="text-[#0A74DA] mt-1" />
                <div>
                  <p className="font-medium text-[#003B6D] mb-1">Transcrição Automática</p>
                  <p className="text-gray-700">Conversão de áudio para texto com identificação de falantes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle size={18} className="text-[#0A74DA] mt-1" />
                <div>
                  <p className="font-medium text-[#003B6D] mb-1">Identificação de Ações</p>
                  <p className="text-gray-700">IA identifica automaticamente tarefas e responsáveis</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Download size={18} className="text-[#0A74DA] mt-1" />
                <div>
                  <p className="font-medium text-[#003B6D] mb-1">Resumo Executivo</p>
                  <p className="text-gray-700">Síntese inteligente dos principais pontos discutidos</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Active Meeting View */}
          {activeMeeting && (
            <div className="glass-card p-6 border-[#28A745]/30 bg-[#28A745]/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title flex items-center space-x-3">
                  <div className="w-3 h-3 bg-[#28A745] rounded-full animate-pulse"></div>
                  <span>🔴 Reunião em Andamento: {activeMeeting.titulo}</span>
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>00:23:45</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="glass-card-subtle p-4 mb-4">
                    <h4 className="font-semibold text-[#003B6D] mb-2">📝 Transcrição em Tempo Real</h4>
                    <div className="bg-white/20 p-3 rounded-lg h-32 overflow-y-auto text-sm">
                      <p className="text-gray-700 mb-2">
                        <strong>João Silva:</strong> "Então, sobre os resultados do último trimestre, conseguimos superar as expectativas em 15%..."
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong>Maria Santos:</strong> "Isso é excelente! O investimento em tecnologia realmente está dando resultado..."
                      </p>
                      <p className="text-gray-700 text-[#28A745]">
                        <strong>Você:</strong> "Perfeito. Vamos focar agora na estratégia para o próximo trimestre..." <span className="animate-pulse">|</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-full transition-all ${
                        isMuted ? 'bg-[#EF4444] text-white' : 'bg-white/20 text-[#003B6D] hover:bg-white/30'
                      }`}
                    >
                      {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-4 rounded-full transition-all ${
                        isRecording ? 'bg-[#EF4444] text-white' : 'bg-[#28A745] text-white'
                      }`}
                    >
                      {isRecording ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    
                    <button
                      onClick={endMeeting}
                      className="p-3 bg-[#EF4444] text-white rounded-full hover:bg-[#EF4444]/80 transition-all"
                    >
                      <Square size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="glass-card-subtle p-4">
                    <h4 className="font-semibold text-[#003B6D] mb-3">💡 Insights em Tempo Real</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <span className="text-[#28A745] mt-1">•</span>
                        <span>Sentimento geral: Positivo 😊</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-[#0A74DA] mt-1">•</span>
                        <span>Tópico principal: Resultados Q4</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-[#FFA500] mt-1">•</span>
                        <span>Próxima ação sugerida: Definir metas Q1</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card-subtle p-4">
                    <h4 className="font-semibold text-[#003B6D] mb-3">✅ Ações Identificadas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Revisar estratégia de marketing</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Agendar reunião com investidores</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Preparar apresentação de resultados</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card-subtle p-4">
                    <h4 className="font-semibold text-[#003B6D] mb-3">👥 Participantes</h4>
                    <div className="space-y-2 text-sm">
                      {activeMeeting.participantes.map((participante, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{participante}</span>
                          <div className="w-2 h-2 bg-[#28A745] rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}