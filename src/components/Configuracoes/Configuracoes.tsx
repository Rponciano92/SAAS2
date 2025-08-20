import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Database, Zap, Eye, Save } from 'lucide-react';

interface ConfiguracaoItem {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  tipo: 'toggle' | 'select' | 'input' | 'slider';
  valor: any;
  opcoes?: string[];
  min?: number;
  max?: number;
}

const mockConfiguracoes: ConfiguracaoItem[] = [
  // Perfil
  {
    id: 'nome',
    categoria: 'Perfil',
    titulo: 'Nome Completo',
    descricao: 'Seu nome como aparece no sistema',
    tipo: 'input',
    valor: 'João Silva'
  },
  {
    id: 'especialidade',
    categoria: 'Perfil',
    titulo: 'Área de Especialidade',
    descricao: 'Sua principal área de atuação em consultoria',
    tipo: 'select',
    valor: 'estrategia',
    opcoes: ['Estratégia Empresarial', 'Análise Financeira', 'Operações', 'Marketing', 'Tecnologia', 'RH']
  },
  {
    id: 'experiencia',
    categoria: 'Perfil',
    titulo: 'Anos de Experiência',
    descricao: 'Tempo de atuação em consultoria',
    tipo: 'slider',
    valor: 15,
    min: 1,
    max: 40
  },

  // Notificações
  {
    id: 'notif_validacao',
    categoria: 'Notificações',
    titulo: 'Validações Aprovadas',
    descricao: 'Receber notificação quando análises forem validadas',
    tipo: 'toggle',
    valor: true
  },
  {
    id: 'notif_reuniao',
    categoria: 'Notificações',
    titulo: 'Lembretes de Reunião',
    descricao: 'Notificações antes das reuniões agendadas',
    tipo: 'toggle',
    valor: true
  },
  {
    id: 'notif_insights',
    categoria: 'Notificações',
    titulo: 'Novos Insights',
    descricao: 'Alertas sobre insights importantes identificados pela IA',
    tipo: 'toggle',
    valor: false
  },

  // IA e Assistente
  {
    id: 'ia_personalidade',
    categoria: 'IA e Assistente',
    titulo: 'Personalidade da IA',
    descricao: 'Como a IA deve se comportar nas interações',
    tipo: 'select',
    valor: 'consultivo',
    opcoes: ['Consultivo', 'Analítico', 'Estratégico', 'Inovador', 'Conservador']
  },
  {
    id: 'ia_confianca',
    categoria: 'IA e Assistente',
    titulo: 'Nível de Confiança Mínimo',
    descricao: 'Confiança mínima para exibir insights da IA',
    tipo: 'slider',
    valor: 85,
    min: 50,
    max: 100
  },
  {
    id: 'ia_sugestoes',
    categoria: 'IA e Assistente',
    titulo: 'Sugestões Proativas',
    descricao: 'IA pode sugerir ações sem ser solicitada',
    tipo: 'toggle',
    valor: true
  },

  // Segurança
  {
    id: 'seg_2fa',
    categoria: 'Segurança',
    titulo: 'Autenticação de Dois Fatores',
    descricao: 'Adicionar camada extra de segurança',
    tipo: 'toggle',
    valor: false
  },
  {
    id: 'seg_sessao',
    categoria: 'Segurança',
    titulo: 'Timeout de Sessão',
    descricao: 'Tempo para logout automático (minutos)',
    tipo: 'select',
    valor: '60',
    opcoes: ['30', '60', '120', '240', 'Nunca']
  },

  // Dados e Privacidade
  {
    id: 'dados_backup',
    categoria: 'Dados e Privacidade',
    titulo: 'Backup Automático',
    descricao: 'Backup automático dos dados do cliente',
    tipo: 'toggle',
    valor: true
  },
  {
    id: 'dados_retencao',
    categoria: 'Dados e Privacidade',
    titulo: 'Retenção de Dados',
    descricao: 'Tempo de retenção dos dados (meses)',
    tipo: 'select',
    valor: '24',
    opcoes: ['12', '24', '36', '60', 'Indefinido']
  }
];

export default function Configuracoes() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoItem[]>(mockConfiguracoes);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Perfil');
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);

  const categorias = Array.from(new Set(configuracoes.map(c => c.categoria)));

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'Perfil': return <User size={20} className="text-[#0A74DA]" />;
      case 'Notificações': return <Bell size={20} className="text-[#FFA500]" />;
      case 'IA e Assistente': return <Eye size={20} className="text-[#B8860B]" />;
      case 'Segurança': return <Shield size={20} className="text-[#EF4444]" />;
      case 'Dados e Privacidade': return <Database size={20} className="text-[#28A745]" />;
      default: return <Settings size={20} className="text-gray-500" />;
    }
  };

  const handleConfigChange = (id: string, novoValor: any) => {
    setConfiguracoes(prev => 
      prev.map(config => 
        config.id === id ? { ...config, valor: novoValor } : config
      )
    );
    setAlteracoesPendentes(true);
  };

  const handleSalvar = () => {
    // Simulate save
    setTimeout(() => {
      setAlteracoesPendentes(false);
      alert('Configurações salvas com sucesso!');
    }, 1000);
  };

  const renderConfigInput = (config: ConfiguracaoItem) => {
    switch (config.tipo) {
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.valor}
              onChange={(e) => handleConfigChange(config.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0A74DA]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A74DA]"></div>
          </label>
        );

      case 'select':
        return (
          <select
            value={config.valor}
            onChange={(e) => handleConfigChange(config.id, e.target.value)}
            className="glass-input px-3 py-2 text-[#003B6D] rounded-lg text-sm min-w-[150px]"
          >
            {config.opcoes?.map(opcao => (
              <option key={opcao} value={opcao.toLowerCase().replace(' ', '_')}>
                {opcao}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            value={config.valor}
            onChange={(e) => handleConfigChange(config.id, e.target.value)}
            className="glass-input px-3 py-2 text-[#003B6D] rounded-lg text-sm min-w-[200px]"
          />
        );

      case 'slider':
        return (
          <div className="flex items-center space-x-3 min-w-[200px]">
            <input
              type="range"
              min={config.min}
              max={config.max}
              value={config.valor}
              onChange={(e) => handleConfigChange(config.id, parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm font-medium text-[#003B6D] min-w-[40px]">
              {config.valor}{config.id === 'ia_confianca' ? '%' : ''}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#0A74DA] to-[#003B6D] rounded-xl shadow-lg">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <h1 className="page-title">⚙️ Configurações do Sistema</h1>
              <p className="text-gray-600">Personalize sua experiência no Aether AI</p>
            </div>
          </div>

          {alteracoesPendentes && (
            <button
              onClick={handleSalvar}
              className="glass-button px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Save size={20} />
              <span>Salvar Alterações</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu de Categorias */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-[#003B6D] mb-4">📋 Categorias</h3>
          <div className="space-y-2">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaAtiva(categoria)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3
                  ${categoriaAtiva === categoria 
                    ? 'bg-[#0A74DA] text-white shadow-lg' 
                    : 'hover:bg-white/20 text-[#003B6D]'
                  }
                `}
              >
                {getCategoriaIcon(categoria)}
                <span className="font-medium text-sm">{categoria}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Configurações */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <h3 className="section-title flex items-center space-x-3 mb-6">
              {getCategoriaIcon(categoriaAtiva)}
              <span>{categoriaAtiva}</span>
            </h3>

            <div className="space-y-6">
              {configuracoes
                .filter(config => config.categoria === categoriaAtiva)
                .map(config => (
                  <div key={config.id} className="glass-card-subtle p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#003B6D] mb-1">
                          {config.titulo}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {config.descricao}
                        </p>
                      </div>
                      <div className="ml-6">
                        {renderConfigInput(config)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Informações Adicionais por Categoria */}
          {categoriaAtiva === 'IA e Assistente' && (
            <div className="glass-card p-6 border-[#B8860B]/30 bg-[#B8860B]/5">
              <h4 className="font-bold text-[#003B6D] mb-3">🤖 Sobre o Assistente IA</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>Modo Offline:</strong> Sua IA funciona sem conexão com internet para máxima segurança</p>
                <p>• <strong>Validação Humana:</strong> Todos os insights são validados por especialistas</p>
                <p>• <strong>Base Curada:</strong> Conhecimento especializado em consultoria empresarial</p>
                <p>• <strong>Personalização:</strong> Adapta-se ao seu estilo e área de especialidade</p>
              </div>
            </div>
          )}

          {categoriaAtiva === 'Segurança' && (
            <div className="glass-card p-6 border-[#EF4444]/30 bg-[#EF4444]/5">
              <h4 className="font-bold text-[#003B6D] mb-3">🔒 Segurança dos Dados</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>Criptografia:</strong> Todos os dados são criptografados em repouso e em trânsito</p>
                <p>• <strong>LGPD Compliance:</strong> Totalmente adequado à Lei Geral de Proteção de Dados</p>
                <p>• <strong>Auditoria:</strong> Logs completos de todas as ações no sistema</p>
                <p>• <strong>Backup Seguro:</strong> Backups automáticos com criptografia de nível militar</p>
              </div>
            </div>
          )}

          {categoriaAtiva === 'Dados e Privacidade' && (
            <div className="glass-card p-6 border-[#28A745]/30 bg-[#28A745]/5">
              <h4 className="font-bold text-[#003B6D] mb-3">📊 Gestão de Dados</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• <strong>Propriedade:</strong> Você mantém total propriedade dos seus dados</p>
                <p>• <strong>Portabilidade:</strong> Exporte seus dados a qualquer momento</p>
                <p>• <strong>Exclusão:</strong> Direito ao esquecimento garantido</p>
                <p>• <strong>Transparência:</strong> Relatórios detalhados sobre uso dos dados</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ações Avançadas */}
      <div className="glass-card p-6">
        <h3 className="section-title mb-6">🔧 Ações Avançadas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="glass-card-subtle p-4 text-left hover:bg-white/20 transition-colors">
            <div className="flex items-center space-x-3 mb-2">
              <Database size={20} className="text-[#0A74DA]" />
              <span className="font-semibold text-[#003B6D]">Exportar Dados</span>
            </div>
            <p className="text-gray-600 text-sm">Baixar todos os seus dados em formato JSON</p>
          </button>

          <button className="glass-card-subtle p-4 text-left hover:bg-white/20 transition-colors">
            <div className="flex items-center space-x-3 mb-2">
              <Zap size={20} className="text-[#FFA500]" />
              <span className="font-semibold text-[#003B6D]">Resetar IA</span>
            </div>
            <p className="text-gray-600 text-sm">Reinicializar configurações do assistente</p>
          </button>

          <button className="glass-card-subtle p-4 text-left hover:bg-white/20 transition-colors">
            <div className="flex items-center space-x-3 mb-2">
              <Shield size={20} className="text-[#28A745]" />
              <span className="font-semibold text-[#003B6D]">Auditoria</span>
            </div>
            <p className="text-gray-600 text-sm">Ver log completo de atividades</p>
          </button>
        </div>
      </div>
    </div>
  );
}