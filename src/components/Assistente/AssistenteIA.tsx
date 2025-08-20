import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Zap, Brain, FileText, BarChart3, Calendar, Building2 } from 'lucide-react';

interface Mensagem {
  id: string;
  tipo: 'user' | 'assistant';
  conteudo: string;
  timestamp: string;
  contexto?: string;
  acoesSugeridas?: string[];
}

const mockMensagens: Mensagem[] = [
  {
    id: '1',
    tipo: 'assistant',
    conteudo: 'Olá! Sou o Aether AI, seu assistente de consultoria personalizado. Como posso ajudá-lo hoje? Posso analisar empresas, sugerir estratégias, gerar relatórios ou responder dúvidas específicas sobre seus clientes.',
    timestamp: '2025-01-15 09:00',
    acoesSugeridas: ['Analisar empresa', 'Gerar relatório', 'Agendar reunião', 'Buscar conhecimento']
  }
];

const sugestoesPredefinidas = [
  '📊 Como está o desempenho da TechStart?',
  '🎯 Sugestões para aumentar ROI do cliente',
  '📈 Análise de mercado para o setor tech',
  '💡 Metodologias para startup em crescimento',
  '📅 Preparar reunião com stakeholders',
  '🔍 Benchmarks do setor de varejo'
];

export default function AssistenteIA() {
  const [mensagens, setMensagens] = useState<Mensagem[]>(mockMensagens);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
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

    // Simulate AI response
    setTimeout(() => {
      const respostaIA = gerarRespostaIA(textoMensagem);
      const novaMsgAssistant: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistant',
        conteudo: respostaIA.conteudo,
        timestamp: new Date().toISOString(),
        acoesSugeridas: respostaIA.acoesSugeridas
      };

      setMensagens(prev => [...prev, novaMsgAssistant]);
      setIsTyping(false);
    }, 2000);
  };

  const gerarRespostaIA = (pergunta: string) => {
    const perguntaLower = pergunta.toLowerCase();
    
    if (perguntaLower.includes('techstart') || perguntaLower.includes('desempenho')) {
      return {
        conteudo: `📊 **Análise da TechStart Inovação:**

**Métricas Principais:**
• Crescimento de receita: +30% ao mês
• Burn rate: R$ 45K/mês (sustentável)
• Runway: 18 meses
• Margem bruta: 75% (acima da média)

**Insights Estratégicos:**
• Forte tração no mercado B2B
• Necessidade de focar na retenção de clientes
• Oportunidade de diversificar fontes de receita

**Recomendações:**
1. Implementar programa de customer success
2. Desenvolver parcerias estratégicas
3. Investir em automação de processos

Gostaria que eu detalhe algum aspecto específico?`,
        acoesSugeridas: ['Gerar relatório completo', 'Agendar reunião', 'Analisar concorrência', 'Projeções financeiras']
      };
    }

    if (perguntaLower.includes('roi') || perguntaLower.includes('aumentar')) {
      return {
        conteudo: `🎯 **Estratégias para Aumentar ROI:**

**Ações Imediatas (0-30 dias):**
• Otimizar processos operacionais existentes
• Implementar automações simples
• Revisar estrutura de custos

**Médio Prazo (1-3 meses):**
• Desenvolver novos canais de receita
• Melhorar eficiência da equipe de vendas
• Implementar métricas de performance

**Longo Prazo (3-12 meses):**
• Investir em tecnologia e inovação
• Expandir para novos mercados
• Desenvolver parcerias estratégicas

**ROI Esperado:** +25-40% em 6 meses

Qual estratégia gostaria de explorar primeiro?`,
        acoesSugeridas: ['Plano de implementação', 'Análise de custos', 'Projeção de resultados', 'Cronograma detalhado']
      };
    }

    if (perguntaLower.includes('reunião') || perguntaLower.includes('preparar')) {
      return {
        conteudo: `📅 **Preparação de Reunião Inteligente:**

**Agenda Sugerida:**
1. Revisão de resultados (15 min)
2. Discussão de desafios atuais (20 min)
3. Apresentação de soluções (25 min)
4. Definição de próximos passos (10 min)

**Pontos-Chave para Abordar:**
• Performance atual vs. metas
• Oportunidades identificadas
• Recursos necessários
• Timeline de implementação

**Perguntas Estratégicas:**
• "Qual é a prioridade número 1 para os próximos 90 dias?"
• "Que obstáculos vocês veem para alcançar as metas?"
• "Como podemos medir o sucesso desta iniciativa?"

**Materiais de Apoio:** Relatório executivo, dashboard de KPIs, benchmarks do setor

Precisa de ajuda com algum aspecto específico da reunião?`,
        acoesSugeridas: ['Criar apresentação', 'Gerar relatório', 'Definir KPIs', 'Cronograma de ações']
      };
    }

    // Resposta genérica
    return {
      conteudo: `Entendi sua pergunta sobre "${pergunta}". Como seu assistente de consultoria especializado, posso ajudá-lo com:

🎯 **Análises Estratégicas:** Avaliação de mercado, concorrência e oportunidades
📊 **Insights Financeiros:** ROI, projeções e otimização de custos  
🏢 **Gestão de Clientes:** Acompanhamento de projetos e relacionamento
📈 **Relatórios Executivos:** Documentos profissionais e apresentações
🤝 **Preparação de Reuniões:** Agendas, pontos-chave e materiais de apoio

Poderia ser mais específico sobre o que precisa? Isso me ajudará a fornecer insights mais direcionados.`,
      acoesSugeridas: ['Ver empresas ativas', 'Gerar análise', 'Buscar metodologias', 'Agendar reunião']
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col space-y-6">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-xl shadow-lg">
              <MessageSquare size={24} className="text-white" />
            </div>
            <div>
              <h1 className="page-title">🤖 Assistente IA Conversacional</h1>
              <p className="text-gray-600">Chat inteligente personalizado para consultoria</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={empresaSelecionada}
              onChange={(e) => setEmpresaSelecionada(e.target.value)}
              className="glass-input px-4 py-2 text-[#003B6D] rounded-xl text-sm"
            >
              <option value="">Contexto Geral</option>
              <option value="techstart">🚀 TechStart Inovação</option>
              <option value="retailmax">🛍️ RetailMax Varejo</option>
              <option value="innovacorp">🔧 InnovaCorp Solutions</option>
              <option value="fintech">💰 FinTech Solutions</option>
            </select>

            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-[#28A745] rounded-full animate-pulse"></div>
              <span className="text-[#28A745] font-medium">IA Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex space-x-6">
        {/* Messages Area */}
        <div className="flex-1 glass-card flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {mensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                className={`flex ${mensagem.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${mensagem.tipo === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`
                    p-2 rounded-full
                    ${mensagem.tipo === 'user' 
                      ? 'bg-[#0A74DA] text-white' 
                      : 'bg-gradient-to-br from-[#B8860B] to-[#DAA520] text-white'
                    }
                  `}>
                    {mensagem.tipo === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`
                    p-4 rounded-2xl
                    ${mensagem.tipo === 'user' 
                      ? 'bg-[#0A74DA] text-white' 
                      : 'glass-card-subtle'
                    }
                  `}>
                    <div className="whitespace-pre-wrap text-sm">
                      {mensagem.conteudo}
                    </div>
                    
                    {mensagem.acoesSugeridas && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {mensagem.acoesSugeridas.map((acao, index) => (
                          <button
                            key={index}
                            onClick={() => handleEnviarMensagem(acao)}
                            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
                          >
                            {acao}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-2">
                      {new Date(mensagem.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-br from-[#B8860B] to-[#DAA520] text-white rounded-full">
                    <Bot size={16} />
                  </div>
                  <div className="glass-card-subtle p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#0A74DA] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#0A74DA] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#0A74DA] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/20">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta ou solicite uma análise..."
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
                  rows={2}
                />
              </div>
              <button
                onClick={() => handleEnviarMensagem()}
                disabled={!novaMensagem.trim() || isTyping}
                className={`
                  p-3 rounded-xl transition-all
                  ${(!novaMensagem.trim() || isTyping)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'glass-button text-white hover:shadow-lg'
                  }
                `}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h4 className="font-bold text-[#003B6D] mb-4">⚡ Ações Rápidas</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleEnviarMensagem('Gerar análise da empresa selecionada')}
                className="w-full text-left p-3 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-3"
              >
                <BarChart3 size={16} className="text-[#0A74DA]" />
                <span className="text-sm">Gerar Análise</span>
              </button>
              <button
                onClick={() => handleEnviarMensagem('Preparar próxima reunião')}
                className="w-full text-left p-3 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-3"
              >
                <Calendar size={16} className="text-[#28A745]" />
                <span className="text-sm">Preparar Reunião</span>
              </button>
              <button
                onClick={() => handleEnviarMensagem('Buscar metodologias relevantes')}
                className="w-full text-left p-3 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-3"
              >
                <Brain size={16} className="text-[#B8860B]" />
                <span className="text-sm">Buscar Conhecimento</span>
              </button>
              <button
                onClick={() => handleEnviarMensagem('Criar relatório executivo')}
                className="w-full text-left p-3 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-3"
              >
                <FileText size={16} className="text-[#FFA500]" />
                <span className="text-sm">Criar Relatório</span>
              </button>
            </div>
          </div>

          {/* Sugestões */}
          <div className="glass-card p-6">
            <h4 className="font-bold text-[#003B6D] mb-4">💡 Sugestões</h4>
            <div className="space-y-2">
              {sugestoesPredefinidas.map((sugestao, index) => (
                <button
                  key={index}
                  onClick={() => handleEnviarMensagem(sugestao)}
                  className="w-full text-left p-2 hover:bg-white/20 rounded-lg transition-colors text-sm text-gray-700"
                >
                  {sugestao}
                </button>
              ))}
            </div>
          </div>

          {/* Status da IA */}
          <div className="glass-card p-6">
            <h4 className="font-bold text-[#003B6D] mb-4">🤖 Status da IA</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Modo:</span>
                <span className="font-medium text-[#003B6D]">Offline Seguro</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Base Conhecimento:</span>
                <span className="font-medium text-[#28A745]">Atualizada</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Especialização:</span>
                <span className="font-medium text-[#0A74DA]">Consultoria</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Validação:</span>
                <span className="font-medium text-[#B8860B]">Humana</span>
              </div>
            </div>
          </div>

          {/* Empresas Ativas */}
          <div className="glass-card p-6">
            <h4 className="font-bold text-[#003B6D] mb-4">🏢 Empresas Ativas</h4>
            <div className="space-y-2">
              {['TechStart Inovação', 'RetailMax Varejo', 'FinTech Solutions'].map((empresa, index) => (
                <button
                  key={index}
                  onClick={() => handleEnviarMensagem(`Analisar ${empresa}`)}
                  className="w-full text-left p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Building2 size={14} className="text-[#0A74DA]" />
                  <span className="text-sm">{empresa}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}