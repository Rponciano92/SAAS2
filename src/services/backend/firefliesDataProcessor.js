/**
 * Fireflies Data Processor
 * Processa e transforma dados do Fireflies para o formato da aplicação
 */

import { firefliesConfig } from './firefliesConfig.js';

class FirefliesDataProcessor {
  constructor() {
    this.config = firefliesConfig;
  }

  /**
   * Processa dados brutos de transcrição
   * @param {Object} rawTranscription - Dados brutos do Fireflies
   * @returns {Object} Transcrição processada
   */
  processTranscription(rawTranscription) {
    try {
      return {
        id: rawTranscription.id,
        title: this.sanitizeTitle(rawTranscription.title),
        status: this.normalizeStatus(rawTranscription.status),
        duration: this.formatDuration(rawTranscription.duration),
        date: this.formatDate(rawTranscription.createdAt),
        transcript: this.processTranscriptText(rawTranscription.transcript),
        summary: this.processSummary(rawTranscription.summary),
        keywords: this.processKeywords(rawTranscription.keywords),
        participants: this.processParticipants(rawTranscription.participants),
        fileType: this.detectFileType(rawTranscription),
        fileSize: this.formatFileSize(rawTranscription.fileSize),
        confidence: rawTranscription.confidence || 0,
        language: rawTranscription.language || 'pt-BR',
        processedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao processar transcrição:', error);
      throw new Error(`Falha no processamento da transcrição: ${error.message}`);
    }
  }

  /**
   * Processa dados de sentimento
   * @param {Object} rawSentiments - Dados brutos de sentimento
   * @returns {Object} Sentimentos processados
   */
  processSentiments(rawSentiments) {
    if (!rawSentiments) {
      return this.getDefaultSentiments();
    }

    try {
      return {
        overall: this.normalizeSentiment(rawSentiments.overall),
        confidence: Math.round((rawSentiments.confidence || 0) * 100),
        distribution: this.calculateSentimentDistribution(rawSentiments.segments),
        timeline: this.createSentimentTimeline(rawSentiments.segments),
        insights: this.generateSentimentInsights(rawSentiments),
        processedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao processar sentimentos:', error);
      return this.getDefaultSentiments();
    }
  }

  /**
   * Processa action items
   * @param {Array} rawActionItems - Action items brutos
   * @returns {Array} Action items processados
   */
  processActionItems(rawActionItems) {
    if (!Array.isArray(rawActionItems)) {
      return [];
    }

    try {
      return rawActionItems.map((item, index) => ({
        id: this.generateActionItemId(index),
        text: this.sanitizeText(item.text),
        assignee: this.processAssignee(item.assignee),
        dueDate: this.processDueDate(item.dueDate),
        priority: this.normalizePriority(item.priority),
        status: this.normalizeActionItemStatus(item.status),
        confidence: item.confidence || 0,
        extractedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erro ao processar action items:', error);
      return [];
    }
  }

  /**
   * Processa tópicos identificados
   * @param {Array} rawTopics - Tópicos brutos
   * @returns {Array} Tópicos processados
   */
  processTopics(rawTopics) {
    if (!Array.isArray(rawTopics)) {
      return [];
    }

    try {
      return rawTopics
        .filter(topic => topic.confidence > 0.5)
        .map(topic => ({
          id: this.generateTopicId(topic.name),
          name: this.sanitizeText(topic.name),
          confidence: Math.round((topic.confidence || 0) * 100),
          mentions: topic.mentions || 0,
          keywords: this.processKeywords(topic.keywords),
          segments: this.processTopicSegments(topic.segments),
          category: this.categorizeTopicByName(topic.name)
        }))
        .sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Erro ao processar tópicos:', error);
      return [];
    }
  }

  /**
   * Processa dados de participantes
   * @param {Array} rawParticipants - Participantes brutos
   * @returns {Array} Participantes processados
   */
  processParticipants(rawParticipants) {
    if (!Array.isArray(rawParticipants)) {
      return [];
    }

    try {
      const totalTalkTime = rawParticipants.reduce((sum, p) => sum + (p.talkTime || 0), 0);

      return rawParticipants.map(participant => ({
        id: this.generateParticipantId(participant.name),
        name: this.sanitizeName(participant.name),
        email: participant.email || null,
        talkTime: this.formatDuration(participant.talkTime),
        talkTimeSeconds: participant.talkTime || 0,
        wordCount: participant.wordCount || 0,
        participationPercentage: totalTalkTime > 0 
          ? Math.round((participant.talkTime || 0) / totalTalkTime * 100)
          : 0,
        role: this.inferParticipantRole(participant)
      }));
    } catch (error) {
      console.error('Erro ao processar participantes:', error);
      return [];
    }
  }

  /**
   * Processa resultados de busca
   * @param {Array} rawResults - Resultados brutos
   * @param {string} searchQuery - Termo de busca
   * @returns {Array} Resultados processados
   */
  processSearchResults(rawResults, searchQuery) {
    if (!Array.isArray(rawResults)) {
      return [];
    }

    try {
      return rawResults.map(result => ({
        id: result.id,
        title: this.sanitizeTitle(result.title),
        summary: this.processSummary(result.summary),
        keywords: this.processKeywords(result.keywords),
        date: this.formatDate(result.createdAt),
        duration: this.formatDuration(result.duration),
        relevanceScore: Math.round((result.relevanceScore || 0) * 100),
        matchedSegments: this.processMatchedSegments(result.matchedSegments, searchQuery),
        participants: this.processParticipants(result.participants),
        highlightedText: this.highlightSearchTerms(result.summary, searchQuery)
      }));
    } catch (error) {
      console.error('Erro ao processar resultados de busca:', error);
      return [];
    }
  }

  // Métodos auxiliares privados

  /**
   * Sanitiza título
   * @private
   */
  sanitizeTitle(title) {
    if (!title) return 'Reunião sem título';
    return title.trim().substring(0, 100);
  }

  /**
   * Sanitiza texto geral
   * @private
   */
  sanitizeText(text) {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  /**
   * Sanitiza nome de pessoa
   * @private
   */
  sanitizeName(name) {
    if (!name) return 'Participante';
    return name.trim().replace(/[^a-zA-ZÀ-ÿ\s]/g, '').substring(0, 50);
  }

  /**
   * Normaliza status
   * @private
   */
  normalizeStatus(status) {
    const statusMap = {
      'completed': 'completed',
      'processing': 'processing',
      'failed': 'failed',
      'pending': 'processing',
      'error': 'failed'
    };
    return statusMap[status] || 'processing';
  }

  /**
   * Normaliza sentimento
   * @private
   */
  normalizeSentiment(sentiment) {
    const sentimentMap = {
      'positive': 'positive',
      'negative': 'negative',
      'neutral': 'neutral',
      'mixed': 'neutral'
    };
    return sentimentMap[sentiment] || 'neutral';
  }

  /**
   * Normaliza prioridade
   * @private
   */
  normalizePriority(priority) {
    const priorityMap = {
      'high': 'high',
      'medium': 'medium',
      'low': 'low',
      'urgent': 'high',
      'normal': 'medium'
    };
    return priorityMap[priority] || 'medium';
  }

  /**
   * Normaliza status de action item
   * @private
   */
  normalizeActionItemStatus(status) {
    const statusMap = {
      'pending': 'pending',
      'in_progress': 'in_progress',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'open': 'pending',
      'done': 'completed'
    };
    return statusMap[status] || 'pending';
  }

  /**
   * Formata duração
   * @private
   */
  formatDuration(seconds) {
    if (!seconds || seconds === 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Formata data
   * @private
   */
  formatDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  }

  /**
   * Formata tamanho do arquivo
   * @private
   */
  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  /**
   * Detecta tipo de arquivo
   * @private
   */
  detectFileType(transcription) {
    const fileName = transcription.fileName || transcription.title || '';
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    return videoExtensions.includes(extension) ? 'video' : 'audio';
  }

  /**
   * Processa texto da transcrição
   * @private
   */
  processTranscriptText(transcript) {
    if (!transcript) return '';
    
    // Limpar e formatar texto
    return transcript
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n');
  }

  /**
   * Processa resumo
   * @private
   */
  processSummary(summary) {
    if (!summary) return '';
    return this.sanitizeText(summary).substring(0, 500);
  }

  /**
   * Processa palavras-chave
   * @private
   */
  processKeywords(keywords) {
    if (!Array.isArray(keywords)) return [];
    
    return keywords
      .map(keyword => this.sanitizeText(keyword))
      .filter(keyword => keyword.length > 2)
      .slice(0, 20);
  }

  /**
   * Calcula distribuição de sentimentos
   * @private
   */
  calculateSentimentDistribution(segments) {
    if (!Array.isArray(segments) || segments.length === 0) {
      return { positive: 0, neutral: 100, negative: 0 };
    }

    const counts = segments.reduce((acc, segment) => {
      const sentiment = this.normalizeSentiment(segment.sentiment);
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});

    const total = segments.length;
    return {
      positive: Math.round((counts.positive || 0) / total * 100),
      neutral: Math.round((counts.neutral || 0) / total * 100),
      negative: Math.round((counts.negative || 0) / total * 100)
    };
  }

  /**
   * Cria timeline de sentimentos
   * @private
   */
  createSentimentTimeline(segments) {
    if (!Array.isArray(segments)) return [];
    
    return segments
      .map(segment => ({
        timestamp: segment.timestamp || 0,
        sentiment: this.normalizeSentiment(segment.sentiment),
        confidence: Math.round((segment.confidence || 0) * 100),
        text: this.sanitizeText(segment.text).substring(0, 100)
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Gera insights de sentimento
   * @private
   */
  generateSentimentInsights(sentiments) {
    const insights = [];
    const overall = this.normalizeSentiment(sentiments.overall);
    const confidence = sentiments.confidence || 0;

    if (overall === 'positive' && confidence > 0.7) {
      insights.push('Reunião teve tom predominantemente positivo e construtivo');
    } else if (overall === 'negative' && confidence > 0.7) {
      insights.push('Reunião apresentou tensões ou preocupações significativas');
    } else if (overall === 'neutral') {
      insights.push('Reunião manteve tom neutro e profissional');
    }

    if (confidence < 0.5) {
      insights.push('Análise de sentimento com baixa confiança - revisar manualmente');
    }

    return insights;
  }

  /**
   * Processa assignee de action item
   * @private
   */
  processAssignee(assignee) {
    if (!assignee) return 'Não atribuído';
    return this.sanitizeName(assignee);
  }

  /**
   * Processa data de vencimento
   * @private
   */
  processDueDate(dueDate) {
    if (!dueDate) return null;
    
    try {
      return new Date(dueDate).toISOString().split('T')[0];
    } catch (error) {
      return null;
    }
  }

  /**
   * Processa segmentos de tópicos
   * @private
   */
  processTopicSegments(segments) {
    if (!Array.isArray(segments)) return [];
    
    return segments.map(segment => ({
      text: this.sanitizeText(segment.text).substring(0, 200),
      timestamp: segment.timestamp || 0,
      confidence: Math.round((segment.confidence || 0) * 100)
    }));
  }

  /**
   * Categoriza tópico por nome
   * @private
   */
  categorizeTopicByName(topicName) {
    const name = topicName.toLowerCase();
    
    if (name.includes('vendas') || name.includes('receita') || name.includes('faturamento')) {
      return 'vendas';
    } else if (name.includes('estratégia') || name.includes('planejamento')) {
      return 'estrategia';
    } else if (name.includes('operação') || name.includes('processo')) {
      return 'operacoes';
    } else if (name.includes('marketing') || name.includes('campanha')) {
      return 'marketing';
    } else if (name.includes('financeiro') || name.includes('orçamento')) {
      return 'financeiro';
    }
    
    return 'geral';
  }

  /**
   * Infere papel do participante
   * @private
   */
  inferParticipantRole(participant) {
    const name = (participant.name || '').toLowerCase();
    const email = (participant.email || '').toLowerCase();
    
    if (name.includes('ceo') || name.includes('presidente')) {
      return 'CEO';
    } else if (name.includes('diretor') || email.includes('diretor')) {
      return 'Diretor';
    } else if (name.includes('gerente') || email.includes('gerente')) {
      return 'Gerente';
    } else if (name.includes('consultor') || email.includes('consultor')) {
      return 'Consultor';
    }
    
    return 'Participante';
  }

  /**
   * Processa segmentos correspondentes na busca
   * @private
   */
  processMatchedSegments(segments, searchQuery) {
    if (!Array.isArray(segments)) return [];
    
    return segments.map(segment => ({
      text: this.sanitizeText(segment.text),
      timestamp: segment.timestamp || 0,
      speaker: this.sanitizeName(segment.speaker),
      confidence: Math.round((segment.confidence || 0) * 100),
      highlighted: this.highlightSearchTerms(segment.text, searchQuery)
    }));
  }

  /**
   * Destaca termos de busca
   * @private
   */
  highlightSearchTerms(text, searchQuery) {
    if (!text || !searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Retorna sentimentos padrão
   * @private
   */
  getDefaultSentiments() {
    return {
      overall: 'neutral',
      confidence: 0,
      distribution: { positive: 0, neutral: 100, negative: 0 },
      timeline: [],
      insights: ['Análise de sentimento não disponível'],
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Gera ID para action item
   * @private
   */
  generateActionItemId(index) {
    return `action_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Gera ID para tópico
   * @private
   */
  generateTopicId(topicName) {
    const sanitized = topicName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `topic_${sanitized}_${Date.now()}`;
  }

  /**
   * Gera ID para participante
   * @private
   */
  generateParticipantId(name) {
    const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `participant_${sanitized}_${Date.now()}`;
  }
}

export const firefliesDataProcessor = new FirefliesDataProcessor();
export default FirefliesDataProcessor;