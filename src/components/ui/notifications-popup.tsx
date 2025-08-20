import React from 'react';
import { Bell, X, Calendar, FileText, Brain, Trophy, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'meeting' | 'task' | 'teaching' | 'gamification' | 'analysis';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'meeting':
      return <Calendar size={16} className="text-green-500" />;
    case 'task':
      return <FileText size={16} className="text-orange-500" />;
    case 'teaching':
      return <Brain size={16} className="text-blue-500" />;
    case 'gamification':
      return <Trophy size={16} className="text-yellow-500" />;
    case 'analysis':
      return <CheckCircle size={16} className="text-blue-500" />;
    default:
      return <Bell size={16} className="text-gray-500" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'meeting':
      return 'border-l-green-500';
    case 'task':
      return 'border-l-orange-500';
    case 'teaching':
      return 'border-l-blue-500';
    case 'gamification':
      return 'border-l-yellow-500';
    case 'analysis':
      return 'border-l-blue-500';
    default:
      return 'border-l-gray-300';
  }
};

export default function NotificationsPopup({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAllRead 
}: NotificationsPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Popup */}
      <div className="absolute top-16 right-4 w-80 max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 z-[10000]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Notificações</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        
        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell size={32} className="mx-auto mb-2 text-gray-300" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'bg-blue-50' : 'bg-white'
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={onMarkAllRead}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Marcar todas como lidas
              </button>
              <button
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ver todas as notificações
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}