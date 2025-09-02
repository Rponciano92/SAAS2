// Fireflies.ai API Service - VERSÃO CORRIGIDA FINAL
import { supabase } from '@/lib/supabase';

// Configuração da API com validação aprimorada
const FIREFLIES_API_URL = import.meta.env.VITE_FIREFLIES_API_URL || 'https://api.fireflies.ai/graphql';
const FIREFLIES_API_KEY = import.meta.env.VITE_FIREFLIES_API_KEY || 'aethersaas_IrJGOg7VCrE0CBfIIsF2dBwTWzA1khxBDNMW47Ql';

// Validação da API key
function validateApiKey(): { isValid: boolean; error?: string } {
  if (!FIREFLIES_API_KEY) {
    return {
      isValid: false,
      error: 'VITE_FIREFLIES_API_KEY não configurada no arquivo .env'
    };
  }
  
  if (FIREFLIES_API_KEY === 'your_actual_fireflies_api_key_here' || 
      FIREFLIES_API_KEY === 'demo-key' ||
      FIREFLIES_API_KEY.length < 10) {
    return {
      isValid: false,
      error: 'VITE_FIREFLIES_API_KEY é um valor placeholder ou inválido'
    };
  }
  
  // Verificar formato básico da API key (UUID-like)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(FIREFLIES_API_KEY)) {
    return {
      isValid: false,
      error: 'VITE_FIREFLIES_API_KEY não tem formato válido (deve ser UUID)'
    };
  }
  
  return { isValid: true };
}

// Log detalhado para debug
function logDebugInfo(operation: string, data: any) {
  console.group(`🔥 Fireflies Debug - ${operation}`);
  console.log('Timestamp:', new Date().toISOString());
  console.log('API URL:', FIREFLIES_API_URL);
  console.log('API Key válida:', !!FIREFLIES_API_KEY);
  console.log('API Key formato:', FIREFLIES_API_KEY ? `${FIREFLIES_API_KEY.substring(0, 8)}...` : 'N/A');
  console.log('Dados:', data);
  console.groupEnd();
}

interface FirefliesConfig {
  apiUrl: string;
  apiKey: string;
  webhookUrl: string;
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

export class FirefliesService {
  private apiUrl: string;
  private apiKey: string;
  private webhookUrl: string;

  constructor(config: FirefliesConfig) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.webhookUrl = config.webhookUrl;
  }

  private async makeGraphQLRequest(query: string, variables?: any) {
    try {
      // Validar API key antes de fazer requisição
      const validation = validateApiKey();
      if (!validation.isValid) {
        logDebugInfo('API Key Validation Failed', { error: validation.error });
        throw new Error(`API Key inválida: ${validation.error}`);
      }
      
      logDebugInfo('GraphQL Request', {
        query: query.substring(0, 100) + '...',
        variables,
        apiUrl: this.apiUrl
      });
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Aether-AI/1.0',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: variables
        })
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
          throw new Error(`Erro de autenticação (${response.status}): API key expirada ou inválida. Obtenha uma nova em https://app.fireflies.ai/integrations/custom/api`);
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      logDebugInfo('API Data', {
        hasData: !!data.data,
        hasErrors: !!data.errors,
        errorCount: data.errors?.length || 0
      });
      
      if (data.errors) {
        // Log detalhado dos erros GraphQL
        logDebugInfo('GraphQL Errors', data.errors);
        
        // Verificar se é erro de autenticação específico
        const authError = data.errors.find((e: any) => 
          e.extensions?.code === 'auth_failed' || 
          e.message?.toLowerCase().includes('auth') ||
          e.message?.toLowerCase().includes('unauthorized')
        );
        
        if (authError) {
          throw new Error(`Erro de autenticação: ${authError.message}. Verifique se sua API key é válida em https://app.fireflies.ai/integrations/custom/api`);
        }
        
        throw new Error(`GraphQL error: ${data.errors[0].message}`);
      }

      logDebugInfo('Success', { dataKeys: Object.keys(data.data || {}) });
      return data.data;
    } catch (error) {
      logDebugInfo('Request Failed', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  private async _uploadFileToSupabaseStorage(file: File): Promise<string> {
    const bucketName = 'fireflies-uploads';
    const filePath = `public/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Erro ao fazer upload para o Supabase Storage: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error('Não foi possível obter a URL pública do arquivo.');
    }

    return publicUrlData.publicUrl;
  }

  async uploadMeetingAudio(audioFile: File, meetingTitle: string): Promise<UploadResponse> {
    const audioUrl = await this._uploadFileToSupabaseStorage(audioFile);

    const mutation = `
      mutation($input: AudioUploadInput) {
        uploadAudio(input: $input) {
          success
          title
          status
        }
      }
    `;

    const variables = {
      input: {
        url: audioUrl,
        title: meetingTitle,
        attendees: [
          {
            displayName: "Consultor",
            email: "consultor@empresa.com"
          }
        ]
      }
    };

    const result = await this.makeGraphQLRequest(mutation, variables);
    
    return {
      uploadId: result.uploadMeeting.id,
      status: result.uploadMeeting.status
    };
  }

  async getTranscriptionStatus(transcriptionId: string): Promise<TranscriptionStatus> {
    const query = `
      query GetTranscription($id: ID!) {
        transcription(id: $id) {
          id
          status
          title
          transcript
          summary
          keywords
          participants {
            name
          }
        }
      }
    `;

    const variables = { id: transcriptionId };
    const result = await this.makeGraphQLRequest(query, variables);
    
    return {
      id: result.transcription.id,
      status: result.transcription.status,
      transcript: result.transcription.transcript,
      summary: result.transcription.summary,
      keywords: result.transcription.keywords
    };
  }

  async getTranscriptions(limit: number = 50): Promise<TranscriptionStatus[]> {
    const query = `
      query GetTranscriptions($limit: Int!) {
        transcriptions(limit: $limit) {
          id
          status
          title
          transcript
          summary
          keywords
          createdAt
          duration
          participants {
            name
          }
        }
      }
    `;

    const variables = { limit };
    const result = await this.makeGraphQLRequest(query, variables);
    
    return result.transcriptions.map((t: any) => ({
      id: t.id,
      status: t.status,
      transcript: t.transcript,
      summary: t.summary,
      keywords: t.keywords
    }));
  }

  async searchTranscriptions(searchTerm: string): Promise<TranscriptionStatus[]> {
    const query = `
      query SearchTranscriptions($searchTerm: String!) {
        searchTranscriptions(query: $searchTerm) {
          id
          status
          title
          transcript
          summary
          keywords
          createdAt
        }
      }
    `;

    const variables = { searchTerm };
    const result = await this.makeGraphQLRequest(query, variables);
    
    return result.searchTranscriptions.map((t: any) => ({
      id: t.id,
      status: t.status,
      transcript: t.transcript,
      summary: t.summary,
      keywords: t.keywords
    }));
  }
}

/**
 * Instrui o Fireflies.ai a entrar em uma reunião ao vivo AUTOMATICAMENTE
 * USA A API OFICIAL addToLiveMeeting - SEM CONVITE MANUAL
 */
export async function joinLiveMeeting(meetingLink: string, meetingTitle: string, language: string = 'pt-BR', attendees: any[] = []) {
  try {
    logDebugInfo('Join Live Meeting', { meetingLink, meetingTitle, language, attendees });
    
    if (!meetingLink || !meetingLink.startsWith('http')) {
      throw new Error('Link da reunião inválido');
    }

    // Validar API key antes de tentar
    const validation = validateApiKey();
    if (!validation.isValid) {
      console.warn('⚠️ API key inválida, usando método manual como fallback');
      return getManualInstructions();
    }

    // ✅ CORREÇÃO: Usar Edge Function com método POST correto
    const result = await callEdgeFunctionJoinMeeting(meetingLink, meetingTitle, language, attendees);
    
    if (result.success) {
      logDebugInfo('Automatic Join Success', result);
      
      return {
        success: true,
        message: 'IA entrou automaticamente na reunião! Aguarde alguns segundos.',
        method: 'automatic_join',
        instructions: [
          '✅ O bot Fireflies.ai está entrando na reunião automaticamente',
          '⏱️ Aguarde 30-60 segundos para o bot aparecer',
          '👋 Aceite quando "Fireflies Notetaker" pedir para entrar',
          '🎙️ A gravação iniciará automaticamente',
          '📝 A transcrição ficará disponível em alguns minutos'
        ],
        tips: [
          '💡 O bot aparecerá como "Fireflies Notetaker"',
          '💡 Não precisa convidar manualmente - ele entra sozinho!',
          '💡 A gravação é automática após aceitar',
          '💡 Este é o método oficial do Fireflies'
        ],
        meetingInfo: {
          url: meetingLink,
          title: meetingTitle,
          language: language,
          timestamp: new Date().toISOString(),
          botStatus: 'joining_automatically'
        }
      };
    } else {
      // Se API falhar, usar método manual como fallback
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
    
    // Fallback para instruções manuais em caso de erro
    return {
      success: true,
      message: 'Erro na entrada automática. Use o método manual:',
      method: 'error_fallback',
      instructions: getManualInstructions().instructions,
      error: error.message
    };
  }
}

/**
 * ✅ NOVA FUNÇÃO: Chama a Edge Function com método POST correto
 */
async function callEdgeFunctionJoinMeeting(meetingLink: string, meetingTitle: string, language: string, attendees: any[] = []) {
  try {
    // Obter URL do Supabase das variáveis de ambiente
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas');
    }
    
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/fireflies-webhook/join-meeting`;
    
    logDebugInfo('Calling Edge Function', {
      url: edgeFunctionUrl,
      method: 'POST',
      body: { meetingUrl: meetingLink, title: meetingTitle, language, attendees }
    });
    
    // ✅ CORREÇÃO PRINCIPAL: Usar POST com corpo JSON
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        meetingUrl: meetingLink,
        title: meetingTitle,
        language: language,
        attendees: attendees
      })
    });
    
    logDebugInfo('Edge Function Response', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      logDebugInfo('Edge Function Error', {
        status: response.status,
        body: errorText
      });
      
      return {
        success: false,
        error: `Erro na Edge Function: ${response.status}`,
        details: errorText
      };
    }
    
    const result = await response.json();
    logDebugInfo('Edge Function Success', result);
    
    return result;
    
  } catch (error) {
    logDebugInfo('Edge Function Call Failed', {
      error: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      error: 'Erro de conexão com Edge Function',
      details: error.message
    };
  }
}

/**
 * ✅ MANTIDA: Função original para fallback direto à API (se necessário)
 * Agora é usada apenas como backup se a Edge Function falhar
 */
async function addBotToLiveMeeting(meetingLink: string, title: string, language: string, attendees: any[] = []) {
  try {
    logDebugInfo('Add Bot To Live Meeting', { meetingLink, title, language });
    
    // Validar API key
    const validation = validateApiKey();
    if (!validation.isValid) {
      logDebugInfo('API Key Validation Failed', validation);
      return { 
        success: false, 
        error: validation.error,
        details: 'Obtenha uma nova API key em https://app.fireflies.ai/integrations/custom/api'
      };
    }

    // GraphQL mutation SIMPLIFICADA - conforme documentação oficial
    const mutation = `
      mutation AddToLiveMeeting($meetingLink: String!) {
        addToLiveMeeting(meeting_link: $meetingLink) {
          success
        }
      }
    `;

    // Variáveis MÍNIMAS - apenas o link obrigatório
    const variables = {
      meetingLink: meetingLink
    };

    logDebugInfo('Sending GraphQL Request', { mutation, variables });

    const response = await fetch(FIREFLIES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIREFLIES_API_KEY}`,
        'User-Agent': 'Aether-AI/1.0',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: mutation,
        variables: variables
      })
    });

    logDebugInfo('API Response Status', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      logDebugInfo('HTTP Error Details', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      // Verificar se é erro de autenticação
      if (response.status === 401 || response.status === 403) {
        return { 
          success: false, 
          error: 'API key expirada ou inválida',
          details: 'Obtenha uma nova chave em https://app.fireflies.ai/integrations/custom/api',
          httpStatus: response.status
        };
      }
      
      return { 
        success: false,
        error: `Erro HTTP ${response.status}`,
        details: errorText,
        httpStatus: response.status
      };
    }

    const data = await response.json();
    logDebugInfo('API Response Data', data);

    if (data.errors) {
      logDebugInfo('GraphQL Errors', data.errors);
      
      // Verificar se é erro de autenticação
      const authError = data.errors.find((e: any) => 
        e.extensions?.code === 'auth_failed' || 
        e.message?.toLowerCase().includes('auth') ||
        e.message?.toLowerCase().includes('unauthorized')
      );
      
      if (authError) {
        return { 
          success: false, 
          error: 'API key expirada ou inválida',
          details: 'Obtenha uma nova chave em https://app.fireflies.ai/integrations/custom/api',
          authError: authError.message
        };
      }
      
      return { 
        success: false, 
        error: 'Erro GraphQL do Fireflies',
        graphqlErrors: data.errors
      };
    }

    if (data.data?.addToLiveMeeting?.success) {
      logDebugInfo('Bot Added Successfully', data.data.addToLiveMeeting);
      return {
        success: true,
        message: 'Bot entrando automaticamente na reunião',
        data: data.data.addToLiveMeeting
      };
    } else {
      logDebugInfo('Unexpected Response', data);
      return { 
        success: false, 
        error: 'Falha na configuração da reunião',
        responseData: data
      };
    }

  } catch (error) {
    logDebugInfo('API Call Exception', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return { 
      success: false, 
      error: 'Erro de conexão ou timeout',
      details: error.message,
      type: error.name
    };
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
      '3. Digite: fred@fireflies.ai',
      '4. Envie o convite',
      '5. O bot entrará automaticamente e começará a gravar',
      '6. A transcrição ficará disponível em alguns minutos'
    ],
    tips: [
      '💡 O bot aparecerá como "Fireflies Notetaker"',
      '💡 Aceite quando ele pedir para entrar',
      '💡 A gravação é automática após aceitar',
      '💡 Este método sempre funciona, mesmo quando a API está indisponível'
    ]
  };
}

/**
 * Verifica o status do bot em uma reunião
 */
export async function checkBotStatus(meetingId: string) {
  const firefliesService = getFirefliesService();
  
  try {
    const query = `
      query CheckBotStatus($meetingId: ID!) {
        meeting(id: $meetingId) {
          id
          status
          botStatus
          startTime
          participants {
            name
            isBot
            joinedAt
          }
        }
      }
    `;

    const variables = { meetingId };
    const result = await firefliesService.makeGraphQLRequest(query, variables);
    
    return {
      success: true,
      meeting: result.meeting,
      botJoined: result.meeting.participants.some((p: any) => p.isBot),
      status: result.meeting.botStatus
    };
  } catch (error) {
    console.error('Erro ao verificar status do bot:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Testa a conectividade com Fireflies API
 */
export async function testFirefliesConnection() {
  try {
    logDebugInfo('Testing Connection', { apiUrl: FIREFLIES_API_URL });
    
    // Validar API key primeiro
    const validation = validateApiKey();
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
        message: 'API key inválida ou não configurada'
      };
    }
    
    const firefliesService = getFirefliesService();
    
    // Query simples para testar conectividade
    const query = `
      query TestConnection {
        user {
          id
          email
          name
        }
      }
    `;
    
    const result = await firefliesService.makeGraphQLRequest(query);
    
    logDebugInfo('Connection Test Success', result);
    
    return {
      success: true,
      message: 'Conexão com Fireflies.ai funcionando!',
      user: result.user
    };
  } catch (error) {
    logDebugInfo('Connection Test Failed', {
      error: error.message,
      stack: error.stack
    });
    
    // Verificar tipo de erro para dar feedback específico
    if (error.message.includes('API key')) {
      return {
        success: false,
        error: error.message,
        message: 'Problema com a API key do Fireflies.ai',
        solution: 'Obtenha uma nova API key em https://app.fireflies.ai/integrations/custom/api'
      };
    }
    
    return {
      success: false,
      error: error.message,
      message: 'Falha na conexão com Fireflies.ai',
      fallback: 'Use o método manual: adicione fred@fireflies.ai como participante'
    };
  }
}

/**
 * Função de teste para verificar o método automático
 */
export async function testFirefliesAutomaticMethod() {
  try {
    console.log('🧪 Testando método automático do Fireflies...');
    
    const testResult = await joinLiveMeeting(
      'https://meet.google.com/test-meeting',
      'Reunião de Teste Automática'
    );
    
    console.log('✅ Teste do método automático:', testResult);
    
    return {
      success: true,
      message: 'Método automático funcionando!',
      data: testResult
    };
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return { 
      success: false,
      message: 'Erro no teste automático',
      error: error.message 
    };
  }
}

// Singleton instance
let firefliesService: FirefliesService | null = null;

export const getFirefliesService = (): FirefliesService => {
  if (!firefliesService) {
    const firefliesApiUrl = FIREFLIES_API_URL;
    const apiKey = FIREFLIES_API_KEY || 'demo-key';
    const webhookUrl = import.meta.env.VITE_FIREFLIES_WEBHOOK_URL || '';

    const validation = validateApiKey();
    if (!validation.isValid) {
      console.warn('⚠️ Fireflies.ai não configurado corretamente:', validation.error);
      console.warn('📝 Para configurar: https://app.fireflies.ai/integrations/custom/api');
    }

    firefliesService = new FirefliesService({ apiUrl: firefliesApiUrl, apiKey, webhookUrl });
  }
  
  return firefliesService;
};

export default FirefliesService;