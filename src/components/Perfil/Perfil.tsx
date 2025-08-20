import React, { useState } from 'react';
import { User, Edit, Camera, Award, TrendingUp, Calendar, Star, Trophy, Target, Zap } from 'lucide-react';

interface PerfilData {
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  experiencia: number;
  empresa: string;
  bio: string;
  avatar: string;
}

interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  conquistado: boolean;
  data?: string;
  progresso?: number;
}

interface Estatistica {
  label: string;
  valor: string;
  icone: React.ReactNode;
  cor: string;
  tendencia?: string;
}

const mockPerfil: PerfilData = {
  nome: 'João Silva',
  email: 'joao.silva@email.com',
  telefone: '(11) 99999-9999',
  especialidade: 'Estratégia Empresarial',
  experiencia: 15,
  empresa: 'Silva Consultoria',
  bio: 'Consultor especializado em estratégia empresarial com mais de 15 anos de experiência. Focado em transformação digital e crescimento acelerado para startups e PMEs.',
  avatar: '👨‍💼'
};

const mockConquistas: Conquista[] = [
  {
    id: '1',
    nome: 'Primeiro Upload',
    descricao: 'Primeiro arquivo enviado com sucesso',
    icone: '🥇',
    conquistado: true,
    data: '2025-01-10'
  },
  {
    id: '2',
    nome: 'Contribuidor Ativo',
    descricao: '10 contribuições aprovadas',
    icone: '⭐',
    conquistado: true,
    data: '2025-01-12',
    progresso: 100
  },
  {
    id: '3',
    nome: 'Especialista Premium',
    descricao: '1000 pontos alcançados',
    icone: '🏆',
    conquistado: false,
    progresso: 75
  },
  {
    id: '4',
    nome: 'Mentor da IA',
    descricao: '50 feedbacks aprovados',
    icone: '🧠',
    conquistado: false,
    progresso: 45
  },
  {
    id: '5',
    nome: 'Consultor do Ano',
    descricao: 'ROI médio acima de 150%',
    icone: '👑',
    conquistado: true,
    data: '2025-01-14'
  }
];

const estatisticas: Estatistica[] = [
  {
    label: 'Pontos Totais',
    valor: '1.247',
    icone: <Trophy size={20} className="text-[#B8860B]" />,
    cor: 'text-[#B8860B]',
    tendencia: '+47 este mês'
  },
  {
    label: 'Ranking Mensal',
    valor: '#3',
    icone: <Award size={20} className="text-[#FFA500]" />,
    cor: 'text-[#FFA500]',
    tendencia: '↑ 2 posições'
  },
  {
    label: 'ROI Médio',
    valor: '167%',
    icone: <TrendingUp size={20} className="text-[#28A745]" />,
    cor: 'text-[#28A745]',
    tendencia: '+12% vs. último mês'
  },
  {
    label: 'Empresas Ativas',
    valor: '8',
    icone: <Target size={20} className="text-[#0A74DA]" />,
    cor: 'text-[#0A74DA]',
    tendencia: '+2 novos clientes'
  }
];

export default function Perfil() {
  const [perfil, setPerfil] = useState<PerfilData>(mockPerfil);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'conquistas' | 'atividade'>('info');

  const handleSalvar = () => {
    setIsEditing(false);
    alert('Perfil atualizado com sucesso!');
  };

  const renderTabInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Nome Completo
          </label>
          {isEditing ? (
            <input
              type="text"
              value={perfil.nome}
              onChange={(e) => setPerfil(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            />
          ) : (
            <p className="glass-card-subtle p-3 rounded-xl">{perfil.nome}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            E-mail
          </label>
          {isEditing ? (
            <input
              type="email"
              value={perfil.email}
              onChange={(e) => setPerfil(prev => ({ ...prev, email: e.target.value }))}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            />
          ) : (
            <p className="glass-card-subtle p-3 rounded-xl">{perfil.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Telefone
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={perfil.telefone}
              onChange={(e) => setPerfil(prev => ({ ...prev, telefone: e.target.value }))}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            />
          ) : (
            <p className="glass-card-subtle p-3 rounded-xl">{perfil.telefone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Especialidade
          </label>
          {isEditing ? (
            <select
              value={perfil.especialidade}
              onChange={(e) => setPerfil(prev => ({ ...prev, especialidade: e.target.value }))}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            >
              <option value="Estratégia Empresarial">Estratégia Empresarial</option>
              <option value="Análise Financeira">Análise Financeira</option>
              <option value="Operações">Operações</option>
              <option value="Marketing">Marketing</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="RH">Recursos Humanos</option>
            </select>
          ) : (
            <p className="glass-card-subtle p-3 rounded-xl">{perfil.especialidade}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Anos de Experiência
          </label>
          {isEditing ? (
            <input
              type="number"
              value={perfil.experiencia}
              onChange={(e) => setPerfil(prev => ({ ...prev, experiencia: parseInt(e.target.value) }))}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            />
          ) : (
            <p className="glass-card-subtle p-3 rounded-xl">{perfil.experiencia} anos</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#003B6D] mb-2">
            Empresa
          </label>
          {isEditing ? (
            <input
              type="text"
              value={perfil.empresa}
              onChange={(e) => setPerfil(prev => ({ ...prev, empresa: e.target.value }))}
              className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl"
            />
          ) : (
            <p className="glass-card-subtle p-3 rounded-xl">{perfil.empresa}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#003B6D] mb-2">
          Biografia Profissional
        </label>
        {isEditing ? (
          <textarea
            value={perfil.bio}
            onChange={(e) => setPerfil(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full glass-input px-4 py-3 text-[#003B6D] rounded-xl resize-none"
          />
        ) : (
          <p className="glass-card-subtle p-3 rounded-xl">{perfil.bio}</p>
        )}
      </div>
    </div>
  );

  const renderTabConquistas = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockConquistas.map(conquista => (
          <div
            key={conquista.id}
            className={`glass-card p-6 text-center transition-all ${
              conquista.conquistado ? 'border-[#B8860B]/30 bg-[#B8860B]/5' : 'opacity-60'
            }`}
          >
            <div className="text-4xl mb-3">{conquista.icone}</div>
            <h4 className="font-bold text-[#003B6D] mb-2">{conquista.nome}</h4>
            <p className="text-gray-600 text-sm mb-3">{conquista.descricao}</p>
            
            {conquista.conquistado ? (
              <div className="text-xs text-[#28A745] font-medium">
                ✅ Conquistado em {conquista.data && new Date(conquista.data).toLocaleDateString()}
              </div>
            ) : conquista.progresso ? (
              <div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-[#B8860B] to-[#DAA520] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${conquista.progresso}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600">{conquista.progresso}% completo</div>
              </div>
            ) : (
              <div className="text-xs text-gray-500">🔒 Bloqueado</div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-card p-6 border-[#0A74DA]/30 bg-[#0A74DA]/5">
        <h4 className="font-bold text-[#003B6D] mb-3">🎯 Próximas Conquistas</h4>
        <div className="space-y-2 text-sm">
          <p>• <strong>Mestre da IA:</strong> 100 feedbacks aprovados (45/100)</p>
          <p>• <strong>Consultor Elite:</strong> ROI médio acima de 200% (167/200%)</p>
          <p>• <strong>Mentor Premium:</strong> 5 consultores treinados (0/5)</p>
        </div>
      </div>
    </div>
  );

  const renderTabAtividade = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h4 className="font-bold text-[#003B6D] mb-4">📈 Atividade Recente</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 glass-card-subtle rounded-lg">
            <div className="w-2 h-2 bg-[#28A745] rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#003B6D]">Análise aprovada para TechStart</p>
              <p className="text-xs text-gray-600">Há 2 horas • +50 pontos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 glass-card-subtle rounded-lg">
            <div className="w-2 h-2 bg-[#0A74DA] rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#003B6D]">Nova empresa cadastrada: FinTech Solutions</p>
              <p className="text-xs text-gray-600">Ontem • Perfil IA configurado</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 glass-card-subtle rounded-lg">
            <div className="w-2 h-2 bg-[#FFA500] rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#003B6D]">Reunião concluída com RetailMax</p>
              <p className="text-xs text-gray-600">2 dias atrás • Relatório gerado automaticamente</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 glass-card-subtle rounded-lg">
            <div className="w-2 h-2 bg-[#B8860B] rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#003B6D]">Conquista desbloqueada: Consultor do Ano</p>
              <p className="text-xs text-gray-600">3 dias atrás • +100 pontos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h4 className="font-bold text-[#003B6D] mb-4">📊 Estatísticas do Mês</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0A74DA] mb-1">23</div>
            <div className="text-xs text-gray-600">Análises Geradas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#28A745] mb-1">16</div>
            <div className="text-xs text-gray-600">Reuniões Realizadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFA500] mb-1">47h</div>
            <div className="text-xs text-gray-600">Horas Economizadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#B8860B] mb-1">347</div>
            <div className="text-xs text-gray-600">Pontos Ganhos</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-full flex items-center justify-center text-3xl shadow-lg">
                {perfil.avatar}
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-[#FFA500] text-white rounded-full hover:bg-[#FFA500]/80 transition-colors">
                <Camera size={12} />
              </button>
            </div>
            
            <div>
              <h1 className="page-title">{perfil.nome}</h1>
              <p className="text-gray-600 mb-2">{perfil.especialidade} • {perfil.experiencia} anos de experiência</p>
              <p className="text-gray-600 text-sm">{perfil.empresa}</p>
            </div>
          </div>

          <button
            onClick={() => isEditing ? handleSalvar() : setIsEditing(true)}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2
              ${isEditing 
                ? 'bg-gradient-to-r from-[#28A745] to-[#20C997] text-white hover:shadow-lg' 
                : 'glass-button text-white hover:shadow-lg'
              }
            `}
          >
            {isEditing ? (
              <>
                <Zap size={20} />
                <span>Salvar Alterações</span>
              </>
            ) : (
              <>
                <Edit size={20} />
                <span>Editar Perfil</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {estatisticas.map((stat, index) => (
          <div key={index} className="glass-card p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              {stat.icone}
            </div>
            <div className={`text-2xl font-bold ${stat.cor} mb-1`}>
              {stat.valor}
            </div>
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            {stat.tendencia && (
              <div className="text-xs text-[#28A745] font-medium">
                {stat.tendencia}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="glass-card p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all
              ${activeTab === 'info'
                ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg'
                : 'text-[#003B6D] hover:bg-white/20'
              }
            `}
          >
            <User size={20} />
            <span>👤 Informações</span>
          </button>
          <button
            onClick={() => setActiveTab('conquistas')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all
              ${activeTab === 'conquistas'
                ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg'
                : 'text-[#003B6D] hover:bg-white/20'
              }
            `}
          >
            <Trophy size={20} />
            <span>🏆 Conquistas</span>
          </button>
          <button
            onClick={() => setActiveTab('atividade')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all
              ${activeTab === 'atividade'
                ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg'
                : 'text-[#003B6D] hover:bg-white/20'
              }
            `}
          >
            <Calendar size={20} />
            <span>📈 Atividade</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass-card p-6">
        {activeTab === 'info' && renderTabInfo()}
        {activeTab === 'conquistas' && renderTabConquistas()}
        {activeTab === 'atividade' && renderTabAtividade()}
      </div>
    </div>
  );
}