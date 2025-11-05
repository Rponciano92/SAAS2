import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Plus } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white backdrop-blur-xl border-b border-gray-200 px-6 py-4 sticky top-0 z-20 w-full shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 lg:hidden"
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
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 relative" title="Notificações">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-cta-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-md">
                3
              </span>
            </button>
          </div>

          <button
            onClick={() => navigate('/empresas/nova')}
            className="hidden md:flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 px-4 py-2 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
            title="Cadastrar Nova Empresa"
          >
            <Plus size={16} />
            <span>Nova Empresa</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
              <User size={20} className="text-gray-600" />
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-gray-900">João Silva</p>
              <p className="text-sm text-gray-600">Consultor Sênior</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}