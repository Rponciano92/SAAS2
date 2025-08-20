/**
 * Fireflies.ai API Client
 * Cliente para comunicação com a API GraphQL do Fireflies
 */

import { firefliesConfig } from './firefliesConfig.js';

class FirefliesApiClient {
  constructor() {
    this.config = firefliesConfig;
    this.baseUrl = this.config.apiUrl;
    this.apiKey = this.config.apiKey;
  }

  /**
   * Faz requisição GraphQL para a API do Fireflies
   * @param {string} query - Query ou mutation GraphQL
   * @param {Object} variables - Variáveis da query
   * @returns {Promise<Object>} Resposta da API
   */
  async makeRequest(query, variables = {}) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'Aether-AI/1.0'
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors[0].message}`);
      }

      return data.data;
    } catch (error) {
      console.error('Fireflies API Request Error:', error);
      throw new Error(`API Request failed: ${error.message}`);
    }
  }

  /**
   * Upload de arquivo de áudio/vídeo
   * @param {string} audioUrl - URL pública do arquivo
   * @param {string} title - Título da reunião
   * @param {Array} attendees - Lista de participantes
   * @returns {Promise<Object>} Resultado do upload
   */
  async uploadAudio(audioUrl, title, attendees = []) {
    const mutation = `
      mutation($input: AudioUploadInput) {
        uploadAudio(input: $input) {
          success
          title
          message
          id
        }
      }
    `;

    const variables = {
      input: {
        url: audioUrl,
        title: title,
        attendees: attendees.length > 0 ? attendees : [
          {
            displayName: "Consultor",
            email: "consultor@empresa.com"
          }
        ]
      }
    };

    return await this.makeRequest(mutation, variables);
  }

  /**
   * Busca transcrições
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Array>} Lista de transcrições
   */
  async getTranscriptions(filters = {}) {
    const {
      limit = 50,
      offset = 0,
      dateFrom,
      dateTo,
      status
    } = filters;

    const query = `
      query GetTranscriptions($limit: Int!, $offset: Int, $dateFrom: String, $dateTo: String, $status: String) {
        transcriptions(
          limit: $limit, 
          offset: $offset,
          dateFrom: $dateFrom,
          dateTo: $dateTo,
          status: $status
        ) {
          id
          title
          status
          duration
          createdAt
          updatedAt
          summary
          keywords
          participants {
            name
            email
          }
        }
      }
    `;

    const variables = {
      limit,
      offset,
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(status && { status })
    };

    return await this.makeRequest(query, variables);
  }

  /**
   * Obtém detalhes de uma transcrição específica
   * @param {string} transcriptionId - ID da transcrição
   * @returns {Promise<Object>} Detalhes da transcrição
   */
  async getTranscriptionDetails(transcriptionId) {
    const query = `
      query GetTranscriptionDetails($id: ID!) {
        transcription(id: $id) {
          id
          title
          status
          duration
          createdAt
          updatedAt
          transcript
          summary
          keywords
          participants {
            name
            email
            talkTime
            wordCount
          }
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
          actionItems {
            text
            assignee
            dueDate
            priority
            status
          }
          topics {
            name
            confidence
            mentions
            keywords
          }
        }
      }
    `;

    const variables = { id: transcriptionId };
    return await this.makeRequest(query, variables);
  }

  /**
   * Busca por termo específico
   * @param {string} searchTerm - Termo de busca
   * @param {Object} filters - Filtros adicionais
   * @returns {Promise<Array>} Resultados da busca
   */
  async searchTranscriptions(searchTerm, filters = {}) {
    const query = `
      query SearchTranscriptions($searchTerm: String!, $filters: SearchFilters) {
        searchTranscriptions(query: $searchTerm, filters: $filters) {
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
            confidence
          }
          participants {
            name
          }
        }
      }
    `;

    const variables = {
      searchTerm,
      filters
    };

    return await this.makeRequest(query, variables);
  }

  /**
   * Obtém estatísticas de uso
   * @param {Object} period - Período para estatísticas
   * @returns {Promise<Object>} Estatísticas
   */
  async getUsageStats(period = {}) {
    const {
      dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      dateTo = new Date().toISOString()
    } = period;

    const query = `
      query GetUsageStats($dateFrom: String!, $dateTo: String!) {
        usageStats(dateFrom: $dateFrom, dateTo: $dateTo) {
          totalTranscriptions
          totalDuration
          totalWords
          averageDuration
          topKeywords
          participantStats {
            totalParticipants
            averageParticipants
          }
          sentimentStats {
            positive
            neutral
            negative
          }
        }
      }
    `;

    const variables = { dateFrom, dateTo };
    return await this.makeRequest(query, variables);
  }

  /**
   * Deleta uma transcrição
   * @param {string} transcriptionId - ID da transcrição
   * @returns {Promise<Object>} Resultado da operação
   */
  async deleteTranscription(transcriptionId) {
    const mutation = `
      mutation DeleteTranscription($id: ID!) {
        deleteTranscription(id: $id) {
          success
          message
        }
      }
    `;

    const variables = { id: transcriptionId };
    return await this.makeRequest(mutation, variables);
  }

  /**
   * Atualiza metadados de uma transcrição
   * @param {string} transcriptionId - ID da transcrição
   * @param {Object} metadata - Novos metadados
   * @returns {Promise<Object>} Resultado da operação
   */
  async updateTranscriptionMetadata(transcriptionId, metadata) {
    const mutation = `
      mutation UpdateTranscriptionMetadata($id: ID!, $metadata: TranscriptionMetadataInput!) {
        updateTranscriptionMetadata(id: $id, metadata: $metadata) {
          success
          message
          transcription {
            id
            title
            summary
            keywords
          }
        }
      }
    `;

    const variables = {
      id: transcriptionId,
      metadata
    };

    return await this.makeRequest(mutation, variables);
  }

  /**
   * Verifica status da API
   * @returns {Promise<Object>} Status da API
   */
  async checkApiStatus() {
    const query = `
      query CheckApiStatus {
        apiStatus {
          status
          version
          uptime
          rateLimit {
            remaining
            resetTime
          }
        }
      }
    `;

    return await this.makeRequest(query);
  }

  /**
   * Obtém limites de rate limiting
   * @returns {Promise<Object>} Informações de rate limiting
   */
  async getRateLimits() {
    const query = `
      query GetRateLimits {
        rateLimits {
          requestsPerMinute
          requestsPerHour
          requestsPerDay
          current {
            minute
            hour
            day
          }
          resetTimes {
            minute
            hour
            day
          }
        }
      }
    `;

    return await this.makeRequest(query);
  }
}

export const firefliesApiClient = new FirefliesApiClient();
export default FirefliesApiClient;