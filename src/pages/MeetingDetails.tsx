import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Calendar, Zap, TrendingUp, CheckCircle, MessageSquare, Brain, Download, Play, Pause } from 'lucide-react';
import { getBotService } from '@/services/googleMeetBotService';

interface Meeting {
  id: string;
  title: string;
  status: string;
  platform: string;
  scheduled_at: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  meeting_url?: string;
  recording_url?: string;
  video_url?: string;
  audio_url?: string;
  transcription?: string;
  transcription_segments?: any[];
  analysis?: {
    summary?: string;
    keyTopics?: string[];
    actionItems?: string[];
    decisions?: string[];
    questions?: string[];
    sentiment?: string;
    speakerStats?: any[];
  };
  participants?: any[];
  client_id?: string;
}

export default function MeetingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'analysis'>('overview');
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    loadMeeting();
  }, [id]);

  const loadMeeting = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const botService = getBotService();
      const data = await botService.getMeeting(id);
      setMeeting(data);
    } catch (error) {
      console.error('Error loading meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      recording: 'bg-red-500/20 text-red-400 border-red-500/30',
      processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors.scheduled;
  };

  const getSentimentColor = (sentiment?: string) => {
    const colors: Record<string, string> = {
      positive: 'text-green-400',
      neutral: 'text-gray-400',
      negative: 'text-red-400',
      mixed: 'text-yellow-400',
    };
    return colors[sentiment || 'neutral'] || colors.neutral;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-gray-400">Carregando reunião...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Reunião não encontrada</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{meeting.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(meeting.scheduled_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatDuration(meeting.duration)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {meeting.participants?.length || 0} participantes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-lg border font-medium text-sm ${getStatusColor(meeting.status)}`}>
                {meeting.status.toUpperCase()}
              </span>
              {meeting.recording_url && (
                <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Zap },
              { id: 'transcript', label: 'Transcrição', icon: MessageSquare },
              { id: 'analysis', label: 'Análise IA', icon: Brain },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Audio Player */}
              {meeting.audio_url && (
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-cyan-400" />
                    Gravação de Áudio
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setAudioPlaying(!audioPlaying)}
                      className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center text-white transition-colors"
                    >
                      {audioPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-1/3" />
                    </div>
                    <span className="text-sm text-gray-400 min-w-[60px] text-right">
                      {formatDuration(meeting.duration)}
                    </span>
                  </div>
                </div>
              )}

              {/* Summary */}
              {meeting.analysis?.summary && (
                <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Resumo Executivo
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{meeting.analysis.summary}</p>
                </div>
              )}

              {/* Key Topics */}
              {meeting.analysis?.keyTopics && meeting.analysis.keyTopics.length > 0 && (
                <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Principais Tópicos
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {meeting.analysis.keyTopics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              {meeting.analysis?.actionItems && meeting.analysis.actionItems.length > 0 && (
                <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Action Items
                  </h3>
                  <div className="space-y-3">
                    {meeting.analysis.actionItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 group">
                        <div className="w-5 h-5 rounded border-2 border-green-500/50 group-hover:border-green-500 transition-colors mt-0.5" />
                        <p className="text-gray-300 flex-1">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sentiment */}
              {meeting.analysis?.sentiment && (
                <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Sentimento Geral</h3>
                  <p className={`text-2xl font-bold capitalize ${getSentimentColor(meeting.analysis.sentiment)}`}>
                    {meeting.analysis.sentiment}
                  </p>
                </div>
              )}

              {/* Decisions */}
              {meeting.analysis?.decisions && meeting.analysis.decisions.length > 0 && (
                <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Decisões Tomadas</h3>
                  <ul className="space-y-3">
                    {meeting.analysis.decisions.map((decision, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{decision}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions */}
              {meeting.analysis?.questions && meeting.analysis.questions.length > 0 && (
                <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Perguntas Levantadas</h3>
                  <ul className="space-y-3">
                    {meeting.analysis.questions.map((question, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transcript Tab */}
        {activeTab === 'transcript' && (
          <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Transcrição Completa</h2>
            {meeting.transcription ? (
              <div className="space-y-4">
                {meeting.transcription_segments && meeting.transcription_segments.length > 0 ? (
                  meeting.transcription_segments.map((segment: any, idx: number) => (
                    <div key={idx} className="flex gap-4 hover:bg-white/5 p-3 rounded-lg transition-colors">
                      <span className="text-sm text-gray-500 font-mono min-w-[80px]">
                        {Math.floor(segment.start / 60)}:{String(Math.floor(segment.start % 60)).padStart(2, '0')}
                      </span>
                      <p className="text-gray-300 leading-relaxed flex-1">{segment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{meeting.transcription}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Transcrição ainda não disponível</p>
              </div>
            )}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Análise por IA</h2>
                  <p className="text-gray-400 text-sm">Powered by GPT-4o-mini</p>
                </div>
              </div>

              {meeting.analysis ? (
                <div className="space-y-8">
                  {/* Full Analysis Display */}
                  <pre className="bg-black/30 border border-white/10 rounded-xl p-6 overflow-x-auto">
                    <code className="text-sm text-gray-300">{JSON.stringify(meeting.analysis, null, 2)}</code>
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Análise ainda não disponível</p>
                  <p className="text-sm text-gray-500 mt-2">A análise será gerada após a transcrição</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
