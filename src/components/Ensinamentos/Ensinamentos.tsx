import React, { useState } from 'react';
import { Upload, Plus, MessageSquare, Trophy, FileText, CheckCircle, Clock, XCircle, Star, Award, Target } from 'lucide-react';

interface Contribuicao {
  id: string;
  tipo: 'arquivo' | 'conhecimento' | 'feedback';
  titulo: string;
  categoria: string;
  status: 'aprovado' | 'em_validacao' | 'rejeitado';
  pontos: number;
  data: string;
  feedback?: string;
}

interface Badge {
  nome: string;
  descricao: string;
  icone: string;
  conquistado: boolean;
  progresso?: number;
}

const mockContribuicoes: Contribuicao[] = [
  {
    id: '1',
    tipo: 'arquivo',
    titulo: 'Metodologia Análise Financeira Premium',
    categoria: '💰 Financeiro',
    status: 'aprovado',
    pontos: 50,
    data: '10/01/2025',
    feedback: 'Excelente contribuição! Metodologia será integrada à base principal'
  },
  {
    id: '2',
    tipo: 'conhecimento',
    titulo: 'Estratégia de Crescimento para Startups Tech',
    categoria: '🎯 Estratégia',
    status: 'em_validacao',
    pontos: 0,
    data: '12/01/2025'
  },
  {
    id: '3',
    tipo: 'feedback',
    titulo: 'Correção Análise TechStart - Projeções',
    categoria: '💬 Feedback',
    status: 'aprovado',
    pontos: 25,
    data: '14/01/2025',
    feedback: 'Feedback preciso que melhorou significativamente o modelo'
  },
  {
    id: '4',
    tipo: 'arquivo',
    titulo: 'Processo Operacional Genérico',
    categoria: '⚙️ Operações',
    status: 'rejeitado',
    pontos: 0,
    data: '08/01/2025',
    feedback: 'Conteúdo muito genérico. Precisa ser mais específico para consultoria'
  }
];

const mockBadges: Badge[] = [
  {
    nome: 'Primeiro Upload',
    descricao: 'Primeiro arquivo enviado com sucesso',
    icone: '🥇',
    conquistado: true
  },
  {
    nome: 'Contribuidor Ativo',
    descricao: '10 contribuições aprovadas',
    icone: '⭐',
    conquistado: true,
    progresso: 100
  },
  {
    nome: 'Especialista Premium',
    descricao: '1000 pontos alcançados',
    icone: '🏆',
    conquistado: false,
    progresso: 75
  },
  {
    nome: 'Mentor da IA',
    descricao: '50 feedbacks aprovados',
    icone: '🧠',
    conquistado: false,
    progresso: 45
  }
];

export default function Ensinamentos() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [activeTab, setActiveTab] = useState<'upload' | 'conhecimento' | 'feedback'>('upload');
  const [conhecimento, setConhecimento] = useState({
    categoria: 'estrategia',
    titulo: '',
    descricao: ''
  });
  const [feedback, setFeedback] = useState({
    tipo: 'correto',
    explicacao: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Simulate upload progress
    files.forEach(file => {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = (prev[file.name] || 0) + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...prev, [file.name]: 100 };
          }
          return { ...prev, [file.name]: newProgress };
        });
      }, 200);
    });
  };

  const removeFile = (index: number) => {
    const file = selectedFiles[index];
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[file.name];
      return newProgress;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle size={16} className="text-[#28A745]" />;
      case 'em_validacao': return <Clock size={16} className="text-[#FFA500]" />;
      case 'rejeitado': return <XCircle size={16} className="text-[#EF4444]" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'status-approved';
      case 'em_validacao': return 'status-pending';
      case 'rejeitado': return 'status-rejected';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'arquivo': return '📁';
      case 'conhecimento': return '📝';
      case 'feedback': return '💬';
      default: return '📄';
    }
  };

  const totalPontos = 1247;
  const ranking = 3;

  return (
    <div className="space-y-8 ensinamentos-container" role="main" aria-label="Ensinamentos da IA">
      {/* Header com Pontuação Premium */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#B8860B] to-[#DAA520] rounded-xl shadow-lg">
              <Trophy size={24} className="text-white" />
            </div>
            <div>
              <h1 className="page-title">🧠 Ensinamentos da IA</h1>
              <p className="text-gray-600">Contribua para melhorar a inteligência do Aether AI</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="points-display points-animation mb-2">
              {totalPontos.toLocaleString()} pontos
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">🏆 Ranking:</span>
              <span className="premium-text text-lg">#{ranking}</span>
            </div>
          </div>
        </div>

        {/* Badges de Conquista */}
        <div className="flex flex-wrap gap-3">
          {mockBadges.map((badge, index) => (
            <div
              key={index}
              className={`achievement-badge ${badge.conquistado ? 'opacity-100' : 'opacity-60'}`}
            >
              <span className="text-lg">{badge.icone}</span>
              <span>{badge.nome}</span>
              {badge.progresso && !badge.conquistado && (
                <div className="ml-2 w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#B8860B] transition-all duration-500"
                    style={{ width: `${badge.progresso}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="glass-card p-2">
        <div className="flex space-x-2 ensinamentos-tabs" role="tablist" aria-label="Tipos de contribuição">
          <button
            role="tab"
            aria-selected={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg'
                : 'text-[#003B6D] hover:bg-white/20'
            }`}
          >
            <Upload size={20} />
            <span>📁 Upload Arquivos</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'conhecimento'}
            onClick={() => setActiveTab('conhecimento')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'conhecimento'
                ? 'bg-gradient-to-r from-[#28A745] to-[#20C997] text-white shadow-lg'
                : 'text-[#003B6D] hover:bg-white/20'
            }`}
          >
            <Plus size={20} />
            <span>📝 Conhecimento</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'feedback'}
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'feedback'
                ? 'bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white shadow-lg'
                : 'text-[#003B6D] hover:bg-white/20'
            }`}
          >
            <MessageSquare size={20} />
            <span>💬 Feedback IA</span>
          </button>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
        {activeTab === 'upload' && (
          <div className="glass-card p-6">
            <h3 className="section-title flex items-center space-x-3 mb-6">
              <Upload className="text-[#0A74DA]" size={24} />
              <span>📁 Upload de Arquivos Premium</span>
            </h3>

            <div 
              className="upload-dropzone p-8 text-center cursor-pointer"
              role="button"
              aria-label="Área de upload de arquivos"
            >
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.docx,.xlsx,.pptx"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="mb-4">
                  <Upload size={48} className="mx-auto text-[#0A74DA] mb-4" />
                  <div className="shimmer absolute inset-0 opacity-20" />
                </div>
                <p className="card-title mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-gray-600 text-sm">
                  Suporta PDF, DOCX, XLSX, PPTX (máx. 10MB cada)
                </p>
                <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
                  <span>📄 Metodologias</span>
                  <span>📊 Planilhas</span>
                  <span>📝 Documentos</span>
                  <span>📈 Apresentações</span>
                </div>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="card-title">Arquivos Selecionados</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="contribution-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText size={20} className="text-[#0A74DA]" />
                        <div className="flex-1">
                          <p className="font-medium text-[#003B6D]">{file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                          {uploadProgress[file.name] !== undefined && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="upload-progress h-2 rounded-full"
                                style={{ width: `${uploadProgress[file.name]}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => removeFile(index)}
                          className="px-3 py-1 text-sm bg-[#EF4444]/20 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/30 transition-colors"
                        >
                          Remover
                        </button>
                        <button className="px-3 py-1 text-sm bg-[#0A74DA]/20 text-[#0A74DA] rounded-lg hover:bg-[#0A74DA]/30 transition-colors">
                          Processar
                        </button>
                        <button className="px-3 py-1 text-sm bg-[#28A745]/20 text-[#28A745] rounded-lg hover:bg-[#28A745]/30 transition-colors">
                          Validar (+50 pts)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'conhecimento' && (
          <div className="glass-card p-6">
            <h3 className="section-title flex items-center space-x-3 mb-6">
              <Plus className="text-[#28A745]" size={24} />
              <span>📝 Adicionar Conhecimento Especializado</span>
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 form-row">
                <div>
                  <label className="block text-sm font-medium text-[#003B6D] mb-2">
                    🏷️ Categoria Especializada
                  </label>
                  <select
                    value={conhecimento.categoria}
                    onChange={(e) => setConhecimento(prev => ({ ...prev, categoria: e.target.value }))}
                    className="w-full glass-input border-0 px-4 py-3 text-[#003B6D] focus:outline-none focus:ring-2 focus:ring-[#0A74DA]/50 rounded-xl"
                  >
                    <option value="estrategia">🎯 Estratégia Empresarial</option>
                    <option value="operacoes">⚙️ Operações & Processos</option>
                    <option value="financeiro">💰 Análise Financeira</option>
                    <option value="marketing">📈 Marketing & Vendas</option>
                    <option value="tecnologia">💻 Transformação Digital</option>
                    <option value="rh">👥 Recursos Humanos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#003B6D] mb-2">
                    🎯 Nível de Especialização
                  </label>
                  <select className="w-full glass-input border-0 px-4 py-3 text-[#003B6D] focus:outline-none focus:ring-2 focus:ring-[#0A74DA]/50 rounded-xl">
                    <option value="basico">📚 Básico (+30 pts)</option>
                    <option value="intermediario">📖 Intermediário (+50 pts)</option>
                    <option value="avancado">🎓 Avançado (+75 pts)</option>
                    <option value="especialista">🏆 Especialista (+100 pts)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  📝 Título do Conhecimento
                </label>
                <input
                  type="text"
                  value={conhecimento.titulo}
                  onChange={(e) => setConhecimento(prev => ({ ...prev, titulo: e.target.value }))}
                  className="w-full glass-input border-0 px-4 py-3 text-[#003B6D] focus:outline-none focus:ring-2 focus:ring-[#0A74DA]/50 rounded-xl"
                  placeholder="Ex: Metodologia de Análise SWOT para Startups Tech"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  📄 Conhecimento Detalhado
                </label>
                <textarea
                  value={conhecimento.descricao}
                  onChange={(e) => setFeedback(prev => ({ ...prev, explicacao: e.target.value }))}
                  rows={4}
                  className="w-full glass-input border-0 px-4 py-3 text-[#003B6D] focus:outline-none focus:ring-2 focus:ring-[#0A74DA]/50 rounded-xl resize-none"
                  placeholder="Explique por que a resposta está correta/incorreta ou forneça sugestões de melhoria..."
                />
              </div>

              <button className="w-full bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                🚀 Enviar Feedback (+{feedback.tipo === 'correto' ? '25' : feedback.tipo === 'incorreto' ? '50' : '35'} pts)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Histórico de Contribuições */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-title flex items-center space-x-3">
            <Trophy className="text-[#B8860B]" size={24} />
            <span>🏆 Histórico de Contribuições</span>
          </h3>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Este mês</p>
              <p className="premium-text text-lg font-bold">+347 pontos</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Taxa aprovação</p>
              <p className="text-[#28A745] text-lg font-bold">87%</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {mockContribuicoes.map((contrib) => (
            <div
              key={contrib.id}
              className={`contribution-card border-l-4 ${getStatusColor(contrib.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getTipoIcon(contrib.tipo)}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#003B6D] flex items-center space-x-2">
                      <span>{contrib.titulo}</span>
                      {getStatusIcon(contrib.status)}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center space-x-2">
                      <span>{contrib.categoria}</span>
                      <span>•</span>
                      <span>{contrib.data}</span>
                    </p>
                    {contrib.feedback && (
                      <p className="text-xs text-gray-500 mt-1 italic bg-white/20 p-2 rounded">
                        💬 {contrib.feedback}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`points-display ${contrib.pontos > 0 ? '' : 'opacity-50'}`}>
                    +{contrib.pontos} pts
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {contrib.status === 'aprovado' ? '✅ Aprovado' : 
                     contrib.status === 'em_validacao' ? '⏳ Validando' : '❌ Rejeitado'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}