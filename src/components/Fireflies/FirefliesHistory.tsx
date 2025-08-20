import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Clock, 
  Users, 
  FileText, 
  Play, 
  Calendar,
  TrendingUp,
  BarChart3,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  getFirefliesTranscriptions, 
  searchFirefliesTranscriptions,
  getFirefliesMeetingStats,
  formatFirefliesDuration,
  formatFirefliesDate,
  FirefliesTranscript,
  FirefliesSearchResult
} from '@/services/firefliesHistoryService';

interface FirefliesHistoryProps {
  onSelectMeeting?: (meeting: FirefliesTranscript) => void;
}

export default function FirefliesHistory({ onSelectMeeting }: FirefliesHistoryProps) {
  const [meetings, setMeetings] = useState<FirefliesTranscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'processing' | 'recent'>('all');
  const [stats, setStats] = useState({
    totalMeetings: 0,
    totalDuration: 0,        // ✅ number, não string
    averageDuration: 0,      // ✅ number, não string
    recentMeetings: 0        // ✅ number, não array
  });
  const [error, setError] = useState<string | null>(null);

  // Carregar reuniões e estatísticas
  useEffect(() => {
    loadMeetings();
    loadStats();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result: FirefliesSearchResult = await getFirefliesTranscriptions(50, 0);
      setMeetings(result.transcripts);
      
      console.log('✅ Reuniões carregadas:', result.transcripts.length);
    } catch (error) {
      console.error('❌ Erro ao carregar reuniões:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('não configurada')) {
        setError('API key do Fireflies.ai não configurada. Configure VITE_FIREFLIES_API_KEY no arquivo .env');
      } else if (errorMessage.includes('Timeout')) {
        setError('Timeout na conexão. O Fireflies.ai pode estar temporariamente indisponível. Tente novamente.');
      } else if (errorMessage.includes('Erro de rede')) {
        setError('Erro de rede. Verifique sua conexão com a internet e tente novamente.');
      } else if (errorMessage.includes('autenticação')) {
        setError('Falha na autenticação. Verifique se sua API key é válida em https://app.fireflies.ai/integrations/custom/api');
      } else {
        setError(`Erro ao carregar reuniões: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const meetingStats = await getFirefliesMeetingStats();
      setStats(meetingStats);
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadMeetings();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await searchFirefliesTranscriptions(searchTerm, 50);
      setMeetings(result.transcripts);
      
      console.log('🔍 Busca realizada:', searchTerm, result.transcripts.length, 'resultados');
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      setError('Erro na busca. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMeetings = meetings.filter(meeting => {
    switch (selectedFilter) {
      case 'completed':
        return meeting.status === 'completed';
      case 'processing':
        return meeting.status === 'processing';
      case 'recent':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(meeting.date) >= sevenDaysAgo;
      default:
        return true;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'processing':
        return 'Processando';
      case 'failed':
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  };

  if (loading && meetings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando reuniões do Fireflies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Estatísticas */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Histórico Fireflies.ai
            </h2>
            <p className="text-gray-600">Reuniões gravadas e transcritas automaticamente</p>
          </div>
          <button
            onClick={loadMeetings}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Total de Reuniões</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalMeetings}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Tempo Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatFirefliesDuration(stats.totalDuration)}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">Duração Média</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatFirefliesDuration(Math.round(stats.averageDuration))}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Últimos 7 dias</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.recentMeetings}</p>
          </div>
        </div>
      </div>

      {/* Controles de Busca e Filtro */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar reuniões por título, participantes ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botão de Busca */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>

          {/* Filtros */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="completed">Concluídas</option>
              <option value="processing">Processando</option>
              <option value="recent">Últimos 7 dias</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Lista de Reuniões */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma reunião encontrada</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Tente ajustar os termos de busca.' : 'Suas reuniões aparecerão aqui após serem processadas pelo Fireflies.'}
            </p>
          </div>
        ) : (
          filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectMeeting?.(meeting)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                    {getStatusIcon(meeting.status)}
                    <span className="text-sm text-gray-600">{getStatusText(meeting.status)}</span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatFirefliesDate(meeting.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatFirefliesDuration(meeting.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {meeting.participants.length} participantes
                    </div>
                  </div>

                  {/* Participantes */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {meeting.participants.slice(0, 3).map((participant, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {participant.name}
                      </span>
                    ))}
                    {meeting.participants.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{meeting.participants.length - 3} mais
                      </span>
                    )}
                  </div>

                  {/* Resumo */}
                  {meeting.summary && (
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                     {meeting.summary.overview || 'Resumo não disponível'}
                    </p>
                  )}

                  {/* Keywords */}
                  {meeting.keywords && meeting.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {meeting.keywords.slice(0, 5).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMeeting?.(meeting);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {meeting.recordingUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(meeting.recordingUrl, '_blank');
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Ver gravação"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Implementar download da transcrição
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://app.fireflies.ai/view/${meeting.id}`, '_blank');
                    }}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Abrir no Fireflies"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading indicator para busca */}
      {loading && meetings.length > 0 && (
        <div className="text-center py-4">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
        </div>
      )}
    </div>
  );
}