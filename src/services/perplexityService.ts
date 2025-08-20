// Perplexity AI Service - Sistema de Pesquisa Web
const PERPLEXITY_API_KEY = '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';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export interface PerplexityResponse {
  content: string;
  citations?: string[];
  relatedQuestions?: string[];
}

export class PerplexityService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = PERPLEXITY_API_KEY;
    this.apiUrl = PERPLEXITY_API_URL;
  }

  async searchWeb(query: string, context?: string): Promise<PerplexityResponse> {
    try {
      console.log('🔍 Iniciando pesquisa web com Perplexity:', query);

      const systemPrompt = `Você é um assistente de pesquisa especializado em consultoria empresarial. 
      Forneça informações precisas, atualizadas e relevantes sobre empresas, mercados e tendências de negócios.
      ${context ? `Contexto adicional: ${context}` : ''}
      
      Foque em:
      - Dados atuais e verificáveis
      - Tendências de mercado
      - Informações sobre empresas específicas
      - Regulamentações e compliance
      - Benchmarks do setor
      
      Seja conciso mas completo. Use dados específicos quando disponíveis.`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 1000,
          temperature: 0.2,
          top_p: 0.9,
          return_citations: true,
          search_domain_filter: ["perplexity.ai"],
          return_images: false,
          return_related_questions: true,
          search_recency_filter: "month",
          top_k: 0,
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 1
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na API Perplexity:', response.status, errorText);
        throw new Error(`Erro na pesquisa: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Resposta da Perplexity recebida');

      return {
        content: data.choices[0].message.content,
        citations: data.citations || [],
        relatedQuestions: data.related_questions || []
      };
    } catch (error) {
      console.error('❌ Erro no serviço Perplexity:', error);
      throw new Error(`Falha na pesquisa web: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async searchMarketTrends(sector: string, year: string = '2025'): Promise<PerplexityResponse> {
    const query = `Tendências do mercado ${sector} em ${year} no Brasil. Dados atuais, crescimento, principais players e oportunidades.`;
    return this.searchWeb(query, `Setor: ${sector}, Ano: ${year}`);
  }

  async searchCompanyInfo(companyName: string): Promise<PerplexityResponse> {
    const query = `Informações atuais sobre a empresa ${companyName}. Faturamento, mercado, concorrentes e posicionamento.`;
    return this.searchWeb(query, `Empresa: ${companyName}`);
  }

  async searchRegulations(topic: string): Promise<PerplexityResponse> {
    const query = `Regulamentações e compliance sobre ${topic} no Brasil. Leis atuais, mudanças recentes e impactos para empresas.`;
    return this.searchWeb(query, `Regulamentação: ${topic}`);
  }

  async searchBenchmarks(sector: string, metric: string): Promise<PerplexityResponse> {
    const query = `Benchmarks e métricas do setor ${sector} para ${metric}. Dados atuais do mercado brasileiro e internacional.`;
    return this.searchWeb(query, `Benchmark: ${sector} - ${metric}`);
  }
}

export const perplexityService = new PerplexityService();