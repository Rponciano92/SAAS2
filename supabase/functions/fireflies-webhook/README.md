# Fireflies.ai Edge Function

Esta Edge Function integra o Aether AI com a API do Fireflies.ai para gravação e transcrição automática de reuniões.

## 🚀 Deploy no Supabase

### 1. Configurar Variáveis de Ambiente

No painel do Supabase, vá em **Settings > Edge Functions** e adicione:

```bash
FIREFLIES_API_KEY=sua_api_key_do_fireflies_aqui
```

### 2. Deploy da Function

```bash
supabase functions deploy fireflies-webhook
```

### 3. Configurar Webhook no Fireflies

No painel do Fireflies.ai, configure o webhook para:
```
https://seu-projeto.supabase.co/functions/v1/fireflies-webhook/webhook
```

## 📡 Endpoints Disponíveis

### POST `/join-meeting`
Instrui a IA a entrar em uma reunião ao vivo.

**Body:**
```json
{
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "title": "Reunião Estratégica",
  "language": "pt-BR",
  "attendees": [
    {
      "name": "João Silva",
      "email": "joao@empresa.com"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "IA instruída a entrar na reunião com sucesso!",
  "instructions": [
    "O bot Fireflies.ai entrará na reunião automaticamente",
    "Aguarde 1-3 minutos para o bot aparecer",
    "Aceite o bot quando ele solicitar entrada"
  ]
}
```

### GET `/transcription-status?id=TRANSCRIPTION_ID`
Verifica o status de uma transcrição.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "transcription_id",
    "status": "completed",
    "title": "Reunião Estratégica",
    "transcript": "Texto da transcrição...",
    "summary": "Resumo da reunião...",
    "keywords": ["estratégia", "crescimento", "metas"]
  }
}
```

### GET `/transcriptions?limit=50`
Lista todas as transcrições.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "transcription_1",
      "title": "Reunião Estratégica",
      "status": "completed",
      "summary": "Resumo...",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### POST `/webhook`
Endpoint para receber webhooks do Fireflies.ai (configuração automática).

## 🔧 Como Usar no Frontend

```typescript
// Instruir IA a entrar na reunião
const response = await fetch(`${SUPABASE_URL}/functions/v1/fireflies-webhook/join-meeting`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    title: 'Reunião Estratégica',
    language: 'pt-BR'
  })
});

const result = await response.json();
console.log(result.message);
```

## 🛡️ Segurança

- ✅ CORS configurado para permitir requisições do frontend
- ✅ Validação de parâmetros obrigatórios
- ✅ Tratamento de erros robusto
- ✅ API Key protegida como variável de ambiente
- ✅ Logs detalhados para debugging

## 📝 Eventos de Webhook Suportados

- `transcription.completed` - Transcrição finalizada
- `transcription.failed` - Falha na transcrição
- `upload.completed` - Upload finalizado
- `upload.failed` - Falha no upload

## 🔍 Debugging

Para ver os logs da function:
```bash
supabase functions logs fireflies-webhook
```

## 📞 Suporte

Se tiver problemas:
1. Verifique se a API Key está configurada corretamente
2. Confirme se o webhook está configurado no Fireflies.ai
3. Verifique os logs da Edge Function
4. Teste os endpoints individualmente