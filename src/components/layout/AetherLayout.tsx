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
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          w-64 h-screen bg-white backdrop-blur-xl border-r border-gray-200 shadow-xl
          fixed top-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <div>
                  <div className="text-gray-900 font-bold text-lg">CaaS</div>
                  <div className="text-gray-600 text-xs">Consultant Platform</div>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
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
              const isActive = location.pathname === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 font-medium shadow-sm border-l-4 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mt-4 border-t border-gray-200 pt-6"
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
        <header className="bg-white backdrop-blur-xl border-b border-gray-200 px-6 py-4 sticky top-0 z-[100] w-full overflow-visible shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
              >
                <Menu size={24} />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <div>
                  <span className="text-gray-900 font-bold text-lg">CaaS</span>
                  <p className="text-gray-600 text-xs">Consultant as a Service</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative z-[101]">
                <button
                  onClick={toggleNotifications}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 relative"
                  title="Notificações"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cta-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-md">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => navigate('/empresas/nova')}
                className="hidden md:flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 px-4 py-2 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                title="Cadastrar Novo Cliente"
              >
                <Plus size={16} />
                <span>Novo Cliente</span>
              </button>

              <div className="flex items-center space-x-3 relative z-[101]">
                <button
                  onClick={toggleUserDropdown}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 hover:bg-gray-200 transition-colors"
                >
                  <User size={20} className="text-gray-600" />
                </button>
                <div className="hidden md:block">
                  <p className="font-medium text-gray-900">João Silva</p>
                  <p className="text-sm text-gray-600">Consultor Sênior</p>
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