import { useState } from 'react';
import { X, Bot, Calendar, Link as LinkIcon, Users, Zap } from 'lucide-react';
import { getBotService } from '@/services/googleMeetBotService';

interface ScheduleBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  clientId?: string;
}

export default function ScheduleBotModal({ isOpen, onClose, onSuccess, clientId }: ScheduleBotModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    meetingUrl: '',
    scheduledAt: '',
    platform: 'google_meet' as 'google_meet' | 'zoom' | 'teams',
    autoJoinBot: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.meetingUrl || !formData.scheduledAt) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      const botService = getBotService();

      await botService.scheduleBotForMeeting({
        meetingId: crypto.randomUUID(),
        title: formData.title,
        meetingUrl: formData.meetingUrl,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        platform: formData.platform,
        clientId: clientId,
        autoJoinBot: formData.autoJoinBot,
      });

      onSuccess?.();
      onClose();
      resetForm();
    } catch (err) {
      console.error('Error scheduling bot:', err);
      setError(err instanceof Error ? err.message : 'Erro ao agendar bot');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      meetingUrl: '',
      scheduledAt: '',
      platform: 'google_meet',
      autoJoinBot: true,
    });
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Agendar Bot CaaS</h2>
              <p className="text-sm text-gray-400">O bot entrará automaticamente na reunião</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título da Reunião *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Reunião de Kickoff com Cliente XYZ"
              className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          {/* Meeting URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link da Reunião *
            </label>
            <input
              type="url"
              value={formData.meetingUrl}
              onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Cole o link do Google Meet, Zoom ou Microsoft Teams
            </p>
          </div>

          {/* Scheduled Date/Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data e Hora *
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Plataforma
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'google_meet', label: 'Google Meet', icon: '🎥' },
                { value: 'zoom', label: 'Zoom', icon: '📹' },
                { value: 'teams', label: 'Teams', icon: '💼' },
              ].map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, platform: platform.value as any })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.platform === platform.value
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                      : 'border-white/10 bg-gray-800/30 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{platform.icon}</div>
                  <div className="text-sm font-medium">{platform.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Auto Join Toggle */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-medium text-white">Entrada Automática do Bot</p>
                  <p className="text-sm text-gray-400">O bot entrará automaticamente no horário agendado</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoJoinBot}
                onChange={(e) => setFormData({ ...formData, autoJoinBot: e.target.checked })}
                className="w-12 h-6 rounded-full appearance-none bg-gray-700 checked:bg-cyan-500 relative cursor-pointer transition-colors before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-6"
              />
            </label>
          </div>

          {/* Features Info */}
          <div className="bg-gray-800/30 border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-3 font-medium">O bot irá:</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span>Gravar áudio e vídeo da reunião</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span>Transcrever automaticamente com Whisper AI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span>Gerar análise completa com GPT-4o-mini</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span>Identificar action items e decisões</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  Agendar Bot
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
