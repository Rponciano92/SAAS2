import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Plus } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  
  return (
    <header className="bg-[#003B6D] backdrop-blur-xl border-b border-white/20 px-6 py-4 sticky top-0 z-20 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white lg:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-3">
            <img 
              src="/1 copy.png" 
              alt="Aether AI Logo" 
              className="w-10 h-10 object-contain drop-shadow-lg"
            />
            <div>
              <span className="text-white font-bold text-lg">AETHER AI</span>
              <p className="text-white/70 text-xs">Assistente Definitivo</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white relative" title="Notificações">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-[#FFA500] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          
          <button 
            onClick={() => navigate('/empresas/nova')}
            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-[#003B6D] to-[#001a2e] px-4 py-2 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm border border-white/20"
            title="Cadastrar Nova Empresa"
          >
            <Plus size={16} />
            <span>Nova Empresa</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <User size={20} className="text-[#003B6D]" />
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-white">João Silva</p>
              <p className="text-sm text-white/80">Consultor Sênior</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}