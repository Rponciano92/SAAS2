/**
 * Fireflies Webhook Service
 * Gerencia webhooks e notificações do Fireflies
 */

import { firefliesConfig } from './firefliesConfig.js';
import { supabase } from '../../lib/supabase';

class FirefliesWebhookService {
  constructor() {
    this.config = firefliesConfig;
    this.webhookUrl = this.config.webhookUrl;
    this.eventHandlers = new Map();
    
    // Registrar handlers padrão
    this.registerDefaultHandlers();
  }

  /**
   * Registra handler para evento de webhook
   * @param {string} eventType - Tipo do evento
   * @param {Function} handler - Função handler
   */
  registerEventHandler(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType).push(handler);
  }

  /**
   * Remove handler de evento
   * @param {string} eventType - Tipo do evento
   * @param {Function} handler - Função handler
   */
  unregisterEventHandler(eventType, handler) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Processa webhook recebido
   * @param {Object} webhookData - Dados do webhook
   * @returns {Promise<Object>} Resultado do processamento
   */
  async processWebhook(webhookData) {
    try {
      const { event_type, data, timestamp } = webhookData;
      
      console.log('📨 Webhook recebido:', {
        eventType: event_type,
        timestamp,
        dataKeys: Object.keys(data || {})
      });

      // Validar webhook
      if (!this.validateWebhook(webhookData)) {
        throw new Error('Webhook inválido');
      }

      // Salvar evento no banco
      await this.saveWebhookEvent(webhookData);

      // Executar handlers registrados
      const handlers = this.eventHandlers.get(event_type) || [];
      const results = await Promise.allSettled(
        handlers.map(handler => handler(data, event_type, timestamp))
      );

      // Log dos resultados
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      console.log(`✅ Webhook processado: ${successful} sucessos, ${failed} falhas`);

      return {
        success: true,
        eventType: event_type,
        handlersExecuted: handlers.length,
        successful,
        failed,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro ao processar webhook:', error);
      throw new Error(`Falha no processamento do webhook: ${error.message}`);
    }
  }

  /**
   * Configura webhook no Fireflies
   * @param {Array} eventTypes - Tipos de eventos para escutar
   * @returns {Promise<Object>} Resultado da configuração
   */
  async setupWebhook(eventTypes = []) {
    try {
      const defaultEvents = [
        'transcription.completed',
        'transcription.failed',
        'upload.completed',
        'upload.failed',
        'processing.started',
        'processing.completed'
      ];

      const events = eventTypes.length > 0 ? eventTypes : defaultEvents;

      const mutation = `
        mutation SetupWebhook($input: WebhookInput!) {
          setupWebhook(input: $input) {
            success
            message
            webhook {
              id
              url
              events
              status
            }
          }
        }
      `;

      const variables = {
        input: {
          url: this.webhookUrl,
          events: events,
          secret: this.generateWebhookSecret()
        }
      };

      // Esta seria uma chamada real à API do Fireflies
      // Por enquanto, simular resposta
      console.log('🔗 Configurando webhook:', {
        url: this.webhookUrl,
        events
      });

      return {
        success: true,
        message: 'Webhook configurado com sucesso',
        webhook: {
          id: 'webhook_' + Date.now(),
          url: this.webhookUrl,
          events,
          status: 'active'
        }
      };
    } catch (error) {
      console.error('Erro ao configurar webhook:', error);
      throw new Error(`Falha na configuração do webhook: ${error.message}`);
    }
  }

  /**
   * Salva evento de webhook no banco
   * @private
   */
  async saveWebhookEvent(webhookData) {
    try {
      const { data, error } = await supabase
        .from('fireflies_webhook_events')
        .insert({
          event_type: webhookData.event_type,
          event_data: webhookData.data,
          timestamp: webhookData.timestamp,
          processed_at: new Date().toISOString(),
          status: 'processed'
        });

      if (error) {
        console.warn('Aviso: Não foi possível salvar evento no banco:', error.message);
        // Não falhar o processamento por causa disso
      }
    } catch (error) {
      console.warn('Aviso: Erro ao salvar evento no banco:', error.message);
    }
  }

  /**
   * Registra handlers padrão
   * @private
   */
  registerDefaultHandlers() {
    // Handler para transcrição completada
    this.registerEventHandler('transcription.completed', async (data) => {
      console.log('✅ Transcrição completada:', data.transcription_id);
      
      // Atualizar status na interface
      await this.notifyTranscriptionCompleted(data);
      
      // Processar insights automaticamente
      await this.triggerInsightsProcessing(data.transcription_id);
    });

    // Handler para falha na transcrição
    this.registerEventHandler('transcription.failed', async (data) => {
      console.log('❌ Falha na transcrição:', data.transcription_id);
      
      // Notificar usuário sobre falha
      await this.notifyTranscriptionFailed(data);
    });

    // Handler para upload completado
    this.registerEventHandler('upload.completed', async (data) => {
      console.log('📁 Upload completado:', data.upload_id);
      
      // Atualizar status do upload
      await this.notifyUploadCompleted(data);
    });

    // Handler para início do processamento
    this.registerEventHandler('processing.started', async (data) => {
      console.log('⚙️ Processamento iniciado:', data.transcription_id);
      
      // Atualizar status para "processando"
      await this.notifyProcessingStarted(data);
    });
  }

  /**
   * Notifica conclusão da transcrição
   * @private
   */
  async notifyTranscriptionCompleted(data) {
    // Implementar notificação em tempo real
    // Pode usar WebSockets, Server-Sent Events, etc.
    console.log('🔔 Notificando conclusão da transcrição:', data.transcription_id);
  }

  /**
   * Notifica falha na transcrição
   * @private
   */
  async notifyTranscriptionFailed(data) {
    console.log('🔔 Notificando falha na transcrição:', data.transcription_id);
  }

  /**
   * Notifica conclusão do upload
   * @private
   */
  async notifyUploadCompleted(data) {
    console.log('🔔 Notificando conclusão do upload:', data.upload_id);
  }

  /**
   * Notifica início do processamento
   * @private
   */
  async notifyProcessingStarted(data) {
    console.log('🔔 Notificando início do processamento:', data.transcription_id);
  }

  /**
   * Dispara processamento de insights
   * @private
   */
  async triggerInsightsProcessing(transcriptionId) {
    try {
      // Importar dinamicamente para evitar dependência circular
      const { aiServiceFireflies } = await import('./aiServiceFireflies.js');
      
      // Processar insights em background
      setTimeout(async () => {
        try {
          await aiServiceFireflies.processTranscriptionInsights(transcriptionId);
          console.log('🧠 Insights processados para:', transcriptionId);
        } catch (error) {
          console.error('Erro ao processar insights:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Erro ao disparar processamento de insights:', error);
    }
  }

  /**
   * Valida webhook recebido
   * @private
   */
  validateWebhook(webhookData) {
    const requiredFields = ['event_type', 'data', 'timestamp'];
    
    for (const field of requiredFields) {
      if (!webhookData[field]) {
        console.error(`Campo obrigatório ausente no webhook: ${field}`);
        return false;
      }
    }

    // Validar timestamp (não pode ser muito antigo)
    const webhookTime = new Date(webhookData.timestamp);
    const now = new Date();
    const maxAge = 5 * 60 * 1000; // 5 minutos

    if (now - webhookTime > maxAge) {
      console.error('Webhook muito antigo:', webhookData.timestamp);
      return false;
    }

    return true;
  }

  /**
   * Gera secret para webhook
   * @private
   */
  generateWebhookSecret() {
    return 'webhook_secret_' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Obtém estatísticas de webhooks
   * @param {Object} period - Período para estatísticas
   * @returns {Promise<Object>} Estatísticas
   */
  async getWebhookStats(period = {}) {
    try {
      const {
        dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        dateTo = new Date().toISOString()
      } = period;

      const { data, error } = await supabase
        .from('fireflies_webhook_events')
        .select('event_type, status, timestamp')
        .gte('timestamp', dateFrom)
        .lte('timestamp', dateTo);

      if (error) {
        console.warn('Erro ao obter estatísticas de webhook:', error.message);
        return this.getDefaultStats();
      }

      const stats = data.reduce((acc, event) => {
        acc.total++;
        acc.byType[event.event_type] = (acc.byType[event.event_type] || 0) + 1;
        acc.byStatus[event.status] = (acc.byStatus[event.status] || 0) + 1;
        return acc;
      }, {
        total: 0,
        byType: {},
        byStatus: {},
        period: { from: dateFrom, to: dateTo }
      });

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas de webhook:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * Retorna estatísticas padrão
   * @private
   */
  getDefaultStats() {
    return {
      total: 0,
      byType: {},
      byStatus: {},
      period: { from: null, to: null }
    };
  }

  /**
   * Testa webhook
   * @returns {Promise<Object>} Resultado do teste
   */
  async testWebhook() {
    try {
      const testData = {
        event_type: 'test.webhook',
        data: {
          message: 'Teste de webhook',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      const result = await this.processWebhook(testData);
      
      return {
        success: true,
        message: 'Webhook testado com sucesso',
        result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Falha no teste do webhook',
        error: error.message
      };
    }
  }
}

export const firefliesWebhookService = new FirefliesWebhookService();
export default FirefliesWebhookService;