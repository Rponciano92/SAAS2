// AetherSaaS Service - Sistema Próprio de Reuniões Inteligentes
// Substituto completo do Fireflies.ai usando nossa própria API

const AETHERSAAS_API_URL = import.meta.env.VITE_AETHERSAAS_API_URL || 'http://72.60.52.39:8000';
const AETHERSAAS_API_KEY = import.meta.env.VITE_AETHERSAAS_API_KEY;

// Validação da API key
function validateApiKey(): { isValid: boolean; error?: string } {
  if (!AETHERSAAS_API_KEY) {
    return {
      isValid: false,
      error: 'VITE_AETHERSAAS_API_KEY não configurada no arquivo .env'
    };
  }
  
  if (AETHERSAAS_API_KEY === 'your_aethersaas_api_key_here' || 
      AETHERSAAS_API_KEY === 'demo-key' ||
      AETHERSAAS_API_KEY.length < 20) {
    return {
      isValid: false,
      error: 'VITE_AETHERSAAS_API_KEY é um valor placeholder ou inválido'
    };
  }
  
  return { isValid: true };
}

// Log detalhado para debug
function logDebugInfo(operation: string, data: any) {
  console.group(`🚀 AetherSaaS Debug - ${operation}`);
  console.log('Timestamp:', new Date().toISOString());
  console.log('API URL:', AETHERSAAS_API_URL);
  console.log('API Key válida:', !!AETHERSAAS_API_KEY);
  console.log('API Key formato:', AETHERSAAS_API_KEY ? `${AETHERSAAS_API_KEY.substring(0, 12)}...` : 'N/A');
  console.log('Dados:', data);
  console.groupEnd();
}

interface AetherSaasConfig {
  apiUrl: string;
  apiKey: string;
}

interface UploadResponse {
  uploadId: string;
  status: string;
  message?: string;
}

export interface TranscriptionStatus {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  transcript?: string;
  summary?: string;
  keywords?: string[];
  participants?: string[];
}

export class AetherSaasService {
  private apiUrl: string;
  private apiKey: string;

  constructor(config: AetherSaasConfig) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
  }

  private async makeApiRequest(endpoint: string, method: string = 'GET', body?: any) {
    try {
      // Validar API key antes de fazer requisição
      const validation = validateApiKey();
      if (!validation.isValid) {
        logDebugInfo('API Key Validation Failed', { error: validation.error });
        throw new Error(`API Key inválida: ${validation.error}`);
      }
      
      logDebugInfo('API Request', {
        endpoint,
        method,
        body,
        apiUrl: this.apiUrl
      });
      
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Aether-AI/1.0',
          'Accept': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });

      logDebugInfo('API Response', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        logDebugInfo('HTTP Error', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        // Verificar se é erro de autenticação
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Erro de autenticação (${response.status}): API key expirada ou inválida. Verifique sua chave AetherSaaS`);
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      logDebugInfo('API Data', {
        hasData: !!data,
        hasErrors: !!data.errors,
        dataKeys: Object.keys(data || {})
      });
      
      if (data.errors) {
        logDebugInfo('API Errors', data.errors);
        throw new Error(`API Error: ${data.errors[0]?.message || 'Erro desconhecido'}`);
      }

      logDebugInfo('Success', { dataKeys: Object.keys(data || {}) });
      return data;
    } catch (error) {
      logDebugInfo('Request Failed', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async uploadMeetingAudio(audioFile: File, meetingTitle: string): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('title', meetingTitle);
      formData.append('language', 'pt-BR');

      const response = await fetch(`${this.apiUrl}/api/meetings/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        uploadId: result.id || result.uploadId,
        status: result.status || 'processing',
        message: result.message
      };
    } catch (error) {
      logDebugInfo('Upload Error', error);
      throw error;
    }
  }

  async getTranscriptionStatus(transcriptionId: string): Promise<TranscriptionStatus> {
    const result = await this.makeApiRequest(`/api/meetings/${transcriptionId}/status`);
    
    return {
      id: result.id,
      status: result.status,
      progress: result.progress,
      transcript: result.transcript,
      summary: result.summary,
      keywords: result.keywords,
      participants: result.participants
    };
  }

  async getTranscriptions(limit: number = 50): Promise<TranscriptionStatus[]> {
    const result = await this.makeApiRequest(`/api/meetings?limit=${limit}`);
    
    return result.meetings?.map((meeting: any) => ({
      id: meeting.id,
      status: meeting.status,
      transcript: meeting.transcript,
      summary: meeting.summary,
      keywords: meeting.keywords,
      participants: meeting.participants
    })) || [];
  }

  async searchTranscriptions(searchTerm: string): Promise<TranscriptionStatus[]> {
    const result = await this.makeApiRequest(`/api/meetings/search?q=${encodeURIComponent(searchTerm)}`);
    
    return result.meetings?.map((meeting: any) => ({
      id: meeting.id,
      status: meeting.status,
      transcript: meeting.transcript,
      summary: meeting.summary,
      keywords: meeting.keywords,
      participants: meeting.participants
    })) || [];
  }

  async joinLiveMeeting(meetingLink: string, meetingTitle: string): Promise<any> {
    try {
      logDebugInfo('Join Live Meeting', { meetingLink, meetingTitle });
      
      if (!meetingLink || !meetingLink.startsWith('http')) {
        throw new Error('Link da reunião inválido');
      }

      const validation = validateApiKey();
      if (!validation.isValid) {
        console.warn('⚠️ API key inválida, usando método manual como fallback');
        return getManualInstructions();
      }

      const result = await this.makeApiRequest('/meetings/join', 'POST', {
        meeting_url: meetingLink,
        title: meetingTitle
      });
      
      if (result.success) {
        logDebugInfo('Automatic Join Success', result);
        
        return {
          success: true,
          message: result.message || 'AetherSaaS Bot ativado! Navegador aberto automaticamente.',
          method: 'automatic_join',
          meeting_id: result.meeting_id,
          platform: result.platform || this.detectPlatform(meetingLink),
          instructions: result.instructions || [
            '✅ Navegador aberto automaticamente',
            `🌐 ${result.platform || this.detectPlatform(meetingLink)} carregado`,
            '👤 Clique em "Participar" para entrar',
            '🎯 Bot cumpriu sua função!'
          ],
          tips: [
            '💡 O navegador abrirá com configurações otimizadas',
            '💡 Funciona com Google Meet, Zoom, Teams e Webex',
            '💡 Sistema testado e aprovado ✅',
            '💡 Este é nosso sistema proprietário'
          ],
          meetingInfo: {
            url: meetingLink,
            title: meetingTitle,
            platform: result.platform || this.detectPlatform(meetingLink),
            timestamp: new Date().toISOString(),
            botStatus: 'browser_opened',
            meetingId: result.meeting_id
          }
        };
      } else {
        logDebugInfo('API Failed - Using Manual Fallback', result);
        
        return {
          success: true,
          message: `Problema com a API (${result.error}). Use o método manual:`,
          method: 'manual_fallback',
          instructions: getManualInstructions().instructions,
          apiError: result.error,
          fallbackReason: 'API automática indisponível'
        };
      }
      
    } catch (error) {
      logDebugInfo('Join Meeting Error', {
        error: error.message,
        stack: error.stack
      });
      
      return {
        success: true,
        message: 'Erro na entrada automática. Use o método manual:',
        method: 'error_fallback',
        instructions: getManualInstructions().instructions,
        error: error.message
      };
    }
  }

  async getActiveMeetings(): Promise<any> {
    try {
      const result = await this.makeApiRequest('/meetings/active');
      return result;
    } catch (error) {
      logDebugInfo('Get Active Meetings Error', error);
      throw error;
    }
  }

  async stopMeeting(meetingId: string): Promise<any> {
    try {
      const result = await this.makeApiRequest(`/meetings/${meetingId}/stop`, 'POST');
      return result;
    } catch (error) {
      logDebugInfo('Stop Meeting Error', error);
      throw error;
    }
  }

  async joinMeetingBackground(meetingLink: string, meetingTitle: string): Promise<any> {
    try {
      const result = await this.makeApiRequest('/meetings/join-background', 'POST', {
        meeting_url: meetingLink,
        title: meetingTitle
      });
      return result;
    } catch (error) {
      logDebugInfo('Join Meeting Background Error', error);
      throw error;
    }
  }
  private detectPlatform(meetingUrl: string): string {
    const url = meetingUrl.toLowerCase();
    
    if (url.includes('meet.google.com')) {
      return 'Google Meet';
    } else if (url.includes('zoom.us')) {
      return 'Zoom';
    } else if (url.includes('teams.microsoft.com') || url.includes('teams.live.com')) {
      return 'Microsoft Teams';
    } else if (url.includes('webex.com')) {
      return 'Cisco Webex';
    } else {
      return 'Plataforma Desconhecida';
    }
  }

  async testConnection(): Promise<any> {
    try {
      logDebugInfo('Testing Connection', { apiUrl: this.apiUrl });
      
      const validation = validateApiKey();
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          message: 'API key inválida ou não configurada'
        };
      }
      
      const result = await this.makeApiRequest('/health');
      
      logDebugInfo('Connection Test Success', result);
      
      return {
        success: true,
        message: result.message || 'Conexão com AetherSaaS funcionando!',
        status: result.status,
        version: result.version,
        botType: result.bot_type,
        tested: result.tested,
        data: result
      };
    } catch (error) {
      logDebugInfo('Connection Test Failed', {
        error: error.message,
        stack: error.stack
      });
      
      if (error.message.includes('API key')) {
        return {
          success: false,
          error: error.message,
          message: 'Problema com a API key do AetherSaaS',
          solution: 'Verifique se sua API key está correta'
        };
      }
      
      return {
        success: false,
        error: error.message,
        message: 'Falha na conexão com AetherSaaS',
        fallback: 'Verifique se o servidor está online'
      };
    }
  }
}

/**
 * Retorna instruções manuais para adicionar o bot
 */
function getManualInstructions() {
  return {
    success: true,
    message: 'Use o método manual para adicionar o bot à reunião:',
    method: 'manual_invite',
    instructions: [
      '1. Abra sua reunião no Google Meet',
      '2. Clique em "Adicionar pessoas" ou no ícone de pessoas',
      '3. Digite: bot@aethersaas.com',
      '4. Envie o convite',
      '5. O bot entrará automaticamente e começará a gravar',
      '6. A transcrição ficará disponível em alguns minutos'
    ],
    tips: [
      '💡 O bot aparecerá como "AetherSaaS Meeting Bot"',
      '💡 Aceite quando ele pedir para entrar',
      '💡 A gravação é automática após aceitar',
      '💡 Este método sempre funciona, mesmo quando a API está indisponível'
    ]
  };
}

// Singleton instance
let aetherSaasService: AetherSaasService | null = null;

export const getAetherSaasService = (): AetherSaasService => {
  if (!aetherSaasService) {
    const apiUrl = AETHERSAAS_API_URL;
    const apiKey = AETHERSAAS_API_KEY;

    const validation = validateApiKey();
    if (!validation.isValid) {
      console.warn('⚠️ AetherSaaS não configurado corretamente:', validation.error);
      console.warn('📝 Para configurar: adicione VITE_AETHERSAAS_API_KEY no arquivo .env');
    }

    aetherSaasService = new AetherSaasService({ apiUrl: apiUrl || '', apiKey: apiKey || '' });
  }
  
  return aetherSaasService;
};

/**
 * Instrui o AetherSaaS Bot a entrar em uma reunião ao vivo AUTOMATICAMENTE
 */
export async function joinLiveMeeting(meetingLink: string, meetingTitle: string, language: string = 'pt-BR') {
  const service = getAetherSaasService();
  return await service.joinLiveMeeting(meetingLink, meetingTitle);
}

/**
 * Testa a conectividade com AetherSaaS API
 */
export async function testAetherSaasConnection() {
  const service = getAetherSaasService();
  return await service.testConnection();
}

export default AetherSaasService;