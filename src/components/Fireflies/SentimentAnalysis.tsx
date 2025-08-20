import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Lightbulb } from 'lucide-react';

interface SentimentAnalysisProps {
  sentiments?: {
    positive_pct: Float;
    neutral_pct: Float;
    negative_pct: Float;
  };
  meetingId?: string;
}

export default function SentimentAnalysis({ sentiments, meetingId }: SentimentAnalysisProps) {
  // ✅ CORREÇÃO: Debug detalhado
  console.log('🎭 SentimentAnalysis received:', {
    sentiments,
    meetingId,
    hasSentiments: !!sentiments,
    sentimentsType: typeof sentiments,
    keys: sentiments ? Object.keys(sentiments) : []
  });

  // ✅ CORREÇÃO: Validação robusta
  if (!sentiments) {
    console.log('🎭 No sentiments data - showing empty state');
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          📊 Análise de Sentimento da IA
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <AlertTriangle className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">Análise de sentimento não disponível</p>
          <p className="text-sm text-gray-500 mt-2">
            Esta reunião pode não ter dados de sentimento processados ainda.
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Possíveis motivos:</strong>
            </p>
            <ul className="text-xs text-blue-600 mt-1 space-y-1">
              <li>• Reunião muito recente (ainda processando)</li>
              <li>• Reunião muito curta (&lt; 2 minutos)</li>
              <li>• Qualidade de áudio baixa</li>
              <li>• Recurso não habilitado na conta</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const { positive_pct, neutral_pct, negative_pct } = sentiments;
  
  // ✅ CORREÇÃO: Validação de valores Float conforme documentação oficial
  const positive = parseFloat(positive_pct) || 0;
  const neutral = parseFloat(neutral_pct) || 0;
  const negative = parseFloat(negative_pct) || 0;
  const total = positive + neutral + negative;
  
  console.log('🎭 Processed sentiment values:', {
    original: { positive_pct, neutral_pct, negative_pct },
    processed: { positive, neutral, negative, total }
  });
  
  // ✅ CORREÇÃO: Verificar se há dados válidos
  if (total === 0) {
    console.log('🎭 All sentiment values are zero - showing zero state');
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          📊 Análise de Sentimento da IA
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Minus className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 font-medium">Sentimentos não detectados</p>
          <p className="text-sm text-gray-500 mt-2">
            Todos os valores de sentimento são 0%. Isso pode indicar que a análise ainda não foi processada.
          </p>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-700">
              <strong>Dados recebidos:</strong> Positivo: {positive}%, Neutro: {neutral}%, Negativo: {negative}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ CORREÇÃO: Normalizar valores se necessário
  let normalizedPositive = positive;
  let normalizedNeutral = neutral;
  let normalizedNegative = negative;
  
  // Se total é muito diferente de 100, normalizar
  if (total > 0 && (total < 50 || total > 150)) {
    console.log('🎭 Normalizing sentiment values, total was:', total);
    const factor = 100 / total;
    normalizedPositive = positive * factor;
    normalizedNeutral = neutral * factor;
    normalizedNegative = negative * factor;
  }

  // ✅ CORREÇÃO: Gerar insights baseados em dados reais
  const generateInsights = () => {
    const insights = [];
    
    if (normalizedPositive > 60) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        text: `Excelente clima na reunião! ${normalizedPositive.toFixed(1)}% de sentimento positivo indica alta colaboração e engajamento da equipe.`
      });
    } else if (normalizedPositive > 40) {
      insights.push({
        type: 'info',
        icon: TrendingUp,
        text: `Reunião com tom positivo (${normalizedPositive.toFixed(1)}%). Bom ambiente de trabalho detectado.`
      });
    }
    
    if (normalizedNegative > 30) {
      insights.push({
        type: 'warning',
        icon: TrendingDown,
        text: `Atenção: ${normalizedNegative.toFixed(1)}% de negatividade detectada. Considere abordar preocupações da equipe em próximas reuniões.`
      });
    } else if (normalizedNegative > 15) {
      insights.push({
        type: 'info',
        icon: AlertTriangle,
        text: `Alguns pontos de tensão identificados (${normalizedNegative.toFixed(1)}%). Monitore o clima da equipe.`
      });
    }
    
    if (normalizedNeutral > 60) {
      insights.push({
        type: 'info',
        icon: Minus,
        text: `Reunião predominantemente neutra (${normalizedNeutral.toFixed(1)}%). Considere estratégias para aumentar o engajamento.`
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          📊 Análise de Sentimento da IA
        </h3>
        {meetingId && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            ID: {meetingId.substring(0, 8)}...
          </span>
        )}
      </div>
      
      {/* ✅ CORREÇÃO: Cards de sentimento com valores reais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 font-medium">😊 Positivo</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-800 mb-1">
            {normalizedPositive.toFixed(1)}%
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(normalizedPositive, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-green-600 mt-1">
            Valor original: {positive.toFixed(1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">😐 Neutro</span>
            <Minus className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {normalizedNeutral.toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(normalizedNeutral, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Valor original: {neutral.toFixed(1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-700 font-medium">😟 Negativo</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-800 mb-1">
            {normalizedNegative.toFixed(1)}%
          </div>
          <div className="w-full bg-red-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(normalizedNegative, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-red-600 mt-1">
            Valor original: {negative.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* ✅ CORREÇÃO: Insights automáticos baseados em dados reais */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            Insights Automáticos da IA
          </h4>
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const colorClasses = {
              success: 'bg-green-50 border-green-200 text-green-800',
              warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
              info: 'bg-blue-50 border-blue-200 text-blue-800'
            };
            
            return (
              <div key={index} className={`p-3 rounded-lg border ${colorClasses[insight.type as keyof typeof colorClasses]}`}>
                <div className="flex items-start gap-2">
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{insight.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ CORREÇÃO: Debug info para desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-3 bg-gray-100 rounded-lg border">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h5>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              original: { positive_pct, neutral_pct, negative_pct },
              processed: { positive, neutral, negative },
              normalized: { normalizedPositive, normalizedNeutral, normalizedNegative },
              total,
              insights: insights.length
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}