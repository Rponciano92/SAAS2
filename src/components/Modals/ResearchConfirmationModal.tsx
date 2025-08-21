import React from 'react';
import { Search, AlertTriangle, Download, X } from 'lucide-react';

interface ResearchConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  isResearching: boolean;
}

export default function ResearchConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  companyName,
  isResearching
}: ResearchConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pesquisa Automática Detectada
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isResearching}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Pesquisa Automática Disponível
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Detectamos que <strong>{companyName}</strong> pode se beneficiar de uma pesquisa automática. 
                  Deseja que nossa IA busque informações adicionais na internet para enriquecer o perfil?
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              O que será pesquisado:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Informações gerais da empresa</li>
              <li>• Principais executivos e liderança</li>
              <li>• Posição no mercado e concorrentes</li>
              <li>• Notícias e desenvolvimentos recentes</li>
              <li>• Dados financeiros públicos</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-gray-600 mt-0.5" />
              <p className="text-xs text-gray-600">
                <strong>Aviso:</strong> As informações são obtidas da internet e podem estar 
                desatualizadas. Você poderá revisar e editar todos os dados antes de finalizar.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isResearching}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Finalizar Cadastro
          </button>
          <button
            onClick={onConfirm}
            disabled={isResearching}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isResearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Pesquisando...</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>Iniciar Pesquisa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}