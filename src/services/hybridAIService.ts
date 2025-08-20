// Hybrid AI Service - Combina IA Especialista + IA de Pesquisa
import { PerplexityService, PerplexityResponse } from './perplexityService';
import { EmpresaDetalhes } from '@/types/company';

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
  
  /**
   * Gera resposta usando sistema híbrido
   */
  async generateResponse(
    pergunta: string, 
    company?: EmpresaDetalhes, 
    context?: string
  ): Promise<HybridAIResponse> {
    try {
      console.log('🤖 Iniciando resposta híbrida para:', pergunta);

      // 1. Tentar resposta da IA Especialista primeiro
      const respostaEspecialista = this.generateSpecialistResponse(pergunta, company);
      
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
      const hybridResponse = this.combineResponses(respostaEspecialista, searchResult, pergunta);
      
      return {
        content: hybridResponse,
        source: 'hibrido',
        searchUsed: true,
        citations: searchResult.citations,
        relatedQuestions: searchResult.relatedQuestions,
        acoesSugeridas: this.generateHybridActions(pergunta, company)
      };

    } catch (error) {
      console.error('❌ Erro no sistema híbrido:', error);
      
      // Fallback para IA Especialista em caso de erro
      const fallbackResponse = this.generateSpecialistResponse(pergunta, company);
      return {
        content: fallbackResponse.content + '\n\n⚠️ *Pesquisa web temporariamente indisponível*',
        source: 'especialista',
        searchUsed: false,
        acoesSugeridas: fallbackResponse.acoesSugeridas
      };
    }
  }

  /**
   * Gera resposta da IA Especialista (lógica atual)
   */
  private generateSpecialistResponse(pergunta: string, company?: EmpresaDetalhes) {
    const perguntaLower = pergunta.toLowerCase();
    
    if (perguntaLower.includes('roi') || perguntaLower.includes('retorno')) {
      return {
        content: company 
          ? `O ROI atual da ${company.nome} está em análise. Baseado nos dados históricos, estamos vendo uma tendência positiva nos últimos 3 meses, principalmente devido às iniciativas de ${company.configuracaoIA.foco[0]}.`
          : `🎯 **Estratégias para Aumentar ROI:**\n\n**Ações Imediatas (0-30 dias):**\n• Otimizar processos operacionais existentes\n• Implementar automações simples\n• Revisar estrutura de custos\n\n**Médio Prazo (1-3 meses):**\n• Desenvolver novos canais de receita\n• Melhorar eficiência da equipe de vendas\n• Implementar métricas de performance`,
        acoesSugeridas: ['Plano de implementação', 'Análise de custos', 'Projeção de resultados']
      };
    }
    
    if (perguntaLower.includes('reunião') || perguntaLower.includes('agendar')) {
      return {
        content: company
          ? `Posso ajudar a preparar sua próxima reunião com a ${company.nome}${company.proximaReuniao ? `, que está agendada para ${new Date(company.proximaReuniao).toLocaleString()}` : ''}. Gostaria que eu gerasse uma pauta baseada nos últimos relatórios e KPIs?`
          : `📅 **Preparação de Reunião Inteligente:**\n\n**Agenda Sugerida:**\n1. Revisão de resultados (15 min)\n2. Discussão de desafios atuais (20 min)\n3. Apresentação de soluções (25 min)\n4. Definição de próximos passos (10 min)`,
        acoesSugeridas: ['Criar apresentação', 'Gerar relatório', 'Definir KPIs']
      };
    }

    // Resposta genérica que pode acionar pesquisa
    return {
      content: `Entendi sua pergunta sobre "${pergunta}". Como seu assistente de consultoria especializado, posso ajudá-lo com análises estratégicas, insights financeiros e gestão de clientes. Poderia ser mais específico sobre o que precisa?`,
      acoesSugeridas: ['Ver empresas ativas', 'Gerar análise', 'Buscar metodologias']
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
      
      // 6. Resposta especialista é genérica
      respostaEspecialista.content.includes('Poderia ser mais específico') ||
      respostaEspecialista.content.length < 200
    );
  }

  /**
   * Combina respostas da IA Especialista e IA de Pesquisa
   */
  private combineResponses(
    especialistaResponse: any, 
    searchResult: string, 
    pergunta: string
  ): string {
    const perguntaLower = pergunta.toLowerCase();
    
    // Se a pergunta é sobre tendências/mercado, priorizar pesquisa
    if (perguntaLower.includes('tendência') || perguntaLower.includes('mercado')) {
      return `🔍 **Dados Atualizados do Mercado:**\n\n${searchResult}\n\n🧠 **Análise Especializada:**\n\n${especialistaResponse.content}\n\n💡 **Recomendação Integrada:** Considerando tanto os dados atuais quanto as metodologias de consultoria, sugiro combinar essas informações para uma estratégia mais robusta.`;
    }
    
    // Se a pergunta é sobre empresa específica
    if (perguntaLower.includes('empresa')) {
      return `🧠 **Conhecimento Especializado:**\n\n${especialistaResponse.content}\n\n🔍 **Informações Atualizadas:**\n\n${searchResult}\n\n📊 **Síntese:** Combinando minha expertise em consultoria com dados atuais do mercado para fornecer uma visão completa.`;
    }
    
    // Combinação padrão
    return `🤖🔍 **Resposta Híbrida:**\n\n**Análise Especializada:**\n${especialistaResponse.content}\n\n**Dados Atualizados:**\n${searchResult}\n\n**Conclusão:** Esta resposta combina conhecimento especializado em consultoria com informações atualizadas do mercado.`;
  }

  /**
   * Gera ações sugeridas para resposta híbrida
   */
  private generateHybridActions(pergunta: string, company?: EmpresaDetalhes): string[] {
    const perguntaLower = pergunta.toLowerCase();
    
    if (perguntaLower.includes('mercado')) {
      return [
        'Análise competitiva detalhada',
        'Relatório de posicionamento',
        'Estratégia de entrada no mercado',
        'Benchmarking setorial'
      ];
    }
    
    if (perguntaLower.includes('tendência')) {
      return [
        'Roadmap de inovação',
        'Análise de oportunidades',
        'Plano de adaptação',
        'Monitoramento contínuo'
      ];
    }
    
    return [
      'Aprofundar análise',
      'Gerar relatório completo',
      'Agendar reunião estratégica',
      'Buscar dados complementares'
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