/**
 * Fireflies Backend Services - Index
 * Ponto de entrada centralizado para todos os serviços backend do Fireflies
 */

// Importar todos os serviços
import { aiServiceFireflies } from './aiServiceFireflies.js';
import { firefliesApiClient } from './firefliesApiClient.js';
import { firefliesConfig } from './firefliesConfig.js';
import { firefliesStorageService } from './firefliesStorageService.js';
import { firefliesWebhookService } from './firefliesWebhookService.js';
import { firefliesDataProcessor } from './firefliesDataProcessor.js';

/**
 * Classe principal que orquestra todos os serviços Fireflies
 */
class FirefliesBackendService {
  constructor() {
    this.ai = aiServiceFireflies;
    this.api = firefliesApiClient;
    this.config = firefliesConfig;
    this.storage = firefliesStorageService;
    this.webhook = firefliesWebhookService;
    this.processor = firefliesDataProcessor;
    
    this.initialized = false;
  }

  /**
   * Inicializa todos os serviços
   * @returns {Promise<boolean>} Sucesso da inicialização
   */
  async initialize() {
    try {
      console.log('🚀 Inicializando serviços Fireflies...');
      
      // Verificar configuração
      if (!this.config.isConfigured) {
        console.warn('⚠️ Fireflies não está completamente configurado');
        return false;
      }

      // Verificar/criar bucket de storage
      await this.storage.ensureBucketExists();
      
      // Configurar webhooks
      await this.webhook.setupWebhook();
      
      // Verificar status da API
      try {
        await this.api.checkApiStatus();
        console.log('✅ API Fireflies conectada com sucesso');
      } catch (error) {
        console.warn('⚠️ Não foi possível verificar status da API:', error.message);
      }

      this.initialized = true;
      console.log('✅ Serviços Fireflies inicializados com sucesso');
      
      return true;
    } catch (error) {
      console.error('❌ Erro na inicialização dos serviços Fireflies:', error);
      return false;
    }
  }

  /**
   * Fluxo completo de upload e processamento
   * @param {File} file - Arquivo de áudio/vídeo
   * @param {Object} options - Opções de processamento
   * @returns {Promise<Object>} Resultado do processamento
   */
  async uploadAndProcess(file, options = {}) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const {
        title = `Reunião ${new Date().toLocaleDateString()}`,
        attendees = [],
        enableInsights = true,
        enableSentiment = true,
        enableActionItems = true
      } = options;

      console.log('📁 Iniciando upload e processamento:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        title
      });

      // 1. Upload para storage
      const fileUrl = await this.storage.uploadFile(file, {
        folder: 'meetings',
        generateUniqueName: true
      });

      // 2. Enviar para Fireflies
      const uploadResult = await this.api.uploadAudio(fileUrl, title, attendees);
      
      if (!uploadResult.uploadAudio.success) {
        throw new Error(uploadResult.uploadAudio.message || 'Falha no upload para Fireflies');
      }

      const transcriptionId = uploadResult.uploadAudio.id;

      // 3. Retornar informações iniciais
      const result = {
        transcriptionId,
        status: 'processing',
        fileUrl,
        title,
        uploadedAt: new Date().toISOString(),
        processingOptions: {
          enableInsights,
          enableSentiment,
          enableActionItems
        }
      };

      // 4. Processar insights em background (se habilitado)
      if (enableInsights) {
        this.processInsightsInBackground(transcriptionId, {
          enableSentiment,
          enableActionItems
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Erro no upload e processamento:', error);
      throw new Error(`Falha no upload e processamento: ${error.message}`);
    }
  }

  /**
   * Obtém transcrição completa processada
   * @param {string} transcriptionId - ID da transcrição
   * @returns {Promise<Object>} Transcrição processada
   */
  async getProcessedTranscription(transcriptionId) {
    try {
      // Obter dados brutos da API
      const rawData = await this.api.getTranscriptionDetails(transcriptionId);
      
      // Processar dados
      const transcription = this.processor.processTranscription(rawData.transcription);
      const sentiments = this.processor.processSentiments(rawData.transcription.sentiments);
      const actionItems = this.processor.processActionItems(rawData.transcription.actionItems);
      const topics = this.processor.processTopics(rawData.transcription.topics);
      const participants = this.processor.processParticipants(rawData.transcription.participants);

      return {
        ...transcription,
        sentiments,
        actionItems,
        topics,
        participants,
        processedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao obter transcrição processada:', error);
      throw new Error(`Falha ao obter transcrição: ${error.message}`);
    }
  }

  /**
   * Busca inteligente em transcrições
   * @param {string} query - Termo de busca
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Array>} Resultados processados
   */
  async searchTranscriptions(query, filters = {}) {
    try {
      const rawResults = await this.api.searchTranscriptions(query, filters);
      return this.processor.processSearchResults(rawResults.searchTranscriptions, query);
    } catch (error) {
      console.error('Erro na busca de transcrições:', error);
      throw new Error(`Falha na busca: ${error.message}`);
    }
  }

  /**
   * Obtém estatísticas consolidadas
   * @param {Object} period - Período para estatísticas
   * @returns {Promise<Object>} Estatísticas consolidadas
   */
  async getConsolidatedStats(period = {}) {
    try {
      const [usageStats, storageStats, webhookStats] = await Promise.allSettled([
        this.api.getUsageStats(period),
        this.storage.getStorageStats(),
        this.webhook.getWebhookStats(period)
      ]);

      return {
        usage: usageStats.status === 'fulfilled' ? usageStats.value : null,
        storage: storageStats.status === 'fulfilled' ? storageStats.value : null,
        webhooks: webhookStats.status === 'fulfilled' ? webhookStats.value : null,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas consolidadas:', error);
      throw new Error(`Falha ao obter estatísticas: ${error.message}`);
    }
  }

  /**
   * Processa insights em background
   * @private
   */
  async processInsightsInBackground(transcriptionId, options) {
    try {
      // Aguardar um pouco para a transcrição estar pronta
      setTimeout(async () => {
        try {
          console.log('🧠 Processando insights em background para:', transcriptionId);
          
          const insights = await this.ai.processTranscriptionInsights(transcriptionId);
          
          if (options.enableSentiment) {
            await this.ai.analyzeSentiment(transcriptionId);
          }
          
          if (options.enableActionItems) {
            await this.ai.extractActionItems(transcriptionId);
          }
          
          console.log('✅ Insights processados com sucesso:', transcriptionId);
        } catch (error) {
          console.error('❌ Erro no processamento de insights:', error);
        }
      }, 5000); // Aguardar 5 segundos
    } catch (error) {
      console.error('Erro ao iniciar processamento em background:', error);
    }
  }

  /**
   * Limpa recursos e dados antigos
   * @param {Object} options - Opções de limpeza
   * @returns {Promise<Object>} Resultado da limpeza
   */
  async cleanup(options = {}) {
    try {
      const {
        cleanStorage = true,
        daysOld = 30,
        cleanWebhookEvents = true
      } = options;

      const results = {};

      if (cleanStorage) {
        results.deletedFiles = await this.storage.cleanupOldFiles(daysOld);
      }

      if (cleanWebhookEvents) {
        // Implementar limpeza de eventos de webhook antigos
        results.cleanedWebhookEvents = 0; // Placeholder
      }

      console.log('🧹 Limpeza concluída:', results);
      return results;
    } catch (error) {
      console.error('Erro na limpeza:', error);
      throw new Error(`Falha na limpeza: ${error.message}`);
    }
  }

  /**
   * Verifica saúde de todos os serviços
   * @returns {Promise<Object>} Status de saúde
   */
  async healthCheck() {
    const health = {
      overall: 'healthy',
      services: {},
      timestamp: new Date().toISOString()
    };

    try {
      // Verificar configuração
      health.services.config = {
        status: this.config.isConfigured ? 'healthy' : 'warning',
        details: this.config.isConfigured ? 'Configurado' : 'Configuração incompleta'
      };

      // Verificar API
      try {
        await this.api.checkApiStatus();
        health.services.api = { status: 'healthy', details: 'API respondendo' };
      } catch (error) {
        health.services.api = { status: 'error', details: error.message };
        health.overall = 'degraded';
      }

      // Verificar storage
      try {
        await this.storage.getStorageStats();
        health.services.storage = { status: 'healthy', details: 'Storage acessível' };
      } catch (error) {
        health.services.storage = { status: 'error', details: error.message };
        health.overall = 'degraded';
      }

      // Verificar webhook
      const webhookTest = await this.webhook.testWebhook();
      health.services.webhook = {
        status: webhookTest.success ? 'healthy' : 'warning',
        details: webhookTest.message
      };

      return health;
    } catch (error) {
      health.overall = 'error';
      health.error = error.message;
      return health;
    }
  }
}

// Criar instância singleton
export const firefliesBackend = new FirefliesBackendService();

// Exportar serviços individuais também
export {
  aiServiceFireflies,
  firefliesApiClient,
  firefliesConfig,
  firefliesStorageService,
  firefliesWebhookService,
  firefliesDataProcessor
};

// Exportar classe para casos que precisem de múltiplas instâncias
export default FirefliesBackendService;