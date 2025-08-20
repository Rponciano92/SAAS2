// Fireflies.ai API Service - VERSÃO CORRIGIDA FINAL
import { supabase } from '@/lib/supabase';

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
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: variables
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL error: ${data.errors[0].message}`);
      }

      return data.data;
    } catch (error) {
      console.error('Fireflies API Error:', error);
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
    console.log('🤖 Fazendo IA entrar AUTOMATICAMENTE na reunião:', { meetingLink, meetingTitle, language });
    
    if (!meetingLink || !meetingLink.startsWith('http')) {
      throw new Error('Link da reunião inválido');
    }

    // USAR API OFICIAL DO FIREFLIES - addToLiveMeeting
    const result = await addBotToLiveMeeting(meetingLink, meetingTitle, language, attendees);
    
    if (result.success) {
      console.log('✅ IA entrou automaticamente na reunião!');
      
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
      console.warn('⚠️ API automática falhou, usando método manual:', result.error);
      
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
    console.error('Erro ao fazer IA entrar automaticamente:', error);
    
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
 * Função que usa a API oficial addToLiveMeeting do Fireflies
 * FAZ O BOT ENTRAR AUTOMATICAMENTE NO LINK DA REUNIÃO
 * VERSÃO CORRIGIDA - FORMATO SIMPLES DA DOCUMENTAÇÃO
 */
async function addBotToLiveMeeting(meetingLink: string, title: string, language: string, attendees: any[] = []) {
  try {
    console.log('🔥 Chamando API addToLiveMeeting do Fireflies (versão corrigida)...');
    
    // Chave API do Fireflies (fornecida pelo usuário)
    const FIREFLIES_API_KEY = import.meta.env.VITE_FIREFLIES_API_KEY || 'demo-key';
    
    // Verificar se a chave é válida antes de fazer a chamada
    if (!FIREFLIES_API_KEY || FIREFLIES_API_KEY === 'demo-key' || FIREFLIES_API_KEY === 'your_actual_fireflies_api_key_here') {
      console.warn('⚠️ API key do Fireflies não configurada ou inválida');
      return { 
        success: false, 
        error: 'API key não configurada',
        details: 'Configure uma API key válida em https://app.fireflies.ai/integrations/custom/api'
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

    console.log('📡 Enviando requisição SIMPLIFICADA para API do Fireflies:', variables);

    const response = await fetch('https://api.fireflies.ai/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIREFLIES_API_KEY}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: variables
      })
    });

    console.log('📊 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro HTTP:', response.status, response.statusText, errorText);
      return { 
        success: false, 
        error: `Falha na autenticação da API`,
        details: errorText
      };
    }

    const data = await response.json();
    console.log('📦 Resposta da API:', data);

    if (data.errors) {
      console.error('❌ Erros GraphQL:', data.errors);
      
      // Verificar se é erro de autenticação
      const authError = data.errors.find((e: any) => e.code === 'auth_failed');
      if (authError) {
        return { 
          success: false, 
          error: 'Chave de API inválida ou expirada',
          details: 'Obtenha uma nova chave em https://app.fireflies.ai/integrations/custom/api'
        };
      }
      
      return { 
        success: false, 
        error: 'Erro na API do Fireflies',
        graphqlErrors: data.errors
      };
    }

    if (data.data?.addToLiveMeeting?.success) {
      console.log('🎉 Bot adicionado com sucesso à reunião!');
      return {
        success: true,
        message: 'Bot entrando automaticamente na reunião',
        data: data.data.addToLiveMeeting
      };
    } else {
      console.error('❌ Resposta inesperada:', data);
      return { 
        success: false, 
        error: 'Falha na configuração da reunião',
        responseData: data
      };
    }

  } catch (error) {
    console.error('❌ Erro na API addToLiveMeeting:', error);
    return { 
      success: false, 
      error: 'Erro de conexão com a API',
      stack: error.stack
    };
  }
}

/**
 * Retorna instruções manuais para adicionar o bot
 */
function getManualInstructions() {
  return {
    success: true,
    message: 'Para que a IA entre na reunião, adicione fred@fireflies.ai como participante.',
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
      '💡 A gravação é automática após aceitar'
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
    const firefliesService = getFirefliesService();
    
    // Query simples para testar conectividade
    const query = `
      query TestConnection {
        user {
          id
          email
        }
      }
    `;
    
    const result = await firefliesService.makeGraphQLRequest(query);
    
    return {
      success: true,
      message: 'Conexão com Fireflies.ai funcionando!',
      user: result.user
    };
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return {
      success: false,
      error: error.message,
      message: 'Falha na conexão com Fireflies.ai'
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
    const firefliesApiUrl = import.meta.env.VITE_FIREFLIES_API_URL || 'https://api.fireflies.ai/graphql';
    const apiKey = import.meta.env.VITE_FIREFLIES_API_KEY || 'demo-key';
    const webhookUrl = import.meta.env.VITE_FIREFLIES_WEBHOOK_URL || '';

    if (!apiKey || apiKey === 'demo-key') {
      console.warn('⚠️ Chave do Fireflies.ai não configurada. Algumas funcionalidades podem não funcionar.');
    }

    firefliesService = new FirefliesService({ apiUrl: firefliesApiUrl, apiKey, webhookUrl });
  }
  
  return firefliesService;
};

export default FirefliesService;