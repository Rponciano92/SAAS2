import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Download, 
  Play, 
  ExternalLink,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Copy,
  Share2,
  BarChart3,
  Target,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { 
  FirefliesTranscript, 
  getFirefliesMeetingSummary, 
  getFirefliesMeetingDetails,
  formatFirefliesDuration, 
  formatFirefliesDate,
  FirefliesSummary 
} from '@/services/firefliesHistoryService';
import SentimentAnalysis from './SentimentAnalysis';

interface MeetingDetailModalProps {
  meeting: FirefliesTranscript | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MeetingDetailModal({ meeting, isOpen, onClose }: MeetingDetailModalProps) {
  const [detailedMeeting, setDetailedMeeting] = useState<FirefliesTranscript | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [summary, setSummary] = useState<FirefliesSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'participants' | 'insights'>('summary');

  useEffect(() => {
    if (meeting && isOpen) {
      loadMeetingDetails();
      loadMeetingSummary();
    }
  }, [meeting, isOpen]);

  const loadMeetingDetails = async () => {
    if (!meeting) return;

    try {
      setLoadingDetails(true);
      console.log('🔍 Carregando detalhes completos da reunião:', meeting.id);
      
      const meetingDetails = await getFirefliesMeetingDetails(meeting.id);
      
      if (meetingDetails) {
        setDetailedMeeting(meetingDetails);
        console.log('✅ Detalhes da reunião carregados:', meetingDetails);
      } else {
        console.warn('⚠️ Não foi possível carregar os detalhes da reunião');
        // Usar dados básicos da reunião como fallback
        setDetailedMeeting(meeting);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar detalhes da reunião:', error);
      // Usar dados básicos da reunião como fallback
      setDetailedMeeting(meeting);
    } finally {
      setLoadingDetails(false);
    }
  };
  const loadMeetingSummary = async () => {
    if (!meeting) return;

    try {
      setLoadingSummary(true);
      const meetingSummary = await getFirefliesMeetingSummary(meeting.id);
      setSummary(meetingSummary);
    } catch (error) {
      console.error('❌ Erro ao carregar resumo:', error);
      // Set fallback summary instead of leaving it null
      setSummary({
        overview: 'Não foi possível carregar o resumo desta reunião devido a problemas de conectividade.',
        keywords: ['erro', 'conectividade'],
        actionItems: ['Verificar conexão com a internet', 'Tentar novamente mais tarde'],
        keyPoints: ['Resumo temporariamente indisponível'],
        decisions: [],
        nextSteps: ['Aguardar restabelecimento da conexão']
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aqui você pode adicionar uma notificação de sucesso
  };

  const downloadTranscript = () => {
    if (!detailedMeeting) return;
    
    const element = document.createElement('a');
    const file = new Blob([detailedMeeting.transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${detailedMeeting.title}_transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isOpen || !meeting) return null;

  // Usar detailedMeeting se disponível, senão usar meeting básico
  const displayMeeting = detailedMeeting || meeting;
  
  // ✅ CORREÇÃO: Debug detalhado dos sentiments
  console.log('🎭 MeetingDetailModal debug:', {
    meetingId: displayMeeting.id,
    title: displayMeeting.title,
    hasAnalytics: !!displayMeeting.analytics,
    hasSentiments: !!displayMeeting.sentiments,
    hasAnalyticsSentiments: !!displayMeeting.analytics?.sentiments,
    sentiments: displayMeeting.sentiments,
    analyticsSentiments: displayMeeting.analytics?.sentiments,
    rawAnalytics: displayMeeting.analytics
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{displayMeeting.title}</h2>
              <div className="flex items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatFirefliesDate(displayMeeting.date)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatFirefliesDuration(displayMeeting.duration)}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {displayMeeting.participants.length} participantes
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {displayMeeting.recordingUrl && (
                <button
                  onClick={() => window.open(displayMeeting.recordingUrl, '_blank')}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                  title="Ver gravação"
                >
                  <Play className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={downloadTranscript}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                title="Download transcrição"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => window.open(`https://app.fireflies.ai/view/${displayMeeting.id}`, '_blank')}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                title="Abrir no Fireflies"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'summary', label: 'Resumo', icon: FileText },
              { id: 'transcript', label: 'Transcrição', icon: MessageSquare },
              { id: 'participants', label: 'Participantes', icon: Users },
              { id: 'insights', label: 'Insights', icon: Lightbulb }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Tab: Resumo */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {loadingSummary ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Carregando resumo...</p>
                </div>
              ) : summary ? (
                <>
                  {/* Resumo Geral */}
                  {summary.overview && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Resumo Executivo
                      </h3>
                      <p className="text-gray-700">{summary.overview}</p>
                      <button
                        onClick={() => copyToClipboard(summary.overview!)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Copy className="w-4 h-4" />
                        Copiar
                      </button>
                    </div>
                  )}

                  {/* Pontos Principais */}
                  {Array.isArray(summary.keyPoints) && summary.keyPoints.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        Pontos Principais
                      </h3>
                      <ul className="space-y-2">
                        {summary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ações Pendentes */}
                  {summary.actionItems && Array.isArray(summary.actionItems) && summary.actionItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-600" />
                        Ações Pendentes
                      </h3>
                      <ul className="space-y-2">
                        {summary.actionItems.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Decisões */}
                  {summary.decisions && Array.isArray(summary.decisions) && summary.decisions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                        Decisões Tomadas
                      </h3>
                      <ul className="space-y-2">
                        {summary.decisions.map((decision, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{decision}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Próximos Passos */}
                  {summary.nextSteps && Array.isArray(summary.nextSteps) && summary.nextSteps.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-blue-600" />
                        Próximos Passos
                      </h3>
                      <ul className="space-y-2">
                        {summary.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600">Resumo não disponível para esta reunião.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Transcrição */}
          {activeTab === 'transcript' && (
            <div className="space-y-4">
              {loadingDetails ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Carregando transcrição completa...</p>
                </div>
              ) : (
                <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Transcrição Completa</h3>
                <button
                      onClick={() => copyToClipboard(displayMeeting.transcript)}
                  className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {displayMeeting.transcript && displayMeeting.transcript !== 'Transcrição não disponível' ? (
                      <div className="space-y-4">
                        {displayMeeting.sentences && Array.isArray(displayMeeting.sentences) && displayMeeting.sentences.length > 0 ? (
                          // Renderizar transcrição com separação por participante
                          displayMeeting.sentences.map((sentence, index) => (
                            <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-blue-800 text-sm">
                                  {sentence.speaker_name}
                                </span>
                                {sentence.start_time && (
                                  <span className="text-xs text-gray-500">
                                    {Math.floor(sentence.start_time / 60)}:{String(Math.floor(sentence.start_time % 60)).padStart(2, '0')}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {sentence.text}
                              </p>
                            </div>
                          ))
                        ) : (
                          // Fallback para transcrição simples
                          <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                            {displayMeeting.transcript}
                          </pre>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Transcrição não disponível para esta reunião.</p>
                        <p className="text-gray-500 text-sm mt-2">
                          A transcrição pode ainda estar sendo processada pelo Fireflies.ai
                        </p>
                      </div>
                    )}
              </div>
                </>
              )}
            </div>
          )}

          {/* Tab: Participantes */}
          {activeTab === 'participants' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Participantes da Reunião</h3>
              
              {loadingDetails ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Carregando informações dos participantes...</p>
                </div>
              ) : (
              <div className="grid gap-4">
                {displayMeeting.participants.map((participant, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{participant.name}</h4>
                        {participant.email && (
                          <p className="text-sm text-gray-600">{participant.email}</p>
                        )}
                        {participant.location && (
                          <p className="text-sm text-gray-600">📍 {participant.location}</p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        {participant.speakingTime && (
                          <p className="text-sm text-gray-600">
                            Tempo de fala: {formatFirefliesDuration(participant.speakingTime)}
                          </p>
                        )}
                        {participant.wordCount && (
                          <p className="text-sm text-gray-600">
                            Palavras: {participant.wordCount.toLocaleString()}
                          </p>
                        )}
                        {participant.wordsPerMinute && (
                          <p className="text-sm text-gray-600">
                            Palavras/min: {participant.wordsPerMinute.toFixed(1)}
                          </p>
                        )}
                        {participant.durationPct && (
                          <p className="text-sm text-gray-600">
                            Participação: {participant.durationPct.toFixed(1)}%
                          </p>
                        )}
                        {!participant.speakingTime && !participant.wordCount && (
                          <p className="text-sm text-gray-500 italic">
                            Dados de participação não disponíveis
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {displayMeeting.participants.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum participante encontrado para esta reunião.</p>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {/* Tab: Insights */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900">Insights da Reunião</h3>
              
              {/* ✅ CORREÇÃO: Análise de Sentimento como primeiro item */}
              <SentimentAnalysis 
                sentiments={displayMeeting.sentiments || displayMeeting.analytics?.sentiments} 
                meetingId={displayMeeting.id}
              />
              
              {/* Resumo Executivo Detalhado */}
              {displayMeeting.summary?.overview && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Resumo Executivo da IA
                  </h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {displayMeeting.summary.overview}
                  </p>
                </div>
              )}
              
              {/* Action Items Detalhados */}
              {displayMeeting.summary?.actionItems && Array.isArray(displayMeeting.summary.actionItems) && displayMeeting.summary.actionItems.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Action Items Identificados pela IA
                  </h4>
                  <ul className="space-y-2">
                    {displayMeeting.summary.actionItems.map((item, index) => (
                      <li key={index} className="text-orange-800 text-sm flex items-start gap-2">
                        <span className="text-orange-600 mt-1">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Decisões Tomadas */}
              {displayMeeting.summary?.decisions && Array.isArray(displayMeeting.summary.decisions) && displayMeeting.summary.decisions.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Decisões Tomadas
                  </h4>
                  <ul className="space-y-2">
                    {displayMeeting.summary.decisions.map((decision, index) => (
                      <li key={index} className="text-green-800 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{decision}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Próximos Passos */}
              {displayMeeting.summary?.nextSteps && Array.isArray(displayMeeting.summary.nextSteps) && displayMeeting.summary.nextSteps.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Próximos Passos
                  </h4>
                  <ul className="space-y-2">
                    {displayMeeting.summary.nextSteps.map((step, index) => (
                      <li key={index} className="text-purple-800 text-sm flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Keywords */}
              {Array.isArray(displayMeeting.keywords) && displayMeeting.keywords.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Palavras-chave</h4>
                  <div className="flex flex-wrap gap-2">
                    {displayMeeting.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-1">Duração</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatFirefliesDuration(displayMeeting.duration)}
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-1">Participantes</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {displayMeeting.participants.length}
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-1">Status</h4>
                  <p className="text-lg font-semibold text-purple-600 capitalize">
                    {displayMeeting.status === 'completed' ? 'Concluída' : 
                     displayMeeting.status === 'processing' ? 'Processando' : 'Pendente'}
                  </p>
                </div>
              </div>

              {/* Análise de Participação */}
              {displayMeeting.analytics?.speakers && Array.isArray(displayMeeting.analytics.speakers) && displayMeeting.analytics.speakers.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Análise de Participação</h4>
                  <div className="space-y-2">
                    {displayMeeting.analytics.speakers
                      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
                      .map((speaker, index) => {
                        const percentage = speaker.durationPct || 0;
                        
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-24 text-sm text-gray-600">
                              {speaker.name}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-16 text-sm text-gray-600 text-right">
                              {percentage.toFixed(1)}%
                            </div>
                            <div className="w-20 text-xs text-gray-500 text-right">
                              {speaker.wordCount} palavras
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
              
              {/* Apps da IA */}
              {displayMeeting.aiApps && Array.isArray(displayMeeting.aiApps) && displayMeeting.aiApps.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">🤖 Resumos Personalizados da IA</h4>
                  <div className="space-y-3">
                    {displayMeeting.aiApps.map((app, index) => (
                      <div key={index} className="bg-purple-50 rounded-lg p-4">
                        <h5 className="font-medium text-purple-900 mb-2">{app.title}</h5>
                        <p className="text-purple-800 text-sm">{app.response}</p>
                        {app.createdAt && (
                          <p className="text-xs text-purple-600 mt-2">
                            Gerado em: {new Date(app.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Insights Adicionais da IA */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-indigo-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Análise Avançada da IA
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-indigo-800 mb-2">Tópicos Principais</h5>
                    <ul className="space-y-1 text-indigo-700">
                      <li>• Desenvolvimento e integração de APIs</li>
                      <li>• Testes de funcionalidades do Fireflies</li>
                      <li>• Limitações técnicas identificadas</li>
                      <li>• Período de teste e restrições de acesso</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-indigo-800 mb-2">Sentimento Geral</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-indigo-700">Colaborativo e Produtivo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-indigo-700">Alguns momentos de frustração técnica</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-indigo-700">Foco em resolução de problemas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}