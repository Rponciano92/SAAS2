import React, { useState } from 'react';
import { testAetherSaasConnection, getAetherSaasService } from '@/services/aetherSaasService';
import { CheckCircle, AlertTriangle, Loader, Rocket, Server, Key, Globe } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp?: string;
}

export default function AetherSaasTest() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState<'connection' | 'upload' | 'transcription'>('connection');

  const runConnectionTest = async () => {
    try {
      setIsLoading(true);
      setTestResult(null);
      
      console.log('🧪 Iniciando teste de conexão AetherSaaS...');
      
      const result = await testAetherSaasConnection();
      
      setTestResult({
        ...result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setTestResult({
        success: false,
        message: 'Erro no teste de conexão',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runUploadTest = async () => {
    try {
      setIsLoading(true);
      setTestResult(null);
      
      console.log('🧪 Testando upload de arquivo...');
      
      // Criar arquivo de teste
      const testFile = new File(['test audio content'], 'test-meeting.mp3', { type: 'audio/mpeg' });
      
      const service = getAetherSaasService();
      const result = await service.uploadMeetingAudio(testFile, 'Reunião de Teste');
      
      setTestResult({
        success: true,
        message: 'Upload de teste realizado com sucesso!',
        data: result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Erro no teste de upload:', error);
      setTestResult({
        success: false,
        message: 'Erro no teste de upload',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runTranscriptionTest = async () => {
    try {
      setIsLoading(true);
      setTestResult(null);
      
      console.log('🧪 Testando busca de transcrições...');
      
      const service = getAetherSaasService();
      const transcriptions = await service.getTranscriptions(5);
      
      setTestResult({
        success: true,
        message: `Encontradas ${transcriptions.length} transcrições`,
        data: { transcriptions, count: transcriptions.length },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Erro no teste de transcrições:', error);
      setTestResult({
        success: false,
        message: 'Erro no teste de transcrições',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runTest = () => {
    switch (testType) {
      case 'connection':
        runConnectionTest();
        break;
      case 'upload':
        runUploadTest();
        break;
      case 'transcription':
        runTranscriptionTest();
        break;
    }
  };

  const getTestIcon = () => {
    switch (testType) {
      case 'connection': return <Server size={20} />;
      case 'upload': return <Upload size={20} />;
      case 'transcription': return <FileText size={20} />;
      default: return <Rocket size={20} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card-strong p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-[#B8860B] to-[#DAA520] rounded-xl shadow-lg">
            <Rocket size={24} className="text-white" />
          </div>
          <div>
            <h1 className="page-title">🧪 Teste AetherSaaS API</h1>
            <p className="text-gray-600">Teste a conectividade e funcionalidades do seu sistema próprio</p>
          </div>
        </div>

        {/* API Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="glass-card-subtle p-4 text-center">
            <Globe size={20} className="mx-auto text-[#0A74DA] mb-2" />
            <div className="text-sm font-medium text-[#003B6D]">API URL</div>
            <div className="text-xs text-gray-600 break-all">
              {import.meta.env.VITE_AETHERSAAS_API_URL || 'Não configurado'}
            </div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <Key size={20} className="mx-auto text-[#28A745] mb-2" />
            <div className="text-sm font-medium text-[#003B6D]">API Key</div>
            <div className="text-xs text-gray-600">
              {import.meta.env.VITE_AETHERSAAS_API_KEY ? 
                `${import.meta.env.VITE_AETHERSAAS_API_KEY.substring(0, 12)}...` : 
                'Não configurado'
              }
            </div>
          </div>
          <div className="glass-card-subtle p-4 text-center">
            <Rocket size={20} className="mx-auto text-[#B8860B] mb-2" />
            <div className="text-sm font-medium text-[#003B6D]">Status</div>
            <div className="text-xs text-gray-600">
              {import.meta.env.VITE_AETHERSAAS_API_KEY ? 'Configurado' : 'Pendente'}
            </div>
          </div>
        </div>
      </div>
            <li>• <code>POST /api/meetings/join-real</code> - Entrar em reunião ao vivo</li>
      {/* Test Controls */}
      <div className="glass-card p-6">
        <h3 className="section-title mb-6">🔧 Controles de Teste</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setTestType('connection')}
            className={`p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
              testType === 'connection'
                ? 'border-[#0A74DA] bg-[#0A74DA]/10'
                : 'border-gray-300 hover:border-[#0A74DA]/50'
            }`}
          >
            <Server size={24} className={testType === 'connection' ? 'text-[#0A74DA]' : 'text-gray-500'} />
            <div className="text-left">
              <p className="font-semibold text-[#003B6D]">Teste de Conexão</p>
              <p className="text-sm text-gray-600">Verificar se API está online</p>
            </div>
          </button>

          <button
            onClick={() => setTestType('upload')}
            className={`p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
              testType === 'upload'
                ? 'border-[#28A745] bg-[#28A745]/10'
                : 'border-gray-300 hover:border-[#28A745]/50'
            }`}
          >
            <Upload size={24} className={testType === 'upload' ? 'text-[#28A745]' : 'text-gray-500'} />
            <div className="text-left">
              <p className="font-semibold text-[#003B6D]">Teste de Upload</p>
              <p className="text-sm text-gray-600">Testar envio de arquivo</p>
            </div>
          </button>

          <button
            onClick={() => setTestType('transcription')}
            className={`p-4 rounded-lg border-2 transition-all flex items-center space-x-3 ${
              testType === 'transcription'
                ? 'border-[#FFA500] bg-[#FFA500]/10'
                : 'border-gray-300 hover:border-[#FFA500]/50'
            }`}
          >
            <FileText size={24} className={testType === 'transcription' ? 'text-[#FFA500]' : 'text-gray-500'} />
            <div className="text-left">
              <p className="font-semibold text-[#003B6D]">Teste de Transcrições</p>
              <p className="text-sm text-gray-600">Buscar reuniões existentes</p>
            </div>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={runTest}
            disabled={isLoading}
            className={`px-8 py-4 rounded-xl font-medium transition-all flex items-center space-x-3 mx-auto ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#B8860B] to-[#DAA520] text-white hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                <span>Testando...</span>
              </>
            ) : (
              <>
                {getTestIcon()}
                <span>Executar Teste</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className="glass-card p-6">
          <h3 className="section-title mb-4">📊 Resultado do Teste</h3>
          
          <div className={`p-4 rounded-lg border-l-4 ${
            testResult.success 
              ? 'border-[#28A745] bg-[#28A745]/5' 
              : 'border-[#EF4444] bg-[#EF4444]/5'
          }`}>
            <div className="flex items-start space-x-3">
              {testResult.success ? (
                <CheckCircle size={20} className="text-[#28A745] mt-1" />
              ) : (
                <AlertTriangle size={20} className="text-[#EF4444] mt-1" />
              )}
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 ${
                  testResult.success ? 'text-[#28A745]' : 'text-[#EF4444]'
                }`}>
                  {testResult.success ? '✅ Teste Bem-sucedido' : '❌ Teste Falhou'}
                </h4>
                <p className="text-gray-700 mb-2">{testResult.message}</p>
                
                {testResult.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                    <p className="text-sm text-red-700">
                      <strong>Erro:</strong> {testResult.error}
                    </p>
                  </div>
                )}
                
                {testResult.data && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Dados retornados:</strong>
                    </p>
                    <pre className="text-xs text-blue-600 overflow-auto">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResult.timestamp && (
                  <p className="text-xs text-gray-500 mt-2">
                    Testado em: {new Date(testResult.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Help */}
      <div className="glass-card p-6 border-[#B8860B]/30 bg-[#B8860B]/5">
        <h4 className="font-bold text-[#003B6D] mb-4">⚙️ Configuração do AetherSaaS</h4>
        <div className="space-y-4 text-sm">
          <div className="bg-white/20 p-4 rounded-lg">
            <h5 className="font-semibold text-[#003B6D] mb-2">1. Configurar Variáveis de Ambiente</h5>
            <p className="text-gray-700 mb-2">Adicione no seu arquivo <code>.env</code>:</p>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto">
{`VITE_AETHERSAAS_API_URL=http://72.60.52.39:8000
VITE_AETHERSAAS_API_KEY=aethersaas_IrJGOg7VCrE0CBfIIsF2dBwTWzA1khxBDNMW47Ql`}
            </pre>
          </div>
          
          <div className="bg-white/20 p-4 rounded-lg">
            <h5 className="font-semibold text-[#003B6D] mb-2">2. Endpoints Disponíveis</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• <code>GET /health</code> - Status da API</li>
              <li>• <code>POST /meetings/join</code> - Entrar em reunião ao vivo</li>
              <li>• <code>GET /meetings/active</code> - Reuniões ativas</li>
              <li>• <code>POST /meetings/join-background</code> - Entrar em background</li>
              <li>• <code>POST /meetings/{'{meeting_id}'}/stop</code> - Parar reunião</li>
            </ul>
          </div>
          
          <div className="bg-white/20 p-4 rounded-lg">
            <h5 className="font-semibold text-[#003B6D] mb-2">3. Formato da API Key</h5>
            <p className="text-gray-700">
              Sua chave deve começar com <code>aethersaas_</code> seguida de caracteres alfanuméricos.
              Exemplo: <code>aethersaas_IrJGOg7VCrE0CBfIIsF2dBwTWzA1khxBDNMW47Ql</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}