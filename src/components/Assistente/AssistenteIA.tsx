import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Zap, Brain, FileText, BarChart3, Calendar, Building2, Search, Globe, Lightbulb, TrendingUp, Menu, X } from 'lucide-react';
import { hybridAIService, HybridAIResponse, AISource } from '@/services/hybridAIService';
import { getCompanyById } from '@/data/mockCompanies';

interface Mensagem {
  id: string;
  tipo: 'user' | 'assistant';
  conteudo: string;
  timestamp: string;
  contexto?: string;
  acoesSugeridas?: string[];
  fonte?: AISource;
  citations?: string[];
  relatedQuestions?: string[];
}

const mockMensagens: Mensagem[] = [
  {
    id: '1',
    tipo: 'assistant',
    conteudo: 'Olá! Sou o Aether AI, seu assistente híbrido de consultoria. Combino conhecimento especializado em consultoria com pesquisa web em tempo real.\n\n🧠 **IA Especialista:** Metodologias, estratégias e análises baseadas em experiência\n🔍 **IA de Pesquisa:** Dados atualizados, tendências e informações do mercado\n\nComo posso ajudá-lo hoje? Posso analisar empresas, sugerir estratégias, buscar dados atuais ou responder dúvidas específicas sobre seus clientes.',
    timestamp: '2025-01-15 09:00',
    acoesSugeridas: ['Analisar empresa', 'Gerar relatório', 'Agendar reunião', 'Buscar conhecimento'],
    fonte: 'especialista'
  }
];

const sugestoesPredefinidas = [
  '📊 Como está o desempenho da TechStart?',
  '🎯 Sugestões para aumentar ROI do cliente',
  '📈 Tendências atuais do mercado tech 2025',
  '💡 Metodologias para startup em crescimento',
  '📅 Preparar reunião com stakeholders',
  '🔍 Benchmarks atuais do setor de varejo',
  '🌐 Regulamentações LGPD para empresas',
  '📊 Dados econômicos Brasil 2025'
];

export default function AssistenteIA() {
  const [mensagens, setMensagens] = useState<Mensagem[]>(mockMensagens);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const handleEnviarMensagem = async (mensagem?: string) => {
    const textoMensagem = mensagem || novaMensagem.trim();
    if (!textoMensagem) return;

    const novaMsgUser: Mensagem = {
      id: Date.now().toString(),
      tipo: 'user',
      conteudo: textoMensagem,
      timestamp: new Date().toISOString(),
      contexto: empresaSelecionada
    };

    setMensagens(prev => [...prev, novaMsgUser]);
    setNovaMensagem('');
    setIsTyping(true);
    setIsSearching(false);

    try {
      // Obter dados da empresa se selecionada
      const company = empresaSelecionada ? getCompanyById(empresaSelecionada) : undefined;
      
      // Verificar se vai precisar de pesquisa
      const needsSearch = shouldUseWebSearch(textoMensagem);
      if (needsSearch) {
        setIsSearching(true);
      }
      
      // Gerar resposta híbrida
      const respostaIA = await hybridAIService.generateResponse(textoMensagem, company, empresaSelecionada);
      
      const novaMsgAssistant: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistant',
        conteudo: respostaIA.content,
        timestamp: new Date().toISOString(),
        acoesSugeridas: respostaIA.acoesSugeridas,
        fonte: respostaIA.source,
        citations: respostaIA.citations,
        relatedQuestions: respostaIA.relatedQuestions
      };

      setMensagens(prev => [...prev, novaMsgAssistant]);
    } catch (error) {
      console.error('❌ Erro ao gerar resposta:', error);
      
      const errorMsg: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistant',
        conteudo: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente ou seja mais específico.',
        timestamp: new Date().toISOString(),
        fonte: 'especialista'
      };
      
      setMensagens(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setIsSearching(false);
    }
  };

  // Função auxiliar para determinar se precisa de pesquisa (para UI)
  const shouldUseWebSearch = (pergunta: string): boolean => {
    const perguntaLower = pergunta.toLowerCase();
    return (
      perguntaLower.includes('atual') ||
      perguntaLower.includes('mercado') ||
      perguntaLower.includes('tendência') ||
      perguntaLower.includes('2025') ||
      perguntaLower.includes('benchmark')
    );
  };

  const getSourceIcon = (fonte?: AISource) => {
    switch (fonte) {
      case 'especialista': return <Brain size={12} className="text-[#0A74DA]" />;
      case 'pesquisa': return <Search size={12} className="text-[#28A745]" />;
      case 'hibrido': return <Globe size={12} className="text-[#B8860B]" />;
      default: return <Bot size={12} />;
    }
  };
  
  const getSourceLabel = (fonte?: AISource) => {
    switch (fonte) {
      case 'especialista': return '🧠 IA Especialista';
      case 'pesquisa': return '🔍 Pesquisa Web';
      case 'hibrido': return '🤖🔍 Híbrido';
      default: return 'IA';
    }
  };
  
  const getSourceColor = (fonte?: AISource) => {
    switch (fonte) {
      case 'especialista': return 'bg-blue-100 text-blue-700';
      case 'pesquisa': return 'bg-green-100 text-green-700';
      case 'hibrido': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="glass-card-strong p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-1.5 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-lg shadow-lg">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#003B6D]">🤖 Assistente IA Conversacional</h1>
              <p className="text-xs text-gray-600">Chat inteligente personalizado para consultoria</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={empresaSelecionada}
              onChange={(e) => setEmpresaSelecionada(e.target.value)}
              className="glass-input px-2 py-1 text-[#003B6D] rounded-lg text-xs hidden md:block"
            >
              <option value="">Contexto Geral</option>
              <option value="techstart">🚀 TechStart Inovação</option>
              <option value="retailmax">🛍️ RetailMax Varejo</option>
              <option value="innovacorp">🔧 InnovaCorp Solutions</option>
              <option value="fintech">💰 FinTech Solutions</option>
            </select>

            <div className="flex items-center space-x-2 text-xs hidden md:flex">
              <div className="w-2 h-2 bg-[#28A745] rounded-full animate-pulse"></div>
              <span className="text-[#28A745] font-medium">IA Online</span>
            </div>
            
            {/* Mobile controls */}
            <div className="flex items-center space-x-2 md:hidden">
              <select
                value={empresaSelecionada}
                onChange={(e) => setEmpresaSelecionada(e.target.value)}
                className="glass-input px-2 py-1 text-[#003B6D] rounded-lg text-xs w-32"
              >
                <option value="">Geral</option>
                <option value="techstart">TechStart</option>
                <option value="retailmax">RetailMax</option>
                <option value="innovacorp">InnovaCorp</option>
                <option value="fintech">FinTech</option>
              </select>
              
              <div className="flex items-center space-x-1 text-xs">
                <div className="w-2 h-2 bg-[#28A745] rounded-full animate-pulse"></div>
                <span className="text-[#28A745] font-medium text-xs">Online</span>
              </div>
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden relative">
        {/* Messages Area */}
        <div className="flex-1 glass-card flex flex-col min-h-0 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-0">
            {mensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                className={`flex ${mensagem.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${mensagem.tipo === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`
                    p-1.5 rounded-full
                    ${mensagem.tipo === 'user' 
                      ? 'bg-[#0A74DA] text-white' 
                      : 'bg-gradient-to-br from-[#B8860B] to-[#DAA520] text-white'
                    }
                  `}>
                    {mensagem.tipo === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  
                  <div className={`
                    p-2 rounded-xl
                    ${mensagem.tipo === 'user' 
                      ? 'bg-[#0A74DA] text-white' 
                      : 'glass-card-subtle'
                    }
                  `}>
                    <div className="whitespace-pre-wrap text-xs">
                      {mensagem.conteudo}
                    </div>
                    
                    {/* Source indicator */}
                    {mensagem.tipo === 'assistant' && mensagem.fonte && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs flex items-center space-x-1 ${getSourceColor(mensagem.fonte)}`}>
                          {getSourceIcon(mensagem.fonte)}
                          <span>{getSourceLabel(mensagem.fonte)}</span>
                        </span>
                      </div>
                    )}
                    
                    {/* Citations */}
                    {mensagem.citations && mensagem.citations.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        <p className="font-medium">📚 Fontes:</p>
                        <ul className="list-disc list-inside">
                          {mensagem.citations.slice(0, 2).map((citation, index) => (
                            <li key={index}>{citation}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {mensagem.acoesSugeridas && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {mensagem.acoesSugeridas.map((acao, index) => (
                          <button
                            key={index}
                            onClick={() => handleEnviarMensagem(acao)}
                            className="px-1.5 py-0.5 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
                          >
                            {acao}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-0.5">
                      {new Date(mensagem.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-[#B8860B] to-[#DAA520] text-white rounded-full">
                    <Bot size={14} />
                  </div>
                  <div className="glass-card-subtle p-2 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#0A74DA] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#0A74DA] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#0A74DA] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      {isSearching && (
                        <div className="flex items-center space-x-1 text-xs text-blue-600">
                          <Search size={10} className="animate-pulse" />
                          <span>Pesquisando...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 border-t border-white/20 flex-shrink-0">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta ou solicite uma análise..."
                  className="w-full glass-input px-2 py-1.5 text-[#003B6D] rounded-lg resize-none text-xs"
                  rows={1}
                />
              </div>
              <button
                onClick={() => handleEnviarMensagem()}
                disabled={!novaMensagem.trim() || isTyping}
                className={`
                  p-1.5 rounded-lg transition-all
                  ${(!novaMensagem.trim() || isTyping)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'glass-button text-white hover:shadow-lg'
                  }
                `}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`
          w-64 space-y-2 flex-shrink-0 overflow-hidden
          md:block
          ${sidebarOpen ? 'block' : 'hidden'}
          md:relative absolute top-0 right-0 h-full z-20 md:z-auto
          bg-white/95 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none
          shadow-xl md:shadow-none
          border-l border-gray-200/50 md:border-none
          rounded-l-lg md:rounded-none
        `}>
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end p-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="glass-card p-3">
            <h4 className="font-bold text-[#003B6D] mb-2 text-xs">⚡ Ações Rápidas</h4>
            <div className="space-y-0.5">
              <button
                onClick={() => handleEnviarMensagem('Consulta especializada sobre estratégia')}
                className="w-full text-left p-1.5 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
                onClick={() => {
                  handleEnviarMensagem('Consulta especializada sobre estratégia');
                  setSidebarOpen(false);
                }}
              >
                <Brain size={12} className="text-[#0A74DA]" />
                <span className="text-xs">Consulta Especialista</span>
              </button>
              <button
                onClick={() => {
                  handleEnviarMensagem('Pesquisar tendências atuais do mercado');
                  setSidebarOpen(false);
                }}
                className="w-full text-left p-1.5 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Search size={12} className="text-[#28A745]" />
                <span className="text-xs">Pesquisa + Análise</span>
              </button>
              <button
                onClick={() => {
                  handleEnviarMensagem('Dados econômicos atualizados Brasil 2025');
                  setSidebarOpen(false);
                }}
                className="w-full text-left p-1.5 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
              >
                <BarChart3 size={12} className="text-[#FFA500]" />
                <span className="text-xs">Dados Atualizados</span>
              </button>
              <button
                onClick={() => {
                  handleEnviarMensagem('Benchmarking web do setor tecnologia');
                  setSidebarOpen(false);
                }}
                className="w-full text-left p-1.5 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
              >
                <TrendingUp size={12} className="text-[#B8860B]" />
                <span className="text-xs">Benchmarking Web</span>
              </button>
              <button
                onClick={() => {
                  handleEnviarMensagem('Tendências recentes do setor');
                  setSidebarOpen(false);
                }}
                className="w-full text-left p-1.5 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Lightbulb size={12} className="text-[#8B5CF6]" />
                <span className="text-xs">Tendências Recentes</span>
              </button>
              <button
                onClick={() => {
                  handleEnviarMensagem('Pesquisa global sobre inovação');
                  setSidebarOpen(false);
                }}
                className="w-full text-left p-1.5 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Globe size={12} className="text-[#EF4444]" />
                <span className="text-xs">Pesquisa Global</span>
              </button>
            </div>
          </div>

          {/* Sugestões */}
          <div className="glass-card p-3">
            <h4 className="font-bold text-[#003B6D] mb-2 text-xs">💡 Sugestões</h4>
            <div className="space-y-0.5">
              {sugestoesPredefinidas.map((sugestao, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleEnviarMensagem(sugestao);
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left p-1 hover:bg-white/20 rounded-lg transition-colors text-xs text-gray-700"
                >
                  {sugestao}
                </button>
              ))}
            </div>
          </div>

          {/* Status da IA */}
          <div className="glass-card p-3">
            <h4 className="font-bold text-[#003B6D] mb-2 text-xs">🤖🔍 Sistema Híbrido IA</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">IA Especialista:</span>
                <span className="font-medium text-[#28A745]">✅ Ativa</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">IA de Pesquisa:</span>
                <span className="font-medium text-[#28A745]">🌐 Conectada</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Modo:</span>
                <span className="font-medium text-[#0A74DA]">Automático</span>
              </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Sidebar Toggle - Logo abaixo do header */}
          <div className="md:hidden px-6 py-2 border-b border-white/20">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-between p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <span className="text-sm font-medium">Ações e Sugestões</span>
              <div className={`transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>

          {/* Empresas Ativas */}
          <div className="glass-card p-3">
            <h4 className="font-bold text-[#003B6D] mb-2 text-xs">🏢 Empresas Ativas</h4>
            <div className="space-y-0.5">
              {['TechStart Inovação', 'RetailMax Varejo', 'FinTech Solutions'].map((empresa, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleEnviarMensagem(`Analisar ${empresa}`);
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left p-1 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Building2 size={10} className="text-[#0A74DA]" />
                  <span className="text-xs">{empresa}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}