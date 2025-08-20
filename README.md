# Aether AI - Plataforma de Consultoria

Uma plataforma premium de consultoria com IA para potencializar resultados empresariais.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Design System customizado
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Deployment**: Netlify

## 📦 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização e configure o projeto
5. Aguarde a criação do banco de dados

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. No painel do Supabase, vá em **Settings > API**
3. Copie a **Project URL** e **anon public key**
4. Cole no arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

## 🔑 Como Obter API Key do Fireflies.ai

1. Acesse [https://app.fireflies.ai/integrations/custom/api](https://app.fireflies.ai/integrations/custom/api)
2. Faça login na sua conta Fireflies.ai
3. Clique em "Generate API Key"
4. Copie a chave gerada
5. Cole no arquivo `.env` substituindo `your_actual_fireflies_api_key_here`

**Importante:** A API key deve ser válida e não expirada para funcionar corretamente.

### 3. Criar Tabelas no Banco

Execute os seguintes comandos SQL no **SQL Editor** do Supabase:

```sql
-- Tabela de empresas
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  setor TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  faturamento TEXT NOT NULL,
  website TEXT,
  telefone_contato TEXT NOT NULL,
  email_contato TEXT NOT NULL,
  cargo_contato TEXT NOT NULL,
  desafios TEXT NOT NULL,
  objetivos TEXT NOT NULL,
  mercado_atuacao TEXT,
  necessidades TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'concluido')),
  progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de stakeholders
CREATE TABLE stakeholders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  email TEXT NOT NULL,
  funcao TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de gamificação do usuário
CREATE TABLE user_gamification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_level INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  monthly_points INTEGER DEFAULT 0,
  weekly_points INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]',
  streaks JSONB DEFAULT '{}',
  ranking JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_companies_setor ON companies(setor);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_created_at ON companies(created_at);
CREATE INDEX idx_stakeholders_company_id ON stakeholders(company_id);

-- RLS (Row Level Security)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajuste conforme necessário)
CREATE POLICY "Allow all operations on companies" ON companies FOR ALL USING (true);
CREATE POLICY "Allow all operations on stakeholders" ON stakeholders FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_gamification" ON user_gamification FOR ALL USING (true);
```

## 🛠️ Instalação e Execução

1. **Instalar dependências**:
```bash
npm install
```

2. **Configurar variáveis de ambiente** (veja seção Supabase acima)

3. **Executar em desenvolvimento**:
```bash
npm run dev
```

4. **Build para produção**:
```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── hooks/              # Custom hooks (incluindo Supabase)
├── lib/                # Configurações e utilitários
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API (Supabase)
├── types/              # Definições de tipos TypeScript
└── data/               # Dados mock (para desenvolvimento)
```

## 🔧 Funcionalidades Implementadas

- ✅ Conexão com Supabase
- ✅ CRUD de empresas
- ✅ Gestão de stakeholders
- ✅ Sistema de gamificação
- ✅ Dashboard interativo
- ✅ Design system premium

## 🚀 Deploy

O projeto está configurado para deploy automático no Netlify. As variáveis de ambiente devem ser configuradas no painel do Netlify.

## 📝 Próximos Passos

1. Configurar autenticação de usuários
2. Implementar Edge Functions para lógica de negócio
3. Adicionar sistema de notificações em tempo real
4. Integrar com APIs externas (Google Meet, etc.)

## 🤝 Contribuição

Este é um projeto privado. Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.