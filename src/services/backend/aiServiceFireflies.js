/**
 * Fireflies.ai AI Service
 * Serviço especializado para processamento de IA com Fireflies
 */

import { firefliesApiClient } from './firefliesApiClient.js';
import { firefliesConfig } from './firefliesConfig.js';

class AIServiceFireflies {
  constructor() {
    this.apiClient = firefliesApiClient;
    this.config = firefliesConfig;
  }

  /**
   * Processa transcrição com IA para extrair insights
   * @param {string} transcriptionId - ID da transcrição
   * @returns {Promise<Object>} Insights extraídos
   */
  async processTranscriptionInsights(transcriptionId) {
    try {
      const query = `
        query GetTranscriptionInsights($id: ID!) {
          transcription(id: $id) {
            id
            title
            transcript
            summary
            keywords
            sentiments {
              overall
              segments {
                text
                sentiment
                confidence
              }
            }
            actionItems {
              text
              assignee
              dueDate
            }
            topics {
              name
              confidence
              mentions
            }
            speakers {
              name
              talkTime
              wordCount
            }
          }
        }
      `;

      const variables = { id: transcriptionId };
      const result = await this.apiClient.makeRequest(query, variables);
      
      return this.formatInsights(result.transcription);
    } catch (error) {
      console.error('Erro ao processar insights da transcrição:', error);
      throw new Error(`Falha ao processar insights: ${error.message}`);
    }
  }

  /**
   * Extrai action items automaticamente da transcrição
   * @param {string} transcriptionId - ID da transcrição
   * @returns {Promise<Array>} Lista de action items
   */
  async extractActionItems(transcriptionId) {
    try {
      const query = `
        query GetActionItems($id: ID!) {
          transcription(id: $id) {
            actionItems {
              text
              assignee
              dueDate
              priority
              status
            }
          }
        }
      `;

      const variables = { id: transcriptionId };
      const result = await this.apiClient.makeRequest(query, variables);
      
      return result.transcription.actionItems.map(item => ({
        id: this.generateActionItemId(),
        text: item.text,
        assignee: item.assignee || 'Não atribuído',
        dueDate: item.dueDate,
        priority: item.priority || 'medium',
        status: item.status || 'pending',
        extractedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erro ao extrair action items:', error);
      throw new Error(`Falha ao extrair action items: ${error.message}`);
    }
  }

  /**
   * Analisa sentimento da reunião
   * @param {string} transcriptionId - ID da transcrição
   * @returns {Promise<Object>} Análise de sentimento
   */
  async analyzeSentiment(transcriptionId) {
    try {
      const query = `
        query GetSentimentAnalysis($id: ID!) {
          transcription(id: $id) {
            sentiments {
              overall
              confidence
              segments {
                text
                sentiment
                confidence
                timestamp
              }
            }
          }
        }
      `;

      const variables = { id: transcriptionId };
      const result = await this.apiClient.makeRequest(query, variables);
      
      return this.processSentimentData(result.transcription.sentiments);
    } catch (error) {
      console.error('Erro ao analisar sentimento:', error);
      throw new Error(`Falha na análise de sentimento: ${error.message}`);
    }
  }

  /**
   * Gera resumo executivo da reunião
   * @param {string} transcriptionId - ID da transcrição
   * @param {Object} options - Opções de personalização
   * @returns {Promise<Object>} Resumo executivo
   */
  async generateExecutiveSummary(transcriptionId, options = {}) {
    try {
      const {
        includeActionItems = true,
        includeSentiment = true,
        includeKeyTopics = true,
        summaryLength = 'medium'
      } = options;

      const query = `
        query GetExecutiveSummary($id: ID!) {
          transcription(id: $id) {
            id
            title
            duration
            summary
            keywords
            topics {
              name
              confidence
              mentions
            }
            ${includeActionItems ? `
              actionItems {
                text
                assignee
                priority
              }
            ` : ''}
            ${includeSentiment ? `
              sentiments {
                overall
                confidence
              }
            ` : ''}
            speakers {
              name
              talkTime
              wordCount
            }
          }
        }
      `;

      const variables = { id: transcriptionId };
      const result = await this.apiClient.makeRequest(query, variables);
      
      return this.formatExecutiveSummary(result.transcription, options);
    } catch (error) {
      console.error('Erro ao gerar resumo executivo:', error);
      throw new Error(`Falha ao gerar resumo executivo: ${error.message}`);
    }
  }

  /**
   * Identifica tópicos principais da reunião
   * @param {string} transcriptionId - ID da transcrição
   * @returns {Promise<Array>} Lista de tópicos
   */
  async identifyTopics(transcriptionId) {
    try {
      const query = `
        query GetTopics($id: ID!) {
          transcription(id: $id) {
            topics {
              name
              confidence
              mentions
              keywords
              segments {
                text
                timestamp
              }
            }
          }
        }
      `;

      const variables = { id: transcriptionId };
      const result = await this.apiClient.makeRequest(query, variables);
      
      return result.transcription.topics
        .filter(topic => topic.confidence > 0.7)
        .sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Erro ao identificar tópicos:', error);
      throw new Error(`Falha ao identificar tópicos: ${error.message}`);
    }
  }

  /**
   * Busca inteligente em transcrições
   * @param {string} searchQuery - Termo de busca
   * @param {Object} filters - Filtros adicionais
   * @returns {Promise<Array>} Resultados da busca
   */
  async intelligentSearch(searchQuery, filters = {}) {
    try {
      const {
        dateFrom,
        dateTo,
        speakers,
        minDuration,
        maxDuration,
        sentiment
      } = filters;

      const query = `
        query IntelligentSearch($query: String!, $filters: SearchFilters) {
          searchTranscriptions(query: $query, filters: $filters) {
            id
            title
            summary
            keywords
            createdAt
            duration
            relevanceScore
            matchedSegments {
              text
              timestamp
              speaker
            }
            speakers {
              name
            }
          }
        }
      `;

      const variables = {
        query: searchQuery,
        filters: {
          ...(dateFrom && { dateFrom }),
          ...(dateTo && { dateTo }),
          ...(speakers && { speakers }),
          ...(minDuration && { minDuration }),
          ...(maxDuration && { maxDuration }),
          ...(sentiment && { sentiment })
        }
      };

      const result = await this.apiClient.makeRequest(query, variables);
      
      return result.searchTranscriptions.map(item => ({
        ...item,
        highlightedText: this.highlightSearchTerms(item.matchedSegments, searchQuery)
      }));
    } catch (error) {
      console.error('Erro na busca inteligente:', error);
      throw new Error(`Falha na busca inteligente: ${error.message}`);
    }
  }

  // Métodos auxiliares privados

  /**
   * Formata insights extraídos
   * @private
   */
  formatInsights(transcription) {
    return {
      id: transcription.id,
      title: transcription.title,
      summary: transcription.summary,
      keywords: transcription.keywords,
      sentiment: {
        overall: transcription.sentiments?.overall || 'neutral',
        confidence: transcription.sentiments?.confidence || 0,
        segments: transcription.sentiments?.segments || []
      },
      actionItems: transcription.actionItems || [],
      topics: transcription.topics || [],
      speakers: transcription.speakers || [],
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Processa dados de sentimento
   * @private
   */
  processSentimentData(sentiments) {
    if (!sentiments) {
      return {
        overall: 'neutral',
        confidence: 0,
        distribution: { positive: 0, neutral: 100, negative: 0 },
        timeline: []
      };
    }

    const segments = sentiments.segments || [];
    const distribution = this.calculateSentimentDistribution(segments);
    const timeline = this.createSentimentTimeline(segments);

    return {
      overall: sentiments.overall,
      confidence: sentiments.confidence,
      distribution,
      timeline,
      insights: this.generateSentimentInsights(sentiments.overall, distribution)
    };
  }

  /**
   * Calcula distribuição de sentimentos
   * @private
   */
  calculateSentimentDistribution(segments) {
    if (!segments.length) {
      return { positive: 0, neutral: 100, negative: 0 };
    }

    const counts = segments.reduce((acc, segment) => {
      acc[segment.sentiment] = (acc[segment.sentiment] || 0) + 1;
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
    return segments.map(segment => ({
      timestamp: segment.timestamp,
      sentiment: segment.sentiment,
      confidence: segment.confidence,
      text: segment.text.substring(0, 100) + '...'
    }));
  }

  /**
   * Gera insights de sentimento
   * @private
   */
  generateSentimentInsights(overall, distribution) {
    const insights = [];

    if (overall === 'positive') {
      insights.push('Reunião teve tom predominantemente positivo');
    } else if (overall === 'negative') {
      insights.push('Reunião apresentou desafios ou preocupações');
    }

    if (distribution.positive > 70) {
      insights.push('Alto engajamento e satisfação dos participantes');
    } else if (distribution.negative > 30) {
      insights.push('Pontos de tensão identificados que merecem atenção');
    }

    return insights;
  }

  /**
   * Formata resumo executivo
   * @private
   */
  formatExecutiveSummary(transcription, options) {
    const summary = {
      id: transcription.id,
      title: transcription.title,
      duration: transcription.duration,
      date: new Date().toISOString(),
      overview: transcription.summary,
      keyPoints: transcription.keywords?.slice(0, 5) || [],
      participants: transcription.speakers?.map(s => ({
        name: s.name,
        participation: this.calculateParticipationLevel(s.talkTime, transcription.duration)
      })) || []
    };

    if (options.includeActionItems && transcription.actionItems) {
      summary.actionItems = transcription.actionItems.map(item => ({
        task: item.text,
        assignee: item.assignee || 'Não atribuído',
        priority: item.priority || 'medium'
      }));
    }

    if (options.includeSentiment && transcription.sentiments) {
      summary.sentiment = {
        overall: transcription.sentiments.overall,
        confidence: transcription.sentiments.confidence
      };
    }

    if (options.includeKeyTopics && transcription.topics) {
      summary.keyTopics = transcription.topics
        .filter(topic => topic.confidence > 0.7)
        .slice(0, 5)
        .map(topic => topic.name);
    }

    return summary;
  }

  /**
   * Calcula nível de participação
   * @private
   */
  calculateParticipationLevel(talkTime, totalDuration) {
    if (!talkTime || !totalDuration) return 'low';
    
    const percentage = (talkTime / totalDuration) * 100;
    
    if (percentage > 40) return 'high';
    if (percentage > 20) return 'medium';
    return 'low';
  }

  /**
   * Destaca termos de busca
   * @private
   */
  highlightSearchTerms(segments, searchQuery) {
    return segments.map(segment => ({
      ...segment,
      highlightedText: segment.text.replace(
        new RegExp(searchQuery, 'gi'),
        `<mark>$&</mark>`
      )
    }));
  }

  /**
   * Gera ID único para action item
   * @private
   */
  generateActionItemId() {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const aiServiceFireflies = new AIServiceFireflies();
export default AIServiceFireflies;