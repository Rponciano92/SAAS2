import React, { useState } from 'react';
import { 
  Home, 
  Building2, 
  PlusCircle,
  BarChart3, 
  Calendar, 
  BookOpen, 
  Brain, 
  MessageSquare,
  Mic,
  Settings, 
  User,
  Trophy,
  X,
  Menu,
  Bell,
  Plus,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationsPopup from '@/components/ui/notifications-popup';
import UserDropdown from '@/components/ui/user-dropdown';

interface AetherLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { id: '/', label: 'Dashboard', icon: Home },
  { id: '/empresas/nova', label: 'Cadastrar Cliente', icon: PlusCircle },
  { id: '/empresas', label: 'Clientes', icon: Building2 },
  { id: '/analises', label: 'Análises IA', icon: BarChart3 },
  { id: '/reunioes', label: 'Reuniões', icon: Calendar },
  { id: '/base', label: 'Base Conhecimento', icon: BookOpen },
  { id: '/ensinamentos', label: 'Ensinamentos IA', icon: Brain },
  { id: '/assistente', label: 'Assistente IA', icon: MessageSquare },
  { id: '/config', label: 'Configurações', icon: Settings },
  { id: '/perfil', label: 'Perfil', icon: User },
  { id: '/gamificacao', label: 'Gamificação', icon: Trophy },
];

const mockNotifications = [
  {
    id: '1',
    type: 'analysis' as const,
    title: 'Análise aprovada',
    description: 'Sua análise da TechStart foi aprovada',
    time: '2 horas atrás',
    read: false
  },
  {
    id: '2',
    type: 'meeting' as const,
    title: 'Nova reunião agendada',
    description: 'Reunião com RetailMax às 14:00',
    time: '1 dia atrás',
    read: false
  },
  {
    id: '3',
    type: 'task' as const,
    title: 'Relatório pendente',
    description: 'Relatório da FinTech aguarda validação',
    time: '2 dias atrás',
    read: false
  }
];

export default function AetherLayout({ children }: AetherLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
    setNotificationsOpen(false);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-screen w-screen overflow-hidden marble-background">
      {/* Sidebar */}
      <aside 
        className={`
          w-64 h-screen bg-gradient-to-b from-[#003B6D] to-[#001a2e] backdrop-blur-xl border-r border-white/20
          fixed top-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        `}
      >
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-white/20 bg-[#003B6D]/95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-[#003B6D] rounded-lg flex items-center justify-center">
                    <img 
                      src="/1 copy.png" 
                      alt="Aether AI Logo" 
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#B8860B] to-[#DAA520] rounded-full border-2 border-[#003B6D]"></div>
                </div>
                <div>
                  <span className="text-white font-bold text-lg">AETHER AI</span>
                  <p className="text-white/70 text-xs">Assistente Definitivo</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
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
              const isActive = location.pathname === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#0A74DA] to-[#003B6D] text-white shadow-lg backdrop-blur-sm transform scale-105' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:transform hover:scale-102'
                    }
                  `}
                >
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
              <LogOut size={18} />
              <span className="font-medium text-sm">Sair</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main Content */}
      <div className="w-full flex flex-col h-screen overflow-hidden">
        <header className="bg-[#003B6D] backdrop-blur-xl border-b border-white/20 px-6 py-4 sticky top-0 z-[100] w-full overflow-visible">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <Menu size={24} />
              </button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src="/1 copy.png" 
                  alt="Aether AI Logo"
                  className="w-10 h-10 object-contain p-1 bg-[#003B6D] rounded-lg"
                />
                <div>
                  <span className="text-white font-bold text-lg">AETHER AI</span>
                  <p className="text-white/70 text-xs">Assistente Definitivo</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative z-[101]">
                <button 
                  onClick={toggleNotifications}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white relative" 
                  title="Notificações"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FFA500] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
              
              <button 
                onClick={() => navigate('/empresas/nova')}
                className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-[#003B6D] to-[#001a2e] px-4 py-2 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm border border-white/20"
                title="Cadastrar Novo Cliente"
              >
                <Plus size={16} />
                <span>Novo Cliente</span>
              </button>
              
              <div className="flex items-center space-x-3 relative z-[101]">
                <button
                  onClick={toggleUserDropdown}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <User size={20} className="text-[#003B6D]" />
                </button>
                <div className="hidden md:block">
                  <p className="font-medium text-white">João Silva</p>
                  <p className="text-sm text-white/80">Consultor Sênior</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Notifications Popup */}
        <NotificationsPopup
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
        />
        
        {/* User Dropdown */}
        <UserDropdown
          isOpen={userDropdownOpen}
          onClose={() => setUserDropdownOpen(false)}
          user={{
            name: 'João Silva',
            role: 'Consultor Sênior'
          }}
        />
        
        <main className="flex-1 overflow-y-auto w-full">
          <div className="h-full flex flex-col px-4 lg:px-6 py-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}