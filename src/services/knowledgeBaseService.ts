import { PerplexityService } from './perplexityService';

export interface ContentAnalysis {
  quality: number; // 0-10
  relevance: number; // 0-10
  category: string;
  summary: string;
  approved: boolean;
  feedback: string;
  tags: string[];
  confidence: number;
}

export interface ContentMetadata {
  author: string;
  source: string;
  tags: string[];
  type: 'article' | 'document' | 'note' | 'research' | 'methodology' | 'case_study';
  dateCreated: Date;
  language: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  metadata: ContentMetadata;
  analysis: ContentAnalysis;
  createdAt: string;
  updatedAt: string;
  status: 'approved' | 'pending' | 'rejected' | 'revision';
  views: number;
  rating: number;
  votes: number;
}

export class KnowledgeBaseService {
  private perplexityService: PerplexityService;
  
  constructor() {
    this.perplexityService = new PerplexityService();
  }
  
  // IA analisadora de conteúdo usando Perplexity
  async analyzeContent(content: string, metadata: ContentMetadata): Promise<ContentAnalysis> {
    try {
      console.log('🧠 Analisando conteúdo com IA...');
      
      const analysisPrompt = `
        Analise este conteúdo para consultoria empresarial:
        
        CONTEÚDO: "${content.substring(0, 1000)}"
        TIPO: ${metadata.type}
        AUTOR: ${metadata.author}
        
        Avalie:
        1. Qualidade (0-10): Precisão, profundidade, utilidade
        2. Relevância (0-10): Aplicabilidade em consultoria
        3. Categoria: estrategia, financeiro, marketing, operacional, rh, tecnologia
        4. Aprovação: SIM/NÃO (aprovar se qualidade >= 7 e relevância >= 6)
        5. Feedback: Comentário construtivo
        6. Tags: 3-5 palavras-chave relevantes
        
        Responda em formato estruturado.
      `;
      
      const analysisResult = await this.perplexityService.searchWeb(analysisPrompt);
      
      return this.parseAnalysisResult(analysisResult, content);
      
    } catch (error) {
      console.error('❌ Erro na análise de conteúdo:', error);
      return this.getDefaultAnalysis(content);
    }
  }
  
  // Adicionar conteúdo à base de conhecimento
  async addToKnowledgeBase(
    title: string,
    content: string, 
    metadata: ContentMetadata
  ): Promise<KnowledgeItem> {
    try {
      // Analisar conteúdo com IA
      const analysis = await this.analyzeContent(content, metadata);
      
      const knowledgeItem: KnowledgeItem = {
        id: this.generateId(),
        title,
        content,
        metadata,
        analysis,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: analysis.approved ? 'approved' : 'pending',
        views: 0,
        rating: 0,
        votes: 0
      };
      
      // Salvar no sistema (Supabase ou localStorage)
      await this.saveKnowledgeItem(knowledgeItem);
      
      console.log('✅ Conteúdo adicionado à base:', {
        title,
        approved: analysis.approved,
        quality: analysis.quality,
        relevance: analysis.relevance
      });
      
      return knowledgeItem;
      
    } catch (error) {
      console.error('❌ Erro ao adicionar à base:', error);
      throw new Error(`Falha ao adicionar conteúdo: ${error.message}`);
    }
  }
  
  // Buscar conteúdo relevante na base
  async searchKnowledgeBase(
    query: string, 
    filters: {
      category?: string;
      type?: string;
      minQuality?: number;
      author?: string;
    } = {}
  ): Promise<KnowledgeItem[]> {
    try {
      // Buscar itens salvos
      const allItems = await this.loadKnowledgeItems();
      
      // Filtrar por query
      let filteredItems = allItems.filter(item => {
        const searchText = `${item.title} ${item.content} ${item.metadata.tags.join(' ')}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });
      
      // Aplicar filtros
      if (filters.category) {
        filteredItems = filteredItems.filter(item => item.analysis.category === filters.category);
      }
      
      if (filters.type) {
        filteredItems = filteredItems.filter(item => item.metadata.type === filters.type);
      }
      
      if (filters.minQuality) {
        filteredItems = filteredItems.filter(item => item.analysis.quality >= filters.minQuality);
      }
      
      if (filters.author) {
        filteredItems = filteredItems.filter(item => item.metadata.author === filters.author);
      }
      
      // Ordenar por relevância e qualidade
      filteredItems.sort((a, b) => {
        const scoreA = (a.analysis.quality + a.analysis.relevance) / 2;
        const scoreB = (b.analysis.quality + b.analysis.relevance) / 2;
        return scoreB - scoreA;
      });
      
      return filteredItems;
      
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      return [];
    }
  }
  
  // Sugerir conteúdo relacionado
  async suggestRelatedContent(currentContent: string): Promise<KnowledgeItem[]> {
    try {
      // Extrair palavras-chave do conteúdo atual
      const keywords = await this.extractKeywords(currentContent);
      
      // Buscar conteúdo relacionado
      const relatedItems = await this.searchKnowledgeBase(keywords.join(' '));
      
      return relatedItems.slice(0, 5); // Top 5 relacionados
      
    } catch (error) {
      console.error('❌ Erro ao sugerir conteúdo:', error);
      return [];
    }
  }
  
  // Validar conteúdo com múltiplos critérios
  async validateContent(content: string): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    try {
      const validationPrompt = `
        Valide este conteúdo para consultoria empresarial:
        "${content.substring(0, 800)}"
        
        Verifique:
        1. Precisão técnica
        2. Aplicabilidade prática
        3. Atualidade das informações
        4. Clareza da linguagem
        5. Completude do conteúdo
        
        Liste problemas encontrados e sugestões de melhoria.
      `;
      
      const validationResult = await this.perplexityService.searchWeb(validationPrompt);
      
      return this.parseValidationResult(validationResult);
      
    } catch (error) {
      console.error('❌ Erro na validação:', error);
      return {
        isValid: false,
        issues: ['Erro na validação automática'],
        suggestions: ['Revisar manualmente']
      };
    }
  }
  
  // Métodos auxiliares privados
  private parseAnalysisResult(analysisResult: string, originalContent: string): ContentAnalysis {
    // Extrair informações da análise usando regex e heurísticas
    const qualityMatch = analysisResult.match(/qualidade[:\s]*([0-9]+)/i);
    const relevanceMatch = analysisResult.match(/relevância[:\s]*([0-9]+)/i);
    const categoryMatch = analysisResult.match(/categoria[:\s]*([a-zA-Z]+)/i);
    const approvalMatch = analysisResult.match(/aprovação[:\s]*(sim|não)/i);
    
    const quality = qualityMatch ? parseInt(qualityMatch[1]) : 5;
    const relevance = relevanceMatch ? parseInt(relevanceMatch[1]) : 5;
    const category = categoryMatch ? categoryMatch[1].toLowerCase() : 'geral';
    const approved = approvalMatch ? approvalMatch[1].toLowerCase() === 'sim' : quality >= 7 && relevance >= 6;
    
    // Extrair tags
    const tags = this.extractTagsFromContent(originalContent);
    
    return {
      quality: Math.min(Math.max(quality, 0), 10),
      relevance: Math.min(Math.max(relevance, 0), 10),
      category,
      summary: analysisResult.substring(0, 200),
      approved,
      feedback: analysisResult,
      tags,
      confidence: (quality + relevance) / 20 // 0-1
    };
  }
  
  private getDefaultAnalysis(content: string): ContentAnalysis {
    return {
      quality: 5,
      relevance: 5,
      category: 'geral',
      summary: 'Análise automática indisponível',
      approved: false,
      feedback: 'Erro na análise automática. Revisar manualmente.',
      tags: this.extractTagsFromContent(content),
      confidence: 0.3
    };
  }
  
  private extractTagsFromContent(content: string): string[] {
    const commonWords = ['o', 'a', 'de', 'para', 'com', 'em', 'por', 'do', 'da', 'que', 'e', 'é', 'um', 'uma'];
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Contar frequência das palavras
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Retornar as 5 palavras mais frequentes
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }
  
  private async extractKeywords(content: string): Promise<string[]> {
    try {
      const keywordPrompt = `Extraia 5-8 palavras-chave principais deste conteúdo: "${content.substring(0, 500)}"`;
      const result = await this.perplexityService.searchWeb(keywordPrompt);
      
      // Extrair palavras-chave da resposta
      const keywords = result.match(/\b[a-zA-ZÀ-ÿ]{4,}\b/g) || [];
      return keywords.slice(0, 8);
      
    } catch (error) {
      return this.extractTagsFromContent(content);
    }
  }
  
  private parseValidationResult(validationResult: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Extrair problemas
    const problemsMatch = validationResult.match(/problemas?[:\s]*(.+?)(?=sugestões?|$)/is);
    if (problemsMatch) {
      const problemsText = problemsMatch[1];
      const problemLines = problemsText.split(/[.\n]/).filter(line => line.trim().length > 10);
      issues.push(...problemLines.slice(0, 5));
    }
    
    // Extrair sugestões
    const suggestionsMatch = validationResult.match(/sugestões?[:\s]*(.+?)$/is);
    if (suggestionsMatch) {
      const suggestionsText = suggestionsMatch[1];
      const suggestionLines = suggestionsText.split(/[.\n]/).filter(line => line.trim().length > 10);
      suggestions.push(...suggestionLines.slice(0, 5));
    }
    
    const isValid = issues.length === 0 || !validationResult.toLowerCase().includes('inválido');
    
    return { isValid, issues, suggestions };
  }
  
  private generateId(): string {
    return `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async saveKnowledgeItem(item: KnowledgeItem): Promise<void> {
    // Implementar salvamento no Supabase ou localStorage
    const existingItems = await this.loadKnowledgeItems();
    existingItems.push(item);
    localStorage.setItem('aether_knowledge_base', JSON.stringify(existingItems));
  }
  
  private async loadKnowledgeItems(): Promise<KnowledgeItem[]> {
    try {
      const stored = localStorage.getItem('aether_knowledge_base');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar base de conhecimento:', error);
      return [];
    }
  }
}