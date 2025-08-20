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
          model: 'sonar',
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
          temperature: 0.2

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