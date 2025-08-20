import React, { useState, useRef, useEffect } from 'react';
import { EmpresaDetalhes } from '@/types/company';
import { Send, Bot, User, Upload, FileText, Zap } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatTabProps {
  company: EmpresaDetalhes;
}

export default function ChatTab({ company }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: `Olá! Sou o assistente IA especializado da ${company.nome}. Como posso ajudar você hoje? Posso fornecer insights sobre a empresa, gerar relatórios, analisar dados ou responder perguntas específicas.`,
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage, company);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Mock AI response generator
  const generateAIResponse = (message: string, company: EmpresaDetalhes): string => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('roi') || messageLower.includes('retorno')) {
      return `O ROI atual da ${company.nome} está em ${company.roi || 'análise'}. Baseado nos dados históricos, estamos vendo uma tendência positiva nos últimos 3 meses, principalmente devido às iniciativas de ${company.configuracaoIA.foco[0]}.`;
    }
    
    if (messageLower.includes('desafio') || messageLower.includes('problema')) {
      return `Os principais desafios da ${company.nome} atualmente são: ${company.desafios || 'Em análise. Preciso de mais dados para uma avaliação completa.'}`;
    }
    
    if (messageLower.includes('objetivo') || messageLower.includes('meta')) {
      return `Os objetivos estratégicos da ${company.nome} incluem: ${company.objetivos || 'Em definição. Recomendo agendarmos uma reunião para estabelecer metas claras e mensuráveis.'}`;
    }
    
    if (messageLower.includes('reunião') || messageLower.includes('agendar')) {
      return `Posso ajudar a preparar sua próxima reunião com a ${company.nome}${company.proximaReuniao ? `, que está agendada para ${new Date(company.proximaReuniao).toLocaleString()}` : ''}. Gostaria que eu gerasse uma pauta baseada nos últimos relatórios e KPIs?`;
    }
    
    if (messageLower.includes('relatório') || messageLower.includes('report')) {
      return `Posso gerar um relatório executivo para a ${company.nome}. Que tipo de dados você gostaria de incluir? Temos dados de desempenho financeiro, operacional e de mercado disponíveis para análise.`;
    }
    
    // Default response
    return `Entendi sua pergunta sobre "${message}". Como assistente especializado da ${company.nome}, posso ajudar com análises personalizadas, geração de relatórios, preparação de reuniões e muito mais. Poderia detalhar um pouco mais o que precisa para que eu possa fornecer informações mais específicas?`;
  };
  
  // Quick suggestions based on company
  const quickSuggestions = [
    `Como está o desempenho da ${company.nome} este mês?`,
    `Quais são os principais KPIs da ${company.nome}?`,
    `Gerar relatório executivo para ${company.nome}`,
    `Preparar próxima reunião com ${company.nome}`,
    `Quais são os principais desafios da ${company.nome}?`
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-350px)] min-h-[500px]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`
                p-2 rounded-full
                ${message.sender === 'user' 
                  ? 'bg-[#0A74DA] text-white' 
                  : 'bg-gradient-to-br from-[#B8860B] to-[#DAA520] text-white'
                }
              `}>
                {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`
                p-4 rounded-2xl
                ${message.sender === 'user' 
                  ? 'bg-[#0A74DA] text-white' 
                  : 'glass-card-subtle'
                }
              `}>
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      
      {/* Quick Suggestions */}
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setNewMessage(suggestion);
              }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      
      {/* File Attachments */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-t border-white/10">
          <div className="text-xs text-gray-500 mb-2">Arquivos anexados:</div>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-white/10 rounded-lg px-2 py-1 text-xs">
                <FileText size={12} className="mr-1" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button 
                  onClick={() => removeFile(index)}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Pergunte algo sobre ${company.nome}...`}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
              rows={2}
            />
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <label 
              htmlFor="file-upload" 
              className="absolute left-2 bottom-2 p-2 text-gray-500 hover:text-[#0A74DA] cursor-pointer"
            >
              <Upload size={20} />
            </label>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className={`
              p-3 rounded-xl transition-all
              ${(!newMessage.trim() || isTyping)
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
  );
}