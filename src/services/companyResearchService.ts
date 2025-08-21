import { PerplexityService } from './perplexityService';
import jsPDF from 'jspdf';

export interface CompanyResearchData {
  basicInfo: {
    name: string;
    cnpj?: string;
    sector: string;
    size: string;
    website?: string;
  };
  researchResults: {
    companyOverview: string;
    leadership: string;
    marketPosition: string;
    recentNews: string;
    financialInfo: string;
    competitors: string;
  };
  stakeholders: Array<{
    name: string;
    position: string;
    background: string;
  }>;
  lastUpdated: Date;
  source: 'internet_research' | 'manual';
}

export class CompanyResearchService {
  
  // Detecta se é cliente grande que merece pesquisa automática
  static isLargeClient(companyData: any): boolean {
    const largeSizes = [
      'Grande (201-1000 funcionários)',
      'Corporação (1000+ funcionários)'
    ];
    
    const highRevenue = [
      'R$ 300 mi - R$ 1 bi',
      'Acima de R$ 1 bi'
    ];
    
    return largeSizes.includes(companyData.tamanhoEmpresa) || 
           largeSizes.includes(companyData.tipoAtuacao) ||
           highRevenue.includes(companyData.faturamentoAnual) ||
           highRevenue.includes(companyData.rendaMensal);
  }

  // Pesquisa informações completas da empresa
  static async researchCompany(companyName: string, cnpj?: string): Promise<CompanyResearchData> {
    try {
      console.log('🔍 Iniciando pesquisa automática para:', companyName);

      // Pesquisas específicas
      const queries = [
        `${companyName} empresa Brasil informações gerais história fundação`,
        `${companyName} diretoria executivos liderança CEO presidente`,
        `${companyName} posição mercado concorrentes setor`,
        `${companyName} notícias recentes 2024 2025 novidades`,
        `${companyName} faturamento receita dados financeiros`,
        `${companyName} principais concorrentes mercado brasileiro`
      ];

      // Executar pesquisas em paralelo
      const results = await Promise.all(
        queries.map(query => PerplexityService.searchWeb(query))
      );

      // Pesquisa adicional para stakeholders
      const stakeholdersQuery = `${companyName} diretores executivos CEO CFO CTO liderança nomes cargos`;
      const stakeholdersResult = await PerplexityService.searchWeb(stakeholdersQuery);

      // Extrair stakeholders do resultado
      const stakeholders = this.extractStakeholders(stakeholdersResult);

      return {
        basicInfo: {
          name: companyName,
          cnpj: cnpj,
          sector: '',
          size: '',
          website: ''
        },
        researchResults: {
          companyOverview: results[0],
          leadership: results[1],
          marketPosition: results[2],
          recentNews: results[3],
          financialInfo: results[4],
          competitors: results[5]
        },
        stakeholders,
        lastUpdated: new Date(),
        source: 'internet_research'
      };

    } catch (error) {
      console.error('❌ Erro na pesquisa automática:', error);
      // Tratar diferentes tipos de erro
      if (error.message.includes('Rate limit')) {
        throw new Error('⏳ Muitas pesquisas em pouco tempo. Tente novamente em alguns minutos.');
      } else if (error.message.includes('API key')) {
        throw new Error('🔑 Problema com a API key. Contate o administrador.');
      } else {
        throw new Error(`❌ Falha na pesquisa: ${error.message}`);
      }
    }
  }

  // Extrai stakeholders do texto de pesquisa
  private static extractStakeholders(text: string): Array<{name: string, position: string, background: string}> {
    const stakeholders = [];
    
    // Padrões comuns para identificar executivos
    const patterns = [
      /CEO[:\s]+([A-Za-zÀ-ÿ\s]+)/gi,
      /Presidente[:\s]+([A-Za-zÀ-ÿ\s]+)/gi,
      /Diretor[a]?\s+[A-Za-z]+[:\s]+([A-Za-zÀ-ÿ\s]+)/gi,
      /CFO[:\s]+([A-Za-zÀ-ÿ\s]+)/gi,
      /CTO[:\s]+([A-Za-zÀ-ÿ\s]+)/gi
    ];

    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 2) {
          stakeholders.push({
            name: match[1].trim(),
            position: match[0].split(':')[0].trim(),
            background: 'Informação obtida via pesquisa web'
          });
        }
      }
    });

    return stakeholders.slice(0, 10); // Máximo 10 stakeholders
  }

  // Gera documento PDF completo
  static async generateCompanyDocument(researchData: CompanyResearchData): Promise<Blob> {
    // Verificar se estamos no browser
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('PDF generation only available in browser environment');
    }
    
    const doc = new jsPDF();
    let yPosition = 20;

    // Configurações
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    const addText = (text: string, fontSize: number = 12, bold: boolean = false) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(fontSize);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * lineHeight + 5;
    };

    // Cabeçalho
    doc.setFillColor(0, 59, 109); // Cor azul do tema
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE PESQUISA EMPRESARIAL', margin, 20);
    
    doc.setTextColor(0, 0, 0);
    yPosition = 45;

    // Aviso sobre fonte dos dados
    doc.setFillColor(255, 243, 205); // Amarelo claro
    doc.rect(margin, yPosition - 5, 170, 25, 'F');
    doc.setTextColor(133, 77, 14);
    addText('⚠️ AVISO: As informações contidas neste documento foram obtidas através de pesquisa automatizada na internet. Os dados podem estar desatualizados ou imprecisos. Recomenda-se verificação manual para maior precisão.', 10, true);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    // Informações básicas
    addText(`EMPRESA: ${researchData.basicInfo.name}`, 16, true);
    if (researchData.basicInfo.cnpj) {
      addText(`CNPJ: ${researchData.basicInfo.cnpj}`, 12);
    }
    addText(`Data da Pesquisa: ${researchData.lastUpdated.toLocaleDateString('pt-BR')}`, 12);
    yPosition += 10;

    // Visão Geral da Empresa
    addText('1. VISÃO GERAL DA EMPRESA', 14, true);
    addText(researchData.researchResults.companyOverview, 11);
    yPosition += 5;

    // Liderança
    addText('2. LIDERANÇA E EXECUTIVOS', 14, true);
    addText(researchData.researchResults.leadership, 11);
    yPosition += 5;

    // Stakeholders identificados
    if (researchData.stakeholders.length > 0) {
      addText('3. PRINCIPAIS EXECUTIVOS IDENTIFICADOS', 14, true);
      researchData.stakeholders.forEach((stakeholder, index) => {
        addText(`${index + 1}. ${stakeholder.name} - ${stakeholder.position}`, 11, true);
        addText(`   ${stakeholder.background}`, 10);
      });
      yPosition += 5;
    }

    // Posição no Mercado
    addText('4. POSIÇÃO NO MERCADO', 14, true);
    addText(researchData.researchResults.marketPosition, 11);
    yPosition += 5;

    // Informações Financeiras
    addText('5. INFORMAÇÕES FINANCEIRAS', 14, true);
    addText(researchData.researchResults.financialInfo, 11);
    yPosition += 5;

    // Concorrentes
    addText('6. PRINCIPAIS CONCORRENTES', 14, true);
    addText(researchData.researchResults.competitors, 11);
    yPosition += 5;

    // Notícias Recentes
    addText('7. NOTÍCIAS E DESENVOLVIMENTOS RECENTES', 14, true);
    addText(researchData.researchResults.recentNews, 11);

    // Rodapé
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Página ${i} de ${totalPages} - Gerado automaticamente pelo Sistema Aether`, margin, pageHeight - 10);
      doc.text(`Fonte: Pesquisa web automatizada - ${new Date().toLocaleString('pt-BR')}`, margin, pageHeight - 5);
    }

    return doc.output('blob');
  }
}