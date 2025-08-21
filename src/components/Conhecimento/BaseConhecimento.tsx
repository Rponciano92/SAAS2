import React, { useState } from 'react';
import { BookOpen, Search, Filter, Tag, Eye, Download, Star, Clock, User, Plus, Brain, Upload } from 'lucide-react';
import { KnowledgeBaseService, KnowledgeItem, ContentMetadata } from '@/services/knowledgeBaseService';
import { KnowledgeBaseService, KnowledgeItem, ContentMetadata } from '@/services/knowledgeBaseService';

interface ConhecimentoItem {
  id: string;
  titulo: string;
  categoria: string;
  tipo: 'metodologia' | 'template' | 'case' | 'insight';
  autor: string;
  dataAtualizacao: string;
  visualizacoes: number;
  rating: number;
  tags: string[];
  descricao: string;
  conteudo: string;
  aprovado: boolean;
}

const mockConhecimento: ConhecimentoItem[] = [
  {
    id: '1',
    titulo: 'Metodologia de Análise SWOT para Startups Tech',
    categoria: 'Estratégia',
    tipo: 'metodologia',
    autor: 'Dr. Carlos Mendes',
    dataAtualizacao: '2025-01-15',
    visualizacoes: 247,
    rating: 4.8,
    tags: ['SWOT', 'Startups', 'Tecnologia', 'Estratégia'],
    descricao: 'Framework completo para análise SWOT adaptado especificamente para startups de tecnologia',
    conteudo: 'Metodologia detalhada com templates e exemplos práticos...',
    aprovado: true
  },
  {
    id: '2',
    titulo: 'Template de Análise Financeira Premium',
    categoria: 'Financeiro',
    tipo: 'template',
    autor: 'Dra. Ana Silva',
    dataAtualizacao: '2025-01-14',
    visualizacoes: 189,
    rating: 4.9,
    tags: ['Financeiro', 'Template', 'Excel', 'Análise'],
    descricao: 'Planilha completa para análise financeira com dashboards automáticos',
    conteudo: 'Template Excel com fórmulas avançadas e visualizações...',
    aprovado: true
  },
  {
    id: '3',
    titulo: 'Case: Transformação Digital na RetailMax',
    categoria: 'Transformação Digital',
    tipo: 'case',
    autor: 'João Silva',
    dataAtualizacao: '2025-01-13',
    visualizacoes: 156,
    rating: 4.7,
    tags: ['Transformação Digital', 'Varejo', 'Case Study'],
    descricao: 'Estudo de caso completo sobre a transformação digital implementada na RetailMax',
    conteudo: 'Análise detalhada do processo de transformação...',
    aprovado: true
  },
  {
    id: '4',
    titulo: 'Insights sobre Crescimento Acelerado em SaaS',
    categoria: 'Crescimento',
    tipo: 'insight',
    autor: 'Maria Santos',
    dataAtualizacao: '2025-01-12',
    visualizacoes: 203,
    rating: 4.6,
    tags: ['SaaS', 'Crescimento', 'Métricas', 'KPIs'],
    descricao: 'Principais insights sobre estratégias de crescimento para empresas SaaS',
    conteudo: 'Análise de métricas e estratégias de crescimento...',
    aprovado: true
  }
];

const categorias = ['Todas', 'Estratégia', 'Financeiro', 'Operações', 'Marketing', 'Tecnologia', 'Transformação Digital', 'Crescimento'];
const tipos = ['Todos', 'metodologia', 'template', 'case', 'insight'];

export default function BaseConhecimento() {
  const [conhecimentos] = useState<ConhecimentoItem[]>(mockConhecimento);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState<ConhecimentoItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    type: 'article' as const,
    tags: '',
    author: 'Usuário Atual'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const knowledgeService = new KnowledgeBaseService();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    type: 'article' as const,
    tags: '',
    author: 'Usuário Atual'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const knowledgeService = new KnowledgeBaseService();

  const conhecimentosFiltrados = conhecimentos.filter(item => {
    const matchSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategoria = filtroCategoria === 'Todas' || item.categoria === filtroCategoria;
    const matchTipo = filtroTipo === 'Todos' || item.tipo === filtroTipo;
    
    return matchSearch && matchCategoria && matchTipo && item.aprovado;
  });

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'metodologia': return '📋';
      case 'template': return '📊';
      case 'case': return '📈';
      case 'insight': return '💡';
      default: return '📄';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'metodologia': return 'Metodologia';
      case 'template': return 'Template';
      case 'case': return 'Case Study';
      case 'insight': return 'Insight';
      default: return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'metodologia': return 'text-[#0A74DA] bg-[#0A74DA]/10';
      case 'template': return 'text-[#28A745] bg-[#28A745]/10';
      case 'case': return 'text-[#FFA500] bg-[#FFA500]/10';
      case 'insight': return 'text-[#B8860B] bg-[#B8860B]/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? 'text-[#FFA500] fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-xl shadow-lg">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h1 className="page-title">📚 Base de Conhecimento Curada</h1>
            <p className="text-gray-600">Metodologias, templates e insights validados por especialistas</p>
          </div>
        </div>

        {/* Estatísticas da Base */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#0A74DA] mb-1">{conhecimentos.length}</div>
            <div className="text-sm text-gray-600">Itens Aprovados</div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#28A745] mb-1">{categorias.length - 1}</div>
            <div className="text-sm text-gray-600">Categorias</div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#FFA500] mb-1">1.2K</div>
            <div className="text-sm text-gray-600">Visualizações</div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <div className="text-2xl font-bold text-[#B8860B] mb-1">4.8</div>
            <div className="text-sm text-gray-600">Rating Médio</div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conhecimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-10 pr-4 py-3 w-64 text-[#003B6D] rounded-xl"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-600" />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="glass-input px-3 py-2 text-[#003B6D] rounded-lg text-sm"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
              
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="glass-input px-3 py-2 text-[#003B6D] rounded-lg text-sm"
              >
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo === 'Todos' ? 'Todos' : getTipoLabel(tipo)}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="glass-button px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all">
            + Adicionar Conhecimento
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#28A745] to-[#20C997] px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Brain size={16} />
            <span>IA Analisadora</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#28A745] to-[#20C997] px-4 py-2 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Brain size={16} />
            <span>IA Analisadora</span>
          </button>
        </div>
      </div>

      {/* Lista de Conhecimento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="section-title">
            📋 Conhecimentos ({conhecimentosFiltrados.length})
          </h3>

          {conhecimentosFiltrados.map((item) => (
            <div
              key={item.id}
              className="glass-card p-6 hover:transform hover:scale-102 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTipoIcon(item.tipo)}</span>
                  <div>
                    <h4 className="font-bold text-[#003B6D] text-lg">{item.titulo}</h4>
                    <p className="text-gray-600 text-sm">{item.categoria}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(item.tipo)}`}>
                  {getTipoLabel(item.tipo)}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-4">{item.descricao}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-[#0A74DA]/10 text-[#0A74DA] rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{item.autor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{new Date(item.dataAtualizacao).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span>{item.visualizacoes}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(item.rating)}
                  <span className="ml-1">{item.rating}</span>
                </div>
              </div>
            </div>
          ))}

          {conhecimentosFiltrados.length === 0 && (
            <div className="glass-card p-12 text-center">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-[#003B6D] mb-2">Nenhum conhecimento encontrado</h3>
              <p className="text-gray-600 mb-6">Tente ajustar os filtros ou contribua com novo conhecimento</p>
              <button className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                + Adicionar Conhecimento
              </button>
            </div>
          )}
        </div>
        
        {/* Modal para Adicionar Conhecimento */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#003B6D] flex items-center space-x-2">
                  <Brain className="text-[#0A74DA]" size={24} />
                  <span>🧠 Adicionar Conhecimento com IA</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#003B6D] mb-2">
                    Título do Conhecimento *
                  </label>
                  <input
                    type="text"
                    value={newContent.title}
                    onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent"
                    placeholder="Ex: Metodologia de Análise SWOT para Startups"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#003B6D] mb-2">
                      Tipo de Conteúdo *
                    </label>
                    <select
                      value={newContent.type}
                      onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent"
                    >
                      <option value="article">Artigo</option>
                      <option value="methodology">Metodologia</option>
                      <option value="case_study">Case Study</option>
                      <option value="research">Pesquisa</option>
                      <option value="document">Documento</option>
                      <option value="note">Nota</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#003B6D] mb-2">
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={newContent.tags}
                      onChange={(e) => setNewContent(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent"
                      placeholder="estratégia, análise, swot"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#003B6D] mb-2">
                    Conteúdo *
                  </label>
                  <textarea
                    value={newContent.content}
                    onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent resize-none"
                    rows={8}
                    placeholder="Digite o conteúdo do conhecimento que será analisado pela IA..."
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
                    <Brain size={16} />
                    <span>Como funciona a IA Analisadora:</span>
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Avalia qualidade e relevância do conteúdo (0-10)</li>
                    <li>• Categoriza automaticamente por área</li>
                    <li>• Gera tags inteligentes</li>
                    <li>• Aprova/rejeita baseado em critérios de qualidade</li>
                    <li>• Fornece feedback construtivo</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (!newContent.title || !newContent.content) {
                      alert('Preencha título e conteúdo');
                      return;
                    }
                    
                    try {
                      setIsAnalyzing(true);
                      
                      const metadata: ContentMetadata = {
                        author: newContent.author,
                        source: 'manual_input',
                        tags: newContent.tags.split(',').map(t => t.trim()).filter(Boolean),
                        type: newContent.type,
                        dateCreated: new Date(),
                        language: 'pt-BR'
                      };
                      
                      const result = await knowledgeService.addToKnowledgeBase(
                        newContent.title,
                        newContent.content,
                        metadata
                      );
                      
                      alert(`✅ Conteúdo analisado pela IA!\n\nQualidade: ${result.analysis.quality}/10\nRelevância: ${result.analysis.relevance}/10\nStatus: ${result.status === 'approved' ? 'Aprovado' : 'Pendente'}\n\nFeedback: ${result.analysis.feedback.substring(0, 200)}...`);
                      
                      setShowAddModal(false);
                      setNewContent({
                        title: '',
                        content: '',
                        type: 'article',
                        tags: '',
                        author: 'Usuário Atual'
                      });
                      
                    } catch (error) {
                      alert(`❌ Erro ao analisar conteúdo: ${error.message}`);
                    } finally {
                      setIsAnalyzing(false);
                    }
                  }}
                  disabled={isAnalyzing || !newContent.title || !newContent.content}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analisando com IA...</span>
                    </>
                  ) : (
                    <>
                      <Brain size={16} />
                      <span>Analisar com IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal para Adicionar Conhecimento */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#003B6D] flex items-center space-x-2">
                  <Brain className="text-[#0A74DA]" size={24} />
                  <span>🧠 Adicionar Conhecimento com IA</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#003B6D] mb-2">
                    Título do Conhecimento *
                  </label>
                  <input
                    type="text"
                    value={newContent.title}
                    onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent"
                    placeholder="Ex: Metodologia de Análise SWOT para Startups"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#003B6D] mb-2">
                      Tipo de Conteúdo *
                    </label>
                    <select
                      value={newContent.type}
                      onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent"
                    >
                      <option value="article">Artigo</option>
                      <option value="methodology">Metodologia</option>
                      <option value="case_study">Case Study</option>
                      <option value="research">Pesquisa</option>
                      <option value="document">Documento</option>
                      <option value="note">Nota</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#003B6D] mb-2">
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={newContent.tags}
                      onChange={(e) => setNewContent(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent"
                      placeholder="estratégia, análise, swot"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#003B6D] mb-2">
                    Conteúdo *
                  </label>
                  <textarea
                    value={newContent.content}
                    onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A74DA] focus:border-transparent resize-none"
                    rows={8}
                    placeholder="Digite o conteúdo do conhecimento que será analisado pela IA..."
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
                    <Brain size={16} />
                    <span>Como funciona a IA Analisadora:</span>
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Avalia qualidade e relevância do conteúdo (0-10)</li>
                    <li>• Categoriza automaticamente por área</li>
                    <li>• Gera tags inteligentes</li>
                    <li>• Aprova/rejeita baseado em critérios de qualidade</li>
                    <li>• Fornece feedback construtivo</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (!newContent.title || !newContent.content) {
                      alert('Preencha título e conteúdo');
                      return;
                    }
                    
                    try {
                      setIsAnalyzing(true);
                      
                      const metadata: ContentMetadata = {
                        author: newContent.author,
                        source: 'manual_input',
                        tags: newContent.tags.split(',').map(t => t.trim()).filter(Boolean),
                        type: newContent.type,
                        dateCreated: new Date(),
                        language: 'pt-BR'
                      };
                      
                      const result = await knowledgeService.addToKnowledgeBase(
                        newContent.title,
                        newContent.content,
                        metadata
                      );
                      
                      alert(`✅ Conteúdo analisado pela IA!\n\nQualidade: ${result.analysis.quality}/10\nRelevância: ${result.analysis.relevance}/10\nStatus: ${result.status === 'approved' ? 'Aprovado' : 'Pendente'}\n\nFeedback: ${result.analysis.feedback.substring(0, 200)}...`);
                      
                      setShowAddModal(false);
                      setNewContent({
                        title: '',
                        content: '',
                        type: 'article',
                        tags: '',
                        author: 'Usuário Atual'
                      });
                      
                    } catch (error) {
                      alert(`❌ Erro ao analisar conteúdo: ${error.message}`);
                    } finally {
                      setIsAnalyzing(false);
                    }
                  }}
                  disabled={isAnalyzing || !newContent.title || !newContent.content}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analisando com IA...</span>
                    </>
                  ) : (
                    <>
                      <Brain size={16} />
                      <span>Analisar com IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Painel de Detalhes */}
        <div className="space-y-6">
          {selectedItem ? (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[#003B6D]">📄 Detalhes</h4>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-[#003B6D] mb-2">{selectedItem.titulo}</h5>
                  <p className="text-gray-600 text-sm">{selectedItem.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Categoria:</span>
                    <p className="font-medium text-[#003B6D]">{selectedItem.categoria}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <p className="font-medium text-[#003B6D]">{getTipoLabel(selectedItem.tipo)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Autor:</span>
                    <p className="font-medium text-[#003B6D]">{selectedItem.autor}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Atualizado:</span>
                    <p className="font-medium text-[#003B6D]">{new Date(selectedItem.dataAtualizacao).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedItem.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-[#0A74DA]/10 text-[#0A74DA] rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedItem.rating)}
                    <span className="text-sm text-gray-600 ml-1">{selectedItem.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Eye size={14} />
                    <span>{selectedItem.visualizacoes}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full glass-button py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                    👁️ Ver Conteúdo Completo
                  </button>
                  <button className="w-full bg-gradient-to-r from-[#28A745] to-[#20C997] py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                    📥 Download
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 text-center">
              <BookOpen size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Selecione um item para ver os detalhes</p>
            </div>
          )}

          {/* Categorias Populares */}
          <div className="glass-card p-6">
            <h4 className="font-bold text-[#003B6D] mb-4">🏷️ Categorias Populares</h4>
            <div className="space-y-2">
              {categorias.slice(1, 6).map((categoria, index) => (
                <button
                  key={categoria}
                  onClick={() => setFiltroCategoria(categoria)}
                  className="w-full text-left px-3 py-2 hover:bg-white/20 rounded-lg transition-colors text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#003B6D]">{categoria}</span>
                    <span className="text-gray-500">{Math.floor(Math.random() * 20) + 5}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mais Visualizados */}
          <div className="glass-card p-6">
            <h4 className="font-bold text-[#003B6D] mb-4">🔥 Mais Visualizados</h4>
            <div className="space-y-3">
              {conhecimentos.slice(0, 3).map((item, index) => (
                <div
                  key={item.id}
                  className="cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTipoIcon(item.tipo)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-[#003B6D] text-sm">{item.titulo}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Eye size={10} />
                        <span>{item.visualizacoes}</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(item.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}