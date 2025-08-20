import React, { useState } from 'react';
import { BarChart3, Upload, CheckCircle, Clock, AlertTriangle, FileText, Brain, Zap, TrendingUp, DollarSign } from 'lucide-react';

interface Analise {
  id: string;
  empresa: string;
  tipo: 'financeira' | 'operacional' | 'estrategica' | 'mercado';
  status: 'processando' | 'validacao' | 'aprovada' | 'rejeitada';
  dataUpload: string;
  dataValidacao?: string;
  especialista?: string;
  arquivos: string[];
  insights: string[];
  recomendacoes: string[];
  confianca: number;
  feedback?: string;
}

const mockAnalises: Analise[] = [
  {
    id: '1',
    empresa: 'TechStart Inovação',
    tipo: 'financeira',
    status: 'aprovada',
    dataUpload: '2025-01-14',
    dataValidacao: '2025-01-15',
    especialista: 'Dr. Carlos Mendes',
    arquivos: ['demonstrativo_financeiro.pdf', 'fluxo_caixa.xlsx'],
    insights: [
      'Crescimento de receita de 30% ao mês indica forte tração no mercado',
      'Burn rate de R$ 45K/mês é sustentável com runway de 18 meses',
      'Margem bruta de 75% está acima da média do setor'
    ],
    recomendacoes: [
      'Focar na retenção de clientes para reduzir CAC',
      'Diversificar fontes de receita para reduzir risco',
      'Implementar controles financeiros mais rigorosos'
    ],
    confianca: 92
  },
  {
    id: '2',
    empresa: 'RetailMax Varejo',
    tipo: 'operacional',
    status: 'validacao',
    dataUpload: '2025-01-15',
    especialista: 'Dra. Ana Silva',
    arquivos: ['processos_operacionais.pdf', 'kpis_operacao.xlsx'],
    insights: [
      'Gargalo identificado no processo de fulfillment',
      'Tempo médio de entrega 40% acima da concorrência'
    ],
    recomendacoes: [
      'Implementar automação no centro de distribuição',
      'Revisar parcerias logísticas'
    ],
    confianca: 87
  },
  {
    id: '3',
    empresa: 'InnovaCorp Solutions',
    tipo: 'estrategica',
    status: 'processando',
    dataUpload: '2025-01-15',
    arquivos: ['plano_estrategico.pdf', 'analise_concorrencia.docx'],
    insights: [],
    recomendacoes: [],
    confianca: 0
  }
];

export default function AnaliseEmpresa() {
  const [analises] = useState<Analise[]>(mockAnalises);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [tipoAnalise, setTipoAnalise] = useState('financeira');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAnalise = async () => {
    if (!empresaSelecionada || selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setSelectedFiles([]);
    alert('Análise enviada para processamento! Você será notificado quando estiver pronta.');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processando': return <Clock size={16} className="text-[#FFA500]" />;
      case 'validacao': return <AlertTriangle size={16} className="text-[#FFA500]" />;
      case 'aprovada': return <CheckCircle size={16} className="text-[#28A745]" />;
      case 'rejeitada': return <AlertTriangle size={16} className="text-[#EF4444]" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processando': return 'border-l-[#FFA500] bg-[#FFA500]/5';
      case 'validacao': return 'border-l-[#FFA500] bg-[#FFA500]/5';
      case 'aprovada': return 'border-l-[#28A745] bg-[#28A745]/5';
      case 'rejeitada': return 'border-l-[#EF4444] bg-[#EF4444]/5';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processando': return '⚡ Processando IA';
      case 'validacao': return '👨‍💼 Em Validação';
      case 'aprovada': return '✅ Aprovada';
      case 'rejeitada': return '❌ Rejeitada';
      default: return status;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'financeira': return '💰';
      case 'operacional': return '⚙️';
      case 'estrategica': return '🎯';
      case 'mercado': return '📈';
      default: return '📊';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'financeira': return 'Análise Financeira';
      case 'operacional': return 'Análise Operacional';
      case 'estrategica': return 'Análise Estratégica';
      case 'mercado': return 'Análise de Mercado';
      default: return tipo;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-xl shadow-lg">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="page-title">📊 Análises IA + Validação Humana</h1>
            <p className="text-gray-600">Insights profundos com IA offline validados por especialistas</p>
          </div>
        </div>

        {/* Métricas de Análise */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#0A74DA] mb-1">{analises.length}</div>
            <div className="text-sm text-gray-600">Total de Análises</div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#28A745] mb-1">{analises.filter(a => a.status === 'aprovada').length}</div>
            <div className="text-sm text-gray-600">Aprovadas</div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#FFA500] mb-1">{analises.filter(a => a.status === 'validacao').length}</div>
            <div className="text-sm text-gray-600">Em Validação</div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#B8860B] mb-1">89%</div>
            <div className="text-sm text-gray-600">Taxa de Aprovação</div>
          </div>
        </div>
      </div>

      {/* Nova Análise */}
      <div className="glass-card p-6">
        <h3 className="section-title flex items-center space-x-3 mb-6">
          <Brain className="text-[#0A74DA]" size={24} />
          <span>🚀 Nova Análise com IA</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#003B6D] mb-2">
              🏢 Empresa Cliente
            </label>
            <select
              value={empresaSelecionada}
              onChange={(e) => setEmpresaSelecionada(e.target.value)}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            >
              <option value="">Selecione uma empresa...</option>
              <option value="techstart">🚀 TechStart Inovação</option>
              <option value="retailmax">🛍️ RetailMax Varejo</option>
              <option value="innovacorp">🔧 InnovaCorp Solutions</option>
              <option value="fintech">💰 FinTech Solutions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#003B6D] mb-2">
              📊 Tipo de Análise
            </label>
            <select
              value={tipoAnalise}
              onChange={(e) => setTipoAnalise(e.target.value)}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            >
              <option value="financeira">💰 Análise Financeira</option>
              <option value="operacional">⚙️ Análise Operacional</option>
              <option value="estrategica">🎯 Análise Estratégica</option>
              <option value="mercado">📈 Análise de Mercado</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            📁 Upload de Documentos
          </label>
          <div className="upload-dropzone p-6 text-center cursor-pointer">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="analise-upload"
              accept=".pdf,.docx,.xlsx,.pptx,.csv"
            />
            <label htmlFor="analise-upload" className="cursor-pointer">
              <Upload size={32} className="mx-auto text-[#0A74DA] mb-3" />
              <p className="card-title mb-2">Arraste arquivos aqui ou clique para selecionar</p>
              <p className="text-gray-600 text-sm">
                Suporta PDF, DOCX, XLSX, PPTX, CSV (máx. 50MB cada)
              </p>
            </label>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mb-6">
            <h4 className="card-title mb-3">Arquivos Selecionados</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="glass-card-subtle p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText size={16} className="text-[#0A74DA]" />
                    <div>
                      <p className="font-medium text-[#003B6D] text-sm">{file.name}</p>
                      <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-[#EF4444] hover:bg-[#EF4444]/10 p-1 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmitAnalise}
          disabled={!empresaSelecionada || selectedFiles.length === 0 || isProcessing}
          className={`
            w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2
            ${(!empresaSelecionada || selectedFiles.length === 0 || isProcessing)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white hover:shadow-lg'
            }
          `}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              <span>🧠 IA Processando...</span>
            </>
          ) : (
            <>
              <Zap size={20} />
              <span>🚀 Iniciar Análise IA</span>
            </>
          )}
        </button>
      </div>

      {/* Histórico de Análises */}
      <div className="glass-card p-6">
        <h3 className="section-title flex items-center space-x-3 mb-6">
          <FileText className="text-[#B8860B]" size={24} />
          <span>📋 Histórico de Análises</span>
        </h3>

        <div className="space-y-4">
          {analises.map((analise) => (
            <div
              key={analise.id}
              className={`glass-card border-l-4 ${getStatusColor(analise.status)} p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTipoIcon(analise.tipo)}</span>
                  <div>
                    <h4 className="font-bold text-[#003B6D] flex items-center space-x-2">
                      <span>{getTipoLabel(analise.tipo)} - {analise.empresa}</span>
                      {getStatusIcon(analise.status)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Upload: {new Date(analise.dataUpload).toLocaleDateString()}
                      {analise.dataValidacao && ` • Validado: ${new Date(analise.dataValidacao).toLocaleDateString()}`}
                      {analise.especialista && ` • Por: ${analise.especialista}`}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(analise.status).replace('border-l-', 'text-').replace(' bg-', ' bg-')}`}>
                    {getStatusLabel(analise.status)}
                  </span>
                  {analise.confianca > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      🎯 Confiança: {analise.confianca}%
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">📁 Arquivos analisados:</p>
                <div className="flex flex-wrap gap-2">
                  {analise.arquivos.map((arquivo, index) => (
                    <span key={index} className="px-2 py-1 bg-[#0A74DA]/10 text-[#0A74DA] rounded text-xs">
                      {arquivo}
                    </span>
                  ))}
                </div>
              </div>

              {analise.insights.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold text-[#003B6D] mb-2 flex items-center space-x-2">
                    <TrendingUp size={16} />
                    <span>💡 Insights Identificados</span>
                  </h5>
                  <ul className="space-y-1">
                    {analise.insights.map((insight, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                        <span className="text-[#28A745] mt-1">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analise.recomendacoes.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold text-[#003B6D] mb-2 flex items-center space-x-2">
                    <DollarSign size={16} />
                    <span>🎯 Recomendações Estratégicas</span>
                  </h5>
                  <ul className="space-y-1">
                    {analise.recomendacoes.map((recomendacao, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                        <span className="text-[#0A74DA] mt-1">→</span>
                        <span>{recomendacao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analise.feedback && (
                <div className="bg-white/20 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 italic">
                    💬 Feedback do Especialista: {analise.feedback}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <button className="px-4 py-2 glass-button text-white rounded-lg hover:shadow-lg transition-all text-sm">
                  📄 Ver Relatório Completo
                </button>
                {analise.status === 'aprovada' && (
                  <button className="px-4 py-2 bg-gradient-to-r from-[#28A745] to-[#20C997] text-white rounded-lg hover:shadow-lg transition-all text-sm">
                    📧 Enviar para Cliente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}