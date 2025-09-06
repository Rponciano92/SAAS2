// AetherSaaS API Service - BOT REAL RESTAURADO
import { supabase } from '@/lib/supabase';

// Configuração da API AetherSaaS REAL
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
  
  if (!AETHERSAAS_API_KEY.startsWith('aethersaas_')) {
    return {
      isValid: false,
      error: 'VITE_AETHERSAAS_API_KEY deve começar com "aethersaas_"'
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
  console.log('API Key formato:', AETHERSAAS_API_KEY ? `${AETHERSAAS_API_KEY.substring(0, 15)}...` : 'N/A');
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
}

export interface TranscriptionStatus {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  transcript?: string;
  summary?: string;
  keywords?: string[];
}

export class AetherSaasService {
  private apiUrl: string;
  private apiKey: string;

  constructor(config: AetherSaasConfig) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
  }

  private async makeAPIRequest(endpoint: string, method: string = 'GET', body?: any) {
    try {
      // Validar API key antes de fazer requisição
      const validation = validateApiKey();
      if (!validation.isValid) {
        logDebugInfo('API Key Validation Failed', { error: validation.error });
        throw new Error(`API Key inválida: ${validation.error}`);
      }
      
      const url = `${this.apiUrl}${endpoint}`;
      
      logDebugInfo('API Request', {
        method,
        url,
        body,
        apiUrl: this.apiUrl
      });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'AetherSaaS-Bot/1.0',
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
          throw new Error(`Erro de autenticação (${response.status}): API key expirada ou inválida. Verifique sua chave AetherSaaS.`);
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      logDebugInfo('API Data', {
        hasData: !!data,
        dataKeys: Object.keys(data || {})
      });
      
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
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('title', meetingTitle);
    
    const data = await this.makeAPIRequest('/meetings/upload', 'POST', formData);
    
    return {
      uploadId: data.upload_id,
      status: data.status
    };
  }

  async getTranscriptionStatus(transcriptionId: string): Promise<TranscriptionStatus> {
    const data = await this.makeAPIRequest(`/meetings/${transcriptionId}`);
    
    return {
      id: data.meeting_id || transcriptionId,
      status: data.status || 'completed',
      transcript: data.transcript,
      summary: data.summary,
      keywords: data.keywords || []
    };
  }

  async getTranscriptions(limit: number = 50): Promise<TranscriptionStatus[]> {
    const data = await this.makeAPIRequest(`/meetings?limit=${limit}`);
    
    if (data.meetings && Array.isArray(data.meetings)) {
      return data.meetings.map((meeting: any) => ({
        id: meeting.meeting_id,
        status: meeting.status || 'completed',
        transcript: meeting.transcript,
        summary: meeting.summary,
        keywords: meeting.keywords || []
      }));
    }
    
    return [];
  }

  async searchTranscriptions(searchTerm: string): Promise<TranscriptionStatus[]> {
    const data = await this.makeAPIRequest(`/meetings/search?q=${encodeURIComponent(searchTerm)}`);
    
    return data.results?.map((result: any) => ({
      id: result.meeting_id,
      status: result.status || 'completed',
      transcript: result.transcript,
      summary: result.summary,
      keywords: result.keywords || []
    })) || [];
  }
}

/**
 * BOT REAL AetherSaaS - Entrada automática em reuniões
 * FUNCIONA COM API REAL: http://72.60.52.39:8000
 */
export async function joinLiveMeeting(meetingLink: string, meetingTitle: string, language: string = 'pt-BR', attendees: any[] = []) {
  try {
    logDebugInfo('Join Live Meeting - BOT REAL', { meetingLink, meetingTitle, language, attendees });
    
    if (!meetingLink || !meetingLink.startsWith('http')) {
      throw new Error('Link da reunião inválido');
    }

    // Validar API key
    const validation = validateApiKey();
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const aetherSaasService = getAetherSaasService();
    
    // CHAMADA REAL PARA O BOT AetherSaaS
    const result = await aetherSaasService.makeAPIRequest('/meetings/join', 'POST', {
      meeting_url: meetingLink,
      title: meetingTitle,
      description: `Reunião automatizada via AetherSaaS Bot - ${meetingTitle}`,
      participants: attendees,
      auto_record: true,
      auto_transcribe: true,
      language: language
    });
    
    if (result.success) {
      logDebugInfo('BOT REAL Success', result);
      
      return {
        success: true,
        message: 'AetherSaaS Bot entrou automaticamente na reunião! Aguarde alguns segundos.',
        method: 'automatic_join',
        instructions: [
          '✅ O bot AetherSaaS está entrando na reunião automaticamente',
          '⏱️ Aguarde 30-60 segundos para o bot aparecer',
          '👋 Aceite quando "AetherSaaS Bot" pedir para entrar',
          '🎙️ A gravação iniciará automaticamente',
          '📝 A transcrição ficará disponível em alguns minutos'
        ],
        tips: [
          '💡 O bot aparecerá como "AetherSaaS Bot"',
          '💡 Não precisa convidar manualmente - ele entra sozinho!',
          '💡 A gravação é automática após aceitar',
          '💡 Este é o método oficial do AetherSaaS'
        ],
        meetingInfo: {
          url: meetingLink,
          title: meetingTitle,
          meeting_id: result.meeting_id,
          timestamp: result.timestamp,
          botStatus: 'joining_automatically'
        }
      };
    } else {
      throw new Error(result.error || 'Falha na configuração da reunião');
    }
    
  } catch (error) {
    logDebugInfo('BOT REAL Error', {
      error: error.message,
      stack: error.stack
    });
    
    throw new Error(`Erro no bot AetherSaaS: ${error.message}`);
  }
}

/**
 * Testa a conectividade com AetherSaaS API
 */
export async function testAetherSaasConnection() {
  try {
    logDebugInfo('Testing Connection', { apiUrl: AETHERSAAS_API_URL });
    
    // Validar API key primeiro
    const validation = validateApiKey();
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
        message: 'API key inválida ou não configurada'
      };
    }
    
    const aetherSaasService = getAetherSaasService();
    
    // Testar endpoint de health
    const result = await aetherSaasService.makeAPIRequest('/health');
    
    logDebugInfo('Connection Test Success', result);
    
    return {
      success: true,
      message: 'Conexão com AetherSaaS funcionando!',
      data: result
    };
  } catch (error) {
    logDebugInfo('Connection Test Failed', {
      error: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      error: error.message,
      message: 'Falha na conexão com AetherSaaS'
    };
  }
}

// Singleton instance
let aetherSaasService: AetherSaasService | null = null;

export const getAetherSaasService = (): AetherSaasService => {
  if (!aetherSaasService) {
    const validation = validateApiKey();
    if (!validation.isValid) {
      console.warn('⚠️ AetherSaaS não configurado corretamente:', validation.error);
    }

    aetherSaasService = new AetherSaasService({ 
      apiUrl: AETHERSAAS_API_URL, 
      apiKey: AETHERSAAS_API_KEY || '' 
    });
  }
  
  return aetherSaasService;
};

export default AetherSaasService;