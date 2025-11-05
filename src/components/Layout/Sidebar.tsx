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
        <div className="w-64 h-full bg-white backdrop-blur-xl border-r border-gray-200 overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <div>
                  <span className="text-gray-900 font-bold text-lg">CaaS</span>
                  <p className="text-gray-600 text-xs">Consultant Platform</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="lg:hidden text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
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
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 font-medium shadow-sm border-l-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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