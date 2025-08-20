import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BarChart3, Calendar, FileText, Brain, Zap } from 'lucide-react';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onNavigate: (tab: string) => void;
}
function QuickActionCard({ icon, title, description, color, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative overflow-hidden
        bg-gradient-to-br ${color} 
        backdrop-blur-xl border border-white/20 rounded-2xl p-6 
        hover:scale-105 hover:shadow-2xl transition-all duration-300
        text-left w-full
      `}
    >
      <div className="relative z-10">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-[#003B6D] mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  const navigate = useNavigate();
  
  const actions = [
    {
      icon: <Plus size={24} className="text-[#0A74DA]" />,
      title: 'Nova Empresa',
      description: 'Adicionar cliente para análise',
      color: 'from-[#0A74DA]/20 to-[#0A74DA]/5',
      onClick: () => navigate('/empresas/nova')
    },
    {
      icon: <BarChart3 size={24} className="text-[#28A745]" />,
      title: 'Análise Rápida',
      description: 'Gerar insights instantâneos',
      color: 'from-[#28A745]/20 to-[#28A745]/5',
      onClick: () => navigate('/analises')
    },
    {
      icon: <Calendar size={24} className="text-[#FFA500]" />,
      title: 'Agendar Reunião',
      description: 'Marcar call com cliente',
      color: 'from-[#FFA500]/20 to-[#FFA500]/5',
      onClick: () => navigate('/reunioes')
    },
    {
      icon: <FileText size={24} className="text-[#B8860B]" />,
      title: 'Relatório',
      description: 'Gerar documento executivo',
      color: 'from-[#B8860B]/20 to-[#B8860B]/5',
      onClick: () => navigate('/analises')
    },
    {
      icon: <Brain size={24} className="text-[#8B5CF6]" />,
      title: 'Treinar IA',
      description: 'Adicionar conhecimento',
      color: 'from-[#8B5CF6]/20 to-[#8B5CF6]/5',
      onClick: () => navigate('/ensinamentos')
    },
    {
      icon: <Zap size={24} className="text-[#EF4444]" />,
      title: 'Automação',
      description: 'Configurar fluxos',
      color: 'from-[#EF4444]/20 to-[#EF4444]/5',
      onClick: () => navigate('/config')
    }
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-[#003B6D] mb-6">Ações Rápidas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
}