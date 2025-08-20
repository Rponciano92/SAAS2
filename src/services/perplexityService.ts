export interface PerplexityResponse {
  content: string;
  sources?: string[];
}

export class PerplexityService {
  private static readonly API_KEY = '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';
  private static readonly API_URL = 'https://api.perplexity.ai/chat/completions';

  static async searchWeb(query: string): Promise<string> {
    try {
      console.log('🔍 Iniciando pesquisa web:', query);

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content: "Você é um assistente de pesquisa especializado em consultoria empresarial. Forneça informações precisas, atualizadas e relevantes sobre empresas, mercados e tendências de negócios. Responda em português brasileiro."
            },
            {
              role: "user",
              content: query
            }
          ],
          max_tokens: 1000,
          temperature: 0.2
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na API Perplexity:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Pesquisa concluída com sucesso');
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('❌ Erro na pesquisa:', error);
      throw new Error(`Erro na pesquisa: ${error.message}`);
    }
  }
}