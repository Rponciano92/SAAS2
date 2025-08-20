import React from 'react';
import { 
  Home, 
  Building2, 
  Plus,
  BarChart3, 
  Calendar, 
  BookOpen, 
  Brain, 
  MessageSquare,
  Settings, 
  User,
  X,
  Eye
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, emoji: '🏠' },
  { id: 'cadastrar-empresa', label: 'Cadastrar Empresa', icon: Plus, emoji: '➕' },
  { id: 'empresas', label: 'Empresas Clientes', icon: Building2, emoji: '🏢' },
  { id: 'analises', label: 'Análises IA', icon: BarChart3, emoji: '📊' },
  { id: 'reunioes', label: 'Reuniões', icon: Calendar, emoji: '📅' },
  { id: 'conhecimento', label: 'Base Conhecimento', icon: BookOpen, emoji: '📚' },
  { id: 'ensinamentos', label: 'Ensinamentos IA', icon: Brain, emoji: '🧠' },
  { id: 'assistente', label: 'Assistente IA', icon: MessageSquare, emoji: '🤖' },
  { id: 'configuracoes', label: 'Configurações', icon: Settings, emoji: '⚙️' },
  { id: 'perfil', label: 'Perfil', icon: User, emoji: '👤' },
];

export default function Sidebar({ isOpen, onToggle, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-[70] transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:h-screen
      `}>
        <div className="w-64 h-full bg-gradient-to-b from-[#003B6D] to-[#001a2e] backdrop-blur-xl border-r border-white/20 overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-white/20 bg-[#003B6D]/95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="/1 copy.png" 
                    alt="Aether AI Logo" 
                    className="w-10 h-10 object-contain drop-shadow-lg rounded-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#B8860B] to-[#DAA520] rounded-full border-2 border-[#003B6D]"></div>
                </div>
                <div>
                  <span className="text-white font-bold text-lg">AETHER AI</span>
                  <p className="text-white/70 text-xs">Assistente Definitivo</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg backdrop-blur-sm transform scale-105' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:transform hover:scale-102'
                    }
                  `}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <Icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
            
            {/* Logout Button */}
            <button
              onClick={() => console.log('Logout')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 mt-4 border-t border-white/20 pt-6"
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium text-sm">Sair</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}