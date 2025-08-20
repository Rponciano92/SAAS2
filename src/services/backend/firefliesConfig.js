/**
 * Fireflies.ai Configuration
 * Configurações centralizadas para o serviço Fireflies
 */

class FirefliesConfig {
  constructor() {
    this.apiUrl = this.getEnvVar('VITE_FIREFLIES_API_URL', 'https://api.fireflies.ai/graphql');
    this.apiKey = this.getEnvVar('VITE_FIREFLIES_API_KEY');
    this.webhookUrl = this.getEnvVar('VITE_FIREFLIES_WEBHOOK_URL');
    
    // Configurações de timeout e retry
    this.timeout = 30000; // 30 segundos
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 segundo
    
    // Configurações de upload
    this.maxFileSize = 50 * 1024 * 1024; // 50MB
    this.supportedFormats = [
      'mp3', 'mp4', 'wav', 'm4a', 'mov', 'avi', 'mkv', 'webm'
    ];
    
    // Configurações de processamento
    this.defaultLanguage = 'pt-BR';
    this.enableSentimentAnalysis = true;
    this.enableActionItems = true;
    this.enableTopicDetection = true;
    
    // Validar configuração
    this.validateConfig();
  }

  /**
   * Obtém variável de ambiente com fallback
   * @param {string} key - Chave da variável
   * @param {string} defaultValue - Valor padrão
   * @returns {string} Valor da variável
   */
  getEnvVar(key, defaultValue = null) {
    const value = import.meta.env[key];
    
    if (!value && !defaultValue) {
      console.warn(`⚠️ Variável de ambiente ${key} não encontrada`);
    }
    
    return value || defaultValue;
  }

  /**
   * Valida configuração do Fireflies
   */
  validateConfig() {
    const errors = [];

    if (!this.apiKey || this.apiKey === 'SUA_API_KEY_AQUI') {
      errors.push('VITE_FIREFLIES_API_KEY não configurada ou usando valor placeholder');
    }

    if (!this.apiUrl) {
      errors.push('VITE_FIREFLIES_API_URL não configurada');
    }

    if (!this.webhookUrl) {
      errors.push('VITE_FIREFLIES_WEBHOOK_URL não configurada');
    }

    if (errors.length > 0) {
      console.warn('⚠️ Configuração do Fireflies.ai incompleta:', errors);
      this.isConfigured = false;
    } else {
      this.isConfigured = true;
    }
  }

  /**
   * Verifica se arquivo é suportado
   * @param {File} file - Arquivo para verificar
   * @returns {boolean} Se é suportado
   */
  isFileSupported(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    return this.supportedFormats.includes(extension);
  }

  /**
   * Verifica se arquivo está dentro do limite de tamanho
   * @param {File} file - Arquivo para verificar
   * @returns {boolean} Se está dentro do limite
   */
  isFileSizeValid(file) {
    return file.size <= this.maxFileSize;
  }

  /**
   * Obtém configurações de upload
   * @returns {Object} Configurações de upload
   */
  getUploadConfig() {
    return {
      maxFileSize: this.maxFileSize,
      supportedFormats: this.supportedFormats,
      timeout: this.timeout,
      language: this.defaultLanguage
    };
  }

  /**
   * Obtém configurações de processamento
   * @returns {Object} Configurações de processamento
   */
  getProcessingConfig() {
    return {
      language: this.defaultLanguage,
      enableSentimentAnalysis: this.enableSentimentAnalysis,
      enableActionItems: this.enableActionItems,
      enableTopicDetection: this.enableTopicDetection
    };
  }

  /**
   * Obtém configurações de API
   * @returns {Object} Configurações de API
   */
  getApiConfig() {
    return {
      apiUrl: this.apiUrl,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay
    };
  }

  /**
   * Obtém headers padrão para requisições
   * @returns {Object} Headers HTTP
   */
  getDefaultHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'User-Agent': 'Aether-AI/1.0',
      'Accept': 'application/json'
    };
  }

  /**
   * Formata erro de configuração
   * @param {string} message - Mensagem de erro
   * @returns {Error} Erro formatado
   */
  createConfigError(message) {
    return new Error(`[Fireflies Config] ${message}`);
  }

  /**
   * Log de configuração (para debug)
   */
  logConfig() {
    console.log('🔧 Fireflies.ai Configuration:', {
      apiUrl: this.apiUrl,
      hasApiKey: !!this.apiKey,
      hasWebhookUrl: !!this.webhookUrl,
      isConfigured: this.isConfigured,
      maxFileSize: `${this.maxFileSize / 1024 / 1024}MB`,
      supportedFormats: this.supportedFormats.length,
      language: this.defaultLanguage
    });
  }
}

export const firefliesConfig = new FirefliesConfig();
export default FirefliesConfig;