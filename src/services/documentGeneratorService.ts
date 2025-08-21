import jsPDF from 'jspdf';
import { CompanyResearchData } from './companyResearchService';

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  sections: DocumentSection[];
}

export interface DocumentSection {
  title: string;
  content: string;
  type: 'text' | 'list' | 'table' | 'chart';
  formatting?: {
    fontSize?: number;
    bold?: boolean;
    color?: string;
  };
}

export class DocumentGeneratorService {
  
  async generateCompanyReport(
    companyName: string,
    companyData: CompanyResearchData,
    template: 'executive' | 'detailed' | 'summary' = 'executive'
  ): Promise<Blob> {
    const doc = new jsPDF();
    let yPosition = 20;

    // Configurações do documento
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;

    // Função auxiliar para adicionar texto
    const addText = (text: string, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * lineHeight + 5;
    };

    // Cabeçalho profissional
    this.addHeader(doc, companyName);
    yPosition = 50;

    // Aviso sobre dados da internet
    this.addDataDisclaimer(doc, yPosition);
    yPosition += 35;

    // Informações básicas
    addText(`EMPRESA: ${companyData.basicInfo.name}`, 16, true, [0, 59, 109]);
    if (companyData.basicInfo.cnpj) {
      addText(`CNPJ: ${companyData.basicInfo.cnpj}`, 12);
    }
    addText(`Data da Pesquisa: ${companyData.lastUpdated.toLocaleDateString('pt-BR')}`, 12);
    addText(`Fonte: Pesquisa automatizada na internet`, 10, false, [128, 128, 128]);
    yPosition += 15;

    // Seções do relatório baseadas no template
    const sections = this.getSectionsForTemplate(template, companyData);
    
    sections.forEach((section, index) => {
      addText(`${index + 1}. ${section.title}`, 14, true, [0, 59, 109]);
      addText(section.content, 11);
      yPosition += 8;
    });

    // Stakeholders identificados
    if (companyData.stakeholders.length > 0) {
      addText('PRINCIPAIS EXECUTIVOS IDENTIFICADOS', 14, true, [0, 59, 109]);
      companyData.stakeholders.forEach((stakeholder, index) => {
        addText(`${index + 1}. ${stakeholder.name} - ${stakeholder.position}`, 11, true);
        addText(`   ${stakeholder.background}`, 10, false, [100, 100, 100]);
      });
    }

    // Rodapé profissional
    this.addFooter(doc);

    return doc.output('blob');
  }

  async generateExecutiveSummary(
    companyName: string,
    keyInsights: string[],
    recommendations: string[]
  ): Promise<Blob> {
    const doc = new jsPDF();
    
    // Cabeçalho executivo
    doc.setFillColor(0, 59, 109);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO EXECUTIVO', 20, 25);
    doc.text(companyName, 20, 35);
    
    let yPos = 60;
    
    // Insights principais
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INSIGHTS PRINCIPAIS', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    keyInsights.forEach((insight, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${insight}`, 170);
      doc.text(lines, 25, yPos);
      yPos += lines.length * 6 + 5;
    });
    
    yPos += 10;
    
    // Recomendações
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMENDAÇÕES ESTRATÉGICAS', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    recommendations.forEach((rec, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
      doc.text(lines, 25, yPos);
      yPos += lines.length * 6 + 5;
    });

    return doc.output('blob');
  }

  private addHeader(doc: jsPDF, companyName: string) {
    // Fundo azul para o cabeçalho
    doc.setFillColor(0, 59, 109);
    doc.rect(0, 0, 210, 35, 'F');
    
    // Título em branco
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE PESQUISA EMPRESARIAL', 20, 20);
    
    doc.setFontSize(14);
    doc.text(companyName.toUpperCase(), 20, 30);
  }

  private addDataDisclaimer(doc: jsPDF, yPosition: number) {
    // Caixa de aviso
    doc.setFillColor(255, 243, 205); // Amarelo claro
    doc.rect(20, yPosition - 5, 170, 25, 'F');
    
    // Borda da caixa
    doc.setDrawColor(255, 193, 7);
    doc.setLineWidth(1);
    doc.rect(20, yPosition - 5, 170, 25);
    
    // Texto do aviso
    doc.setTextColor(133, 77, 14);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    const disclaimerText = '⚠️ AVISO: As informações contidas neste documento foram obtidas através de pesquisa automatizada na internet. Os dados podem estar desatualizados ou imprecisos. Recomenda-se verificação manual para maior precisão.';
    const lines = doc.splitTextToSize(disclaimerText, 160);
    
    lines.forEach((line: string, index: number) => {
      doc.text(line, 25, yPosition + (index * 5));
    });
  }

  private addFooter(doc: jsPDF) {
    const totalPages = doc.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.height;
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      
      // Linha superior do rodapé
      doc.text(`Página ${i} de ${totalPages} - Gerado automaticamente pelo Sistema Aether`, 20, pageHeight - 15);
      
      // Linha inferior do rodapé
      doc.text(`Fonte: Pesquisa web automatizada - ${new Date().toLocaleString('pt-BR')}`, 20, pageHeight - 10);
      
      // Linha de separação
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 20, 190, pageHeight - 20);
    }
  }

  private getSectionsForTemplate(template: string, data: CompanyResearchData): DocumentSection[] {
    const baseSections = [
      {
        title: 'VISÃO GERAL DA EMPRESA',
        content: data.researchResults.companyOverview,
        type: 'text' as const
      },
      {
        title: 'LIDERANÇA E EXECUTIVOS',
        content: data.researchResults.leadership,
        type: 'text' as const
      },
      {
        title: 'POSIÇÃO NO MERCADO',
        content: data.researchResults.marketPosition,
        type: 'text' as const
      }
    ];

    if (template === 'detailed') {
      baseSections.push(
        {
          title: 'INFORMAÇÕES FINANCEIRAS',
          content: data.researchResults.financialInfo,
          type: 'text' as const
        },
        {
          title: 'PRINCIPAIS CONCORRENTES',
          content: data.researchResults.competitors,
          type: 'text' as const
        },
        {
          title: 'NOTÍCIAS E DESENVOLVIMENTOS RECENTES',
          content: data.researchResults.recentNews,
          type: 'text' as const
        }
      );
    }

    return baseSections;
  }

  async generateCustomDocument(
    title: string,
    sections: DocumentSection[],
    options: {
      includeHeader?: boolean;
      includeFooter?: boolean;
      watermark?: string;
    } = {}
  ): Promise<Blob> {
    const doc = new jsPDF();
    let yPosition = 20;

    if (options.includeHeader !== false) {
      this.addCustomHeader(doc, title);
      yPosition = 50;
    }

    sections.forEach(section => {
      yPosition = this.addCustomSection(doc, section, yPosition);
    });

    if (options.includeFooter !== false) {
      this.addFooter(doc);
    }

    if (options.watermark) {
      this.addWatermark(doc, options.watermark);
    }

    return doc.output('blob');
  }

  private addCustomHeader(doc: jsPDF, title: string) {
    doc.setFillColor(0, 59, 109);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 20, 20);
  }

  private addCustomSection(doc: jsPDF, section: DocumentSection, yPosition: number): number {
    const pageHeight = doc.internal.pageSize.height;
    
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Título da seção
    doc.setFontSize(section.formatting?.fontSize || 14);
    doc.setFont('helvetica', section.formatting?.bold ? 'bold' : 'normal');
    doc.setTextColor(0, 59, 109);
    doc.text(section.title, 20, yPosition);
    yPosition += 15;

    // Conteúdo da seção
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const lines = doc.splitTextToSize(section.content, 170);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 6;
    });

    return yPosition + 10;
  }

  private addWatermark(doc: jsPDF, watermarkText: string) {
    const totalPages = doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(50);
      doc.setFont('helvetica', 'bold');
      
      // Rotacionar e posicionar watermark
      doc.text(watermarkText, 105, 150, {
        angle: 45,
        align: 'center'
      });
    }
  }
}