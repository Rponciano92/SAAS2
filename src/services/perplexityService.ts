export interface PerplexityResponse {
  content: string;
  sources?: string[];
}

export class PerplexityService {
  private static readonly API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY || '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';
  private static readonly API_URL = 'https://api.perplexity.ai/chat/completions';
  private static lastRequestTime = 0;
  private static readonly MIN_INTERVAL = 2000; // 2 segundos entre requisições

  private static async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.MIN_INTERVAL) {
      const waitTime = this.MIN_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  static async searchWeb(query: string, retries = 3): Promise<string> {
    await this.waitForRateLimit();
    
    for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log('🔍 Iniciando pesquisa web:', query);

        const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "sonar-small-online",
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
            temperature: 0.2,
            top_p: 0.9,
            return_citations: true,
            search_recency_filter: "month",
            stream: false
        })
      });

        if (response.status === 429) {
          if (attempt === retries) {
            throw new Error(`Rate limit exceeded after ${retries} attempts`);
          }
          
          const backoffTime = Math.pow(2, attempt) * 1000;
          console.log(`Rate limit hit, waiting ${backoffTime}ms before retry ${attempt + 1}`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          continue;
        }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na API Perplexity:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Pesquisa concluída com sucesso');
      
        return data.choices[0]?.message?.content || 'Informação não disponível';
        
    } catch (error) {
        if (attempt === retries) {
          console.error('❌ Erro na pesquisa após todas as tentativas:', error);
          throw new Error(`Erro na pesquisa: ${error.message}`);
        }
        
        console.log(`Tentativa ${attempt} falhou, tentando novamente...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}