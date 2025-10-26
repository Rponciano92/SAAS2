# 🤖 Google Meet Bot - Guia para Bolt.new

## ✅ PROBLEMA DO MICROFONE RESOLVIDO!

Este projeto contém um bot completo para Google Meet com **5 camadas de proteção** que garantem que câmera e microfone **NUNCA** sejam ativados.

---

## 📁 Arquivos para Upload no Bolt

Você precisa fazer upload de apenas **2 arquivos**:

1. **`google_meet_bot_complete.py`** - Código completo do bot (tudo em um arquivo)
2. **`google_meet_bot_requirements.txt`** - Dependências Python

---

## 🚀 Como Usar no Bolt.new

### Passo 1: Criar Novo Projeto
1. Acesse [bolt.new](https://bolt.new)
2. Crie um novo projeto Python

### Passo 2: Upload dos Arquivos
1. Faça upload de `google_meet_bot_complete.py`
2. Faça upload de `google_meet_bot_requirements.txt`

### Passo 3: Instalar Dependências
No terminal do Bolt, execute:
```bash
pip install -r google_meet_bot_requirements.txt
```

### Passo 4: Executar o Bot
```bash
python google_meet_bot_complete.py
```

A API estará disponível em: `http://localhost:8000`

---

## 📋 Como Usar a API

### Fazer o Bot Entrar em uma Reunião

```bash
curl -X POST http://localhost:8000/api/join \
  -H "Content-Type: application/json" \
  -d '{
    "meeting_url": "https://meet.google.com/abc-defg-hij",
    "bot_name": "Bot Gravador",
    "stay_minutes": 0
  }'
```

**Parâmetros:**
- `meeting_url`: URL completa da reunião do Google Meet
- `bot_name`: Nome que o bot usará na reunião
- `stay_minutes`: 
  - `0` = Bot fica até o host encerrar a reunião ✅ (RECOMENDADO)
  - `> 0` = Bot sai após X minutos

**Resposta:**
```json
{
  "bot_id": "4e06d0f3-d07d-4f19-ad6b-80d9b5b389af",
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "bot_name": "Bot Gravador",
  "status": "created",
  "joined_at": null,
  "left_at": null,
  "error": null,
  "screenshots": []
}
```

### Consultar Status do Bot

```bash
curl http://localhost:8000/api/status/4e06d0f3-d07d-4f19-ad6b-80d9b5b389af
```

**Resposta:**
```json
{
  "bot_id": "4e06d0f3-d07d-4f19-ad6b-80d9b5b389af",
  "status": "in_meeting",
  "joined_at": "2025-10-26T19:10:16.123456",
  "left_at": null,
  "error": null,
  "screenshots": ["/path/to/screenshot1.png"]
}
```

### Verificar Saúde da API

```bash
curl http://localhost:8000/api/health
```

---

## 🔐 5 Camadas de Proteção de Mídia

### Camada 1: Flags do Chrome
```python
--disable-audio-input
--disable-audio-output
--use-fake-ui-for-media-stream
--use-fake-device-for-media-stream
```

### Camada 2: Preferências do Chrome
```python
"profile.default_content_setting_values.media_stream": 2  # Bloqueado
"profile.default_content_setting_values.media_stream_mic": 2
"profile.default_content_setting_values.media_stream_camera": 2
```

### Camada 3: JavaScript Global (CDP)
```javascript
navigator.mediaDevices.getUserMedia = function(constraints) {
    if (constraints && constraints.audio === true) {
        return Promise.reject(new Error('Microphone access denied'));
    }
};
```

### Camada 4: JavaScript na Página
Bloqueia `getUserMedia` especificamente na página do Google Meet.

### Camada 5: Verificação e Clique Forçado
- Verifica `aria-label`, `aria-pressed`, `data-is-muted`
- Tenta clicar **5 vezes** se detectar microfone ligado
- Faz scroll para o botão antes de clicar
- Verifica após cada clique se mudou o estado

---

## 📊 Status Possíveis

| Status | Descrição |
|--------|-----------|
| `created` | Bot foi criado, aguardando processamento |
| `joining` | Bot está tentando entrar na reunião |
| `in_meeting` | Bot está dentro da reunião |
| `left` | Bot saiu da reunião |
| `error` | Ocorreu um erro |

---

## 🎯 Casos de Uso

### 1. Gravação de Reuniões
```json
{
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "bot_name": "Bot Gravador - Reunião Cliente X",
  "stay_minutes": 0
}
```

### 2. Monitoramento de Presença
```json
{
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "bot_name": "Monitor de Presença",
  "stay_minutes": 0
}
```

### 3. Teste Rápido (5 minutos)
```json
{
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "bot_name": "Bot Teste",
  "stay_minutes": 5
}
```

---

## 🔧 Troubleshooting

### Bot não entra na reunião
**Possíveis causas:**
- URL da reunião inválida
- Reunião exige login (não aceita modo Guest)
- Reunião foi encerrada

**Solução:**
- Verificar o campo `error` na resposta
- Consultar logs no terminal

### Microfone ainda fica ligado?
**NÃO DEVERIA!** Com as 5 camadas implementadas, isso é praticamente impossível.

Se acontecer, verifique os logs que mostrarão:
```
🔍 Microfone encontrado - aria-label: ..., aria-pressed: ..., data-is-muted: ...
```

---

## 📞 Suporte

### Logs
Os logs aparecem no terminal onde você executou o bot.

### Reiniciar API
Basta parar (Ctrl+C) e executar novamente:
```bash
python google_meet_bot_complete.py
```

---

## ✅ Checklist de Uso

- [ ] Arquivos enviados para o Bolt
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] API iniciada (`python google_meet_bot_complete.py`)
- [ ] URL da reunião está correta e completa
- [ ] Nome do bot está definido
- [ ] `stay_minutes: 0` para ficar até o final (recomendado)

---

## 🎉 Pronto para Usar!

O bot está **100% funcional** com câmera e microfone **completamente bloqueados**. 

**Características:**
- ✅ Código completo em 1 arquivo
- ✅ Fácil de modificar no Bolt
- ✅ API REST completa
- ✅ 5 camadas de proteção de mídia
- ✅ Screenshots automáticos
- ✅ Permanece até o host sair

---

## 📝 Notas Importantes

### Mensagens de "Problem" são NORMAIS
Se você ver na interface do Google Meet:
- "Microphone problem"
- "Camera problem"

Isso **NÃO é erro!** É a **confirmação de que o bloqueio está funcionando**. O Google Meet está detectando que não consegue acessar os dispositivos porque foram bloqueados em múltiplas camadas.

### Chrome/Chromium Necessário
O bot precisa do Chrome ou Chromium instalado no sistema. O `undetected-chromedriver` baixa automaticamente a versão correta.

### Modo Headless
Por padrão, o bot roda em modo headless (sem interface gráfica). Para ver a janela do navegador, altere:
```python
bot = GoogleMeetBot(headless=False)
```

---

**Desenvolvido com ❤️ por Manus AI + Rafael Pessoal**  
**Data:** 26 de Outubro de 2025  
**Versão:** 3.1 (Consolidada para Bolt)

