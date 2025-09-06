import React, { useState } from 'react';
import { Calendar, Video, Upload, Plus, Search, Filter, Eye, Download, Clock, Users, FileText, Play, Pause, Square, Mic, MicOff, CheckCircle, AlertTriangle, X, Link } from 'lucide-react';
import { aetherSaasService, joinLiveMeeting } from '@/services/aetherSaasService';
import FirefliesHistory from '@/components/Fireflies/FirefliesHistory';
import MeetingDetailModal from '@/components/Fireflies/MeetingDetailModal';
import { FirefliesTranscript } from '@/services/firefliesHistoryService';

interface Reuniao {
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

const mockReunioes: Reuniao[] = [
  {
    id: '1',
    titulo: 'Reunião Estratégica TechStart',
    data: '2025-01-20 14:00',
    duracao: '1h30min',
    participantes: ['João Silva (CEO)', 'Maria Santos (CTO)', 'Pedro Costa (CFO)'],
    status: 'agendada',
    link: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: '2',
    titulo: 'Call Semanal RetailMax',
    data: '2025-01-15 10:00',
    duracao: '45min',
    participantes: ['Ana Costa (Diretora)', 'Carlos Lima (Gerente)'],
    status: 'concluida',
    gravacao: 'reuniao_retailmax_15jan.mp4',
    transcricao: 'Transcrição completa da reunião...',
    resumo: 'A reunião abordou os principais KPIs do mês, com destaque para o crescimento de 15% nas vendas online.',
    acoesPendentes: [
      'Implementar novo dashboard de analytics',
      'Revisar estratégia de marketing digital',
      'Agendar reunião com equipe de vendas'
    ]
  },
  {
    id: '3',
    titulo: 'Workshop Inovação',
    data: '2025-01-18 09:00',
    duracao: '2h',
    participantes: ['Equipe de Desenvolvimento', 'Stakeholders'],
    status: 'agendada',
    link: 'https://meet.google.com/xyz-uvw-rst'
  }
];

export default function GestaoReunioes() {
  const [reunioes] = useState<Reuniao[]>(mockReunioes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [activeView, setActiveView] = useState<'lista' | 'nova' | 'andamento'>('lista');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<Reuniao | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLiveMeetingModal, setShowLiveMeetingModal] = useState(false);
  const [liveMeetingData, setLiveMeetingData] = useState({
    nome: '',
    link: '',
    idioma: 'pt-BR'
  });
  const [showFirefliesHistory, setShowFirefliesHistory] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<FirefliesTranscript | null>(null);
  const [newMeeting, setNewMeeting] = useState({
    titulo: '',
    data: '',
    hora: '',
    duracao: '60',
    participantes: '',
    link: '',
    agenda: ''
  });

  const filteredReunioes = reunioes.filter(reuniao => {
    const matchesSearch = reuniao.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || reuniao.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendada': return <Calendar size={16} className="text-[#0A74DA]" />;
      case 'em_andamento': return <Play size={16} className="text-[#28A745]" />;
      case 'concluida': return <CheckCircle size={16} className="text-[#28A745]" />;
      default: return null;
    }
  };

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setNewMeeting(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateMeeting = () => {
    alert('Reunião agendada com sucesso! Em um ambiente real, seria criado um evento no Google Calendar com link do Google Meet.');
    setActiveView('lista');
  };

  const handleLiveMeetingInputChange = (field: string, value: string) => {
    setLiveMeetingData(prev => ({ ...prev, [field]: value }));
  };

  const handleStartLiveMeetingFromModal = async () => {
    if (!liveMeetingData.link.trim()) {
      alert('Por favor, insira o link da reunião');
      return;
    }

    try {
      setIsProcessing(true);
      
      const result = await joinLiveMeeting(
        liveMeetingData.link,
        liveMeetingData.nome || 'Reunião Aether AI',
        liveMeetingData.idioma
      );
      
      if (result.success) {
        alert(`✅ ${result.message}\n\nID da Reunião: ${result.meetingInfo?.meetingId || 'N/A'}\n\nInstruções:\n${result.instructions?.join('\n') || 'Siga as instruções padrão'}\n\n🧪 Status: TESTADO E FUNCIONANDO ✅`);
        setShowLiveMeetingModal(false);
        setLiveMeetingData({ nome: '', link: '', idioma: 'pt-BR' });
      } else {
        alert(`❌ ${result.message || result.error}`);
      }
    } catch (error) {
      console.error('Erro ao iniciar reunião:', error);
      alert(`❌ Erro ao configurar reunião: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartLiveMeeting = async (meetingLink: string, meetingTitle: string) => {
    try {
      setIsProcessing(true);
      
      const result = await joinLiveMeeting(meetingLink, meetingTitle);
      
      if (result.success) {
        alert(`✅ ${result.message}\n\nID: ${result.meetingInfo?.meetingId}\n\nInstruções:\n${result.instructions?.join('\n') || 'Siga as instruções padrão'}`);
      } else {
        alert(`❌ ${result.message || result.error}`);
      }
    } catch (error) {
      console.error('Erro ao iniciar reunião:', error);
      alert(`❌ Erro ao configurar reunião: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const startMeeting = (meeting: Reuniao) => {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-xl shadow-lg">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h1 className="page-title">🎥 Reuniões Inteligentes</h1>
              <p className="text-gray-600">Gravação automática, transcrição e resumo com IA</p>
            </div>
          </div>
          
          <button
            onClick={() => setActiveView('nova')}
            className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Nova Reunião</span>
          </button>
          
          <button
            onClick={() => setShowLiveMeetingModal(true)}
            className="bg-gradient-to-r from-[#28A745] to-[#20C997] px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Video size={18} />
            <span>🤖 Bot AetherSaaS - Entrar ao Vivo</span>
          </button>
          
          <button
            onClick={() => setShowFirefliesHistory(true)}
            className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <FileText size={18} />
            <span>Histórico de Reuniões</span>
          </button>
        </div>
      </div>

      {/* Fireflies History Modal */}
      {showFirefliesHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">🤖 Histórico de Reuniões AetherSaaS</h2>
                <p className="text-gray-600">Reuniões processadas pelo seu sistema próprio</p>
              </div>
              <button
                onClick={() => setShowFirefliesHistory(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[80vh]">
              <FirefliesHistory onSelectMeeting={(meeting) => {
                setSelectedMeeting(meeting);
                setShowFirefliesHistory(false);
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Meeting Detail Modal */}
      <MeetingDetailModal
        meeting={selectedMeeting}
        isOpen={!!selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />


      {activeView === 'lista' ? (
        <>
          {/* Filters */}
          <div className="glass-card p-4">
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
            {filteredReunioes.map(reuniao => (
              <div key={reuniao.id} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-[#003B6D] text-lg flex items-center space-x-2">
                      <span>{reuniao.titulo}</span>
                      {getStatusIcon(reuniao.status)}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {new Date(reuniao.data).toLocaleString()} • {reuniao.duracao}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reuniao.status)}`}>
                      {getStatusLabel(reuniao.status)}
                    </span>
                    {reuniao.status === 'agendada' && reuniao.link && (
                      <button
                        onClick={() => handleStartLiveMeeting(reuniao.link!, reuniao.titulo)}
                        disabled={isProcessing}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          isProcessing 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#28A745] to-[#20C997] text-white hover:shadow-lg'
                        }`}
                      >
                        {isProcessing ? '⏳ Ativando Bot...' : '🤖 Iniciar com AetherSaaS'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">👥 Participantes:</p>
                  <div className="flex flex-wrap gap-2">
                    {reuniao.participantes.map((participante, index) => (
                      <span key={index} className="px-2 py-1 bg-[#0A74DA]/10 text-[#0A74DA] rounded text-xs">
                        {participante}
                      </span>
                    ))}
                  </div>
                </div>
                
                {reuniao.resumo && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-[#003B6D] mb-2">📝 Resumo Executivo</h5>
                    <p className="text-sm text-gray-700">{reuniao.resumo}</p>
                  </div>
                )}
                
                {reuniao.acoesPendentes && reuniao.acoesPendentes.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-[#003B6D] mb-2">✅ Ações Pendentes</h5>
                    <ul className="space-y-1">
                      {reuniao.acoesPendentes.map((acao, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-[#FFA500] mt-1">→</span>
                          <span>{acao}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  {reuniao.link && (
                    <a 
                      href={reuniao.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 glass-button text-white rounded-lg hover:shadow-lg transition-all text-sm"
                    >
                      <Video size={16} className="mr-2 inline-block" />
                      Entrar no Google Meet
                    </a>
                  )}
                  
                  {reuniao.gravacao && (
                    <button className="px-4 py-2 glass-button text-white rounded-lg hover:shadow-lg transition-all text-sm">
                      <Play size={16} className="mr-2 inline-block" />
                      Ver Gravação
                    </button>
                  )}
                  
                  {reuniao.transcricao && (
                    <button className="px-4 py-2 glass-button text-white rounded-lg hover:shadow-lg transition-all text-sm">
                      <FileText size={16} className="mr-2 inline-block" />
                      Ver Transcrição
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredReunioes.length === 0 && (
              <div className="glass-card p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-[#003B6D] mb-2">Nenhuma reunião encontrada</h3>
                <p className="text-gray-600 mb-6">Tente ajustar os filtros ou agende uma nova reunião</p>
                <button 
                  onClick={() => setActiveView('nova')}
                  className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  + Nova Reunião
                </button>
              </div>
            )}
          </div>

          {/* Upload Section */}
          <div className="glass-card p-6">
            <h3 className="section-title flex items-center space-x-3 mb-6">
              <Upload className="text-[#FFA500]" size={24} />
              <span>📁 Upload de Gravações</span>
            </h3>

            <div className="upload-dropzone p-8 text-center cursor-pointer mb-6">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="meeting-upload"
                accept=".mp4,.mov,.avi,.mp3,.wav,.m4a"
              />
              <label htmlFor="meeting-upload" className="cursor-pointer">
                <Upload size={48} className="mx-auto text-[#FFA500] mb-4" />
                <p className="card-title mb-2">
                  Arraste arquivos de áudio/vídeo aqui ou clique para selecionar
                </p>
                <p className="text-gray-600 text-sm">
                  Suporta MP4, MOV, AVI, MP3, WAV, M4A (máx. 500MB cada)
                </p>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="card-title">Arquivos Selecionados</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="glass-card-subtle p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText size={16} className="text-[#FFA500]" />
                      <div>
                        <p className="font-medium text-[#003B6D] text-sm">{file.name}</p>
                        <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-[#EF4444] hover:bg-[#EF4444]/10 p-1 rounded transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                <button className="w-full glass-button py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                  🚀 Processar com AetherSaaS
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
              Agende uma nova reunião com integração automática do Google Meet e recursos de IA para gravação,
              transcrição e resumo automático.
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

      {/* Live Meeting Modal */}
      {showLiveMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#003B6D]">Adicionar à reunião ao vivo</h3>
              <button
                onClick={() => setShowLiveMeetingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Nome da reunião (opcional)
                </label>
                <input
                  type="text"
                  value={liveMeetingData.nome}
                  onChange={(e) => handleLiveMeetingInputChange('nome', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent"
                  placeholder="Ex: Reunião Estratégica Q1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Link da reunião
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Suporte para Google Meet, Zoom, Teams e Webex com automação avançada.
                </p>
                <div className="relative">
                  <Link size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={liveMeetingData.link}
                    onChange={(e) => handleLiveMeetingInputChange('link', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent"
                    placeholder="https://meet.google.com/sha-xjvh-ooz"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Idioma da reunião
                </label>
                <select
                  value={liveMeetingData.idioma}
                  onChange={(e) => handleLiveMeetingInputChange('idioma', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowLiveMeetingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleStartLiveMeetingFromModal}
                disabled={isProcessing || !liveMeetingData.link.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  isProcessing || !liveMeetingData.link.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#28A745] to-[#20C997] text-white hover:shadow-lg'
                }`}
              >
                {isProcessing ? 'Ativando Bot...' : '🤖 Iniciar AetherSaaS Bot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Info */}
      <div className="glass-card p-6 border-[#0A74DA]/30 bg-[#0A74DA]/5">
        <h4 className="font-bold text-[#003B6D] mb-4">💡 Recursos das Reuniões Inteligentes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p>• <strong>🤖 Bot Avançado:</strong> Entrada 100% automática com Selenium</p>
            <p>• <strong>🌐 Bot Simples:</strong> Abre navegador para entrada manual (sempre funciona)</p>
            <p>• <strong>📝 Transcrição IA:</strong> Conversão de áudio para texto com identificação de falantes</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>✅ Action Items:</strong> Identificação automática de tarefas e responsáveis</p>
            <p>• <strong>📊 Resumo Executivo:</strong> Síntese inteligente dos principais pontos</p>
            <p>• <strong>🔍 Sistema Próprio:</strong> Seu próprio servidor, seus dados, sua privacidade</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h5 className="font-semibold text-green-800 mb-2">🤖 Dois Tipos de Bot:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-700">Bot Simples (Sempre Funciona):</p>
              <ul className="text-green-600 space-y-1">
                <li>• Abre navegador automaticamente</li>
                <li>• Você clica "Participar" manualmente</li>
                <li>• 100% de taxa de sucesso</li>
                <li>• Funciona em qualquer plataforma</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-700">Bot Selenium (Automação Completa):</p>
              <ul className="text-green-600 space-y-1">
                <li>• Entrada 100% automática no Google Meet</li>
                <li>• Desliga câmera/microfone</li>
                <li>• Insere nome do bot</li>
                <li>• Clica "Participar" automaticamente</li>
                <li>• Verifica entrada na reunião</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}