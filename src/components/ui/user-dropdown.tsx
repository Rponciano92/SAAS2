import React from 'react';
import { User, Settings, Trophy, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function UserDropdown({ isOpen, onClose, user }: UserDropdownProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    // Implementar lógica de logout
    console.log('Logout');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Dropdown */}
      <div className="absolute top-16 right-4 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-[10000] overflow-hidden">
        {/* User Info Header */}
        <div className="p-4 bg-[#003B6D] text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <User size={20} className="text-[#003B6D]" />
            </div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-blue-100">{user.role}</p>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="py-2">
          <button
            onClick={() => handleNavigation('/perfil')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <User size={16} className="text-gray-600" />
            <span className="text-gray-700">Meu Perfil</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/config')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <Settings size={16} className="text-gray-600" />
            <span className="text-gray-700">Configurações</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/gamificacao')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <Trophy size={16} className="text-gray-600" />
            <span className="text-gray-700">Gamificação</span>
          </button>
          
          <button
            onClick={() => handleNavigation('/ajuda')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <HelpCircle size={16} className="text-gray-600" />
            <span className="text-gray-700">Ajuda</span>
          </button>
          
          <div className="border-t border-gray-200 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}