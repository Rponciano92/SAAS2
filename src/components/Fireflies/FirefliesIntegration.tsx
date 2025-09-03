import React, { useState } from 'react';
import { 
  Upload, 
  Calendar, 
  BarChart3, 
  Mic,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Rocket
} from 'lucide-react';

export default function AetherSaasIntegration() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-[#B8860B] to-[#DAA520] rounded-xl shadow-lg">
            <Rocket size={24} className="text-white" />
          </div>
          <div>
            <h1 className="page-title">🚀 AetherSaaS Meeting Bot</h1>
            <p className="text-gray-600">Sistema próprio com bot simples + bot avançado Selenium</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass-card p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg'
                : 'text-[#003B6D] hover:bg-white/20'
            }`}
          >
            <BarChart3 size={20} />
            <span>📊 Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('agendar')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'agendar'
                ? 'bg-gradient-to-r from-[#28A745] to-[#20C997] text-white shadow-lg'
                : 'text-[#003B6D] hover:bg-white/20'
            }`}
          >
            <Calendar size={20} />
            <span>📅 Agendar</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white shadow-lg'
                : 'text-[#003B6D] hover:bg-white/20'
            }`}
          >
            <Upload size={20} />
            <span>📁 Upload</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="glass-card p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card-subtle p-4 text-center">
                <div className="text-2xl font-bold text-[#0A74DA] mb-1">12</div>
                <div className="text-sm text-gray-600">Total Reuniões</div>
              </div>
              <div className="glass-card-subtle p-4 text-center">
                <div className="text-2xl font-bold text-[#28A745] mb-1">3</div>
                <div className="text-sm text-gray-600">Agendadas</div>
              </div>
              <div className="glass-card-subtle p-4 text-center">
                <div className="text-2xl font-bold text-[#FFA500] mb-1">24</div>
                <div className="text-sm text-gray-600">Action Items</div>
              </div>
              <div className="glass-card-subtle p-4 text-center">
                <div className="text-2xl font-bold text-[#B8860B] mb-1">8.5h</div>
                <div className="text-sm text-gray-600">Tempo Total</div>
              </div>
            </div>

            {/* Recent Meetings */}
            <div>
              <h3 className="section-title mb-4">📋 Reuniões Recentes</h3>
              <div className="space-y-3">
                <div className="glass-card-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">🎥</div>
                      <div>
                        <h4 className="font-semibold text-[#003B6D]">Reunião Estratégica TechStart</h4>
                        <p className="text-sm text-gray-600">15/01/2025 • 45:32 • 3 participantes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-[#28A745]" />
                      <span className="text-xs text-[#28A745] bg-[#28A745]/10 px-2 py-1 rounded">Concluída</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">🎵</div>
                      <div>
                        <h4 className="font-semibold text-[#003B6D]">Call Semanal RetailMax</h4>
                        <p className="text-sm text-gray-600">12/01/2025 • 28:15 • 2 participantes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-[#28A745]" />
                      <span className="text-xs text-[#28A745] bg-[#28A745]/10 px-2 py-1 rounded">Concluída</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">🎥</div>
                      <div>
                        <h4 className="font-semibold text-[#003B6D]">Workshop Inovação</h4>
                        <p className="text-sm text-gray-600">10/01/2025 • Processando... • 8 participantes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-[#FFA500]" />
                      <span className="text-xs text-[#FFA500] bg-[#FFA500]/10 px-2 py-1 rounded">Processando</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div>
              <h3 className="section-title mb-4">✅ Action Items Automáticos</h3>
              <div className="space-y-2">
                <div className="glass-card-subtle p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#003B6D]">Preparar apresentação para investidores</p>
                    <p className="text-sm text-gray-600">Atribuído: João Silva • Prazo: 25/01/2025</p>
                  </div>
                  <span className="text-xs text-[#EF4444] bg-[#EF4444]/10 px-2 py-1 rounded">Alta</span>
                </div>

                <div className="glass-card-subtle p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#003B6D]">Revisar estratégia de marketing digital</p>
                    <p className="text-sm text-gray-600">Atribuído: Maria Santos • Prazo: 30/01/2025</p>
                  </div>
                  <span className="text-xs text-[#FFA500] bg-[#FFA500]/10 px-2 py-1 rounded">Média</span>
                </div>

                <div className="glass-card-subtle p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#003B6D]">Implementar novo sistema de CRM</p>
                    <p className="text-sm text-gray-600">Atribuído: Carlos Lima • Prazo: 15/02/2025</p>
                  </div>
                  <span className="text-xs text-[#EF4444] bg-[#EF4444]/10 px-2 py-1 rounded">Alta</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agendar' && (
          <div className="space-y-6">
            <h3 className="section-title">📅 Agendar Nova Reunião</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Título da Reunião *
                </label>
                <input
                  type="text"
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  placeholder="Ex: Reunião Estratégica Q1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Data e Hora *
                </label>
                <input
                  type="datetime-local"
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Duração (minutos) *
                </label>
                <select className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl">
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 hora e 30 minutos</option>
                  <option value="120">2 horas</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#003B6D] mb-2">
                  Participantes *
                </label>
                <input
                  type="text"
                  className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
                  placeholder="Emails separados por vírgula"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#003B6D] mb-2">
                Configurações de Gravação
              </label>
              <div className="glass-card-subtle p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Gravação automática</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Transcrição em tempo real</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Identificação automática de action items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Análise de sentimento</span>
                </div>
              </div>
            </div>
            
            <button className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              📅 Agendar Reunião com AetherSaaS
            </button>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <h3 className="section-title">📁 Upload de Arquivos</h3>
            
            <div className="upload-dropzone p-8 text-center cursor-pointer">
              <Upload size={48} className="mx-auto text-[#0A74DA] mb-4" />
              <p className="card-title mb-2">
                Arraste arquivos de áudio/vídeo aqui ou clique para selecionar
              </p>
              <p className="text-gray-600 text-sm">
                Suporta MP3, MP4, WAV, M4A, MOV (máx. 500MB cada)
              </p>
            </div>
            
            <div className="glass-card-subtle p-4">
              <h4 className="font-semibold text-[#003B6D] mb-3">🔧 Configurações de Processamento</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Identificação automática de palestrantes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Extração de palavras-chave</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Resumo executivo automático</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Análise de tópicos principais</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Info */}
      <div className="glass-card p-6 border-[#0A74DA]/30 bg-[#0A74DA]/5">
        <h4 className="font-bold text-[#003B6D] mb-4">💡 Recursos do AetherSaaS</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p>• <strong>🤖 Bot Simples:</strong> Abre navegador, sempre funciona, entrada manual</p>
            <p>• <strong>⚡ Bot Avançado:</strong> Selenium com automação completa para Google Meet</p>
            <p>• <strong>📝 Transcrição IA:</strong> Processamento de áudio com identificação de falantes</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>✅ Action Items:</strong> Identificação automática de tarefas</p>
            <p>• <strong>📊 Resumo Executivo:</strong> Síntese inteligente dos pontos principais</p>
            <p>• <strong>🔒 Sistema Próprio:</strong> Seus dados, seu servidor, sua privacidade</p>
          </div>
        </div>
      </div>
    </div>
  );
}