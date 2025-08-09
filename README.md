# BarberPro Frontend

Sistema de gestão para barbearias desenvolvido em Next.js com TypeScript, focado no mercado angolano.

## 🚀 Funcionalidades

- **Autenticação completa** - Login e registro de usuários
- **Dashboard interativo** - Métricas em tempo real e visão geral do negócio
- **Gestão de agendamentos** - Criação, edição, cancelamento e acompanhamento
- **Gestão de clientes** - Cadastro e histórico completo
- **Gestão de barbeiros** - Perfis e especializações
- **Gestão de serviços** - Catálogo de serviços e preços
- **Controle financeiro** - Relatórios e métricas de faturamento
- **Interface responsiva** - Otimizada para mobile e desktop
- **Design moderno** - UI/UX intuitiva com Tailwind CSS

## 🛠️ Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP
- **date-fns** - Manipulação de datas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend BarberPro rodando (ver [README do backend](../README.md))

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd barberpro-backend/barberpro-frontend
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

O frontend estará disponível em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── (auth)/            # Rotas de autenticação
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de registro
│   ├── appointments/      # Gestão de agendamentos
│   ├── dashboard/         # Dashboard principal
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── layout/           # Layouts específicos
│   └── appointment/      # Componentes de agendamento
└── lib/                  # Utilitários e configurações
    ├── api.ts            # Cliente da API
    ├── auth-context.tsx  # Contexto de autenticação
    └── utils.ts          # Funções utilitárias
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

- **Login**: `/login` - Autenticação de usuários
- **Registro**: `/register` - Criação de novas contas
- **Proteção de rotas**: Layout autenticado para páginas privadas
- **Persistência**: Tokens armazenados no localStorage

## 📱 Páginas Principais

### Dashboard (`/dashboard`)
- Métricas em tempo real
- Agendamentos do dia
- Resumo financeiro
- Ações rápidas

### Agendamentos (`/appointments`)
- Lista de todos os agendamentos
- Filtros avançados (data, status, barbeiro)
- Ações em lote
- Busca por cliente/telefone

### Detalhes do Agendamento (`/appointments/[id]`)
- Informações completas
- Histórico de mudanças
- Ações de status
- Dados financeiros

## 🎨 Design System

O projeto usa um design system consistente baseado em:

- **Cores**: Paleta laranja/marrom (tema barbearia)
- **Tipografia**: Inter (sans-serif)
- **Componentes**: shadcn/ui + Tailwind CSS
- **Ícones**: Lucide React
- **Responsividade**: Mobile-first

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas de linting
npm run type-check   # Verifica tipos TypeScript
npm run format       # Formata código com Prettier
```

## 🌐 Configuração para Produção

1. **Build do projeto**
```bash
npm run build
```

2. **Configure as variáveis de ambiente de produção**
```env
NEXT_PUBLIC_API_URL=https://api.barberpro.ao
```

3. **Deploy**
O projeto pode ser deployado em:
- Vercel (recomendado)
- Netlify
- AWS Amplify
- Qualquer servidor Node.js

## 🔗 Integração com Backend

O frontend se comunica com o backend através da API REST:

- **Base URL**: Configurada em `NEXT_PUBLIC_API_URL`
- **Autenticação**: JWT Bearer Token
- **Interceptors**: Refresh automático de tokens
- **Tratamento de erros**: Centralizado no cliente Axios

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm run test
npm run test:watch
```

## 📊 Performance

O projeto é otimizado para:

- **Conexões lentas**: Lazy loading e code splitting
- **Mobile**: Interface responsiva e touch-friendly
- **SEO**: Meta tags e estrutura semântica
- **Acessibilidade**: ARIA labels e navegação por teclado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

- **Documentação**: [docs.barberpro.ao](https://docs.barberpro.ao)
- **Email**: suporte@barberpro.ao
- **Issues**: GitHub Issues

## 🚀 Roadmap

- [ ] App mobile nativo
- [ ] Notificações push
- [ ] Integração com WhatsApp
- [ ] Sistema de fidelidade
- [ ] Relatórios avançados
- [ ] Integração com gateways de pagamento
