// Hybrid AI Service - Combina IA Especialista + IA de Pesquisa
import { PerplexityService, PerplexityResponse } from './perplexityService';
import { EmpresaDetalhes } from '@/types/company';
import { CompanyResearchData } from './companyResearchService';
import { KnowledgeBaseService } from './knowledgeBaseService';
import { CompanyResearchData } from './companyResearchService';
import { KnowledgeBaseService } from './knowledgeBaseService';

export type AISource = 'especialista' | 'pesquisa' | 'hibrido';

export interface HybridAIResponse {
  content: string;
  source: AISource;
  searchUsed: boolean;
  citations?: string[];
  relatedQuestions?: string[];
  acoesSugeridas?: string[];
}

export class HybridAIService {
  private knowledgeBaseService: KnowledgeBaseService;

  constructor() {
    this.knowledgeBaseService = new KnowledgeBaseService();
  }
  
  /**
   * Gera resposta usando sistema híbrido com contexto enriquecido
   */
  async generateResponse(
    pergunta: string, 
    company?: EmpresaDetalhes, 
    companyResearch?: CompanyResearchData
  ): Promise<HybridAIResponse> {
    try {
      console.log('🤖 Iniciando resposta híbrida para:', pergunta);

      // 1. Buscar conhecimento relevante na base
      const relevantKnowledge = await this.knowledgeBaseService.searchKnowledgeBase(pergunta, {
        minQuality: 7
      });

      // 1. Tentar resposta da IA Especialista primeiro
      const respostaEspecialista = this.generateSpecialistResponse(pergunta, company, companyResearch, relevantKnowledge);
      
      // 2. Verificar se precisa de pesquisa
      const needsSearch = this.shouldUseWebSearch(pergunta, respostaEspecialista);
      
      if (!needsSearch) {
        console.log('🧠 Usando apenas IA Especialista');
        return {
          content: respostaEspecialista.content,
          source: 'especialista',
          searchUsed: false,
          acoesSugeridas: respostaEspecialista.acoesSugeridas
        };
      }

      // 3. Acionar IA de Pesquisa
      console.log('🔍 Acionando IA de Pesquisa...');
      const searchResult = await PerplexityService.searchWeb(pergunta);
      
      // 4. Combinar respostas
      const hybridResponse = this.combineResponses(respostaEspecialista, searchResult, pergunta, relevantKnowledge);
      
      return {
        content: hybridResponse,
        source: 'hibrido',
        searchUsed: true,
        citations: ['Pesquisa web via Perplexity AI', 'Base de conhecimento interna'],
        relatedQuestions: this.generateRelatedQuestions(pergunta, company),
        acoesSugeridas: this.generateHybridActions(pergunta, company)
      };

    } catch (error) {
      console.error('❌ Erro no sistema híbrido:', error);
      
      // Fallback para IA Especialista em caso de erro
      const fallbackResponse = this.generateSpecialistResponse(pergunta, company, companyResearch);
      return {
        content: fallbackResponse.content + '\n\n⚠️ *Pesquisa web temporariamente indisponível*',
        source: 'especialista',
        searchUsed: false,
        acoesSugeridas: fallbackResponse.acoesSugeridas
      };
    }
  }

  /**
   * Gera resposta da IA Especialista com contexto enriquecido
   */
  private generateSpecialistResponse(
    pergunta: string, 
    company?: EmpresaDetalhes, 
    companyResearch?: CompanyResearchData,
    knowledgeBase?: any[]
  ) {
    const perguntaLower = pergunta.toLowerCase();
    
    // Respostas enriquecidas com dados de pesquisa
    if (perguntaLower.includes('roi') || perguntaLower.includes('retorno')) {
      let content = '';
      
      if (company) {
        content = `📊 **ROI da ${company.nome}:**\n\n`;
        content += `• ROI Atual: ${company.roi || 'Em análise'}\n`;
        content += `• Foco Principal: ${company.configuracaoIA.foco[0]}\n`;
        content += `• Horas Economizadas: ${company.estatisticas.horasEconomizadas}h\n\n`;
        
        if (companyResearch) {
          content += `🔍 **Dados de Pesquisa:**\n`;
          content += `${companyResearch.researchResults.financialInfo.substring(0, 300)}...\n\n`;
        }
        
        content += `🎯 **Recomendações Específicas:**\n`;
        content += `• Manter foco em ${company.configuracaoIA.foco.join(', ')}\n`;
        content += `• Monitorar KPIs: ${company.estatisticas.kpisMonitorados} ativos\n`;
        content += `• Próxima reunião: ${company.proximaReuniao ? new Date(company.proximaReuniao).toLocaleDateString() : 'Agendar'}`;
      } else {
        content = `🎯 **Estratégias para Aumentar ROI:**\n\n**Ações Imediatas (0-30 dias):**\n• Otimizar processos operacionais existentes\n• Implementar automações simples\n• Revisar estrutura de custos\n\n**Médio Prazo (1-3 meses):**\n• Desenvolver novos canais de receita\n• Melhorar eficiência da equipe de vendas\n• Implementar métricas de performance`;
      }
      
      return {
        content,
        acoesSugeridas: ['Análise detalhada de ROI', 'Plano de otimização', 'Projeção trimestral']
      };
    }
    
    if (perguntaLower.includes('executivos') || perguntaLower.includes('liderança')) {
      let content = '';
      
      if (companyResearch && companyResearch.stakeholders.length > 0) {
        content = `👥 **Liderança da ${company?.nome || 'empresa'}:**\n\n`;
        companyResearch.stakeholders.forEach((exec, index) => {
          content += `${index + 1}. **${exec.name}** - ${exec.position}\n`;
          content += `   ${exec.background}\n\n`;
        });
        content += `📊 **Análise de Liderança:**\n${companyResearch.researchResults.leadership.substring(0, 400)}...`;
      } else if (company && company.stakeholders.length > 0) {
        content = `👥 **Stakeholders Cadastrados:**\n\n`;
        company.stakeholders.forEach((stakeholder, index) => {
          content += `${index + 1}. **${stakeholder.nome}** - ${stakeholder.cargo}\n`;
          content += `   📧 ${stakeholder.email}\n\n`;
        });
      } else {
        content = `👥 **Análise de Liderança:**\n\nPara uma análise completa da liderança, recomendo:\n\n• Identificar stakeholders-chave\n• Mapear estrutura organizacional\n• Avaliar estilo de liderança\n• Analisar processo decisório`;
      }
      
      return {
        content,
        acoesSugeridas: ['Pesquisar executivos', 'Mapear organograma', 'Análise de liderança']
      };
    }

    if (perguntaLower.includes('mercado') || perguntaLower.includes('concorrente')) {
      let content = '';
      
      if (companyResearch) {
        content = `🏢 **Análise de Mercado:**\n\n`;
        content += `**Posicionamento:**\n${companyResearch.researchResults.marketPosition.substring(0, 300)}...\n\n`;
        content += `**Concorrentes:**\n${companyResearch.researchResults.competitors.substring(0, 300)}...\n\n`;
        content += `**Notícias Recentes:**\n${companyResearch.researchResults.recentNews.substring(0, 200)}...`;
      } else {
        content = `🏢 **Análise de Mercado Estratégica:**\n\n**Framework de Análise:**\n• Mapeamento competitivo\n• Análise de posicionamento\n• Identificação de oportunidades\n• Avaliação de ameaças\n• Tendências do setor`;
      }
      
      return {
        content,
        acoesSugeridas: ['Pesquisa de mercado', 'Análise competitiva', 'Relatório setorial']
      };
    }
    // Resposta genérica que pode acionar pesquisa
    return {
      content: `🤖 **Assistente Inteligente:**\n\nEntendi sua pergunta sobre "${pergunta}". Como seu assistente híbrido, posso:\n\n• 🧠 **Análise Especializada:** Metodologias e estratégias testadas\n• 🔍 **Pesquisa Web:** Dados atualizados e tendências\n• 📊 **Relatórios:** Documentos personalizados\n• 🎯 **Insights:** Recomendações específicas\n\nPoderia ser mais específico sobre o que precisa?`,
      acoesSugeridas: ['Pesquisar empresa', 'Gerar relatório', 'Análise de mercado', 'Buscar metodologias']
    };
  }

  /**
   * Determina se deve usar pesquisa web
   */
  private shouldUseWebSearch(pergunta: string, respostaEspecialista: any): boolean {
    const perguntaLower = pergunta.toLowerCase();
    
    // Acionar pesquisa se:
    return (
      // 1. Pergunta sobre dados específicos/atuais
      perguntaLower.includes('atual') ||
      perguntaLower.includes('recente') ||
      perguntaLower.includes('2024') ||
      perguntaLower.includes('2025') ||
      perguntaLower.includes('hoje') ||
      perguntaLower.includes('agora') ||
      
      // 2. Pergunta sobre mercado/tendências
      perguntaLower.includes('mercado') ||
      perguntaLower.includes('tendência') ||
      perguntaLower.includes('tendencia') ||
      perguntaLower.includes('concorrente') ||
      perguntaLower.includes('benchmark') ||
      perguntaLower.includes('setor') ||
      
      // 3. Pergunta sobre empresas específicas não conhecidas
      (perguntaLower.includes('empresa') && !perguntaLower.includes('techstart') && !perguntaLower.includes('retailmax')) ||
      
      // 4. Pergunta sobre regulamentações
      perguntaLower.includes('lei') ||
      perguntaLower.includes('regulamentação') ||
      perguntaLower.includes('compliance') ||
      perguntaLower.includes('lgpd') ||
      
      // 5. Pergunta sobre dados financeiros/econômicos
      perguntaLower.includes('inflação') ||
      perguntaLower.includes('economia') ||
      perguntaLower.includes('pib') ||
      perguntaLower.includes('juros') ||
      
      // 6. Pergunta sobre notícias ou eventos recentes
      perguntaLower.includes('notícia') ||
      perguntaLower.includes('aconteceu') ||
      perguntaLower.includes('novidade') ||
      
      // 6. Resposta especialista é genérica
      respostaEspecialista.content.includes('Poderia ser mais específico') ||
      respostaEspecialista.content.length < 200
    );
  }

  /**
   * Combina respostas com contexto da base de conhecimento
   */
  private combineResponses(
    especialistaResponse: any, 
    searchResult: string, 
    pergunta: string,
    knowledgeBase?: any[]
  ): string {
    const perguntaLower = pergunta.toLowerCase();
    
    let knowledgeContext = '';
    if (knowledgeBase && knowledgeBase.length > 0) {
      knowledgeContext = `\n\n📚 **Base de Conhecimento:**\n`;
      knowledgeBase.slice(0, 2).forEach((item, index) => {
        knowledgeContext += `${index + 1}. ${item.title} (Qualidade: ${item.analysis.quality}/10)\n`;
      });
    }
    
    // Se a pergunta é sobre tendências/mercado, priorizar pesquisa
    if (perguntaLower.includes('tendência') || perguntaLower.includes('mercado')) {
      return `🔍 **Dados Atualizados do Mercado:**\n\n${searchResult}\n\n🧠 **Análise Especializada:**\n\n${especialistaResponse.content}${knowledgeContext}\n\n💡 **Síntese Inteligente:** Combinando dados atuais, expertise interna e metodologias validadas para uma estratégia robusta.`;
    }
    
    // Se a pergunta é sobre empresa específica
    if (perguntaLower.includes('empresa')) {
      return `🧠 **Análise Especializada:**\n\n${especialistaResponse.content}\n\n🔍 **Pesquisa Atualizada:**\n\n${searchResult}${knowledgeContext}\n\n📊 **Síntese Inteligente:** Visão completa combinando expertise, dados atuais e conhecimento validado.`;
    }
    
    // Combinação padrão
    return `🤖🔍 **Resposta Híbrida Inteligente:**\n\n**Análise Especializada:**\n${especialistaResponse.content}\n\n**Dados Atualizados:**\n${searchResult}${knowledgeContext}\n\n**Conclusão:** Resposta completa combinando expertise, pesquisa web e base de conhecimento validada.`;
  }

  /**
   * Gera perguntas relacionadas baseadas no contexto
   */
  private generateRelatedQuestions(pergunta: string, company?: EmpresaDetalhes): string[] {
    const perguntaLower = pergunta.toLowerCase();
    
    if (perguntaLower.includes('roi')) {
      return [
        'Como melhorar o ROI nos próximos 6 meses?',
        'Quais métricas acompanhar para otimizar ROI?',
        'Benchmarks de ROI no setor da empresa?'
      ];
    }
    
    if (perguntaLower.includes('mercado')) {
      return [
        'Principais concorrentes no mercado atual?',
        'Tendências emergentes no setor?',
        'Oportunidades de expansão identificadas?'
      ];
    }
    
    if (company) {
      return [
        `Como está o desempenho da ${company.nome}?`,
        `Próximos passos para ${company.nome}?`,
        `Análise SWOT da ${company.nome}?`
      ];
    }
    
    return [
      'Metodologias de consultoria mais eficazes?',
      'Como estruturar uma análise estratégica?',
      'Ferramentas de diagnóstico empresarial?'
    ];
  }
  /**
   * Gera ações sugeridas para resposta híbrida
   */
  private generateHybridActions(pergunta: string, company?: EmpresaDetalhes): string[] {
    const perguntaLower = pergunta.toLowerCase();
    
    if (perguntaLower.includes('mercado')) {
      return [
        'Pesquisar concorrentes automaticamente',
        'Gerar relatório de mercado',
        'Análise competitiva com IA',
        'Documento de posicionamento'
      ];
    }
    
    if (perguntaLower.includes('tendência')) {
      return [
        'Pesquisa de tendências setoriais',
        'Relatório de inovação',
        'Análise de oportunidades',
        'Documento de estratégia'
      ];
    }
    
    return [
      'Pesquisa automática',
      'Gerar documento PDF',
      'Análise com IA',
      'Relatório executivo'
    ];
  }

  // Métodos auxiliares para extrair informações da pergunta
  private extractSectorFromQuery(pergunta: string): string {
    const setores = ['tecnologia', 'varejo', 'saúde', 'financeiro', 'educação', 'indústria'];
    const found = setores.find(setor => pergunta.toLowerCase().includes(setor));
    return found || 'tecnologia';
  }

  private extractCompanyFromQuery(pergunta: string): string {
    // Tentar extrair nome da empresa da pergunta
    const words = pergunta.split(' ');
    const companyIndex = words.findIndex(word => word.toLowerCase().includes('empresa'));
    if (companyIndex !== -1 && companyIndex < words.length - 1) {
      return words[companyIndex + 1];
    }
    return 'empresa brasileira';
  }

  private extractTopicFromQuery(pergunta: string): string {
    if (pergunta.toLowerCase().includes('lgpd')) return 'LGPD';
    if (pergunta.toLowerCase().includes('trabalhista')) return 'legislação trabalhista';
    if (pergunta.toLowerCase().includes('tributário')) return 'legislação tributária';
    return 'compliance empresarial';
  }

  private extractMetricFromQuery(pergunta: string): string {
    if (pergunta.toLowerCase().includes('roi')) return 'ROI';
    if (pergunta.toLowerCase().includes('receita')) return 'receita';
    if (pergunta.toLowerCase().includes('margem')) return 'margem de lucro';
    return 'performance geral';
  }
}

export const hybridAIService = new HybridAIService();